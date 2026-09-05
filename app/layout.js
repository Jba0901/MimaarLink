import './globals.css';
import { Cairo, Inter } from 'next/font/google';
import { LangProvider } from '@/lib/LangContext';
import { Toaster } from '@/components/ui/sonner';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-cairo',
});

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'MimaarLink - Contractor and consultant bids in Qatar',
  description: 'Post your project and get matched with suitable Qatar contractors or consultant offices based on scope, activity, and location.',
  icons: {
    icon: [{ url: '/logo.png?v=1', type: 'image/png' }],
    shortcut: [{ url: '/logo.png?v=1', type: 'image/png' }],
    apple: [{ url: '/logo.png?v=1', type: 'image/png' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(localStorage.getItem('mlTheme')==='dark')document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
      </head>
      <body>
        <LangProvider>
          {children}
          <Toaster />
        </LangProvider>
      </body>
    </html>
  );
}
