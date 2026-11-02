<script lang="ts">
	import { Plus, Trash2 } from '@lucide/svelte';
	import { uid } from '../engine/defaults';
	import { fmt, money, pctFmt } from '../engine/format';
	import type { ClassicNodeGroup, Footprint } from '../engine/types';
	import { translate } from '../i18n';
	import { app, plan } from '../state.svelte';
	import NumCell from './NumCell.svelte';
	import NumField from './NumField.svelte';
	import SectionHead from './SectionHead.svelte';
	import Term from './Term.svelte';

	const mode = $derived(app.ui.mode);
	const tr = (source: string) => translate(source, app.ui.language);
	const s = $derived(plan.result.savings);
	const cb = $derived(app.scenario.classic);
	const a = $derived(app.scenario.assumptions);
	const catalog = $derived(app.scenario.catalog);

	type Metric = 'cost' | 'nodes' | 'vcpu' | 'memGiB';
	let metric = $state<Metric>('cost');
	const METRICS: { v: Metric; l: string }[] = [
		{ v: 'cost', l: 'Cost / month' },
		{ v: 'nodes', l: 'Nodes' },
		{ v: 'vcpu', l: 'vCPU' },
		{ v: 'memGiB', l: 'Memory GiB' }
	];
	const show = (f: Footprint, m: Metric) => (m === 'cost' ? money(f.cost, a.currency) : fmt(f[m], 0));
	const ROLES = [
		{ k: 'control-plane', l: 'Control plane', c: 'var(--color-surface-700)' },
		{ k: 'infra', l: 'Infra nodes', c: 'var(--color-surface-400)' },
		{ k: 'worker', l: 'Workers', c: 'var(--res-mem)' }
	] as const;
	const maxV = $derived(Math.max(s.classic[metric], s.hcp[metric], 1e-9));

	function addGroup(role: ClassicNodeGroup['role']) {
		cb.inventory.push({ id: uid('cg'), role, instanceTypeId: catalog[0]?.id ?? '', count: role === 'worker' ? 6 : 3 });
	}
</script>

