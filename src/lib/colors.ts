/** Deterministic, theme-friendly colours for workloads (golden-angle hue walk). */
export function workloadColor(index: number): string {
	const hue = (index * 137.508 + 25) % 360;
	return `oklch(68% 0.13 ${hue.toFixed(1)})`;
}

export function colorMap(ids: string[]): Map<string, string> {
	return new Map(ids.map((id, i) => [id, workloadColor(i)]));
}

export const SEVERITY_PRESET = {
	critical: 'preset-filled-error-500',
	warning: 'preset-filled-warning-500',
	info: 'preset-tonal-secondary',
	ok: 'preset-tonal-success'
} as const;

export const CATEGORY_LABEL = {
	under: 'Under-sized',
	over: 'Over-sized',
	quota: 'Quota',
	fragmentation: 'Fragmentation & balance',
	resilience: 'Resilience',
	hygiene: 'Workload hygiene'
} as const;
