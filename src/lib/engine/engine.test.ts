import { describe, expect, it } from 'vitest';
import { analyzeScenario } from './analyze';
import { CATALOGS } from './catalog';
import { defaultAssumptions, newCluster, newPool, newWorkload, sampleScenario } from './defaults';
import { translateGuided } from './guided';
import { csvToWorkloads, parseCpu, parseMem, scenarioError, workloadsToCsv } from './io';
import { allocatable, reserved } from './nodes';
import { automaticQuota, QUOTA_CPU_STEP, QUOTA_MEMORY_STEP } from './quotas';
import { recommendPools } from './recommend';
import { buildNodes, schedule } from './scheduler';
import type { Scenario } from './types';

const catalog = CATALOGS[0].types;
const a = defaultAssumptions(catalog.map((t) => t.id));

function scenario(over: Partial<Scenario> = {}): Scenario {
	const c = newCluster('c1');
	return { ...sampleScenario(), clusters: [c], workloads: [], scenarioQuota: {}, ...over };
}

function memoryLimitScenario(memLimitGiB: number, threshold = 1.2): Scenario {
	const s = scenario();
	const c = s.clusters[0];
	c.poolMode = 'manual';
	c.nodePools = [newPool('workers', 'g.4x16', 1)];
	s.assumptions = {
		...a,
		reservedMode: 'fixed',
		reservedCpu: 0,
		reservedMemGiB: 0,
		platformCpuPerNode: 0,
		platformMemPerNodeGiB: 0,
		memLimitOvercommitWarn: threshold
	};
	s.workloads = [newWorkload(c.id, { replicas: 1, maxReplicas: 1, cpuRequest: 0.1, cpuLimit: 0.2, memRequestGiB: 1, memLimitGiB, antiAffinity: 'none' })];
	return s;
}

describe('node model', () => {
	it('auto reserved follows OpenShift tiers', () => {
		const r = reserved({ id: 'x', name: 'x', vcpu: 8, memoryGiB: 32 }, a);
		expect(r.cpu).toBeCloseTo(0.06 + 0.01 + 0.01 + 0.01, 5);
		expect(r.mem).toBeCloseTo(1 + 0.8 + 0.8 + 0.96 + 0.1, 5);
		const al = allocatable({ id: 'x', name: 'x', vcpu: 8, memoryGiB: 32 }, a);
		expect(al.cpu).toBeCloseTo(7.91, 2);
	});
	it('fixed reserved uses configured values', () => {
		const r = reserved({ id: 'x', name: 'x', vcpu: 8, memoryGiB: 32 }, { ...a, reservedMode: 'fixed' });
		expect(r).toEqual({ cpu: 0.5, mem: 1 });
	});
});

describe('scheduler', () => {
	it('honours required anti-affinity', () => {
		const w = newWorkload('c', { replicas: 3, antiAffinity: 'required', cpuRequest: 0.1, memRequestGiB: 0.1 });
		const type = catalog.find((t) => t.id === 'g.16x64')!;
		const nodes = buildNodes([{ name: 'workers', dedicated: false, type, nodes: 2, maxNodes: 2 }], a, [w]);
		const res = schedule(nodes, [0, 1, 2].map((i) => ({ key: `${i}`, workloadId: w.id, name: `p${i}`, index: i, cpu: 0.1, mem: 0.1, cpuLim: 0.1, memLim: 0.1, pool: '', anti: 'required' as const })), 'spread');
		expect(res.unscheduled.length).toBe(1);
		expect(res.nodes.every((n) => n.pods.length === 1)).toBe(true);
	});
	it('spread distributes, binpack concentrates', () => {
		const type = catalog.find((t) => t.id === 'g.16x64')!;
		const pods = [0, 1, 2, 3].map((i) => ({ key: `${i}`, workloadId: `w${i}`, name: `p${i}`, index: 0, cpu: 1, mem: 1, cpuLim: 1, memLim: 1, pool: '', anti: 'none' as const }));
		const spread = schedule(buildNodes([{ name: 'w', dedicated: false, type, nodes: 4, maxNodes: 4 }], a, []), pods, 'spread');
		expect(spread.nodes.filter((n) => n.pods.length > 0).length).toBe(4);
		const pack = schedule(buildNodes([{ name: 'w', dedicated: false, type, nodes: 4, maxNodes: 4 }], a, []), pods, 'binpack');
		expect(pack.nodes.filter((n) => n.pods.length > 0).length).toBe(1);
	});
	it('dedicated pools only accept targeted pods', () => {
		const type = catalog[1];
		const nodes = buildNodes([{ name: 'db', dedicated: true, type, nodes: 2, maxNodes: 2 }], a, []);
		const res = schedule(nodes, [{ key: 'a', workloadId: 'w', name: 'a', index: 0, cpu: 1, mem: 1, cpuLim: 1, memLim: 1, pool: '', anti: 'none' }], 'spread');
		expect(res.unscheduled.length).toBe(1);
	});
});

