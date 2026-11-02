import { describe, expect, it } from 'vitest';
import { analyzeScenario } from './analyze';
import { CATALOGS } from './catalog';
import { defaultAssumptions, newCluster, newPool, newWorkload, sampleScenario } from './defaults';
import { translateGuided } from './guided';
import { csvToWorkloads, parseCpu, parseMem, workloadsToCsv } from './io';
import { allocatable, reserved } from './nodes';
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
	it('computes quota consumption per basis', () => {
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
		expect(r2.clusters[0].quota[0].used).toBeCloseTo(1, 5);
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
