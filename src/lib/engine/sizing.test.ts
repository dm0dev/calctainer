import { describe, expect, it } from 'vitest';
import { analyzeScenario } from './analyze';
import { CATALOGS } from './catalog';
import { defaultAssumptions, newCluster, newGuidedWorkload, newWorkload, sampleScenario } from './defaults';
import { applyGuided, AVAILABILITY, CPU_BUSY, GROWTH, MEM_BUSY, normalizeGuided, roundStep, translateGuided } from './guided';
import { allocatable } from './nodes';
import { daemonOverhead, recommendPools } from './recommend';
import type { Assumptions, Availability, Busy, Growth, GuidedProfile, Scenario } from './types';

const catalog = CATALOGS[0].types;
const allIds = catalog.map((t) => t.id);
const base = defaultAssumptions(allIds);
const only = (id: string, over: Partial<Assumptions> = {}): Assumptions => ({ ...base, allowedTypeIds: [id], ...over });
const profile = (over: Partial<GuidedProfile> = {}): GuidedProfile => ({
	vcpu: 4,
	ramGiB: 8,
	cpuBusy: 'medium',
	memBusy: 'medium',
	availability: 'high',
	instances: 1,
	diskGiB: 0,
	growth: 'some',
	...over
});
const onGrid = (v: number, step: number) => Math.abs(v / step - Math.round(v / step)) < 1e-9;
const decimals = (v: number) => (String(v).split('.')[1] ?? '').length;

function scenarioWith(ws: (clusterId: string) => Scenario['workloads'], over: Partial<Assumptions> = {}): Scenario {
	const c = newCluster('c1');
	const s = sampleScenario();
	return { ...s, clusters: [c], workloads: ws(c.id), scenarioQuota: {}, assumptions: { ...s.assumptions, ...over } };
}

describe('guided workload sizing — reference profiles', () => {
	it.each([
		{
			name: 'default profile: 1 VM, should stay up',
			p: profile(),
			want: { replicas: 2, maxReplicas: 3, cpuRequest: 0.9, cpuLimit: 2, memRequestGiB: 3.375, memLimitGiB: 4.75, antiAffinity: 'preferred', storageGiB: 0 }
		},
		{
			name: 'web: 2 VMs, mostly idle, large spikes',
			p: profile({ vcpu: 2, ramGiB: 4, cpuBusy: 'low', availability: 'high', instances: 2, growth: 'burst' }),
			want: { replicas: 2, maxReplicas: 6, cpuRequest: 0.4, cpuLimit: 2, memRequestGiB: 2.75, memLimitGiB: 4, antiAffinity: 'preferred', storageGiB: 0 }
		},
		{
			name: 'database: 1 VM, must never stop, disk',
			p: profile({ vcpu: 4, ramGiB: 16, memBusy: 'high', availability: 'critical', diskGiB: 200, growth: 'none' }),
			want: { replicas: 3, maxReplicas: 3, cpuRequest: 0.6, cpuLimit: 1.3, memRequestGiB: 8.625, memLimitGiB: 9.625, antiAffinity: 'required', storageGiB: 200 }
		},
		{
			name: 'batch: 2 busy VMs, can be down briefly',
			p: profile({ vcpu: 4, ramGiB: 4, cpuBusy: 'high', memBusy: 'low', availability: 'basic', instances: 2, growth: 'burst' }),
			want: { replicas: 2, maxReplicas: 6, cpuRequest: 3, cpuLimit: 4, memRequestGiB: 2, memLimitGiB: 4, antiAffinity: 'none', storageGiB: 0 }
		},
		{
			name: 'many VMs keep one copy per VM',
			p: profile({ vcpu: 8, ramGiB: 32, cpuBusy: 'medium', memBusy: 'medium', availability: 'critical', instances: 5, growth: 'some' }),
			want: { replicas: 5, maxReplicas: 8, cpuRequest: 3.6, cpuLimit: 8, memRequestGiB: 22.375, memLimitGiB: 32, antiAffinity: 'required', storageGiB: 0 }
		}
	])('$name', ({ p, want }) => {
		const t = translateGuided(p);
		expect({
			replicas: t.replicas,
			maxReplicas: t.maxReplicas,
			cpuRequest: t.cpuRequest,
			cpuLimit: t.cpuLimit,
			memRequestGiB: t.memRequestGiB,
			memLimitGiB: t.memLimitGiB,
			antiAffinity: t.antiAffinity,
			storageGiB: t.storageGiB
		}).toEqual(want);
	});
});

