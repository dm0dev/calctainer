<script lang="ts">
	import { Lock, Plus, Trash2 } from '@lucide/svelte';
	import { CATALOGS } from '../engine/catalog';
	import { fmt, money } from '../engine/format';
	import { allocatable, instanceCost, reserved } from '../engine/nodes';
	import { translate } from '../i18n';
	import { app } from '../state.svelte';
	import NumCell from './NumCell.svelte';
	import NumField from './NumField.svelte';
	import SectionHead from './SectionHead.svelte';
	import Term from './Term.svelte';

	const mode = $derived(app.ui.mode);
	const expert = $derived(mode === 'expert');
	const locked = $derived(mode === 'guided');
	const tr = (source: string) => translate(source, app.ui.language);
	const a = $derived(app.scenario.assumptions);
	const catalog = $derived(app.scenario.catalog);
	let preset = $state('');

	function applyPreset(id: string) {
		const p = CATALOGS.find((c) => c.id === id);
		if (!p) return;
		if (!confirm(tr('Replace the instance catalogue with “{name}”? Pins and manual pools referring to missing types are re-mapped.').replace('{name}', p.name))) {
			preset = '';
			return;
		}
		const s = app.scenario;
		s.catalog = p.types.map((t) => ({ ...t }));
		s.catalogName = p.name;
		const ids = new Set(s.catalog.map((t) => t.id));
		const first = s.catalog[0].id;
		s.assumptions.allowedTypeIds = s.catalog.map((t) => t.id);
		for (const c of s.clusters) {
			c.pins = Object.fromEntries(Object.entries(c.pins).filter(([, v]) => ids.has(v)));
			for (const np of c.nodePools) if (!ids.has(np.instanceTypeId)) np.instanceTypeId = first;
		}
		if (!ids.has(s.classic.controlPlaneTypeId)) s.classic.controlPlaneTypeId = first;
		if (!ids.has(s.classic.infraTypeId)) s.classic.infraTypeId = first;
		for (const g of s.classic.inventory) if (!ids.has(g.instanceTypeId)) g.instanceTypeId = first;
		preset = '';
	}
	function toggleAllowed(id: string) {
		const set = new Set(a.allowedTypeIds);
		if (set.has(id)) set.delete(id);
		else set.add(id);
		app.scenario.assumptions.allowedTypeIds = catalog.map((t) => t.id).filter((x) => set.has(x));
	}
	function addType() {
		const id = `custom-${catalog.length + 1}`;
		app.scenario.catalog.push({ id, name: id, vcpu: 8, memoryGiB: 32, family: 'custom', costPerMonth: null });
		app.scenario.assumptions.allowedTypeIds.push(id);
	}
	function removeType(id: string) {
		if (catalog.length <= 1) return;
		app.scenario.catalog = catalog.filter((t) => t.id !== id);
		app.scenario.assumptions.allowedTypeIds = a.allowedTypeIds.filter((x) => x !== id);
	}
	type ChoiceKey = 'sizeFor' | 'objective' | 'strategy' | 'reservedMode';
	function sel(k: ChoiceKey, v: string) {
		(app.scenario.assumptions as unknown as Record<ChoiceKey, string>)[k] = v;
	}
</script>

