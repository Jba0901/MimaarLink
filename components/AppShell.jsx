'use client';
import React from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/LangContext';
import { Globe, Home, Shield, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppShell({ children, hideNav = false }) {
  const { t, lang, setLang } = useLang();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg navy flex items-center justify-center">
              <Hammer className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-navy text-base tracking-tight">{t('appName')}</span>
          </Link>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="text-navy gap-1.5 h-9">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{t('language')}</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="max-w-3xl mx-auto px-4 py-5">{children}</div>
      </main>
      {!hideNav && (
        <nav className="sticky bottom-0 z-40 bg-white border-t border-border safe-pad-bottom">
          <div className="max-w-3xl mx-auto grid grid-cols-3">
            <Link href="/" className="flex flex-col items-center justify-center py-2.5 text-navy hover:bg-secondary">
              <Home className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{t('home')}</span>
            </Link>
            <Link href="/contractor" className="flex flex-col items-center justify-center py-2.5 text-navy hover:bg-secondary">
              <Hammer className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{t('joinContractor')}</span>
            </Link>
            <Link href="/admin" className="flex flex-col items-center justify-center py-2.5 text-navy hover:bg-secondary">
              <Shield className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{t('admin')}</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
