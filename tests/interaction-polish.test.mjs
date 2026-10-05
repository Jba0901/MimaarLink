import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');
const css = await read('../app/globals.css');
const start = await read('../app/start-here/page.js');
const home = await read('../app/page.js');
const card = await read('../components/AudiencePathCard.jsx');

test('the project owner is the only primary path and all destinations stay intact', () => {
  assert.equal((start.match(/^\s+primary$/gm) || []).length, 1);
  assert.match(start, /pathType="project"\s+primary/);
  for (const href of ['/post-project', '/contractor', '/contractor?type=consultant']) {
    assert.ok(start.includes(`href="${href}"`));
  }
  assert.equal((card.match(/data-primary=\{primary \? 'true' : undefined\}/g) || []).length, 2);
});

test('sector arrows follow writing direction without replacing real links', () => {
  assert.ok(home.includes("href={category ? `/post-project?category=${category}` : '/post-project'}"));
  assert.match(home, /<ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden="true" \/>/);
  assert.match(css, /html\[dir="rtl"\] \.ml-sectors a:hover svg \{ transform: rotate\(180deg\) translateX\(3px\); \}/);
});

test('homepage example offers are always labelled as illustrative, never real figures', () => {
  assert.match(home, /compareNote: 'Example\. Firm names and figures are illustrative, not real offers\.'/);
  assert.match(home, /compareNote: 'مثال توضيحي\. الأسماء والأرقام افتراضية وليست عروضًا حقيقية\.'/);
  assert.match(home, /<aside className="ml-signature ml-cut" aria-label=\{copy\.example\}>/);
});

test('touch devices get the same feedback as desktop hover, and reveals run on phones', () => {
  assert.match(css, /@media \(hover: none\) \{[\s\S]*?\.btn-primary:active \{ background: var\(--ml-accent-hover\); \}/);
  assert.match(css, /\.ml-choice:active,\s+\.ml-chip:active/);
  assert.doesNotMatch(css, /@media \(max-width: 639px\), \(prefers-reduced-motion: reduce\) \{\s+\.reveal\.is-pending/);
  assert.match(home, /<RevealGroup className="ml-home">/);
});

test('entry-card feedback is scoped and does not add motion or a new tracker', () => {
  assert.match(css, /\.start-here-grid \.path-card \{[^}]*transform: none;[^}]*transition: background-color 150ms ease, border-color 150ms ease/);
  assert.match(css, /\.path-card-link-label > span \{ color: #152B54/);
  assert.match(card, /trackMeta\('PathSelected'/);
  assert.doesNotMatch(start, /setTimeout|IntersectionObserver|fbq\(/);
});

test('each whole-card link exposes its existing title and action as an accessible name', () => {
  assert.ok(card.includes('aria-label={cta ? `${title} — ${cta}` : title}'));
});

test('shell stays calm: no arrow badges, no extra-bold, no bottom tab bar, footer keeps CR number', async () => {
  const shell = await readFile(new URL('../components/AppShell.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(shell, /ArrowUpRight/);
  assert.doesNotMatch(shell, /font-extrabold/);
  assert.doesNotMatch(shell, /path-card/);
  assert.doesNotMatch(shell, /mobile-bottom-nav|function NavBtn/);
  assert.doesNotMatch(css, /mobile-bottom-nav|mobile-nav-main/);
  assert.match(shell, /Registered in Qatar · CR No\. 243332/);
  assert.match(shell, /data-over-hero=\{onNavy \|\| undefined\}/);
});
