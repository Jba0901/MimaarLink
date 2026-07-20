import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { createAdminSessionValue, isAdminAuthConfigured, safeCredentialEqual } from '../lib/adminAuth.mjs';

test('admin auth is unavailable unless both credentials are non-empty and distinct', () => {
  assert.equal(isAdminAuthConfigured('', ''), false);
  assert.equal(isAdminAuthConfigured('password-value', ''), false);
  assert.equal(isAdminAuthConfigured('', 'session-value'), false);
  assert.equal(isAdminAuthConfigured('same-value', 'same-value'), false);
  assert.equal(isAdminAuthConfigured('password-value', 'session-value'), true);
});

test('credential comparison accepts only the exact value', () => {
  assert.equal(safeCredentialEqual('expected-value', 'expected-value'), true);
  assert.equal(safeCredentialEqual('expected-value', 'wrong-value'), false);
  assert.equal(safeCredentialEqual('expected-value', ''), false);
});

test('session values are stable per secret and change when the secret changes', () => {
  const first = createAdminSessionValue('session-value-one');
  assert.equal(first, createAdminSessionValue('session-value-one'));
  assert.notEqual(first, createAdminSessionValue('session-value-two'));
});

test('the admin route contains no literal or shared credential fallback', () => {
  const source = fs.readFileSync(new URL('../app/api/[[...path]]/route.js', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /ADMIN_PASSWORD\s*=\s*process\.env\.ADMIN_PASSWORD\s*\|\|\s*['"]/);
  assert.doesNotMatch(source, /ADMIN_SESSION_SECRET\s*=\s*process\.env\.ADMIN_SESSION_SECRET\s*\|\|\s*ADMIN_PASSWORD/);
});
