<script lang="ts">
	import { fmt, pctFmt } from '../engine/format';
	import { DEFAULT_QUOTA_HEADROOM_PCT, QUOTA_CPU_STEP, QUOTA_MEMORY_STEP } from '../engine/quotas';
	import type { Quota, QuotaLine } from '../engine/types';
	import { translate } from '../i18n';
	import { app, plan } from '../state.svelte';
	import Meter from './Meter.svelte';
	import NumField from './NumField.svelte';
	import SectionHead from './SectionHead.svelte';
	import Term from './Term.svelte';

	const mode = $derived(app.ui.mode);
	const tr = (source: string) => translate(source, app.ui.language);
	const r = $derived(plan.result);
	const headroomPct = $derived(app.scenario.assumptions.quotaHeadroomPct ?? DEFAULT_QUOTA_HEADROOM_PCT);

	const LABEL = { cpu: 'CPU', mem: 'Memory', storage: 'Storage (PVC)' } as const;
	const UNIT = { cpu: 'cores', mem: 'GiB', storage: 'GiB' } as const;
	const COLOR = { cpu: 'var(--res-cpu)', mem: 'var(--res-mem)', storage: 'var(--res-storage)' } as const;
	const sumQuota = $derived.by(() => {
		const s = { cpu: 0, memGiB: 0, storageGiB: 0 };
		for (const c of r.clusters) {
			s.cpu += c.quota[0].quota ?? 0;
			s.memGiB += c.quota[1].quota ?? 0;
			s.storageGiB += c.quota[2].quota ?? 0;
		}
		return s;
	});

	const tone = (l: QuotaLine) => (l.pct == null ? 'text-surface-500' : l.pct > 1 ? 'text-error-600-400' : l.pct > 0.85 ? 'text-warning-700-300' : 'text-success-700-300');
</script>

