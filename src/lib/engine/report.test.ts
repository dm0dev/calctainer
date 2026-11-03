import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { analyzeScenario } from './analyze';
import { newPool, newWorkload, sampleScenario } from './defaults';
import { automaticQuota } from './quotas';
import { createQuotaWorkbook, quotaReport, quotaWorkbookBytes } from './report';

function fixture() {
	const s = sampleScenario();
	s.clusters.forEach((c, i) => {
		c.poolMode = 'manual';
		c.nodePools = [
			{ ...newPool('general', s.catalog[0].id, 2), autoscaling: true, minReplicas: 1, maxReplicas: 5 + i },
			{ ...newPool('db', s.catalog[1].id, 1), dedicated: true }
		];
		c.quota = i === 0 ? { auto: true, cpu: 1, memGiB: 2, storageGiB: 0 } : { cpu: 0, memGiB: null, storageGiB: 1 };
	});
	s.scenarioQuota = { auto: true, cpu: 999, memGiB: 999, storageGiB: 1 };
	s.workloads.push(newWorkload(s.clusters[0].id, { kind: 'DaemonSet', storageGiB: 7 }));
	s.workloads.push(newWorkload(s.clusters[0].id, { enabled: false, storageGiB: 99999 }));
	return s;
}

describe('quota report projection', () => {
	it('matches engine caps, maximum footprint and pool contributions across clusters', () => {
		const s = fixture();
		const r = analyzeScenario(s, 'expert');
		const sheets = quotaReport(s, 'expert', new Date('2026-11-03T12:00:00Z'));
		const quotas = sheets.find((sheet) => sheet.name === 'Quotas')!;
		expect(quotas.rows).toHaveLength(3 * (s.clusters.length + 1));
		[r, ...r.clusters].forEach((scope, i) => scope.quota.forEach((l, j) => {
			const row = quotas.rows[i * 3 + j];
			expect(row[8]).toBe(l.quota);
			expect(row[9]).toBe(l.used);
			expect(row[10]).toBe(l.quota == null ? null : l.quota - l.used);
		}));
		const pools = sheets.find((sheet) => sheet.name === 'Pools')!;
		expect(pools.rows.reduce((sum, row) => sum + Number(row[19]), 0)).toBe(r.quotaTotals.vcpu);
		expect(pools.rows.reduce((sum, row) => sum + Number(row[20]), 0)).toBe(r.quotaTotals.memGiB);
		expect(pools.rows.reduce((sum, row) => sum + Number(row[17]), 0)).toBe(r.totals.vcpu);
		expect(r.quotaTotals.vcpu).toBeGreaterThan(r.totals.vcpu);
		const expectedCpu = r.clusters.reduce((sum, c) => sum + automaticQuota(c.quotaTotals.vcpu, 1, 15), 0);
		expect(quotas.rows[0][7]).toBe(expectedCpu);
		expect(quotas.rows[0][8]).toBe(expectedCpu);
		expect(quotas.rows[3][6]).toBe(1);
		expect(quotas.rows[3][8]).not.toBe(1);
	});

	it('preserves zero, missing and exceeded caps without invalid numbers', () => {
		const quotas = quotaReport(fixture(), 'standard').find((sheet) => sheet.name === 'Quotas')!;
		const cpu = quotas.rows[6];
		expect(cpu[8]).toBe(0);
		expect(Number(cpu[10])).toBeLessThan(0);
		expect(cpu[12]).toBeNull();
		expect(cpu[13]).toBe('Exceeded');
		const mem = quotas.rows[7];
		expect(mem.slice(8, 9)).toEqual([null]);
		expect(mem[10]).toBeNull();
		expect(mem[13]).toBe('Unset');
		const overview = quotaReport(fixture(), 'standard')[0];
		expect(overview.rows).toContainEqual(['Cluster mem allocation completeness', 'Incomplete: at least one cluster cap is unset']);
	});

	it('counts DaemonSet PVC at maximum and includes unscheduled peak demand, not disabled inputs', () => {
		const s = fixture();
		s.workloads = [
			newWorkload(s.clusters[0].id, { kind: 'DaemonSet', storageGiB: 7, cpuRequest: 0, memRequestGiB: 0 }),
			newWorkload(s.clusters[0].id, { replicas: 1, maxReplicas: 9, cpuRequest: 9999, storageGiB: 11 }),
			newWorkload(s.clusters[0].id, { enabled: false, storageGiB: 99999 })
		];
		const sheets = quotaReport(s, 'expert');
		const storage = sheets[1].rows[2];
		expect(storage[9]).toBe(6 * 7 + 9 * 11);
		expect(sheets.find((sheet) => sheet.name === 'Workloads')!.rows).toHaveLength(3);
		expect(Number(sheets[0].rows.find((row) => row[0] === 'Unscheduled peak pods')![1])).toBeGreaterThan(0);
	});

	it('represents zero consumption against a zero cap as zero percent', () => {
		const s = sampleScenario();
		s.clusters = [];
		s.workloads = [];
		s.scenarioQuota = { cpu: 0, memGiB: 0, storageGiB: 0 };
		const rows = quotaReport(s, 'guided')[1].rows;
		expect(rows.every((row) => row[12] === 0 && row[13] === 'Within quota')).toBe(true);
	});

	it('rejects current invalid inputs rather than exporting cached results and never mutates input', () => {
		const s = fixture();
		const before = structuredClone(s);
		quotaReport(s, 'expert');
		expect(s).toEqual(before);
		s.assumptions.quotaHeadroomPct = 101;
		expect(() => quotaReport(s, 'expert')).toThrow(/100/);
	});
});

