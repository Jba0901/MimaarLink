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

test('brand mark rules never filter, glow, or shadow the official image', () => {
  const filters = [];
  postcss.parse(css).walkRules(rule => {
    if (!rule.selector.includes('.brand-mark')) return;
    rule.walkDecls(decl => {
      if (['filter', 'box-shadow', 'text-shadow'].includes(decl.prop)) filters.push(decl.value);
    });
  });
  assert.ok(filters.length > 0);
  assert.ok(filters.every(value => value === 'none'));
});

test('dark surfaces use a noninteractive backing without changing image dimensions', () => {
  assert.match(css, /\.dark \.brand-mark::before,\s+\.brand-mark-on-dark::before/);
  assert.match(css, /background: #F5F4F1;\s+pointer-events: none;/);
  assert.match(shell, /<Logo className="h-8 w-8" onDark \/>/);
  assert.match(shell, /src="\/logo.png"/);
  assert.match(css, /object-fit: contain;\s+filter: none;/);
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
