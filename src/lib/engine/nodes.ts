import type { Assumptions, InstanceType, PodSpec, Res, Workload } from './types';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Node reservation for kubelet / CRI-O / OS.
 * "auto" follows OpenShift's autoSizingReserved tiers (same tiers as GKE):
 *  CPU   6% of 1st core, 1% of 2nd, 0.5% of cores 3–4, 0.25% above 4
 *  Mem   25% of first 4 GiB, 20% of next 4, 10% of next 8, 6% of next 112, 2% above 128 GiB, + 100 MiB eviction threshold
 */
export function reserved(type: InstanceType, a: Assumptions): Res {
	if (a.reservedMode === 'fixed') return { cpu: a.reservedCpu, mem: a.reservedMemGiB };
	const c = type.vcpu;
	const m = type.memoryGiB;
	const cpu = 0.06 * clamp(c, 0, 1) + 0.01 * clamp(c - 1, 0, 1) + 0.005 * clamp(c - 2, 0, 2) + 0.0025 * Math.max(c - 4, 0);
	const mem =
		0.25 * clamp(m, 0, 4) + 0.2 * clamp(m - 4, 0, 4) + 0.1 * clamp(m - 8, 0, 8) + 0.06 * clamp(m - 16, 0, 112) + 0.02 * Math.max(m - 128, 0) + 0.1;
	return { cpu, mem };
}

export function allocatable(type: InstanceType, a: Assumptions): Res {
	const r = reserved(type, a);
	return { cpu: Math.max(0, type.vcpu - r.cpu), mem: Math.max(0, type.memoryGiB - r.mem) };
}

export function instanceCost(type: InstanceType, a: Assumptions): number {
	if (type.costPerMonth != null && Number.isFinite(type.costPerMonth) && type.costPerMonth > 0) return type.costPerMonth;
	return type.vcpu * a.pricePerVcpu + type.memoryGiB * a.pricePerGiB;
}

export const lim = (req: number, limit: number | null | undefined) => (limit == null || !Number.isFinite(limit) ? req : Math.max(req, limit));

export function podFor(w: Workload, index: number): PodSpec {
	return {
		key: `${w.id}#${index}`,
		workloadId: w.id,
		name: `${w.name}-${index}`,
		index,
		cpu: Math.max(0, w.cpuRequest || 0),
		mem: Math.max(0, w.memRequestGiB || 0),
		cpuLim: lim(w.cpuRequest || 0, w.cpuLimit),
		memLim: lim(w.memRequestGiB || 0, w.memLimitGiB),
		pool: (w.pool || '').trim(),
		anti: w.antiAffinity
	};
}

export function podsFor(w: Workload, replicas: number): PodSpec[] {
	const out: PodSpec[] = [];
	for (let i = 0; i < Math.max(0, Math.floor(replicas)); i++) out.push(podFor(w, i));
	return out;
}

export const isDaemon = (w: Workload) => w.kind === 'DaemonSet';

/** DaemonSets landing on a node of the given pool. Empty pool on a DaemonSet = every node. */
export function daemonSetsFor(pool: string, workloads: Workload[]): Workload[] {
	return workloads.filter((w) => w.enabled && isDaemon(w) && (!w.pool?.trim() || w.pool.trim() === pool));
}

export function platformPod(a: Assumptions): PodSpec {
	return {
		key: 'platform',
		workloadId: '__platform__',
		name: 'platform daemonsets',
		index: 0,
		cpu: a.platformCpuPerNode,
		mem: a.platformMemPerNodeGiB,
		cpuLim: a.platformCpuPerNode,
		memLim: a.platformMemPerNodeGiB,
		pool: '',
		anti: 'none'
	};
}

export function sumRes<T>(items: T[], f: (x: T) => Res): Res {
	let cpu = 0;
	let mem = 0;
	for (const it of items) {
		const r = f(it);
		cpu += r.cpu;
		mem += r.mem;
	}
	return { cpu, mem };
}
