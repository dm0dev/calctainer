import { describe, expect, it } from 'vitest';
import { analyzeScenario } from './analyze';
import { newCluster, newWorkload, sampleScenario } from './defaults';
import { csvToWorkloads, scenarioError, validateScenario, workloadsToCsv } from './io';
import { DEFAULT_NAMESPACE, namespaceError, namespaceGroups, namespaceOf, namespaceTotals, renameNamespace, uniqueName, uniqueNamespace } from './namespaces';
import { REDHAT_PRESETS, workloadsFromPreset } from './presets';
import { workloadYaml } from '../yaml';

describe('namespace names', () => {
	it('falls back to "default" for workloads without a namespace', () => {
		expect(namespaceOf({})).toBe(DEFAULT_NAMESPACE);
		expect(namespaceOf({ namespace: '  ' })).toBe(DEFAULT_NAMESPACE);
		expect(namespaceOf({ namespace: 'shop' })).toBe('shop');
		expect(newWorkload('c').namespace).toBe(DEFAULT_NAMESPACE);
	});

	it('accepts RFC 1123 labels and explains invalid names', () => {
		for (const ok of ['a', 'default', 'openshift-gitops', 'ns-2', 'x'.repeat(63)]) expect(namespaceError(ok)).toBeNull();
		for (const bad of ['', 'Shop', 'my_app', '-a', 'a-', 'a.b', 'x'.repeat(64), 'with space']) expect(namespaceError(bad)).toMatch(/Namespace/);
	});

	it('finds free namespace and workload names', () => {
		expect(uniqueNamespace('kafka', [])).toBe('kafka');
		expect(uniqueNamespace('kafka', ['kafka', 'kafka-2'])).toBe('kafka-3');
		const long = 'a'.repeat(63);
		const next = uniqueNamespace(long, [long]);
		expect(next).toHaveLength(63);
		expect(namespaceError(next)).toBeNull();
		expect(uniqueName('api', ['api'])).toBe('api-2');
	});
});

