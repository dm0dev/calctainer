import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	base: './',
	plugins: [tailwindcss(), svelte()],
	test: {
		include: ['src/**/*.test.ts']
	}
});
