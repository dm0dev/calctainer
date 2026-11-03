import { analyzeScenario } from './analyze';
import { newCluster } from './defaults';
import { namespaceError } from './namespaces';
import { quotaHeadroomError } from './quotas';
import type { Assumptions, ClassicBaseline, HostedCluster, InstanceType, Mode, Quota, Scenario, Workload } from './types';

export const DATASETS = ['clusters', 'workloads', 'nodePools', 'quotas', 'catalog', 'classic'] as const;
export type Dataset = (typeof DATASETS)[number];
type ClusterRef = Pick<HostedCluster, 'id' | 'name'>;
interface DatasetValues {
	clusters: ClusterRef[];
	workloads: Workload[];
	nodePools: Pick<HostedCluster, 'id' | 'poolMode' | 'nodePools' | 'pins'>[];
	quotas: { scenario: Quota; clusters: { id: string; quota: Quota }[] };
	catalog: { name: string; types: InstanceType[] };
	classic: ClassicBaseline;
}
export interface ScenarioFile {
	kind: 'calctainer-scenario';
	formatVersion: 2;
	name: string;
	clusterRefs: ClusterRef[];
	datasets: Partial<DatasetValues>;
}
export interface AssumptionsFile {
	kind: 'calctainer-assumptions';
	formatVersion: 1;
	assumptions: Assumptions;
}

