import { describe, expect, it } from 'vitest';
import { newCluster, newPool, sampleScenario } from './defaults';
import {
	composeAssumptionsImport, composeScenarioImport, DATASETS, exportAssumptionsFile,
	exportScenarioFile, parseAssumptionsFile, parseScenarioFile, validatePlanningScenario
} from './portable';

describe('portable scenario datasets', () => {
	it.each(DATASETS)('can transfer only the %s dataset without changing other inputs', (key) => {
		const s = sampleScenario();
		const file = exportScenarioFile(s, [key]);
		expect(Object.keys(file.datasets)).toEqual([key]);
		const { file: parsed } = parseScenarioFile(JSON.stringify(file));
		expect(composeScenarioImport(s, parsed, [key])).toEqual(s);
	});

	it('round trips every dataset without exporting assumptions or UI state', () => {
		const s = sampleScenario();
		s.clusters[0].nodePools = [newPool('custom', s.catalog[0].id)];
		s.clusters[0].pins = { general: s.catalog[1].id };
		s.workloads[0].preset = { id: 'test', label: 'Test', vendor: 'redhat', basis: 'documented', source: 'https://example.test' };
		const file = exportScenarioFile(s);
		expect(JSON.stringify(file)).not.toContain('"assumptions"');
		const parsed = parseScenarioFile(JSON.stringify(file));
		const next = composeScenarioImport(s, parsed.file, DATASETS, true);
		expect(next).toEqual(s);
		expect(next).not.toBe(s);
		expect(parsed.legacy).toBe(false);
	});

	it('updates only selected scopes, retains unrelated clusters, and treats empty lists as clears', () => {
		const s = sampleScenario();
		const subset = structuredClone(s);
		subset.clusters = [s.clusters[0]];
		subset.workloads = [];
		const file = exportScenarioFile(subset, ['workloads']);
		const next = composeScenarioImport(s, file, ['workloads']);
		expect(next.workloads).toEqual(s.workloads.filter((w) => w.clusterId !== s.clusters[0].id));
		expect(next.clusters).toEqual(s.clusters);
		expect(next.assumptions).toEqual(s.assumptions);
		expect(s.workloads.length).toBeGreaterThan(next.workloads.length);
	});

	it('uses IDs, not matching names, and requires cluster definitions to add a cluster', () => {
		const s = sampleScenario();
		const source = sampleScenario();
		const file = exportScenarioFile(source);
		expect(() => composeScenarioImport(s, file, ['workloads'])).toThrow(/Select hosted clusters/);
		const next = composeScenarioImport(s, file, ['clusters', 'workloads']);
		expect(next.clusters).toHaveLength(s.clusters.length + source.clusters.length);
		expect(next.clusters.at(-1)?.poolMode).toBe('auto');
		expect(next.clusters.at(-1)?.quota.cpu).toBeNull();
	});

	it('replaces an entire scenario only with every dataset, while retaining assumptions', () => {
		const s = sampleScenario();
		s.assumptions.quotaHeadroomPct = 42;
		const source = sampleScenario();
		source.workloads[0].notes = 'Preserve me';
		const file = exportScenarioFile(source);
		expect(() => composeScenarioImport(s, file, ['clusters'], true)).toThrow(/every dataset/);
		const next = composeScenarioImport(s, file, DATASETS, true);
		expect(next.clusters).toEqual(source.clusters);
		expect(next.workloads).toEqual(source.workloads);
		expect(next.assumptions).toEqual(s.assumptions);
	});

	it('adapts version 1 without implicitly applying embedded assumptions', () => {
		const s = sampleScenario();
		const old = structuredClone(s);
		old.assumptions.quotaHeadroomPct = 75;
		delete old.assumptions.quotaHeadroomPct;
		delete old.workloads[0].namespace;
		const { file, legacy } = parseScenarioFile(JSON.stringify(old));
		expect(legacy).toBe(true);
		expect(composeScenarioImport(s, file, DATASETS).assumptions).toEqual(s.assumptions);
		expect(parseAssumptionsFile(JSON.stringify(old))).toEqual(old.assumptions);
	});

	it('rejects invalid files without mutating any active values', () => {
		const s = sampleScenario();
		const before = structuredClone(s);
		const file = exportScenarioFile(s);
		file.datasets.catalog!.types = [{ id: 'different', name: 'Different', vcpu: 4, memoryGiB: 16 }];
		expect(() => composeScenarioImport(s, file, ['catalog'])).toThrow(/instance type.*missing/);
		expect(s).toEqual(before);
		expect(() => parseScenarioFile('{"kind":"calctainer-scenario","formatVersion":99}')).toThrow(/unsupported/);
		expect(() => composeScenarioImport(s, exportScenarioFile(s, ['clusters']), ['quotas'])).toThrow(/not present/);
		expect(() => composeScenarioImport(s, exportScenarioFile(s), [])).toThrow(/at least one/);
	});

	it('does not allow extension fields in pools to overwrite unselected cluster fields', () => {
		const s = sampleScenario();
		const raw = JSON.parse(JSON.stringify(exportScenarioFile(s, ['nodePools'])));
		raw.datasets.nodePools[0].quota = { cpu: 0 };
		raw.datasets.nodePools[0].name = 'Overwritten';
		const { file } = parseScenarioFile(JSON.stringify(raw));
		const next = composeScenarioImport(s, file, ['nodePools']);
		expect(next.clusters).toEqual(s.clusters);
	});

	it.each([
		['duplicate clusters', (s: ReturnType<typeof sampleScenario>) => { s.clusters.push(s.clusters[0]); }],
		['orphan workload', (s: ReturnType<typeof sampleScenario>) => { s.workloads[0].clusterId = 'missing'; }],
		['duplicate workload', (s: ReturnType<typeof sampleScenario>) => { s.workloads.push(s.workloads[0]); }],
		['invalid namespace', (s: ReturnType<typeof sampleScenario>) => { s.workloads[0].namespace = 'BAD'; }],
		['negative demand', (s: ReturnType<typeof sampleScenario>) => { s.workloads[0].cpuRequest = -1; }],
		['non-finite demand', (s: ReturnType<typeof sampleScenario>) => { s.workloads[0].memRequestGiB = Infinity; }],
		['invalid quota', (s: ReturnType<typeof sampleScenario>) => { s.clusters[0].quota.cpu = -1; }],
		['invalid pool range', (s: ReturnType<typeof sampleScenario>) => {
			s.clusters[0].nodePools = [{ ...newPool('bad', s.catalog[0].id), minReplicas: 10, maxReplicas: 1 }];
		}],
		['invalid guided data', (s: ReturnType<typeof sampleScenario>) => { s.workloads.find((w) => w.guided)!.guided!.instances = -1; }],
		['invalid classic reference', (s: ReturnType<typeof sampleScenario>) => { s.classic.infraTypeId = 'missing'; }]
	])('rejects %s at the complete-state boundary', (_name, mutate) => {
		const s = sampleScenario();
		mutate(s);
		expect(() => validatePlanningScenario(s)).toThrow();
	});

	it('validates per-scope coverage and unknown cluster references in portable files', () => {
		const file = exportScenarioFile(sampleScenario());
		file.datasets.quotas!.clusters.pop();
		expect(() => parseScenarioFile(JSON.stringify(file))).toThrow(/every cluster/);
		const other = exportScenarioFile(sampleScenario());
		other.datasets.nodePools![0].id = 'missing';
		expect(() => parseScenarioFile(JSON.stringify(other))).toThrow(/unknown cluster/);
	});
});

