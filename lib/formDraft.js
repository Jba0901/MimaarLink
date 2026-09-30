// Drafts live only in this browser (localStorage) and are never sent anywhere.
// Contact details and files are never stored; callers pass only safe fields.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function loadDraft(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== 'object' || !draft.savedAt || Date.now() - draft.savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(key);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function saveDraft(key, payload) {
  try {
    window.localStorage.setItem(key, JSON.stringify({ ...payload, savedAt: Date.now() }));
  } catch {}
}

export function clearDraft(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {}
}
