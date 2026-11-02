// Converts a11y.md (the single source of the accessibility statement) into
// public/accessibility.html. Runs before `dev` and `build`; the output is generated and git-ignored.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'a11y.md');
const target = resolve(root, 'public/accessibility.html');

const body = marked.parse(readFileSync(source, 'utf8'), { gfm: true, async: false });

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="Accessibility statement for Calctainer (Directive (EU) 2019/882)." />
<title>Ease of Access – Calctainer</title>
<!-- Generated from a11y.md by scripts/build-a11y.mjs. Do not edit. -->
<style>
  body { background: #ffffff; color: #1a1a1a; max-width: 60rem; margin: 0 auto; padding: 1rem; line-height: 1.5; font-family: sans-serif; }
  @media (prefers-color-scheme: dark) { body { background: #151515; color: #f0f0f0; } a { color: #8ab4ff; } }
  table { border-collapse: collapse; }
  th, td { border: 1px solid currentColor; padding: 0.25rem 0.5rem; text-align: left; vertical-align: top; }
</style>
</head>
<body>
<p><a href="./">← Back to Calctainer</a></p>
<main>
${body}
</main>
</body>
</html>
`;

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, html);
console.log(`Generated ${target}`);