describe('guided workload sizing — invariants over every option', () => {
	const busy: Busy[] = ['low', 'medium', 'high'];
	const avail: Availability[] = ['basic', 'high', 'critical'];
	const growth: Growth[] = ['none', 'some', 'burst'];
	const cases: GuidedProfile[] = [];
	for (const vcpu of [0.25, 1, 2, 3, 4, 6, 8, 16, 64])
		for (const ramGiB of [0.25, 1, 4, 12, 64, 256])
			for (const cpuBusy of busy)
				for (const memBusy of busy)
					for (const availability of avail)
						for (const instances of [1, 2, 3, 7])
							for (const g of growth) cases.push({ vcpu, ramGiB, cpuBusy, memBusy, availability, instances, diskGiB: 0, growth: g });

	it('produces finite, grid-aligned, non-noisy values with limits ≥ requests', () => {
		for (const p of cases) {
			const t = translateGuided(p);
			for (const v of [t.replicas, t.maxReplicas, t.cpuRequest, t.cpuLimit, t.memRequestGiB, t.memLimitGiB]) expect(Number.isFinite(v)).toBe(true);
			expect(onGrid(t.cpuRequest, 0.05)).toBe(true);
			expect(onGrid(t.memRequestGiB, 0.125)).toBe(true);
			expect(decimals(t.cpuRequest)).toBeLessThanOrEqual(2);
			expect(decimals(t.cpuLimit)).toBeLessThanOrEqual(2);
			expect(decimals(t.memRequestGiB)).toBeLessThanOrEqual(3);
			expect(decimals(t.memLimitGiB)).toBeLessThanOrEqual(3);
			expect(t.cpuRequest).toBeGreaterThanOrEqual(0.05);
			expect(t.memRequestGiB).toBeGreaterThanOrEqual(0.125);
			expect(t.cpuLimit).toBeGreaterThanOrEqual(t.cpuRequest);
			expect(t.memLimitGiB).toBeGreaterThanOrEqual(t.memRequestGiB);
		}
	});

	it('honours availability: minimum copies and anti-affinity', () => {
		for (const p of cases) {
			const t = translateGuided(p);
			expect(t.replicas).toBe(Math.max(p.instances, AVAILABILITY[p.availability].minReplicas));
			expect(t.antiAffinity).toBe(AVAILABILITY[p.availability].anti);
		}
	});

	it('scales the HPA maximum by the growth factor', () => {
		for (const p of cases) {
			const t = translateGuided(p);
			expect(t.maxReplicas).toBe(Math.max(t.replicas, Math.ceil(t.replicas * GROWTH[p.growth].factor)));
			if (p.growth === 'none') expect(t.maxReplicas).toBe(t.replicas);
			else expect(t.maxReplicas).toBeGreaterThan(t.replicas);
		}
	});

	it('preserves the VM CPU usage across copies (within rounding)', () => {
		for (const p of cases) {
			const t = translateGuided(p);
			const perCopy = (p.vcpu * CPU_BUSY[p.cpuBusy] * p.instances) / t.replicas;
			expect(Math.abs(t.cpuRequest - Math.max(0.05, perCopy))).toBeLessThanOrEqual(0.025 + 1e-9);
		}
	});

	it('keeps at least 60 % of the VM memory baseline in each extra availability copy', () => {
		for (const p of cases) {
			const t = translateGuided(p);
			const share = Math.max(p.instances / t.replicas, 0.6);
			const expected = p.ramGiB * MEM_BUSY[p.memBusy] * share;
			expect(Math.abs(t.memRequestGiB - Math.max(0.125, expected))).toBeLessThanOrEqual(0.0625 + 1e-9);
		}
	});

	it('is monotonic in VM size and busyness', () => {
		const at = (o: Partial<GuidedProfile>) => translateGuided(profile(o));
		expect(at({ vcpu: 8 }).cpuRequest).toBeGreaterThan(at({ vcpu: 4 }).cpuRequest);
		expect(at({ ramGiB: 16 }).memRequestGiB).toBeGreaterThan(at({ ramGiB: 8 }).memRequestGiB);
		expect(at({ cpuBusy: 'high' }).cpuRequest).toBeGreaterThan(at({ cpuBusy: 'medium' }).cpuRequest);
		expect(at({ cpuBusy: 'medium' }).cpuRequest).toBeGreaterThan(at({ cpuBusy: 'low' }).cpuRequest);
		expect(at({ memBusy: 'high' }).memRequestGiB).toBeGreaterThan(at({ memBusy: 'low' }).memRequestGiB);
	});
});

