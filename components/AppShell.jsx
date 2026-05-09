'use client';
import React from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { Globe, Home, Shield, Hammer } from 'lucide-react';

export default function AppShell({ children, hideNav = false }) {
  const { t, lang, setLang } = useLang();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl navy flex items-center justify-center shadow-soft">
              <Hammer className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-navy text-[15px] tracking-tight">{t('appName')}</span>
          </Link>
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 h-9 rounded-full border border-border bg-white/70 hover:bg-white text-navy transition">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{t('language')}</span>
          </button>
        </div>
      </header>
      <main className="flex-1 w-full pb-28">
        <div className="max-w-3xl mx-auto px-4 py-3">{children}</div>
      </main>
      {!hideNav && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 safe-pad-bottom">
          <div className="flex items-center gap-1 navy rounded-full px-1.5 py-1.5 shadow-soft border border-white/5">
            <NavBtn href="/" icon={Home} label={t('home')} />
            <NavBtn href="/contractor" icon={Hammer} label={t('joinContractor')} />
            <NavBtn href="/admin" icon={Shield} label={t('admin')} />
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