{#snippet choice(k: ChoiceKey, opts: { v: string; l: string }[])}
	<div class="btn-group w-full preset-outlined-surface-300-700 p-0.5">
		{#each opts as o (o.v)}
			<button class="btn btn-sm flex-1 {a[k] === o.v ? 'preset-filled-surface-950-50' : ''}" onclick={() => sel(k, o.v)}>{tr(o.l)}</button>
		{/each}
	</div>
{/snippet}

<section class="reveal space-y-8">
	<SectionHead
		no="07"
		title="Assumptions"
		lede="Every number the planner relies on. Defaults follow OpenShift behaviour; adjust them to your platform standards and contract prices."
		guided="These settings are maintained by your platform team. Switch to Standard or Expert mode to change them."
	/>

	<fieldset disabled={locked} class="space-y-8 {locked ? 'opacity-80' : ''}">
		{#if locked}<p class="flex items-center gap-2 text-xs text-surface-600-400"><Lock class="size-3.5" /> {tr('read-only in guided mode')}</p>{/if}

		<div class="grid gap-6 lg:grid-cols-3">
			<article class="sheet space-y-4 p-5">
				<h3 class="text-lg font-bold">{tr('Sizing policy')}</h3>
				<NumField label={tr('Target utilisation')} bind:value={app.scenario.assumptions.targetUtilization} pct step={5} max={100} hint={tr('Nodes are filled to this share of allocatable when sizing. Keeps room for bursts and rolling updates.')}>
					{#snippet labelSnippet()}<Term k="target">{tr('Target utilisation')}</Term>{/snippet}
				</NumField>
				<NumField label={tr('Spare nodes per pool')} bind:value={app.scenario.assumptions.spareNodes} hint={tr('N+x for node failures and upgrade drains.')}>
					{#snippet labelSnippet()}<Term k="spare">{tr('Spare nodes per pool')}</Term>{/snippet}
				</NumField>
				<NumField label={tr('Minimum nodes per pool')} bind:value={app.scenario.assumptions.minNodesPerPool} min={1} />
				<div>
					<div class="label-text mb-1 text-xs text-surface-700-300">{tr('Size pools for')}</div>
					{@render choice('sizeFor', [
						{ v: 'baseline', l: 'Baseline + autoscale' },
						{ v: 'peak', l: 'HPA peak (static)' }
					])}
				</div>
				<div>
					<div class="label-text mb-1 text-xs text-surface-700-300">{tr('Optimise for')}</div>
					{@render choice('objective', [
						{ v: 'cost', l: 'Cost' },
						{ v: 'balanced', l: 'Balance' },
						{ v: 'fewest-nodes', l: 'Few nodes' }
					])}
				</div>
				{#if expert}
					<div>
						<div class="label-text mb-1 text-xs text-surface-700-300">{tr('Scheduler scoring')}</div>
						{@render choice('strategy', [
							{ v: 'spread', l: 'Spread (default)' },
							{ v: 'binpack', l: 'Bin-pack' }
						])}
						<p class="mt-1 text-xs text-surface-600-400">{tr('Spread ≈ LeastAllocated (OpenShift default); bin-pack ≈ MostAllocated.')}</p>
					</div>
				{/if}
			</article>

			<article class="sheet space-y-4 p-5">
				<h3 class="text-lg font-bold">{tr('Node overhead')}</h3>
				<div>
					<div class="label-text mb-1 text-xs text-surface-700-300">{tr('System reserved (kubelet + OS)')}</div>
					{@render choice('reservedMode', [
						{ v: 'auto', l: 'OpenShift auto-sizing' },
						{ v: 'fixed', l: 'Fixed' }
					])}
				</div>
				{#if a.reservedMode === 'fixed'}
					<div class="grid grid-cols-2 gap-3">
						<NumField label={tr('Reserved CPU')} bind:value={app.scenario.assumptions.reservedCpu} unit="cores" step={0.1} />
						<NumField label={tr('Reserved memory')} bind:value={app.scenario.assumptions.reservedMemGiB} unit="GiB" step={0.25} />
					</div>
				{/if}
				<div class="grid grid-cols-2 gap-3">
					<NumField label={tr('Platform DS CPU')} bind:value={app.scenario.assumptions.platformCpuPerNode} unit="c/node" step={0.05} hint={tr('OVN, multus, DNS, monitoring agents')} />
					<NumField label={tr('Platform DS memory')} bind:value={app.scenario.assumptions.platformMemPerNodeGiB} unit="G/node" step={0.25} />
				</div>
				<NumField label={tr('Max pods per node')} bind:value={app.scenario.assumptions.maxPodsPerNode} step={10} min={10} />
				{#if expert}
					<h4 class="pt-2 text-sm font-bold">{tr('Finding thresholds')}</h4>
					<div class="grid grid-cols-2 gap-3">
						<NumField label={tr('CPU limit overcommit')} bind:value={app.scenario.assumptions.cpuLimitOvercommitWarn} unit="×" step={0.1} />
						<NumField label={tr('Memory limit warning threshold')} bind:value={app.scenario.assumptions.memLimitOvercommitWarn} unit="×" step={0.05} />
						<NumField label={tr('Under-utilised below')} bind:value={app.scenario.assumptions.underUtilizedThreshold} pct step={5} />
					</div>
					<p class="text-xs text-surface-600-400">{tr('The sum of configured memory limits is compared with allocatable pool memory. It is not actual memory usage or extra RAM; below Expert, the warning threshold is fixed at 100%.')}</p>
				{/if}
			</article>

			<article class="sheet space-y-4 p-5">
				<h3 class="text-lg font-bold">{tr('Pricing')}</h3>
				<p class="text-xs text-surface-700-300">{tr('Used for instance types without an explicit monthly price (e.g. on-prem / KubeVirt).')}</p>
				<div class="grid grid-cols-2 gap-3">
					<NumField label={tr('Per vCPU / month')} bind:value={app.scenario.assumptions.pricePerVcpu} unit={a.currency} step={1} />
					<NumField label={tr('Per GiB / month')} bind:value={app.scenario.assumptions.pricePerGiB} unit={a.currency} step={0.5} />
				</div>
				<label class="label">
					<span class="label-text text-xs font-medium text-surface-700-300">{tr('Currency symbol')}</span>
					<input class="input field-sm w-24" bind:value={app.scenario.assumptions.currency} maxlength="4" />
				</label>
				<p class="border-t border-dashed border-surface-300-700 pt-3 text-xs text-surface-600-400">
					{tr('Preset prices are rough on-demand list prices. Replace them with contract prices for a realistic savings estimate.')}
				</p>
			</article>
		</div>

		<article class="sheet overflow-x-auto">
			<header class="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200-800 px-5 py-3">
				<div>
					<h3 class="text-lg font-bold">{tr('Instance catalogue')}</h3>
					<div class="text-xs text-surface-600-400">{app.scenario.catalogName} · {tr('checked types may be recommended')}</div>
				</div>
				{#if !locked}
					<div class="flex items-center gap-2">
						<select class="select field-sm w-auto" bind:value={preset} onchange={() => applyPreset(preset)} aria-label={tr('Load catalogue preset')}>
							<option value="">{tr('Load preset…')}</option>
							{#each CATALOGS as c (c.id)}<option value={c.id}>{c.name}</option>{/each}
						</select>
						{#if expert}<button class="btn btn-sm preset-filled-primary-500" onclick={addType}><Plus class="size-4" /> {tr('Type')}</button>{/if}
					</div>
				{/if}
			</header>
			<table class="num w-full min-w-[760px] text-xs">
				<thead class="eyebrow text-left">
					<tr class="[&>th]:px-2 [&>th]:py-2 [&>th]:font-medium">
						<th class="w-10 text-center">{tr('Use')}</th><th>{tr('Name')}</th><th>{tr('Family')}</th><th class="text-right">vCPU</th><th class="text-right">{tr('Memory GiB')}</th><th class="text-right"
							>{tr('Reserved')}</th
						><th class="text-right"><Term k="allocatable">{tr('Allocatable')}</Term></th><th class="text-right">{tr('Cost / month')}</th>{#if expert}<th></th>{/if}
					</tr>
				</thead>
				<tbody>
					{#each app.scenario.catalog as t (t.id)}
						{@const rv = reserved(t, a)}
						{@const al = allocatable(t, a)}
						<tr class="border-t border-surface-200-800 [&>td]:px-1 [&>td]:py-1 {a.allowedTypeIds.includes(t.id) ? '' : 'text-surface-500'}">
 						<td class="text-center"><input type="checkbox" class="checkbox" checked={a.allowedTypeIds.includes(t.id)} onchange={() => toggleAllowed(t.id)} aria-label={tr('Allow {name}').replace('{name}', t.name)} /></td>
 						<td>{#if expert}<input class="cell-input text-left! font-semibold" bind:value={t.name} aria-label={tr('Type name')} />{:else}<span class="px-1.5 font-semibold">{t.name}</span>{/if}</td>
							<td class="font-sans text-xs">{t.family}</td>
 						<td class="w-20">{#if expert}<NumCell bind:value={t.vcpu} min={1} title="vCPU" />{:else}<span class="block text-right">{t.vcpu}</span>{/if}</td>
 						<td class="w-24">{#if expert}<NumCell bind:value={t.memoryGiB} min={1} title={tr('Memory GiB')} />{:else}<span class="block text-right">{t.memoryGiB}</span>{/if}</td>
							<td class="text-right text-surface-500">{fmt(rv.cpu, 2)}c · {fmt(rv.mem)}G</td>
							<td class="text-right">{fmt(al.cpu, 2)}c · {fmt(al.mem)}G</td>
							<td class="w-28">
								{#if !locked}
  							<NumCell bind:value={t.costPerMonth} nullable placeholder={money(instanceCost({ ...t, costPerMonth: null }, a), a.currency)} title={tr('Monthly cost (empty = derived)')} />
								{:else}
									<span class="block text-right">{money(instanceCost(t, a), a.currency)}</span>
								{/if}
							</td>
							{#if expert}
								<td class="text-right">
 								<button class="btn-icon btn-icon-sm hover:preset-tonal-error" aria-label={tr('Remove type')} title={tr('Remove type')} onclick={() => removeType(t.id)}><Trash2 class="size-3.5" /></button>
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</article>
	</fieldset>
</section>
