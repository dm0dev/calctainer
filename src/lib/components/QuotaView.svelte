<script lang="ts">
	import { fmt, pctFmt } from '../engine/format';
	import type { Quota, QuotaBasis, QuotaLine } from '../engine/types';
	import { translate } from '../i18n';
	import { app, plan } from '../state.svelte';
	import Meter from './Meter.svelte';
	import NumField from './NumField.svelte';
	import SectionHead from './SectionHead.svelte';
	import Term from './Term.svelte';

	const mode = $derived(app.ui.mode);
	const tr = (source: string) => translate(source, app.ui.language);
	const a = $derived(app.scenario.assumptions);
	const r = $derived(plan.result);

	const LABEL = { cpu: 'CPU', mem: 'Memory', storage: 'Storage (PVC)' } as const;
	const UNIT = { cpu: 'cores', mem: 'GiB', storage: 'GiB' } as const;
	const COLOR = { cpu: 'var(--res-cpu)', mem: 'var(--res-mem)', storage: 'var(--res-storage)' } as const;
	const BASIS: { v: QuotaBasis; l: string; d: string }[] = [
		{ v: 'nodes', l: 'Node capacity', d: 'Quota is consumed by the vCPU/GiB of every worker node, whether used or not (typical for infrastructure budgets).' },
		{ v: 'requests', l: 'Requests', d: 'Quota is consumed by what workloads reserve (Kubernetes ResourceQuota requests.*).' },
		{ v: 'limits', l: 'Limits', d: 'Quota is consumed by the maximum workloads may use (ResourceQuota limits.*). Missing limits count as requests.' }
	];

	const sumQuota = $derived.by(() => {
		const s = { cpu: 0, memGiB: 0, storageGiB: 0 };
		for (const c of app.scenario.clusters) {
			s.cpu += c.quota.cpu ?? 0;
			s.memGiB += c.quota.memGiB ?? 0;
			s.storageGiB += c.quota.storageGiB ?? 0;
		}
		return s;
	});

	const tone = (l: QuotaLine) => (l.pct == null ? 'text-surface-500' : l.pct > 1 ? 'text-error-600-400' : l.pct > 0.85 ? 'text-warning-700-300' : 'text-success-700-300');
</script>

{#snippet gauges(lines: QuotaLine[], quota: Quota)}
	<div class="space-y-4">
		{#each lines as l (l.resource)}
			<div class="grid grid-cols-[7rem_1fr] items-start gap-3">
				<div>
					<div class="eyebrow" style="color:{COLOR[l.resource]}">{tr(LABEL[l.resource])}</div>
					<div class="num text-xl font-bold {tone(l)}">{l.pct == null ? '—' : pctFmt(l.pct)}</div>
				</div>
				<div class="space-y-1.5">
					<Meter
						height="h-4"
						max={l.quota ?? Math.max(l.used, 1e-9)}
						segments={[{ value: l.used, color: COLOR[l.resource], label: tr('consumed') }]}
						markers={l.resource === 'storage' ? [] : [
							...(a.quotaBasis !== 'requests' ? [{ value: l.requests, label: tr('requests'), color: 'var(--color-surface-950-50)' }] : []),
							...(a.quotaBasis !== 'limits' ? [{ value: l.limits, label: tr('limits'), color: 'var(--color-error-500)' }] : [])
						]}
						title={`${tr(LABEL[l.resource])} ${tr('consumption')}`}
					/>
					<div class="num flex flex-wrap gap-x-4 text-[11px] text-surface-600-400">
						<span><strong class="text-surface-950-50">{fmt(l.used)}</strong> {tr(UNIT[l.resource])} {tr('consumed')}{l.quota != null ? ` ${tr('of')} ${fmt(l.quota)}` : ''}</span>
						{#if l.resource !== 'storage'}
							<span>{tr('nodes')} {fmt(l.nodes)}</span><span>{tr('requests')} {fmt(l.requests)}</span><span>{tr('limits')} {fmt(l.limits)}</span>
						{/if}
					</div>
					{#if l.quota == null}<div class="text-[11px] text-surface-500 italic">{tr('no quota set')}</div>{/if}
				</div>
			</div>
		{/each}
		{#if mode !== 'guided'}
			<div class="grid grid-cols-3 gap-2 border-t border-dashed border-surface-300-700 pt-3">
				<NumField label={tr('CPU quota')} bind:value={quota.cpu} unit="cores" nullable placeholder={tr('none')} />
				<NumField label={tr('Memory quota')} bind:value={quota.memGiB} unit="GiB" nullable placeholder={tr('none')} step={16} />
				<NumField label={tr('Storage quota')} bind:value={quota.storageGiB} unit="GiB" nullable placeholder={tr('none')} step={100} />
			</div>
		{/if}
	</div>
{/snippet}

<section class="reveal space-y-5">
	<SectionHead
		no="04"
		title={mode === 'guided' ? 'Budget check' : 'Quota consumption'}
		lede="How much of the assigned quota each hosted cluster and the whole scenario consume. Only workloads inside hosted clusters count — not the management cluster or hosted control planes."
		guided="A quota is the share of the shared infrastructure your team is allowed to use. Green means you are within budget."
	/>

	<div class="sheet p-4">
		<div class="eyebrow mb-2"><Term k="quota">{tr('Quota')}</Term> {tr('is consumed by …')}</div>
		<div class="grid gap-2 md:grid-cols-3">
			{#each BASIS as b (b.v)}
				<button
					class="rounded-base border p-3 text-left transition {a.quotaBasis === b.v ? 'border-primary-500 bg-primary-500/10' : 'border-surface-300-700 hover:border-surface-500'}"
					onclick={() => (app.scenario.assumptions.quotaBasis = b.v)}
					disabled={mode === 'guided' && a.quotaBasis !== b.v}
				>
					<div class="font-semibold">{tr(b.l)}</div>
					<div class="text-[11px] leading-snug text-surface-600-400">{tr(b.d)}</div>
				</button>
			{/each}
		</div>
		<p class="mt-2 text-[11px] text-surface-600-400">{tr('Storage is always the sum of PersistentVolumeClaims (replicas × size).')}</p>
	</div>

	<article class="sheet p-5">
		<header class="mb-4 flex flex-wrap items-baseline justify-between gap-2">
			<div>
				<div class="eyebrow">{tr('Scenario total')}</div>
				<h3 class="text-2xl font-extrabold">{app.scenario.name}</h3>
			</div>
			<span class="num text-xs text-surface-600-400"
				>Σ {tr('cluster quotas')}: {fmt(sumQuota.cpu)} {tr('cores')} · {fmt(sumQuota.memGiB)} GiB · {fmt(sumQuota.storageGiB)} GiB {tr('storage')}</span
			>
		</header>
		{@render gauges(r.quota, app.scenario.scenarioQuota)}
	</article>

	<div class="grid gap-4 xl:grid-cols-2">
		{#each app.scenario.clusters as c (c.id)}
			{@const cr = r.clusters.find((x) => x.clusterId === c.id)}
			{#if cr}
				<article class="sheet p-5">
					<header class="mb-4 flex items-baseline justify-between">
						<div>
 						<div class="eyebrow">{tr('Hosted cluster')}</div>
							<h3 class="text-xl font-extrabold">{c.name}</h3>
						</div>
						<span class="num text-xs text-surface-600-400">{cr.totals.nodes} {tr('nodes')} · {cr.totals.pods} {tr('pods')}</span>
					</header>
					{@render gauges(cr.quota, c.quota)}
				</article>
			{/if}
		{/each}
	</div>
</section>