function fail(path: string, reason: string): never {
	throw new Error(`${path}: ${reason}`);
}
function object(x: unknown, path: string): Record<string, unknown> {
	if (!x || typeof x !== 'object' || Array.isArray(x)) fail(path, 'expected an object.');
	return x as Record<string, unknown>;
}
function array(x: unknown, path: string): unknown[] {
	if (!Array.isArray(x)) fail(path, 'expected a list.');
	return x;
}
function text(x: unknown, path: string, empty = false): asserts x is string {
	if (typeof x !== 'string' || (!empty && !x.trim())) fail(path, 'expected text.');
}
function number(x: unknown, path: string, min = 0, max = Infinity, integer = false): asserts x is number {
	if (typeof x !== 'number' || !Number.isFinite(x) || x < min || x > max || (integer && !Number.isInteger(x)))
		fail(path, `expected a ${integer ? 'whole ' : ''}number between ${min} and ${max}.`);
}
function bool(x: unknown, path: string): void {
	if (typeof x !== 'boolean') fail(path, 'expected true or false.');
}
function choice(x: unknown, values: readonly string[], path: string): void {
	if (typeof x !== 'string' || !values.includes(x)) fail(path, `expected ${values.join(', ')}.`);
}
function optionalText(x: unknown, path: string): void {
	if (x !== undefined) text(x, path, true);
}
function unique(items: unknown[], key: string, path: string): void {
	const ids = new Set<string>();
	for (const item of items) {
		const id = object(item, path)[key];
		text(id, `${path}.${key}`);
		if (ids.has(id)) fail(path, `duplicate ${key} "${id}".`);
		ids.add(id);
	}
}
function quota(x: unknown, path: string): void {
	const q = object(x, path);
	if (q.auto !== undefined) bool(q.auto, `${path}.auto`);
	for (const key of ['cpu', 'memGiB', 'storageGiB']) if (q[key] != null) number(q[key], `${path}.${key}`);
}
function clusterRefs(x: unknown, path: string): void {
	const refs = array(x, path);
	unique(refs, 'id', path);
	for (const r of refs) text(object(r, path).name, `${path}.name`);
}
function assumptions(x: unknown): asserts x is Assumptions {
	const a = object(x, 'Assumptions');
	for (const key of ['reservedCpu', 'reservedMemGiB', 'platformCpuPerNode', 'platformMemPerNodeGiB', 'cpuLimitOvercommitWarn', 'memLimitOvercommitWarn', 'pricePerVcpu', 'pricePerGiB'])
		number(a[key], `Assumptions.${key}`);
	for (const key of ['spareNodes', 'minNodesPerPool', 'maxPodsPerNode'])
		number(a[key], `Assumptions.${key}`, key === 'spareNodes' ? 0 : 1, Infinity, true);
	number(a.targetUtilization, 'Assumptions.targetUtilization', Number.EPSILON, 1);
	number(a.underUtilizedThreshold, 'Assumptions.underUtilizedThreshold', 0, 1);
	const error = quotaHeadroomError(a.quotaHeadroomPct);
	if (error) fail('Assumptions.quotaHeadroomPct', error);
	choice(a.reservedMode, ['auto', 'fixed'], 'Assumptions.reservedMode');
	choice(a.strategy, ['spread', 'binpack'], 'Assumptions.strategy');
	choice(a.sizeFor, ['baseline', 'peak'], 'Assumptions.sizeFor');
	choice(a.objective, ['cost', 'balanced', 'fewest-nodes'], 'Assumptions.objective');
	choice(a.quotaBasis, ['nodes', 'requests', 'limits'], 'Assumptions.quotaBasis');
	text(a.currency, 'Assumptions.currency');
	const allowed = array(a.allowedTypeIds, 'Assumptions.allowedTypeIds');
	for (const id of allowed) text(id, 'Assumptions.allowedTypeIds');
	if (new Set(allowed).size !== allowed.length) fail('Assumptions.allowedTypeIds', 'duplicate instance IDs.');
}
function catalogue(x: unknown): void {
	const c = object(x, 'Catalogue');
	text(c.name, 'Catalogue.name');
	const types = array(c.types, 'Catalogue.types');
	if (!types.length) fail('Catalogue', 'at least one instance type is required.');
	unique(types, 'id', 'Catalogue');
	for (const value of types) {
		const t = object(value, 'Instance type');
		text(t.name, 'Instance type.name');
		number(t.vcpu, 'Instance type.vcpu', Number.EPSILON);
		number(t.memoryGiB, 'Instance type.memoryGiB', Number.EPSILON);
		if (t.costPerMonth != null) number(t.costPerMonth, 'Instance type.costPerMonth');
		optionalText(t.family, 'Instance type.family');
	}
}
function pools(x: unknown): void {
	const entries = array(x, 'Node pools');
	unique(entries, 'id', 'Node pools cluster');
	for (const value of entries) {
		const c = object(value, 'Node pools cluster');
		choice(c.poolMode, ['auto', 'manual'], 'Node pools.poolMode');
		for (const id of Object.values(object(c.pins, 'Node pools.pins'))) text(id, 'Node pools.pin');
		const list = array(c.nodePools, 'Node pools');
		unique(list, 'id', 'Node pools');
		unique(list, 'name', 'Node pools');
		for (const item of list) {
			const p = object(item, 'Pool');
			text(p.instanceTypeId, 'Pool.instanceTypeId');
			bool(p.autoscaling, 'Pool.autoscaling');
			bool(p.dedicated, 'Pool.dedicated');
			for (const key of ['replicas', 'minReplicas', 'maxReplicas']) number(p[key], `Pool.${key}`, 0, Infinity, true);
			if (Number(p.minReplicas) > Number(p.maxReplicas)) fail('Pool', 'minimum exceeds maximum.');
			if (p.autoscaling && (Number(p.replicas) < Number(p.minReplicas) || Number(p.replicas) > Number(p.maxReplicas)))
				fail('Pool', 'selected count must be within its autoscaling range.');
		}
	}
}
function workloads(x: unknown): void {
	const list = array(x, 'Workloads');
	unique(list, 'id', 'Workloads');
	for (const value of list) {
		const w = object(value, 'Workload');
		text(w.name, 'Workload.name');
		text(w.clusterId, 'Workload.clusterId');
		text(w.pool, 'Workload.pool', true);
		optionalText(w.notes, 'Workload.notes');
		optionalText(w.storageClass, 'Workload.storageClass');
		if (w.namespace !== undefined) {
			text(w.namespace, 'Workload.namespace');
			const error = namespaceError(w.namespace);
			if (error) fail('Workload.namespace', error);
		}
		choice(w.kind, ['Deployment', 'StatefulSet', 'DaemonSet', 'Job'], 'Workload.kind');
		choice(w.antiAffinity, ['none', 'preferred', 'required'], 'Workload.antiAffinity');
		bool(w.enabled, 'Workload.enabled');
		for (const key of ['replicas', 'maxReplicas']) number(w[key], `Workload.${key}`, 0, Infinity, true);
		if (Number(w.maxReplicas) < Number(w.replicas)) fail('Workload', 'peak replicas must not be below baseline.');
		for (const key of ['cpuRequest', 'memRequestGiB', 'storageGiB']) number(w[key], `Workload.${key}`);
		for (const key of ['cpuLimit', 'memLimitGiB']) if (w[key] !== null) number(w[key], `Workload.${key}`);
		if (w.guided != null) {
			const g = object(w.guided, 'Guided profile');
			for (const key of ['vcpu', 'ramGiB']) number(g[key], `Guided.${key}`, Number.EPSILON);
			number(g.instances, 'Guided.instances', 1, Infinity, true);
			number(g.diskGiB, 'Guided.diskGiB');
			for (const key of ['cpuBusy', 'memBusy']) choice(g[key], ['low', 'medium', 'high'], `Guided.${key}`);
			choice(g.availability, ['basic', 'high', 'critical'], 'Guided.availability');
			choice(g.growth, ['none', 'some', 'burst'], 'Guided.growth');
		}
		if (w.preset != null) {
			const p = object(w.preset, 'Preset');
			text(p.id, 'Preset.id');
			text(p.label, 'Preset.label');
			choice(p.vendor, ['redhat', 'generic'], 'Preset.vendor');
			choice(p.basis, ['documented', 'upstream', 'measured', 'allowance'], 'Preset.basis');
			optionalText(p.source, 'Preset.source');
		}
	}
}
function classic(x: unknown): void {
	const c = object(x, 'Classic comparison');
	bool(c.enabled, 'Classic.enabled');
	choice(c.mode, ['derived', 'manual'], 'Classic.mode');
	for (const key of ['classicClusters', 'controlPlaneNodes', 'infraNodes']) number(c[key], `Classic.${key}`, 0, Infinity, true);
	number(c.workerOverheadPct, 'Classic.workerOverheadPct');
	text(c.controlPlaneTypeId, 'Classic.controlPlaneTypeId');
	text(c.infraTypeId, 'Classic.infraTypeId');
	const inventory = array(c.inventory, 'Classic.inventory');
	unique(inventory, 'id', 'Classic.inventory');
	for (const value of inventory) {
		const g = object(value, 'Classic inventory');
		text(g.instanceTypeId, 'Classic inventory.instanceTypeId');
		choice(g.role, ['control-plane', 'infra', 'worker'], 'Classic inventory.role');
		number(g.count, 'Classic inventory.count', 0, Infinity, true);
	}
}
function validateFile(x: unknown): asserts x is ScenarioFile {
	const f = object(x, 'Scenario file');
	if (f.kind !== 'calctainer-scenario' || f.formatVersion !== 2) fail('Scenario file', 'unsupported kind or version.');
	text(f.name, 'Scenario.name');
	clusterRefs(f.clusterRefs, 'Cluster references');
	const refs = new Set((f.clusterRefs as ClusterRef[]).map((c) => c.id));
	const d = object(f.datasets, 'Datasets');
	if (!Object.keys(d).length) fail('Datasets', 'select at least one dataset.');
	for (const key of Object.keys(d)) if (!DATASETS.includes(key as Dataset)) fail('Datasets', `unknown dataset "${key}".`);
	if ('clusters' in d) {
		clusterRefs(d.clusters, 'Clusters');
		for (const c of d.clusters as ClusterRef[]) if (!refs.has(c.id)) fail('Clusters', `missing reference for "${c.id}".`);
		if ((d.clusters as ClusterRef[]).length !== refs.size) fail('Clusters', 'definitions must match the cluster reference scope.');
	}
	if ('workloads' in d) workloads(d.workloads);
	if ('nodePools' in d) pools(d.nodePools);
	if ('catalog' in d) catalogue(d.catalog);
	if ('classic' in d) classic(d.classic);
	if ('quotas' in d) {
		const q = object(d.quotas, 'Quotas');
		quota(q.scenario, 'Scenario quota');
		const list = array(q.clusters, 'Cluster quotas');
		unique(list, 'id', 'Cluster quotas');
		for (const value of list) quota(object(value, 'Cluster quota').quota, 'Cluster quota');
	}
	for (const key of ['workloads', 'nodePools', 'quotas'] as const) {
		const list = key === 'quotas' ? (d.quotas ? object(d.quotas, 'Quotas').clusters : []) : d[key] ?? [];
		for (const item of array(list, key)) {
			const entry = object(item, key);
			const id = key === 'workloads' ? entry.clusterId : entry.id;
			if (typeof id !== 'string' || !refs.has(id)) fail(key, `unknown cluster reference "${String(id)}".`);
		}
		if (key !== 'workloads' && key in d && array(list, key).length !== refs.size)
			fail(key, 'must contain one entry for every cluster in the file scope.');
	}
}

