// MimaarLink brand theme for Tailwind v3.
// Usage in tailwind.config.js:  theme: { extend: require('./tailwind.brand.js') }
// (Tailwind v4 projects use the @theme block in brand-tokens.css instead.)

module.exports = {
  colors: {
    navy: 'var(--ml-navy)',
    teal: { DEFAULT: 'var(--ml-teal)', ink: 'var(--ml-teal-ink)' },
    'pale-teal': 'var(--ml-pale-teal)',
    night: 'var(--ml-night)',
    'bright-teal': 'var(--ml-bright-teal)',
    bg: 'var(--ml-bg)',
    ground: 'var(--ml-ground)',
    surface: 'var(--ml-surface)',
    heading: 'var(--ml-heading)',
    body: 'var(--ml-body)',
    muted: 'var(--ml-muted)',
    line: 'var(--ml-line)',
    accent: { DEFAULT: 'var(--ml-accent)', hover: 'var(--ml-accent-hover)' },
    'on-accent': 'var(--ml-on-accent)',
    signature: { DEFAULT: 'var(--ml-signature-bg)', fg: 'var(--ml-signature-fg)', label: 'var(--ml-signature-label)' },
    warn: 'var(--ml-warn)',
  },
  fontFamily: {
    serif: ['var(--font-source-serif)', 'var(--font-naskh)', 'Georgia', 'serif'],
    sans: ['var(--font-plex)', 'var(--font-plex-arabic)', 'Segoe UI', 'system-ui', 'sans-serif'],
  },
  borderRadius: { brand: 'var(--ml-radius)' },
  boxShadow: { brand: 'var(--ml-shadow)' },
  transitionTimingFunction: { brand: 'var(--ml-ease)' },
  transitionDuration: { fast: '140ms', base: '220ms', slow: '360ms' },
  maxWidth: { content: '1200px' },
};