describe('recommendation', () => {
	it('sizes a pool with spare and min nodes, every pod fits', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 10, maxReplicas: 20, cpuRequest: 1, memRequestGiB: 2, antiAffinity: 'none' })];
		const pools = recommendPools(c, ws, a, catalog);
		expect(pools).toHaveLength(1);
		const p = pools[0];
		expect(p.nodes).toBeGreaterThanOrEqual(p.nodesBase + a.spareNodes);
		expect(p.autoscaling).toBe(true);
		expect(p.maxNodes).toBeGreaterThan(p.nodes);
	});
	it('creates dedicated pools per placement target', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { pool: 'db', replicas: 3, antiAffinity: 'required' }), newWorkload(c.id, {})];
		const pools = recommendPools(c, ws, a, catalog);
		expect(pools.map((p) => p.name)).toEqual(['workers', 'db']);
		expect(pools[1].dedicated).toBe(true);
		expect(pools[1].nodes).toBeGreaterThanOrEqual(3);
	});
	it('reports infeasible when a pod exceeds every type', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { cpuRequest: 100, memRequestGiB: 1, replicas: 1 })];
		const pools = recommendPools(c, ws, a, catalog);
		expect(pools[0].candidates.every((x) => !x.feasible)).toBe(true);
	});
	it('prefers memory-optimised types for memory-heavy workloads', () => {
		const c = newCluster('c');
		const ws = [newWorkload(c.id, { replicas: 12, maxReplicas: 12, cpuRequest: 0.5, memRequestGiB: 12, antiAffinity: 'none' })];
		const pools = recommendPools(c, ws, a, catalog);
		expect(pools[0].type.family).toBe('memory');
	});
});

