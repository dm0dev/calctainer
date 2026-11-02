<script lang="ts">
	import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Code, Copy, ExternalLink, Plus, Trash2 } from '@lucide/svelte';
	import { colorMap } from '../colors';
	import { newGuidedWorkload, newWorkload, TEMPLATES, uid, workloadFromTemplate } from '../engine/defaults';
	import { defaultGuided } from '../engine/guided';
	import { fmt } from '../engine/format';
	import { DEFAULT_NAMESPACE, namespaceError, namespaceGroups, namespaceOf, renameNamespace, uniqueName } from '../engine/namespaces';
	import { lim } from '../engine/nodes';
	import { BASIS_LABEL, presetFootprint, REDHAT_PRESETS, UNSET_ALLOWANCE, workloadsFromPreset } from '../engine/presets';
	import type { AntiAffinity, Workload, WorkloadKind } from '../engine/types';
	import { translate } from '../i18n';
	import { app, currentCluster, plan } from '../state.svelte';
	import { workloadYaml } from '../yaml';
	import ClusterTabs from './ClusterTabs.svelte';
	import GuidedCard from './GuidedCard.svelte';
	import NumCell from './NumCell.svelte';
	import SectionHead from './SectionHead.svelte';
	import Term from './Term.svelte';

	const mode = $derived(app.ui.mode);
	const t = (source: string, values: Record<string, string | number> = {}) => translate(source, app.ui.language, values);
	const tr = (source: string, values: Record<string, string | number> = {}) => translate(source, app.ui.language, values);
	const cluster = $derived(currentCluster());
	const list = $derived(cluster ? app.scenario.workloads.filter((w) => w.clusterId === cluster.id) : []);
	const colors = $derived(colorMap(app.scenario.workloads.map((w) => w.id)));
	const cr = $derived(plan.result.clusters.find((c) => c.clusterId === cluster?.id));
	const unsched = $derived.by(() => {
		const m = new Map<string, number>();
		for (const p of cr?.sim.unscheduled ?? []) m.set(p.workloadId, (m.get(p.workloadId) ?? 0) + 1);
		return m;
	});
	const headroom = $derived(new Map((cr?.headroom ?? []).map((h) => [h.workloadId, h])));
	const poolNames = $derived([...new Set([...(cr?.pools.map((p) => p.name) ?? []), ...list.map((w) => w.pool).filter(Boolean)])]);
	let yamlOpen = $state<string | null>(null);
	let nsError = $state<string | null>(null);
	const groups = $derived(namespaceGroups(list, cr?.totals.nodes ?? 0));
	const nsNames = $derived(groups.map((g) => g.namespace));
	const nsKey = (ns: string) => `${cluster?.id}/${ns}`;
	const isCollapsed = (ns: string) => !!app.ui.collapsedNs[nsKey(ns)];
	function setCollapsed(ns: string, v: boolean) {
		if (v) app.ui.collapsedNs[nsKey(ns)] = true;
		else delete app.ui.collapsedNs[nsKey(ns)];
	}
	function setAllCollapsed(v: boolean) {
		for (const ns of nsNames) setCollapsed(ns, v);
	}
	const groupUnsched = (ws: Workload[]) => ws.reduce((n, w) => n + (unsched.get(w.id) ?? 0), 0);
	const groupHpaShort = (ws: Workload[]) => ws.filter((w) => w.enabled && headroom.get(w.id) && !headroom.get(w.id)!.hpaFits).length;
	/** Validates a namespace typed by the user; on error the input is reset and the reason shown. */
	function acceptNamespace(e: Event, current: string): string | null {
		const input = e.currentTarget as HTMLInputElement;
		const v = input.value.trim();
		const err = namespaceError(v);
		if (err) {
			nsError = t('“{name}”: {error}', { name: v, error: t(err) });
			input.value = current;
			return null;
		}
		nsError = null;
		return v;
	}
	function moveWorkload(e: Event, w: Workload) {
		const from = namespaceOf(w);
		const to = acceptNamespace(e, from);
		if (!to || to === from) return;
		const taken = list.filter((x) => x.id !== w.id && namespaceOf(x) === to).map((x) => x.name);
		if (taken.includes(w.name)) w.name = uniqueName(w.name, taken);
		w.namespace = to;
		setCollapsed(to, false);
	}
	function renameGroup(e: Event, from: string) {
		const to = acceptNamespace(e, from);
		if (!to || to === from || !cluster) return;
		if (nsNames.includes(to) && !confirm(t('Namespace “{target}” already exists. Merge all workloads of “{source}” into it?', { target: to, source: from }))) {
			(e.currentTarget as HTMLInputElement).value = from;
			return;
		}
		const taken = list.filter((x) => namespaceOf(x) === to).map((x) => x.name);
		for (const w of list) if (namespaceOf(w) === from && taken.includes(w.name)) w.name = uniqueName(w.name, [...taken, ...list.filter((x) => namespaceOf(x) === from).map((x) => x.name)]);
		const collapsed = isCollapsed(from);
		renameNamespace(app.scenario.workloads, cluster.id, from, to);
		setCollapsed(from, false);
		setCollapsed(to, collapsed);
	}
	function removeGroup(ns: string, count: number) {
		if (!cluster || !confirm(t('Remove namespace “{namespace}” and its {count} workloads?', { namespace: ns, count }))) return;
		const id = cluster.id;
		app.scenario.workloads = app.scenario.workloads.filter((w) => !(w.clusterId === id && namespaceOf(w) === ns));
		setCollapsed(ns, false);
	}
	function setGroupEnabled(ws: Workload[], v: boolean) {
		for (const w of ws) w.enabled = v;
	}

	const KINDS: WorkloadKind[] = ['Deployment', 'StatefulSet', 'DaemonSet', 'Job'];
	const ANTI = $derived<{ v: AntiAffinity; l: string }[]>([
		{ v: 'none', l: t('may share node') },
		{ v: 'preferred', l: t('spread (soft)') },
		{ v: 'required', l: t('one per node') }
	]);

	const sums = $derived.by(() => {
		let pods = 0,
			cpu = 0,
			mem = 0,
			cpuL = 0,
			memL = 0,
			st = 0;
		const nodes = cr?.totals.nodes ?? 0;
		for (const w of list) {
			if (!w.enabled) continue;
			const r = w.kind === 'DaemonSet' ? nodes : w.replicas;
			pods += r;
			cpu += r * w.cpuRequest;
			mem += r * w.memRequestGiB;
			cpuL += r * lim(w.cpuRequest, w.cpuLimit);
			memL += r * lim(w.memRequestGiB, w.memLimitGiB);
			st += r * w.storageGiB;
		}
		return { pods, cpu, mem, cpuL, memL, st };
	});

	const namesIn = (ns: string) => list.filter((x) => namespaceOf(x) === ns).map((x) => x.name);
	function add(ns = DEFAULT_NAMESPACE) {
		if (!cluster) return;
		const name = uniqueName(`app-${list.length + 1}`, namesIn(ns));
		const w = mode === 'guided' ? newGuidedWorkload(cluster.id, name, defaultGuided()) : newWorkload(cluster.id, { name });
		w.namespace = ns;
		app.scenario.workloads.push(w);
		setCollapsed(ns, false);
	}
	function addTemplate(id: string) {
		const t = TEMPLATES.find((x) => x.id === id);
		if (!t || !cluster) return;
		app.scenario.workloads.push(workloadFromTemplate(cluster.id, t, mode === 'guided', namesIn(t.namespace)));
		setCollapsed(t.namespace, false);
	}
	/** Operator installs land collapsed in their own namespace so the list stays readable. */
	function addPreset(id: string) {
		const p = REDHAT_PRESETS.find((x) => x.id === id);
		if (!p || !cluster) return;
		const ws = workloadsFromPreset(cluster.id, p, nsNames);
		app.scenario.workloads.push(...ws);
		setCollapsed(namespaceOf(ws[0]), true);
	}
	function presetTitle(id: string): string {
		const p = REDHAT_PRESETS.find((x) => x.id === id)!;
		const f = presetFootprint(p);
		const ds = f.daemonCpu || f.daemonMemGiB ? ` + per node ${fmt(f.daemonCpu, 2)} CPU / ${fmt(f.daemonMemGiB)} GiB` : '';
		return `${p.product}\n${t(p.description)}\n${t('Adds {count} workloads: {pods} pods, {cpu} CPU / {memory} GiB requested{daemon}.', {
			count: p.components.length,
			pods: f.pods,
			cpu: fmt(f.cpu, 2),
			memory: fmt(f.memGiB),
			daemon: ds
		})}\n${p.caveats.map((c) => t(c)).join('\n')}`;
	}
	const presetTip = (w: Workload) => (w.preset ? `${w.notes ?? ''}${w.preset.source ? `\nSource: ${w.preset.source}` : ''}` : '');
	function remove(id: string) {
		app.scenario.workloads = app.scenario.workloads.filter((w) => w.id !== id);
	}
	function duplicate(w: Workload) {
		const copy = { ...$state.snapshot(w), id: uid('wl'), name: uniqueName(`${w.name}-copy`, namesIn(namespaceOf(w))) } as Workload;
		const i = app.scenario.workloads.findIndex((x) => x.id === w.id);
		app.scenario.workloads.splice(i + 1, 0, copy);
	}
	/** Direct Kubernetes edits detach the VM description so both never disagree. */
	function detach(w: Workload) {
		if (w.guided) w.guided = null;
	}
	function setReplicas(w: Workload, v: number | null | undefined) {
		w.replicas = Math.max(0, Math.round(v ?? 0));
		if (w.maxReplicas < w.replicas) w.maxReplicas = w.replicas;
		detach(w);
	}
	function removeCluster() {
		if (!cluster || app.scenario.clusters.length <= 1) return;
		if (!confirm(t('Remove hosted cluster “{name}” and its {count} workloads?', { name: cluster.name, count: list.length }))) return;
		const id = cluster.id;
		app.scenario.workloads = app.scenario.workloads.filter((w) => w.clusterId !== id);
		app.scenario.clusters = app.scenario.clusters.filter((c) => c.id !== id);
		for (const k of Object.keys(app.ui.collapsedNs)) if (k.startsWith(`${id}/`)) delete app.ui.collapsedNs[k];
		app.ui.clusterId = app.scenario.clusters[0]?.id ?? null;
	}
