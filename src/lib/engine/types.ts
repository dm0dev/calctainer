/**
 * Domain model for HCP workload planning.
 * Units: CPU in cores (vCPU), memory and storage in GiB, cost per month in the scenario currency.
 * Only workloads running inside hosted clusters are modelled — never the management cluster
 * or hosted control-plane components.
 */

export type Mode = 'guided' | 'standard' | 'expert';

export type WorkloadKind = 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'Job';

export type AntiAffinity = 'none' | 'preferred' | 'required';

export type SchedulerStrategy = 'spread' | 'binpack';

export type QuotaBasis = 'nodes' | 'requests' | 'limits';

export type Objective = 'cost' | 'balanced' | 'fewest-nodes';

export interface InstanceType {
	id: string;
	name: string;
	vcpu: number;
	memoryGiB: number;
	/** Optional explicit monthly cost; otherwise derived from per-vCPU / per-GiB pricing. */
	costPerMonth?: number | null;
	family?: string;
}

export interface Quota {
	cpu?: number | null;
	memGiB?: number | null;
	storageGiB?: number | null;
}

export type Busy = 'low' | 'medium' | 'high';
export type Availability = 'basic' | 'high' | 'critical';
export type Growth = 'none' | 'some' | 'burst';

/** Plain-language VM-style description used by guided users. */
export interface GuidedProfile {
	vcpu: number;
	ramGiB: number;
	cpuBusy: Busy;
	memBusy: Busy;
	availability: Availability;
	instances: number;
	diskGiB: number;
	growth: Growth;
}

export interface Workload {
	id: string;
	name: string;
	clusterId: string;
	/** Kubernetes namespace used to group related workloads; missing means "default". */
	namespace?: string;
	kind: WorkloadKind;
	enabled: boolean;
	/** Baseline replica count (ignored for DaemonSets). */
	replicas: number;
	/** HPA maximum replicas; equal to replicas when not autoscaled. */
	maxReplicas: number;
	cpuRequest: number;
	cpuLimit: number | null;
	memRequestGiB: number;
	memLimitGiB: number | null;
	/** External (PVC) storage per replica. */
	storageGiB: number;
	storageClass?: string;
	/** Target node pool name. Empty = any general (non-dedicated) pool. For DaemonSets empty = every node. */
	pool: string;
	antiAffinity: AntiAffinity;
	notes?: string;
	guided?: GuidedProfile | null;
	/** Set when the workload was added from a preset; keeps the vendor and value provenance visible. */
	preset?: WorkloadPresetRef | null;
}

export type PresetVendor = 'redhat' | 'generic';

/**
 * Where a preset value comes from:
 * documented = Red Hat product documentation; upstream = defaults in the upstream operator/manifests;
 * measured = consumption figure published in Red Hat docs; allowance = planner assumption because no default is set.
 */
export type PresetBasis = 'documented' | 'upstream' | 'measured' | 'allowance';

export interface WorkloadPresetRef {
	id: string;
	label: string;
	vendor: PresetVendor;
	basis: PresetBasis;
	source?: string;
}

export interface NodePool {
	id: string;
	name: string;
	instanceTypeId: string;
	replicas: number;
	autoscaling: boolean;
	minReplicas: number;
	maxReplicas: number;
	/** Dedicated pools are tainted: only workloads explicitly targeting them land there. */
	dedicated: boolean;
}

export interface HostedCluster {
	id: string;
	name: string;
	quota: Quota;
	poolMode: 'auto' | 'manual';
	/** Manual pools (expert). */
	nodePools: NodePool[];
	/** Auto mode: pin instance type per pool name. */
	pins: Record<string, string>;
}

export interface Assumptions {
	reservedMode: 'auto' | 'fixed';
	reservedCpu: number;
	reservedMemGiB: number;
	/** Platform DaemonSets per node (OVN-Kubernetes, multus, DNS, node-exporter, ...). */
	platformCpuPerNode: number;
	platformMemPerNodeGiB: number;
	targetUtilization: number;
	spareNodes: number;
	minNodesPerPool: number;
	maxPodsPerNode: number;
	strategy: SchedulerStrategy;
	sizeFor: 'baseline' | 'peak';
	objective: Objective;
	allowedTypeIds: string[];
	cpuLimitOvercommitWarn: number;
	memLimitOvercommitWarn: number;
	underUtilizedThreshold: number;
	pricePerVcpu: number;
	pricePerGiB: number;
	currency: string;
	quotaBasis: QuotaBasis;
}

export interface ClassicNodeGroup {
	id: string;
	role: 'control-plane' | 'infra' | 'worker';
	instanceTypeId: string;
	count: number;
}

export interface ClassicBaseline {
	enabled: boolean;
	/** derived: CP+infra per classic cluster plus the same worker capacity as the HCP plan. manual: actual inventory. */
	mode: 'derived' | 'manual';
	classicClusters: number;
	controlPlaneNodes: number;
	controlPlaneTypeId: string;
	infraNodes: number;
	infraTypeId: string;
	/** Extra worker capacity typical for classic clusters (fragmented, per-cluster N+1), in percent. */
	workerOverheadPct: number;
	inventory: ClassicNodeGroup[];
}

