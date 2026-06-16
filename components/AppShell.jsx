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

function BrandText({ size = 17, onDark = false }) {
  const { t, lang } = useLang();
  const first = onDark ? '#FFFFFF' : '#0D1B2A';
  const second = onDark ? '#5EEAD4' : '#0EB59E';
  if (lang === 'ar') {
    const parts = t('appName').split(' ');
    return (
      <span className="font-extrabold leading-tight whitespace-nowrap" style={{ fontSize: size }}>
        <span style={{ color: first }}>{parts[0]}</span>
        {parts[1] && <span style={{ color: second }} className="ms-1">{parts[1]}</span>}
      </span>
    );
  }
  return (
    <span className="font-extrabold leading-tight tracking-tight whitespace-nowrap" style={{ fontSize: size }}>
      <span style={{ color: first }}>Mimaar</span>
      <span style={{ color: second }}>Link</span>
    </span>
  );
}

export default function AppShell({ children, hideNav = false, hideFooter = false, wide = false, bleed = false }) {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const container = wide ? 'max-w-7xl' : 'max-w-3xl';

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-border shadow-soft'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container-x relative h-[58px] sm:h-[68px] flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink tap-highlight">
            <Logo className="h-8 sm:h-10" />
            <BrandText size={17} />
          </Link>

          {/* centered desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <HeaderLink href="/" label={t('home')} />
            <HeaderLink href="/post-project" label={t('postProject')} />
            <HeaderLink href="/contractor" label={t('providerTypeContractor')} />
            <HeaderLink href="/contractor?type=consultant" label={t('providerTypeConsultant')} />
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/post-project" className="hidden md:inline-flex btn btn-primary h-10 px-5 text-[13px]">
              {t('postProject')}
            </Link>
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="btn btn-outline h-10 px-3.5 text-[13px]"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4 shrink-0" />
              {t('language')}
            </button>
          </div>
        </div>
      </header>

      <main className={`flex-1 w-full ${hideNav ? 'pb-10' : 'pb-32 lg:pb-12'}`}>
        {bleed ? (
          children
        ) : (
          <div className={`${container} mx-auto px-4 sm:px-6 lg:px-8 py-4`}>{children}</div>
        )}
        {!hideFooter && <SiteFooter />}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 safe-pad-bottom max-w-[calc(100vw-20px)] lg:hidden">
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

function HeaderLink({ href, label }) {
  const pathname = usePathname();
  const active = pathname === href.split('?')[0] && !href.includes('?');
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors tap-highlight ${
        active ? 'text-navy bg-muted' : 'text-muted-foreground hover:text-navy hover:bg-muted/70'
      }`}
    >
      {label}
    </Link>
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

function SiteFooter() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 premium-panel text-white">
      <div className="container-x py-12 lg:py-14">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <Logo className="h-8" />
              <BrandText size={16} onDark />
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed">{t('subtitle')}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white/70">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#5EEAD4' }} />
              {t('contactLocationValue')}
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wide text-white/40 mb-4">{t('startEyebrow')}</h4>
            <ul className="space-y-2.5 text-[13px] font-semibold text-white/75">
              <li><Link href="/post-project" className="hover:text-white transition-colors">{t('postProject')}</Link></li>
              <li><Link href="/contractor" className="hover:text-white transition-colors">{t('providerTypeContractor')}</Link></li>
              <li><Link href="/contractor?type=consultant" className="hover:text-white transition-colors">{t('providerTypeConsultant')}</Link></li>
              <li><Link href="/start-here" className="hover:text-white transition-colors">{t('startTitle')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wide text-white/40 mb-4">{t('contactTitle')}</h4>
            <div className="flex items-center gap-2.5">
              <FooterIcon href="mailto:MimaarLink@gmail.com" label={t('contactEmail')} icon={Mail} />
              <FooterIcon href="https://wa.me/97466259219" label={t('contactWhatsapp')} icon={WhatsAppIcon} external />
              <FooterIcon href="tel:+97466259219" label={t('contactPhone')} icon={Phone} />
              <FooterIcon href="https://instagram.com/MimaarLink" label={t('contactInstagram')} icon={Instagram} external />
            </div>
          </div>
        </div>

        <div className="mt-11 border-t border-white/10 pt-6 text-center text-[11.5px] font-medium text-white/40">
          &copy; {year} {t('appName')} &middot; {t('allRights')}
        </div>
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#5EEAD4]/50 hover:text-[#5EEAD4] hover:bg-white/10 tap-highlight"
    >
      <Icon className="h-[16px] w-[16px]" />
    </a>
  );
}
