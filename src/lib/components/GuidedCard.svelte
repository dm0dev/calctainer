<script lang="ts">
	import { Server, Trash2 } from '@lucide/svelte';
	import { applyGuided, AVAILABILITY, GROWTH, translateGuided } from '../engine/guided';
	import { namespaceOf } from '../engine/namespaces';
	import { BASIS_LABEL } from '../engine/presets';
	import type { Availability, Busy, Growth, Workload, WorkloadHeadroom } from '../engine/types';
	import { translate } from '../i18n';
	import { app } from '../state.svelte';
	import NumField from './NumField.svelte';
	import Term from './Term.svelte';

	let {
		w,
		color,
		unscheduled = 0,
		headroom,
		onremove,
		onnamespace
	}: { w: Workload; color: string; unscheduled?: number; headroom?: WorkloadHeadroom; onremove: () => void; onnamespace?: (e: Event) => void } = $props();

	const tr = $derived(w.guided ? translateGuided(w.guided) : null);
	const t = (source: string) => translate(source, app.ui.language);
	const busy = $derived<{ v: Busy; l: string }[]>([
		{ v: 'low', l: t('Mostly idle') },
		{ v: 'medium', l: t('Moderate') },
		{ v: 'high', l: t('Busy') }
	]);

	function sync() {
		applyGuided(w);
	}
	function set<K extends keyof NonNullable<Workload['guided']>>(k: K, v: NonNullable<Workload['guided']>[K]) {
		if (!w.guided) return;
		w.guided[k] = v;
		sync();
	}
</script>

