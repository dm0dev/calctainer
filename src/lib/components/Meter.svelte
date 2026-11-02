<script lang="ts">
	import { translate } from '../i18n';
	import { app } from '../state.svelte';
	interface Seg {
		value: number;
		color: string;
		label?: string;
		hatch?: boolean;
	}
	interface Marker {
		value: number;
		label: string;
		color?: string;
	}
	let {
		segments,
		max,
		markers = [],
		height = 'h-3',
		title = ''
	}: { segments: Seg[]; max: number; markers?: Marker[]; height?: string; title?: string } = $props();

	const total = $derived(segments.reduce((s, x) => s + Math.max(0, x.value), 0));
	const scale = $derived(Math.max(max, total, ...markers.map((m) => m.value), 1e-9));
	const w = (v: number) => `${Math.max(0, (v / scale) * 100)}%`;
</script>

<div class="relative w-full {height} overflow-visible rounded-[3px] bg-surface-200-800/70" title={translate(title, app.ui.language)} role="img" aria-label={translate(title, app.ui.language)}>
	<div class="grow-x absolute inset-0 flex overflow-hidden rounded-[3px]">
		{#each segments as s, i (i)}
			<div
				class="h-full {s.hatch ? 'hatch' : ''}"
				style="width:{w(s.value)};{s.hatch ? `color:${s.color}` : `background:${s.color}`}"
				title={s.label ? `${s.label}` : undefined}
			></div>
		{/each}
	</div>
	{#if max < scale}
		<div class="absolute top-[-3px] bottom-[-3px] w-[2px] bg-error-500" style="left:{w(max)}" title={translate('capacity / quota', app.ui.language)}></div>
	{/if}
	{#each markers as m (m.label)}
		<div class="absolute top-[-4px] bottom-[-4px] w-0 border-l-2 border-dashed" style="left:{w(m.value)};border-color:{m.color ?? 'currentColor'}" title={m.label}></div>
	{/each}
</div>
