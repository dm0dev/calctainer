<script lang="ts">
	import { SegmentedControl } from '@skeletonlabs/skeleton-svelte';
	import { BarChart3, Boxes, ClipboardCheck, Eraser, FolderInput, Gauge, Layers, LayoutGrid, Moon, PiggyBank, RotateCcw, Settings2, Sun } from '@lucide/svelte';
	import AssumptionsView from './lib/components/AssumptionsView.svelte';
	import FindingsView from './lib/components/FindingsView.svelte';
	import IoDialog from './lib/components/IoDialog.svelte';
	import KpiStrip from './lib/components/KpiStrip.svelte';
	import Onboarding from './lib/components/Onboarding.svelte';
	import PoolsView from './lib/components/PoolsView.svelte';
	import QuotaView from './lib/components/QuotaView.svelte';
	import SavingsView from './lib/components/SavingsView.svelte';
	import SchedulingView from './lib/components/SchedulingView.svelte';
	import WorkloadsView from './lib/components/WorkloadsView.svelte';
	import type { Mode } from './lib/engine/types';
	import { resolveLanguage, translate } from './lib/i18n';
	import { app, plan, resetToEmpty, resetToSample, type View } from './lib/state.svelte';

	let ioOpen = $state(false);
	let dark = $state(document.documentElement.classList.contains('dark'));
	let headerH = $state(176);

	$effect(() => {
		document.documentElement.lang = app.ui.language;
	});

	function setLanguage(value: string) {
		app.ui.language = resolveLanguage(value, app.ui.language);
	}

	function startOver() {
		if (confirm(translate('Replace the current scenario with the sample scenario?', app.ui.language))) resetToSample();
	}

	function wipe() {
		if (confirm(translate('Replace the current scenario with an empty one?', app.ui.language))) resetToEmpty();
	}

	function toggleDark() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('calctainer:mode-scheme', dark ? 'dark' : 'light');
	}


	const guided = $derived(app.ui.mode === 'guided');
	const NAV = $derived<{ v: View; l: string; g: string; icon: typeof Boxes }[]>([
		{ v: 'workloads', l: translate('Workloads', app.ui.language), g: translate('Applications', app.ui.language), icon: Boxes },
		{ v: 'pools', l: translate('Node pools', app.ui.language), g: translate('Servers', app.ui.language), icon: Layers },
		{ v: 'scheduling', l: translate('Scheduling', app.ui.language), g: translate('Placement', app.ui.language), icon: LayoutGrid },
		{ v: 'quota', l: translate('Quota', app.ui.language), g: translate('Budget', app.ui.language), icon: Gauge },
		{ v: 'findings', l: translate('Findings', app.ui.language), g: translate('Check-up', app.ui.language), icon: ClipboardCheck },
		{ v: 'savings', l: translate('Savings', app.ui.language), g: translate('Savings', app.ui.language), icon: PiggyBank },
		{ v: 'assumptions', l: translate('Assumptions', app.ui.language), g: translate('Assumptions', app.ui.language), icon: Settings2 }
	]);
	const issues = $derived(plan.result.findings.filter((f) => f.severity === 'critical').length);
	const idx = $derived(NAV.findIndex((n) => n.v === app.ui.view));
</script>

