export function focusFormField(fieldId) {
  if (typeof window === 'undefined') return;

  window.requestAnimationFrame(() => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    field.focus({ preventScroll: true });
    field.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  });
}
