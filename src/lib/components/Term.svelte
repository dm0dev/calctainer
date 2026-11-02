<script lang="ts">
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
	import type { Snippet } from 'svelte';
	import { GLOSSARY } from '../glossary';
	import { translate } from '../i18n';
	import { app } from '../state.svelte';

	let { k, children }: { k: keyof typeof GLOSSARY | string; children?: Snippet } = $props();
	const entry = $derived(GLOSSARY[k]);
</script>

{#if entry}
	<Tooltip positioning={{ placement: 'top' }} openDelay={150} closeDelay={80}>
		<Tooltip.Trigger
			class="cursor-help underline decoration-dotted decoration-surface-400 underline-offset-[3px] hover:decoration-primary-500 text-inherit"
			type="button"
		>
			{#if children}{@render children()}{:else}{translate(entry.term, app.ui.language)}{/if}
		</Tooltip.Trigger>
		<Portal>
			<Tooltip.Positioner class="z-50!">
				<Tooltip.Content class="card max-w-xs p-3 text-xs leading-relaxed shadow-xl preset-filled-surface-950-50">
					<div class="mb-1 font-display text-sm font-bold">{translate(entry.term, app.ui.language)}</div>
					<p>{translate(entry.text, app.ui.language)}</p>
				</Tooltip.Content>
			</Tooltip.Positioner>
		</Portal>
	</Tooltip>
{:else if children}
	{@render children()}
{/if}
