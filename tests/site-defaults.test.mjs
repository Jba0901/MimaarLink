import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DEFAULT_LANG, resolveLanguage } from '../lib/language.mjs';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');

test('the site is light by default whatever the system setting (DECISIONS.md 2026-10-07)', async () => {
  const layout = await read('../app/layout.js');
  const shell = await read('../components/AppShell.jsx');
  const css = await read('../app/globals.css');
  // No system-following theme: one light browser-bar colour, browsers told not to auto-darken.
  assert.doesNotMatch(layout, /prefers-color-scheme/);
  assert.match(layout, /colorScheme: 'only light'/);
  assert.match(layout, /themeColor: '#F6F8FB'/);
  assert.match(css, /html \{ color-scheme: light; \}/);
  // Night mode only when the visitor chose it; anything else starts light.
  assert.match(layout, /localStorage\.getItem\('mimaaryTheme'\)==='dark'/);
  assert.match(shell, /stored === 'dark' \|\| stored === 'light' \? stored : 'light'/);
  assert.doesNotMatch(shell, /matchMedia\('\(prefers-color-scheme/);
});

test('Arabic is the default language, and titles and the app name read Arabic first', async () => {
  assert.equal(DEFAULT_LANG, 'ar');
  assert.equal(resolveLanguage(undefined, undefined), 'ar');
  assert.equal(resolveLanguage(null, 'fr'), 'ar');
  const layout = await read('../app/layout.js');
  assert.match(layout, /export function generateMetadata\(\)/);
  assert.match(layout, /title: 'منصة معماري \|/);
  const manifest = await read('../app/manifest.js');
  assert.match(manifest, /short_name: 'معماري'/);
  assert.match(manifest, /lang: 'ar'/);
  assert.match(manifest, /dir: 'rtl'/);
});
