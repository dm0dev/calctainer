<script lang="ts">
	import { colorMap } from '../colors';
	import { fmt, pctFmt } from '../engine/format';
	import { nodeUtil } from '../engine/analyze';
	import type { SimNode, SimResult } from '../engine/types';
	import { translate } from '../i18n';
	import { app, currentCluster, plan } from '../state.svelte';
	import ClusterTabs from './ClusterTabs.svelte';
	import Meter from './Meter.svelte';
	import SectionHead from './SectionHead.svelte';
	import Term from './Term.svelte';

	const mode = $derived(app.ui.mode);
	const tr = (source: string) => translate(source, app.ui.language);
	const cluster = $derived(currentCluster());
	const cr = $derived(plan.result.clusters.find((c) => c.clusterId === cluster?.id));
	const a = $derived(app.scenario.assumptions);
	const colors = $derived(colorMap(app.scenario.workloads.map((w) => w.id)));
	const wlName = $derived(new Map(app.scenario.workloads.map((w) => [w.id, w.name])));

	let phase = $state<'baseline' | 'peak'>('baseline');
	let hovered = $state<string | null>(null);
	const sim: SimResult | undefined = $derived(cr ? (phase === 'peak' ? cr.peak : cr.sim) : undefined);

	function segs(n: SimNode, res: 'cpu' | 'mem') {
		const by = new Map<string, number>();
		for (const p of n.pods) by.set(p.workloadId, (by.get(p.workloadId) ?? 0) + p[res]);
		const out = [{ value: n.daemon[res], color: 'var(--color-surface-500)', hatch: true, label: tr('DaemonSets + platform') }];
		for (const [id, v] of by) out.push({ value: v, color: colors.get(id) ?? '#888', hatch: false, label: `${wlName.get(id) ?? id}: ${fmt(v, 2)}` });
		return out;
	}
	const legend = $derived.by(() => {
		const ids = new Set<string>();
		for (const n of sim?.nodes ?? []) for (const p of n.pods) ids.add(p.workloadId);
		return [...ids];
	});
	const unschedGroups = $derived.by(() => {
		const m = new Map<string, { name: string; count: number; cpu: number; mem: number }>();
		for (const p of sim?.unscheduled ?? []) {
			const g = m.get(p.workloadId) ?? { name: wlName.get(p.workloadId) ?? p.name, count: 0, cpu: p.cpu, mem: p.mem };
			g.count++;
			m.set(p.workloadId, g);
		}
		return [...m.entries()];
	});
	const pools = $derived([...new Set((sim?.nodes ?? []).map((n) => n.pool))]);
	const fr = $derived(cr?.fragmentation);

	// Scatter geometry
	const S = 220,
		P = 28;
	const sx = (v: number) => P + Math.min(1.1, v) * ((S - P - 8) / 1.1);
	const sy = (v: number) => S - P - Math.min(1.1, v) * ((S - P - 8) / 1.1);
</script>

