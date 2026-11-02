<script lang="ts">
	import { translate } from '../i18n';
	import { app } from '../state.svelte';
	let {
		value = $bindable(),
		step = 1,
		min = 0,
		nullable = false,
		placeholder = '',
		title = '',
		onchange,
		class: cls = ''
	}: {
		value: number | null | undefined;
		step?: number;
		min?: number;
		nullable?: boolean;
		placeholder?: string;
		title?: string;
		onchange?: () => void;
		class?: string;
	} = $props();
	const localizedTitle = $derived(title ? translate(title, app.ui.language) : '');
	const localizedPlaceholder = $derived(placeholder ? translate(placeholder, app.ui.language) : '');

	function onInput(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		if (raw === '') {
			if (nullable) {
				value = null;
				onchange?.();
			}
			return;
		}
		const n = Number(raw);
		if (!Number.isFinite(n)) return;
		value = Math.max(min, n);
		onchange?.();
	}
</script>

<input class="cell-input {cls}" type="number" {step} {min} value={value ?? ''} placeholder={localizedPlaceholder} title={localizedTitle} aria-label={localizedTitle} oninput={onInput} />
