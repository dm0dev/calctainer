<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { Download, FileJson, FileSpreadsheet, Upload, X } from '@lucide/svelte';
	import { csvToWorkloads, download, scenarioError, workloadsToCsv } from '../engine/io';
	import { newCluster } from '../engine/defaults';
	import { translate } from '../i18n';
	import { app, loadScenarioObject } from '../state.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();
	let message = $state<{ ok: boolean; text: string } | null>(null);
	let csvMode = $state<'append' | 'replace'>('append');

	const slug = $derived(app.scenario.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'scenario');
	const t = (source: string, values: Record<string, string | number> = {}) => translate(source, app.ui.language, values);

	function exportJson() {
		download(`${slug}.calctainer.json`, JSON.stringify($state.snapshot(app.scenario), null, 2), 'application/json');
	}
	function exportCsv() {
		download(`${slug}-workloads.csv`, workloadsToCsv($state.snapshot(app.scenario)), 'text/csv');
	}

	async function readFile(e: Event): Promise<string | null> {
		const input = e.currentTarget as HTMLInputElement;
		const f = input.files?.[0];
		input.value = '';
		return f ? await f.text() : null;
	}

	async function importJson(e: Event) {
		const text = await readFile(e);
		if (!text) return;
		try {
			const s = JSON.parse(text);
			const err = scenarioError(s);
			if (err) throw new Error(err);
			loadScenarioObject(s);
			message = { ok: true, text: t('Loaded “{name}” with {count} workloads.', { name: s.name, count: s.workloads.length }) };
		} catch (err) {
			message = { ok: false, text: t(err instanceof Error ? err.message : String(err)) };
		}
	}

	async function importCsv(e: Event) {
		const text = await readFile(e);
		if (!text) return;
		const res = csvToWorkloads(text, $state.snapshot(app.scenario));
		if (!res.workloads.length) {
			message = { ok: false, text: res.errors.map((error) => t(error)).join(' ') || t('No rows imported.') };
			return;
		}
		for (const c of res.newClusters) app.scenario.clusters.push({ ...newCluster(c.name), id: c.id });
		if (csvMode === 'replace') {
			const touched = new Set(res.workloads.map((w) => w.clusterId));
			app.scenario.workloads = app.scenario.workloads.filter((w) => !touched.has(w.clusterId));
		}
		app.scenario.workloads.push(...res.workloads);
		message = {
			ok: true,
			text: t('Imported {workloads} workloads{clusters}.{errors}', {
				workloads: res.workloads.length,
				clusters: res.newClusters.length ? t(', created {count} hosted clusters', { count: res.newClusters.length }) : '',
				errors: res.errors.length ? ` ${res.errors.map((error) => t(error)).join(' ')}` : ''
			})
		};
	}
</script>

<Dialog {open} onOpenChange={(d) => (open = d.open)}>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-950/50 backdrop-blur-[2px]" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content class="sheet w-full max-w-2xl space-y-8 p-6">
				<header class="flex items-start justify-between gap-4">
					<div>
 					<div class="eyebrow">{t('Scenario file')}</div>
 					<Dialog.Title class="text-2xl font-extrabold">{t('Import · export')}</Dialog.Title>
						<Dialog.Description class="text-sm text-surface-700-300">
							{t('Everything stays in your browser. Save a scenario as JSON to share or archive it; use CSV to move workload lists to and from spreadsheets.')}
						</Dialog.Description>
					</div>
					<Dialog.CloseTrigger class="btn-icon btn-icon-sm preset-tonal" aria-label={t('Close')}><X class="size-4" /></Dialog.CloseTrigger>
				</header>

				<section class="grid gap-6 sm:grid-cols-2">
					<div class="space-y-2 rounded-container border border-surface-300-700 p-4">
						<div class="flex items-center gap-2 font-display font-bold"><FileJson class="size-4" /> {t('Scenario (JSON)')}</div>
						<p class="text-xs text-surface-600-400">{t('Complete plan: clusters, workloads, catalog, assumptions, baseline.')}</p>
						<div class="flex flex-wrap gap-2">
							<button class="btn ctl-h preset-filled-primary-500" onclick={exportJson}><Download class="size-4" /> {t('Export')}</button>
							<label class="btn ctl-h preset-tonal cursor-pointer">
								<Upload class="size-4" /> {t('Import')}
								<input type="file" accept=".json,application/json" class="hidden" onchange={importJson} />
							</label>
						</div>
					</div>
					<div class="space-y-2 rounded-container border border-surface-300-700 p-4">
						<div class="flex items-center gap-2 font-display font-bold"><FileSpreadsheet class="size-4" /> {t('Workloads (CSV)')}</div>
						<p class="text-xs text-surface-600-400">
							{t('Spreadsheet-compatible; comma or semicolon separated. CPU accepts')} <code>500m</code>, {t('memory accepts')} <code>512Mi</code>/<code>2Gi</code>.
						</p>
						<div class="flex flex-wrap items-center gap-2">
							<button class="btn ctl-h preset-filled-primary-500" onclick={exportCsv}><Download class="size-4" /> {t('Export')}</button>
							<label class="btn ctl-h preset-tonal cursor-pointer">
								<Upload class="size-4" /> {t('Import')}
								<input type="file" accept=".csv,text/csv,text/plain" class="hidden" onchange={importCsv} />
							</label>
							<select class="select ctl-h w-auto py-0" bind:value={csvMode} aria-label={t('CSV import mode')}>
								<option value="append">{t('append')}</option>
								<option value="replace">{t('replace per cluster')}</option>
							</select>
						</div>
					</div>
				</section>

				{#if message}
					<p class="rounded-base px-3 py-2 text-sm {message.ok ? 'preset-tonal-success' : 'preset-tonal-error'}" role="status">{message.text}</p>
				{/if}

			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