<svelte:head>
	<title>{translate('Calctainer · HCP workload planner', app.ui.language)}</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="sticky top-0 z-40 bg-surface-50-950/90 backdrop-blur" bind:clientHeight={headerH}>
		<div class="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-8">
			<div class="flex items-center gap-3">
				<div class="grid size-10 place-items-center rounded-base bg-surface-950-50 text-surface-50-950">
					<BarChart3 class="size-5" />
				</div>
				<div class="leading-none">
					<div class="font-display text-xl font-extrabold tracking-tight">Calctainer</div>
					<div class="eyebrow mt-1">{translate('HCP workload planner', app.ui.language)}</div>
				</div>
			</div>

			<input
				class="cell-input text-left! ctl-h max-w-xs flex-1 font-display font-semibold"
				bind:value={app.scenario.name}
				aria-label={translate('Scenario name', app.ui.language)}
				title={translate('Scenario name', app.ui.language)}
			/>

			<div class="ml-auto flex flex-wrap items-center gap-x-6 gap-y-3">
				<div class="flex items-center gap-2">
					<SegmentedControl value={app.ui.mode} onValueChange={(d) => d.value && (app.ui.mode = d.value as Mode)} orientation="horizontal">
						<SegmentedControl.Label class="sr-only">{translate('Experience level', app.ui.language)}</SegmentedControl.Label>
						<SegmentedControl.Control class="ctl-h p-0.5">
							<SegmentedControl.Indicator />
							{#each [{ v: 'guided', l: translate('Guided', app.ui.language) }, { v: 'standard', l: translate('Standard', app.ui.language) }, { v: 'expert', l: translate('Expert', app.ui.language) }] as m (m.v)}
								<SegmentedControl.Item value={m.v} class="h-full px-4 text-sm">
									<SegmentedControl.ItemText>{m.l}</SegmentedControl.ItemText>
									<SegmentedControl.ItemHiddenInput />
								</SegmentedControl.Item>
							{/each}
						</SegmentedControl.Control>
					</SegmentedControl>
					<button class="btn ctl-h preset-outlined-surface-400-600 no-print" onclick={startOver} title={translate('Replace the current scenario with the sample scenario', app.ui.language)}>
						<RotateCcw class="size-4" /> {translate('Reset', app.ui.language)}
					</button>
					<button class="btn ctl-h preset-outlined-error-400-600 no-print" onclick={wipe} title={translate('Replace the current scenario with an empty one', app.ui.language)}>
						<Eraser class="size-4" /> {translate('Empty', app.ui.language)}
					</button>
				</div>

				<div class="flex items-center gap-2">
					<label class="sr-only" for="language-select">{translate('Language', app.ui.language)}</label>
					<select id="language-select" class="select ctl-h w-auto py-0" value={app.ui.language} onchange={(e) => setLanguage((e.currentTarget as HTMLSelectElement).value)} aria-label={translate('Language', app.ui.language)}>
						<option value="en">English</option>
						<option value="de">Deutsch</option>
					</select>
					<button class="btn ctl-h preset-tonal no-print" onclick={() => (ioOpen = true)}><FolderInput class="size-4" /> <span class="hidden sm:inline">{translate('Import / export', app.ui.language)}</span></button>
					<button class="btn-icon ctl-h preset-tonal no-print" onclick={toggleDark} aria-label={translate('Toggle dark mode', app.ui.language)} title={translate('Toggle dark mode', app.ui.language)}>
						{#if dark}<Sun class="size-4" />{:else}<Moon class="size-4" />{/if}
					</button>
				</div>
			</div>
		</div>

		<KpiStrip />
	</header>

	<div class="flex flex-1 flex-col md:flex-row">
		<nav class="no-print md:sticky md:top-(--header-h) md:h-[calc(100vh-var(--header-h))] md:w-60 md:shrink-0 md:overflow-y-auto md:border-r md:border-surface-300-700" style="--header-h:{headerH}px" aria-label="Views">
			<ul class="flex gap-1.5 overflow-x-auto p-3 md:flex-col md:p-4">
				{#each NAV as n, i (n.v)}
					<li>
						<button
							class="group flex w-full items-center gap-3 rounded-base px-3 py-2.5 text-left text-sm whitespace-nowrap transition {app.ui.view === n.v
								? 'bg-surface-950-50 text-surface-50-950'
								: 'hover:bg-surface-200-800'}"
							aria-current={app.ui.view === n.v ? 'page' : undefined}
							onclick={() => (app.ui.view = n.v)}
						>
							<span class="num w-5 text-xs opacity-60">{String(i + 1).padStart(2, '0')}</span>
							<n.icon class="size-4" />
							<span class="flex-1 font-medium">{guided ? n.g : n.l}</span>
							{#if n.v === 'findings' && issues}<span class="badge preset-filled-error-500 px-1.5 py-0 text-xs">{issues}</span>{/if}
						</button>
					</li>
				{/each}
			</ul>
			<div class="hidden px-5 pt-4 text-xs leading-relaxed text-surface-600-400 md:block">
				<div class="eyebrow mb-1">{translate('Scope', app.ui.language)}</div>
				{translate('Workloads inside hosted clusters only. Management cluster and hosted control planes are not modelled.', app.ui.language)}
			</div>
			<div class="px-5 py-4 text-xs">
				<a class="anchor" href="./accessibility.html">{translate('Ease of Access', app.ui.language)}</a>
			</div>
		</nav>

		<main class="min-w-0 flex-1 px-4 py-8 md:px-10">
			{#if plan.error}
				<div class="mb-4 rounded-base preset-tonal-error p-3 text-sm">{translate('Calculation error: {message}. Showing last valid result.', app.ui.language, { message: plan.error })}</div>
			{/if}
			{#key app.ui.view}
				{#if app.ui.view === 'workloads'}<WorkloadsView />
				{:else if app.ui.view === 'pools'}<PoolsView />
				{:else if app.ui.view === 'scheduling'}<SchedulingView />
				{:else if app.ui.view === 'quota'}<QuotaView />
				{:else if app.ui.view === 'findings'}<FindingsView />
				{:else if app.ui.view === 'savings'}<SavingsView />
				{:else}<AssumptionsView />{/if}
			{/key}

			{#if guided}
				<div class="no-print mt-8 flex justify-between border-t border-surface-300-700 pt-4">
					<button class="btn preset-tonal" disabled={idx <= 0} onclick={() => (app.ui.view = NAV[idx - 1].v)}>{translate('← {label}', app.ui.language, { label: idx > 0 ? NAV[idx - 1].g : '' })}</button>
					<button class="btn preset-filled-primary-500" disabled={idx >= NAV.length - 1} onclick={() => (app.ui.view = NAV[idx + 1].v)}
						>{translate('Next: {label} →', app.ui.language, { label: idx < NAV.length - 1 ? NAV[idx + 1].g : '' })}</button
					>
				</div>
			{/if}
		</main>
	</div>
</div>

<IoDialog bind:open={ioOpen} />
<Onboarding />
