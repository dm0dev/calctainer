import { newWorkload } from './defaults';
import { uniqueNamespace } from './namespaces';
import type { AntiAffinity, PresetBasis, Workload, WorkloadKind } from './types';

/**
 * Official Red Hat operator presets.
 *
 * Each preset expands into one workload per operand/operator pod that runs inside the hosted cluster
 * with the default configuration. Values are taken from Red Hat product documentation where it states
 * them, otherwise from the upstream operator manifests that the Red Hat build is based on. Components
 * that ship without requests get a visible planning allowance, because a zero request would make the
 * pod invisible to capacity planning. Figures were reviewed on 2026-11-01; check your installed version.
 */

/** Planning allowance for components that ship without CPU/memory requests (BestEffort pods). */
export const UNSET_ALLOWANCE = { cpuRequest: 0.1, memRequestGiB: 0.25 } as const;

const mi = (v: number) => Math.round((v / 1024) * 1000) / 1000;

export interface PresetComponent {
	name: string;
	kind: WorkloadKind;
	replicas: number;
	/** HPA maximum when the component ships with an autoscaler; defaults to replicas. */
	maxReplicas?: number;
	cpuRequest: number;
	cpuLimit: number | null;
	memRequestGiB: number;
	memLimitGiB: number | null;
	storageGiB?: number;
	antiAffinity?: AntiAffinity;
	basis: PresetBasis;
	source: string;
	note?: string;
}

export interface OperatorPreset {
	id: string;
	label: string;
	product: string;
	vendor: 'redhat';
	/** Default namespace of the operands; every install of the preset becomes one namespace. */
	namespace: string;
	description: string;
	/** What the preset does not include and must be planned separately. */
	caveats: string[];
	docs: { label: string; url: string }[];
	components: PresetComponent[];
}

const allowance = (name: string, source: string, kind: WorkloadKind = 'Deployment', replicas = 1): PresetComponent => ({
	name,
	kind,
	replicas,
	cpuRequest: UNSET_ALLOWANCE.cpuRequest,
	cpuLimit: null,
	memRequestGiB: UNSET_ALLOWANCE.memRequestGiB,
	memLimitGiB: null,
	basis: 'allowance',
	source,
	note: 'Ships without CPU/memory requests; planner allowance applied.'
});

const DOCS = {
	rhbkOperator: 'https://docs.redhat.com/en/documentation/red_hat_build_of_keycloak/26.2/html-single/operator_guide/index',
	rhbkHa: 'https://docs.redhat.com/en/documentation/red_hat_build_of_keycloak/26.2/html-single/high_availability_guide/index',
	rhbkUpstream: 'https://github.com/keycloak/keycloak/blob/release/26.2/operator/src/main/resources/application.properties',
	gitops: 'https://docs.redhat.com/en/documentation/red_hat_openshift_gitops/1.15/html/installing_gitops/preparing-gitops-install',
	gitopsUpstream: 'https://github.com/redhat-developer/gitops-operator',
	pipelines: 'https://docs.redhat.com/en/documentation/red_hat_openshift_pipelines/1.20/html/installing_and_configuring/index',
	tekton: 'https://github.com/tektoncd/pipeline/releases',
	pac: 'https://github.com/openshift-pipelines/pipelines-as-code',
	ossm: 'https://docs.redhat.com/en/documentation/red_hat_openshift_service_mesh/3.1',
	sail: 'https://github.com/istio-ecosystem/sail-operator/tree/main/resources',
	certManager: 'https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html-single/security_and_compliance/index',
	certManagerUpstream: 'https://github.com/openshift/cert-manager-operator',
	rhacs: 'https://docs.redhat.com/en/documentation/red_hat_advanced_cluster_security_for_kubernetes/4.8/html-single/installing/index',
	logging: 'https://docs.redhat.com/en/documentation/red_hat_openshift_logging/6.3/html-single/configuring_logging/index',
	clo: 'https://github.com/openshift/cluster-logging-operator',
	serverless: 'https://docs.redhat.com/en/documentation/red_hat_openshift_serverless/1.37/html-single/serving/index',
	knative: 'https://github.com/knative/serving/releases/tag/knative-v1.17.0',
	strimzi: 'https://github.com/strimzi/strimzi-kafka-operator/blob/main/packaging/install/cluster-operator/060-Deployment-strimzi-cluster-operator.yaml',
	streams: 'https://docs.redhat.com/en/documentation/red_hat_streams_for_apache_kafka'
};

