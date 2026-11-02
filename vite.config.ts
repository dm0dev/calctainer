import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	root: fileURLToPath(new URL('./src', import.meta.url)),
	publicDir: fileURLToPath(new URL('./public', import.meta.url)),
	base: './',
	plugins: [
		tailwindcss(),
		svelte({ configFile: fileURLToPath(new URL('./svelte.config.js', import.meta.url)) })
	],
	build: {
		outDir: fileURLToPath(new URL('./dist', import.meta.url)),
		emptyOutDir: true
	},
	test: {
		root: fileURLToPath(new URL('.', import.meta.url)),
		include: ['src/**/*.test.ts']
	}
});
