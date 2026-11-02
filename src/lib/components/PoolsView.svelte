<script lang="ts">
	import { ArrowDownToLine, Pin, PinOff, Plus, Trash2 } from '@lucide/svelte';
	import { newPool } from '../engine/defaults';
	import { fmt, money, pctFmt } from '../engine/format';
	import { instanceCost } from '../engine/nodes';
	import { DEFAULT_POOL } from '../engine/recommend';
	import type { PoolResult } from '../engine/types';
	import { translate } from '../i18n';
	import { app, currentCluster, plan } from '../state.svelte';
	import ClusterTabs from './ClusterTabs.svelte';
	import Meter from './Meter.svelte';
	import NumCell from './NumCell.svelte';
	import SectionHead from './SectionHead.svelte';
	import Term from './Term.svelte';

	const mode = $derived(app.ui.mode);
	const tr = (source: string) => translate(source, app.ui.language);
	const cluster = $derived(currentCluster());
	const cr = $derived(plan.result.clusters.find((c) => c.clusterId === cluster?.id));
	const a = $derived(app.scenario.assumptions);
	const catalog = $derived(app.scenario.catalog);
	const typeName = (id: string) => catalog.find((t) => t.id === id)?.name ?? id;
	const poolFootprint = $derived.by(() => {
		const pools = cluster?.poolMode === 'manual' ? cluster.nodePools : [];
		return pools.reduce(
			(total, pool) => {
				const type = catalog.find((item) => item.id === pool.instanceTypeId);
				if (!type) return total;
				const minNodes = Math.max(0, Math.floor(pool.autoscaling ? pool.minReplicas : pool.replicas));
				const maxNodes = Math.max(minNodes, Math.floor(pool.autoscaling ? pool.maxReplicas : pool.replicas));
				return {
					minNodes: total.minNodes + minNodes,
					maxNodes: total.maxNodes + maxNodes,
					minCpu: total.minCpu + minNodes * type.vcpu,
					maxCpu: total.maxCpu + maxNodes * type.vcpu,
					minMem: total.minMem + minNodes * type.memoryGiB,
					maxMem: total.maxMem + maxNodes * type.memoryGiB
				};
			},
			{ minNodes: 0, maxNodes: 0, minCpu: 0, maxCpu: 0, minMem: 0, maxMem: 0 }
		);
	});

	function togglePin(p: PoolResult, typeId: string) {
		if (!cluster) return;
		if (cluster.pins[p.name] === typeId) delete cluster.pins[p.name];
		else cluster.pins[p.name] = typeId;
	}
	function adopt() {
		if (!cluster || !cr) return;
		cluster.nodePools = cr.pools.map((p) => ({
			...newPool(p.name, p.type.id, p.nodes),
			autoscaling: p.autoscaling,
			minReplicas: p.minNodes,
			maxReplicas: p.maxNodes,
			dedicated: p.dedicated
		}));
		cluster.poolMode = 'manual';
	}
	function addPool() {
		if (!cluster || !catalog.length) return;
		if (cluster.poolMode !== 'manual') adopt();
		const names = new Set(cluster.nodePools.map((p) => p.name));
		let n = cluster.nodePools.length + 1;
		let name = n === 1 ? DEFAULT_POOL : `pool-${n}`;
		while (names.has(name)) name = `pool-${++n}`;
		cluster.nodePools.push(newPool(name, a.allowedTypeIds.find((id) => catalog.some((t) => t.id === id)) ?? catalog[0].id, 3));
	}
	function useRecommendation() {
		if (cluster) cluster.poolMode = 'auto';
	}
	function customizePools() {
		if (cluster?.poolMode === 'auto') adopt();
	}
	function poolUsage(name: string) {
		const nodes = cr?.sim.nodes.filter((n) => n.pool === name) ?? [];
		const sum = (f: (n: (typeof nodes)[number]) => number) => nodes.reduce((s, n) => s + f(n), 0);
		return {
			alloc: { cpu: sum((n) => n.allocatable.cpu), mem: sum((n) => n.allocatable.mem) },
			daemon: { cpu: sum((n) => n.daemon.cpu), mem: sum((n) => n.daemon.mem) },
			used: { cpu: sum((n) => n.used.cpu), mem: sum((n) => n.used.mem) },
			pods: sum((n) => n.pods.length)
		};
	}
</script>

