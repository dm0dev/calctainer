import { analyzeScenario } from './engine/analyze';
import { emptyScenario, sampleScenario } from './engine/defaults';
import { validateScenario } from './engine/io';
import type { Mode, Scenario, ScenarioResult } from './engine/types';
import { resolveLanguage, type Language } from './i18n';

const KEY = 'calctainer:scenario:v1';
const UI_KEY = 'calctainer:ui:v1';

export type View = 'workloads' | 'pools' | 'scheduling' | 'quota' | 'findings' | 'savings' | 'assumptions';

interface UiState {
	language: Language;
	mode: Mode;
	view: View;
	clusterId: string | null;
	guidedStep: number;
	onboarded: boolean;
	/** Collapsed namespace groups, keyed `${clusterId}/${namespace}`. */
	collapsedNs: Record<string, boolean>;
}

function loadScenario(): Scenario {
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const s = JSON.parse(raw);
			if (validateScenario(s)) return s;
		}
	} catch {
		/* ignore corrupt storage */
	}
	return sampleScenario();
}

function loadUi(): UiState {
	const d: UiState = {
		language: resolveLanguage(undefined, typeof navigator === 'undefined' ? undefined : navigator.language),
		mode: 'standard',
		view: 'workloads',
		clusterId: null,
		guidedStep: 0,
		onboarded: false,
		collapsedNs: {}
	};
	try {
		const raw = localStorage.getItem(UI_KEY);
		if (raw) {
			const u = { ...d, ...JSON.parse(raw) };
			u.language = resolveLanguage(u.language, d.language);
			if (!u.collapsedNs || typeof u.collapsedNs !== 'object') u.collapsedNs = {};
			return u;
		}
	} catch {
		/* ignore */
	}
	return d;
}

export const app = $state<{ scenario: Scenario; ui: UiState }>({ scenario: loadScenario(), ui: loadUi() });

let last = $state.raw<{ result: ScenarioResult; error: string | null }>({ result: analyzeScenario($state.snapshot(app.scenario) as Scenario, app.ui.mode), error: null });

/** Recompute derived plan. Kept outside components so every view shares one computation. */
export function recompute(mode: Mode = app.ui.mode): void {
	try {
		last = { result: analyzeScenario($state.snapshot(app.scenario) as Scenario, mode), error: null };
	} catch (e) {
		console.error(e);
		last = { result: last.result, error: e instanceof Error ? e.message : String(e) };
	}
}

export const plan = {
	get result() {
		return last.result;
	},
	get error() {
		return last.error;
	}
};

export function startPersistence(): () => void {
	return $effect.root(() => {
		$effect(() => {
			const mode = app.ui.mode;
			const snap = JSON.stringify(app.scenario);
			recompute(mode);
			const t = setTimeout(() => {
				try {
					localStorage.setItem(KEY, snap);
				} catch {
					/* quota exceeded */
				}
			}, 250);
			return () => clearTimeout(t);
		});
		$effect(() => {
			const snap = JSON.stringify(app.ui);
			try {
				localStorage.setItem(UI_KEY, snap);
			} catch {
				/* ignore */
			}
		});
	});
}

export function currentCluster() {
	const s = app.scenario;
	return s.clusters.find((c) => c.id === app.ui.clusterId) ?? s.clusters[0] ?? null;
}

export function loadScenarioObject(s: Scenario) {
	app.scenario = s;
	app.ui.clusterId = s.clusters[0]?.id ?? null;
}

export function resetToSample() {
	loadScenarioObject(sampleScenario());
}

export function resetToEmpty() {
	loadScenarioObject(emptyScenario());
}
