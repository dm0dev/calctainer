import { instanceCost, isDaemon, podFor, podsFor } from './nodes';
import { DEFAULT_POOL, manualPools, minNodes, recommendPools, toPoolSpec } from './recommend';
import { automaticQuota, DEFAULT_QUOTA_HEADROOM_PCT, QUOTA_CPU_STEP, QUOTA_MEMORY_STEP, quotaHeadroomPct } from './quotas';
import { buildNodes, canPlace, cloneNodes, makeNode, pickNode, place, schedule, scheduleWithAutoscale, type PoolSpec } from './scheduler';
import type {
	Assumptions,
	ClusterResult,
	FailureTest,
	Finding,
	Footprint,
	Fragmentation,
	HostedCluster,
	InstanceType,
	Mode,
	PodSpec,
	PoolResult,
	Quota,
	QuotaLine,
	Res,
	Scenario,
	ScenarioResult,
	SavingsResult,
	SimNode,
	SimResult,
	Totals,
	Workload,
	WorkloadHeadroom
} from './types';

const HEADROOM_CAP = 200;
const pct = (v: number) => `${Math.round(v * 100)}%`;
const r1 = (v: number) => Math.round(v * 10) / 10;

export function nodeUtil(n: SimNode): Res {
	return {
		cpu: n.allocatable.cpu > 0 ? (n.daemon.cpu + n.used.cpu) / n.allocatable.cpu : 0,
		mem: n.allocatable.mem > 0 ? (n.daemon.mem + n.used.mem) / n.allocatable.mem : 0
	};
}

function baselinePods(workloads: Workload[]): PodSpec[] {
	return workloads.filter((w) => w.enabled && !isDaemon(w)).flatMap((w) => podsFor(w, w.replicas));
}

function peakPods(workloads: Workload[]): PodSpec[] {
	return workloads.filter((w) => w.enabled && !isDaemon(w)).flatMap((w) => podsFor(w, Math.max(w.replicas, w.maxReplicas || 0)));
}

function headroomFor(w: Workload, sim: SimResult, specs: PoolSpec[], a: Assumptions, workloads: Workload[], key: string): WorkloadHeadroom {
	const want = Math.max(0, (w.maxReplicas || 0) - w.replicas);
	const cap = Math.max(want, Math.min(HEADROOM_CAP, w.replicas * 10 + 10));
	const fixed = cloneNodes(sim.nodes);
	let extraOnCurrent = 0;
	for (let i = 0; i < cap; i++) {
		const pod = podFor(w, w.replicas + i);
		const n = pickNode(fixed, pod, a.strategy);
		if (!n) break;
		place(n, pod);
		extraOnCurrent++;
	}
	let extraWithAutoscale = extraOnCurrent;
	const canGrow = specs.some((s) => s.maxNodes > s.nodes);
	if (canGrow && extraOnCurrent < cap) {
		const grow = cloneNodes(sim.nodes);
		const counts: Record<string, number> = {};
		for (const n of grow) counts[n.pool] = (counts[n.pool] ?? 0) + 1;
		extraWithAutoscale = 0;
		for (let i = 0; i < cap; i++) {
			const pod = podFor(w, w.replicas + i);
			let n = pickNode(grow, pod, a.strategy);
			if (!n) {
				for (const s of specs) {
					const c = counts[s.name] ?? 0;
					if (c >= s.maxNodes) continue;
					const fresh = makeNode(`${key}${s.name}-${c + 1}`, s, a, workloads);
					if (!canPlace(fresh, pod)) continue;
					grow.push(fresh);
					counts[s.name] = c + 1;
					n = fresh;
					break;
				}
			}
			if (!n) break;
			place(n, pod);
			extraWithAutoscale++;
		}
	}
	return {
		workloadId: w.id,
		name: w.name,
		replicas: w.replicas,
		maxReplicas: Math.max(w.replicas, w.maxReplicas || 0),
		extraOnCurrent,
		extraWithAutoscale,
		hpaFits: extraWithAutoscale >= want,
		capped: extraWithAutoscale >= cap
	};
}

function failureTests(sim: SimResult, a: Assumptions): FailureTest[] {
	const out: FailureTest[] = [];
	const pools = [...new Set(sim.nodes.map((n) => n.pool))];
	for (const pool of pools) {
		const inPool = sim.nodes.filter((n) => n.pool === pool);
		if (!inPool.length) continue;
		const victim = [...inPool].sort((x, y) => y.used.cpu + y.used.mem / 4 - (x.used.cpu + x.used.mem / 4))[0];
		const rest = cloneNodes(sim.nodes.filter((n) => n !== victim));
		const res = schedule(rest, victim.pods, a.strategy);
		out.push({ pool, nodeId: victim.id, displaced: victim.pods.length, stranded: res.unscheduled.length });
	}
	return out;
}