describe('scenario analysis', () => {
	it('uses a fixed 100% memory-limit warning threshold below Expert', () => {
		expect(defaultAssumptions(catalog.map((t) => t.id)).memLimitOvercommitWarn).toBe(1);
		for (const mode of ['guided', 'standard'] as const) {
			for (const [limit, expected] of [[15.99, false], [16, false], [16.01, true]] as const) {
				const result = analyzeScenario(memoryLimitScenario(limit, 1.2), mode);
				expect(result.findings.some((f) => f.id.startsWith('memlim-'))).toBe(expected);
			}
		}
	});
	it('uses the saved memory-limit warning threshold in Expert', () => {
		for (const [limit, expected] of [[19.19, false], [19.2, false], [19.21, true]] as const) {
			const result = analyzeScenario(memoryLimitScenario(limit, 1.2), 'expert');
			expect(result.findings.some((f) => f.id.startsWith('memlim-'))).toBe(expected);
		}
	});
	it('switches memory warning threshold without changing the saved scenario or scheduling', () => {
		const s = memoryLimitScenario(18, 1.2);
		const saved = JSON.stringify(s);
		const expert = analyzeScenario(s, 'expert');
		const standard = analyzeScenario(s, 'standard');
		expect(expert.findings.some((f) => f.id.startsWith('memlim-'))).toBe(false);
		expect(standard.findings.some((f) => f.id.startsWith('memlim-'))).toBe(true);
		expect(standard.clusters[0].sim).toEqual(expert.clusters[0].sim);
		expect(s.assumptions.memLimitOvercommitWarn).toBe(1.2);
		expect(JSON.stringify(s)).toBe(saved);
	});
	it('analyses the sample without unscheduled pods', () => {
		const r = analyzeScenario(sampleScenario());
		expect(r.clusters).toHaveLength(2);
		for (const c of r.clusters) expect(c.sim.unscheduled).toHaveLength(0);
		expect(r.totals.nodes).toBeGreaterThan(0);
		expect(r.savings.saved.nodes).toBeGreaterThan(0);
		expect(r.savings.pct.cost).toBeGreaterThan(0);
	});
	it('flags under-sized manual pools', () => {
		const s = scenario();
		const c = s.clusters[0];
		c.poolMode = 'manual';
		c.nodePools = [newPool('workers', 'g.4x16', 1)];
		s.workloads = [newWorkload(c.id, { replicas: 10, cpuRequest: 1, memRequestGiB: 2 })];
		const r = analyzeScenario(s);
		expect(r.clusters[0].sim.unscheduled.length).toBeGreaterThan(0);
		expect(r.findings.some((f) => f.category === 'under' && f.severity === 'critical')).toBe(true);
	});
	it('sums capacity and simulates workloads across multiple pools in one hosted cluster', () => {
		const s = scenario();
		const c = s.clusters[0];
		c.poolMode = 'manual';
		c.nodePools = [newPool('general', 'g.4x16', 2), newPool('memory', 'm.4x32', 3)];
		s.workloads = [
			newWorkload(c.id, { name: 'api', pool: 'general', replicas: 2, cpuRequest: 1, memRequestGiB: 2, antiAffinity: 'none' }),
			newWorkload(c.id, { name: 'cache', pool: 'memory', replicas: 2, cpuRequest: 0.5, memRequestGiB: 8, antiAffinity: 'none' })
		];

		const result = analyzeScenario(s);
		const cluster = result.clusters[0];

		expect(cluster.pools).toHaveLength(2);
		expect(cluster.totals.nodes).toBe(5);
		expect(cluster.totals.vcpu).toBe(20);
		expect(cluster.totals.memGiB).toBe(128);
		expect(cluster.sim.unscheduled).toHaveLength(0);
		expect(cluster.sim.nodes.filter((node) => node.pool === 'general')).toHaveLength(2);
		expect(cluster.sim.nodes.filter((node) => node.pool === 'memory')).toHaveLength(3);
	});
	it('flags over-sized manual pools with removable nodes', () => {
		const s = scenario();
		const c = s.clusters[0];
		c.poolMode = 'manual';
		c.nodePools = [newPool('workers', 'g.16x64', 10)];
		s.workloads = [newWorkload(c.id, { replicas: 2, cpuRequest: 0.5, memRequestGiB: 1 })];
		const r = analyzeScenario(s);
		expect(r.clusters[0].removableNodes.workers).toBeGreaterThan(5);
		expect(r.findings.some((f) => f.category === 'over')).toBe(true);
	});
	it('checks VM capacity regardless of the legacy workload quota basis', () => {
		const s = scenario();
		s.clusters[0].quota = { cpu: 4, memGiB: 1000, storageGiB: 10 };
		s.workloads = [newWorkload(s.clusters[0].id, { replicas: 2, storageGiB: 20 })];
		const r = analyzeScenario(s);
		const q = r.clusters[0].quota;
		expect(q[0].pct!).toBeGreaterThan(1);
		expect(q[2].used).toBe(40);
		expect(r.findings.some((f) => f.category === 'quota' && f.severity === 'critical')).toBe(true);
		s.assumptions = { ...s.assumptions, quotaBasis: 'requests' };
		const r2 = analyzeScenario(s);
		expect(r2.clusters[0].quota).toEqual(q);
		s.assumptions.quotaBasis = 'limits';
		expect(analyzeScenario(s).clusters[0].quota).toEqual(q);
	});
	it('reports node-failure stranding when no spare exists', () => {
		const s = scenario();
		const c = s.clusters[0];
		c.poolMode = 'manual';
		c.nodePools = [newPool('workers', 'g.4x16', 3)];
		s.workloads = [newWorkload(c.id, { replicas: 3, cpuRequest: 0.2, memRequestGiB: 0.5, antiAffinity: 'required' })];
		const r = analyzeScenario(s);
		expect(r.clusters[0].failures[0].stranded).toBe(1);
	});
	it('counts DaemonSet pods per node', () => {
		const s = scenario();
		const c = s.clusters[0];
		c.poolMode = 'manual';
		c.nodePools = [newPool('workers', 'g.8x32', 4)];
		s.workloads = [newWorkload(c.id, { kind: 'DaemonSet', cpuRequest: 0.1, memRequestGiB: 0.25 })];
		const r = analyzeScenario(s);
		expect(r.clusters[0].totals.pods).toBe(4);
		expect(r.clusters[0].totals.reqCpu).toBeCloseTo(0.4, 5);
	});
});

