import './brand-tokens.css';
import './globals.css';
import './typography.css';
import { headers } from 'next/headers';
import { LANG_HEADER, resolveLanguage } from '@/lib/language.mjs';
import { LangProvider } from '@/lib/LangContext';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/fonts';

export const metadata = {
  title: 'Mimaary - Contractor and consultant bids in Qatar',
  description: 'Post your project and get matched with suitable Qatar contractors or consultant offices based on scope, activity, and location.',
  icons: {
    icon: [
      { url: '/brand/logo/mimaary-icon.svg?v=2', type: 'image/svg+xml' },
      { url: '/brand/logo/mimaary-icon-512.png?v=2', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: [{ url: '/brand/logo/mimaary-icon-512.png?v=2', type: 'image/png' }],
    apple: [{ url: '/brand/logo/mimaary-icon-180.png?v=2', type: 'image/png', sizes: '180x180' }],
  },
  appleWebApp: { capable: true, title: 'Mimaary', statusBarStyle: 'default' },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F3EC' },
    { media: '(prefers-color-scheme: dark)', color: '#0D1B2A' },
  ],
};

export default function RootLayout({ children }) {
  const initialLang = resolveLanguage(headers().get(LANG_HEADER));
  return (
    <html lang={initialLang} dir={initialLang === 'ar' ? 'rtl' : 'ltr'} className={fontVariables} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(localStorage.getItem('mlTheme')==='dark')document.documentElement.classList.add('dark')}catch(e){}"
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
