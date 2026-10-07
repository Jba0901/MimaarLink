import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const postcss = require('postcss');
const css = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
const shell = await readFile(new URL('../components/AppShell.jsx', import.meta.url), 'utf8');

test('drawer focus does not depend on animation frames and narrow labels have room', () => {
  assert.match(shell, /window.setTimeout\(\(\) => menuCloseButtonRef.current\?\.focus\(\), 0\)/);
  assert.match(shell, /window.clearTimeout\(focusTimer\)/);
  assert.doesNotMatch(shell, /requestAnimationFrame/);
  assert.match(shell, /max-\[359px\]:gap-1 max-\[359px\]:px-2/);
});

test('brand logo rules never filter, glow, or shadow the official artwork', () => {
  const rules = [];
  const effects = [];
  postcss.parse(css).walkRules(rule => {
    if (!rule.selector.includes('.brand-logo')) return;
    rules.push(rule.selector);
    rule.walkDecls(decl => {
      if (['filter', 'box-shadow', 'text-shadow', 'mix-blend-mode'].includes(decl.prop)) effects.push(decl.value);
    });
  });
  assert.ok(rules.length > 0);
  assert.ok(effects.every(value => value === 'none'));
});

test('dark surfaces swap to the official dark artwork instead of altering the image', () => {
  assert.match(css, /\.dark \.brand-logo \.brand-logo-dark,\s+\.brand-logo-on-dark \.brand-logo-dark \{ display: block; \}/);
  assert.match(shell, /\/brand\/logo\/mimaary-logo-\$\{script\}-dark\.svg/);
  assert.match(shell, /src="\/brand\/logo\/mimaary-logo-bilingual-dark\.svg"/);
  // The wordmark is always the file, never typed in a font.
  assert.doesNotMatch(shell, /<span style=\{\{ color: first \}\}>Mimaar/);
});

test('served Mimaary logo files are byte-identical to the brand source', async () => {
  for (const file of ['mimaary-logo-en.svg', 'mimaary-logo-en-dark.svg', 'mimaary-logo-ar.svg', 'mimaary-logo-ar-dark.svg', 'mimaary-logo-bilingual-dark.svg', 'mimaary-icon.svg', 'mimaary-icon-512.png', 'mimaary-icon-180.png']) {
    const source = await readFile(new URL(`../brand/logo/${file}`, import.meta.url));
    const served = await readFile(new URL(`../public/brand/logo/${file}`, import.meta.url));
    assert.ok(source.equals(served), file);
  }
});

test('the MimaarLink name and artwork are retired (brand v1.6: Mimaary / معماري)', async () => {
  for (const dir of ['../brand/logo/', '../public/brand/logo/', '../public/', '../public/brand/']) {
    const names = await readdir(new URL(dir, import.meta.url));
    assert.deepEqual(names.filter((n) => /mimaarlink|^logo(-dark-transparent)?\.png$/i.test(n)), [], dir);
  }
  for (const file of ['../lib/i18n.js', '../app/page.js', '../app/layout.js', '../app/manifest.js', '../app/privacy/page.js', '../components/AppShell.jsx']) {
    const source = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /mimaar ?link|معمار لينك/i, file);
  }
});

test('public contact email is mimaary.qa@gmail.com (DECISIONS.md 2026-10-07)', async () => {
  const shell = await readFile(new URL('../components/AppShell.jsx', import.meta.url), 'utf8');
  const privacy = await readFile(new URL('../app/privacy/page.js', import.meta.url), 'utf8');
  assert.match(shell, /href="mailto:mimaary\.qa@gmail\.com"/);
  assert.match(shell, /'mimaary\.qa@gmail\.com', 'mailto:mimaary\.qa@gmail\.com'/);
  assert.match(privacy, /href="mailto:mimaary\.qa@gmail\.com"/);
  assert.match(privacy, /<bdi dir="ltr">mimaary\.qa@gmail\.com<\/bdi>/);
  for (const source of [shell, privacy]) assert.doesNotMatch(source, /MimaarLink@gmail\.com/i);
  // Instagram is @mimaary.qa in the drawer and the footer.
  assert.equal((shell.match(/https:\/\/instagram\.com\/mimaary\.qa/g) || []).length, 2);
});