describe('infrastructure quotas', () => {
	function mixedPools(): Scenario {
		const s = scenario();
		const c = s.clusters[0];
		c.poolMode = 'manual';
		c.nodePools = [
			{ ...newPool('general', 'g.4x16', 1), autoscaling: true, minReplicas: 1, maxReplicas: 4 },
			newPool('memory', 'm.4x32', 2)
		];
		s.workloads = [newWorkload(c.id, {
			replicas: 1, maxReplicas: 2, cpuRequest: 0.1, memRequestGiB: 0.5,
			cpuLimit: 100, memLimitGiB: 200, storageGiB: 3, antiAffinity: 'none'
		})];
		return s;
	}

	it('checks full mixed-flavour capacity at pool maximum even when peak pods fit on current nodes', () => {
		const s = mixedPools();
		s.clusters[0].quota = { cpu: 16, memGiB: 100 };
		const r = analyzeScenario(s);
		const c = r.clusters[0];
		expect(c.totals.nodes).toBe(3);
		expect(c.peak.nodes).toHaveLength(3);
		expect(c.quotaTotals.nodes).toBe(6);
		expect(c.quota[0]).toMatchObject({ used: 24, quota: 16, pct: 1.5 });
		expect(c.quota[1]).toMatchObject({ used: 128, quota: 100, pct: 1.28 });
		expect(c.quota[2].used).toBe(6);
		expect(r.findings.filter((f) => f.category === 'quota' && f.severity === 'critical')).toHaveLength(2);
	});

	it('includes recommended peak spare nodes rather than just raw requirements or simulated nodes', () => {
		const s = scenario();
		s.assumptions = { ...s.assumptions, allowedTypeIds: ['g.4x16'], sizeFor: 'baseline', spareNodes: 2 };
		s.clusters[0].quota.auto = true;
		s.workloads = [newWorkload(s.clusters[0].id, {
			replicas: 1, maxReplicas: 8, cpuRequest: 0.5, memRequestGiB: 1, antiAffinity: 'required'
		})];
		const c = analyzeScenario(s).clusters[0];
		expect(c.pools[0].nodesPeak).toBe(8);
		expect(c.quotaTotals.nodes).toBe(10);
		expect(c.quota[0].quota).toBe(46);
		expect(c.quota[1].quota).toBe(192);
	});

	it('calculates independent scenario and cluster caps and checks effective cluster allocations', () => {
		const s = mixedPools();
		const second = newCluster('second');
		second.poolMode = 'manual';
		second.nodePools = [newPool('workers', 'g.8x32', 2)];
		second.quota = { auto: true, cpu: 999, memGiB: 999 };
		s.clusters.push(second);
		s.clusters[0].quota = { auto: true, cpu: 1, memGiB: 1 };
		s.scenarioQuota = { cpu: 39, memGiB: 191 };
		const r = analyzeScenario(s);
		expect(r.quota[0]).toMatchObject({ quota: 39, used: 40 });
		expect(r.quota[1]).toMatchObject({ quota: 191, used: 192 });
		expect(r.quotaTotals.nodes).toBe(8);
		expect(r.findings.some((f) => f.id === 'quota-overcommit')).toBe(true);
		expect(r.findings.some((f) => f.id === 'quota-scenario-cpu' && f.severity === 'critical')).toBe(true);
		s.scenarioQuota.auto = true;
		const auto = analyzeScenario(s);
		expect(auto.quota[0].quota).toBe(47);
		expect(auto.quota[1].quota).toBe(240);
		expect(auto.findings.some((f) => f.id === 'quota-overcommit')).toBe(false);
		expect(auto.findings.some((f) => f.category === 'quota')).toBe(false);
		// A calculated scenario cap does not erase larger explicit cluster allocations.
		s.clusters[0].quota = { cpu: 100 };
		expect(analyzeScenario(s).findings.some((f) => f.id === 'quota-overcommit')).toBe(true);
	});

	it('recalculates automatic caps as pools change and restores manual caps without changing scenario inputs', () => {
		const s = mixedPools();
		s.clusters[0].quota = { cpu: 7, memGiB: 9, storageGiB: 1, auto: true };
		s.scenarioQuota = { cpu: 5, memGiB: 6, auto: true };
		const saved = JSON.stringify(s);
		for (const mode of ['guided', 'standard', 'expert'] as const) {
			expect(analyzeScenario(s, mode).clusters[0].quota[0].quota).toBe(28);
			expect(JSON.stringify(s)).toBe(saved);
		}
		s.clusters[0].nodePools[0].maxReplicas = 5;
		expect(analyzeScenario(s).quota[0].quota).toBe(33);
		s.clusters[0].quota.auto = false;
		s.scenarioQuota.auto = false;
		const manual = analyzeScenario(s);
		expect(manual.clusters[0].quota.map((q) => q.quota)).toEqual([7, 9, 1]);
		expect(manual.quota.slice(0, 2).map((q) => q.quota)).toEqual([5, 6]);
	});

	it('does not cap recommendations or hide scheduling shortages to satisfy quota', () => {
		const s = mixedPools();
		const before = analyzeScenario(s);
		s.clusters[0].quota = { cpu: 0, memGiB: 0, auto: false };
		const limited = analyzeScenario(s);
		expect(limited.clusters[0].pools).toEqual(before.clusters[0].pools);
		expect(limited.clusters[0].sim).toEqual(before.clusters[0].sim);
		expect(limited.clusters[0].peak).toEqual(before.clusters[0].peak);
		expect(limited.clusters[0].quota[0].pct).toBe(Infinity);
		expect(limited.findings.some((f) => f.category === 'quota' && f.severity === 'critical')).toBe(true);
		s.clusters[0].quota.auto = true;
		s.workloads[0].maxReplicas = 100;
		s.workloads[0].antiAffinity = 'required';
		const under = analyzeScenario(s);
		expect(under.clusters[0].peak.unscheduled.length).toBeGreaterThan(0);
		expect(under.findings.some((f) => f.id === `peak-${s.clusters[0].id}`)).toBe(true);
		expect(under.clusters[0].quota[0].quota).toBe(28);
		s.clusters[0].poolMode = 'auto';
		const recommended = analyzeScenario(s);
		s.clusters[0].quota = { cpu: 1, memGiB: 1 };
		expect(analyzeScenario(s).clusters[0].pools).toEqual(recommended.clusters[0].pools);
	});

	it('checks peak PVCs separately, including pool-targeted DaemonSets at maximum', () => {
		const s = mixedPools();
		const c = s.clusters[0];
		c.quota = { auto: true, storageGiB: 10 };
		s.workloads.push(
			newWorkload(c.id, { kind: 'DaemonSet', pool: '', storageGiB: 2 }),
			newWorkload(c.id, { kind: 'DaemonSet', pool: 'memory', storageGiB: 5 }),
			newWorkload(c.id, { enabled: false, maxReplicas: 100, storageGiB: 100 })
		);
		const r = analyzeScenario(s);
		expect(r.clusters[0].quota[2]).toMatchObject({ quota: 10, used: 6 + 6 * 2 + 2 * 5 });
		expect(r.findings.some((f) => f.id === `quota-${c.id}-storage` && f.severity === 'critical')).toBe(true);
	});

	it('treats missing caps as unset and zero as a real cap, including an empty footprint', () => {
		const s = mixedPools();
		expect(analyzeScenario(s).quota.every((q) => q.quota === null)).toBe(true);
		s.clusters[0].nodePools = [];
		s.workloads = [];
		s.clusters[0].quota = { auto: true };
		s.scenarioQuota = { auto: true };
		const empty = analyzeScenario(s);
		expect(empty.quota.slice(0, 2).map((q) => [q.quota, q.used, q.pct])).toEqual([[0, 0, 0], [0, 0, 0]]);
	});

	it('persists optional automation and manual values in v1 JSON, accepts older files, and rejects invalid quota settings', () => {
		const s = mixedPools();
		expect(scenarioError(s)).toBeNull();
		s.clusters[0].quota = { auto: true, cpu: 2, memGiB: 3, storageGiB: 4 };
		s.scenarioQuota = { auto: true, cpu: 7 };
		const back: Scenario = JSON.parse(JSON.stringify(s));
		expect(scenarioError(back)).toBeNull();
		expect(back.clusters[0].quota).toEqual(s.clusters[0].quota);
		expect(analyzeScenario(back).quota).toEqual(analyzeScenario(s).quota);
		const invalidAuto = { ...s, scenarioQuota: { auto: 'true' } };
		expect(scenarioError(invalidAuto)).toContain('true or false');
		const invalidCap = { ...s, scenarioQuota: { cpu: -1 } };
		expect(scenarioError(invalidCap)).toContain('non-negative');
		s.scenarioQuota.cpu = -1;
		expect(() => analyzeScenario(s)).toThrow('non-negative');
	});

	it('adds configurable headroom, rounds upward to field steps, and defaults older files to 15%', () => {
		const s = mixedPools();
		s.clusters[0].quota.auto = true;
		s.scenarioQuota.auto = true;
		expect(s.assumptions.quotaHeadroomPct).toBe(15);
		const normal = analyzeScenario(s);
		expect(normal.clusters[0].quota.slice(0, 2).map((q) => q.quota)).toEqual([28, 160]);
		delete s.assumptions.quotaHeadroomPct;
		expect(scenarioError(s)).toBeNull();
		expect(analyzeScenario(s).quota).toEqual(normal.quota);
		s.assumptions.quotaHeadroomPct = 25;
		const higher = analyzeScenario(s);
		expect(higher.clusters[0].quota.slice(0, 2).map((q) => q.quota)).toEqual([30, 160]);
		expect(higher.clusters[0].sim).toEqual(normal.clusters[0].sim);
		expect(higher.clusters[0].pools).toEqual(normal.clusters[0].pools);
		expect(higher.quota[0].quota).toBe(30);
		s.assumptions.quotaHeadroomPct = 0;
		expect(analyzeScenario(s).quota.slice(0, 2).map((q) => q.quota)).toEqual([24, 128]);
		const back: Scenario = JSON.parse(JSON.stringify(s));
		expect(back.assumptions.quotaHeadroomPct).toBe(0);
		expect(scenarioError(back)).toBeNull();
	});

	it('never rounds quota requirements down or adds a spurious step at exact boundaries', () => {
		expect(automaticQuota(100, QUOTA_CPU_STEP, 15)).toBe(115);
		expect(automaticQuota(320, QUOTA_MEMORY_STEP, 15)).toBe(368);
		expect(automaticQuota(0, QUOTA_MEMORY_STEP, 15)).toBe(0);
		expect(automaticQuota(16.001, QUOTA_MEMORY_STEP, 0)).toBe(32);
		for (const headroom of [0, 5, 15, 25, 100]) {
			for (const peak of [0.1, 0.5, 1, 8, 24, 100, 128, 256, 320, 1000]) {
				for (const step of [QUOTA_CPU_STEP, QUOTA_MEMORY_STEP]) {
					const cap = automaticQuota(peak, step, headroom);
					expect(cap % step).toBe(0);
					expect(cap + 1e-10).toBeGreaterThanOrEqual(peak * (1 + headroom / 100));
					expect(cap - step).toBeLessThan(peak * (1 + headroom / 100));
				}
			}
		}
	});

	it('rejects invalid headroom on import and calculation instead of silently adjusting it', () => {
		for (const invalid of [-1, 101, NaN, Infinity, null, '15']) {
			const s = mixedPools();
			expect(scenarioError({ ...s, assumptions: { ...s.assumptions, quotaHeadroomPct: invalid } })).toContain('between 0 and 100');
		}
		for (const invalid of [-1, 101, NaN, Infinity]) {
			const s = mixedPools();
			s.assumptions.quotaHeadroomPct = invalid;
			expect(() => analyzeScenario(s)).toThrow('between 0 and 100');
		}
	});
});

