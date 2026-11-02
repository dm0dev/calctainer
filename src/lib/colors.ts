/** Deterministic workload series restricted to purple, pink, and mint, not status colours. */
export function workloadColor(index: number): string {
	const hue = [290, 330, 170][index % 3] + ((Math.floor(index / 3) % 3) - 1) * 10;
	return `light-dark(oklch(45% 0.12 ${hue}), oklch(78% 0.1 ${hue}))`;
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
