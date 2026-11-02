import { allocatable, daemonSetsFor, platformPod, podFor } from './nodes';
import type { Assumptions, InstanceType, PodSpec, Res, SchedulerStrategy, SimNode, SimResult, Workload } from './types';

const EPS = 1e-9;

export interface PoolSpec {
	name: string;
	dedicated: boolean;
	type: InstanceType;
	nodes: number;
	maxNodes: number;
}

export function makeNode(id: string, pool: PoolSpec, a: Assumptions, workloads: Workload[]): SimNode {
	const alloc = allocatable(pool.type, a);
	const daemonPods = [platformPod(a), ...daemonSetsFor(pool.name, workloads).map((w) => ({ ...podFor(w, 0), key: `${w.id}@${id}`, name: `${w.name}@${id}` }))];
	let dc = 0,
		dm = 0,
		lc = 0,
		lm = 0;
	for (const p of daemonPods) {
		dc += p.cpu;
		dm += p.mem;
		lc += p.cpuLim;
		lm += p.memLim;
	}
	return {
		id,
		pool: pool.name,
		typeId: pool.type.id,
		dedicated: pool.dedicated,
		capacity: { cpu: pool.type.vcpu, mem: pool.type.memoryGiB },
		allocatable: alloc,
		daemon: { cpu: dc, mem: dm },
		used: { cpu: 0, mem: 0 },
		limits: { cpu: lc, mem: lm },
		pods: [],
		daemonPods,
		maxPods: a.maxPodsPerNode,
		byWorkload: {}
	};
}

export function buildNodes(pools: PoolSpec[], a: Assumptions, workloads: Workload[], clusterKey = ''): SimNode[] {
	const nodes: SimNode[] = [];
	for (const p of pools) for (let i = 0; i < p.nodes; i++) nodes.push(makeNode(`${clusterKey}${p.name}-${i + 1}`, p, a, workloads));
	return nodes;
}

export function poolMatches(node: SimNode, pod: PodSpec): boolean {
	return pod.pool ? node.pool === pod.pool : !node.dedicated;
}

/** True if the pod fits on the node when the node may be filled to `fill` × allocatable. */
export function canPlace(node: SimNode, pod: PodSpec, fill = 1): boolean {
	if (!poolMatches(node, pod)) return false;
	if (node.pods.length + node.daemonPods.length >= node.maxPods) return false;
	if (pod.anti === 'required' && (node.byWorkload[pod.workloadId] ?? 0) > 0) return false;
	if (node.daemon.cpu + node.used.cpu + pod.cpu > node.allocatable.cpu * fill + EPS) return false;
	if (node.daemon.mem + node.used.mem + pod.mem > node.allocatable.mem * fill + EPS) return false;
	return true;
}

export function place(node: SimNode, pod: PodSpec): void {
	node.pods.push(pod);
	node.used.cpu += pod.cpu;
	node.used.mem += pod.mem;
	node.limits.cpu += pod.cpuLim;
	node.limits.mem += pod.memLim;
	node.byWorkload[pod.workloadId] = (node.byWorkload[pod.workloadId] ?? 0) + 1;
}

export function unplace(node: SimNode, pod: PodSpec): void {
	const i = node.pods.indexOf(pod);
	if (i < 0) return;
	node.pods.splice(i, 1);
	node.used.cpu -= pod.cpu;
	node.used.mem -= pod.mem;
	node.limits.cpu -= pod.cpuLim;
	node.limits.mem -= pod.memLim;
	node.byWorkload[pod.workloadId] = (node.byWorkload[pod.workloadId] ?? 1) - 1;
}

const frac = (n: SimNode, extra: Res) => {
	const c = n.allocatable.cpu > 0 ? (n.daemon.cpu + n.used.cpu + extra.cpu) / n.allocatable.cpu : 1;
	const m = n.allocatable.mem > 0 ? (n.daemon.mem + n.used.mem + extra.mem) / n.allocatable.mem : 1;
	return (c + m) / 2;
};

