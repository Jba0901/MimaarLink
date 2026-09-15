import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { providerDisplayName, providerTypeLabel } from '../lib/providerPresentation.mjs';

const t = (key) => ({
  providerTypeContractor: 'Contractor',
  providerTypeConsultant: 'Consultant office',
  crNumber: 'CR',
  provider: 'Provider',
}[key] || key);

test('company name remains the preferred provider identity', () => {
  const provider = { providerType: 'contractor', companyName: '  Build Co  ', crNumber: '1234' };
  assert.equal(providerDisplayName(provider, t, { includeCr: true }), 'Build Co');
});

test('admin surfaces identify unnamed providers by CR number', () => {
  const provider = { providerType: 'consultant', companyName: '', crNumber: ' 7788 ' };
  assert.equal(providerDisplayName(provider, t, { includeCr: true }), 'CR 7788');
});

test('public bid surfaces do not expose the CR fallback', () => {
  const provider = { providerType: 'contractor', companyName: '', crNumber: '7788' };
  assert.equal(providerDisplayName(provider, t), 'Provider');
  assert.equal(providerTypeLabel(provider, t), 'Contractor');
});

test('consultant fallback remains localized by provider type', () => {
  assert.equal(providerDisplayName({ providerType: 'consultant' }, t), 'Provider');
  assert.equal(providerTypeLabel({ providerType: 'consultant' }, t), 'Consultant office');
});

test('optional provider fields never render unconditional blank labels or separators', async () => {
  const list = await readFile(new URL('../app/admin/page.js', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../app/admin/contractor/[id]/page.js', import.meta.url), 'utf8');

  assert.match(list, /c\.contactPerson && c\.whatsapp/);
  assert.match(detail, /\{c\.contactPerson && <div>/);
  assert.match(detail, /\{c\.serviceAreas && <div>/);
  assert.match(detail, /\{c\.projectSizeRange && <div>/);
});
