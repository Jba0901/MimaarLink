import './brand-tokens.css';
import './globals.css';
import './typography.css';
import { headers } from 'next/headers';
import { LANG_HEADER, resolveLanguage } from '@/lib/language.mjs';
import { LangProvider } from '@/lib/LangContext';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/fonts';

const ICONS = {
  icon: [
    { url: '/brand/logo/mimaary-icon.svg?v=2', type: 'image/svg+xml' },
    { url: '/brand/logo/mimaary-icon-512.png?v=2', type: 'image/png', sizes: '512x512' },
  ],
  shortcut: [{ url: '/brand/logo/mimaary-icon-512.png?v=2', type: 'image/png' }],
  apple: [{ url: '/brand/logo/mimaary-icon-180.png?v=2', type: 'image/png', sizes: '180x180' }],
};

// Arabic first: search results, link previews and the browser tab read Arabic
// unless the visitor chose English.
const META = {
  ar: {
    title: 'منصة معماري | عروض المقاولين والاستشاريين في قطر',
    description: 'طلب واحد، ومن ثلاثة إلى خمسة عروض، والقرار لك. صف مشروعك بكلماتك، ونحوّله إلى وصف واضح نرسله إلى مقاولين واستشاريين معتمدين في قطر، ثم نعرض عروضهم جنبًا إلى جنب.',
    appTitle: 'معماري',
  },
  en: {
    title: 'Mimaary | Contractor and consultant offers in Qatar',
    description: 'One request. Three to five offers. You choose. Describe your project, we send it to vetted contractors and consultants in Qatar and put their offers side by side.',
    appTitle: 'Mimaary',
  },
};

export function generateMetadata() {
  const lang = resolveLanguage(headers().get(LANG_HEADER));
  const meta = META[lang];
  return {
    title: meta.title,
    description: meta.description,
    icons: ICONS,
    appleWebApp: { capable: true, title: meta.appTitle, statusBarStyle: 'default' },
    formatDetection: { telephone: false },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Light whatever the phone's system setting: no auto-darkening, light browser bar.
  // Night mode is only ever the visitor's own choice in the menu.
  colorScheme: 'only light',
  themeColor: '#F6F8FB',
};

export default function RootLayout({ children }) {
  const initialLang = resolveLanguage(headers().get(LANG_HEADER));
  return (
    <html lang={initialLang} dir={initialLang === 'ar' ? 'rtl' : 'ltr'} className={fontVariables} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(localStorage.getItem('mimaaryTheme')==='dark')document.documentElement.classList.add('dark')}catch(e){}"
              // Homepage hero: offers arrive one by one on the first visit only, never with reduced motion.
              + "try{if(location.pathname==='/'&&!localStorage.getItem('mlHeroSeen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var r=document.documentElement;r.classList.add('ml-hero-intro');localStorage.setItem('mlHeroSeen','1');setTimeout(function(){r.classList.remove('ml-hero-intro')},2400)}}catch(e){}",
          }}
        />
      </head>
      <body>
        <LangProvider initialLang={initialLang}>
          {children}
          <Toaster />
        </LangProvider>
      </body>
    </html>
  );
}
