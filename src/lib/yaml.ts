import { namespaceOf } from './engine/namespaces';
import type { Workload } from './engine/types';

const cpuQ = (v: number) => (v < 1 || !Number.isInteger(v) ? `${Math.round(v * 1000)}m` : `${v}`);
const memQ = (v: number) => (Number.isInteger(v) ? `${v}Gi` : `${Math.round(v * 1024)}Mi`);

/** Minimal manifest preview so expert users can compare planner values with real YAML. */
export function workloadYaml(w: Workload): string {
	const name = w.name.toLowerCase().replace(/[^a-z0-9-]+/g, '-') || 'app';
	const res = [
		'          resources:',
		'            requests:',
		`              cpu: ${cpuQ(w.cpuRequest)}`,
		`              memory: ${memQ(w.memRequestGiB)}`
	];
	if (w.cpuLimit != null || w.memLimitGiB != null) {
		res.push('            limits:');
		if (w.cpuLimit != null) res.push(`              cpu: ${cpuQ(w.cpuLimit)}`);
		if (w.memLimitGiB != null) res.push(`              memory: ${memQ(w.memLimitGiB)}`);
	}
	const lines = [
		'apiVersion: apps/v1',
		`kind: ${w.kind === 'Job' ? 'Deployment # Job modelled as long-running' : w.kind}`,
		'metadata:',
		`  name: ${name}`,
		`  namespace: ${namespaceOf(w)}`,
		'spec:'
	];
	if (w.kind !== 'DaemonSet') lines.push(`  replicas: ${w.replicas}`);
	lines.push('  selector:', '    matchLabels:', `      app: ${name}`, '  template:', '    metadata:', '      labels:', `        app: ${name}`, '    spec:');
	if (w.pool) {
		lines.push('      nodeSelector:', `        hypershift.openshift.io/nodePool: ${w.pool}`);
		lines.push('      tolerations:', `        - key: dedicated`, `          value: ${w.pool}`, '          effect: NoSchedule');
	}
	if (w.antiAffinity !== 'none' && w.kind !== 'DaemonSet') {
		lines.push('      affinity:', '        podAntiAffinity:');
		if (w.antiAffinity === 'required') {
			lines.push(
				'          requiredDuringSchedulingIgnoredDuringExecution:',
				'            - topologyKey: kubernetes.io/hostname',
				`              labelSelector: { matchLabels: { app: ${name} } }`
			);
		} else {
			lines.push(
				'          preferredDuringSchedulingIgnoredDuringExecution:',
				'            - weight: 100',
				'              podAffinityTerm:',
				'                topologyKey: kubernetes.io/hostname',
				`                labelSelector: { matchLabels: { app: ${name} } }`
			);
		}
	}
	lines.push('      containers:', `        - name: ${name}`, '          image: <image>', ...res);
	if (w.storageGiB > 0) {
		if (w.kind === 'StatefulSet') {
			lines.push(
				'  volumeClaimTemplates:',
				'    - metadata:',
				'        name: data',
				'      spec:',
				'        accessModes: [ReadWriteOnce]',
				...(w.storageClass ? [`        storageClassName: ${w.storageClass}`] : []),
				'        resources:',
				'          requests:',
				`            storage: ${memQ(w.storageGiB)}`
			);
		} else {
			lines.push(`# + PersistentVolumeClaim ${memQ(w.storageGiB)} per replica`);
		}
	}
	if (w.maxReplicas > w.replicas && w.kind !== 'DaemonSet') {
		lines.push(
			'---',
			'apiVersion: autoscaling/v2',
			'kind: HorizontalPodAutoscaler',
			'metadata:',
			`  name: ${name}`,
			'spec:',
			`  scaleTargetRef: { apiVersion: apps/v1, kind: ${w.kind}, name: ${name} }`,
			`  minReplicas: ${w.replicas}`,
			`  maxReplicas: ${w.maxReplicas}`
		);
	}
	return lines.join('\n');
}
