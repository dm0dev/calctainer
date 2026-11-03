import { describe, expect, it } from 'vitest';
import { resolveLanguage, translate } from './i18n';

describe('language preference', () => {
	it('prefers a supported saved language over the browser locale', () => {
		expect(resolveLanguage('en', 'de-DE')).toBe('en');
		expect(resolveLanguage('de', 'en-US')).toBe('de');
	});

	it('uses German browser locales and falls back to English otherwise', () => {
		expect(resolveLanguage(undefined, 'de-DE')).toBe('de');
		expect(resolveLanguage(undefined, 'de_AT')).toBe('de');
		expect(resolveLanguage(undefined, 'fr-FR')).toBe('en');
	});

	it('falls back safely for unsupported saved languages and source copy', () => {
		expect(resolveLanguage('fr', 'en-GB')).toBe('en');
		expect(translate('Workloads', 'de')).toBe('Workloads');
	});

	it('translates copy and interpolates dynamic values', () => {
		expect(translate('Next: {label} →', 'de', { label: 'Workloads' })).toBe('Weiter: Workloads →');
	});

	it('distinguishes infrastructure quota and baseline app request summaries', () => {
		expect(translate('Scenario quota', 'de')).toBe('Szenarioquota');
		expect(translate('Peak VMs / infrastructure allowance', 'de')).toBe('VM-Spitzenkapazität / Infrastrukturkontingent');
		expect(translate('Baseline apps / current allocatable', 'de')).toBe('App-Basisbedarf / aktuell zuweisbar');
	});

	it('translates generated findings and guided explanations with values intact', () => {
		expect(translate('Pool "workers" is 80% allocated (target 70%)', 'de')).toBe('Pool „workers“ ist zu 80% belegt (Ziel 70%)');
		expect(translate('Each copy reserves 0.5 CPU core(s) (request) and may briefly use up to 2 (limit).', 'de')).toBe(
			'Jede Instanz reserviert 0.5 CPU-Kern(e) (Request) und darf kurzzeitig bis zu 2 (Limit) nutzen.'
		);
	});

	it('translates portable import controls and actionable validation reasons', () => {
		expect(translate('Export Excel report', 'de')).toBe('Excel-Bericht exportieren');
		expect(translate('Scenario quota: expected a number between 0 and Infinity.', 'de')).toBe(
			'Scenario quota: Eine Zahl zwischen 0 und Infinity wird erwartet.'
		);
		expect(translate('Clusters: "hc-1" is missing. Select hosted clusters or import into the original scenario.', 'de')).toContain(
			'Wählen Sie Hosted Cluster aus'
		);
	});
});