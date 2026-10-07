// Web app manifest: lets Mimaary be installed to a phone's home screen today
// and is the same metadata a store wrapper (PWA/TWA) will read later.
export default function manifest() {
  return {
    name: 'معماري | Mimaary',
    short_name: 'معماري',
    description: 'طلب واحد، ومن ثلاثة إلى خمسة عروض، والقرار لك. منصة معماري لعروض المقاولين والاستشاريين في قطر.',
    start_url: '/?source=app',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F6F8FB',
    theme_color: '#152B54',
    lang: 'ar',
    dir: 'rtl',
    categories: ['business', 'productivity'],
    icons: [
      { src: '/brand/logo/mimaary-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/logo/mimaary-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/brand/logo/mimaary-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
    shortcuts: [
      { name: 'انشر مشروعك', short_name: 'انشر مشروعك', url: '/post-project?source=app' },
      { name: 'قدّم طلب الانضمام', short_name: 'طلب الانضمام', url: '/contractor?source=app' },
    ],
  };
}
