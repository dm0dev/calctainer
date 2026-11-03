import { analyzeScenario } from './analyze';
import { namespaceOf } from './namespaces';
import { validatePlanningScenario } from './portable';
import { automaticQuota, quotaHeadroomPct, QUOTA_CPU_STEP, QUOTA_MEMORY_STEP } from './quotas';
import type { Mode, Quota, QuotaLine, Scenario } from './types';
import type { Workbook } from 'exceljs';

type Cell = string | number | boolean | null;
export interface ReportSheet {
	name: string;
	headers: string[];
	rows: Cell[][];
}
export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** One synchronous snapshot calculation, never the UI's cached last-valid result. */
export function quotaReport(scenario: Scenario, mode: Mode, generatedAt = new Date()): ReportSheet[] {
	const s = structuredClone(scenario);
	validatePlanningScenario(s);
	const r = analyzeScenario(s, mode);
	const headroom = quotaHeadroomPct(s.assumptions);
	const requirements = r.clusters.map((c) => ({
		cpu: automaticQuota(c.quotaTotals.vcpu, QUOTA_CPU_STEP, headroom),
		mem: automaticQuota(c.quotaTotals.memGiB, QUOTA_MEMORY_STEP, headroom)
	}));
	const quotaRows = (scope: string, id: string, name: string, q: Quota, lines: QuotaLine[], required: { cpu: number; mem: number }): Cell[][] =>
		lines.map((l) => {
			const key = l.resource === 'mem' ? 'memGiB' : l.resource === 'storage' ? 'storageGiB' : 'cpu';
			return [
				scope, id, name, l.resource, l.resource === 'cpu' ? 'cores' : 'GiB',
				q.auto && l.resource !== 'storage' ? 'automatic' : 'manual',
				q[key] ?? null, l.resource === 'storage' ? null : required[l.resource],
				l.quota, l.used, l.quota == null ? null : l.quota - l.used,
				l.quota == null ? null : Math.max(l.used - l.quota, 0),
				l.pct != null && Number.isFinite(l.pct) ? l.pct : null,
				l.quota == null ? 'Unset' : l.used > l.quota ? 'Exceeded' : l.pct != null && l.pct > 0.85 ? 'Near limit' : 'Within quota',
				l.requests, l.limits
			];
		});
	const scenarioRequired = requirements.reduce((a, b) => ({ cpu: a.cpu + b.cpu, mem: a.mem + b.mem }), { cpu: 0, mem: 0 });
	const overview: Cell[][] = [
		['Scenario', s.name], ['Generated at (UTC)', generatedAt.toISOString()], ['Report schema version', 1],
		['Calculation mode', mode],
		['Scope', 'Planning estimates for hosted-cluster workers only. Management clusters and hosted control planes are excluded.'],
		['Quota consumption', 'CPU/RAM: full VM capacity at pool maximum; PVC: peak requests including DaemonSets at pool maximum. Not observed usage.'],
		['Calculated requirement', 'CPU/RAM maximum footprint plus headroom, rounded per cluster. An estimated allowance to request, not a granted budget.'],
		['Current selected worker nodes', r.totals.nodes], ['Current selected worker CPU (cores)', r.totals.vcpu],
		['Current selected worker memory (GiB)', r.totals.memGiB],
		['Maximum quota worker nodes', r.quotaTotals.nodes], ['Maximum quota CPU (cores)', r.quotaTotals.vcpu],
		['Maximum quota memory (GiB)', r.quotaTotals.memGiB], ['Peak PVC requests (GiB)', r.quotaTotals.storageGiB],
		['Baseline workload requests CPU (cores)', r.totals.reqCpu], ['Baseline workload requests memory (GiB)', r.totals.reqMem],
		['Peak workload requests CPU (cores)', r.quotaTotals.reqCpu], ['Peak workload requests memory (GiB)', r.quotaTotals.reqMem],
		['Baseline workload limits CPU (cores)', r.totals.limCpu], ['Baseline workload limits memory (GiB)', r.totals.limMem],
		['Peak workload limits CPU (cores)', r.quotaTotals.limCpu], ['Peak workload limits memory (GiB)', r.quotaTotals.limMem],
		['Findings', r.findings.length], ['Unscheduled baseline pods', r.clusters.reduce((sum, c) => sum + c.sim.unscheduled.length, 0)],
		['Unscheduled peak pods', r.clusters.reduce((sum, c) => sum + c.peak.unscheduled.length, 0)],
		['Free quota', 'Effective cap minus planned consumption. Negative values indicate a shortfall; blank means no cap set.'],
		['Zero quota', 'Zero is a real cap. Exceeded zero caps have blank utilization (not Infinity).'],
		['Workload limits', 'Risk context, not scheduling input. Missing limits use requests in aggregate engine totals.'],
		['Storage', 'External per-replica PVC requests only; VM disks are excluded.'],
		['Backup', 'This workbook is export-only. Save scenario JSON and assumptions JSON for a reproducible backup.']
	];
	for (const line of r.quota) {
		const unit = line.resource === 'cpu' ? 'cores' : 'GiB';
		const clusterLines = r.clusters.map((c) => c.quota.find((l) => l.resource === line.resource)!);
		const complete = clusterLines.every((l) => l.quota != null);
		overview.push(
			[`Scenario ${line.resource} allowance (${unit})`, line.quota],
			[`Scenario ${line.resource} consumed (${unit})`, line.used],
			[`Scenario ${line.resource} free (${unit})`, line.quota == null ? null : line.quota - line.used],
			[`Sum cluster ${line.resource} allowances (${unit})`, complete ? clusterLines.reduce((sum, l) => sum + l.quota!, 0) : null],
			[`Cluster ${line.resource} allocation completeness`, complete ? 'Complete' : 'Incomplete: at least one cluster cap is unset']
		);
	}
	const sheets: ReportSheet[] = [
		{ name: 'Overview', headers: ['Metric', 'Value'], rows: overview },
		{
			name: 'Quotas',
			headers: ['Scope', 'Scope ID', 'Name', 'Resource', 'Unit', 'Mode', 'Saved manual cap', 'Calculated requirement', 'Effective cap', 'Consumed', 'Free', 'Exceeded amount', 'Utilization', 'Status', 'Peak workload requests', 'Peak workload limits'],
			rows: [
				...quotaRows('scenario', 'scenario', s.name, s.scenarioQuota, r.quota, scenarioRequired),
				...r.clusters.flatMap((c, i) => quotaRows('cluster', c.clusterId, c.name, s.clusters.find((x) => x.id === c.clusterId)!.quota, c.quota, requirements[i]))
			]
		},
		{
			name: 'Pools',
			headers: ['Cluster ID', 'Cluster', 'Pool', 'Source', 'Dedicated', 'Pinned', 'Instance ID', 'Instance', 'vCPU per VM', 'Memory GiB per VM', 'Autoscaling', 'Minimum nodes', 'Selected nodes', 'Maximum nodes', 'Raw baseline nodes', 'Raw peak nodes', 'Spare nodes', 'Selected CPU cores', 'Selected memory GiB', 'Maximum CPU cores', 'Maximum memory GiB', 'Allocatable CPU per node', 'Allocatable memory GiB per node', 'Daemon CPU per node', 'Daemon memory GiB per node', 'Explanation'],
			rows: r.clusters.flatMap((c) => c.pools.map((p) => [
				c.clusterId, c.name, p.name, p.source, p.dedicated, p.pinned, p.type.id, p.type.name, p.type.vcpu, p.type.memoryGiB,
				p.autoscaling, p.minNodes, p.nodes, p.maxNodes, p.nodesBase, p.nodesPeak, p.spare,
				p.nodes * p.type.vcpu, p.nodes * p.type.memoryGiB, p.maxNodes * p.type.vcpu, p.maxNodes * p.type.memoryGiB,
				p.allocatablePerNode.cpu, p.allocatablePerNode.mem, p.daemonPerNode.cpu, p.daemonPerNode.mem, p.explanation.join('\n')
			]))
		},
		{
			name: 'Workloads',
			headers: ['Workload ID', 'Cluster ID', 'Cluster', 'Namespace', 'Name', 'Kind', 'Enabled', 'Baseline replicas', 'Peak replicas', 'CPU request cores per replica', 'CPU limit cores per replica', 'Memory request GiB per replica', 'Memory limit GiB per replica', 'PVC GiB per replica', 'Storage class', 'Target pool', 'Anti-affinity', 'Notes', 'Guided profile JSON', 'Preset provenance JSON', 'Replica semantics'],
			rows: s.workloads.map((w) => [
				w.id, w.clusterId, s.clusters.find((c) => c.id === w.clusterId)!.name, namespaceOf(w), w.name, w.kind, w.enabled,
				w.replicas, w.maxReplicas, w.cpuRequest, w.cpuLimit, w.memRequestGiB, w.memLimitGiB, w.storageGiB,
				w.storageClass ?? '', w.pool, w.antiAffinity, w.notes ?? '', w.guided ? JSON.stringify(w.guided) : '',
				w.preset ? JSON.stringify(w.preset) : '', w.kind === 'DaemonSet' ? 'One per eligible node; replica fields ignored' : 'Baseline / HPA peak'
			])
		},
		{
			name: 'Assumptions', headers: ['Category', 'Key', 'Value'],
			rows: [
				...Object.entries(s.assumptions).map(([key, value]): Cell[] => ['Saved assumption', key, Array.isArray(value) ? JSON.stringify(value) : value ?? null]),
				['Effective assumption', 'quotaHeadroomPct', headroom],
				['Effective assumption', 'memLimitOvercommitWarn', mode === 'expert' ? s.assumptions.memLimitOvercommitWarn : 1],
				['Quota rounding', 'CPU step (cores)', QUOTA_CPU_STEP], ['Quota rounding', 'Memory step (GiB)', QUOTA_MEMORY_STEP],
				['Catalogue', 'Name', s.catalogName],
				...s.catalog.map((t): Cell[] => ['Instance type', t.id, JSON.stringify(t)])
			]
		},
		{
			name: 'Findings', headers: ['ID', 'Severity', 'Category', 'Cluster ID', 'Title', 'Detail', 'Action'],
			rows: r.findings.map((f) => [f.id, f.severity, f.category, f.clusterId, f.title, f.detail, f.action ?? ''])
		}
	];
	for (const sheet of sheets) for (const row of sheet.rows) for (const value of row)
		if (typeof value === 'number' && !Number.isFinite(value)) throw new Error(`Report ${sheet.name}: non-finite numeric value.`);
	return sheets;
}

