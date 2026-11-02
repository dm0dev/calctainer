// Temporary helper: runs axe-core against every app view by driving the real UI in Chrome.
// Usage: node scripts/a11y-sweep.mjs [http://localhost:5174]
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pnpm = path.join(root, 'node_modules', '.pnpm');
const req = createRequire(path.join(pnpm, 'puppeteer@25.16.0', 'node_modules', 'puppeteer', 'package.json'));
const { default: puppeteer } = await import(pathToFileURL(req.resolve('puppeteer')).href);

const url = process.argv[2] ?? 'http://localhost:5174';
const exe =
	process.env.PUPPETEER_EXECUTABLE_PATH ??
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const axeSrc = readFileSync(path.join(pnpm, 'axe-core@4.13.0', 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');

const browser = await puppeteer.launch({ headless: true, executablePath: exe, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.evaluate(axeSrc);
const run = () => page.evaluate(() => window.axe.run(document, { resultTypes: ['violations'] }));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];

async function capture(label) {
	const res = await run();
	out.push({ view: label, violations: res.violations });
	console.log(`${label}: ${res.violations.length} violation(s)`);
	for (const v of res.violations) console.log(`  [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} node(s))`);
}

// 1. Onboarding dialog (fresh profile)
await wait(1500);
await capture('onboarding');

// 2. Dismiss onboarding with "Standard"
await page.evaluate(() => {
	const btns = [...document.querySelectorAll('button')];
	const b = btns.find((x) => x.textContent.trim() === 'Standard');
	if (b) b.click();
});
await wait(800);

// 3. Sweep every view via the side navigation
const views = ['workloads', 'pools', 'scheduling', 'quota', 'findings', 'savings', 'assumptions'];
const count = await page.evaluate(() => document.querySelectorAll('nav[aria-label="Views"] button').length);
if (count !== views.length) console.error(`expected ${views.length} nav buttons, found ${count}`);

for (let i = 0; i < views.length; i++) {
	await page.evaluate((i) => document.querySelectorAll('nav[aria-label="Views"] button')[i].click(), i);
	await wait(900);
	await capture(`view:${views[i]}`);
}

// 4. Import/export dialog (open state)
await page.evaluate(() => {
	const btns = [...document.querySelectorAll('header button')];
	const b = btns.find((x) => (x.getAttribute('aria-label') || x.textContent).includes('Import / export')) ?? btns[btns.length - 2];
	if (b) b.click();
});
await wait(700);
await capture('dialog:io');
await page.keyboard.press('Escape');
await wait(400);

// 5. Guided mode (guided cards + next/back buttons)
await page.evaluate(() => {
	const els = [...document.querySelectorAll('header *')].filter((x) => x.childElementCount === 0 && x.textContent.trim() === 'Guided');
	const el = els[0];
	if (el) (el.closest('[role="radio"], button, label, a, input') ?? el).click();
});
await wait(800);
await capture('mode:guided');
await page.evaluate(() => {
	const els = [...document.querySelectorAll('header *')].filter((x) => x.childElementCount === 0 && x.textContent.trim() === 'Standard');
	const el = els[0];
	if (el) (el.closest('[role="radio"], button, label, a, input') ?? el).click();
});
await wait(600);

await browser.close();

const bad = out.filter((o) => o.violations.length > 0);
console.log(`\n${bad.length ? 'ISSUES FOUND' : 'ALL CLEAN'} (${out.length} states)`);
if (bad.length) {
	console.log(JSON.stringify(bad, null, 2));
	process.exitCode = 2;
}
