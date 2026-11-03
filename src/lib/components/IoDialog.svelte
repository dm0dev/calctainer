<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { Download, FileJson, FileSpreadsheet, Settings2, Upload, X } from '@lucide/svelte';
	import { download } from '../engine/io';
	import {
		composeAssumptionsImport, composeScenarioImport, DATASETS, exportAssumptionsFile,
		exportScenarioFile, parseAssumptionsFile, parseScenarioFile, validatePlanningScenario,
		type Dataset, type ScenarioFile
	} from '../engine/portable';
	import { quotaWorkbookBytes, XLSX_MIME } from '../engine/report';
	import { translate } from '../i18n';
	import { app, applyImportedScenario } from '../state.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();
	let message = $state<{ ok: boolean; text: string } | null>(null);
	let exportSelected = $state<Dataset[]>([...DATASETS]);
	let importSelected = $state<Dataset[]>([]);
	let pending = $state<ScenarioFile | null>(null);
	let legacy = $state(false);
	let replace = $state(false);
	let exporting = $state(false);
	const slug = $derived(app.scenario.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'scenario');
	const t = (source: string, values: Record<string, string | number> = {}) => translate(source, app.ui.language, values);
	const labels: Record<Dataset, string> = {
		clusters: 'Hosted clusters', workloads: 'Workloads', nodePools: 'Node pools',
		quotas: 'Quotas', catalog: 'Instance catalogue', classic: 'Classic comparison'
	};
	const complete = $derived(DATASETS.every((key) => importSelected.includes(key)));
	const preview = $derived.by(() => {
		if (!pending) return null;
		try {
			const next = composeScenarioImport($state.snapshot(app.scenario), $state.snapshot(pending), importSelected, replace, app.ui.mode);
			const existing = new Set(app.scenario.clusters.map((c) => c.id));
			return {
				error: null,
				added: next.clusters.filter((c) => !existing.has(c.id)).length,
				removed: app.scenario.clusters.filter((c) => !next.clusters.some((n) => n.id === c.id)).length,
				retained: next.clusters.filter((c) => !pending?.clusterRefs.some((ref) => ref.id === c.id)).length,
				workloads: next.workloads.length
			};
		} catch (error) {
			return { error: error instanceof Error ? error.message : String(error), added: 0, removed: 0, retained: 0, workloads: 0 };
		}
	});

	function failure(error: unknown) {
		message = { ok: false, text: t(error instanceof Error ? error.message : String(error)) };
	}
	function exportJson(assumptions = false) {
		try {
			const s = $state.snapshot(app.scenario);
			if (!assumptions) validatePlanningScenario(s);
			const file = assumptions ? exportAssumptionsFile(s.assumptions) : exportScenarioFile(s, exportSelected);
			download(`${slug}.${assumptions ? 'assumptions' : 'calctainer'}.json`, JSON.stringify(file, null, 2), 'application/json');
			message = { ok: true, text: t('File exported.') };
		} catch (error) { failure(error); }
	}
	async function exportExcel() {
		if (exporting) return;
		exporting = true;
		message = null;
		const filename = `${slug}-quota-report.xlsx`;
		try {
			const bytes = await quotaWorkbookBytes($state.snapshot(app.scenario), app.ui.mode);
			download(filename, bytes, XLSX_MIME);
			message = { ok: true, text: t('Quota report exported.') };
		} catch (error) { failure(error); }
		finally { exporting = false; }
	}
	async function importFile(e: Event, assumptions = false) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		message = null;
		try {
			const text = await file.text();
			if (assumptions) {
				const a = parseAssumptionsFile(text);
				const next = composeAssumptionsImport($state.snapshot(app.scenario), a, app.ui.mode);
				if (!confirm(t('Replace active assumptions? Workloads, pools and quota settings will be retained.'))) return;
				applyImportedScenario(next);
				message = { ok: true, text: t('Assumptions imported. Scenario datasets were retained.') };
			} else {
				pending = null;
				const parsed = parseScenarioFile(text);
				pending = parsed.file;
				legacy = parsed.legacy;
				importSelected = DATASETS.filter((key) => key in parsed.file.datasets);
				replace = false;
			}
		} catch (error) { failure(error); }
	}
	function applyImport() {
		if (!pending || preview?.error) return;
		try {
			if (!confirm(t(replace
				? 'Replace all scenario datasets? Clusters absent from the file will be removed. Active assumptions will be retained.'
				: 'Replace selected datasets in the file scope? Unselected data and active assumptions will be retained.'))) return;
			const next = composeScenarioImport($state.snapshot(app.scenario), $state.snapshot(pending), importSelected, replace, app.ui.mode);
			applyImportedScenario(next);
			pending = null;
			message = { ok: true, text: t('Selected datasets imported. Active assumptions were retained.') };
		} catch (error) { failure(error); }
	}
	function toggleExport(key: Dataset, checked: boolean) {
		const next = new Set(exportSelected);
		if (checked) {
			next.add(key);
			if (['workloads', 'nodePools', 'quotas'].includes(key)) next.add('clusters');
		} else next.delete(key);
		exportSelected = DATASETS.filter((item) => next.has(item));
	}
	function toggleImport(key: Dataset, checked: boolean) {
		importSelected = checked ? [...importSelected, key] : importSelected.filter((item) => item !== key);
		if (!DATASETS.every((item) => importSelected.includes(item))) replace = false;
	}