describe('namespace grouping and aggregation', () => {
	const ws = () => [
		newWorkload('c', { name: 'a', namespace: 'shop', replicas: 2, maxReplicas: 4, cpuRequest: 0.5, cpuLimit: 1, memRequestGiB: 1, memLimitGiB: null, storageGiB: 10 }),
		newWorkload('c', { name: 'agent', namespace: 'ops', kind: 'DaemonSet', cpuRequest: 0.1, memRequestGiB: 0.25 }),
		newWorkload('c', { name: 'b', namespace: 'shop', replicas: 3, maxReplicas: 3, cpuRequest: 1, cpuLimit: null, memRequestGiB: 2, memLimitGiB: 4 }),
		newWorkload('c', { name: 'off', namespace: 'shop', enabled: false, replicas: 9, cpuRequest: 9, memRequestGiB: 9 }),
		{ ...newWorkload('c', { name: 'legacy' }), namespace: undefined }
	];

	it('groups in first-appearance order', () => {
		const g = namespaceGroups(ws(), 4);
		expect(g.map((x) => x.namespace)).toEqual(['shop', 'ops', DEFAULT_NAMESPACE]);
		expect(g[0].workloads.map((w) => w.name)).toEqual(['a', 'b', 'off']);
	});

	it('sums enabled demand × replicas and DaemonSets × nodes', () => {
		const [shop, ops] = namespaceGroups(ws(), 4);
		expect(shop.totals).toEqual({ workloads: 3, enabled: 2, pods: 5, maxPods: 7, cpu: 4, mem: 8, cpuLim: 5, memLim: 14, storageGiB: 20 });
		expect(ops.totals).toMatchObject({ pods: 4, maxPods: 4, cpu: 0.4, mem: 1 });
	});

	it('group totals add up to the cluster requests from the analysis', () => {
		const s = sampleScenario();
		const r = analyzeScenario(s);
		for (const c of r.clusters) {
			const list = s.workloads.filter((w) => w.clusterId === c.clusterId);
			const groups = namespaceGroups(list, c.totals.nodes);
			const all = namespaceTotals(list, c.totals.nodes);
			expect(groups.reduce((n, g) => n + g.totals.cpu, 0)).toBeCloseTo(all.cpu, 9);
			expect(groups.reduce((n, g) => n + g.totals.mem, 0)).toBeCloseTo(all.mem, 9);
			expect(all.cpu).toBeCloseTo(c.totals.reqCpu, 6);
			expect(all.mem).toBeCloseTo(c.totals.reqMem, 6);
		}
	});

	it('marks a namespace with its Red Hat preset only when every workload comes from it', () => {
		const gitops = REDHAT_PRESETS.find((p) => p.id === 'gitops')!;
		const preset = workloadsFromPreset('c', gitops);
		expect(namespaceGroups(preset, 3)[0].presetLabel).toBe(gitops.label);
		const mixed = [...preset, newWorkload('c', { namespace: gitops.namespace })];
		expect(namespaceGroups(mixed, 3)[0].presetLabel).toBeNull();
		expect(namespaceGroups(ws(), 3)[0].presetLabel).toBeNull();
	});

	it('renames or merges a namespace only inside one cluster', () => {
		const list = [newWorkload('c1', { namespace: 'old' }), newWorkload('c1', { namespace: 'old' }), newWorkload('c2', { namespace: 'old' })];
		expect(renameNamespace(list, 'c1', 'old', 'new')).toBe(2);
		expect(list.map((w) => w.namespace)).toEqual(['new', 'new', 'old']);
	});

	it('namespaces do not change scheduling', () => {
		const s = sampleScenario();
		const before = analyzeScenario(s).totals;
		const flat = { ...s, workloads: s.workloads.map((w) => ({ ...w, namespace: DEFAULT_NAMESPACE })) };
		expect(analyzeScenario(flat).totals).toEqual(before);
	});

	it('sample scenario groups related workloads', () => {
		const s = sampleScenario();
		const shop = s.workloads.filter((w) => w.clusterId === s.clusters[0].id);
		expect(namespaceGroups(shop, 0).map((g) => g.namespace)).toEqual(['shop', 'logging', 'platform', 'erp']);
	});
});

describe('namespace import/export', () => {
	it('round-trips namespaces through CSV and defaults missing ones', () => {
		const s = sampleScenario();
		const csv = workloadsToCsv(s);
		expect(csv.split('\n')[0].split(',').slice(0, 3)).toEqual(['cluster', 'namespace', 'name']);
		const back = csvToWorkloads(csv, s);
		expect(back.errors).toEqual([]);
		expect(back.workloads.map((w) => w.namespace)).toEqual(s.workloads.map((w) => namespaceOf(w)));
		const legacy = csvToWorkloads('cluster,name,replicas\nshop-prod,api,2', s);
		expect(legacy.workloads[0].namespace).toBe(DEFAULT_NAMESPACE);
	});

	it('skips CSV rows with invalid namespaces and reports them', () => {
		const s = sampleScenario();
		const r = csvToWorkloads('cluster,namespace,name\nshop-prod,Bad_NS,api\nshop-prod,good,web', s);
		expect(r.workloads.map((w) => w.name)).toEqual(['web']);
		expect(r.errors).toHaveLength(1);
		expect(r.errors[0]).toMatch(/Row 2: invalid namespace "Bad_NS"/);
	});

	it('accepts older scenarios without namespaces and rejects invalid ones with a reason', () => {
		const s = sampleScenario();
		const old = JSON.parse(JSON.stringify(s));
		for (const w of old.workloads) delete w.namespace;
		expect(validateScenario(old)).toBe(true);
		const bad = JSON.parse(JSON.stringify(s));
		bad.workloads[0].namespace = 'Not Valid';
		expect(validateScenario(bad)).toBe(false);
		expect(scenarioError(bad)).toMatch(/storefront.*invalid namespace "Not Valid"/);
	});

	it('shows the namespace in the manifest preview', () => {
		const c = newCluster('c');
		expect(workloadYaml(newWorkload(c.id, { name: 'api', namespace: 'shop' }))).toContain('  namespace: shop\n');
	});
});
