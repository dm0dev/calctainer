<script lang="ts">
	import type { Snippet } from 'svelte';
	import { translate } from '../i18n';
	import { app } from '../state.svelte';

	let {
		no,
		title,
		lede = '',
		guided = '',
		actions
	}: { no: string; title: string; lede?: string; guided?: string; actions?: Snippet } = $props();
</script>

<header class="flex flex-wrap items-end justify-between gap-4 border-b-2 border-surface-950-50 pb-3">
	<div class="max-w-3xl">
		<div class="eyebrow">§{no} — {translate(title, app.ui.language)}</div>
		<h2 class="mt-1 text-3xl leading-none font-extrabold tracking-tight md:text-4xl">{translate(title, app.ui.language)}</h2>
		{#if lede}<p class="mt-2 text-sm text-surface-700-300">{translate(lede, app.ui.language)}</p>{/if}
		{#if guided && app.ui.mode === 'guided'}
			<p class="mt-2 border-l-4 border-primary-500 bg-primary-500/8 py-1.5 pl-3 text-sm text-surface-800-200">{translate(guided, app.ui.language)}</p>
		{/if}
	</div>
	{#if actions}<div class="no-print flex flex-wrap items-center gap-2">{@render actions()}</div>{/if}
</header>
