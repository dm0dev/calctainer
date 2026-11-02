import { CATALOGS } from './catalog';
import { applyGuided } from './guided';
import { DEFAULT_NAMESPACE, uniqueName } from './namespaces';
import type { Assumptions, ClassicBaseline, GuidedProfile, HostedCluster, NodePool, Scenario, Workload, WorkloadKind } from './types';

let counter = 0;
export function uid(prefix = 'id'): string {
	counter = (counter + 1) % 1_000_000;
	return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}${counter.toString(36)}`;
}

export const defaultAssumptions = (typeIds: string[]): Assumptions => ({
	reservedMode: 'auto',
	reservedCpu: 0.5,
	reservedMemGiB: 1,
	platformCpuPerNode: 0.35,
	platformMemPerNodeGiB: 1.5,
	targetUtilization: 0.8,
	spareNodes: 1,
	minNodesPerPool: 2,
	maxPodsPerNode: 250,
	strategy: 'spread',
	sizeFor: 'baseline',
	objective: 'cost',
	allowedTypeIds: typeIds,
	cpuLimitOvercommitWarn: 2,
	memLimitOvercommitWarn: 1,
	underUtilizedThreshold: 0.4,
	pricePerVcpu: 22,
	pricePerGiB: 3,
	currency: '💎',
	quotaBasis: 'nodes'
});

export const defaultClassic = (typeId: string): ClassicBaseline => ({
	enabled: true,
	mode: 'derived',
	classicClusters: 0,
	controlPlaneNodes: 3,
	controlPlaneTypeId: typeId,
	infraNodes: 3,
	infraTypeId: typeId,
	workerOverheadPct: 15,
	inventory: []
});

export function newCluster(name: string): HostedCluster {
	return { id: uid('hc'), name, quota: { cpu: null, memGiB: null, storageGiB: null }, poolMode: 'auto', nodePools: [], pins: {} };
}

export function newPool(name: string, instanceTypeId: string, replicas = 3): NodePool {
	return {
		id: uid('np'),
		name,
		instanceTypeId,
		replicas,
		autoscaling: false,
		minReplicas: replicas,
		maxReplicas: replicas + 2,
		dedicated: false
	};
}

export function newWorkload(clusterId: string, partial: Partial<Workload> = {}): Workload {
	return {
		id: uid('wl'),
		name: 'new-app',
		clusterId,
		namespace: DEFAULT_NAMESPACE,
		kind: 'Deployment',
		enabled: true,
		replicas: 2,
		maxReplicas: 2,
		cpuRequest: 0.5,
		cpuLimit: 1,
		memRequestGiB: 1,
		memLimitGiB: 2,
		storageGiB: 0,
		pool: '',
		antiAffinity: 'preferred',
		guided: null,
		...partial
	};
}

export function newGuidedWorkload(clusterId: string, name: string, profile: GuidedProfile): Workload {
	const w = newWorkload(clusterId, { name, guided: { ...profile } });
	applyGuided(w);
	return w;
}

export interface WorkloadTemplate {
	id: string;
	label: string;
	description: string;
	/** Namespace the template's workloads are grouped into; reused when adding the same template again. */
	namespace: string;
	kind: WorkloadKind;
	values: Partial<Workload>;
	guided: GuidedProfile;
}

export const TEMPLATES: WorkloadTemplate[] = [
	{
		id: 'web',
		namespace: 'web',
		label: 'Web front-end',
		description: 'Stateless web server or SPA host; scales horizontally.',
		kind: 'Deployment',
		values: { kind: 'Deployment', replicas: 3, maxReplicas: 6, cpuRequest: 0.25, cpuLimit: 1, memRequestGiB: 0.5, memLimitGiB: 1, antiAffinity: 'preferred' },
		guided: { vcpu: 2, ramGiB: 4, cpuBusy: 'low', memBusy: 'medium', availability: 'high', instances: 2, diskGiB: 0, growth: 'burst' }
	},
	{
		id: 'java',
		namespace: 'java-services',
		label: 'Java / Spring service',
		description: 'JVM microservice; memory-heavy, moderate CPU.',
		kind: 'Deployment',
		values: { kind: 'Deployment', replicas: 2, maxReplicas: 4, cpuRequest: 0.5, cpuLimit: 2, memRequestGiB: 2, memLimitGiB: 2, antiAffinity: 'preferred' },
		guided: { vcpu: 4, ramGiB: 8, cpuBusy: 'medium', memBusy: 'high', availability: 'high', instances: 2, diskGiB: 0, growth: 'some' }
	},
	{
		id: 'db',
		namespace: 'databases',
		label: 'Database (StatefulSet)',
		description: 'PostgreSQL / MariaDB cluster with persistent volumes.',
		kind: 'StatefulSet',
		values: { kind: 'StatefulSet', replicas: 3, maxReplicas: 3, cpuRequest: 2, cpuLimit: 4, memRequestGiB: 8, memLimitGiB: 8, storageGiB: 200, antiAffinity: 'required' },
		guided: { vcpu: 4, ramGiB: 16, cpuBusy: 'medium', memBusy: 'high', availability: 'critical', instances: 1, diskGiB: 200, growth: 'none' }
	},
	{
		id: 'queue',
		namespace: 'messaging',
		label: 'Message broker',
		description: 'Kafka / RabbitMQ / AMQ broker with storage.',
		kind: 'StatefulSet',
		values: { kind: 'StatefulSet', replicas: 3, maxReplicas: 3, cpuRequest: 1, cpuLimit: 2, memRequestGiB: 4, memLimitGiB: 6, storageGiB: 100, antiAffinity: 'required' },
		guided: { vcpu: 4, ramGiB: 8, cpuBusy: 'medium', memBusy: 'medium', availability: 'critical', instances: 1, diskGiB: 100, growth: 'none' }
	},
	{
		id: 'batch',
		namespace: 'batch',
		label: 'Batch / worker job',
		description: 'Queue consumers or nightly jobs; CPU-bound bursts.',
		kind: 'Deployment',
		values: { kind: 'Deployment', replicas: 2, maxReplicas: 8, cpuRequest: 1, cpuLimit: 2, memRequestGiB: 1, memLimitGiB: 2, antiAffinity: 'none' },
		guided: { vcpu: 4, ramGiB: 4, cpuBusy: 'high', memBusy: 'low', availability: 'basic', instances: 2, diskGiB: 0, growth: 'burst' }
	},
	{
		id: 'agent',
		namespace: 'node-agents',
		label: 'Node agent (DaemonSet)',
		description: 'Log shipper / security agent running on every node.',
		kind: 'DaemonSet',
		values: { kind: 'DaemonSet', replicas: 1, maxReplicas: 1, cpuRequest: 0.1, cpuLimit: 0.5, memRequestGiB: 0.25, memLimitGiB: 0.5, antiAffinity: 'none' },
		guided: { vcpu: 1, ramGiB: 1, cpuBusy: 'low', memBusy: 'low', availability: 'basic', instances: 1, diskGiB: 0, growth: 'none' }
	},
	{
		id: 'platform',
		namespace: 'platform',
		label: 'In-cluster platform services',
		description: 'Ingress routers, monitoring, registry running inside the hosted cluster.',
		kind: 'Deployment',
		values: { kind: 'Deployment', replicas: 2, maxReplicas: 2, cpuRequest: 1, cpuLimit: null, memRequestGiB: 4, memLimitGiB: null, storageGiB: 50, antiAffinity: 'required' },
		guided: { vcpu: 2, ramGiB: 8, cpuBusy: 'medium', memBusy: 'medium', availability: 'high', instances: 2, diskGiB: 50, growth: 'none' }
	}
];

/** Template workload in the template's namespace; the name is made unique among `takenNames` of that namespace. */
export function workloadFromTemplate(clusterId: string, tpl: WorkloadTemplate, guided: boolean, takenNames: Iterable<string> = []): Workload {
	const name = uniqueName(tpl.id === 'platform' ? 'platform-services' : tpl.id, takenNames);
	const w = guided ? newGuidedWorkload(clusterId, name, tpl.guided) : newWorkload(clusterId, { ...tpl.values, name });
	w.namespace = tpl.namespace;
	return w;
}

export function sampleScenario(): Scenario {
	const catalog = CATALOGS[0].types.map((x) => ({ ...x }));
	const ids = catalog.map((x) => x.id);
	const shop = newCluster('shop-prod');
	shop.quota = { cpu: 96, memGiB: 384, storageGiB: 2000 };
	const data = newCluster('analytics-prod');
	data.quota = { cpu: 64, memGiB: 512, storageGiB: 4000 };

	const workloads: Workload[] = [
		newWorkload(shop.id, { name: 'storefront', namespace: 'shop', replicas: 4, maxReplicas: 10, cpuRequest: 0.5, cpuLimit: 2, memRequestGiB: 1, memLimitGiB: 2, antiAffinity: 'preferred' }),
		newWorkload(shop.id, { name: 'checkout-api', namespace: 'shop', replicas: 3, maxReplicas: 6, cpuRequest: 1, cpuLimit: 2, memRequestGiB: 2, memLimitGiB: 3, antiAffinity: 'preferred' }),
		newWorkload(shop.id, { name: 'catalog-svc', namespace: 'shop', replicas: 3, maxReplicas: 6, cpuRequest: 0.5, cpuLimit: 1, memRequestGiB: 3, memLimitGiB: 3, antiAffinity: 'preferred' }),
		newWorkload(shop.id, {
			name: 'orders-db',
			namespace: 'shop',
			kind: 'StatefulSet',
			replicas: 3,
			maxReplicas: 3,
			cpuRequest: 2,
			cpuLimit: 4,
			memRequestGiB: 12,
			memLimitGiB: 12,
			storageGiB: 250,
			antiAffinity: 'required',
			pool: 'db'
		}),
		newWorkload(shop.id, { name: 'log-forwarder', namespace: 'logging', kind: 'DaemonSet', replicas: 1, maxReplicas: 1, cpuRequest: 0.1, cpuLimit: 0.5, memRequestGiB: 0.25, memLimitGiB: 0.5, antiAffinity: 'none' }),
		newWorkload(shop.id, { name: 'platform-services', namespace: 'platform', replicas: 2, maxReplicas: 2, cpuRequest: 1, cpuLimit: null, memRequestGiB: 4, memLimitGiB: null, storageGiB: 50, antiAffinity: 'required' }),
		{ ...newGuidedWorkload(shop.id, 'legacy-erp-bridge', { vcpu: 8, ramGiB: 16, cpuBusy: 'low', memBusy: 'medium', availability: 'high', instances: 1, diskGiB: 20, growth: 'none' }), namespace: 'erp' },
		newWorkload(data.id, { name: 'spark-workers', namespace: 'analytics', replicas: 6, maxReplicas: 12, cpuRequest: 2, cpuLimit: 4, memRequestGiB: 14, memLimitGiB: 16, antiAffinity: 'none' }),
		newWorkload(data.id, {
			name: 'kafka',
			namespace: 'kafka',
			kind: 'StatefulSet',
			replicas: 3,
			maxReplicas: 3,
			cpuRequest: 1.5,
			cpuLimit: 3,
			memRequestGiB: 8,
			memLimitGiB: 8,
			storageGiB: 500,
			antiAffinity: 'required'
		}),
		newWorkload(data.id, { name: 'dashboards', namespace: 'analytics', replicas: 2, maxReplicas: 4, cpuRequest: 0.25, cpuLimit: 1, memRequestGiB: 1, memLimitGiB: 2, antiAffinity: 'preferred' }),
		newWorkload(data.id, { name: 'platform-services', namespace: 'platform', replicas: 2, maxReplicas: 2, cpuRequest: 1, cpuLimit: null, memRequestGiB: 4, memLimitGiB: null, storageGiB: 50, antiAffinity: 'required' })
	];

	return {
		version: 1,
		name: 'Classic → HCP migration (sample)',
		catalogName: CATALOGS[0].id,
		catalog,
		assumptions: defaultAssumptions(ids),
		clusters: [shop, data],
		workloads,
		scenarioQuota: { cpu: 200, memGiB: 1024, storageGiB: 8000 },
		classic: defaultClassic('g.8x32')
	};
}

export function emptyScenario(): Scenario {
	const s = sampleScenario();
	const c = newCluster('my-hosted-cluster');
	return { ...s, name: 'Untitled scenario', clusters: [c], workloads: [], scenarioQuota: { cpu: null, memGiB: null, storageGiB: null } };
}