/** Nodes a manual pool could drop while its currently placed pods still fit at target utilisation plus spare. */
function removable(pools: PoolResult[], sim: SimResult, workloads: Workload[], a: Assumptions): Record<string, number> {
	const out: Record<string, number> = {};
	for (const p of pools) {
		if (p.source !== 'manual' || sim.unscheduled.length) {
			out[p.name] = 0;
			continue;
		}
		const pods = sim.nodes.filter((n) => n.pool === p.name).flatMap((n) => n.pods);
		const need = minNodes(pods, toPoolSpec(p), a, workloads);
		if (need == null) {
			out[p.name] = 0;
			continue;
		}
		const keep = Math.max(need + a.spareNodes, a.minNodesPerPool);
		out[p.name] = Math.max(0, p.nodes - keep);
	}
	return out;
}

export function fragmentation(sim: SimResult, workloads: Workload[]): Fragmentation {
	const pods = sim.nodes.flatMap((n) => n.pods);
	const tot = pods.reduce((acc, p) => ({ cpu: acc.cpu + p.cpu, mem: acc.mem + p.mem }), { cpu: 0, mem: 0 });
	const demandRatio = tot.cpu > 0 ? tot.mem / tot.cpu : 4;
	const avgPod = (ps: PodSpec[]): Res | null =>
		ps.length
			? { cpu: Math.max(0.01, ps.reduce((s, p) => s + p.cpu, 0) / ps.length), mem: Math.max(0.01, ps.reduce((s, p) => s + p.mem, 0) / ps.length) }
			: null;
	const active = workloads.filter((w) => w.enabled && !isDaemon(w) && w.replicas > 0);
	const refPod: Res = avgPod(pods) ?? (active.length ? { cpu: active[0].cpuRequest || 0.5, mem: active[0].memRequestGiB || 1 } : { cpu: 0.5, mem: 1 });
	let freeCpu = 0,
		freeMem = 0,
		strandedCpu = 0,
		strandedMem = 0,
		refSlots = 0,
		idealSlots = 0;
	// Evaluate per pool: each pool is judged against the typical pod it actually hosts.
	for (const pool of new Set(sim.nodes.map((n) => n.pool))) {
		const nodes = sim.nodes.filter((n) => n.pool === pool);
		const ref = avgPod(nodes.flatMap((n) => n.pods)) ?? refPod;
		const ratio = (() => {
			const ps = nodes.flatMap((n) => n.pods);
			const c = ps.reduce((s, p) => s + p.cpu, 0);
			return c > 0 ? ps.reduce((s, p) => s + p.mem, 0) / c : demandRatio;
		})();
		let pc = 0,
			pm = 0;
		for (const n of nodes) {
			const fc = Math.max(0, n.allocatable.cpu - n.daemon.cpu - n.used.cpu);
			const fm = Math.max(0, n.allocatable.mem - n.daemon.mem - n.used.mem);
			pc += fc;
			pm += fm;
			strandedCpu += Math.max(0, fc - fm / ratio);
			strandedMem += Math.max(0, fm - fc * ratio);
			const slotsLeft = Math.max(0, n.maxPods - n.pods.length - n.daemonPods.length);
			refSlots += Math.min(Math.floor(fc / ref.cpu + 1e-9), Math.floor(fm / ref.mem + 1e-9), slotsLeft);
		}
		freeCpu += pc;
		freeMem += pm;
		idealSlots += Math.min(Math.floor(pc / ref.cpu + 1e-9), Math.floor(pm / ref.mem + 1e-9));
	}
	return { demandRatio, freeCpu, freeMem, strandedCpu, strandedMem, refPod, refSlots, idealSlots, index: idealSlots > 0 ? Math.max(0, 1 - refSlots / idealSlots) : 0 };
}