export interface Scenario {
	version: 1;
	name: string;
	catalogName: string;
	catalog: InstanceType[];
	assumptions: Assumptions;
	clusters: HostedCluster[];
	workloads: Workload[];
	scenarioQuota: Quota;
	classic: ClassicBaseline;
}

/* ───────────── Results ───────────── */

export interface Res {
	cpu: number;
	mem: number;
}

export interface PodSpec {
	key: string;
	workloadId: string;
	name: string;
	index: number;
	cpu: number;
	mem: number;
	cpuLim: number;
	memLim: number;
	pool: string;
	anti: AntiAffinity;
}

export interface SimNode {
	id: string;
	pool: string;
	typeId: string;
	dedicated: boolean;
	capacity: Res;
	allocatable: Res;
	/** Platform + user DaemonSet requests on this node. */
	daemon: Res;
	/** Requests of scheduled (non-DaemonSet) pods. */
	used: Res;
	/** Limits of all pods on the node incl. DaemonSets (missing limit counted as request). */
	limits: Res;
	pods: PodSpec[];
	daemonPods: PodSpec[];
	maxPods: number;
	/** Count of pods per workload id. */
	byWorkload: Record<string, number>;
	/** Node created by autoscaler in peak simulation. */
	scaled?: boolean;
}

export interface SimResult {
	nodes: SimNode[];
	unscheduled: PodSpec[];
}

export interface Candidate {
	typeId: string;
	feasible: boolean;
	reason?: string;
	nodesBase: number;
	nodesPeak: number;
	nodes: number;
	cost: number;
	cpuUtil: number;
	memUtil: number;
	stranded: number;
	score: number;
}

export interface PoolResult {
	name: string;
	dedicated: boolean;
	source: 'recommended' | 'manual';
	type: InstanceType;
	nodes: number;
	autoscaling: boolean;
	minNodes: number;
	maxNodes: number;
	nodesBase: number;
	nodesPeak: number;
	spare: number;
	allocatablePerNode: Res;
	daemonPerNode: Res;
	candidates: Candidate[];
	pinned: boolean;
	costPerMonth: number;
	explanation: string[];
}

export interface Totals {
	nodes: number;
	vcpu: number;
	memGiB: number;
	allocCpu: number;
	allocMem: number;
	reqCpu: number;
	reqMem: number;
	limCpu: number;
	limMem: number;
	storageGiB: number;
	pods: number;
	cost: number;
}

export interface QuotaLine {
	resource: 'cpu' | 'mem' | 'storage';
	quota: number | null;
	nodes: number;
	requests: number;
	limits: number;
	used: number;
	pct: number | null;
}

export interface WorkloadHeadroom {
	workloadId: string;
	name: string;
	replicas: number;
	maxReplicas: number;
	/** Additional replicas that fit on current nodes. */
	extraOnCurrent: number;
	/** Additional replicas that fit when autoscaling pools reach max. */
	extraWithAutoscale: number;
	hpaFits: boolean;
	capped: boolean;
}

export interface Fragmentation {
	demandRatio: number;
	freeCpu: number;
	freeMem: number;
	strandedCpu: number;
	strandedMem: number;
	refPod: Res;
	refSlots: number;
	idealSlots: number;
	index: number;
}

export type Severity = 'critical' | 'warning' | 'info' | 'ok';
export type FindingCategory = 'under' | 'over' | 'quota' | 'fragmentation' | 'resilience' | 'hygiene';

export interface Finding {
	id: string;
	severity: Severity;
	category: FindingCategory;
	clusterId: string | null;
	title: string;
	detail: string;
	/** Plain-language explanation for guided users. */
	plain?: string;
	action?: string;
}

export interface FailureTest {
	pool: string;
	nodeId: string;
	displaced: number;
	stranded: number;
}

export interface ClusterResult {
	clusterId: string;
	name: string;
	pools: PoolResult[];
	sim: SimResult;
	peak: SimResult;
	failures: FailureTest[];
	totals: Totals;
	quota: QuotaLine[];
	headroom: WorkloadHeadroom[];
	fragmentation: Fragmentation;
	findings: Finding[];
	removableNodes: Record<string, number>;
}

export interface Footprint {
	nodes: number;
	vcpu: number;
	memGiB: number;
	cost: number;
}

export interface SavingsResult {
	enabled: boolean;
	classic: Footprint;
	classicBreakdown: Record<'control-plane' | 'infra' | 'worker', Footprint>;
	hcp: Footprint;
	saved: Footprint;
	pct: { nodes: number; vcpu: number; memGiB: number; cost: number };
	notes: string[];
}

export interface ScenarioResult {
	clusters: ClusterResult[];
	totals: Totals;
	quota: QuotaLine[];
	findings: Finding[];
	savings: SavingsResult;
}
