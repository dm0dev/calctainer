import type { InstanceType } from './types';

export interface CatalogPreset {
	id: string;
	name: string;
	note: string;
	types: InstanceType[];
}

const t = (id: string, vcpu: number, memoryGiB: number, family: string, costPerMonth: number | null = null): InstanceType => ({
	id,
	name: id,
	vcpu,
	memoryGiB,
	family,
	costPerMonth
});

/** Approximate on-demand list prices (730 h/month). Treat as placeholders and replace with your contract prices. */
export const CATALOGS: CatalogPreset[] = [
	{
		id: 'generic',
		name: 'Generic VM sizes (KubeVirt / Agent / on-prem)',
		note: 'Cost derived from per-vCPU and per-GiB prices in the assumptions.',
		types: [
			t('g.4x16', 4, 16, 'general'),
			t('g.8x32', 8, 32, 'general'),
			t('g.16x64', 16, 64, 'general'),
			t('g.32x128', 32, 128, 'general'),
			t('c.8x16', 8, 16, 'compute'),
			t('c.16x32', 16, 32, 'compute'),
			t('m.4x32', 4, 32, 'memory'),
			t('m.8x64', 8, 64, 'memory'),
			t('m.16x128', 16, 128, 'memory')
		]
	},
	{
		id: 'aws',
		name: 'AWS (ROSA HCP / HyperShift on AWS)',
		note: 'Approximate us-east-1 on-demand compute prices, excluding subscriptions and storage.',
		types: [
			t('m6i.xlarge', 4, 16, 'general', 140),
			t('m6i.2xlarge', 8, 32, 'general', 280),
			t('m6i.4xlarge', 16, 64, 'general', 561),
			t('m6i.8xlarge', 32, 128, 'general', 1121),
			t('c6i.2xlarge', 8, 16, 'compute', 248),
			t('c6i.4xlarge', 16, 32, 'compute', 496),
			t('r6i.xlarge', 4, 32, 'memory', 184),
			t('r6i.2xlarge', 8, 64, 'memory', 368),
			t('r6i.4xlarge', 16, 128, 'memory', 736)
		]
	},
	{
		id: 'azure',
		name: 'Azure (ARO HCP / HyperShift on Azure)',
		note: 'Approximate East US pay-as-you-go Linux prices, excluding subscriptions and storage.',
		types: [
			t('D4s_v5', 4, 16, 'general', 140),
			t('D8s_v5', 8, 32, 'general', 280),
			t('D16s_v5', 16, 64, 'general', 561),
			t('D32s_v5', 32, 128, 'general', 1121),
			t('F8s_v2', 8, 16, 'compute', 247),
			t('F16s_v2', 16, 32, 'compute', 494),
			t('E4s_v5', 4, 32, 'memory', 184),
			t('E8s_v5', 8, 64, 'memory', 368),
			t('E16s_v5', 16, 128, 'memory', 736)
		]
	}
];

export function catalogById(id: string): CatalogPreset {
	return CATALOGS.find((c) => c.id === id) ?? CATALOGS[0];
}