<section class="reveal space-y-8">
	<SectionHead
		no="06"
		title={mode === 'guided' ? 'What you save' : 'Savings vs classic OpenShift'}
		lede="Classic OpenShift runs dedicated control-plane and infra nodes in every cluster. With HCP these move to a shared management cluster, so hosted clusters consist of workers only."
		guided="This compares the servers your applications need today in classic clusters with what they need as hosted clusters."
	>
		{#snippet actions()}
			<label class="flex items-center gap-2 text-xs">
				<input type="checkbox" class="checkbox" bind:checked={cb.enabled} /> {tr('compare')}
			</label>
		{/snippet}
	</SectionHead>

	{#if !cb.enabled}
		<div class="sheet p-8 text-center text-surface-600-400">{tr('Comparison is switched off.')}</div>
	{:else}
		<div class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
			<article class="sheet p-5">
				<div class="mb-4 flex flex-wrap items-center justify-between gap-2">
 				<div class="eyebrow">{tr('Footprint comparison')}</div>
					<div class="btn-group preset-outlined-surface-300-700 p-0.5">
						{#each METRICS as m (m.v)}
							<button class="btn btn-sm {metric === m.v ? 'preset-filled-surface-950-50' : ''}" onclick={() => (metric = m.v)}>{tr(m.l)}</button>
						{/each}
					</div>
				</div>

				<div class="space-y-8">
					<div>
						<div class="mb-1 flex items-baseline justify-between">
							<span class="font-display text-lg font-bold">Classic OpenShift</span>
							<span class="num text-lg font-bold">{show(s.classic, metric)}</span>
						</div>
						<div class="grow-x flex h-10 overflow-hidden rounded-base" style="width:{(s.classic[metric] / maxV) * 100}%">
							{#each ROLES as r (r.k)}
								{@const v = s.classicBreakdown[r.k][metric]}
								{#if v > 0}
									<div class="num flex items-center justify-center overflow-hidden text-xs whitespace-nowrap text-white" style="flex:{v};background:{r.c}" title="{tr(r.l)}: {show(s.classicBreakdown[r.k], metric)}">
										{tr(r.l)}
									</div>
								{/if}
							{/each}
						</div>
					</div>
					<div>
						<div class="mb-1 flex items-baseline justify-between">
							<span class="font-display text-lg font-bold">{tr('Hosted control planes')} <span class="text-sm font-normal text-surface-500">({tr('workers only')})</span></span>
							<span class="num text-lg font-bold">{show(s.hcp, metric)}</span>
						</div>
						<div class="relative h-10">
							<div class="grow-x h-full rounded-base" style="width:{(s.hcp[metric] / maxV) * 100}%;background:var(--res-cpu)"></div>
							<div class="hatch absolute inset-y-0 rounded-base text-surface-300-700" style="left:{(s.hcp[metric] / maxV) * 100}%;width:{Math.max(0, ((s.classic[metric] - s.hcp[metric]) / maxV) * 100)}%"></div>
						</div>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-2 gap-4 border-t border-surface-200-800 pt-4 md:grid-cols-4">
					{#each METRICS as m (m.v)}
						<div>
							<div class="eyebrow">{tr(m.l)}</div>
							<div class="num text-2xl font-extrabold {s.saved[m.v] >= 0 ? 'text-success-700-300' : 'text-error-600-400'}">
								{s.saved[m.v] >= 0 ? '−' : '+'}{pctFmt(Math.abs(s.pct[m.v]))}
							</div>
							<div class="num text-xs text-surface-600-400">{show({ ...s.saved, [m.v]: Math.abs(s.saved[m.v]) } as Footprint, m.v)} {tr(s.saved[m.v] >= 0 ? 'saved' : 'more')}</div>
						</div>
					{/each}
				</div>

				<ul class="mt-4 space-y-1 text-xs text-surface-600-400">
					{#each s.notes as n, i (i)}<li>· {tr(n)}</li>{/each}
				</ul>
			</article>

			<article class="sheet space-y-4 p-5">
				<div class="flex items-center justify-between">
					<div class="eyebrow">{tr('Classic baseline')}</div>
					{#if mode !== 'guided'}
						<div class="btn-group preset-outlined-surface-300-700 p-0.5">
							<button class="btn btn-sm {cb.mode === 'derived' ? 'preset-filled-surface-950-50' : ''}" onclick={() => (cb.mode = 'derived')}>{tr('Derived')}</button>
							<button class="btn btn-sm {cb.mode === 'manual' ? 'preset-filled-surface-950-50' : ''}" onclick={() => (cb.mode = 'manual')}>{tr('Inventory')}</button>
						</div>
					{/if}
				</div>

				{#if cb.mode === 'derived'}
					<p class="text-xs text-surface-700-300">
						{tr('Assumes each hosted cluster replaces one classic cluster with its own control-plane and infra nodes, plus extra worker capacity typical for siloed classic clusters.')}
					</p>
					<div class="grid grid-cols-2 gap-3">
						<NumField label={tr('Classic clusters')} bind:value={cb.classicClusters} hint={tr('0 = one per hosted cluster ({count})').replace('{count}', String(app.scenario.clusters.length))} />
						<NumField label={tr('Worker overhead')} bind:value={cb.workerOverheadPct} unit="%" step={5} hint={tr('fragmentation & per-cluster N+1')} />
						<NumField label={tr('Control-plane nodes')} bind:value={cb.controlPlaneNodes} hint={tr('per classic cluster')} />
						<label class="label">
							<span class="label-text text-xs font-medium text-surface-700-300">{tr('Control-plane type')}</span>
							<select class="select field-sm" bind:value={cb.controlPlaneTypeId}>
								{#each catalog as t (t.id)}<option value={t.id}>{t.name}</option>{/each}
							</select>
						</label>
						<NumField label={tr('Infra nodes')} bind:value={cb.infraNodes} hint={tr('router, registry, monitoring')} />
						<label class="label">
							<span class="label-text text-xs font-medium text-surface-700-300">{tr('Infra type')}</span>
							<select class="select field-sm" bind:value={cb.infraTypeId}>
								{#each catalog as t (t.id)}<option value={t.id}>{t.name}</option>{/each}
							</select>
						</label>
					</div>
				{:else}
					<p class="text-xs text-surface-700-300">{tr('Enter the actual node inventory of the classic clusters being migrated.')}</p>
					<table class="w-full text-xs">
						<thead class="eyebrow text-left"><tr><th class="py-1">{tr('Role')}</th><th>{tr('Type')}</th><th class="text-right">{tr('Count')}</th><th></th></tr></thead>
						<tbody>
							{#each cb.inventory as g (g.id)}
								<tr class="border-t border-surface-200-800">
									<td class="py-1">
										<select class="cell-input" bind:value={g.role} aria-label={tr('Role')}>
											<option value="control-plane">{tr('Control plane')}</option><option value="infra">{tr('Infra')}</option><option value="worker">{tr('Workers')}</option>
										</select>
									</td>
									<td>
										<select class="cell-input" bind:value={g.instanceTypeId} aria-label={tr('Instance type')}>
											{#each catalog as t (t.id)}<option value={t.id}>{t.name}</option>{/each}
										</select>
									</td>
 								<td class="w-16"><NumCell bind:value={g.count} title={tr('Node count')} /></td>
									<td class="text-right">
										<button class="btn-icon btn-icon-sm hover:preset-tonal-error" aria-label={tr('Remove')} title={tr('Remove')} onclick={() => (cb.inventory = cb.inventory.filter((x) => x.id !== g.id))}
											><Trash2 class="size-3.5" /></button
										>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<div class="flex flex-wrap gap-2">
						<button class="btn btn-sm preset-tonal" onclick={() => addGroup('control-plane')}><Plus class="size-3.5" /> {tr('Control plane')}</button>
						<button class="btn btn-sm preset-tonal" onclick={() => addGroup('infra')}><Plus class="size-3.5" /> {tr('Infra')}</button>
						<button class="btn btn-sm preset-tonal" onclick={() => addGroup('worker')}><Plus class="size-3.5" /> {tr('Workers')}</button>
					</div>
				{/if}
				<p class="border-t border-dashed border-surface-300-700 pt-3 text-xs text-surface-600-400">
					{tr('Out of scope:')} <Term k="hcp">{tr('hosted control plane')}</Term> pods and the management cluster. {tr('Their shared cost should be allocated separately.')}
				</p>
			</article>
		</div>
	{/if}
</section>
