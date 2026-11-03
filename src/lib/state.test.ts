import { beforeEach, describe, expect, it, vi } from 'vitest';
import { newCluster, sampleScenario } from './engine/defaults';
import { composeAssumptionsImport, composeScenarioImport, DATASETS, exportScenarioFile } from './engine/portable';

describe('import state integration', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.stubGlobal('localStorage', { getItem: () => null, setItem: vi.fn() });
	});

	it('commits selective imports while retaining active cluster, mode and UI preferences', async () => {
		const { app, applyImportedScenario, loadScenarioObject } = await import('./state.svelte');
		const s = sampleScenario();
		loadScenarioObject(s);
		app.ui.mode = 'guided';
		app.ui.language = 'de';
		app.ui.view = 'quota';
		app.ui.clusterId = s.clusters[1].id;
		const ui = JSON.parse(JSON.stringify(app.ui));
		const source = structuredClone(s);
		source.workloads[0].notes = 'Imported';
		applyImportedScenario(composeScenarioImport(s, exportScenarioFile(source), ['workloads']));
		expect(app.scenario.workloads[0].notes).toBe('Imported');
		expect(app.ui).toEqual(ui);
		const changed = { ...s.assumptions, quotaHeadroomPct: 20 };
		applyImportedScenario(composeAssumptionsImport(source, changed));
		expect(app.scenario.assumptions.quotaHeadroomPct).toBe(20);
		expect(app.ui).toEqual(ui);
	});

	it('keeps state unchanged on failure and selects a surviving cluster on replacement', async () => {
		const { app, applyImportedScenario, loadScenarioObject } = await import('./state.svelte');
		const s = sampleScenario();
		loadScenarioObject(s);
		const before = JSON.stringify(app);
		const source = sampleScenario();
		const file = exportScenarioFile(source);
		expect(() => applyImportedScenario(composeScenarioImport(s, file, ['workloads']))).toThrow();
		expect(JSON.stringify(app)).toBe(before);
		applyImportedScenario(composeScenarioImport(s, file, DATASETS, true));
		expect(app.ui.clusterId).toBe(source.clusters[0].id);
	});

	it('still reads composite version-1 browser persistence', async () => {
		const s = sampleScenario();
		s.assumptions.quotaHeadroomPct = 33;
		s.clusters.push(newCluster('persisted'));
		vi.stubGlobal('localStorage', {
			getItem: (key: string) => key === 'calctainer:scenario:v1' ? JSON.stringify(s) : null,
			setItem: vi.fn()
		});
		const { app } = await import('./state.svelte');
		expect(app.scenario).toEqual(s);
	});
});
