import { describe, expect, it } from 'vitest';
import { analyzeScenario } from './analyze';
import { newCluster, sampleScenario, TEMPLATES, workloadFromTemplate } from './defaults';
import { validateScenario } from './io';
import { namespaceError } from './namespaces';
import { BASIS_LABEL, presetFootprint, REDHAT_PRESETS, UNSET_ALLOWANCE, workloadsFromPreset, type OperatorPreset } from './presets';
import type { Scenario } from './types';

const KINDS = ['Deployment', 'StatefulSet', 'DaemonSet', 'Job'];
const byId = (id: string) => REDHAT_PRESETS.find((p) => p.id === id)!;
const comp = (preset: string, name: string) => byId(preset).components.find((c) => c.name === name)!;

function scenarioWithPresets(presets: OperatorPreset[]): Scenario {
	const c = newCluster('platform');
	const workloads = presets.flatMap((p) => workloadsFromPreset(c.id, p));
	return { ...sampleScenario(), clusters: [c], workloads, scenarioQuota: {} };
}

describe('Red Hat operator presets — catalogue integrity', () => {
	it('covers the expected Red Hat operators with unique ids', () => {
		const ids = REDHAT_PRESETS.map((p) => p.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(ids).toEqual(expect.arrayContaining(['rhbk', 'gitops', 'pipelines', 'servicemesh', 'cert-manager', 'rhacs', 'logging', 'serverless', 'streams']));
	});

	it.each(REDHAT_PRESETS.map((p) => [p.id, p] as const))('%s has valid, sourced components', (_id, p) => {
		expect(p.vendor).toBe('redhat');
		expect(p.docs.length).toBeGreaterThan(0);
		for (const d of p.docs) expect(d.url).toMatch(/^https:\/\//);
		expect(p.components.length).toBeGreaterThan(0);
		expect(new Set(p.components.map((c) => c.name)).size).toBe(p.components.length);
		for (const c of p.components) {
			expect(KINDS).toContain(c.kind);
			expect(c.name).toMatch(/^[a-z0-9][a-z0-9-]*$/);
			expect(Number.isInteger(c.replicas) && c.replicas >= 1).toBe(true);
			expect(c.maxReplicas ?? c.replicas).toBeGreaterThanOrEqual(c.replicas);
			for (const v of [c.cpuRequest, c.memRequestGiB]) expect(Number.isFinite(v) && v > 0).toBe(true);
			if (c.cpuLimit != null) expect(c.cpuLimit).toBeGreaterThanOrEqual(c.cpuRequest);
			if (c.memLimitGiB != null) expect(c.memLimitGiB).toBeGreaterThanOrEqual(c.memRequestGiB);
			expect(c.storageGiB ?? 0).toBeGreaterThanOrEqual(0);
			expect(c.source).toMatch(/^https:\/\//);
			expect(BASIS_LABEL[c.basis]).toBeTruthy();
			if (c.basis === 'allowance') expect(c).toMatchObject({ ...UNSET_ALLOWANCE, cpuLimit: null, memLimitGiB: null });
		}
	});

	it('uses the values stated in Red Hat documentation', () => {
		expect(comp('gitops', 'argocd-application-controller')).toMatchObject({ kind: 'StatefulSet', cpuRequest: 0.25, cpuLimit: 2, memRequestGiB: 1, memLimitGiB: 2, basis: 'documented' });
		expect(comp('gitops', 'argocd-server')).toMatchObject({ cpuRequest: 0.125, cpuLimit: 0.5, memRequestGiB: 0.125, memLimitGiB: 0.25 });
		expect(comp('gitops', 'argocd-repo-server')).toMatchObject({ cpuRequest: 0.25, cpuLimit: 1, memRequestGiB: 0.25, memLimitGiB: 1 });
		expect(comp('rhbk', 'keycloak')).toMatchObject({ memRequestGiB: 1.66, memLimitGiB: 2, basis: 'documented' });
		expect(comp('rhacs', 'sensor')).toMatchObject({ cpuRequest: 2, cpuLimit: 4, memRequestGiB: 4, memLimitGiB: 8 });
		expect(comp('rhacs', 'admission-control')).toMatchObject({ replicas: 3, cpuRequest: 0.05, cpuLimit: 0.5 });
		expect(comp('rhacs', 'collector')).toMatchObject({ kind: 'DaemonSet', cpuRequest: 0.07, cpuLimit: 2.75 });
		expect(comp('rhacs', 'scanner-v4-db')).toMatchObject({ storageGiB: 10 });
		expect(byId('serverless').components.filter((c) => c.basis === 'upstream').every((c) => c.replicas === 2)).toBe(true);
		expect(byId('cert-manager').components.filter((c) => c.name !== 'cert-manager-operator').every((c) => c.basis === 'allowance')).toBe(true);
	});

	it('sums the footprint per preset with DaemonSets kept per node', () => {
		const f = presetFootprint(byId('gitops'));
		expect(f.pods).toBe(9);
		expect(f.cpu).toBeCloseTo(1.375 + 0.5 + UNSET_ALLOWANCE.cpuRequest, 9);
		expect(f.memGiB).toBeCloseTo(2.125 + 0.25 + UNSET_ALLOWANCE.memRequestGiB, 9);
		const acs = presetFootprint(byId('rhacs'));
		expect(acs.daemonCpu).toBeCloseTo(0.07, 9);
		expect(acs.storageGiB).toBe(10);
	});
});

describe('Red Hat operator presets — workloads', () => {
	it('expands one workload per component and marks the vendor and provenance', () => {
		const p = byId('rhbk');
		const ws = workloadsFromPreset('hc', p);
		expect(ws).toHaveLength(p.components.length);
		for (const [i, w] of ws.entries()) {
			const c = p.components[i];
			expect(w).toMatchObject({ clusterId: 'hc', name: c.name, kind: c.kind, replicas: c.replicas, cpuRequest: c.cpuRequest, memRequestGiB: c.memRequestGiB, enabled: true, guided: null, pool: '' });
			expect(w.preset).toEqual({ id: 'rhbk', label: p.label, vendor: 'redhat', basis: c.basis, source: c.source });
			expect(w.notes).toContain(p.product);
		}
	});

	it('keeps HPA ranges and single-instance DaemonSets', () => {
		const tekton = workloadsFromPreset('hc', byId('pipelines')).find((w) => w.name === 'tekton-pipelines-webhook')!;
		expect([tekton.replicas, tekton.maxReplicas]).toEqual([1, 5]);
		const collector = workloadsFromPreset('hc', byId('logging')).find((w) => w.name === 'collector')!;
		expect(collector.kind).toBe('DaemonSet');
		expect([collector.replicas, collector.maxReplicas]).toEqual([1, 1]);
	});

	it('puts every install into its own namespace', () => {
		for (const p of REDHAT_PRESETS) {
			const ws = workloadsFromPreset('hc', p);
			expect(new Set(ws.map((w) => w.namespace))).toEqual(new Set([p.namespace]));
			expect(namespaceError(p.namespace)).toBeNull();
		}
		expect(new Set(REDHAT_PRESETS.map((p) => p.namespace)).size).toBe(REDHAT_PRESETS.length);
		const second = workloadsFromPreset('hc', byId('gitops'), ['openshift-gitops']);
		expect(second.every((w) => w.namespace === 'openshift-gitops-2')).toBe(true);
		expect(second.map((w) => w.name)).toEqual(byId('gitops').components.map((c) => c.name));
	});

	it('generic templates are not marked as Red Hat presets and use their own namespace', () => {
		for (const t of TEMPLATES) {
			expect(namespaceError(t.namespace)).toBeNull();
			for (const guided of [false, true]) {
				const w = workloadFromTemplate('hc', t, guided);
				expect(w.preset).toBeUndefined();
				expect(w.namespace).toBe(t.namespace);
			}
		}
		const web = TEMPLATES.find((t) => t.id === 'web')!;
		expect(workloadFromTemplate('hc', web, false, ['web', 'web-2']).name).toBe('web-3');
	});

	it('every preset fits on auto-recommended pools and counts toward requests', () => {
		const s = scenarioWithPresets(REDHAT_PRESETS);
		const r = analyzeScenario(s).clusters[0];
		expect(r.sim.unscheduled).toHaveLength(0);
		expect(r.peak.unscheduled).toHaveLength(0);
		const nodes = r.totals.nodes;
		let cpu = 0;
		for (const p of REDHAT_PRESETS) {
			const f = presetFootprint(p);
			cpu += f.cpu + f.daemonCpu * nodes;
		}
		expect(r.totals.reqCpu).toBeCloseTo(cpu, 6);
	});

	it('preset provenance survives scenario JSON round-trip', () => {
		const s = scenarioWithPresets([byId('gitops')]);
		const back = JSON.parse(JSON.stringify(s));
		expect(validateScenario(back)).toBe(true);
		expect(back.workloads[0].preset).toEqual(s.workloads[0].preset);
	});
});
