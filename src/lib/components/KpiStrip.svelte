<script lang="ts">
	import { fmt, money, pctFmt } from '../engine/format';
	import { translate } from '../i18n';
	import { app, plan } from '../state.svelte';

	const r = $derived(plan.result);
	const t = $derived(r.totals);
	const a = $derived(app.scenario.assumptions);
	const crit = $derived(r.findings.filter((f) => f.severity === 'critical').length);
	const warn = $derived(r.findings.filter((f) => f.severity === 'warning').length);
	const guided = $derived(app.ui.mode === 'guided');
	const cpuPct = $derived(t.allocCpu ? t.reqCpu / t.allocCpu : 0);
	const memPct = $derived(t.allocMem ? t.reqMem / t.allocMem : 0);
	const pools = $derived(r.clusters.reduce((s, c) => s + c.pools.length, 0));
	const tr = (source: string) => translate(source, app.ui.language);
	const percent = (value: number | null) => value == null ? '—' : Number.isFinite(value) ? pctFmt(value) : tr('Exceeded');
</script>

{#snippet percentages(cpu: number | null, mem: number | null, quota = false)}
	<div class="num flex flex-wrap items-baseline gap-x-2 text-2xl font-bold">
		<span style:color={quota && cpu != null && cpu > 1 ? 'var(--color-error-600-400)' : 'var(--res-cpu)'}>
			<span class="text-xs font-normal">CPU</span> {percent(cpu)}
		</span>
		<span class="text-base font-normal text-surface-500" aria-hidden="true">/</span>
		<span style:color={quota && mem != null && mem > 1 ? 'var(--color-error-600-400)' : 'var(--res-mem)'}>
			<span class="text-xs font-normal">{tr('Memory')}</span> {percent(mem)}
		</span>
	</div>
{/snippet}

{#snippet resources(cpu: number | null, mem: number | null)}
	<div class="num flex flex-wrap gap-x-1 text-xs">
		<span style="color:var(--res-cpu)">{cpu == null ? '—' : fmt(cpu)} vCPU</span>
		<span class="text-surface-500" aria-hidden="true">·</span>
		<span style="color:var(--res-mem)">{mem == null ? '—' : fmt(mem)} GiB {tr('memory')}</span>
	</div>
{/snippet}

<div class="grid grid-cols-2 border-y border-surface-300-700 bg-surface-50-950/80 backdrop-blur sm:grid-cols-3 xl:grid-cols-6 [&>*]:flex [&>*]:min-w-0 [&>*]:flex-col [&>*]:items-start [&>*]:justify-start [&>*]:text-left">
	<div class="border-r border-surface-200-800 px-5 py-3.5">
		<div class="eyebrow">{translate(guided ? 'Servers' : 'Worker nodes', app.ui.language)}</div>
		<div class="num text-2xl font-bold">{fmt(t.nodes, 0)}</div>
		{@render resources(t.vcpu, t.memGiB)}
		<div class="text-xs text-surface-600-400">{translate('{count} pools', app.ui.language, { count: pools })} · {translate('{count} hosted clusters', app.ui.language, { count: app.scenario.clusters.length })}</div>
	</div>
	<div class="border-r border-surface-200-800 px-5 py-3.5" title={tr('Baseline workload CPU/RAM requests divided by allocatable capacity on current worker nodes. This is declared app demand, not measured usage, a VM quota, or peak VM capacity.')}>
		<div class="eyebrow">{translate(guided ? 'Reserved by apps' : 'Requested / allocatable', app.ui.language)}</div>
		{@render percentages(cpuPct, memPct)}
		{@render resources(t.reqCpu, t.reqMem)}
		<div class="text-xs text-surface-600-400">{tr('Baseline apps / current allocatable')}</div>
	</div>
	<button class="min-w-0 border-r border-surface-200-800 px-5 py-3.5 text-left transition hover:bg-surface-100-900"
		onclick={() => (app.ui.view = 'quota')}
		title={tr('The infrastructure allowance for all hosted-cluster worker VMs. Percentages compare full peak VM capacity with this allowance, including unused VM capacity. Automatic quotas are estimates to request, not granted capacity.')}>
		<div class="eyebrow">{tr('Scenario quota')}</div>
		{@render percentages(r.quota[0].pct, r.quota[1].pct, true)}
		{@render resources(r.quota[0].quota, r.quota[1].quota)}
		<div class="text-xs text-surface-600-400">{tr('Peak VMs / infrastructure allowance')}</div>
		<div class="num text-xs" style:color={r.quota[2].pct != null && r.quota[2].pct > 1 ? 'var(--color-error-600-400)' : 'var(--res-storage)'}>
			{tr('storage')}: {r.quota[2].quota == null ? tr('no quota set') : `${fmt(r.quota[2].quota)} GiB (PVC) · ${percent(r.quota[2].pct)}`}
		</div>
	</button>
	<div class="border-r border-surface-200-800 px-5 py-3.5">
		<div class="eyebrow">{translate('Cost / month', app.ui.language)}</div>
		<div class="num text-2xl font-bold">{money(t.cost, a.currency)}</div>
		<div class="num text-xs" style="color:var(--res-storage)">{tr('storage')}: {fmt(t.storageGiB)} GiB (PVC)</div>
	</div>
	<button class="border-r border-surface-200-800 px-5 py-3.5 text-left transition hover:bg-surface-100-900" onclick={() => (app.ui.view = 'findings')}>
		<div class="eyebrow">{translate(guided ? 'Check-up' : 'Findings', app.ui.language)}</div>
		<div class="num flex items-baseline gap-3 text-2xl font-bold">
			{#if crit + warn === 0}
				<span class="text-success-600-400">OK</span>
			{:else}
				<span class="text-error-600-400">{crit}</span><span class="text-warning-700-300">{warn}</span>
			{/if}
		</div>
		<div class="text-xs text-surface-600-400">{translate('critical · warnings', app.ui.language)}</div>
	</button>
	<button class="px-5 py-3.5 text-left transition hover:bg-surface-100-900" onclick={() => (app.ui.view = 'savings')}>
		<div class="eyebrow">{translate('vs classic OpenShift', app.ui.language)}</div>
		{#if r.savings.enabled}
			<div class="num text-2xl font-bold" style="color:var(--metric-comparison)">{r.savings.saved.cost >= 0 ? '−' : '+'}{pctFmt(Math.abs(r.savings.pct.cost))}</div>
			<div class="num text-xs text-surface-600-400">{money(r.savings.saved.cost, a.currency)}/{tr('month')} · −{fmt(r.savings.saved.nodes, 0)} {tr('nodes')}</div>
		{:else}
			<div class="num text-2xl font-bold text-surface-500">—</div>
			<div class="text-xs text-surface-600-400">{translate('comparison off', app.ui.language)}</div>
		{/if}
	</button>
</div>
