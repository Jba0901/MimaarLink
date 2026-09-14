import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');
const lazyControls = await read('../components/LazyFormControls.jsx');
const providerForm = await read('../app/contractor/page.js');
const projectForm = await read('../app/post-project/page.js');
const api = await read('../app/api/[[...path]]/route.js');
const copy = await read('../lib/i18n.js');

test('lazy upload fallback remains visually informative while its chunk loads', () => {
  assert.match(lazyControls, /fallback=\{\([\s\S]*?border-2 border-dashed[\s\S]*?\{props\.label\}[\s\S]*?\{props\.hint\}/);
  assert.match(lazyControls, /<Upload className="h-5 w-5" \/>/);
});

test('phone input itself keeps the full mobile touch height', () => {
  assert.match(providerForm, /className="min-h-11 min-w-0 flex-1 bg-transparent/);
});

test('timeline examples fit narrow mobile inputs in both languages', () => {
  assert.match(copy, /timelinePh: 'e\.g\., Start in 2 weeks'/);
  assert.match(copy, /timelinePh: 'مثال: البدء خلال أسبوعين'/);
  assert.doesNotMatch(copy, /finish in 1 month|الإنجاز خلال شهر/);
});

test('provider identity step requires only CR and WhatsApp', () => {
  assert.match(providerForm, /const basicsValid = Boolean\(data\.crNumber\.trim\(\) && phoneValid\)/);
  assert.match(providerForm, /provider-company-name[\s\S]*?required=\{false\}/);
  assert.match(providerForm, /provider-contact-person[\s\S]*?required=\{false\}/);
  assert.match(providerForm, /const firstInvalidBasicsField = !data\.crNumber\.trim\(\) \? 'provider-cr-number' : 'provider-whatsapp'/);
});

test('project location is implicit Doha and no longer requested in the owner form', () => {
  assert.doesNotMatch(projectForm, /id="project-location"/);
  assert.doesNotMatch(projectForm, /category: '', location:/);
  assert.match(api, /location: body\.location \|\| 'Doha'/);
  assert.match(copy, /projectStep2Desc: 'A clear description is enough for us to start reviewing\.'/);
  assert.match(copy, /projectStep2Desc: 'الوصف الواضح يكفي لبدء مراجعة الطلب\.'/);
});
