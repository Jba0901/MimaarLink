import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(file, import.meta.url), 'utf8');
const lazyControls = await read('../components/LazyFormControls.jsx');
const providerForm = await read('../app/contractor/page.js');
const projectForm = await read('../app/post-project/page.js');
const api = await read('../app/api/[[...path]]/route.js');
const copy = await read('../lib/i18n.js');
const formDraft = await read('../lib/formDraft.js');

test('lazy upload fallback remains visually informative while its chunk loads', () => {
  assert.match(lazyControls, /fallback=\{\([\s\S]*?border-2 border-dashed[\s\S]*?\{props\.label\}[\s\S]*?\{props\.hint\}/);
  assert.match(lazyControls, /<Upload className="h-5 w-5" \/>/);
});

test('phone input itself keeps the full 48px mobile touch height', () => {
  assert.match(providerForm, /className="min-h-12 min-w-0 flex-1 bg-transparent/);
  assert.match(projectForm, /phone-field-shell mt-1\.5 flex min-h-12/);
});

test('timeline examples fit narrow mobile inputs in both languages', () => {
  assert.match(copy, /timelinePh: 'e\.g\., Start in 2 weeks'/);
  assert.match(copy, /timelinePh: 'مثال: البدء خلال أسبوعين'/);
  assert.doesNotMatch(copy, /finish in 1 month|الإنجاز خلال شهر/);
});

test('provider identity steps require only CR and WhatsApp', () => {
  assert.match(providerForm, /if \(!data\.crNumber\.trim\(\)\) \{ focusFormField\('provider-cr-number'\); return; \}/);
  assert.match(providerForm, /if \(!phoneValid\) \{ focusFormField\('provider-whatsapp'\); return; \}/);
  for (const id of ['provider-company-name', 'provider-contact-person', 'provider-email']) {
    assert.match(providerForm, new RegExp(`id="${id}"[^\\n]*required=\\{false\\}`), id);
  }
});

test('project location is optional, skippable, and still defaults to Doha', () => {
  assert.match(projectForm, /const STEPS = \['type', 'describe', 'location', 'timing', 'budget', 'contact', 'review'\]/);
  assert.match(projectForm, /\['location', 'timing', 'budget'\]\.includes\(step\)/);
  assert.match(projectForm, /locationDefault: 'Skipped \(Doha by default\)'/);
  assert.match(api, /location: body\.location \|\| 'Doha'/);
});

test('drafts stay in this browser and never hold contact details or files', () => {
  const projectDraft = projectForm.match(/const DRAFT_FIELDS = \[([^\]]*)\]/)[1];
  const providerDraft = providerForm.match(/const DRAFT_FIELDS = \[([^\]]*)\]/)[1];
  for (const field of ['name', 'phone', 'email', 'company', 'role', 'files']) assert.doesNotMatch(projectDraft, new RegExp(`'${field}'`), field);
  for (const field of ['crNumber', 'whatsapp', 'contactPerson', 'email', 'documents']) assert.doesNotMatch(providerDraft, new RegExp(`'${field}'`), field);
  assert.match(formDraft, /window\.localStorage\.setItem/);
  assert.match(formDraft, /const MAX_AGE_MS = 7 \* 24 \* 60 \* 60 \* 1000/);
  assert.doesNotMatch(formDraft, /fetch\(|document\.cookie/);
});

test('the shortlist records only a firm that bid on the project', () => {
  assert.match(api, /alter table projects\s+add column if not exists selected_contractor_id text references contractors\(id\) on delete set null/);
  assert.match(api, /select 1 from bids where project_id = \$1 and contractor_id = \$2 limit 1/);
  assert.match(api, /if \(!bidMatch\.length\) return err\('Offer not found for this project', 404\)/);
});

test('Arabic placeholders sit on the right: free-text fields use plaintext bidi, never an empty dir="auto"', async () => {
  const globals = await read('../app/globals.css');
  const unsureField = await read('../components/TextOrUnsureField.jsx');
  assert.match(globals, /:where\(input:not\(\[dir\]\), textarea:not\(\[dir\]\)\) \{ unicode-bidi: plaintext; \}/);
  for (const [name, source] of [['provider', providerForm], ['project', projectForm], ['unsure field', unsureField]]) {
    assert.doesNotMatch(source, /<(Input|Textarea|input|textarea)\b[^>]*dir="auto"/, name);
  }
  assert.doesNotMatch(unsureField, /dir="auto"/);
});

test('provider application has no service-area step (most work is in Doha)', () => {
  assert.match(providerForm, /const stepsFor = \(isConsultant\) => \['type', 'company', 'contact', 'services', \.\.\.\(isConsultant \? \['grade'\] : \[\]\), 'size', 'profile', 'review'\];/);
  assert.doesNotMatch(providerForm, /serviceAreas|'areas'/);
});