function totalsFor(sim: SimResult, pools: PoolResult[], workloads: Workload[], a: Assumptions): Totals {
	const t: Totals = { nodes: 0, vcpu: 0, memGiB: 0, allocCpu: 0, allocMem: 0, reqCpu: 0, reqMem: 0, limCpu: 0, limMem: 0, storageGiB: 0, pods: 0, cost: 0 };
	const byId = new Map(workloads.map((w) => [w.id, w]));
	for (const n of sim.nodes) {
		t.nodes++;
		t.vcpu += n.capacity.cpu;
		t.memGiB += n.capacity.mem;
		t.allocCpu += n.allocatable.cpu;
		t.allocMem += n.allocatable.mem;
		const user = [...n.pods, ...n.daemonPods.filter((p) => p.workloadId !== '__platform__')];
		for (const p of user) {
			t.reqCpu += p.cpu;
			t.reqMem += p.mem;
			t.limCpu += p.cpuLim;
			t.limMem += p.memLim;
			t.storageGiB += byId.get(p.workloadId)?.storageGiB ?? 0;
			t.pods++;
		}
	}
	for (const p of sim.unscheduled) {
		t.reqCpu += p.cpu;
		t.reqMem += p.mem;
		t.limCpu += p.cpuLim;
		t.limMem += p.memLim;
		t.storageGiB += byId.get(p.workloadId)?.storageGiB ?? 0;
		t.pods++;
	}
	t.cost = pools.reduce((s, p) => s + p.nodes * instanceCost(p.type, a), 0);
	return t;
}

export function quotaLines(q: Quota, t: Totals, headroomPct = DEFAULT_QUOTA_HEADROOM_PCT): QuotaLine[] {
	if (q.auto !== undefined && typeof q.auto !== 'boolean') throw new Error('Automatic quota calculation must be true or false.');
	const line = (resource: QuotaLine['resource'], quota: number | null | undefined, nodes: number, requests: number, limits: number): QuotaLine => {
		if (quota != null && (!Number.isFinite(quota) || quota < 0))
			throw new Error(`${resource} quota must be a non-negative number or empty.`);
		const used = nodes;
		const cap = q.auto && resource !== 'storage'
			? automaticQuota(used, resource === 'cpu' ? QUOTA_CPU_STEP : QUOTA_MEMORY_STEP, headroomPct)
			: quota;
		const qq = cap != null && Number.isFinite(cap) && cap >= 0 ? cap : null;
		return { resource, quota: qq, nodes, requests, limits, used, pct: qq == null ? null : qq === 0 ? (used > 0 ? Infinity : 0) : used / qq };
	};
	return [
		line('cpu', q.cpu, t.vcpu, t.reqCpu, t.limCpu),
		line('mem', q.memGiB, t.memGiB, t.reqMem, t.limMem),
		{ ...line('storage', q.storageGiB, t.storageGiB, t.storageGiB, t.storageGiB) }
	];
}

function quotaFindings(lines: QuotaLine[], clusterId: string | null, scope: string, automatic = false): Finding[] {
	const out: Finding[] = [];
	const unit = { cpu: 'vCPU', mem: 'GiB memory', storage: 'GiB storage' } as const;
	for (const l of lines) {
		if (l.pct == null || l.quota == null) continue;
		const id = `quota-${clusterId ?? 'scenario'}-${l.resource}`;
		const u = unit[l.resource];
		if (automatic && l.resource !== 'storage') continue;
		const basisLabel = l.resource === 'storage' ? 'peak PVC requests' : 'peak worker-VM capacity';
		const consumption = l.quota === 0 ? 'no allowance' : pct(l.pct);
		if (l.pct > 1)
			out.push({
				id,
				severity: 'critical',
				category: 'quota',
				clusterId,
				title: `${scope}: ${u} quota exceeded (${consumption})`,
				detail: `${r1(l.used)} ${u} (${basisLabel}) against a quota of ${l.quota}.`,
				plain: `You are planning to use more than your allowance of ${u}.`,
				action: l.resource === 'storage'
					? 'Raise the storage quota or reduce peak PVC requests; VM disks are not modelled.'
					: 'Raise the quota or revise the worker pool composition and autoscaling maximum; check workload fit again.'
			});
		else if (l.pct > 0.85)
			out.push({
				id,
				severity: 'warning',
				category: 'quota',
				clusterId,
				title: `${scope}: ${u} quota nearly exhausted (${pct(l.pct)})`,
				detail: `${r1(l.used)} of ${l.quota} ${u} (${basisLabel}). Little room for growth or rolling updates.`,
				plain: `Almost all of your ${u} allowance is used.`
			});
		else if (l.pct < 0.3)
			out.push({
				id,
				severity: 'info',
				category: 'over',
				clusterId,
				title: `${scope}: ${u} quota largely unused (${pct(l.pct)})`,
				detail: `Only ${r1(l.used)} of ${l.quota} ${u} (${basisLabel}) planned. The quota could be lowered and re-assigned.`,
				plain: `You reserved much more ${u} than you plan to use.`
			});
	}
	return out;
}

