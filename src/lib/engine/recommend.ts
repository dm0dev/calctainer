import { allocatable, daemonSetsFor, instanceCost, isDaemon, platformPod, podsFor, sumRes } from './nodes';
import { buildNodes, schedule, type PoolSpec } from './scheduler';
import type { Assumptions, Candidate, HostedCluster, InstanceType, PodSpec, PoolResult, Res, Workload } from './types';

export const DEFAULT_POOL = 'workers';
const MAX_NODES = 1000;

export interface PoolGroup {
	name: string;
	dedicated: boolean;
	workloads: Workload[];
}

/** Auto mode: one pool per placement target. Workloads without a target share the general "workers" pool. */
export function poolGroups(workloads: Workload[]): PoolGroup[] {
	const map = new Map<string, PoolGroup>();
	for (const w of workloads) {
		if (!w.enabled || isDaemon(w)) continue;
		const name = w.pool?.trim() || DEFAULT_POOL;
		if (!map.has(name)) map.set(name, { name, dedicated: name !== DEFAULT_POOL, workloads: [] });
		map.get(name)!.workloads.push(w);
	}
	if (!map.has(DEFAULT_POOL)) map.set(DEFAULT_POOL, { name: DEFAULT_POOL, dedicated: false, workloads: [] });
	return [...map.values()].sort((x, y) => (x.name === DEFAULT_POOL ? -1 : y.name === DEFAULT_POOL ? 1 : x.name.localeCompare(y.name)));
}

/** Per-node DaemonSet overhead (platform + user DaemonSets) for a pool. */
export function daemonOverhead(pool: string, workloads: Workload[], a: Assumptions): Res {
	const ds = daemonSetsFor(pool, workloads);
	const pp = platformPod(a);
	const r = sumRes(ds, (w) => ({ cpu: w.cpuRequest || 0, mem: w.memRequestGiB || 0 }));
	return { cpu: r.cpu + pp.cpu, mem: r.mem + pp.mem };
}

function groupPods(g: PoolGroup, peak: boolean): PodSpec[] {
	const pods: PodSpec[] = [];
	for (const w of g.workloads) {
		const reps = peak ? Math.max(w.replicas, w.maxReplicas || 0) : w.replicas;
		for (const p of podsFor(w, reps)) pods.push({ ...p, pool: g.name });
	}
	return pods;
}

function fits(pods: PodSpec[], spec: PoolSpec, n: number, a: Assumptions, workloads: Workload[]): boolean {
	const nodes = buildNodes([{ ...spec, nodes: n }], a, workloads);
	return schedule(nodes, pods, 'binpack', a.targetUtilization).unscheduled.length === 0;
}

/** Smallest node count that fits all pods at the target utilisation (exponential + binary search). */
export function minNodes(pods: PodSpec[], spec: PoolSpec, a: Assumptions, workloads: Workload[]): number | null {
	if (pods.length === 0) return 0;
	const alloc = allocatable(spec.type, a);
	const ds = daemonOverhead(spec.name, workloads, a);
	const capCpu = alloc.cpu * a.targetUtilization - ds.cpu;
	const capMem = alloc.mem * a.targetUtilization - ds.mem;
	const dsPods = daemonSetsFor(spec.name, workloads).length + 1;
	const podSlots = a.maxPodsPerNode - dsPods;
	if (capCpu <= 0 || capMem <= 0 || podSlots <= 0) return null;
	const total = sumRes(pods, (p) => p);
	const req: Record<string, number> = {};
	for (const p of pods) if (p.anti === 'required') req[p.workloadId] = (req[p.workloadId] ?? 0) + 1;
	const lb = Math.max(1, Math.ceil(total.cpu / capCpu - 1e-9), Math.ceil(total.mem / capMem - 1e-9), Math.ceil(pods.length / podSlots), ...Object.values(req));
	if (fits(pods, spec, lb, a, workloads)) return lb;
	let lo = lb;
	let hi = lb * 2;
	while (!fits(pods, spec, hi, a, workloads)) {
		lo = hi;
		hi *= 2;
		if (hi > MAX_NODES) return fits(pods, spec, MAX_NODES, a, workloads) ? MAX_NODES : null;
	}
	while (hi - lo > 1) {
		const mid = Math.floor((lo + hi) / 2);
		if (fits(pods, spec, mid, a, workloads)) hi = mid;
		else lo = mid;
	}
	return hi;
}