export function exportScenarioFile(s: Scenario, selected: readonly Dataset[] = DATASETS): ScenarioFile {
	if (!selected.length) fail('Datasets', 'select at least one dataset.');
	const datasets: Partial<DatasetValues> = {};
	for (const key of selected) {
		switch (key) {
			case 'clusters': datasets.clusters = s.clusters.map(({ id, name }) => ({ id, name })); break;
			case 'workloads': datasets.workloads = s.workloads; break;
			case 'nodePools': datasets.nodePools = s.clusters.map(({ id, poolMode, nodePools, pins }) => ({ id, poolMode, nodePools, pins })); break;
			case 'quotas': datasets.quotas = { scenario: s.scenarioQuota, clusters: s.clusters.map(({ id, quota }) => ({ id, quota })) }; break;
			case 'catalog': datasets.catalog = { name: s.catalogName, types: s.catalog }; break;
			case 'classic': datasets.classic = s.classic; break;
		}
	}
	return structuredClone({ kind: 'calctainer-scenario', formatVersion: 2, name: s.name, clusterRefs: s.clusters.map(({ id, name }) => ({ id, name })), datasets });
}

export function parseScenarioFile(textValue: string): { file: ScenarioFile; legacy: boolean } {
	const x: unknown = JSON.parse(textValue);
	const value = object(x, 'Scenario file');
	if (value.version === 1 && value.kind === undefined) {
		validatePlanningScenario(x);
		return { file: exportScenarioFile(x), legacy: true };
	}
	validateFile(x);
	return { file: x, legacy: false };
}

