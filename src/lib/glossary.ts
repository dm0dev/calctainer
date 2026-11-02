export const GLOSSARY: Record<string, { term: string; text: string }> = {
	request: {
		term: 'Request',
		text: 'The amount of CPU or memory reserved for one copy of an app. The scheduler only places a pod on a node that still has this much unreserved room. Think of it as the guaranteed share of a VM.'
	},
	limit: {
		term: 'Limit',
		text: 'The maximum a pod may use. Exceeding the CPU limit slows the pod down (throttling); exceeding the memory limit stops it (OOM kill). Without a limit the pod may use whatever is free on the node.'
	},
	replica: {
		term: 'Replica',
		text: 'An identical running copy of an app (a pod). Several replicas share the load and keep the app available when one copy or one node fails.'
	},
	hpa: {
		term: 'HPA (Horizontal Pod Autoscaler)',
		text: 'Automatically adds replicas when load rises and removes them when it falls, between a minimum and a maximum.'
	},
	nodepool: {
		term: 'Node pool',
		text: 'A group of identical worker machines (VMs) of one instance type in a hosted cluster. HyperShift manages each NodePool independently and can autoscale it.'
	},
	node: {
		term: 'Node',
		text: 'One worker machine (VM or bare-metal host) that runs pods.'
	},
	allocatable: {
		term: 'Allocatable',
		text: 'The part of a node that pods can actually use: total capacity minus what the kubelet, container runtime and operating system reserve.'
	},
	antiaffinity: {
		term: 'Anti-affinity',
		text: 'A rule that keeps replicas of the same app on different nodes. "Required" is strict (a replica stays Pending if no separate node exists); "preferred" is best-effort.'
	},
	namespace: {
		term: 'Namespace',
		text: 'A named group of related workloads inside a cluster, e.g. everything an operator installs or all parts of one application. In the planner it groups and sums workloads; it does not change scheduling.'
	},
	daemonset: {
		term: 'DaemonSet',
		text: 'A workload that runs exactly one pod on every (matching) node, e.g. log shippers or security agents. Its cost grows with the number of nodes.'
	},
	statefulset: {
		term: 'StatefulSet',
		text: 'A workload whose replicas keep a stable identity and their own persistent volume, e.g. databases and message brokers.'
	},
	quota: {
		term: 'Quota',
		text: 'An allowance of CPU, memory and storage granted to a hosted cluster or to the whole scenario. The planner compares it against node capacity, requests or limits.'
	},
	pvc: {
		term: 'External storage (PVC)',
		text: 'Persistent volumes requested by pods via PersistentVolumeClaims. Storage lives outside the nodes and is counted separately.'
	},
	hcp: {
		term: 'Hosted Control Plane',
		text: 'With HyperShift the control plane of each cluster runs as pods on a shared management cluster. Hosted clusters only contain worker nodes, so there are no master or dedicated infra nodes to pay for.'
	},
	fragmentation: {
		term: 'Fragmentation',
		text: 'Free capacity split into pieces too small (or with the wrong CPU-to-memory mix) to host another pod.'
	},
	stranded: {
		term: 'Stranded capacity',
		text: 'Free CPU that cannot be used because memory on that node is exhausted, or vice versa.'
	},
	spare: {
		term: 'Spare node (N+1)',
		text: 'Extra node kept so that pods can move during node failures or rolling upgrades.'
	},
	target: {
		term: 'Target utilisation',
		text: 'How full the planner fills nodes with requests when sizing. The rest is headroom for bursts, rolling updates and growth.'
	}
};