describe('guided workload sizing — edge cases', () => {
	it('rounds without floating-point noise', () => {
		expect(roundStep(1.2, 0.1)).toBe(1.2);
		expect(roundStep(0.7 * 3, 0.05)).toBe(2.1);
		expect(translateGuided(profile({ vcpu: 1.2, availability: 'basic' })).cpuLimit).toBe(1.2);
		expect(translateGuided(profile({ vcpu: 3, availability: 'basic', cpuBusy: 'high' })).cpuRequest).toBe(2.25);
	});

	it('never goes below one rounding step for tiny VMs', () => {
		const t = translateGuided(profile({ vcpu: 0.25, ramGiB: 0.25, cpuBusy: 'low', memBusy: 'low', availability: 'critical' }));
		expect(t.cpuRequest).toBe(0.05);
		expect(t.memRequestGiB).toBe(0.125);
	});

	it('rounds fractional VM counts to whole copies', () => {
		expect(translateGuided(profile({ instances: 2.6, availability: 'basic' })).replicas).toBe(3);
		expect(translateGuided(profile({ instances: 4, availability: 'critical' })).replicas).toBe(4);
	});

	it('reports and repairs invalid input instead of producing NaN or negative storage', () => {
		const bad = { ...profile(), vcpu: Number.NaN, ramGiB: -4, instances: 0, diskGiB: -10, availability: 'nope' as Availability, growth: 'x' as Growth };
		const n = normalizeGuided(bad);
		expect(n.adjusted.length).toBe(6);
		const t = translateGuided(bad);
		for (const v of [t.replicas, t.maxReplicas, t.cpuRequest, t.cpuLimit, t.memRequestGiB, t.memLimitGiB, t.storageGiB]) expect(Number.isFinite(v)).toBe(true);
		expect(t.storageGiB).toBe(0);
		expect(t.replicas).toBe(2);
		expect(t.maxReplicas).toBe(2);
		expect(t.explain.some((l) => l.startsWith('Adjusted invalid input'))).toBe(true);
	});

	it('does not report adjustments for valid input', () => {
		expect(normalizeGuided(profile()).adjusted).toEqual([]);
		expect(translateGuided(profile()).explain.some((l) => l.startsWith('Adjusted'))).toBe(false);
	});

	it('applyGuided writes the translation and picks StatefulSet only when storage is requested', () => {
		const w = newWorkload('c', { guided: profile({ diskGiB: 20 }), kind: 'DaemonSet' });
		applyGuided(w);
		const t = translateGuided(w.guided!);
		expect(w).toMatchObject({ replicas: t.replicas, maxReplicas: t.maxReplicas, cpuRequest: t.cpuRequest, cpuLimit: t.cpuLimit, memRequestGiB: t.memRequestGiB, memLimitGiB: t.memLimitGiB, storageGiB: 20, antiAffinity: t.antiAffinity, kind: 'StatefulSet' });
		w.guided!.diskGiB = 0;
		applyGuided(w);
		expect(w.kind).toBe('Deployment');
	});

	it('applyGuided leaves Kubernetes-defined workloads untouched', () => {
		const w = newWorkload('c', { cpuRequest: 1.23, replicas: 7 });
		const before = { ...w };
		applyGuided(w);
		expect(w).toEqual(before);
	});
});