export function exportAssumptionsFile(a: Assumptions): AssumptionsFile {
	assumptions(a);
	return structuredClone({ kind: 'calctainer-assumptions', formatVersion: 1, assumptions: a });
}

export function parseAssumptionsFile(textValue: string): Assumptions {
	const x = object(JSON.parse(textValue), 'Assumptions file');
	if (!(x.kind === 'calctainer-assumptions' && x.formatVersion === 1) && !(x.kind === undefined && x.version === 1))
		fail('Assumptions file', 'unsupported kind or version.');
	assumptions(x.assumptions);
	return structuredClone(x.assumptions);
}

/** Validate the complete composed state, including retained references, before calculation. */
export function validatePlanningScenario(x: unknown): asserts x is Scenario {
	const s = object(x, 'Scenario');
	if (s.version !== 1) fail('Scenario', 'unsupported internal version.');
	assumptions(s.assumptions);
	validateFile({
		kind: 'calctainer-scenario', formatVersion: 2, name: s.name,
		clusterRefs: array(s.clusters, 'Clusters').map((c) => {
			const value = object(c, 'Cluster');
			return { id: value.id, name: value.name };
		}),
		datasets: {
			clusters: s.clusters, workloads: s.workloads, nodePools: s.clusters,
			quotas: { scenario: s.scenarioQuota, clusters: s.clusters },
			catalog: { name: s.catalogName, types: s.catalog }, classic: s.classic
		}
	});
	const scenario = x as Scenario;
	const types = new Set(scenario.catalog.map((t) => t.id));
	const checkType = (id: string, path: string) => {
		if (!types.has(id)) fail(path, `instance type "${id}" is missing. Import a compatible catalogue or change the retained references first.`);
	};
	for (const id of scenario.assumptions.allowedTypeIds) checkType(id, 'Assumptions.allowedTypeIds');
	for (const c of scenario.clusters) {
		for (const id of Object.values(c.pins)) checkType(id, `Cluster "${c.name}" pin`);
		for (const p of c.nodePools) checkType(p.instanceTypeId, `Pool "${p.name}"`);
	}
	checkType(scenario.classic.controlPlaneTypeId, 'Classic.controlPlaneTypeId');
	checkType(scenario.classic.infraTypeId, 'Classic.infraTypeId');
	for (const g of scenario.classic.inventory) checkType(g.instanceTypeId, 'Classic inventory');
}

