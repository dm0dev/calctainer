export const fmt = (v: number, digits = 1): string => {
	if (!Number.isFinite(v)) return '—';
	const abs = Math.abs(v);
	const d = abs >= 100 ? 0 : digits;
	return v.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
};

export const pctFmt = (v: number | null | undefined, digits = 0): string =>
	v == null || !Number.isFinite(v) ? '—' : `${(v * 100).toFixed(digits)}%`;

export const money = (v: number, currency: string): string =>
	Number.isFinite(v) ? `${currency}${Math.round(v).toLocaleString('en-US')}` : '—';

export const cores = (v: number) => `${fmt(v, 2)}`;
export const gib = (v: number) => (Math.abs(v) >= 1024 ? `${fmt(v / 1024, 2)} TiB` : `${fmt(v, 1)} GiB`);
