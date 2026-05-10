'use client';
import React from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { Globe, Home, Hammer, FilePlus } from 'lucide-react';

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Taller navy building */}
      <path d="M10 58 V20 L26 8 L26 22 L26 58 Z" fill="none" stroke="#0D1B2A" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="18" y1="22" x2="18" y2="58" stroke="#0D1B2A" strokeWidth="3" strokeLinecap="round" />
      {/* Shorter teal house */}
      <path d="M34 58 V36 L46 26 L58 36 V58" fill="none" stroke="#0EB59E" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function AppShell({ children, hideNav = false }) {
  const { t, lang, setLang } = useLang();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size={32} />
            <span className="font-bold text-navy text-[15px] tracking-tight">{t('appName')}</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <Link href="/contractor" className="hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-full border border-border bg-white/70 hover:bg-white text-navy transition">
              <Hammer className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{t('joinContractor')}</span>
            </Link>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 h-9 rounded-full border border-border bg-white/70 hover:bg-white text-navy transition">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{t('language')}</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full pb-28">
        <div className="max-w-3xl mx-auto px-4 py-3">{children}</div>
      </main>
      {!hideNav && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 safe-pad-bottom">
          <div className="flex items-center gap-1 navy rounded-full px-1.5 py-1.5 shadow-soft border border-white/5">
            <NavBtn href="/" icon={Home} label={t('home')} />
            <NavBtn href="/post-project" icon={FilePlus} label={t('postProject')} />
            <NavBtn href="/contractor" icon={Hammer} label={t('joinContractor')} />
          </div>
        </nav>
      )}
    </div>
  );
}

function NavBtn({ href, icon: Icon, label }) {
  return (
    <Link href={href} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition">
      <Icon className="w-4 h-4" />
      <span className="text-[11.5px] font-semibold tracking-tight whitespace-nowrap">{label}</span>
    </Link>
  );
}