/**
 * Score a feasible node, approximating kube-scheduler:
 *  spread  → NodeResourcesFit LeastAllocated + default PodTopologySpread (soft, per hostname)
 *  binpack → MostAllocated (as used for capacity planning / bin-packing)
 */
export function score(node: SimNode, pod: PodSpec, strategy: SchedulerStrategy): number {
	const f = frac(node, pod);
	const same = node.byWorkload[pod.workloadId] ?? 0;
	let s = strategy === 'spread' ? 1 - f : f;
	if (pod.anti === 'preferred') s -= same * 1.0;
	else if (strategy === 'spread') s -= same * 0.15;
	return s;
}

export function pickNode(nodes: SimNode[], pod: PodSpec, strategy: SchedulerStrategy, fill = 1): SimNode | null {
	let best: SimNode | null = null;
	let bestScore = -Infinity;
	for (const n of nodes) {
		if (!canPlace(n, pod, fill)) continue;
		const s = score(n, pod, strategy);
		if (s > bestScore + 1e-12) {
			bestScore = s;
			best = n;
		}
	}
	return best;
}

/** Hard constraints first, then largest pods first (first-fit decreasing style). */
export function sortPods(pods: PodSpec[], ref: Res = { cpu: 16, mem: 64 }): PodSpec[] {
	const size = (p: PodSpec) => Math.max(p.cpu / ref.cpu, p.mem / ref.mem);
	return [...pods].sort((x, y) => {
		const ax = x.anti === 'required' ? 1 : 0;
		const ay = y.anti === 'required' ? 1 : 0;
		if (ax !== ay) return ay - ax;
		const d = size(y) - size(x);
		if (Math.abs(d) > 1e-12) return d;
		if (x.workloadId !== y.workloadId) return x.workloadId < y.workloadId ? -1 : 1;
		return x.index - y.index;
	});
}

export function schedule(nodes: SimNode[], pods: PodSpec[], strategy: SchedulerStrategy, fill = 1): SimResult {
	const unscheduled: PodSpec[] = [];
	for (const pod of sortPods(pods)) {
		const n = pickNode(nodes, pod, strategy, fill);
		if (n) place(n, pod);
		else unscheduled.push(pod);
	}
	return { nodes, unscheduled };
}

/**
 * Cluster-autoscaler approximation: pods that do not fit trigger a new node in a matching pool
 * (if the pool is below its max and the pod would fit on a fresh node).
 */
export function scheduleWithAutoscale(
	nodes: SimNode[],
	pods: PodSpec[],
	pools: PoolSpec[],
	a: Assumptions,
	workloads: Workload[],
	clusterKey = ''
): SimResult {
	const counts: Record<string, number> = {};
	for (const n of nodes) counts[n.pool] = (counts[n.pool] ?? 0) + 1;
	const unscheduled: PodSpec[] = [];
	for (const pod of sortPods(pods)) {
		let n = pickNode(nodes, pod, a.strategy);
		if (!n) {
			for (const p of pools) {
				const c = counts[p.name] ?? 0;
				if (c >= p.maxNodes) continue;
				const fresh = makeNode(`${clusterKey}${p.name}-${c + 1}`, p, a, workloads);
				fresh.scaled = true;
				if (!canPlace(fresh, pod)) continue;
				nodes.push(fresh);
				counts[p.name] = c + 1;
				n = fresh;
				break;
			}
		}
		if (n) place(n, pod);
		else unscheduled.push(pod);
	}
	return { nodes, unscheduled };
}

export function cloneNodes(nodes: SimNode[]): SimNode[] {
	return nodes.map((n) => ({
		...n,
		allocatable: { ...n.allocatable },
		capacity: { ...n.capacity },
		daemon: { ...n.daemon },
		used: { ...n.used },
		limits: { ...n.limits },
		pods: [...n.pods],
		daemonPods: [...n.daemonPods],
		byWorkload: { ...n.byWorkload }
	}));
}