<section class="reveal space-y-8">
	<SectionHead
		no="03"
		title={mode === 'guided' ? 'How apps are placed' : 'Scheduling simulation'}
		lede="Approximation of the Kubernetes scheduler: every pod is placed on a node by its requests, anti-affinity, pool targeting and the max-pods limit."
		guided="Each tile is one server. The coloured bars show how much CPU and memory each application has reserved on it; the striped part is used by the platform itself."
	>
		{#snippet actions()}
			<div class="btn-group preset-outlined-surface-300-700 p-0.5">
				<button class="btn btn-sm {phase === 'baseline' ? 'preset-filled-surface-950-50' : ''}" onclick={() => (phase = 'baseline')}>{tr('Baseline')}</button>
				<button class="btn btn-sm {phase === 'peak' ? 'preset-filled-primary-500' : ''}" onclick={() => (phase = 'peak')}>{tr('HPA peak')}</button>
			</div>
		{/snippet}
	</SectionHead>

	<ClusterTabs />

	{#if cr && sim}
		{#if unschedGroups.length}
			<div class="sheet border-error-500! p-4">
				<div class="mb-2 flex items-center gap-2 font-display font-bold text-error-600-400">
					<span class="badge preset-filled-error-500">{sim.unscheduled.length}</span>
					{tr(mode === 'guided' ? 'copies that do not fit anywhere' : 'pods Pending (unschedulable)')}{phase === 'peak' ? ` ${tr('at peak, even after autoscaling to pool max')}` : ''}
				</div>
				<div class="flex flex-wrap gap-2">
					{#each unschedGroups as [id, g] (id)}
						<span class="chip preset-outlined-error-500 num text-xs"
							><span class="size-2 rounded-[2px]" style="background:{colors.get(id)}"></span>{g.name} ×{g.count} · {g.cpu}c/{g.mem}G</span
						>
					{/each}
				</div>
			</div>
		{/if}

		<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
			<span class="eyebrow">{tr('Legend')}</span>
			<span class="inline-flex items-center gap-1"><span class="hatch h-2.5 w-4 rounded-[2px] text-surface-500"></span>{tr('DaemonSets/platform')}</span>
			{#each legend as id (id)}
				<button
					class="inline-flex items-center gap-1 rounded px-1 transition {hovered === id ? 'bg-surface-200-800' : ''}"
					onmouseenter={() => (hovered = id)}
					onmouseleave={() => (hovered = null)}
					onfocus={() => (hovered = id)}
					onblur={() => (hovered = null)}><span class="size-2.5 rounded-[2px]" style="background:{colors.get(id)}"></span>{wlName.get(id)}</button
				>
			{/each}
			<span class="ml-auto inline-flex items-center gap-1"><span class="h-3 border-l-2 border-dashed border-surface-950-50"></span>{tr('target')} {pctFmt(a.targetUtilization)}</span>
		</div>

		{#each pools as pool (pool)}
			{@const nodes = sim.nodes.filter((n) => n.pool === pool)}
			{@const ft = cr.failures.find((f) => f.pool === pool)}
			<div class="space-y-2">
				<div class="flex flex-wrap items-baseline gap-3">
					<h3 class="text-lg font-bold">{pool}</h3>
					<span class="num text-xs text-surface-600-400">{nodes.length} {tr('nodes')} · {nodes[0]?.typeId}</span>
					{#if ft && phase === 'baseline'}
						<span class="text-xs {ft.stranded ? 'text-error-600-400' : 'text-success-700-300'}">
							{tr(mode === 'guided' ? 'If the busiest server fails' : 'Node-failure test')}: {ft.displaced} {tr('pods displaced')}, {ft.stranded ? tr('{count} cannot be rescheduled').replace('{count}', String(ft.stranded)) : tr('all rescheduled')}
						</span>
					{/if}
				</div>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-2">
					{#each nodes as n (n.id)}
						{@const u = nodeUtil(n)}
						{@const dim = hovered && !n.byWorkload[hovered]}
						<div
							class="rounded-base border bg-surface-50-950 p-2 transition {n.scaled ? 'border-dashed border-primary-500' : 'border-surface-300-700'} {dim ? 'opacity-30' : ''}"
						>
							<div class="num mb-1.5 flex items-center justify-between text-xs">
								<span class="truncate font-semibold" title={n.id}>{n.id.split('/').pop()}</span>
								<span class="text-surface-600-400">{n.pods.length + n.daemonPods.length}/{n.maxPods}</span>
							</div>
							<div class="space-y-1">
								<Meter height="h-2.5" max={n.allocatable.cpu} segments={segs(n, 'cpu')} markers={[{ value: n.allocatable.cpu * a.targetUtilization, label: tr('target') }]} title="CPU" />
								<Meter height="h-2.5" max={n.allocatable.mem} segments={segs(n, 'mem')} markers={[{ value: n.allocatable.mem * a.targetUtilization, label: tr('target') }]} title={tr('Memory')} />
							</div>
							<div class="num mt-1.5 flex justify-between text-xs">
								<span style="color:var(--res-cpu)">CPU {pctFmt(u.cpu)}</span>
								<span style="color:var(--res-mem)">MEM {pctFmt(u.mem)}</span>
							</div>
							{#if n.scaled}<div class="eyebrow mt-1 text-primary-600-400!">{tr('added by autoscaler')}</div>{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<div class="grid gap-6 lg:grid-cols-[auto_1fr]">
			<div class="sheet p-4">
				<div class="eyebrow mb-2">{tr('CPU vs memory per node')}</div>
				<div class="mb-1 text-xs" style="color:var(--res-mem)">{tr('Memory requested')} ↑</div>
				<div class="flex">
					<div class="num relative w-9 shrink-0 text-right text-xs text-surface-600-400">
						{#each [0, 0.5, 1] as t (t)}
							<span class="absolute right-1 -translate-y-1/2" style:top={`${sy(t) / S * 240}px`}>{t * 100}%</span>
						{/each}
					</div>
				<svg viewBox="0 0 {S} {S}" class="w-[240px] bg-surface-50-950" role="img" aria-label={tr('Scatter of CPU versus memory utilisation per node')}>
					<rect x={sx(0)} y={sy(1)} width={sx(1) - sx(0)} height={sy(0) - sy(1)} fill="none" stroke="currentColor" stroke-opacity="0.25" />
					<line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="3 3" />
					<rect
						x={sx(0)}
						y={sy(a.targetUtilization)}
						width={sx(a.targetUtilization) - sx(0)}
						height={sy(0) - sy(a.targetUtilization)}
						fill="var(--color-success-500)"
						fill-opacity="0.07"
					/>
					{#each sim.nodes as n (n.id)}
						{@const u = nodeUtil(n)}
 					<circle cx={sx(u.cpu)} cy={sy(u.mem)} r="4" fill={n.scaled ? 'var(--color-primary-500)' : 'currentColor'} fill-opacity="0.55"><title>{n.id}: CPU {pctFmt(u.cpu)}, {tr('Memory')} {pctFmt(u.mem)}</title></circle>
					{/each}
				</svg>
				</div>
				<div class="num relative ml-9 h-5 w-[240px] text-xs text-surface-600-400">
					{#each [0, 0.5, 1] as t (t)}
						<span class="absolute -translate-x-1/2" style:left={`${sx(t) / S * 240}px`}>{t * 100}%</span>
					{/each}
				</div>
				<div class="ml-9 text-center text-xs" style="color:var(--res-cpu)">{tr('CPU requested')} →</div>
				<p class="mt-1 max-w-[240px] text-xs text-surface-600-400">
					{tr('Dots far from the diagonal mean one resource fills up while the other is')} <Term k="stranded">{tr('stranded')}</Term>.
				</p>
			</div>

			<div class="grid gap-6">
				{#if fr}
					<div class="sheet p-4">
						<div class="eyebrow mb-3"><Term k="fragmentation">{tr('Fragmentation')}</Term> & {tr('free capacity (baseline)')}</div>
						<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
							<div>
								<div class="num text-2xl font-bold">{pctFmt(fr.index)}</div>
  						<div class="text-xs text-surface-600-400">{tr('fragmentation index')}</div>
							</div>
							<div>
								<div class="num text-2xl font-bold">{fr.refSlots}<span class="text-sm text-surface-600-400">/{fr.idealSlots}</span></div>
 							<div class="text-xs text-surface-600-400">{tr('typical pods ({cpu}c/{memory}G) that still fit vs. if free space were pooled').replace('{cpu}', fmt(fr.refPod.cpu, 2)).replace('{memory}', fmt(fr.refPod.mem))}</div>
							</div>
							<div>
								<div class="num text-2xl font-bold" style="color:var(--res-cpu)">{fmt(fr.freeCpu)}<span class="text-sm"> c</span></div>
 							<div class="text-xs text-surface-600-400">{tr('free CPU · {amount} stranded').replace('{amount}', fmt(fr.strandedCpu))}</div>
							</div>
							<div>
								<div class="num text-2xl font-bold" style="color:var(--res-mem)">{fmt(fr.freeMem)}<span class="text-sm"> GiB</span></div>
 							<div class="text-xs text-surface-600-400">{tr('free memory · {amount} stranded').replace('{amount}', fmt(fr.strandedMem))}</div>
							</div>
						</div>
						<p class="mt-3 text-xs text-surface-600-400">
							{tr('Workload demand ratio is {ratio} GiB per core. Stranded capacity is free CPU without matching memory (or vice versa) at that ratio.').replace('{ratio}', fmt(fr.demandRatio))}
						</p>
					</div>
				{/if}

				<div class="sheet overflow-x-auto">
					<div class="eyebrow px-4 pt-3">{tr('Scaling headroom per workload')}</div>
					<table class="num w-full text-xs">
						<thead class="eyebrow text-left">
							<tr class="[&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
								<th>{tr('Workload')}</th><th class="text-right">{tr('Replicas')}</th><th class="text-right"><Term k="hpa">{tr('HPA max')}</Term></th><th class="text-right">+ {tr('on current nodes')}</th><th
									class="text-right">+ {tr('with autoscaling')}</th
								><th class="text-right">{tr('Peak OK')}</th>
							</tr>
						</thead>
						<tbody>
							{#each cr.headroom as h (h.workloadId)}
								<tr class="border-t border-surface-200-800 [&>td]:px-3 [&>td]:py-1.5">
									<td class="font-sans font-semibold"><span class="mr-1.5 inline-block size-2.5 rounded-[2px]" style="background:{colors.get(h.workloadId)}"></span>{h.name}</td>
									<td class="text-right">{h.replicas}</td>
									<td class="text-right">{h.maxReplicas}</td>
									<td class="text-right">+{h.extraOnCurrent}{h.capped && h.extraOnCurrent === h.extraWithAutoscale ? '+' : ''}</td>
									<td class="text-right">+{h.extraWithAutoscale}{h.capped ? '+' : ''}</td>
									<td class="text-right">{#if h.hpaFits}<span class="text-success-700-300">{tr('fits')}</span>{:else}<span class="text-error-600-400">{tr('does not fit')}</span>{/if}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{/if}
</section>
