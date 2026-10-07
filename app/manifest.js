// Web app manifest: lets Mimaary be installed to a phone's home screen today
// and is the same metadata a store wrapper (PWA/TWA) will read later.
export default function manifest() {
  return {
    name: 'Mimaary | معماري',
    short_name: 'Mimaary',
    description: 'One request. Three to five offers. You choose. Project sourcing in Qatar.',
    start_url: '/?source=app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F7F3EC',
    theme_color: '#152B54',
    lang: 'ar',
    dir: 'auto',
    categories: ['business', 'productivity'],
    icons: [
      { src: '/brand/logo/mimaary-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/logo/mimaary-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/brand/logo/mimaary-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
    shortcuts: [
      { name: 'Post your project', short_name: 'Post project', url: '/post-project?source=app' },
      { name: 'Join as a contractor', short_name: 'Join', url: '/contractor?source=app' },
    ],
  };
}