export function evaluateType(g: PoolGroup, type: InstanceType, a: Assumptions, workloads: Workload[]): Candidate {
	const base: Candidate = { typeId: type.id, feasible: false, nodesBase: 0, nodesPeak: 0, nodes: 0, cost: Infinity, cpuUtil: 0, memUtil: 0, stranded: 0, score: Infinity };
	const alloc = allocatable(type, a);
	const ds = daemonOverhead(g.name, workloads, a);
	const capCpu = alloc.cpu * a.targetUtilization - ds.cpu;
	const capMem = alloc.mem * a.targetUtilization - ds.mem;
	if (capCpu <= 0 || capMem <= 0) return { ...base, reason: 'DaemonSets alone exceed the usable node capacity' };
	const basePods = groupPods(g, false);
	const peakPods = groupPods(g, true);
	const big = peakPods.find((p) => p.cpu > capCpu + 1e-9 || p.mem > capMem + 1e-9);
	if (big) return { ...base, reason: `Pod ${big.name} (${big.cpu} CPU / ${big.mem} GiB) is larger than a node can offer at ${Math.round(a.targetUtilization * 100)}% fill` };
	const spec: PoolSpec = { name: g.name, dedicated: g.dedicated, type, nodes: 0, maxNodes: 0 };
	const nb = minNodes(basePods, spec, a, workloads);
	const np = minNodes(peakPods, spec, a, workloads);
	if (nb == null || np == null) return { ...base, reason: `Needs more than ${MAX_NODES} nodes` };
	const sizing = a.sizeFor === 'peak' ? np : nb;
	const nodes = Math.max(sizing + a.spareNodes, a.minNodesPerPool);
	const reqs = sumRes(basePods, (p) => p);
	const totCpu = nodes * alloc.cpu;
	const totMem = nodes * alloc.mem;
	const cpuUtil = totCpu > 0 ? (reqs.cpu + ds.cpu * nodes) / totCpu : 0;
	const memUtil = totMem > 0 ? (reqs.mem + ds.mem * nodes) / totMem : 0;
	const stranded = Math.abs(cpuUtil - memUtil);
	const cost = nodes * instanceCost(type, a);
	const score =
		a.objective === 'fewest-nodes' ? nodes * 1e7 + cost : a.objective === 'balanced' ? cost * (1 + 1.5 * stranded) : cost * (1 + 0.1 * stranded);
	return { typeId: type.id, feasible: true, nodesBase: nb, nodesPeak: np, nodes, cost, cpuUtil, memUtil, stranded, score };
}

