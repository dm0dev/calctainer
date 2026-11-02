<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { Compass, Gauge, Wrench } from '@lucide/svelte';
	import type { Mode } from '../engine/types';
	import { translate } from '../i18n';
	import { app, resetToEmpty } from '../state.svelte';

	const open = $derived(!app.ui.onboarded);
	const MODES = $derived<{ v: Mode; l: string; who: string; d: string; icon: typeof Compass }[]>([
		{
			v: 'guided',
			l: translate('Guided', app.ui.language),
			who: translate('New to Kubernetes · VM administrators', app.ui.language),
			d: translate('Describe applications like VMs (vCPU, RAM, how busy, how critical). Plain-language results.', app.ui.language),
			icon: Compass
		},
		{
			v: 'standard',
			l: translate('Standard', app.ui.language),
			who: translate('Some OpenShift / Kubernetes experience', app.ui.language),
			d: translate('Edit replicas, requests, limits and storage in a table. Recommended node pools with instance-type pinning.', app.ui.language),
			icon: Gauge
		},
		{
			v: 'expert',
			l: translate('Expert', app.ui.language),
			who: translate('Migrating from classic OpenShift', app.ui.language),
			d: translate('Full control: pool targeting, anti-affinity, manual node pools, scheduler strategy, catalogue, CSV and YAML.', app.ui.language),
			icon: Wrench
		}
	]);
	let start = $state<'sample' | 'empty'>('sample');

	function choose(m: Mode) {
		app.ui.mode = m;
		if (start === 'empty') resetToEmpty();
		app.ui.view = 'workloads';
		app.ui.onboarded = true;
	}
</script>

<Dialog {open} onOpenChange={(d) => !d.open && (app.ui.onboarded = true)}>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-950/60 backdrop-blur-sm" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content class="sheet w-full max-w-3xl p-6 md:p-8">
				<div class="flex items-center justify-between gap-3">
					<div class="eyebrow">{translate('Welcome to Calctainer', app.ui.language)}</div>
					<label class="flex items-center gap-2 text-xs">
						<span class="eyebrow">{translate('Language', app.ui.language)}</span>
						<select class="select field-sm w-auto py-1 text-xs" value={app.ui.language} onchange={(e) => (app.ui.language = (e.currentTarget as HTMLSelectElement).value as 'en' | 'de')} aria-label={translate('Language', app.ui.language)}>
							<option value="en">English</option>
							<option value="de">Deutsch</option>
						</select>
					</label>
				</div>
				<Dialog.Title class="mt-1 text-3xl font-extrabold md:text-4xl" style="color:#151515">{translate('Plan workloads on Hosted Control Planes.', app.ui.language)}</Dialog.Title>
				<Dialog.Description class="mt-2 max-w-2xl text-sm" style="color:#4f4f4f">
					{translate('Size worker node pools, check quotas and scheduling, and estimate savings versus classic OpenShift — entirely in your browser. How familiar are you with Kubernetes?', app.ui.language)}
				</Dialog.Description>
				<div class="mt-6 grid gap-3 md:grid-cols-3">
					{#each MODES as m (m.v)}
						<button
							class="group rounded-container border-2 border-surface-300-700 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary-500 hover:shadow-[4px_4px_0_0_var(--color-primary-500)]"
							onclick={() => choose(m.v)}
						>
							<m.icon class="mb-3 size-6 text-primary-600-400" />
							<div class="font-display text-xl font-extrabold">{m.l}</div>
 						<div class="eyebrow mt-0.5 mb-2" style="color:#4f4f4f">{m.who}</div>
							<p class="text-[12.5px] leading-snug text-surface-700-300">{m.d}</p>
						</button>
					{/each}
				</div>
				<div class="mt-5 flex flex-wrap items-center gap-4 text-xs">
					<span class="eyebrow">{translate('Start with', app.ui.language)}</span>
					<label class="flex items-center gap-1.5"><input type="radio" class="radio" bind:group={start} value="sample" /> {translate('sample scenario', app.ui.language)}</label>
					<label class="flex items-center gap-1.5"><input type="radio" class="radio" bind:group={start} value="empty" /> {translate('empty scenario', app.ui.language)}</label>
					<span class="ml-auto" style="color:#4f4f4f">{translate('You can switch the mode at any time in the header.', app.ui.language)}</span>
				</div>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