</script>

<section class="reveal space-y-5">
	<SectionHead
		no="01"
		title={mode === 'guided' ? 'Your applications' : 'Workloads'}
		lede={mode === 'guided'
		? 'Describe each application the way you know it today — as virtual machines. The planner translates it into Kubernetes terms.'
			: 'Per-replica requests, limits and PVC storage of every workload running inside the hosted cluster.'}
		guided="Tip: an application that ran on two identical VMs is entered once with “Number of VMs = 2”. Hover underlined words for explanations."
	/>

	<div class="flex flex-wrap items-center justify-between gap-3">
		<ClusterTabs />
		{#if cluster}
			<div class="flex items-center gap-2">
				<label class="flex items-center gap-2 text-xs">
					<span class="eyebrow">{t('Name')}</span>
					<input class="input field-sm num w-48 py-1" bind:value={cluster.name} aria-label={t('Hosted cluster name')} />
				</label>
				{#if app.scenario.clusters.length > 1}
					<button class="btn-icon btn-icon-sm hover:preset-tonal-error" title={t('Remove hosted cluster')} aria-label={t('Remove hosted cluster')} onclick={removeCluster}
						><Trash2 class="size-4" /></button
					>
				{/if}
			</div>
		{/if}
	</div>

	{#if !cluster}
		<div class="sheet p-8 text-center">
			<p class="mb-3">{t('No hosted cluster yet.')}</p>
		</div>
	{:else}
		<div class="space-y-2">
			<div class="flex flex-wrap items-center gap-2" role="group" aria-label={t('Official Red Hat operator presets')}>
				<span class="eyebrow mr-1 flex items-center gap-1.5"
					><span class="badge preset-filled-primary-700 px-1.5 py-0 text-[10px] tracking-wide">Red Hat</span> {t('Official operators')}</span
				>
				{#each REDHAT_PRESETS as p (p.id)}
					<button class="chip preset-tonal-primary border border-primary-500/40 hover:preset-filled-primary-500" title={presetTitle(p.id)} onclick={() => addPreset(p.id)}>
						<Plus class="size-3" />{p.label}<span class="num text-[10px] opacity-70">×{p.components.length}</span>
					</button>
				{/each}
			</div>
			<details class="text-[11.5px] text-surface-700-300">
				<summary class="cursor-pointer select-none text-surface-600-400">{t('Red Hat preset sources, value provenance and exclusions')}</summary>
				<p class="mt-2 max-w-3xl">
					{t('Each preset adds one workload per operator/operand pod with its default configuration. Values come from Red Hat documentation where stated, otherwise from the upstream operator defaults; components without requests get a planner allowance of {cpu} CPU / {memory} GiB request. Verify against your installed version.')
						.replace('{cpu}', String(UNSET_ALLOWANCE.cpuRequest)).replace('{memory}', String(UNSET_ALLOWANCE.memRequestGiB))}
				</p>
				<ul class="mt-2 grid gap-2 md:grid-cols-2">
					{#each REDHAT_PRESETS as p (p.id)}
						<li class="rounded-base border border-surface-200-800 p-2">
							<div class="font-semibold">{p.product}</div>
							<div class="text-[10.5px] text-surface-600-400">
								{[...new Set(p.components.map((c) => translate(BASIS_LABEL[c.basis], app.ui.language)))].join(' · ')}
							</div>
							<ul class="mt-1 space-y-0.5">
								{#each p.caveats as c, i (i)}<li>· {translate(c, app.ui.language)}</li>{/each}
							</ul>
							<div class="mt-1 flex flex-wrap gap-x-3">
								{#each p.docs as d (d.url)}
									<a class="anchor inline-flex items-center gap-0.5" href={d.url} target="_blank" rel="noopener noreferrer">{d.label}<ExternalLink class="size-3" /></a>
								{/each}
							</div>
						</li>
					{/each}
				</ul>
			</details>
			<div class="flex flex-wrap items-center gap-2" role="group" aria-label={t('Generic workload templates')}>
				<span class="eyebrow mr-1">{t('Generic templates')}</span>
				{#each TEMPLATES as t (t.id)}
									<button class="chip preset-outlined-surface-300-700 hover:preset-tonal-surface" title={translate(t.description, app.ui.language)} onclick={() => addTemplate(t.id)}>
						<Plus class="size-3" />{t.label}
					</button>
				{/each}
				<button class="btn btn-sm preset-filled-primary-500 ml-auto" onclick={() => add()}><Plus class="size-4" /> {t(mode === 'guided' ? 'Application' : 'Workload')}</button>
			</div>
		</div>

		<datalist id="ns-names">
			{#each nsNames as n (n)}<option value={n}></option>{/each}
		</datalist>
		{#if mode === 'guided'}
			{@render nsToolbar()}
			<div class="space-y-5">
				{#each groups as g (g.namespace)}
					{@const collapsed = isCollapsed(g.namespace)}
					{@const u = groupUnsched(g.workloads)}
					<section class="space-y-3" aria-label={t('Namespace {namespace}', { namespace: g.namespace })}>
						<header class="sheet flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2">
							{@render nsHeading(g.namespace, collapsed, g.presetLabel)}
							<span class="text-xs text-surface-700-300">
								{t('{count} applications', { count: g.totals.workloads })} · {t('{count} copies reserve', { count: g.totals.pods })}
								<strong style="color:var(--res-cpu)">{fmt(g.totals.cpu, 2)} CPU</strong> {t('and')} <strong style="color:var(--res-mem)">{fmt(g.totals.mem)} GiB</strong>{g.totals
									.storageGiB
									? ` · ${fmt(g.totals.storageGiB, 0)} GiB ${t('storage')}`
									: ''}
							</span>
							{@render nsStatus(u, groupHpaShort(g.workloads))}
							{@render nsActions(g.namespace, g.workloads.length)}
						</header>
						{#if !collapsed}
							{#each g.workloads as w (w.id)}
								<GuidedCard
									{w}
									color={colors.get(w.id) ?? '#999'}
									unscheduled={unsched.get(w.id) ?? 0}
									headroom={headroom.get(w.id)}
									onremove={() => remove(w.id)}
									onnamespace={(e) => moveWorkload(e, w)}
								/>
							{/each}
						{/if}
					</section>
				{:else}
					<div class="sheet p-10 text-center text-surface-600-400">{t('No applications yet — pick a template above or add one.')}</div>
				{/each}
			</div>
		{:else}
			{@render nsToolbar()}
			<div class="sheet overflow-x-auto">
				<table class="w-full min-w-[1100px] border-collapse text-[12.5px]">
					<thead class="border-b-2 border-surface-950-50 text-left">
						<tr class="eyebrow [&>th]:px-2 [&>th]:py-2 [&>th]:font-medium">
							{#if mode === 'expert'}<th class="w-8">{t('On')}</th>{/if}
							<th>{t('Name')}</th>
							<th><Term k="namespace">{t('Namespace')}</Term></th>
							<th>{t('Kind')}</th>
							<th class="text-right"><Term k="replica">{t('Replicas')}</Term></th>
							<th class="text-right"><Term k="hpa">{t('HPA max')}</Term></th>
							<th class="text-right" style="color:var(--res-cpu)"><Term k="request">{t('CPU req')}</Term></th>
							<th class="text-right" style="color:var(--res-cpu)"><Term k="limit">{t('CPU lim')}</Term></th>
							<th class="text-right" style="color:var(--res-mem)">{t('Mem req GiB')}</th>
							<th class="text-right" style="color:var(--res-mem)">{t('Mem lim GiB')}</th>
							<th class="text-right" style="color:var(--res-storage)"><Term k="pvc">{t('PVC GiB')}</Term></th>
							<th><Term k="antiaffinity">{t('Placement')}</Term></th>
							{#if mode === 'expert'}<th><Term k="nodepool">{t('Pool')}</Term></th>{/if}
							<th class="text-right">{t('Status')}</th>
							<th class="w-20"></th>
						</tr>
					</thead>
					{#each groups as g (g.namespace)}
						{@const collapsed = isCollapsed(g.namespace)}
						{@const t = g.totals}
						<tbody>
						<tr class="border-y border-surface-300-700 bg-surface-100-900 num text-[12px] [&>td]:px-2 [&>td]:py-1.5" title={tr('Totals over enabled workloads: per-replica values × replicas, DaemonSets × {nodes} nodes', { nodes: cr?.totals.nodes ?? 0 })}>
							{#if mode === 'expert'}
								<td class="text-center">
									<input
										type="checkbox"
										class="checkbox"
										checked={t.enabled === t.workloads && t.workloads > 0}
										indeterminate={t.enabled > 0 && t.enabled < t.workloads}
										onchange={(e) => setGroupEnabled(g.workloads, (e.currentTarget as HTMLInputElement).checked)}
										aria-label={tr('Enable all workloads in namespace {namespace}', { namespace: g.namespace })}
									/>
								</td>
							{/if}
							<td colspan="3">
								<div class="flex items-center gap-2 whitespace-nowrap">
									{@render nsHeading(g.namespace, collapsed, g.presetLabel)}
										<span class="text-[11px] text-surface-600-400">{translate('{count} workloads', app.ui.language, { count: t.workloads })} · Σ</span>
								</div>
							</td>
							<td class="text-right font-bold">{t.pods}</td>
							<td class="text-right">{t.maxPods}</td>
							<td class="text-right font-bold" style="color:var(--res-cpu)">{fmt(t.cpu, 2)}</td>
							<td class="text-right">{fmt(t.cpuLim, 2)}</td>
							<td class="text-right font-bold" style="color:var(--res-mem)">{fmt(t.mem)}</td>
							<td class="text-right">{fmt(t.memLim)}</td>
							<td class="text-right" style="color:var(--res-storage)">{fmt(t.storageGiB, 0)}</td>
							<td colspan={mode === 'expert' ? 2 : 1} class="text-[10.5px] text-surface-600-400">{translate('totals', app.ui.language)}</td>
							<td class="text-right">{@render nsStatus(groupUnsched(g.workloads), groupHpaShort(g.workloads))}</td>
							<td>{@render nsActions(g.namespace, g.workloads.length)}</td>
						</tr>
						{#each collapsed ? [] : g.workloads as w (w.id)}
							{@const u = unsched.get(w.id) ?? 0}
							{@const h = headroom.get(w.id)}
							<tr class="border-b border-surface-200-800 hover:bg-surface-100-900/60 {w.enabled ? '' : 'opacity-45'} [&>td]:px-1 [&>td]:py-1">
								{#if mode === 'expert'}
 								<td class="text-center"><input type="checkbox" class="checkbox" bind:checked={w.enabled} aria-label={translate('Enabled', app.ui.language)} /></td>
								{/if}
								<td class="min-w-[10rem]">
									<div class="flex items-center gap-1.5">
										<span class="size-2.5 shrink-0 rounded-[2px]" style="background:{colors.get(w.id)}"></span>
										<input class="cell-input text-left! font-semibold" bind:value={w.name} aria-label={translate('Workload name', app.ui.language)} />
										{#if w.guided}<span class="badge preset-filled-surface-700 px-1 py-0 text-[10px]" title={translate('Described as VM in guided mode', app.ui.language)}>VM</span>{/if}
										{#if w.preset?.vendor === 'redhat'}<span class="badge preset-filled-primary-700 px-1 py-0 text-[10px] whitespace-nowrap" title={presetTip(w)}
												>RH · {BASIS_LABEL[w.preset.basis]}</span
											>{/if}
									</div>
								</td>
								<td class="min-w-[8rem]">
									<input
										class="cell-input text-left! text-[12px]"
										list="ns-names"
										value={namespaceOf(w)}
										onchange={(e) => moveWorkload(e, w)}
										aria-label={translate('Namespace of {name}', app.ui.language, { name: w.name })}
										spellcheck="false"
									/>
								</td>
								<td class="min-w-[7.5rem]">
									<select class="cell-input text-[12px]" bind:value={w.kind} onchange={() => detach(w)} aria-label={translate('Kind', app.ui.language)}>
										{#each KINDS as k (k)}<option value={k}>{k}</option>{/each}
									</select>
								</td>
								{#if w.kind === 'DaemonSet'}
									<td colspan="2" class="text-center text-[11px] text-surface-600-400"><Term k="daemonset">{translate('one per node', app.ui.language)}</Term></td>
								{:else}
									<td class="w-16 min-w-[3.5rem]"><NumCell bind:value={w.replicas} title={translate('Replicas', app.ui.language)} onchange={() => setReplicas(w, w.replicas)} /></td>
									<td class="w-16 min-w-[3.5rem]"><NumCell bind:value={w.maxReplicas} min={w.replicas} title={translate('HPA max replicas', app.ui.language)} onchange={() => detach(w)} /></td>
								{/if}
								<td class="w-20 min-w-[4.25rem]"><NumCell bind:value={w.cpuRequest} step={0.05} title={translate('CPU request (cores)', app.ui.language)} onchange={() => detach(w)} /></td>
								<td class="w-20 min-w-[4.25rem]"><NumCell bind:value={w.cpuLimit} step={0.1} nullable placeholder={translate('none', app.ui.language)} title={translate('CPU limit (cores)', app.ui.language)} onchange={() => detach(w)} /></td>
								<td class="w-20 min-w-[4.25rem]"><NumCell bind:value={w.memRequestGiB} step={0.25} title={translate('Memory request (GiB)', app.ui.language)} onchange={() => detach(w)} /></td>
								<td class="w-20 min-w-[4.25rem]"><NumCell bind:value={w.memLimitGiB} step={0.25} nullable placeholder={translate('none', app.ui.language)} title={translate('Memory limit (GiB)', app.ui.language)} onchange={() => detach(w)} /></td>
								<td class="w-20 min-w-[4.25rem]"><NumCell bind:value={w.storageGiB} step={10} title={translate('PVC storage per replica (GiB)', app.ui.language)} onchange={() => detach(w)} /></td>
								<td class="min-w-[8rem]">
									<select class="cell-input text-[12px]" bind:value={w.antiAffinity} onchange={() => detach(w)} aria-label={translate('Anti-affinity', app.ui.language)}>
										{#each ANTI as a (a.v)}<option value={a.v}>{a.l}</option>{/each}
									</select>
								</td>
								{#if mode === 'expert'}
									<td class="min-w-[7.5rem]">
										<input class="cell-input text-left!" list="pool-names" bind:value={w.pool} placeholder={translate(w.kind === 'DaemonSet' ? 'all nodes' : 'any general', app.ui.language)} aria-label={translate('Target node pool', app.ui.language)} />
									</td>
								{/if}
								<td class="num text-right text-[11px] whitespace-nowrap">
									{#if !w.enabled}
										<span class="text-surface-500">{translate('off', app.ui.language)}</span>
									{:else if u > 0}
										<span class="badge preset-filled-error-500 px-1.5 py-0">{translate('{count} pending', app.ui.language, { count: u })}</span>
									{:else if h && !h.hpaFits}
										<span class="badge preset-filled-warning-500 px-1.5 py-0" title={translate('HPA maximum cannot be reached', app.ui.language)}>{translate('peak', app.ui.language)} {h.replicas + h.extraWithAutoscale}/{h.maxReplicas}</span>
									{:else if h}
										<span class="text-success-700-300" title={translate('Additional replicas that fit on current nodes', app.ui.language)}>+{h.capped ? `${h.extraOnCurrent}+` : h.extraOnCurrent} {translate('spare', app.ui.language)}</span>
									{:else}
										<span class="text-success-700-300">{translate('scheduled', app.ui.language)}</span>
									{/if}
								</td>
								<td>
									<div class="flex justify-end gap-0.5">
										{#if mode === 'expert'}
 										<button class="btn-icon btn-icon-sm {yamlOpen === w.id ? 'preset-tonal-primary' : ''}" title={translate('YAML preview', app.ui.language)} aria-label={translate('YAML preview', app.ui.language)} onclick={() => (yamlOpen = yamlOpen === w.id ? null : w.id)}
												><Code class="size-3.5" /></button
											>
										{/if}
										<button class="btn-icon btn-icon-sm" title={translate('Duplicate', app.ui.language)} aria-label={translate('Duplicate', app.ui.language)} onclick={() => duplicate(w)}><Copy class="size-3.5" /></button>
										<button class="btn-icon btn-icon-sm hover:preset-tonal-error" title={translate('Remove', app.ui.language)} aria-label={translate('Remove', app.ui.language)} onclick={() => remove(w.id)}><Trash2 class="size-3.5" /></button>
									</div>
								</td>
							</tr>
							{#if yamlOpen === w.id}
								<tr class="border-b border-surface-200-800 bg-surface-100-900/70">
									<td colspan={mode === 'expert' ? 15 : 13} class="p-3">
										<pre class="num max-h-80 overflow-auto rounded-base bg-surface-950 p-3 text-[11.5px] leading-relaxed text-surface-100">{workloadYaml(w)}</pre>
									</td>
								</tr>
							{/if}
						{/each}
						</tbody>
					{:else}
						<tbody>
							<tr><td colspan={mode === 'expert' ? 15 : 13} class="p-10 text-center text-surface-600-400">{translate('No workloads yet — pick a template above or add one.', app.ui.language)}</td></tr>
						</tbody>
					{/each}
					{#if list.length}
						<tfoot class="num border-t-2 border-surface-950-50 text-[12px] font-bold">
							<tr class="[&>td]:px-2 [&>td]:py-2">
								{#if mode === 'expert'}<td></td>{/if}
 							<td colspan="3" class="eyebrow">Σ {translate('requested', app.ui.language)} · {sums.pods} {translate('pods', app.ui.language)}</td>
								<td></td>
								<td></td>
								<td class="text-right" style="color:var(--res-cpu)">{fmt(sums.cpu, 2)}</td>
								<td class="text-right font-normal">{fmt(sums.cpuL, 2)}</td>
								<td class="text-right" style="color:var(--res-mem)">{fmt(sums.mem)}</td>
								<td class="text-right font-normal">{fmt(sums.memL)}</td>
								<td class="text-right" style="color:var(--res-storage)">{fmt(sums.st, 0)}</td>
								<td colspan={mode === 'expert' ? 4 : 3} class="text-[10.5px] font-normal text-surface-600-400">{translate('totals × replicas (DaemonSets × {nodes} nodes)', app.ui.language, { nodes: cr?.totals.nodes ?? 0 })}</td>
							</tr>
						</tfoot>
					{/if}
				</table>
				<datalist id="pool-names">
					{#each poolNames as p (p)}<option value={p}></option>{/each}
				</datalist>
			</div>
			{#if mode === 'expert'}
				<p class="text-[11px] text-surface-600-400">
					<ChevronDown class="inline size-3" /> {tr('A workload with a pool name lands on a dedicated (tainted) pool of that name; empty means any general pool. Missing limits are counted as equal to requests in limit totals.')}
				</p>
			{/if}
		{/if}
	{/if}
</section>

{#snippet nsToolbar()}
	<div class="flex flex-wrap items-center gap-2 text-xs">
		<span class="eyebrow"><Term k="namespace">{tr(mode === 'guided' ? 'Groups (namespaces)' : 'Namespaces')}</Term></span>
		<span class="text-surface-600-400">{tr('{count} in this cluster', { count: groups.length })}</span>
		{#if groups.length > 1}
			<button class="btn btn-sm preset-filled-surface-600 ml-auto py-0.5" onclick={() => setAllCollapsed(false)}><ChevronsUpDown class="size-3.5" /> {tr('Expand all')}</button>
			<button class="btn btn-sm preset-filled-surface-600 py-0.5" onclick={() => setAllCollapsed(true)}><ChevronsDownUp class="size-3.5" /> {tr('Collapse all')}</button>
		{/if}
	</div>
	{#if nsError}
		<p class="rounded-base preset-tonal-error px-2 py-1.5 text-xs" role="alert">{nsError} {tr('The previous namespace was kept.')}</p>
	{/if}
{/snippet}

{#snippet nsHeading(ns: string, collapsed: boolean, presetLabel: string | null)}
	<button
		class="btn-icon btn-icon-sm -ml-1"
		aria-expanded={!collapsed}
		aria-label={tr('{action} namespace {namespace}', { action: collapsed ? tr('Expand') : tr('Collapse'), namespace: ns })}
		title={collapsed ? tr('Expand') : tr('Collapse')}
		onclick={() => setCollapsed(ns, !collapsed)}
	>
		{#if collapsed}<ChevronRight class="size-4" />{:else}<ChevronDown class="size-4" />{/if}
	</button>
	<input
		class="cell-input w-auto! min-w-[8rem] text-left! font-semibold"
		size={Math.max(8, ns.length)}
		value={ns}
		onchange={(e) => renameGroup(e, ns)}
		aria-label={tr('Rename namespace {namespace}', { namespace: ns })}
		spellcheck="false"
	/>
	{#if presetLabel}<span class="badge preset-filled-primary-700 px-1.5 py-0 text-[10px] whitespace-nowrap" title={tr('All workloads come from this Red Hat operator preset')}>Red Hat · {presetLabel}</span>{/if}
{/snippet}

{#snippet nsStatus(pending: number, hpaShort: number)}
	{#if pending > 0}
		<span class="badge preset-filled-error-500 px-1.5 py-0 text-[11px]">{tr('{count} pending', { count: pending })}</span>
	{:else if hpaShort > 0}
		<span class="badge preset-filled-warning-500 px-1.5 py-0 text-[11px]" title={tr('Workloads whose HPA maximum cannot be reached')}>{tr('{count} peak short', { count: hpaShort })}</span>
	{:else}
		<span class="text-[11px] text-success-700-300">✓ {tr('fits')}</span>
	{/if}
{/snippet}

{#snippet nsActions(ns: string, count: number)}
	<div class="ml-auto flex justify-end gap-0.5">
		<button class="btn-icon btn-icon-sm" title={tr('Add {item} to {namespace}', { item: tr(mode === 'guided' ? 'application' : 'workload'), namespace: ns })} aria-label={tr('Add workload to namespace {namespace}', { namespace: ns })} onclick={() => add(ns)}
			><Plus class="size-3.5" /></button
		>
		<button class="btn-icon btn-icon-sm hover:preset-tonal-error" title={tr('Remove namespace {namespace}', { namespace: ns })} aria-label={tr('Remove namespace {namespace}', { namespace: ns })} onclick={() => removeGroup(ns, count)}
			><Trash2 class="size-3.5" /></button
		>
	</div>
{/snippet}