export function recommendPools(cluster: HostedCluster, workloads: Workload[], a: Assumptions, catalog: InstanceType[]): PoolResult[] {
	const allowed = catalog.filter((t) => a.allowedTypeIds.includes(t.id));
	const types = allowed.length ? allowed : catalog;
	const out: PoolResult[] = [];
	for (const g of poolGroups(workloads)) {
		const candidates = types.map((t) => evaluateType(g, t, a, workloads)).sort((x, y) => (x.feasible === y.feasible ? x.score - y.score : x.feasible ? -1 : 1));
		const pinId = cluster.pins?.[g.name];
		const pinned = pinId ? candidates.find((c) => c.typeId === pinId) : undefined;
		const explanation: string[] = [];
		let chosen = candidates[0];
		if (pinned && pinned.feasible) chosen = pinned;
		else if (pinned && !pinned.feasible) explanation.push(`Pinned type ${pinId} cannot host this pool (${pinned.reason}); falling back to ${chosen?.typeId}.`);
		const type = catalog.find((t) => t.id === chosen?.typeId) ?? types[0];
		const alloc = allocatable(type, a);
		const ds = daemonOverhead(g.name, workloads, a);
		if (!chosen?.feasible) {
			explanation.push(`No instance type in the allowed catalogue can host every pod of this pool. Largest pods must be split or a larger instance type added.`);
			const n = Math.max(a.minNodesPerPool, 1);
			out.push({
				name: g.name,
				dedicated: g.dedicated,
				source: 'recommended',
				type,
				nodes: n,
				autoscaling: false,
				minNodes: n,
				maxNodes: n,
				nodesBase: n,
				nodesPeak: n,
				spare: a.spareNodes,
				allocatablePerNode: alloc,
				daemonPerNode: ds,
				candidates,
				pinned: !!pinned,
				costPerMonth: n * instanceCost(type, a),
				explanation
			});
			continue;
		}
		// nodesBase/nodesPeak are raw requirements; the spare is kept at both ends of the autoscaling range.
		const maxNodes = Math.max(chosen.nodes, chosen.nodesPeak + a.spareNodes);
		const autoscaling = maxNodes > chosen.nodes;
		explanation.push(
			g.workloads.length
				? `${g.workloads.length} workload(s) need ${chosen.nodesBase} node(s) at baseline and ${chosen.nodesPeak} at HPA peak when filled to ${Math.round(a.targetUtilization * 100)}% of allocatable.`
				: `No workloads target this pool yet; keeping the minimum of ${a.minNodesPerPool} node(s) so the hosted cluster can run its own components.`
		);
		if (a.spareNodes > 0) explanation.push(`+${a.spareNodes} spare node(s) so a node failure or upgrade drain does not strand pods.`);
		if (chosen.nodes === a.minNodesPerPool && chosen.nodesBase + a.spareNodes < a.minNodesPerPool) explanation.push(`Raised to the minimum pool size of ${a.minNodesPerPool}.`);
		if (autoscaling) explanation.push(`Enable autoscaling ${chosen.nodes}…${maxNodes} so HPA peaks get capacity${a.spareNodes > 0 ? ' and keep the spare' : ''}.`);
		explanation.push(
			a.objective === 'cost'
				? `${type.name} is the cheapest feasible type.`
				: a.objective === 'balanced'
					? `${type.name} best balances CPU and memory consumption.`
					: `${type.name} needs the fewest nodes.`
		);
		if (g.dedicated) explanation.push(`Dedicated pool: nodes are tainted so only workloads targeting "${g.name}" are placed here.`);
		out.push({
			name: g.name,
			dedicated: g.dedicated,
			source: 'recommended',
			type,
			nodes: chosen.nodes,
			autoscaling,
			minNodes: chosen.nodes,
			maxNodes,
			nodesBase: chosen.nodesBase,
			nodesPeak: chosen.nodesPeak,
			spare: a.spareNodes,
			allocatablePerNode: alloc,
			daemonPerNode: ds,
			candidates,
			pinned: !!pinned && pinned.feasible,
			costPerMonth: chosen.cost,
			explanation
		});
	}
	return out;
}

export function manualPools(cluster: HostedCluster, workloads: Workload[], a: Assumptions, catalog: InstanceType[]): PoolResult[] {
	return cluster.nodePools.map((p) => {
		const type = catalog.find((t) => t.id === p.instanceTypeId) ?? catalog[0];
		const nodes = Math.max(0, Math.floor(p.autoscaling ? p.minReplicas : p.replicas));
		const maxNodes = Math.max(nodes, Math.floor(p.autoscaling ? p.maxReplicas : p.replicas));
		return {
			name: p.name,
			dedicated: p.dedicated,
			source: 'manual' as const,
			type,
			nodes,
			autoscaling: p.autoscaling,
			minNodes: nodes,
			maxNodes,
			nodesBase: nodes,
			nodesPeak: maxNodes,
			spare: 0,
			allocatablePerNode: allocatable(type, a),
			daemonPerNode: daemonOverhead(p.name, workloads, a),
			candidates: [],
			pinned: false,
			costPerMonth: nodes * instanceCost(type, a),
			explanation: [`Manually defined pool: ${nodes} × ${type.name}${p.autoscaling ? `, autoscaling up to ${maxNodes}` : ''}.`]
		};
	});
}

export const toPoolSpec = (p: PoolResult): PoolSpec => ({ name: p.name, dedicated: p.dedicated, type: p.type, nodes: p.nodes, maxNodes: p.maxNodes });
