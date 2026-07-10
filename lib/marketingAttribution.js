'use client';

export const MARKETING_CONSENT_KEY = 'mimaarlink_marketing_consent';
const ATTRIBUTION_KEY = 'mimaarlink_marketing_attribution';
const TRACKED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

function clean(value, maxLength = 240) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function hasTrackedMarketingParams(search = '') {
  const params = new URLSearchParams(search);
  return TRACKED_PARAMS.some((key) => Boolean(clean(params.get(key))));
}

export function metaPixelConfigured() {
  return process.env.NEXT_PUBLIC_META_PIXEL_ENABLED === 'true' && Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);
}

export function getMarketingConsent() {
  if (typeof window === 'undefined') return 'pending';
  try {
    return window.localStorage.getItem(MARKETING_CONSENT_KEY) || 'pending';
  } catch {
    return 'pending';
  }
}

export function setMarketingConsent(value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MARKETING_CONSENT_KEY, value);
    if (value !== 'accepted') window.sessionStorage.removeItem(ATTRIBUTION_KEY);
  } catch {
    // Consent remains usable for this page even if storage is unavailable.
  }
}

export function captureMarketingAttribution() {
  if (typeof window === 'undefined' || getMarketingConsent() !== 'accepted') return {};

  const params = new URLSearchParams(window.location.search);
  const incoming = {};

  TRACKED_PARAMS.forEach((key) => {
    const value = clean(params.get(key));
    if (value) incoming[key] = value;
  });

  if (Object.keys(incoming).length === 0) return getMarketingAttribution();

  const attribution = {
    ...incoming,
    landing_path: clean(window.location.pathname, 160),
    captured_at: new Date().toISOString(),
  };

  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // The form still works when storage is unavailable.
  }

  return attribution;
}

export function getMarketingAttribution() {
  if (typeof window === 'undefined' || getMarketingConsent() !== 'accepted') return {};

  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function loadMetaPixel() {
  if (typeof window === 'undefined' || getMarketingConsent() !== 'accepted' || !metaPixelConfigured()) return false;
  if (window.fbq) return true;

  const fbq = function metaQueue() {
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  window.fbq('init', process.env.NEXT_PUBLIC_META_PIXEL_ID);
  return true;
}

export function trackMeta(eventName, parameters = {}, options = {}) {
  if (!loadMetaPixel()) return false;
  window.fbq(options.custom ? 'trackCustom' : 'track', eventName, parameters);
  return true;
}

export function trackMetaOnce(key, eventName, parameters = {}, options = {}) {
  if (typeof window === 'undefined') return false;
  const storageKey = `mimaarlink_event_${key}`;

  try {
    if (window.sessionStorage.getItem(storageKey)) return false;
    const tracked = trackMeta(eventName, parameters, options);
    if (tracked) window.sessionStorage.setItem(storageKey, '1');
    return tracked;
  } catch {
    return trackMeta(eventName, parameters, options);
  }
}

