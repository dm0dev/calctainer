import { lim } from './nodes';
import type { Workload } from './types';

/** Namespace used for workloads that have none (older scenarios, plain "add workload"). */
export const DEFAULT_NAMESPACE = 'default';

const DNS_LABEL = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

export const namespaceOf = (w: Pick<Workload, 'namespace'>): string => w.namespace?.trim() || DEFAULT_NAMESPACE;

/** Returns an error message when the name is not a valid Kubernetes namespace (RFC 1123 label), otherwise null. */
export function namespaceError(name: string): string | null {
	if (!name) return 'Namespace must not be empty.';
	if (name.length > 63) return 'Namespace must be at most 63 characters.';
	if (!DNS_LABEL.test(name)) return 'Namespace may only contain lowercase letters, digits and "-", and must start and end with a letter or digit.';
	return null;
}

/** First free namespace name: `base`, `base-2`, `base-3`, … (kept within 63 characters). */
export function uniqueNamespace(base: string, taken: Iterable<string>): string {
	const used = new Set(taken);
	if (!used.has(base)) return base;
	for (let i = 2; ; i++) {
		const suffix = `-${i}`;
		const name = `${base.slice(0, 63 - suffix.length).replace(/-+$/, '')}${suffix}`;
		if (!used.has(name)) return name;
	}
}

/** First free workload name inside one namespace. */
export function uniqueName(base: string, taken: Iterable<string>): string {
	const used = new Set(taken);
	let name = base;
	for (let i = 2; used.has(name); i++) name = `${base}-${i}`;
	return name;
}

export interface NamespaceTotals {
	workloads: number;
	enabled: number;
	pods: number;
	maxPods: number;
	cpu: number;
	mem: number;
	cpuLim: number;
	memLim: number;
	storageGiB: number;
}

export interface NamespaceGroup {
	namespace: string;
	workloads: Workload[];
	/** Sums over enabled workloads: requests/limits × replicas, DaemonSets × node count. */
	totals: NamespaceTotals;
	/** Set when every workload in the namespace comes from the same Red Hat preset. */
	presetLabel: string | null;
}

export function namespaceTotals(workloads: Workload[], nodeCount: number): NamespaceTotals {
	const t: NamespaceTotals = { workloads: workloads.length, enabled: 0, pods: 0, maxPods: 0, cpu: 0, mem: 0, cpuLim: 0, memLim: 0, storageGiB: 0 };
	for (const w of workloads) {
		if (!w.enabled) continue;
		const daemon = w.kind === 'DaemonSet';
		const r = daemon ? nodeCount : Math.max(0, w.replicas);
		t.enabled++;
		t.pods += r;
		t.maxPods += daemon ? nodeCount : Math.max(r, w.maxReplicas || 0);
		t.cpu += r * w.cpuRequest;
		t.mem += r * w.memRequestGiB;
		t.cpuLim += r * lim(w.cpuRequest, w.cpuLimit);
		t.memLim += r * lim(w.memRequestGiB, w.memLimitGiB);
		t.storageGiB += r * (w.storageGiB || 0);
	}
	return t;
}

/** Group workloads by namespace in order of first appearance, with aggregated demand per group. */
export function namespaceGroups(workloads: Workload[], nodeCount: number): NamespaceGroup[] {
	const map = new Map<string, Workload[]>();
	for (const w of workloads) {
		const ns = namespaceOf(w);
		if (!map.has(ns)) map.set(ns, []);
		map.get(ns)!.push(w);
	}
	return [...map.entries()].map(([namespace, ws]) => {
		const labels = new Set(ws.map((w) => (w.preset?.vendor === 'redhat' ? w.preset.label : null)));
		const only = labels.size === 1 ? [...labels][0] : null;
		return { namespace, workloads: ws, totals: namespaceTotals(ws, nodeCount), presetLabel: only };
	});
}

/** Move every workload of one cluster from namespace `from` into `to` (merging if `to` exists). */
export function renameNamespace(workloads: Workload[], clusterId: string, from: string, to: string): number {
	let n = 0;
	for (const w of workloads) {
		if (w.clusterId === clusterId && namespaceOf(w) === from) {
			w.namespace = to;
			n++;
		}
	}
	return n;
}