function clusterFindings(
	c: HostedCluster,
	workloads: Workload[],
	pools: PoolResult[],
	sim: SimResult,
	peak: SimResult,
	failures: FailureTest[],
	headroom: WorkloadHeadroom[],
	frag: Fragmentation,
	rem: Record<string, number>,
	a: Assumptions
): Finding[] {
	const f: Finding[] = [];
	const cid = c.id;
	const byId = new Map(workloads.map((w) => [w.id, w]));

	if (sim.unscheduled.length) {
		const names = [...new Set(sim.unscheduled.map((p) => byId.get(p.workloadId)?.name ?? p.workloadId))];
		const poolNames = new Set(pools.map((p) => p.name));
		const missing = [...new Set(sim.unscheduled.map((p) => p.pool).filter((p) => p && !poolNames.has(p)))];
		f.push({
			id: `unsched-${cid}`,
			severity: 'critical',
			category: 'under',
			clusterId: cid,
			title: `${sim.unscheduled.length} pod(s) cannot be scheduled`,
			detail: `Pending pods from: ${names.join(', ')}.${missing.length ? ` No node pool named ${missing.map((m) => `"${m}"`).join(', ')} exists.` : ''}`,
			plain: 'Some copies of your apps would not start because there is no server with enough free room.',
			action: missing.length ? 'Create the missing node pool or clear the placement target.' : 'Add nodes, use larger instance types or reduce requests.'
		});
	}
	if (!pools.some((p) => !p.dedicated) && workloads.some((w) => w.enabled && !isDaemon(w) && !w.pool?.trim()))
		f.push({
			id: `nogeneral-${cid}`,
			severity: 'critical',
			category: 'under',
			clusterId: cid,
			title: 'No general (non-dedicated) node pool',
			detail: 'Workloads without a placement target need at least one non-dedicated pool.',
			action: 'Add a non-dedicated node pool.'
		});

	for (const p of pools) {
		const nodes = sim.nodes.filter((n) => n.pool === p.name);
		if (!nodes.length) continue;
		const alloc = nodes.reduce((s, n) => ({ cpu: s.cpu + n.allocatable.cpu, mem: s.mem + n.allocatable.mem }), { cpu: 0, mem: 0 });
		const used = nodes.reduce((s, n) => ({ cpu: s.cpu + n.daemon.cpu + n.used.cpu, mem: s.mem + n.daemon.mem + n.used.mem }), { cpu: 0, mem: 0 });
		const lims = nodes.reduce((s, n) => ({ cpu: s.cpu + n.limits.cpu, mem: s.mem + n.limits.mem }), { cpu: 0, mem: 0 });
		const uc = alloc.cpu ? used.cpu / alloc.cpu : 0;
		const um = alloc.mem ? used.mem / alloc.mem : 0;
		const hot = Math.max(uc, um);
		if (hot > a.targetUtilization + 0.02)
			f.push({
				id: `hot-${cid}-${p.name}`,
				severity: hot > 0.95 ? 'critical' : 'warning',
				category: 'under',
				clusterId: cid,
				title: `Pool "${p.name}" is ${pct(hot)} allocated (target ${pct(a.targetUtilization)})`,
				detail: `CPU ${pct(uc)}, memory ${pct(um)} of allocatable requested. Rolling updates, HPA scale-out and node drains have little room.`,
				plain: 'These servers are nearly full; there is little room for growth or maintenance.',
				action: 'Add nodes or enable autoscaling.'
			});
		const low = Math.max(uc, um);
		if (low < a.underUtilizedThreshold && nodes.length > a.minNodesPerPool)
			f.push({
				id: `cold-${cid}-${p.name}`,
				severity: 'warning',
				category: 'over',
				clusterId: cid,
				title: `Pool "${p.name}" is only ${pct(low)} allocated`,
				detail: `CPU ${pct(uc)}, memory ${pct(um)} of allocatable requested across ${nodes.length} nodes.${rem[p.name] ? ` ${rem[p.name]} node(s) could be removed while keeping target utilisation and spare capacity.` : ''}`,
				plain: 'You are paying for servers that mostly sit idle.',
				action: rem[p.name] ? `Reduce the pool by ${rem[p.name]} node(s) or use a smaller instance type.` : 'Use a smaller instance type.'
			});
		else if (rem[p.name] > 0 && p.source === 'manual')
			f.push({
				id: `rem-${cid}-${p.name}`,
				severity: 'info',
				category: 'over',
				clusterId: cid,
				title: `Pool "${p.name}" could shrink by ${rem[p.name]} node(s)`,
				detail: `Workloads still fit at ${pct(a.targetUtilization)} target utilisation with ${a.spareNodes} spare node(s).`,
				action: `Reduce replicas of pool "${p.name}" to ${p.nodes - rem[p.name]}.`
			});
		if (alloc.mem && lims.mem / alloc.mem > a.memLimitOvercommitWarn)
			f.push({
				id: `memlim-${cid}-${p.name}`,
				severity: 'warning',
				category: 'under',
				clusterId: cid,
				title: `Memory limits overcommit pool "${p.name}" (${r1(lims.mem / alloc.mem)}×)`,
				detail: `Sum of memory limits ${r1(lims.mem)} GiB vs ${r1(alloc.mem)} GiB allocatable. If many pods burst simultaneously, the kernel OOM-kills containers or kubelet evicts pods.`,
				plain: 'If all apps use their maximum memory at once, some would be stopped.',
				action: 'Set memory limits closer to requests for critical workloads.'
			});
		if (alloc.cpu && lims.cpu / alloc.cpu > a.cpuLimitOvercommitWarn)
			f.push({
				id: `cpulim-${cid}-${p.name}`,
				severity: 'info',
				category: 'under',
				clusterId: cid,
				title: `CPU limits overcommit pool "${p.name}" (${r1(lims.cpu / alloc.cpu)}×)`,
				detail: `Sum of CPU limits ${r1(lims.cpu)} vs ${r1(alloc.cpu)} cores allocatable. Simultaneous bursts lead to CPU throttling (not failures).`,
				plain: 'At busy moments apps may get slower because they share CPU.'
			});
		const ratio = p.type.memoryGiB / p.type.vcpu;
		if (Math.abs(uc - um) > 0.3 && Math.max(uc, um) > 0.5)
			f.push({
				id: `imbal-${cid}-${p.name}`,
				severity: 'warning',
				category: 'fragmentation',
				clusterId: cid,
				title: `Pool "${p.name}" is ${uc > um ? 'CPU' : 'memory'}-bound (CPU ${pct(uc)} / mem ${pct(um)})`,
				detail: `Workloads request ~${r1(frag.demandRatio)} GiB per core but ${p.type.name} offers ${r1(ratio)} GiB per vCPU. The unused ${uc > um ? 'memory' : 'CPU'} is stranded.`,
				plain: `The servers run out of ${uc > um ? 'processor power' : 'memory'} long before the other resource is used.`,
				action: `Choose a ${uc > um ? 'compute-optimised' : 'memory-optimised'} instance family.`
			});
	}

	if (frag.index > 0.25 && frag.idealSlots >= 2)
		f.push({
			id: `frag-${cid}`,
			severity: 'warning',
			category: 'fragmentation',
			clusterId: cid,
			title: `Free capacity is fragmented (${pct(frag.index)})`,
			detail: `Free capacity would fit ${frag.idealSlots} typical pods (${r1(frag.refPod.cpu)} CPU / ${r1(frag.refPod.mem)} GiB) in theory, but only ${frag.refSlots} fit on actual nodes.`,
			plain: 'There is free room overall, but it is scattered in pieces too small to be useful.'
		});
	if (frag.strandedCpu > 2 || frag.strandedMem > 8)
		f.push({
			id: `strand-${cid}`,
			severity: 'info',
			category: 'fragmentation',
			clusterId: cid,
			title: `Stranded capacity: ${r1(frag.strandedCpu)} cores / ${r1(frag.strandedMem)} GiB`,
			detail: `Free resources that cannot be consumed at the workloads' current CPU:memory ratio (${r1(frag.demandRatio)} GiB/core).`
		});

	for (const ft of failures) {
		if (ft.stranded > 0)
			f.push({
				id: `fail-${cid}-${ft.pool}`,
				severity: 'warning',
				category: 'resilience',
				clusterId: cid,
				title: `Losing node ${ft.nodeId} strands ${ft.stranded} pod(s)`,
				detail: `${ft.displaced} pod(s) would be rescheduled from the busiest node in pool "${ft.pool}"; ${ft.stranded} find no room. Upgrades drain nodes one by one and hit the same limit.`,
				plain: 'If one server fails or is updated, some apps would not restart elsewhere.',
				action: 'Add a spare node to this pool or relax required anti-affinity.'
			});
	}

	for (const h of headroom) {
		if (h.maxReplicas > h.replicas && !h.hpaFits)
			f.push({
				id: `hpa-${cid}-${h.workloadId}`,
				severity: 'warning',
				category: 'under',
				clusterId: cid,
				title: `${h.name}: HPA max ${h.maxReplicas} not reachable`,
				detail: `Only +${h.extraWithAutoscale} replica(s) fit (current ${h.replicas}) even after autoscaling pools to their max.`,
				plain: 'At peak times this app cannot grow as much as you want.',
				action: 'Raise the pool autoscaling maximum or use larger nodes.'
			});
	}
	if (peak.unscheduled.length && !sim.unscheduled.length)
		f.push({
			id: `peak-${cid}`,
			severity: 'warning',
			category: 'under',
			clusterId: cid,
			title: `${peak.unscheduled.length} pod(s) pending at peak`,
			detail: `When every workload runs at its HPA maximum, ${peak.unscheduled.length} pod(s) stay Pending even with autoscaling.`
		});

	for (const w of workloads) {
		if (!w.enabled) continue;
		if (!isDaemon(w) && w.replicas === 1 && w.antiAffinity === 'none')
			f.push({
				id: `single-${w.id}`,
				severity: 'info',
				category: 'resilience',
				clusterId: cid,
				title: `${w.name} runs a single replica`,
				detail: 'A node drain or failure causes downtime until the pod is rescheduled.',
				plain: 'Only one copy runs, so it will be briefly unavailable during server maintenance.'
			});
		if (w.cpuRequest <= 0 || w.memRequestGiB <= 0)
			f.push({
				id: `noreq-${w.id}`,
				severity: 'warning',
				category: 'hygiene',
				clusterId: cid,
				title: `${w.name} has no ${w.cpuRequest <= 0 ? 'CPU' : 'memory'} request`,
				detail: 'BestEffort/Burstable pods without requests are invisible to the scheduler and first to be evicted.'
			});
		if (w.memLimitGiB == null)
			f.push({
				id: `nomemlim-${w.id}`,
				severity: 'info',
				category: 'hygiene',
				clusterId: cid,
				title: `${w.name} has no memory limit`,
				detail: 'The pod may grow up to the node memory. Limit totals in this plan count its request instead.'
			});
		if (w.cpuLimit != null && w.cpuRequest > 0 && w.cpuLimit / w.cpuRequest > 4)
			f.push({
				id: `burst-${w.id}`,
				severity: 'info',
				category: 'hygiene',
				clusterId: cid,
				title: `${w.name}: CPU limit is ${r1(w.cpuLimit / w.cpuRequest)}× the request`,
				detail: 'Very bursty pods depend on idle neighbours; performance becomes unpredictable when nodes are busy.'
			});
		const largest = pools.find((p) => (w.pool?.trim() ? p.name === w.pool.trim() : !p.dedicated));
		if (largest && !isDaemon(w)) {
			const usable = largest.allocatablePerNode;
			if (w.cpuRequest > usable.cpu * 0.5 || w.memRequestGiB > usable.mem * 0.5)
				f.push({
					id: `bigpod-${w.id}`,
					severity: 'info',
					category: 'fragmentation',
					clusterId: cid,
					title: `${w.name} pods use over half a ${largest.type.name} node`,
					detail: 'Large pods leave hard-to-use gaps and make rescheduling after node loss harder.'
				});
		}
		if (w.cpuRequest > 0 && w.memRequestGiB > 0 && w.cpuLimit != null && w.memLimitGiB != null && w.cpuLimit < w.cpuRequest)
			f.push({ id: `limlt-${w.id}`, severity: 'warning', category: 'hygiene', clusterId: cid, title: `${w.name}: CPU limit below request`, detail: 'Kubernetes rejects pods whose limit is lower than the request.' });
		if (w.memLimitGiB != null && w.memLimitGiB < w.memRequestGiB)
			f.push({ id: `mlimlt-${w.id}`, severity: 'warning', category: 'hygiene', clusterId: cid, title: `${w.name}: memory limit below request`, detail: 'Kubernetes rejects pods whose limit is lower than the request.' });
	}
	return f;
}

