<script lang="ts">
	import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from '@lucide/svelte';
	import { CATEGORY_LABEL } from '../colors';
	import type { FindingCategory, Severity } from '../engine/types';
	import { translate } from '../i18n';
	import { app, plan } from '../state.svelte';
	import SectionHead from './SectionHead.svelte';

	const mode = $derived(app.ui.mode);
	const guided = $derived(mode === 'guided');
	let show = $state<Record<Severity, boolean>>({ critical: true, warning: true, info: true, ok: true });
	let clusterFilter = $state<string>('all');

	const clusterName = $derived(new Map(app.scenario.clusters.map((c) => [c.id, c.name])));
	const all = $derived(plan.result.findings);
	const filtered = $derived(all.filter((f) => show[f.severity] && (clusterFilter === 'all' || f.clusterId === clusterFilter || f.clusterId == null)));
	const groups = $derived.by(() => {
		const order: FindingCategory[] = ['under', 'quota', 'resilience', 'fragmentation', 'over', 'hygiene'];
		return order.map((c) => ({ c, items: filtered.filter((f) => f.category === c) })).filter((g) => g.items.length);
	});
	const count = (s: Severity) => all.filter((f) => f.severity === s).length;

	const META = $derived({
		critical: { icon: AlertOctagon, cls: 'text-error-600-400', bar: 'bg-error-500', label: translate(guided ? 'Must fix' : 'Critical', app.ui.language) },
		warning: { icon: AlertTriangle, cls: 'text-warning-700-300', bar: 'bg-warning-500', label: translate(guided ? 'Should check' : 'Warning', app.ui.language) },
		info: { icon: Info, cls: 'text-secondary-600-400', bar: 'bg-secondary-500', label: translate(guided ? 'Good to know' : 'Info', app.ui.language) },
		ok: { icon: CheckCircle2, cls: 'text-success-700-300', bar: 'bg-success-500', label: translate('OK', app.ui.language) }
	} as const);
</script>

<section class="reveal space-y-8">
	<SectionHead
		no="05"
		title={guided ? 'Check-up' : 'Findings'}
		lede="Under-sizing, over-sizing, quota breaches, resilience gaps, fragmentation and workload hygiene detected in the current plan."
		guided="Start with the red items: they mean applications would not start or would stop when a server fails."
	/>

	<div class="flex flex-wrap items-center gap-2">
		{#each ['critical', 'warning', 'info', 'ok'] as const as s (s)}
			{@const M = META[s]}
			<button
				class="chip {show[s] ? 'preset-filled-surface-950-50' : 'preset-outlined-surface-300-700 opacity-60'}"
				aria-pressed={show[s]}
				onclick={() => (show[s] = !show[s])}
			>
				<M.icon class="size-3.5" />{M.label} <span class="num">{count(s)}</span>
			</button>
		{/each}
		<select class="select ml-auto w-auto py-1 text-xs" bind:value={clusterFilter} aria-label={translate('Filter by hosted cluster', app.ui.language)}>
			<option value="all">{translate('All hosted clusters', app.ui.language)}</option>
			{#each app.scenario.clusters as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
		</select>
	</div>

	{#if !groups.length}
		<div class="sheet flex items-center gap-3 p-8">
			<CheckCircle2 class="size-8 text-success-600-400" />
			<div>
				<div class="font-display text-lg font-bold">{translate('Nothing to report', app.ui.language)}</div>
				<p class="text-sm text-surface-600-400">{translate('No findings match the current filter.', app.ui.language)}</p>
			</div>
		</div>
	{/if}

	{#each groups as g (g.c)}
		<div class="space-y-2">
			<h3 class="eyebrow">{translate(CATEGORY_LABEL[g.c], app.ui.language)} · {g.items.length}</h3>
			<div class="space-y-2">
				{#each g.items as f (f.id)}
					{@const M = META[f.severity]}
					<article class="sheet relative overflow-hidden py-3 pr-4 pl-6">
						<span class="absolute inset-y-0 left-0 w-1.5 {M.bar}"></span>
						<div class="flex flex-wrap items-start gap-x-3 gap-y-1">
							<M.icon class="mt-0.5 size-4 shrink-0 {M.cls}" />
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-baseline gap-x-2">
 								<h4 class="font-display font-bold">{translate(f.title, app.ui.language)}</h4>
									{#if f.clusterId}<span class="num text-xs text-surface-600-400">{clusterName.get(f.clusterId)}</span>{/if}
								</div>
								<p class="text-xs text-surface-800-200">{translate(guided && f.plain ? f.plain : f.detail, app.ui.language)}</p>
								{#if f.action}
									<p class="mt-1 text-xs"><span class="font-semibold text-primary-600-400">→ </span>{translate(f.action, app.ui.language)}</p>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>
		</div>
	{/each}
</section>
