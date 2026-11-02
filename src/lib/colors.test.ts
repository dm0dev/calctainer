import { describe, expect, it } from 'vitest';
import { colorMap, workloadColor } from './colors';

describe('workload metric palette', () => {
	it('uses deterministic, theme-aware purple, pink, and mint shades', () => {
		const colors = Array.from({ length: 9 }, (_, i) => workloadColor(i));
		expect(new Set(colors).size).toBe(9);
		for (const [i, color] of colors.entries()) {
			expect(color).toBe(workloadColor(i));
			expect(color).toMatch(/^light-dark\(oklch\(45% 0\.12 (280|290|300|320|330|340|160|170|180)\), oklch\(78% 0\.1 \1\)\)$/);
		}
	});

	it('maps workload IDs to the same palette used in charts', () => {
		const map = colorMap(['api', 'db', 'cache']);
		expect([...map.values()]).toEqual([workloadColor(0), workloadColor(1), workloadColor(2)]);
	});
});
