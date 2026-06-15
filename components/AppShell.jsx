'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/LangContext';
import { Globe, Home, Hammer, FilePlus, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';

function Logo({ className = 'h-8 sm:h-9' }) {
  return (
    <img
      src="/logo.png?v=chain"
      alt="MimaarLink"
      className={`${className} w-auto shrink-0`}
      style={{ objectFit: 'contain' }}
    />
  );
}

function BrandText({ size = 17 }) {
  const { t, lang } = useLang();
  if (lang === 'ar') {
    const parts = t('appName').split(' ');
    return (
      <span className="font-extrabold leading-tight whitespace-nowrap" style={{ fontSize: size }}>
        <span style={{ color: '#0D1B2A' }}>{parts[0]}</span>
        {parts[1] && <span style={{ color: '#0EB59E' }} className="ms-1">{parts[1]}</span>}
      </span>
    );
  }
  return (
    <span className="font-extrabold leading-tight tracking-tight whitespace-nowrap" style={{ fontSize: size }}>
      <span style={{ color: '#0D1B2A' }}>Mimaar</span>
      <span style={{ color: '#0EB59E' }}>Link</span>
    </span>
  );
}

export default function AppShell({ children, hideNav = false, hideFooter = false, wide = false }) {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const container = wide ? 'max-w-6xl' : 'max-w-3xl';

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-border shadow-soft'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[58px] sm:h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink tap-highlight">
            <Logo />
            <BrandText size={16} />
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <Link href="/post-project" className="btn btn-primary h-9 px-4 text-[12.5px]">
                {t('postProject')}
              </Link>
              <Link href="/contractor" className="btn btn-outline h-9 px-4 text-[12.5px]">
                <Hammer className="w-3.5 h-3.5 shrink-0" />
                {t('joinContractor')}
              </Link>
            </div>
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="btn btn-outline h-9 px-3 sm:px-3.5 text-[12.5px]"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              {t('language')}
            </button>
          </div>
        </div>
      </header>

      <main className={`flex-1 w-full ${hideNav ? 'pb-10' : 'pb-32'}`}>
        <div className={`${container} mx-auto px-4 sm:px-6 py-4`}>{children}</div>
        {!hideFooter && <SiteFooter wide={wide} />}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 safe-pad-bottom max-w-[calc(100vw-20px)]">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xl rounded-full px-1.5 py-1.5 shadow-lift border border-border">
            <NavBtn href="/" icon={Home} label={t('home')} matches={['/']} />
            <NavBtn href="/post-project" icon={FilePlus} label={t('postProject')} matches={['/post-project', '/for-projects']} />
            <NavBtn href="/contractor" icon={Hammer} label={t('joinContractor')} matches={['/contractor', '/consultant', '/for-contractors']} />
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
      aria-label={label}
      title={label}
      className={
        'flex items-center gap-1.5 py-2 rounded-full transition-all cta-press tap-highlight ' +
        (active
          ? 'text-white shadow-soft px-3.5'
          : 'text-muted-foreground hover:text-navy hover:bg-muted px-3 sm:px-3.5')
      }
      style={active ? { background: 'linear-gradient(180deg, #12C3AA, #0BA890)' } : undefined}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className={`text-[11px] font-bold whitespace-nowrap ${active ? '' : 'hidden sm:inline'}`}>{label}</span>
    </Link>
  );
}

function SiteFooter({ wide = false }) {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className={`${wide ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-4 sm:px-6 mt-12`}>
      <div className="border-t border-border pt-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-2.5">
              <Logo className="h-7" />
              <BrandText size={15} />
            </div>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">{t('subtitle')}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#0EB59E' }} />
              {t('contactLocationValue')}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3">
            <div className="flex items-center gap-2">
              <FooterIcon href="mailto:MimaarLink@gmail.com" label={t('contactEmail')} icon={Mail} />
              <FooterIcon href="https://wa.me/97466259219" label={t('contactWhatsapp')} icon={WhatsAppIcon} external />
              <FooterIcon href="tel:+97466259219" label={t('contactPhone')} icon={Phone} />
              <FooterIcon href="https://instagram.com/MimaarLink" label={t('contactInstagram')} icon={Instagram} external />
            </div>
            <div className="flex items-center gap-4 text-[12px] font-semibold text-muted-foreground">
              <Link href="/post-project" className="hover:text-navy transition-colors">{t('postProject')}</Link>
              <Link href="/contractor" className="hover:text-navy transition-colors">{t('joinContractor')}</Link>
            </div>
          </div>
        </div>
        <p className="mt-7 text-[11.5px] text-muted-foreground/65 font-medium text-center">
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-soft transition-all hover:border-[#0EB59E]/50 hover:text-[#0EB59E] interactive-card tap-highlight"
    >
      <Icon className="h-[15px] w-[15px]" />
    </a>
  );
}