export const REDHAT_PRESETS: OperatorPreset[] = [
	{
		id: 'rhbk',
		namespace: 'keycloak',
		label: 'Red Hat build of Keycloak',
		product: 'Red Hat build of Keycloak 26',
		vendor: 'redhat',
		description: 'Keycloak server (3 pods, HA guide layout) plus the RHBK operator.',
		caveats: [
			'The external database (PostgreSQL) is not included.',
			'CPU per pod depends on login rate: about 1 vCPU per 15 password logins/s, plus 150 % headroom (HA guide).'
		],
		docs: [
			{ label: 'RHBK Operator Guide', url: DOCS.rhbkOperator },
			{ label: 'RHBK High Availability Guide — sizing', url: DOCS.rhbkHa }
		],
		components: [
			{
				name: 'keycloak',
				kind: 'StatefulSet',
				replicas: 3,
				cpuRequest: 1,
				cpuLimit: 2.5,
				memRequestGiB: mi(1700),
				memLimitGiB: 2,
				antiAffinity: 'preferred',
				basis: 'documented',
				source: DOCS.rhbkOperator,
				note: 'Operator default memory 1700Mi request / 2Gi limit. The CR sets no CPU; 1 vCPU request (≈15 logins/s) and 2.5 vCPU limit follow the HA sizing guide. 3 pods as in the HA guide example (CR default is 1 instance).'
			},
			{
				name: 'rhbk-operator',
				kind: 'Deployment',
				replicas: 1,
				cpuRequest: 0.3,
				cpuLimit: 0.7,
				memRequestGiB: mi(450),
				memLimitGiB: mi(450),
				basis: 'upstream',
				source: DOCS.rhbkUpstream
			}
		]
	},
	{
		id: 'gitops',
		namespace: 'openshift-gitops',
		label: 'OpenShift GitOps',
		product: 'Red Hat OpenShift GitOps 1.15+',
		vendor: 'redhat',
		description: 'Default openshift-gitops Argo CD instance, console plugin and backend, plus the operator.',
		caveats: ['Argo CD HA (redis-ha) is disabled by default and not included.', 'Large fleets need more application-controller and repo-server capacity.'],
		docs: [{ label: 'Installing GitOps — default resource requirements', url: DOCS.gitops }],
		components: [
			{ name: 'argocd-application-controller', kind: 'StatefulSet', replicas: 1, cpuRequest: 0.25, cpuLimit: 2, memRequestGiB: 1, memLimitGiB: 2, basis: 'documented', source: DOCS.gitops },
			{ name: 'argocd-applicationset-controller', kind: 'Deployment', replicas: 1, cpuRequest: 0.25, cpuLimit: 2, memRequestGiB: 0.5, memLimitGiB: 1, basis: 'documented', source: DOCS.gitops },
			{ name: 'argocd-server', kind: 'Deployment', replicas: 1, cpuRequest: 0.125, cpuLimit: 0.5, memRequestGiB: 0.125, memLimitGiB: 0.25, basis: 'documented', source: DOCS.gitops },
			{ name: 'argocd-repo-server', kind: 'Deployment', replicas: 1, cpuRequest: 0.25, cpuLimit: 1, memRequestGiB: 0.25, memLimitGiB: 1, basis: 'documented', source: DOCS.gitops },
			{ name: 'argocd-redis', kind: 'Deployment', replicas: 1, cpuRequest: 0.25, cpuLimit: 0.5, memRequestGiB: 0.125, memLimitGiB: 0.25, basis: 'documented', source: DOCS.gitops },
			{ name: 'argocd-dex-server', kind: 'Deployment', replicas: 1, cpuRequest: 0.25, cpuLimit: 0.5, memRequestGiB: 0.125, memLimitGiB: 0.25, basis: 'documented', source: DOCS.gitops },
			{ name: 'gitops-plugin', kind: 'Deployment', replicas: 1, cpuRequest: 0.25, cpuLimit: 0.5, memRequestGiB: 0.125, memLimitGiB: 0.25, basis: 'upstream', source: DOCS.gitopsUpstream },
			{ name: 'gitops-cluster-backend', kind: 'Deployment', replicas: 1, cpuRequest: 0.25, cpuLimit: 0.5, memRequestGiB: 0.125, memLimitGiB: 0.25, basis: 'upstream', source: DOCS.gitopsUpstream },
			allowance('gitops-operator', DOCS.gitopsUpstream)
		]
	},
	{
		id: 'pipelines',
		namespace: 'openshift-pipelines',
		label: 'OpenShift Pipelines',
		product: 'Red Hat OpenShift Pipelines 1.20',
		vendor: 'redhat',
		description: 'Tekton Pipelines, Triggers, Chains and Pipelines-as-Code controllers plus the operator.',
		caveats: ['PipelineRun/TaskRun pods are not included — add them as workloads sized for your builds.', 'Tekton Results (with PostgreSQL) is optional and not included.'],
		docs: [
			{ label: 'Installing and configuring OpenShift Pipelines', url: DOCS.pipelines },
			{ label: 'Tekton release manifests (upstream)', url: DOCS.tekton }
		],
		components: [
			allowance('tekton-pipelines-controller', DOCS.tekton),
			allowance('tekton-events-controller', DOCS.tekton),
			{ name: 'tekton-pipelines-remote-resolvers', kind: 'Deployment', replicas: 1, cpuRequest: 0.1, cpuLimit: 1, memRequestGiB: mi(100), memLimitGiB: 4, basis: 'upstream', source: DOCS.tekton },
			{ name: 'tekton-pipelines-webhook', kind: 'Deployment', replicas: 1, maxReplicas: 5, cpuRequest: 0.1, cpuLimit: 0.5, memRequestGiB: mi(100), memLimitGiB: mi(500), antiAffinity: 'preferred', basis: 'upstream', source: DOCS.tekton, note: 'HPA 1–5 at 100 % CPU.' },
			allowance('tekton-triggers-controller', DOCS.tekton),
			allowance('tekton-triggers-webhook', DOCS.tekton),
			allowance('tekton-triggers-core-interceptors', DOCS.tekton),
			allowance('tekton-chains-controller', DOCS.tekton),
			allowance('pipelines-as-code-controller', DOCS.pac),
			allowance('pipelines-as-code-watcher', DOCS.pac),
			allowance('pipelines-as-code-webhook', DOCS.pac),
			allowance('openshift-pipelines-operator', DOCS.pipelines),
			allowance('tekton-operator-webhook', DOCS.pipelines)
		]
	},
	{
		id: 'servicemesh',
		namespace: 'istio-system',
		label: 'OpenShift Service Mesh 3',
		product: 'Red Hat OpenShift Service Mesh 3 (Sail operator)',
		vendor: 'redhat',
		description: 'istiod control plane, Istio CNI node agent, one ingress gateway, plus the operator.',
		caveats: [
			'Sidecars are not included: every injected pod adds 0.1 CPU / 128 MiB request (limit 2 CPU / 1 GiB) — raise your workloads accordingly.',
			'Ambient mode (ztunnel DaemonSet, waypoints) is not included.'
		],
		docs: [
			{ label: 'OpenShift Service Mesh 3 documentation', url: DOCS.ossm },
			{ label: 'Sail operator Helm values (upstream)', url: DOCS.sail }
		],
		components: [
			{ name: 'istiod', kind: 'Deployment', replicas: 1, maxReplicas: 5, cpuRequest: 0.5, cpuLimit: null, memRequestGiB: 2, memLimitGiB: null, antiAffinity: 'preferred', basis: 'upstream', source: DOCS.sail, note: 'HPA 1–5.' },
			{ name: 'istio-cni-node', kind: 'DaemonSet', replicas: 1, cpuRequest: 0.1, cpuLimit: null, memRequestGiB: mi(100), memLimitGiB: null, basis: 'upstream', source: DOCS.sail },
			{ name: 'istio-ingressgateway', kind: 'Deployment', replicas: 1, maxReplicas: 5, cpuRequest: 0.1, cpuLimit: 2, memRequestGiB: 0.125, memLimitGiB: 1, antiAffinity: 'preferred', basis: 'upstream', source: DOCS.sail, note: 'HPA 1–5 at 80 % CPU.' },
			allowance('servicemesh-operator3', DOCS.ossm)
		]
	},
	{
		id: 'cert-manager',
		namespace: 'cert-manager',
		label: 'cert-manager Operator',
		product: 'cert-manager Operator for Red Hat OpenShift',
		vendor: 'redhat',
		description: 'cert-manager controller, webhook and CA injector, plus the operator.',
		caveats: ['Red Hat docs: operand resources are empty by default (no requests, no limits).'],
		docs: [{ label: 'Security and compliance — cert-manager resources', url: DOCS.certManager }],
		components: [
			allowance('cert-manager', DOCS.certManager),
			allowance('cert-manager-webhook', DOCS.certManager),
			allowance('cert-manager-cainjector', DOCS.certManager),
			{ name: 'cert-manager-operator', kind: 'Deployment', replicas: 1, cpuRequest: 0.01, cpuLimit: null, memRequestGiB: mi(32), memLimitGiB: null, basis: 'upstream', source: DOCS.certManagerUpstream }
		]
	},
	{
		id: 'rhacs',
		namespace: 'stackrox',
		label: 'Advanced Cluster Security (secured cluster)',
		product: 'Red Hat Advanced Cluster Security 4.8 — secured cluster services',
		vendor: 'redhat',
		description: 'Sensor, admission controller, Collector DaemonSet, Scanner V4 indexer and database.',
		caveats: ['Central is assumed to run elsewhere and is not included.', 'Scanner components are skipped automatically when Central runs in the same cluster.'],
		docs: [{ label: 'RHACS installing — default resource requirements', url: DOCS.rhacs }],
		components: [
			{ name: 'sensor', kind: 'Deployment', replicas: 1, cpuRequest: 2, cpuLimit: 4, memRequestGiB: 4, memLimitGiB: 8, basis: 'documented', source: DOCS.rhacs },
			{ name: 'admission-control', kind: 'Deployment', replicas: 3, cpuRequest: 0.05, cpuLimit: 0.5, memRequestGiB: mi(100), memLimitGiB: mi(500), antiAffinity: 'preferred', basis: 'documented', source: DOCS.rhacs },
			{ name: 'collector', kind: 'DaemonSet', replicas: 1, cpuRequest: 0.07, cpuLimit: 2.75, memRequestGiB: mi(340), memLimitGiB: mi(3500), basis: 'documented', source: DOCS.rhacs, note: 'Pod total of collector, compliance and node-inventory containers.' },
			{ name: 'scanner-v4-indexer', kind: 'Deployment', replicas: 2, cpuRequest: 1, cpuLimit: 2, memRequestGiB: mi(1500), memLimitGiB: 3, antiAffinity: 'preferred', basis: 'documented', source: DOCS.rhacs, note: 'Docs list totals for 2 replicas (2 / 4 CPU, 3000 MiB / 6 GiB); shown per replica.' },
			{ name: 'scanner-v4-db', kind: 'StatefulSet', replicas: 1, cpuRequest: 0.2, cpuLimit: 2, memRequestGiB: 2, memLimitGiB: 4, storageGiB: 10, basis: 'documented', source: DOCS.rhacs, note: '10 GiB PVC recommended.' }
		]
	},
	{
		id: 'logging',
		namespace: 'openshift-logging',
		label: 'OpenShift Logging (collector)',
		product: 'Red Hat OpenShift Logging 6',
		vendor: 'redhat',
		description: 'Vector collector DaemonSet and the Cluster Logging Operator.',
		caveats: [
			'LokiStack is not included. Documented request totals: 1x.extra-small 14 vCPU / 31 GiB, 1x.small 34 vCPU / 67 GiB, 1x.medium 54 vCPU / 139 GiB, plus object storage and PVCs.'
		],
		docs: [{ label: 'Configuring logging — Loki deployment sizing', url: DOCS.logging }],
		components: [
			allowance('collector', DOCS.clo, 'DaemonSet'),
			{ name: 'cluster-logging-operator', kind: 'Deployment', replicas: 1, cpuRequest: 0.1, cpuLimit: null, memRequestGiB: 0.125, memLimitGiB: null, basis: 'upstream', source: DOCS.clo }
		]
	},
	{
		id: 'serverless',
		namespace: 'knative-serving',
		label: 'OpenShift Serverless (Serving)',
		product: 'Red Hat OpenShift Serverless 1.37 — Knative Serving',
		vendor: 'redhat',
		description: 'Knative Serving system components with the default high-availability of 2 replicas, Kourier, plus the operator.',
		caveats: ['Knative services (your functions/apps) and their queue-proxy sidecars are not included.'],
		docs: [
			{ label: 'Serverless Serving — default configuration', url: DOCS.serverless },
			{ label: 'Knative Serving 1.17 manifests (upstream)', url: DOCS.knative }
		],
		components: [
			{ name: 'activator', kind: 'Deployment', replicas: 2, maxReplicas: 20, cpuRequest: 0.3, cpuLimit: 1, memRequestGiB: mi(60), memLimitGiB: mi(600), antiAffinity: 'preferred', basis: 'upstream', source: DOCS.knative, note: 'HPA up to 20.' },
			{ name: 'autoscaler', kind: 'Deployment', replicas: 2, cpuRequest: 0.1, cpuLimit: 1, memRequestGiB: mi(100), memLimitGiB: mi(1000), antiAffinity: 'preferred', basis: 'upstream', source: DOCS.knative },
			{ name: 'autoscaler-hpa', kind: 'Deployment', replicas: 2, cpuRequest: 0.03, cpuLimit: 0.3, memRequestGiB: mi(40), memLimitGiB: mi(400), antiAffinity: 'preferred', basis: 'upstream', source: DOCS.knative },
			{ name: 'knative-serving-controller', kind: 'Deployment', replicas: 2, cpuRequest: 0.1, cpuLimit: 1, memRequestGiB: mi(100), memLimitGiB: mi(1000), antiAffinity: 'preferred', basis: 'upstream', source: DOCS.knative },
			{ name: 'knative-serving-webhook', kind: 'Deployment', replicas: 2, maxReplicas: 5, cpuRequest: 0.1, cpuLimit: 0.5, memRequestGiB: mi(100), memLimitGiB: mi(500), antiAffinity: 'preferred', basis: 'upstream', source: DOCS.knative },
			{ name: 'net-kourier-controller', kind: 'Deployment', replicas: 2, cpuRequest: 0.2, cpuLimit: 1, memRequestGiB: mi(200), memLimitGiB: mi(500), antiAffinity: 'preferred', basis: 'upstream', source: DOCS.knative },
			{ name: '3scale-kourier-gateway', kind: 'Deployment', replicas: 2, maxReplicas: 10, cpuRequest: 0.2, cpuLimit: 1, memRequestGiB: mi(200), memLimitGiB: mi(800), antiAffinity: 'preferred', basis: 'upstream', source: DOCS.knative },
			{
				name: 'serverless-operator',
				kind: 'Deployment',
				replicas: 1,
				cpuRequest: 0.2,
				cpuLimit: null,
				memRequestGiB: mi(1000),
				memLimitGiB: null,
				basis: 'measured',
				source: DOCS.serverless,
				note: 'Red Hat docs report ≈0.2 cores / 1 GB consumed in openshift-serverless.'
			}
		]
	},
	{
		id: 'streams',
		namespace: 'kafka',
		label: 'Streams for Apache Kafka (operator)',
		product: 'Red Hat Streams for Apache Kafka',
		vendor: 'redhat',
		description: 'Cluster Operator only.',
		caveats: ['Kafka brokers/controllers ship without default resources — add them sized for your throughput (e.g. with the Message broker template).'],
		docs: [
			{ label: 'Streams for Apache Kafka documentation', url: DOCS.streams },
			{ label: 'Strimzi Cluster Operator deployment (upstream)', url: DOCS.strimzi }
		],
		components: [{ name: 'strimzi-cluster-operator', kind: 'Deployment', replicas: 1, cpuRequest: 0.2, cpuLimit: 1, memRequestGiB: 0.375, memLimitGiB: 0.375, basis: 'upstream', source: DOCS.strimzi }]
	}
];

