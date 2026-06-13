'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/LangContext';
import { Globe, Home, Hammer, FilePlus, Instagram, Mail, Phone } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';

function Logo({ height = 38 }) {
  return (
    <img
      src="/logo.png?v=chain"
      alt="MimaarLink"
      height={height}
      style={{ height: height, width: 'auto', objectFit: 'contain' }}
    />
  );
}

function BrandText() {
  const { t, lang } = useLang();
  if (lang === 'ar') {
    const parts = t('appName').split(' ');
    return (
      <span className="font-bold text-[17px] leading-none tracking-tight">
        <span style={{ color: '#0D1B2A' }}>{parts[0]}</span>
        {parts[1] && <span style={{ color: '#0EB59E' }} className="ms-1">{parts[1]}</span>}
      </span>
    );
  }
  return (
    <span className="font-bold text-[17px] leading-none tracking-tight">
      <span style={{ color: '#0D1B2A' }}>Mimaar</span>
      <span style={{ color: '#0EB59E' }}>Link</span>
    </span>
  );
}

export default function AppShell({ children, hideNav = false, hideFooter = false }) {
  const { t, lang, setLang } = useLang();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-white/92 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 tap-highlight">
            <Logo height={38} />
            <BrandText />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/contractor"
              className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-full border border-border bg-white hover:bg-secondary/50 text-navy transition-all interactive-card tap-highlight"
            >
              <Hammer className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[12px] font-semibold">{t('joinContractor')}</span>
            </Link>
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 h-8 rounded-full border border-border bg-white hover:bg-secondary/50 text-navy transition-all interactive-card tap-highlight"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[12px] font-semibold">{t('language')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className={`flex-1 w-full ${hideNav ? 'pb-10' : 'pb-36'}`}>
        <div className="max-w-3xl mx-auto px-4 py-4">{children}</div>
        {!hideFooter && <SiteFooter />}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 safe-pad-bottom">
          <div className="flex items-center gap-0.5 navy rounded-full px-1.5 py-1.5 shadow-card border border-white/8 glass-line">
            <NavBtn href="/" icon={Home} label={t('home')} matches={['/']} />
            <NavBtn href="/post-project" icon={FilePlus} label={t('postProject')} matches={['/post-project', '/for-projects']} />
            <NavBtn href="/contractor" icon={Hammer} label={t('joinContractor')} matches={['/contractor', '/for-contractors']} />
          </div>
        </nav>
      )}
    </div>
  );
}

function NavBtn({ href, icon: Icon, label, matches = [] }) {
  const pathname = usePathname();
  const active = matches.some((m) => pathname === m);
  return (
    <Link
      href={href}
      className={
        'flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all cta-press tap-highlight ' +
        (active
          ? 'bg-white text-navy shadow-soft'
          : 'text-white/75 hover:text-white hover:bg-white/10')
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-[11px] font-semibold whitespace-nowrap">{label}</span>
    </Link>
  );
}

function SiteFooter() {
  const { t } = useLang();
  const pathname = usePathname();
  if (pathname === '/') return null;
  const year = new Date().getFullYear();
  return (
    <footer className="max-w-3xl mx-auto px-4 mt-8">
      <div className="border-t border-border pt-5 pb-3 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-2">
          <FooterIcon href="mailto:MimaarLink@gmail.com" label={t('contactEmail')} icon={Mail} />
          <FooterIcon href="https://wa.me/97466259219" label={t('contactWhatsapp')} icon={WhatsAppIcon} external />
          <FooterIcon href="tel:+97466259219" label={t('contactPhone')} icon={Phone} />
          <FooterIcon href="https://instagram.com/MimaarLink" label={t('contactInstagram')} icon={Instagram} external />
        </div>
        <p className="text-[11.5px] text-muted-foreground/65 font-medium">
          &copy; {year} {t('appName')} &middot; {t('allRights')}
        </p>
      </div>
    </footer>
  );
}

function FooterIcon({ href, label, icon: Icon, external = false }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-soft transition-all hover:border-navy/25 hover:text-navy interactive-card tap-highlight"
    >
      <Icon className="h-[15px] w-[15px]" />
    </a>
  );
}
