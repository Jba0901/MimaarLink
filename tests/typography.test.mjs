import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const postcss = require('postcss');
const config = require('../tailwind.config.js');
const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const layout = await read('../app/layout.js');
const fonts = await read('../lib/fonts.js');
const tokens = await read('../app/brand-tokens.css');
const css = await read('../app/typography.css');
const globals = await read('../app/globals.css');
const parsed = postcss.parse(css);
const declarations = (selector) => {
  const result = [];
  parsed.walkRules((rule) => {
    if (rule.selector === selector) rule.walkDecls((decl) => result.push([decl.prop, decl.value]));
  });
  return result;
};

test('the brand fonts are self-hosted from repo files with visible fallback text', async () => {
  assert.match(fonts, /import localFont from 'next\/font\/local'/);
  assert.doesNotMatch(fonts, /next\/font\/google/, 'builds must not download fonts from Google');
  assert.equal((fonts.match(/display: 'swap'/g) || []).length, 4);
  for (const [, file] of fonts.matchAll(/path: '\.\/(font-files\/[^']+\.woff2)'/g)) {
    const { size } = await stat(new URL(`../lib/${file}`, import.meta.url));
    assert.ok(size > 10000, `${file} is missing or empty`);
  }
  assert.equal((fonts.match(/adjustFontFallback: false/g) || []).length, 2, 'Arabic faces must not shadow the Latin family with a metric fallback');
  assert.match(layout, /className=\{fontVariables\}/);
  for (const source of [layout, css, globals, tokens]) assert.doesNotMatch(source, /fonts\.googleapis\.com|fonts\.gstatic\.com|Manrope/);
});

test('each direction leads with its own script so glyphs are never borrowed', () => {
  assert.match(tokens, /--ml-sans: var\(--font-plex\), var\(--font-plex-arabic\)/);
  assert.match(tokens, /--ml-sans-ar: var\(--font-plex-arabic\), var\(--font-plex\)/);
  assert.match(tokens, /--ml-serif-ar: var\(--font-naskh\)/);
  assert.match(globals, /html\[dir="rtl"\] body \{ font-family: var\(--ml-sans-ar\); line-height: 1\.8; \}/);
  assert.match(layout, /<html lang=\{initialLang\} dir=\{initialLang === 'ar' \? 'rtl' : 'ltr'\}/);
});

test('Arabic headings have natural spacing and room for ascenders and marks', () => {
  assert.match(globals, /html\[dir="rtl"\] \.ml-home h1 \{ line-height: 1\.45; letter-spacing: 0; \}/);
  assert.match(css, /html\[dir='rtl'\] :where\(h1, h2, h3, h4, button, input, textarea, label\) \{ letter-spacing: 0; \}/);
  assert.match(css, /font-synthesis: none/);
});

test('all utility weights correspond to the three installed Arabic weights', () => {
  const available = new Set(['400', '500', '600']);
  for (const name of ['normal', 'medium', 'semibold', 'bold', 'extrabold', 'black']) {
    assert.ok(available.has(config.theme.extend.fontWeight[name]), `${name} requests an unloaded weight`);
  }
});

test('body copy and supporting text have explicit readable type tokens', () => {
  assert.ok(declarations(':root').some(([p, v]) => p === '--type-copy' && v === '0.9375rem'));
  assert.ok(declarations(':root').some(([p, v]) => p === '--type-caption' && v === '0.8125rem'));
  assert.match(css, /font-variant-numeric: lining-nums tabular-nums/);
});

test('choice labels may reflow when a reader increases text spacing', () => {
  assert.match(globals, /\.ml-choice-text \{ min-width: 0; flex: 1; overflow-wrap: break-word; \}/);
  assert.match(globals, /\.ml-review-row dd > span \{ min-width: 0; overflow-wrap: anywhere;/);
});

test('buttons keep breathing room around either script', () => {
  assert.match(globals, /@layer components \{\s+\.btn \{ padding: 12px 20px; border-radius: var\(--ml-radius\); \}/);
  assert.match(globals, /\.ml-flow-back \{ min-width: 6\.5rem; padding-inline: 16px; \}/);
});

test('every shipped font licence is available in the public distribution', async () => {
  for (const file of ['Source-Serif-4-OFL.txt', 'IBM-Plex-Sans-OFL.txt', 'IBM-Plex-Sans-Arabic-OFL.txt', 'Noto-Naskh-Arabic-OFL.txt']) {
    const license = await read(`../public/fonts/licenses/${file}`);
    assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/);
    assert.match(license, /Copyright/);
    assert.match(license, /PERMISSION & CONDITIONS/);
  }
});