{#snippet gauges(lines: QuotaLine[], quota: Quota, scope: string)}
	<div class="space-y-4">
		<label class="flex items-center gap-2 text-sm font-semibold">
			<input type="checkbox" class="checkbox" role="switch" checked={quota.auto ?? false}
				aria-label={`${tr('Automatically calculate CPU/RAM quota')} · ${scope}`}
				onchange={(e) => (quota.auto = e.currentTarget.checked)} />
			{tr('Automatically calculate CPU/RAM quota')}
		</label>
		{#if quota.auto}
			<p class="text-xs text-surface-600-400">{tr('Calculated quota is a planning requirement, not a granted infrastructure allowance. Manual values are retained when automatic calculation is turned off.')}</p>
			<p class="text-xs text-surface-600-400">{translate('Peak VM capacity + {headroom}% headroom, rounded up to whole CPU cores and 16 GiB RAM steps. Scenario quotas sum the rounded cluster requirements. Change headroom in Assumptions; turn off automatic calculation to edit these fields.', app.ui.language, { headroom: headroomPct })}</p>
		{/if}
		{#each lines as l (l.resource)}
			<div class="grid grid-cols-[7rem_1fr] items-start gap-3">
				<div>
					<div class="eyebrow" style="color:{COLOR[l.resource]}">{tr(LABEL[l.resource])}</div>
					<div class="num text-xl font-bold {tone(l)}">
						{l.pct == null ? '—' : !Number.isFinite(l.pct) ? tr('Exceeded') : pctFmt(l.pct)}
					</div>
				</div>
				<div class="space-y-1.5">
					<Meter
						height="h-4"
						max={l.quota ?? Math.max(l.used, 1e-9)}
						segments={[{ value: l.used, color: COLOR[l.resource], label: tr('consumed') }]}
						title={`${tr(LABEL[l.resource])} ${tr('consumption')}`}
					/>
					<div class="num flex flex-wrap gap-x-4 text-xs text-surface-600-400">
						<span><strong class="text-surface-950-50">{fmt(l.used)}</strong> {tr(UNIT[l.resource])} {tr('consumed')}{l.quota != null ? ` ${tr('of')} ${fmt(l.quota)}` : ''}</span>
					</div>
					{#if l.quota == null}<div class="text-xs text-surface-500 italic">{tr('no quota set')}</div>{/if}
				</div>
			</div>
		{/each}
		<div class="grid grid-cols-3 gap-2 border-t border-dashed border-surface-300-700 pt-3">
			<NumField label={tr('CPU quota')} value={quota.auto ? lines[0].quota : quota.cpu} readonly={quota.auto ?? false}
				onchange={(v) => (quota.cpu = v)} unit="cores" nullable placeholder={tr('none')} step={QUOTA_CPU_STEP} />
			<NumField label={tr('Memory quota')} value={quota.auto ? lines[1].quota : quota.memGiB} readonly={quota.auto ?? false}
				onchange={(v) => (quota.memGiB = v)} unit="GiB" nullable placeholder={tr('none')} step={QUOTA_MEMORY_STEP} />
			<NumField label={tr('Storage quota (PVC)')} bind:value={quota.storageGiB} unit="GiB" nullable placeholder={tr('none')} step={100} />
		</div>
	</div>
{/snippet}

<section class="reveal space-y-8">
	<SectionHead
		no="04"
		title={mode === 'guided' ? 'Budget check' : 'Quota consumption'}
		lede="Check peak worker-VM capacity against infrastructure quotas, per hosted cluster and for the whole scenario. Management clusters and hosted control planes are excluded."
		guided="A quota is the share of the shared infrastructure your team is allowed to use. Green means you are within budget."
	/>

	<div class="sheet p-4">
		<div class="eyebrow mb-2"><Term k="quota">{tr('Quota')}</Term> · {tr('Peak worker-VM capacity')}</div>
		<div class="mb-3 grid gap-3 border-b border-dashed border-surface-300-700 pb-3 md:grid-cols-2">
			<p class="text-sm text-surface-600-400"><strong class="text-surface-950-50">{tr('Scenario quota')}:</strong> {tr('The infrastructure allowance for all hosted-cluster worker VMs. Percentages compare full peak VM capacity with this allowance, including unused VM capacity. Automatic quotas are estimates to request, not granted capacity.')}</p>
			<p class="text-sm text-surface-600-400"><strong class="text-surface-950-50">{tr('Reserved by apps')}:</strong> {tr('Baseline workload CPU/RAM requests divided by allocatable capacity on current worker nodes. This is declared app demand, not measured usage, a VM quota, or peak VM capacity.')}</p>
		</div>
		<p class="text-sm text-surface-600-400">{tr('CPU/RAM = sum of each pool’s VM count × full instance capacity. Recommended pools use peak demand plus spare nodes; custom autoscaling pools use their maximum, fixed pools their configured count. This is potential peak capacity, not the current order or workload requests/limits.')}</p>
		<p class="mt-2 text-xs text-surface-600-400">{tr('Storage is separate: peak PVC requests, including DaemonSets at the pool maximum. VM disks are not modelled. Automatic calculation only sets CPU/RAM quotas; scheduling shortages remain visible in Findings.')}</p>
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
		<p class="mb-4 num text-xs text-surface-600-400">{tr('Peak worker-VM capacity')}: {r.quotaTotals.nodes} {tr('nodes')} · {fmt(r.quotaTotals.vcpu)} {tr('cores')} · {fmt(r.quotaTotals.memGiB)} GiB</p>
		{@render gauges(r.quota, app.scenario.scenarioQuota, app.scenario.name)}
	</article>

	<div class="grid gap-6 xl:grid-cols-2">
		{#each app.scenario.clusters as c (c.id)}
			{@const cr = r.clusters.find((x) => x.clusterId === c.id)}
			{#if cr}
				<article class="sheet p-5">
					<header class="mb-4 flex flex-wrap items-baseline justify-between gap-2">
						<div>
							<div class="eyebrow">{tr('Hosted cluster')}</div>
							<h3 class="text-xl font-extrabold">{c.name}</h3>
						</div>
						<span class="num text-xs text-surface-600-400">{tr('Peak worker-VM capacity')}: {cr.quotaTotals.nodes} {tr('nodes')}</span>
					</header>
					<div class="mb-4 space-y-1 num text-xs text-surface-600-400">
						{#each cr.pools as p (p.name)}
							<div>{p.name}: {p.maxNodes} × {p.type.name} = {fmt(p.maxNodes * p.type.vcpu)} {tr('cores')} · {fmt(p.maxNodes * p.type.memoryGiB)} GiB</div>
						{/each}
					</div>
					{@render gauges(cr.quota, c.quota, c.name)}
				</article>
			{/if}
		{/each}
	</div>
</section>
