import './globals.css';
import { LangProvider } from '@/lib/LangContext';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'MimarLink — Get 3-5 bids from verified Qatar contractors',
  description: 'Post your project, we review the scope, invite matched contractors, and help you compare bids clearly.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <LangProvider>
          {children}
          <Toaster richColors position="top-center" />
        </LangProvider>
      </body>
    </html>
  );
}