describe('guided translation', () => {
	it('derives HA replicas and requests from a VM description', () => {
		const t = translateGuided({ vcpu: 4, ramGiB: 8, cpuBusy: 'medium', memBusy: 'medium', availability: 'critical', instances: 1, diskGiB: 10, growth: 'some' });
		expect(t.replicas).toBe(3);
		expect(t.antiAffinity).toBe('required');
		expect(t.cpuRequest).toBeLessThan(4);
		expect(t.cpuLimit).toBeGreaterThanOrEqual(t.cpuRequest);
		expect(t.maxReplicas).toBeGreaterThan(3);
	});
});

describe('csv', () => {
	it('round-trips workloads and parses k8s quantities', () => {
		const s = sampleScenario();
		const csv = workloadsToCsv(s);
		const back = csvToWorkloads(csv, s);
		expect(back.errors).toEqual([]);
		expect(back.workloads).toHaveLength(s.workloads.length);
		expect(parseCpu('500m')).toBeCloseTo(0.5);
		expect(parseMem('512Mi')).toBeCloseTo(0.5);
		expect(parseMem('2Gi')).toBe(2);
		const semi = csvToWorkloads('cluster;name;replicas;cpuRequest;memRequestGiB\nnew-hc;api;3;250m;1Gi', s);
		expect(semi.newClusters).toHaveLength(1);
		expect(semi.workloads[0].cpuRequest).toBeCloseTo(0.25);
	});
});