describe('automatic pool sizing', () => {
	const type = catalog.find((t) => t.id === 'g.8x32')!;
	const a = only('g.8x32');
	const perNode = () => {
		const alloc = allocatable(type, a);
		const ds = daemonOverhead('workers', [], a);
		return { cpu: alloc.cpu * a.targetUtilization - ds.cpu, mem: alloc.mem * a.targetUtilization - ds.mem };
	};

	it('computes the node count from usable capacity, spare and minimum pool size', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 10, maxReplicas: 10, cpuRequest: 1, memRequestGiB: 2, antiAffinity: 'none' })];
		const [p] = recommendPools(c, ws, a, catalog);
		const podsPerNode = Math.min(Math.floor(perNode().cpu / 1), Math.floor(perNode().mem / 2));
		const expectedBase = Math.ceil(10 / podsPerNode);
		expect(p.type.id).toBe('g.8x32');
		expect(p.nodesBase).toBe(expectedBase);
		expect(p.nodes).toBe(Math.max(expectedBase + a.spareNodes, a.minNodesPerPool));
		expect(p.autoscaling).toBe(false);
		expect(p.maxNodes).toBe(p.nodes);
	});

	it('enables autoscaling up to the HPA peak and can size for peak instead', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 10, maxReplicas: 20, cpuRequest: 1, memRequestGiB: 2, antiAffinity: 'none' })];
		const [p] = recommendPools(c, ws, a, catalog);
		expect(p.nodesPeak).toBeGreaterThan(p.nodesBase);
		expect(p.autoscaling).toBe(true);
		expect(p.minNodes).toBe(p.nodesBase + a.spareNodes);
		expect(p.maxNodes).toBe(p.nodesPeak + a.spareNodes);
		const [peak] = recommendPools(c, ws, { ...a, sizeFor: 'peak' }, catalog);
		expect(peak.nodes).toBe(p.nodesPeak + a.spareNodes);
		expect(peak.autoscaling).toBe(false);
	});

	it('applies spare nodes and the minimum pool size', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 1, cpuRequest: 0.1, memRequestGiB: 0.1, antiAffinity: 'none' })];
		expect(recommendPools(c, ws, { ...a, spareNodes: 0, minNodesPerPool: 1 }, catalog)[0].nodes).toBe(1);
		expect(recommendPools(c, ws, { ...a, spareNodes: 2, minNodesPerPool: 1 }, catalog)[0].nodes).toBe(3);
		expect(recommendPools(c, ws, { ...a, spareNodes: 0, minNodesPerPool: 4 }, catalog)[0].nodes).toBe(4);
	});

	it('keeps the minimum pool for an empty hosted cluster', () => {
		const c = newCluster('c');
		const pools = recommendPools(c, [], a, catalog);
		expect(pools.map((p) => p.name)).toEqual(['workers']);
		expect(pools[0].nodesBase).toBe(0);
		expect(pools[0].nodes).toBe(a.minNodesPerPool);
	});

	it('needs one node per replica for required anti-affinity', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 5, maxReplicas: 5, cpuRequest: 0.1, memRequestGiB: 0.1, antiAffinity: 'required' })];
		expect(recommendPools(c, ws, a, catalog)[0].nodesBase).toBe(5);
	});

	it('needs more nodes when the target utilisation drops', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 30, maxReplicas: 30, cpuRequest: 1, memRequestGiB: 2, antiAffinity: 'none' })];
		const high = recommendPools(c, ws, { ...a, targetUtilization: 0.9 }, catalog)[0].nodesBase;
		const low = recommendPools(c, ws, { ...a, targetUtilization: 0.5 }, catalog)[0].nodesBase;
		expect(low).toBeGreaterThan(high);
	});

	it('accounts for DaemonSet and platform overhead on every node', () => {
		const c = newCluster('c');
		const app = newWorkload(c.id, { replicas: 20, maxReplicas: 20, cpuRequest: 1, memRequestGiB: 1, antiAffinity: 'none' });
		const ds = newWorkload(c.id, { kind: 'DaemonSet', cpuRequest: 1.5, memRequestGiB: 1 });
		const without = recommendPools(c, [app], a, catalog)[0].nodesBase;
		const withDs = recommendPools(c, [app, ds], a, catalog)[0];
		expect(withDs.daemonPerNode.cpu).toBeCloseTo(1.5 + a.platformCpuPerNode, 9);
		expect(withDs.nodesBase).toBeGreaterThan(without);
	});

	it('respects a feasible pin and explains an infeasible one', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 4, cpuRequest: 6, memRequestGiB: 4, antiAffinity: 'none' })];
		c.pins = { workers: 'g.16x64' };
		expect(recommendPools(c, ws, base, catalog)[0].type.id).toBe('g.16x64');
		c.pins = { workers: 'g.4x16' };
		const p = recommendPools(c, ws, base, catalog)[0];
		expect(p.type.id).not.toBe('g.4x16');
		expect(p.pinned).toBe(false);
		expect(p.explanation.some((e) => e.includes('Pinned type g.4x16 cannot host'))).toBe(true);
	});

	it('fewest-nodes objective never needs more nodes than the cost objective', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 24, maxReplicas: 24, cpuRequest: 1, memRequestGiB: 3, antiAffinity: 'none' })];
		const cost = recommendPools(c, ws, { ...base, objective: 'cost' }, catalog)[0];
		const fewest = recommendPools(c, ws, { ...base, objective: 'fewest-nodes' }, catalog)[0];
		expect(fewest.nodes).toBeLessThanOrEqual(cost.nodes);
		expect(fewest.costPerMonth).toBeGreaterThan(0);
	});

	it('recommended pools schedule every baseline and peak pod', () => {
		for (const sizeFor of ['baseline', 'peak'] as const) {
			const s = scenarioWith(
				(id) => [
					newWorkload(id, { name: 'api', replicas: 6, maxReplicas: 12, cpuRequest: 0.75, memRequestGiB: 1.5, antiAffinity: 'preferred' }),
					newWorkload(id, { name: 'db', kind: 'StatefulSet', pool: 'db', replicas: 3, cpuRequest: 2, memRequestGiB: 12, storageGiB: 100, antiAffinity: 'required' }),
					newWorkload(id, { name: 'agent', kind: 'DaemonSet', cpuRequest: 0.1, memRequestGiB: 0.25 }),
					newGuidedWorkload(id, 'erp', profile({ vcpu: 8, ramGiB: 32, availability: 'critical', growth: 'burst' }))
				],
				{ sizeFor }
			);
			const r = analyzeScenario(s).clusters[0];
			expect(r.sim.unscheduled).toHaveLength(0);
			expect(r.peak.unscheduled).toHaveLength(0);
			expect(r.headroom.every((h) => h.hpaFits)).toBe(true);
		}
	});

	it('guided sizing flows into scheduled requests end to end', () => {
		const s = scenarioWith((id) => [newGuidedWorkload(id, 'legacy', profile({ vcpu: 4, ramGiB: 16, availability: 'critical', growth: 'none' }))]);
		const w = s.workloads[0];
		const r = analyzeScenario(s).clusters[0];
		const pods = r.sim.nodes.flatMap((n) => n.pods).filter((p) => p.workloadId === w.id);
		expect(pods).toHaveLength(3);
		expect(new Set(pods.map((p) => r.sim.nodes.find((n) => n.pods.includes(p))!.id)).size).toBe(3);
		expect(pods.every((p) => p.cpu === w.cpuRequest && p.mem === w.memRequestGiB)).toBe(true);
	});
});
