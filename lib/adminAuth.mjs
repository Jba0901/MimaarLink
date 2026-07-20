import crypto from 'crypto';

function digest(value) {
  return crypto.createHash('sha256').update(String(value ?? '')).digest();
}

export function safeCredentialEqual(left, right) {
  return crypto.timingSafeEqual(digest(left), digest(right));
}

export function isAdminAuthConfigured(password, sessionSecret) {
  return Boolean(password && sessionSecret && !safeCredentialEqual(password, sessionSecret));
}

export function createAdminSessionValue(sessionSecret) {
  return crypto.createHash('sha256').update(`mimaarlink-admin:${sessionSecret}`).digest('hex');
}