describe('independent assumptions', () => {
	it('round trips and applies assumptions only', () => {
		const s = sampleScenario();
		const a = { ...s.assumptions, quotaHeadroomPct: 20, spareNodes: 3 };
		const parsed = parseAssumptionsFile(JSON.stringify(exportAssumptionsFile(a)));
		const next = composeAssumptionsImport(s, parsed);
		expect(next).toEqual({ ...s, assumptions: a });
		expect(s.assumptions.spareNodes).not.toBe(3);
	});
	it('rejects incompatible types and invalid settings atomically', () => {
		const s = sampleScenario();
		const before = structuredClone(s);
		expect(() => composeAssumptionsImport(s, { ...s.assumptions, allowedTypeIds: ['missing'] })).toThrow(/missing/);
		expect(() => exportAssumptionsFile({ ...s.assumptions, targetUtilization: 0 })).toThrow(/targetUtilization/);
		expect(() => exportAssumptionsFile({ ...s.assumptions, spareNodes: 0.1 })).toThrow(/whole number/);
		expect(() => exportAssumptionsFile({ ...s.assumptions, quotaHeadroomPct: 101 })).toThrow(/100/);
		expect(s).toEqual(before);
	});
	it('accepts empty cluster scenarios and missing optional version-1 fields', () => {
		const s = sampleScenario();
		s.clusters = [];
		s.workloads = [];
		delete s.assumptions.quotaHeadroomPct;
		expect(() => validatePlanningScenario(s)).not.toThrow();
		const source = { ...s, clusters: [newCluster('new')] };
		expect(composeScenarioImport(s, exportScenarioFile(source), DATASETS).clusters).toHaveLength(1);
	});
});