export function analyzeCluster(c: HostedCluster, allWorkloads: Workload[], a: Assumptions, catalog: InstanceType[]): ClusterResult {
	const workloads = allWorkloads.filter((w) => w.clusterId === c.id);
	const active = workloads.filter((w) => w.enabled);
	const pools = c.poolMode === 'manual' ? manualPools(c, active, a, catalog) : recommendPools(c, active, a, catalog);
	const specs = pools.map(toPoolSpec);
	const key = '';
	const sim = schedule(buildNodes(specs, a, active, key), baselinePods(active), a.strategy);
	const peak = scheduleWithAutoscale(buildNodes(specs, a, active, key), peakPods(active), specs, a, active, key);
	const failures = failureTests(sim, a);
	const headroom = active.filter((w) => !isDaemon(w)).map((w) => headroomFor(w, sim, specs, a, active, key));
	const frag = fragmentation(sim, active);
	const rem = removable(pools, sim, active, a);
	const totals = totalsFor(sim, pools, active, a);
	// Account for every VM at the pool maximum, including spare nodes, not just nodes the peak scheduler used.
	// Unplaced peak pods still contribute demand/PVCs, so insufficient capacity never hides storage demand.
	const quotaTotals = totalsFor({
		nodes: buildNodes(specs.map((p) => ({ ...p, nodes: p.maxNodes })), a, active, key),
		unscheduled: peakPods(active)
	}, pools, active, a);
	quotaTotals.cost = pools.reduce((sum, p) => sum + p.maxNodes * instanceCost(p.type, a), 0);
	const quota = quotaLines(c.quota, quotaTotals, quotaHeadroomPct(a));
	const findings = [
		...clusterFindings(c, active, pools, sim, peak, failures, headroom, frag, rem, a),
		...quotaFindings(quota, c.id, c.name, c.quota.auto)
	];
	return { clusterId: c.id, name: c.name, pools, sim, peak, failures, totals, quotaTotals, quota, headroom, fragmentation: frag, findings, removableNodes: rem };
}