</script>

<Dialog {open} onOpenChange={(d) => (open = d.open)}>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-950/50 backdrop-blur-[2px]" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content class="sheet max-h-[90dvh] w-full max-w-3xl space-y-6 overflow-y-auto p-6">
				<header class="flex items-start justify-between gap-4">
					<div>
						<div class="eyebrow">{t('Local files')}</div>
						<Dialog.Title class="text-2xl font-extrabold">{t('Import · export')}</Dialog.Title>
						<Dialog.Description class="text-sm text-surface-700-300">
							{t('Save scenario datasets and assumptions separately. Export calculated quotas to Excel for other tools. Everything stays in your browser.')}
						</Dialog.Description>
					</div>
					<Dialog.CloseTrigger class="btn-icon btn-icon-sm preset-tonal" aria-label={t('Close')}><X class="size-4" /></Dialog.CloseTrigger>
				</header>

				<section class="space-y-4 rounded-container border border-primary-300-700 p-4" aria-labelledby="io-report">
					<div class="flex items-center gap-2 font-display font-bold" id="io-report"><FileSpreadsheet class="size-5 text-primary-600-400" /> {t('Quota report (Excel)')}</div>
					<p class="text-sm text-surface-700-300">{t('Calculated requirements, overall allowance, consumed and free quota — for the scenario and every hosted cluster.')}</p>
					<p class="text-xs text-surface-600-400">{t('Includes pool contributions, workloads, assumptions and findings. Export only; not a scenario backup. Consumption is planned peak capacity, not measured usage.')}</p>
					<button class="btn ctl-h preset-filled-primary-500" disabled={exporting} onclick={exportExcel}>
						<Download class="size-4" /> {t(exporting ? 'Generating report…' : 'Export Excel report')}
					</button>
				</section>

				<section class="space-y-4 rounded-container border border-surface-300-700 p-4" aria-labelledby="io-scenario">
					<div class="flex items-center gap-2 font-display font-bold" id="io-scenario"><FileJson class="size-4" /> {t('Scenario (JSON)')}</div>
					<p class="text-xs text-surface-600-400">{t('Choose datasets to save. Assumptions are never included; save the separate assumptions file for a reproducible backup.')}</p>
					<fieldset class="grid gap-2 sm:grid-cols-3">
						<legend class="label-text mb-2">{t('Export datasets')}</legend>
						{#each DATASETS as key}
							<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="checkbox" checked={exportSelected.includes(key)} onchange={(e) => toggleExport(key, e.currentTarget.checked)} />{t(labels[key])}</label>
						{/each}
					</fieldset>
					{#if !exportSelected.includes('clusters') && exportSelected.some((key) => ['workloads', 'nodePools', 'quotas'].includes(key))}
						<p class="text-xs text-warning-700-300">{t('Without hosted clusters, importing these datasets requires matching cluster IDs in the target scenario.')}</p>
					{/if}
					<div class="flex flex-wrap gap-2">
						<button class="btn ctl-h preset-tonal" disabled={!exportSelected.length} onclick={() => exportJson()}><Download class="size-4" /> {t('Export selected')}</button>
						<label class="btn ctl-h preset-tonal relative cursor-pointer focus-within:ring-2 focus-within:ring-primary-500">
							<Upload class="size-4" /> {t('Choose scenario file')}
							<input type="file" accept=".json,application/json" class="absolute inset-0 w-full cursor-pointer opacity-0" aria-label={t('Choose scenario file')} onchange={(e) => importFile(e)} />
						</label>
					</div>
					{#if pending}
						<div class="space-y-3 border-t border-dashed border-surface-300-700 pt-4">
							<h3 class="font-bold">{pending.name}</h3>
							{#if legacy}<p class="text-xs text-warning-700-300">{t('Legacy scenario: embedded assumptions will not be applied. Use the Assumptions importer to extract them explicitly.')}</p>{/if}
							<fieldset class="grid gap-2 sm:grid-cols-3">
								<legend class="label-text mb-2">{t('Import datasets')}</legend>
								{#each DATASETS as key}
									<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="checkbox" disabled={!(key in pending.datasets)} checked={importSelected.includes(key)} onchange={(e) => toggleImport(key, e.currentTarget.checked)} />{t(labels[key])}</label>
								{/each}
							</fieldset>
							<label class="flex items-center gap-2 text-sm"><input type="checkbox" class="checkbox" disabled={!complete} bind:checked={replace} />{t('Replace entire scenario (all datasets required)')}</label>
							<p class="text-xs text-surface-600-400">{t('Update replaces selected data only within the file’s cluster scope and retains unrelated clusters. Empty selected lists clear that scope. Cluster IDs must match; names are not used for matching.')}</p>
							{#if preview?.error}
								<p class="text-sm text-error-600-400" role="status">{t(preview.error)}</p>
							{:else if preview}
								<p class="num text-xs" role="status">{t('Preview: {added} clusters added, {removed} removed, {retained} unrelated clusters retained; {workloads} workloads after import.', { added: preview.added, removed: preview.removed, retained: preview.retained, workloads: preview.workloads })}</p>
								{#if preview.added && (!importSelected.includes('nodePools') || !importSelected.includes('quotas'))}
									<p class="text-xs text-warning-700-300">{t('New clusters use automatic pool recommendations and unset quotas for datasets not provided.')}</p>
								{/if}
							{/if}
							<div class="flex gap-2">
								<button class="btn ctl-h preset-filled-primary-500" disabled={!preview || !!preview.error} onclick={applyImport}>{t('Apply selected datasets')}</button>
								<button class="btn ctl-h preset-tonal" onclick={() => (pending = null)}>{t('Cancel')}</button>
							</div>
						</div>
					{/if}
				</section>

				<section class="space-y-3 rounded-container border border-surface-300-700 p-4" aria-labelledby="io-assumptions">
					<div class="flex items-center gap-2 font-display font-bold" id="io-assumptions"><Settings2 class="size-4" /> {t('Assumptions (JSON)')}</div>
					<p class="text-xs text-surface-600-400">{t('Sizing policy, overhead, quota headroom and pricing settings. Import replaces these settings only; referenced instance types must exist in the active catalogue. Legacy scenario files are also accepted here.')}</p>
					<div class="flex flex-wrap gap-2">
						<button class="btn ctl-h preset-tonal" onclick={() => exportJson(true)}><Download class="size-4" /> {t('Export assumptions')}</button>
						<label class="btn ctl-h preset-tonal relative cursor-pointer focus-within:ring-2 focus-within:ring-primary-500">
							<Upload class="size-4" /> {t('Import assumptions')}
							<input type="file" accept=".json,application/json" class="absolute inset-0 w-full cursor-pointer opacity-0" aria-label={t('Import assumptions')} onchange={(e) => importFile(e, true)} />
						</label>
					</div>
				</section>
				{#if message}
					<p class="rounded-base px-3 py-2 text-sm {message.ok ? 'preset-tonal-success' : 'preset-tonal-error'}" role="status">{message.text}</p>
				{/if}
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
