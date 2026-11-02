import type { Assumptions } from './types';

export const DEFAULT_QUOTA_HEADROOM_PCT = 15;
export const QUOTA_CPU_STEP = 1;
export const QUOTA_MEMORY_STEP = 16;

export function quotaHeadroomError(value: unknown): string | null {
	return value !== undefined && (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100)
		? 'Automatic quota headroom must be a percentage between 0 and 100.'
		: null;
}

export function quotaHeadroomPct(a: Pick<Assumptions, 'quotaHeadroomPct'>): number {
	const error = quotaHeadroomError(a.quotaHeadroomPct);
	if (error) throw new Error(error);
	return a.quotaHeadroomPct ?? DEFAULT_QUOTA_HEADROOM_PCT;
}

export function automaticQuota(peak: number, step: number, headroomPct: number): number {
	const required = peak * (1 + headroomPct / 100);
	const steps = required / step;
	const nearest = Math.round(steps);
	// Ignore binary arithmetic noise at exact step boundaries, never meaningful shortfalls.
	return (Math.abs(steps - nearest) <= Number.EPSILON * Math.max(1, steps) * 4 ? nearest : Math.ceil(steps)) * step;
}