const footprint = (nodes: number, type: InstanceType | undefined, a: Assumptions): Footprint =>
	type ? { nodes, vcpu: nodes * type.vcpu, memGiB: nodes * type.memoryGiB, cost: nodes * instanceCost(type, a) } : { nodes: 0, vcpu: 0, memGiB: 0, cost: 0 };

const addF = (x: Footprint, y: Footprint): Footprint => ({ nodes: x.nodes + y.nodes, vcpu: x.vcpu + y.vcpu, memGiB: x.memGiB + y.memGiB, cost: x.cost + y.cost });
const ZERO: Footprint = { nodes: 0, vcpu: 0, memGiB: 0, cost: 0 };

export function savings(s: Scenario, clusters: ClusterResult[]): SavingsResult {
	const a = s.assumptions;
	const cb = s.classic;
	const hcp = clusters.reduce((acc, c) => addF(acc, { nodes: c.totals.nodes, vcpu: c.totals.vcpu, memGiB: c.totals.memGiB, cost: c.totals.cost }), ZERO);
	const find = (id: string) => s.catalog.find((t) => t.id === id);
	const breakdown: SavingsResult['classicBreakdown'] = { 'control-plane': { ...ZERO }, infra: { ...ZERO }, worker: { ...ZERO } };
	const notes: string[] = [
		'Hosted control planes run on the management cluster, which is outside the scope of this plan. Savings are gross savings of the hosted clusters\u2019 data plane.'
	];
	if (cb.mode === 'manual') {
		for (const g of cb.inventory) breakdown[g.role] = addF(breakdown[g.role], footprint(Math.max(0, g.count), find(g.instanceTypeId), a));
		notes.push('Classic footprint taken from the entered inventory.');
	} else {
		const n = cb.classicClusters > 0 ? cb.classicClusters : s.clusters.length;
		breakdown['control-plane'] = footprint(n * cb.controlPlaneNodes, find(cb.controlPlaneTypeId), a);
		breakdown.infra = footprint(n * cb.infraNodes, find(cb.infraTypeId), a);
		const k = 1 + Math.max(0, cb.workerOverheadPct) / 100;
		breakdown.worker = { nodes: Math.ceil(hcp.nodes * k), vcpu: hcp.vcpu * k, memGiB: hcp.memGiB * k, cost: hcp.cost * k };
		notes.push(
			`Classic footprint derived: ${n} classic cluster(s) × (${cb.controlPlaneNodes} control-plane + ${cb.infraNodes} infra nodes) plus the HCP worker capacity${cb.workerOverheadPct ? ` +${cb.workerOverheadPct}% classic worker overhead` : ''}.`
		);
	}
	const classic = addF(addF(breakdown['control-plane'], breakdown.infra), breakdown.worker);
	const saved: Footprint = { nodes: classic.nodes - hcp.nodes, vcpu: classic.vcpu - hcp.vcpu, memGiB: classic.memGiB - hcp.memGiB, cost: classic.cost - hcp.cost };
	const ratio = (x: number, y: number) => (y > 0 ? x / y : 0);
	return {
		enabled: cb.enabled,
		classic,
		classicBreakdown: breakdown,
		hcp,
		saved,
		pct: { nodes: ratio(saved.nodes, classic.nodes), vcpu: ratio(saved.vcpu, classic.vcpu), memGiB: ratio(saved.memGiB, classic.memGiB), cost: ratio(saved.cost, classic.cost) },
		notes
	};
}

