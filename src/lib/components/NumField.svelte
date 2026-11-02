<script lang="ts">
	import type { Snippet } from 'svelte';
	import { translate } from '../i18n';
	import { app } from '../state.svelte';

	let {
		label,
		value = $bindable(),
		unit = '',
		step = 1,
		min = 0,
		max,
		nullable = false,
		placeholder = '',
		hint = '',
		labelSnippet,
		pct = false,
		readonly = false,
		onchange
	}: {
		label?: string;
		value: number | null | undefined;
		unit?: string;
		step?: number;
		min?: number;
		max?: number;
		nullable?: boolean;
		placeholder?: string;
		hint?: string;
		labelSnippet?: Snippet;
		/** Display a 0..1 fraction as percent. */
		pct?: boolean;
		readonly?: boolean;
		onchange?: (v: number | null) => void;
	} = $props();

	const shown = $derived(value == null ? '' : pct ? Math.round(value * 1000) / 10 : value);
	const localizedLabel = $derived(label ? translate(label, app.ui.language) : '');
	const localizedHint = $derived(hint ? translate(hint, app.ui.language) : '');
	const localizedPlaceholder = $derived(placeholder ? translate(placeholder, app.ui.language) : '');
	const localizedUnit = $derived(unit ? translate(unit, app.ui.language) : '');

	function onInput(e: Event) {
		if (readonly) return;
		const raw = (e.currentTarget as HTMLInputElement).value;
		if (raw === '') {
			if (nullable) {
				value = null;
				onchange?.(null);
			}
			return;
		}
		const n = Number(raw);
		if (!Number.isFinite(n)) return;
		value = pct ? n / 100 : n;
		onchange?.(value);
	}
</script>

<label class="label block">
	{#if label || labelSnippet}
		<span class="label-text text-xs font-medium text-surface-700-300">
			{#if labelSnippet}{@render labelSnippet()}{:else}{localizedLabel}{/if}
		</span>
	{/if}
	<div class="field-group {unit || pct ? 'grid-cols-[1fr_auto]' : 'grid-cols-1'}">
		<input class="input field-sm num text-right" type="number" {step} {min} {max} {readonly} value={shown} placeholder={localizedPlaceholder} oninput={onInput} />
		{#if unit || pct}<span class="label preset-tonal num w-auto! text-xs">{pct ? '%' : localizedUnit}</span>{/if}
	</div>
	{#if hint}<span class="mt-1 block text-xs leading-snug text-surface-600-400">{localizedHint}</span>{/if}
</label>