export function composeScenarioImport(current: Scenario, file: ScenarioFile, selected: readonly Dataset[], replace = false, mode: Mode = 'expert'): Scenario {
	validateFile(file);
	if (!selected.length) fail('Datasets', 'select at least one dataset.');
	for (const key of selected) if (!(key in file.datasets)) fail('Datasets', `"${key}" is not present in the file.`);
	if (replace && !DATASETS.every((key) => selected.includes(key))) fail('Scenario', 'replacement requires every dataset.');
	const next = structuredClone(current);
	const d = file.datasets;
	const scope = new Set(file.clusterRefs.map((c) => c.id));
	if (replace) {
		next.clusters = [];
		next.workloads = [];
	}
	if (selected.includes('clusters')) {
		for (const ref of d.clusters ?? []) {
			const existing = next.clusters.find((c) => c.id === ref.id);
			if (existing) existing.name = ref.name;
			else next.clusters.push({ ...newCluster(ref.name), id: ref.id });
		}
		next.name = file.name;
	}
	if (selected.some((key) => ['workloads', 'nodePools', 'quotas'].includes(key))) {
		for (const id of scope) if (!next.clusters.some((c) => c.id === id))
			fail('Clusters', `"${id}" is missing. Select hosted clusters or import into the original scenario.`);
	}
	if (selected.includes('workloads')) next.workloads = [...next.workloads.filter((w) => !scope.has(w.clusterId)), ...structuredClone(d.workloads ?? [])];
	for (const c of next.clusters) {
		if (selected.includes('nodePools')) {
			const pools = d.nodePools?.find((p) => p.id === c.id);
			if (pools) {
				c.poolMode = pools.poolMode;
				c.nodePools = structuredClone(pools.nodePools);
				c.pins = structuredClone(pools.pins);
			}
		}
		if (selected.includes('quotas')) {
			const entry = d.quotas?.clusters.find((q) => q.id === c.id);
			if (entry) c.quota = structuredClone(entry.quota);
		}
	}
	if (selected.includes('quotas') && d.quotas) next.scenarioQuota = structuredClone(d.quotas.scenario);
	if (selected.includes('catalog') && d.catalog) {
		next.catalogName = d.catalog.name;
		next.catalog = structuredClone(d.catalog.types);
	}
	if (selected.includes('classic') && d.classic) next.classic = structuredClone(d.classic);
	validatePlanningScenario(next);
	analyzeScenario(next, mode);
	return next;
}

export function composeAssumptionsImport(current: Scenario, a: Assumptions, mode: Mode = 'expert'): Scenario {
	const next = structuredClone(current);
	next.assumptions = structuredClone(a);
	validatePlanningScenario(next);
	analyzeScenario(next, mode);
	return next;
}
