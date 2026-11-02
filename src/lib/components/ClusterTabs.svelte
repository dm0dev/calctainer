<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import { newCluster } from '../engine/defaults';
	import { translate } from '../i18n';
	import { app, plan } from '../state.svelte';

	let { allowAdd = true, showAll = false }: { allowAdd?: boolean; showAll?: boolean } = $props();

	function add() {
		const c = newCluster(`hosted-cluster-${app.scenario.clusters.length + 1}`);
		app.scenario.clusters.push(c);
		app.ui.clusterId = c.id;
	}
	const counts = $derived(
		new Map(plan.result.clusters.map((c) => [c.clusterId, c.findings.filter((f) => f.severity === 'critical' || f.severity === 'warning').length]))
	);
	const active = $derived(app.ui.clusterId ?? app.scenario.clusters[0]?.id);
</script>

	<div class="flex flex-wrap items-center gap-1.5" role="tablist" aria-label={translate('Hosted clusters', app.ui.language)}>
	<span class="eyebrow mr-1">{translate('Hosted cluster', app.ui.language)}</span>
	{#if showAll}
		<button
			class="chip {active === '__all__' ? 'preset-filled-surface-950-50' : 'preset-outlined-surface-300-700'}"
			role="tab"
			aria-selected={active === '__all__'}
			onclick={() => (app.ui.clusterId = '__all__')}>{translate('All', app.ui.language)}</button
		>
	{/if}
	{#each app.scenario.clusters as c (c.id)}
		<button
			class="chip num {active === c.id ? 'preset-filled-surface-950-50' : 'preset-outlined-surface-300-700'}"
			role="tab"
			aria-selected={active === c.id}
			onclick={() => (app.ui.clusterId = c.id)}
		>
			{c.name}
			{#if counts.get(c.id)}<span class="ml-0.5 inline-block size-2 rounded-full bg-warning-500"></span>{/if}
		</button>
	{/each}
	{#if allowAdd}
		<button class="chip preset-tonal-primary" onclick={add} title={translate('Add hosted cluster', app.ui.language)}><Plus class="size-3.5" /> {translate('Cluster', app.ui.language)}</button>
	{/if}
</div>