<article class="sheet grid gap-0 overflow-hidden md:grid-cols-[1fr_minmax(240px,0.8fr)]">
	<div class="space-y-4 p-5">
		<header class="flex items-center gap-3">
			<span class="grid size-9 shrink-0 place-items-center rounded-base text-surface-950" style="background:{color}"><Server class="size-5" /></span>
			<input class="cell-input text-left! font-display text-lg font-bold" bind:value={w.name} aria-label={t('Application name')} />
			{#if w.preset?.vendor === 'redhat'}<span class="badge preset-filled-primary-700 shrink-0 px-1.5 py-0 text-xs" title={w.preset.label}>{t('Red Hat operator')}</span>{/if}
			{#if onnamespace}
				<label class="flex shrink-0 items-center gap-1 text-xs text-surface-600-400">
					<Term k="namespace">{t('Group')}</Term>
					<input class="cell-input w-36! text-left! text-xs" list="ns-names" value={namespaceOf(w)} onchange={onnamespace} aria-label={t('Group (namespace) of {name}').replace('{name}', w.name)} spellcheck="false" />
				</label>
			{/if}
			<button class="btn-icon btn-icon-sm hover:preset-tonal-error" onclick={onremove} title={t('Remove application')} aria-label={t('Remove application')}><Trash2 class="size-4" /></button>
		</header>

		{#if w.guided}
			{@const g = w.guided}
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<NumField label={t('VM vCPUs today')} value={g.vcpu} unit="vCPU" step={1} min={0.25} onchange={(v) => set('vcpu', v ?? 1)} />
				<NumField label={t('VM memory today')} value={g.ramGiB} unit="GiB" step={1} min={0.25} onchange={(v) => set('ramGiB', v ?? 1)} />
				<NumField label={t('Number of VMs')} value={g.instances} step={1} min={1} onchange={(v) => set('instances', Math.max(1, Math.round(v ?? 1)))} />
				<NumField label={t('Data disk per VM')} value={g.diskGiB} unit="GiB" step={10} onchange={(v) => set('diskGiB', v ?? 0)} />
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<fieldset>
					<legend class="label-text mb-1 text-surface-700-300">{t('How busy is the CPU usually?')}</legend>
					<div class="btn-group w-full preset-outlined-surface-300-700 p-0.5">
						{#each busy as b (b.v)}
							<button class="btn btn-sm flex-1 {g.cpuBusy === b.v ? 'preset-filled-primary-500' : ''}" onclick={() => set('cpuBusy', b.v)}>{b.l}</button>
						{/each}
					</div>
				</fieldset>
				<fieldset>
					<legend class="label-text mb-1 text-surface-700-300">{t('How full is the memory usually?')}</legend>
					<div class="btn-group w-full preset-outlined-surface-300-700 p-0.5">
						{#each busy as b (b.v)}
							<button class="btn btn-sm flex-1 {g.memBusy === b.v ? 'preset-filled-secondary-500' : ''}" onclick={() => set('memBusy', b.v)}>{b.l}</button>
						{/each}
					</div>
				</fieldset>
			</div>

			<fieldset>
				<legend class="label-text mb-1 text-surface-700-300">{t('How important is it that the app keeps running?')}</legend>
				<div class="grid gap-2 sm:grid-cols-3">
					{#each Object.entries(AVAILABILITY) as [k, a] (k)}
						<button
							class="rounded-base border p-2.5 text-left transition {g.availability === k
								? 'border-primary-500 bg-primary-500/10'
								: 'border-surface-300-700 hover:border-surface-500'}"
							onclick={() => set('availability', k as Availability)}
						>
							<div class="text-sm font-semibold">{t(a.label)}</div>
							<div class="text-xs leading-snug text-surface-600-400">{t(a.plain)}</div>
						</button>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend class="label-text mb-1 text-surface-700-300">{t('Does the load change during the day?')}</legend>
				<div class="btn-group w-full preset-outlined-surface-300-700 p-0.5">
					{#each Object.entries(GROWTH) as [k, gr] (k)}
						<button class="btn btn-sm flex-1 {g.growth === k ? 'preset-filled-surface-950-50' : ''}" onclick={() => set('growth', k as Growth)}>{t(gr.label)}</button>
					{/each}
				</div>
			</fieldset>
		{:else if w.preset?.vendor === 'redhat'}
			<p class="text-sm text-surface-700-300">
				{t('Part of the {label} preset ({basis}). It runs as {replicas} × {cpu} CPU / {memory} GiB{daemon}. Switch to Standard mode to adjust it.')
					.replace('{label}', w.preset.label).replace('{basis}', t(BASIS_LABEL[w.preset.basis])).replace('{replicas}', String(w.replicas)).replace('{cpu}', String(w.cpuRequest)).replace('{memory}', String(w.memRequestGiB)).replace('{daemon}', w.kind === 'DaemonSet' ? t(' on every server') : '')}
			</p>
			{#if w.notes}<p class="text-xs text-surface-600-400">{w.notes}</p>{/if}
			{#if w.preset.source}<a class="anchor text-xs" href={w.preset.source} target="_blank" rel="noopener noreferrer">{t('Source')}</a>{/if}
		{:else}
			<p class="text-sm text-surface-700-300">
				{t('This application was defined with Kubernetes values ({replicas} × {cpu} CPU / {memory} GiB). Switch to Standard mode to edit it, or describe it as a VM:').replace('{replicas}', String(w.replicas)).replace('{cpu}', String(w.cpuRequest)).replace('{memory}', String(w.memRequestGiB))}
			</p>
			<button
				class="btn btn-sm preset-tonal-primary"
				onclick={() => {
					w.guided = {
						vcpu: Math.max(1, Math.ceil(w.cpuLimit ?? w.cpuRequest * 2)),
						ramGiB: Math.max(1, Math.ceil(w.memLimitGiB ?? w.memRequestGiB * 1.4)),
						cpuBusy: 'medium',
						memBusy: 'medium',
						availability: w.replicas >= 3 ? 'critical' : w.replicas === 2 ? 'high' : 'basic',
						instances: 1,
						diskGiB: w.storageGiB,
						growth: w.maxReplicas > w.replicas ? 'some' : 'none'
					};
					sync();
				}}>{t('Describe as VM')}</button
			>
		{/if}
	</div>

	<aside class="space-y-3 border-t border-dashed border-surface-300-700 bg-surface-100-900/60 p-5 md:border-t-0 md:border-l">
		<div class="eyebrow">{t('Kubernetes translation')}</div>
		<dl class="num grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
			<dt><Term k="replica">{t('Copies')}</Term></dt>
			<dd class="text-right font-bold">{w.replicas}{w.maxReplicas > w.replicas ? ` → ${w.maxReplicas}` : ''}</dd>
			<dt><Term k="request">{t('CPU reserved')}</Term></dt>
			<dd class="text-right font-bold" style="color:var(--res-cpu)">{w.cpuRequest} × {w.replicas}</dd>
			<dt><Term k="limit">{t('CPU max')}</Term></dt>
			<dd class="text-right">{w.cpuLimit ?? '—'}</dd>
			<dt><Term k="request">{t('Memory reserved')}</Term></dt>
			<dd class="text-right font-bold" style="color:var(--res-mem)">{w.memRequestGiB} GiB × {w.replicas}</dd>
			<dt><Term k="limit">{t('Memory max')}</Term></dt>
			<dd class="text-right">{w.memLimitGiB ?? '—'} GiB</dd>
			{#if w.storageGiB}
				<dt><Term k="pvc">{t('Storage')}</Term></dt>
				<dd class="text-right" style="color:var(--res-storage)">{w.storageGiB} GiB × {w.replicas}</dd>
			{/if}
		</dl>
		{#if tr}
			<ul class="space-y-1.5 text-xs leading-snug text-surface-800-200">
				{#each tr.explain as line, i (i)}
					<li class="flex gap-2"><span class="num text-surface-600-400" aria-hidden="true">→</span><span>{t(line)}</span></li>
				{/each}
			</ul>
		{/if}
		{#if unscheduled > 0}
			<p class="rounded-base preset-tonal-error px-2 py-1.5 text-xs">{translate('{count} copies do not fit on any server yet.', app.ui.language, { count: unscheduled })}</p>
		{:else if headroom && !headroom.hpaFits}
			<p class="rounded-base preset-tonal-warning px-2 py-1.5 text-xs">{translate('At peak only {fit} of {max} copies fit.', app.ui.language, { fit: headroom.replicas + headroom.extraWithAutoscale, max: headroom.maxReplicas })}</p>
		{:else}
			<p class="rounded-base preset-tonal-success px-2 py-1.5 text-xs">{t('Fits on the planned servers.')}</p>
		{/if}
	</aside>
</article>
