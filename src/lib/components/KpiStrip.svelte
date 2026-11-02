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
</script>

<div class="grid grid-cols-2 border-y border-surface-300-700 bg-surface-50-950/80 backdrop-blur sm:grid-cols-3 lg:grid-cols-6">
	<div class="border-r border-surface-200-800 px-4 py-2.5">
		<div class="eyebrow">{translate(guided ? 'Servers' : 'Worker nodes', app.ui.language)}</div>
		<div class="num text-2xl font-bold">{t.nodes}</div>
		<div class="text-[11px] text-surface-600-400">{translate('{count} pools', app.ui.language, { count: pools })} · {translate('{count} hosted clusters', app.ui.language, { count: app.scenario.clusters.length })}</div>
	</div>
	<div class="border-r border-surface-200-800 px-4 py-2.5">
		<div class="eyebrow">{translate('Capacity', app.ui.language)}</div>
		<div class="num text-2xl font-bold">{fmt(t.vcpu, 0)}<span class="text-sm font-normal text-surface-600-400"> vCPU</span></div>
		<div class="num text-[11px] text-surface-600-400">{fmt(t.memGiB, 0)} GiB {translate('memory', app.ui.language)}</div>
	</div>
	<div class="border-r border-surface-200-800 px-4 py-2.5">
		<div class="eyebrow">{translate(guided ? 'Reserved by apps' : 'Requested / allocatable', app.ui.language)}</div>
		<div class="num flex items-baseline gap-2 text-2xl font-bold">
			<span style="color:var(--res-cpu)">{pctFmt(cpuPct)}</span><span class="text-base text-surface-500">/</span><span style="color:var(--res-mem)"
				>{pctFmt(memPct)}</span
			>
		</div>
		<div class="num text-[11px] text-surface-600-400">CPU {fmt(t.reqCpu)} · {translate('Memory', app.ui.language)} {fmt(t.reqMem)} GiB</div>
	</div>
	<div class="border-r border-surface-200-800 px-4 py-2.5">
		<div class="eyebrow">{translate('Cost / month', app.ui.language)}</div>
		<div class="num text-2xl font-bold">{money(t.cost, a.currency)}</div>
		<div class="num text-[11px] text-surface-600-400">{translate('storage', app.ui.language)} {fmt(t.storageGiB, 0)} GiB (PVC)</div>
	</div>
	<button class="border-r border-surface-200-800 px-4 py-2.5 text-left transition hover:bg-surface-100-900" onclick={() => (app.ui.view = 'findings')}>
		<div class="eyebrow">{translate(guided ? 'Check-up' : 'Findings', app.ui.language)}</div>
		<div class="num flex items-baseline gap-3 text-2xl font-bold">
			{#if crit + warn === 0}
				<span class="text-success-700-300">OK</span>
			{:else}
				<span class="text-error-600-400">{crit}</span><span class="text-warning-700-300">{warn}</span>
			{/if}
		</div>
		<div class="text-[11px] text-surface-600-400">{translate('critical · warnings', app.ui.language)}</div>
	</button>
	<button class="px-4 py-2.5 text-left transition hover:bg-surface-100-900" onclick={() => (app.ui.view = 'savings')}>
		<div class="eyebrow">{translate('vs classic OpenShift', app.ui.language)}</div>
		{#if r.savings.enabled}
			<div class="num text-2xl font-bold text-success-700-300">−{pctFmt(r.savings.pct.cost)}</div>
			<div class="num text-[11px] text-surface-600-400">{money(r.savings.saved.cost, a.currency)}/mo · −{r.savings.saved.nodes} nodes</div>
		{:else}
			<div class="num text-2xl font-bold text-surface-500">—</div>
			<div class="text-[11px] text-surface-600-400">{translate('comparison off', app.ui.language)}</div>
		{/if}
	</button>
</div>
