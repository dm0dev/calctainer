import type { AntiAffinity, Availability, Busy, Growth, GuidedProfile, Workload } from './types';

/** Share of the VM's vCPU the app typically uses → becomes the CPU request. */
export const CPU_BUSY: Record<Busy, number> = { low: 0.2, medium: 0.45, high: 0.75 };
/** Share of the VM's RAM the app typically uses → becomes the memory request. */
export const MEM_BUSY: Record<Busy, number> = { low: 0.5, medium: 0.7, high: 0.9 };

export const AVAILABILITY: Record<Availability, { minReplicas: number; anti: AntiAffinity; label: string; plain: string }> = {
	basic: { minReplicas: 1, anti: 'none', label: 'Can be down briefly', plain: 'One copy is enough; a restart of a few seconds is acceptable.' },
	high: { minReplicas: 2, anti: 'preferred', label: 'Should stay up', plain: 'Two copies, ideally on different servers.' },
	critical: { minReplicas: 3, anti: 'required', label: 'Must never stop', plain: 'Three copies, always on different servers.' }
};

export const GROWTH: Record<Growth, { factor: number; label: string }> = {
	none: { factor: 1, label: 'Steady load' },
	some: { factor: 1.5, label: 'Grows at peak times' },
	burst: { factor: 3, label: 'Large spikes' }
};

/** Round to a step without binary floating-point noise (e.g. 1.2000000000000002 → 1.2); never below one step. */
export const roundStep = (v: number, step: number) => Math.max(step, Number((Math.round(v / step) * step).toFixed(6)));
const round = roundStep;

/** Smallest VM size accepted by the translation; matches the guided input minimum. */
export const MIN_VM_SIZE = 0.25;

export interface GuidedTranslation {
	replicas: number;
	maxReplicas: number;
	cpuRequest: number;
	cpuLimit: number;
	memRequestGiB: number;
	memLimitGiB: number;
	storageGiB: number;
	antiAffinity: AntiAffinity;
	explain: string[];
}

/**
 * Translate a VM-style description into Kubernetes sizing.
 * A VM is sized for its peak; a pod requests what it typically needs and may burst to its limit.
 * When several copies run, each copy carries a share of the VM's load.
 */
export function translateGuided(input: GuidedProfile): GuidedTranslation {
	const { profile: p, adjusted } = normalizeGuided(input);
	const avail = AVAILABILITY[p.availability];
	const replicas = Math.max(p.instances, avail.minReplicas);
	const loadShare = p.instances / replicas;
	const cpuRequest = round(p.vcpu * CPU_BUSY[p.cpuBusy] * loadShare, 0.05);
	const cpuLimit = Math.max(cpuRequest, round(p.vcpu * loadShare, 0.1));
	const memRequestGiB = round(p.ramGiB * MEM_BUSY[p.memBusy] * Math.max(loadShare, 0.6), 0.125);
	const memLimitGiB = Math.max(memRequestGiB, round(p.ramGiB * Math.max(loadShare, 0.6), 0.125));
	const maxReplicas = Math.max(replicas, Math.ceil(replicas * GROWTH[p.growth].factor));
	const explain = [
		`${replicas} cop${replicas === 1 ? 'y' : 'ies'} (replicas) of the app run side by side${replicas > p.instances ? ' because of the availability you chose' : ''}.`,
		`Each copy reserves ${cpuRequest} CPU core(s) (request) and may briefly use up to ${cpuLimit} (limit).`,
		`Each copy reserves ${memRequestGiB} GiB memory and is stopped if it exceeds ${memLimitGiB} GiB.`,
		avail.anti === 'required'
			? 'Copies are forced onto different servers (required anti-affinity).'
			: avail.anti === 'preferred'
				? 'Copies are spread across servers when possible (preferred anti-affinity).'
				: 'Copies may share a server.',
		maxReplicas > replicas ? `At peak times the platform may add copies automatically, up to ${maxReplicas} (HPA).` : 'The number of copies stays fixed.'
	];
	if (adjusted.length) explain.push(`Adjusted invalid input: ${adjusted.join('; ')}.`);
	if (p.diskGiB > 0) explain.push(`Each copy gets ${p.diskGiB} GiB of external storage (PersistentVolumeClaim).`);
	return { replicas, maxReplicas, cpuRequest, cpuLimit, memRequestGiB, memLimitGiB, storageGiB: p.diskGiB, antiAffinity: avail.anti, explain };
}

/**
 * Make a guided profile safe to translate. Non-numeric or out-of-range values would otherwise
 * produce NaN or negative sizing that looks like a plausible estimate; every adjustment is reported.
 */
export function normalizeGuided(p: GuidedProfile): { profile: GuidedProfile; adjusted: string[] } {
	const adjusted: string[] = [];
	const fix = (label: string, v: number, min: number, fallback: number): number => {
		if (!Number.isFinite(v)) {
			adjusted.push(`${label} was not a number, using ${fallback}`);
			return fallback;
		}
		if (v < min) {
			adjusted.push(`${label} ${v} raised to ${min}`);
			return min;
		}
		return v;
	};
	const pick = <T extends string>(label: string, v: T, table: Record<T, unknown>, fallback: T): T => {
		if (Object.hasOwn(table, v)) return v;
		adjusted.push(`unknown ${label} "${String(v)}", using ${fallback}`);
		return fallback;
	};
	const instances = Math.round(fix('number of VMs', p.instances, 1, 1));
	return {
		profile: {
			...p,
			vcpu: fix('vCPU', p.vcpu, MIN_VM_SIZE, 1),
			ramGiB: fix('memory', p.ramGiB, MIN_VM_SIZE, 1),
			instances: Math.max(1, instances),
			diskGiB: fix('disk', p.diskGiB, 0, 0),
			cpuBusy: pick('CPU usage', p.cpuBusy, CPU_BUSY, 'medium'),
			memBusy: pick('memory usage', p.memBusy, MEM_BUSY, 'medium'),
			availability: pick('availability', p.availability, AVAILABILITY, 'high'),
			growth: pick('load pattern', p.growth, GROWTH, 'none')
		},
		adjusted
	};
}

export function applyGuided(w: Workload): void {
	if (!w.guided) return;
	const tr = translateGuided(w.guided);
	w.replicas = tr.replicas;
	w.maxReplicas = tr.maxReplicas;
	w.cpuRequest = tr.cpuRequest;
	w.cpuLimit = tr.cpuLimit;
	w.memRequestGiB = tr.memRequestGiB;
	w.memLimitGiB = tr.memLimitGiB;
	w.storageGiB = tr.storageGiB;
	w.antiAffinity = tr.antiAffinity;
	w.kind = tr.storageGiB > 0 ? 'StatefulSet' : 'Deployment';
}

export const defaultGuided = (): GuidedProfile => ({
	vcpu: 4,
	ramGiB: 8,
	cpuBusy: 'medium',
	memBusy: 'medium',
	availability: 'high',
	instances: 1,
	diskGiB: 0,
	growth: 'some'
});