<section class="reveal space-y-8">
	<SectionHead
		no="02"
		title={mode === 'guided' ? 'Servers you need' : 'Node pools'}
		lede={mode === 'guided'
			? 'Start with a recommended server mix, then customize pool sizes and counts if you want to test a different plan.'
			: 'Each hosted cluster can have multiple worker pools. Compare the total capacity of your chosen instance types and node counts with workload demand.'}
		guided="A node pool is a group of identical servers. HCP adds or removes servers in a pool automatically within the range shown."
	>
		{#snippet actions()}
			{#if cluster}
				<div class="btn-group preset-outlined-surface-300-700 p-0.5">
					<button class="btn btn-sm {cluster.poolMode === 'auto' ? 'preset-filled-surface-950-50' : ''}" onclick={() => (cluster.poolMode = 'auto')}>{tr('Recommend')}</button>
					<button class="btn btn-sm {cluster.poolMode === 'manual' ? 'preset-filled-surface-950-50' : ''}" onclick={customizePools}>{tr('Customize pools')}</button>
				</div>
				{#if cluster.poolMode === 'manual'}
					<button class="btn btn-sm preset-tonal-primary" onclick={useRecommendation} title={tr('Use automatic pool recommendations instead of this custom pool mix')}><ArrowDownToLine class="size-4" /> {tr('Use recommendation')}</button>
				{/if}
			{/if}
		{/snippet}
	</SectionHead>

	<ClusterTabs />

	{#if cluster && cr}
		{#if cluster.poolMode === 'manual'}
			<div class="sheet overflow-x-auto">
				<div class="flex items-center justify-between border-b border-surface-200-800 px-4 py-2.5">
					<div>
						<div class="font-display font-bold">{tr(mode === 'guided' ? 'Your worker pool mix' : 'Custom node pools')}</div>
						<div class="text-xs text-surface-600-400">{tr('Add pools with different VM flavours. Node counts and capacity are summed for this hosted cluster.')}</div>
					</div>
					<button class="btn btn-sm preset-filled-primary-500" onclick={addPool} disabled={!catalog.length}><Plus class="size-4" /> {tr('Add pool')}</button>
				</div>
				<table class="w-full min-w-[820px] text-xs">
					<thead class="eyebrow text-left">
						<tr class="[&>th]:px-2 [&>th]:py-2 [&>th]:font-medium">
							<th>{tr('Name')}</th><th>{tr('Instance type')}</th><th class="text-right">{tr('Nodes')}</th><th class="text-center">{tr('Autoscale')}</th><th class="text-right">{tr('Min')}</th><th class="text-right"
								>{tr('Max')}</th
							><th class="text-center"><Term k="nodepool">{tr('Dedicated')}</Term></th><th class="text-right">{tr('Cost / mo')}</th><th class="text-right">{tr('Removable')}</th><th></th>
						</tr>
					</thead>
					<tbody>
						{#each cluster.nodePools as p (p.id)}
							{@const t = catalog.find((x) => x.id === p.instanceTypeId)}
							<tr class="border-t border-surface-200-800 [&>td]:px-1 [&>td]:py-1">
 							<td><input class="cell-input text-left! font-semibold" bind:value={p.name} aria-label={tr('Pool name')} /></td>
								<td>
									<select class="cell-input" bind:value={p.instanceTypeId} aria-label={tr('Instance type')}>
										{#each catalog as ct (ct.id)}<option value={ct.id}>{ct.name} · {ct.vcpu}c/{ct.memoryGiB}G</option>{/each}
									</select>
								</td>
								<td class="w-16">
 								{#if p.autoscaling}<span class="num block text-right text-surface-500">—</span>{:else}<NumCell bind:value={p.replicas} title={tr('Nodes')} />{/if}
								</td>
 							<td class="text-center"><input type="checkbox" class="checkbox" bind:checked={p.autoscaling} aria-label={tr('Autoscaling')} /></td>
 							<td class="w-16">{#if p.autoscaling}<NumCell bind:value={p.minReplicas} title={tr('Min nodes')} />{/if}</td>
 							<td class="w-16">{#if p.autoscaling}<NumCell bind:value={p.maxReplicas} min={p.minReplicas} title={tr('Max nodes')} />{/if}</td>
 							<td class="text-center"><input type="checkbox" class="checkbox" bind:checked={p.dedicated} aria-label={tr('Dedicated')} /></td>
								<td class="num text-right">{t ? money((p.autoscaling ? p.minReplicas : p.replicas) * instanceCost(t, a), a.currency) : '—'}</td>
								<td class="num text-right">
 								{#if cr.removableNodes[p.name]}<span class="badge preset-tonal-warning px-1.5 py-0" title={tr('nodes could be removed')}>−{cr.removableNodes[p.name]}</span>{:else}<span class="text-surface-500">0</span>{/if}
								</td>
								<td class="text-right">
 								<button class="btn-icon btn-icon-sm hover:preset-tonal-error" aria-label={tr('Remove pool')} title={tr('Remove pool')} onclick={() => (cluster.nodePools = cluster.nodePools.filter((x) => x.id !== p.id))}
										><Trash2 class="size-3.5" /></button
									>
								</td>
							</tr>
						{:else}
 						<tr><td colspan="10" class="p-8 text-center text-surface-600-400">{tr('No pools — add one or switch back to Recommend.')}</td></tr>
						{/each}
					</tbody>
				</table>
				<p class="border-t border-surface-200-800 px-4 py-2 text-xs text-surface-600-400">
					{tr('Workloads with an empty pool go to any non-dedicated pool. “Removable” = nodes a pool could drop while its pods still fit at the {target} target plus {spare} spare. Cluster totals below add up the capacity from every pool.')
						.replace('{target}', pctFmt(a.targetUtilization)).replace('{spare}', String(a.spareNodes))}
				</p>
				<div class="grid gap-3 border-t border-surface-200-800 bg-surface-100-900/50 px-4 py-3 sm:grid-cols-2">
					<div>
						<div class="eyebrow">{tr('Cluster worker footprint · minimum')}</div>
						<div class="num text-sm font-bold">{poolFootprint.minNodes} {tr('nodes')} · {fmt(poolFootprint.minCpu, 0)} vCPU · {fmt(poolFootprint.minMem, 0)} GiB {tr('memory')}</div>
					</div>
					<div>
						<div class="eyebrow">{tr('At configured autoscaling maximum')}</div>
						<div class="num text-sm font-bold">{poolFootprint.maxNodes} {tr('nodes')} · {fmt(poolFootprint.maxCpu, 0)} vCPU · {fmt(poolFootprint.maxMem, 0)} GiB {tr('memory')}</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="grid gap-6 xl:grid-cols-2">
			{#each cr.pools as p (p.name)}
				{@const u = poolUsage(p.name)}
				{@const pinnedId = cluster.pins[p.name]}
				<article class="sheet flex flex-col">
					<header class="flex items-start justify-between gap-3 border-b border-surface-200-800 p-4">
						<div>
							<div class="eyebrow">{tr(p.source === 'manual' ? 'manual pool' : 'recommended pool')}{p.dedicated ? ` · ${tr('dedicated')}` : ` · ${tr('general')}`}</div>
							<h3 class="text-2xl font-extrabold">{p.name}</h3>
							<div class="num text-sm text-surface-700-300">
								{p.type.name} · {p.type.vcpu} vCPU / {p.type.memoryGiB} GiB
 							{#if p.pinned}<span class="badge preset-tonal-primary ml-1 px-1.5 py-0 text-xs"><Pin class="size-3" /> {tr('pinned')}</span>{/if}
							</div>
						</div>
						<div class="text-right">
							<div class="num text-4xl leading-none font-extrabold">
								{p.nodes}{#if p.autoscaling}<span class="text-xl text-surface-500">…{p.maxNodes}</span>{/if}
							</div>
							<div class="eyebrow mt-1">{tr(mode === 'guided' ? 'servers' : 'nodes')}{p.autoscaling ? ` · ${tr('autoscaling')}` : ''}</div>
							<div class="num text-xs text-surface-700-300">{money(p.costPerMonth, a.currency)}/mo</div>
						</div>
					</header>

					<div class="space-y-4 p-4">
							<div class="flex flex-wrap gap-1" aria-label={tr('Node pictogram')}>
							{#each Array(Math.min(p.maxNodes, 60)) as _, i (i)}
								{@const isSpare = p.source === 'recommended' && i >= p.nodes - p.spare && i < p.nodes}
								<span
									class="h-6 w-4 rounded-[2px] border {i >= p.nodes
										? 'border-dashed border-surface-400-600'
										: isSpare
											? 'hatch border-surface-500 text-surface-400-600'
											: 'border-surface-950-50 bg-surface-950-50'}"
 								title={tr(i >= p.nodes ? 'autoscaling headroom' : isSpare ? 'spare (N+1)' : 'baseline node')}
								></span>
							{/each}
							{#if p.maxNodes > 60}<span class="num self-center text-xs">+{p.maxNodes - 60}</span>{/if}
						</div>

						<div class="grid grid-cols-[4rem_1fr_auto] items-center gap-x-3 gap-y-2 text-xs">
							<span class="eyebrow">CPU</span>
							<Meter
								max={u.alloc.cpu}
								segments={[
									{ value: u.daemon.cpu, color: 'var(--res-cpu)', hatch: true, label: tr('DaemonSets') },
									{ value: u.used.cpu, color: 'var(--res-cpu)', label: tr('workloads') }
								]}
								markers={[{ value: u.alloc.cpu * a.targetUtilization, label: tr('target') }]}
							/>
							<span class="num w-28 text-right">{fmt(u.daemon.cpu + u.used.cpu)} / {fmt(u.alloc.cpu)}</span>
							<span class="eyebrow">{tr('Memory')}</span>
							<Meter
								max={u.alloc.mem}
								segments={[
									{ value: u.daemon.mem, color: 'var(--res-mem)', hatch: true, label: tr('DaemonSets') },
									{ value: u.used.mem, color: 'var(--res-mem)', label: tr('workloads') }
								]}
								markers={[{ value: u.alloc.mem * a.targetUtilization, label: tr('target') }]}
							/>
							<span class="num w-28 text-right">{fmt(u.daemon.mem + u.used.mem)} / {fmt(u.alloc.mem)} GiB</span>
						</div>

						{#if mode !== 'guided'}
							<dl class="num grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
								<div><dt class="eyebrow"><Term k="allocatable">{tr('Alloc / node')}</Term></dt><dd>{fmt(p.allocatablePerNode.cpu, 2)}c · {fmt(p.allocatablePerNode.mem)}G</dd></div>
								<div><dt class="eyebrow"><Term k="daemonset">{tr('DS / node')}</Term></dt><dd>{fmt(p.daemonPerNode.cpu, 2)}c · {fmt(p.daemonPerNode.mem)}G</dd></div>
								<div><dt class="eyebrow">{tr('Base · peak')}</dt><dd>{p.nodesBase} · {p.nodesPeak}</dd></div>
								<div><dt class="eyebrow">{tr('Pods')}</dt><dd>{u.pods}</dd></div>
							</dl>
						{/if}

						<ul class="space-y-1 text-xs leading-snug">
							{#each p.explanation as e, i (i)}
								<li class="flex gap-2"><span class="num text-primary-600-400">§</span><span>{tr(e)}</span></li>
							{/each}
						</ul>
					</div>

					{#if mode !== 'guided' && p.candidates.length}
						<details class="group mt-auto border-t border-surface-200-800">
							<summary class="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-xs font-semibold hover:bg-surface-100-900">
								<span>{tr('Compare {count} instance types').replace('{count}', String(p.candidates.length))}</span><span class="eyebrow group-open:hidden">{tr('show')}</span><span class="eyebrow hidden group-open:inline">{tr('hide')}</span>
							</summary>
							<div class="overflow-x-auto px-2 pb-3">
								<table class="num w-full text-xs">
									<thead class="eyebrow text-left">
										<tr class="[&>th]:px-2 [&>th]:py-1 [&>th]:font-medium">
										<th>{tr('Type')}</th><th class="text-right">{tr('Nodes')}</th><th class="text-right">{tr('Peak')}</th><th class="w-28">CPU · Mem</th><th class="text-right">{tr('Cost/mo')}</th><th></th>
										</tr>
									</thead>
									<tbody>
										{#each p.candidates as c (c.typeId)}
 										<tr class="border-t border-surface-200-800 {c.typeId === p.type.id ? 'bg-primary-500/10 font-bold' : ''} {c.feasible ? '' : 'text-surface-500'}">
												<td class="px-2 py-1">{typeName(c.typeId)}</td>
												{#if c.feasible}
													<td class="px-2 text-right">{c.nodes}</td>
													<td class="px-2 text-right">{c.nodesPeak}</td>
													<td class="px-2">
														<div class="space-y-0.5">
 														<Meter height="h-1.5" max={1} segments={[{ value: c.cpuUtil, color: 'var(--res-cpu)' }]} title={`CPU ${pctFmt(c.cpuUtil)}`} />
 														<Meter height="h-1.5" max={1} segments={[{ value: c.memUtil, color: 'var(--res-mem)' }]} title={`${tr('Memory')} ${pctFmt(c.memUtil)}`} />
														</div>
													</td>
													<td class="px-2 text-right">{money(c.cost, a.currency)}</td>
												{:else}
													<td colspan="4" class="px-2 font-sans text-xs">{tr(c.reason ?? 'Not feasible')}</td>
												{/if}
												<td class="px-1 text-right">
													{#if c.feasible && cluster.poolMode === 'auto'}
														<button
															class="btn-icon btn-icon-sm {pinnedId === c.typeId ? 'preset-filled-primary-500' : 'hover:preset-tonal'}"
																title={tr(pinnedId === c.typeId ? 'Unpin' : 'Pin this type')}
																aria-label={tr(pinnedId === c.typeId ? 'Unpin' : 'Pin this type')}
															onclick={() => togglePin(p, c.typeId)}
														>
															{#if pinnedId === c.typeId}<PinOff class="size-3.5" />{:else}<Pin class="size-3.5" />{/if}
														</button>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</details>
					{/if}
				</article>
			{/each}
		</div>
	{/if}
</section>