export const BASIS_LABEL: Record<PresetBasis, string> = {
	documented: 'Red Hat docs',
	upstream: 'upstream default',
	measured: 'measured (Red Hat docs)',
	allowance: 'planner allowance'
};

/**
 * Expand a preset into workloads in its own namespace. When the preset namespace is already used in the
 * cluster (e.g. a second install), a numbered namespace is chosen so installs never mix.
 */
export function workloadsFromPreset(clusterId: string, preset: OperatorPreset, takenNamespaces: Iterable<string> = []): Workload[] {
	const namespace = uniqueNamespace(preset.namespace, takenNamespaces);
	return preset.components.map((c) => {
		const replicas = c.kind === 'DaemonSet' ? 1 : c.replicas;
		return newWorkload(clusterId, {
			name: c.name,
			namespace,
			kind: c.kind,
			replicas,
			maxReplicas: c.kind === 'DaemonSet' ? 1 : Math.max(replicas, c.maxReplicas ?? replicas),
			cpuRequest: c.cpuRequest,
			cpuLimit: c.cpuLimit,
			memRequestGiB: c.memRequestGiB,
			memLimitGiB: c.memLimitGiB,
			storageGiB: c.storageGiB ?? 0,
			antiAffinity: c.antiAffinity ?? 'none',
			pool: '',
			notes: [`${preset.product}: ${BASIS_LABEL[c.basis]}.`, c.note].filter(Boolean).join(' '),
			preset: { id: preset.id, label: preset.label, vendor: 'redhat', basis: c.basis, source: c.source }
		});
	});
}

/** Sum of baseline requests a preset adds (DaemonSets counted once per node). */
export function presetFootprint(preset: OperatorPreset): { pods: number; cpu: number; memGiB: number; daemonCpu: number; daemonMemGiB: number; storageGiB: number } {
	let pods = 0,
		cpu = 0,
		memGiB = 0,
		daemonCpu = 0,
		daemonMemGiB = 0,
		storageGiB = 0;
	for (const c of preset.components) {
		if (c.kind === 'DaemonSet') {
			daemonCpu += c.cpuRequest;
			daemonMemGiB += c.memRequestGiB;
			continue;
		}
		pods += c.replicas;
		cpu += c.replicas * c.cpuRequest;
		memGiB += c.replicas * c.memRequestGiB;
		storageGiB += c.replicas * (c.storageGiB ?? 0);
	}
	return { pods, cpu, memGiB, daemonCpu, daemonMemGiB, storageGiB };
}