export function analyzeScenario(s: Scenario, mode: Mode = 'expert'): ScenarioResult {
	const assumptions = mode === 'expert' ? s.assumptions : { ...s.assumptions, memLimitOvercommitWarn: 1 };
	const clusters = s.clusters.map((c) => analyzeCluster(c, s.workloads, assumptions, s.catalog));
	const totals = clusters.reduce<Totals>(
		(t, c) => {
			for (const k of Object.keys(t) as (keyof Totals)[]) t[k] += c.totals[k];
			return t;
		},
		{ nodes: 0, vcpu: 0, memGiB: 0, allocCpu: 0, allocMem: 0, reqCpu: 0, reqMem: 0, limCpu: 0, limMem: 0, storageGiB: 0, pods: 0, cost: 0 }
	);
	const quotaTotals = clusters.reduce<Totals>((t, c) => {
		for (const k of Object.keys(t) as (keyof Totals)[]) t[k] += c.quotaTotals[k];
		return t;
	}, { nodes: 0, vcpu: 0, memGiB: 0, allocCpu: 0, allocMem: 0, reqCpu: 0, reqMem: 0, limCpu: 0, limMem: 0, storageGiB: 0, pods: 0, cost: 0 });
	const headroomPct = quotaHeadroomPct(s.assumptions);
	const quota = quotaLines(s.scenarioQuota, quotaTotals, headroomPct);
	if (s.scenarioQuota.auto) {
		// Each cluster needs its own rounded allowance; the scenario must accommodate their sum.
		for (const line of quota) {
			if (line.resource === 'storage') continue;
			const step = line.resource === 'cpu' ? QUOTA_CPU_STEP : QUOTA_MEMORY_STEP;
			line.quota = clusters.reduce((sum, c) =>
				sum + automaticQuota(line.resource === 'cpu' ? c.quotaTotals.vcpu : c.quotaTotals.memGiB, step, headroomPct), 0);
			line.pct = line.quota > 0 ? line.used / line.quota : 0;
		}
	}
	const clusterQuotaSum = clusters.reduce(
		(acc, c) => ({ cpu: acc.cpu + (c.quota[0].quota ?? 0), mem: acc.mem + (c.quota[1].quota ?? 0), st: acc.st + (c.quota[2].quota ?? 0) }),
		{ cpu: 0, mem: 0, st: 0 }
	);
	const findings: Finding[] = [...quotaFindings(quota, null, 'Scenario', s.scenarioQuota.auto)];
	const sq = { cpu: quota[0].quota, memGiB: quota[1].quota, storageGiB: quota[2].quota };
	const over = [
		sq.cpu != null && clusterQuotaSum.cpu > sq.cpu ? `CPU ${clusterQuotaSum.cpu}/${sq.cpu}` : '',
		sq.memGiB != null && clusterQuotaSum.mem > sq.memGiB ? `memory ${clusterQuotaSum.mem}/${sq.memGiB} GiB` : '',
		sq.storageGiB != null && clusterQuotaSum.st > sq.storageGiB ? `storage ${clusterQuotaSum.st}/${sq.storageGiB} GiB` : ''
	].filter(Boolean);
	if (over.length)
		findings.push({
			id: 'quota-overcommit',
			severity: 'info',
			category: 'quota',
			clusterId: null,
			title: 'Hosted-cluster quotas overcommit the scenario quota',
			detail: `Sum of per-cluster quotas exceeds the scenario total: ${over.join(', ')}. Fine if clusters never peak together.`
		});
	for (const c of clusters) findings.push(...c.findings);
	if (!s.workloads.some((w) => w.enabled))
		findings.push({ id: 'empty', severity: 'info', category: 'hygiene', clusterId: null, title: 'No workloads yet', detail: 'Add workloads to get a sizing recommendation.' });
	const order = { critical: 0, warning: 1, info: 2, ok: 3 } as const;
	findings.sort((x, y) => order[x.severity] - order[y.severity]);
	return { clusters, totals, quotaTotals, quota, findings, savings: savings(s, clusters) };
}

export { DEFAULT_POOL };
