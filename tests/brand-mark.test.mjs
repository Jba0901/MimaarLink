import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
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
  assert.match(shell, /\/brand\/logo\/mimaarlink-logo-\$\{script\}-dark\.svg/);
  assert.match(shell, /src="\/brand\/logo\/mimaarlink-logo-bilingual-dark\.svg"/);
  // The wordmark is always the file, never typed in a font.
  assert.doesNotMatch(shell, /<span style=\{\{ color: first \}\}>Mimaar<\/span>/);
});

test('served v1.4 logo files are byte-identical to the brand handoff', async () => {
  for (const file of ['mimaarlink-logo-en.svg', 'mimaarlink-logo-en-dark.svg', 'mimaarlink-logo-ar.svg', 'mimaarlink-logo-ar-dark.svg', 'mimaarlink-logo-bilingual-dark.svg', 'mimaarlink-icon.svg', 'mimaarlink-icon-512.png', 'mimaarlink-icon-180.png']) {
    const source = await readFile(new URL(`../brand/logo/${file}`, import.meta.url));
    const served = await readFile(new URL(`../public/brand/logo/${file}`, import.meta.url));
    assert.ok(source.equals(served), file);
  }
});

test('official logo assets retain the released binary hashes', async () => {
  const expected = {
    'logo.png': 'E76A13819E70220797B5B89BDE0C62C8832CDAF06401FCDFD630859F2C94D12C',
    'logo-dark-transparent.png': 'E76A13819E70220797B5B89BDE0C62C8832CDAF06401FCDFD630859F2C94D12C',
    'brand/mimaarlink-official-logo-source.png': '92C95529EAB180905E33D6A9809A13128E54FB40D7F59BEA73E20A96558EE261',
  };
  for (const [file, hash] of Object.entries(expected)) {
    const data = await readFile(new URL(`../public/${file}`, import.meta.url));
    assert.equal(createHash('sha256').update(data).digest('hex').toUpperCase(), hash, file);
  }
});