describe('Excel workbook', () => {
	it('round trips numeric cells, stable sheets, literal untrusted strings and presentation', async () => {
		const s = fixture();
		s.name = '=1+2';
		s.workloads[0].name = '+SUM(A1:A2)';
		s.workloads[0].notes = '@evil\n=HYPERLINK("https://example.test")';
		const bytes = await quotaWorkbookBytes(s, 'expert');
		const book = new ExcelJS.Workbook();
		await book.xlsx.load(bytes);
		expect(book.worksheets.map((sheet) => sheet.name)).toEqual(['Overview', 'Quotas', 'Pools', 'Workloads', 'Assumptions', 'Findings']);
		expect(book.getWorksheet('Quotas')!.getCell('C2').value).toBe('=1+2');
		expect(book.getWorksheet('Workloads')!.getCell('E2').value).toBe('+SUM(A1:A2)');
		expect(book.getWorksheet('Workloads')!.getCell('R2').value).toBe(s.workloads[0].notes);
		expect(book.getWorksheet('Quotas')!.getCell('J2').type).toBe(ExcelJS.ValueType.Number);
		expect(book.getWorksheet('Quotas')!.getCell('M2').numFmt).toBe('0.0%');
		expect(book.getWorksheet('Quotas')!.views[0]).toMatchObject({ state: 'frozen', ySplit: 1 });
		expect(book.getWorksheet('Quotas')!.autoFilter).toBeTruthy();
		for (const sheet of book.worksheets) sheet.eachRow((row) => row.eachCell((cell) => {
			expect(cell.type).not.toBe(ExcelJS.ValueType.Formula);
			if (typeof cell.value === 'number') expect(Number.isFinite(cell.value)).toBe(true);
		}));
	});

	it('records effective mode-specific assumptions and generated timestamp', async () => {
		const s = fixture();
		s.assumptions.memLimitOvercommitWarn = 2;
		const timestamp = new Date('2026-11-03T12:00:00Z');
		const sheets = quotaReport(s, 'guided', timestamp);
		expect(sheets[0].rows).toContainEqual(['Generated at (UTC)', timestamp.toISOString()]);
		expect(sheets[4].rows).toContainEqual(['Effective assumption', 'memLimitOvercommitWarn', 1]);
		const book = await createQuotaWorkbook(s, 'guided', timestamp);
		expect(book.getWorksheet('Quotas')!.getCell('A1').fill).toMatchObject({ fgColor: { argb: 'FF007194' } });
	});
});
