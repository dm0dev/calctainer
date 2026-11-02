import { uid, newCluster, newWorkload } from './defaults';
import { DEFAULT_NAMESPACE, namespaceError, namespaceOf } from './namespaces';
import type { AntiAffinity, Scenario, Workload, WorkloadKind } from './types';

export const CSV_COLUMNS = [
	'cluster',
	'namespace',
	'name',
	'kind',
	'replicas',
	'maxReplicas',
	'cpuRequest',
	'cpuLimit',
	'memRequestGiB',
	'memLimitGiB',
	'storageGiB',
	'pool',
	'antiAffinity',
	'enabled'
] as const;

const esc = (v: unknown) => {
	const s = v == null ? '' : String(v);
	return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function workloadsToCsv(s: Scenario): string {
	const name = new Map(s.clusters.map((c) => [c.id, c.name]));
	const rows = s.workloads.map((w) =>
		[name.get(w.clusterId) ?? '', namespaceOf(w), w.name, w.kind, w.replicas, w.maxReplicas, w.cpuRequest, w.cpuLimit ?? '', w.memRequestGiB, w.memLimitGiB ?? '', w.storageGiB, w.pool, w.antiAffinity, w.enabled]
			.map(esc)
			.join(',')
	);
	return [CSV_COLUMNS.join(','), ...rows].join('\n');
}

/** Minimal RFC-4180 parser; auto-detects comma or semicolon separators (spreadsheet exports). */
export function parseCsv(text: string): string[][] {
	const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
	const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';
	const rows: string[][] = [];
	let row: string[] = [];
	let cell = '';
	let q = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (q) {
			if (ch === '"' && text[i + 1] === '"') {
				cell += '"';
				i++;
			} else if (ch === '"') q = false;
			else cell += ch;
		} else if (ch === '"') q = true;
		else if (ch === sep) {
			row.push(cell);
			cell = '';
		} else if (ch === '\n' || ch === '\r') {
			if (ch === '\r' && text[i + 1] === '\n') i++;
			row.push(cell);
			rows.push(row);
			row = [];
			cell = '';
		} else cell += ch;
	}
	if (cell !== '' || row.length) {
		row.push(cell);
		rows.push(row);
	}
	return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

const num = (v: string | undefined, d: number): number => {
	if (v == null || v.trim() === '') return d;
	const n = Number(v.replace(',', '.'));
	return Number.isFinite(n) ? n : d;
};
const numOrNull = (v: string | undefined): number | null => {
	if (v == null || v.trim() === '') return null;
	const n = Number(v.replace(',', '.'));
	return Number.isFinite(n) ? n : null;
};

/** Parses Kubernetes-style quantities like 500m, 2Gi, 512Mi, or plain numbers. */
export function parseCpu(v: string): number | null {
	const s = v.trim();
	if (!s) return null;
	if (s.endsWith('m')) return num(s.slice(0, -1), NaN) / 1000;
	return numOrNull(s);
}
export function parseMem(v: string): number | null {
	const s = v.trim();
	if (!s) return null;
	const m = s.match(/^([\d.,]+)\s*(Ki|Mi|Gi|Ti|K|M|G|T)?i?B?$/i);
	if (!m) return numOrNull(s);
	const n = num(m[1], NaN);
	const u = (m[2] ?? 'Gi').toLowerCase();
	const f: Record<string, number> = { ki: 1 / 1048576, k: 1 / 1048576, mi: 1 / 1024, m: 1 / 1024, gi: 1, g: 1, ti: 1024, t: 1024 };
	return n * (f[u] ?? 1);
}

export interface CsvImportResult {
	workloads: Workload[];
	newClusters: { id: string; name: string }[];
	errors: string[];
}

export function csvToWorkloads(text: string, s: Scenario): CsvImportResult {
	const rows = parseCsv(text);
	const errors: string[] = [];
	if (!rows.length) return { workloads: [], newClusters: [], errors: ['File is empty'] };
	const header = rows[0].map((h) => h.trim());
	const idx = (k: string) => header.findIndex((h) => h.toLowerCase() === k.toLowerCase());
	if (idx('name') < 0) return { workloads: [], newClusters: [], errors: [`Missing "name" column. Expected columns: ${CSV_COLUMNS.join(', ')}`] };
	const clusters = new Map(s.clusters.map((c) => [c.name.toLowerCase(), c.id]));
	const newClusters: { id: string; name: string }[] = [];
	const out: Workload[] = [];
	const kinds: WorkloadKind[] = ['Deployment', 'StatefulSet', 'DaemonSet', 'Job'];
	const antis: AntiAffinity[] = ['none', 'preferred', 'required'];
	rows.slice(1).forEach((r, i) => {
		const get = (k: string) => {
			const j = idx(k);
			return j >= 0 ? (r[j] ?? '').trim() : '';
		};
		const name = get('name');
		if (!name) {
			errors.push(`Row ${i + 2}: missing name, skipped`);
			return;
		}
		const cname = get('cluster') || s.clusters[0]?.name || 'hosted-cluster';
		const namespace = get('namespace') || DEFAULT_NAMESPACE;
		const nsErr = namespaceError(namespace);
		if (nsErr) {
			errors.push(`Row ${i + 2}: invalid namespace "${namespace}" (${nsErr}), skipped`);
			return;
		}
		let cid = clusters.get(cname.toLowerCase());
		if (!cid) {
			const c = newCluster(cname);
			cid = c.id;
			clusters.set(cname.toLowerCase(), cid);
			newClusters.push({ id: cid, name: cname });
		}
		const kind = kinds.find((k) => k.toLowerCase() === get('kind').toLowerCase()) ?? 'Deployment';
		const replicas = Math.max(0, Math.round(num(get('replicas'), 1)));
		const w = newWorkload(cid, {
			id: uid('wl'),
			name,
			namespace,
			kind,
			replicas,
			maxReplicas: Math.max(replicas, Math.round(num(get('maxReplicas'), replicas))),
			cpuRequest: parseCpu(get('cpuRequest')) ?? 0.1,
			cpuLimit: parseCpu(get('cpuLimit')),
			memRequestGiB: parseMem(get('memRequestGiB')) ?? 0.25,
			memLimitGiB: parseMem(get('memLimitGiB')),
			storageGiB: parseMem(get('storageGiB')) ?? 0,
			pool: get('pool'),
			antiAffinity: antis.find((x) => x === get('antiAffinity').toLowerCase()) ?? 'none',
			enabled: !/^(false|0|no)$/i.test(get('enabled'))
		});
		out.push(w);
	});
	return { workloads: out, newClusters, errors };
}

export function download(filename: string, content: string, mime = 'text/plain') {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Returns an actionable reason why `x` is not a loadable scenario, or null when it is. */
export function scenarioError(x: unknown): string | null {
	const s = x as Scenario;
	if (!s || s.version !== 1 || !Array.isArray(s.clusters) || !Array.isArray(s.workloads) || !Array.isArray(s.catalog) || !s.assumptions)
		return 'Not a Calctainer scenario (version 1).';
	for (const [scope, quota] of [
		['Scenario', s.scenarioQuota],
		...s.clusters.map((c) => [c?.name ?? '?', c?.quota] as const)
	] as const) {
		if (!quota || typeof quota !== 'object' || Array.isArray(quota)) return `${scope}: missing quota object.`;
		if (quota.auto !== undefined && typeof quota.auto !== 'boolean') return `${scope}: automatic quota calculation must be true or false.`;
		for (const resource of ['cpu', 'memGiB', 'storageGiB'] as const) {
			const value = quota[resource];
			if (value != null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0))
				return `${scope}: ${resource} quota must be a non-negative number or empty.`;
		}
	}
	for (const w of s.workloads) {
		if (w?.namespace == null) continue;
		const err = typeof w.namespace === 'string' ? namespaceError(w.namespace) : 'Namespace must be text.';
		if (err) return `Workload "${w?.name ?? '?'}" has invalid namespace "${String(w.namespace)}": ${err}`;
	}
	return null;
}

export function validateScenario(x: unknown): x is Scenario {
	return scenarioError(x) === null;
}