export async function createQuotaWorkbook(s: Scenario, mode: Mode, generatedAt = new Date()): Promise<Workbook> {
	const sheets = quotaReport(s, mode, generatedAt);
	const { default: ExcelJS } = await import('exceljs');
	const workbook = new ExcelJS.Workbook();
	workbook.creator = 'Calctainer';
	workbook.created = generatedAt;
	workbook.subject = 'Hosted-cluster worker quota planning estimate';
	for (const data of sheets) {
		const sheet = workbook.addWorksheet(data.name, { views: [{ state: 'frozen', ySplit: 1 }] });
		sheet.columns = data.headers.map((header) => ({
			header, width: data.name === 'Overview' ? (header === 'Metric' ? 45 : 95) : Math.min(42, Math.max(18, header.length + 3))
		}));
		for (const values of data.rows) sheet.addRow(values);
		sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(1, sheet.rowCount), column: data.headers.length } };
		sheet.eachRow((row, index) => {
			row.eachCell((cell) => {
				cell.font = { name: typeof cell.value === 'number' ? 'Red Hat Mono' : 'Red Hat Display', size: 11 };
				cell.alignment = { vertical: 'top', wrapText: true };
				if (typeof cell.value === 'number') cell.numFmt = '#,##0.00;[Red]-#,##0.00;0';
				if (index === 1) {
					cell.font = { name: 'Red Hat Display', bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
					cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF007194' } };
				} else if (index % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
			});
		});
		sheet.getRow(1).height = 32;
		if (data.name === 'Overview') {
			sheet.getRow(2).font = { name: 'Red Hat Display', bold: true, size: 16, color: { argb: 'FF007194' } };
		}
		if (data.name === 'Quotas') {
			sheet.getColumn(13).numFmt = '0.0%';
			sheet.addConditionalFormatting({
				ref: `N2:N${sheet.rowCount}`,
				rules: [
					{ type: 'containsText', operator: 'containsText', text: 'Exceeded', priority: 1, style: { font: { bold: true, color: { argb: 'FFA60000' } }, fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFE0E0' } } } },
					{ type: 'containsText', operator: 'containsText', text: 'Within quota', priority: 2, style: { font: { color: { argb: 'FF217563' } } } }
				]
			});
		}
	}
	return workbook;
}

export async function quotaWorkbookBytes(s: Scenario, mode: Mode): Promise<ArrayBuffer> {
	const workbook = await createQuotaWorkbook(s, mode);
	const bytes = await workbook.xlsx.writeBuffer();
	// Copy to a native ArrayBuffer accepted by Blob in both browser and Node typings.
	return new Uint8Array(bytes).buffer;
}
