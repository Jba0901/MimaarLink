'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLang } from '@/lib/LangContext';
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Globe,
  Hammer,
  Home,
  Instagram,
  Mail,
  Menu,
  Moon,
  Phone,
  Sparkles,
  Sun,
  Users,
  X,
} from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import MarketingAttribution from '@/components/MarketingAttribution';
import RouteProgress from '@/components/RouteProgress';

// Official v1.4 logo files (brand/logo). Never retype the wordmark in a font.
function BrandLogo({ onDark = false, priority = false, className = '' }) {
  const { lang } = useLang();
  const script = lang === 'ar' ? 'ar' : 'en';
  const light = `/brand/logo/mimaary-logo-${script}.svg`;
  const dark = `/brand/logo/mimaary-logo-${script}-dark.svg`;
  const width = script === 'ar' ? 315.2 : 389.8;
  const imgProps = { alt: '', width, height: 146.7, decoding: 'async', fetchPriority: priority ? 'high' : undefined };
  return (
    <span className={`brand-logo brand-logo-${script} ${onDark ? 'brand-logo-on-dark' : ''} ${className}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} src={light} className="brand-logo-light" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} src={dark} className="brand-logo-dark" />
    </span>
  );
}

// hideNav is still accepted from older pages; the website no longer has a bottom tab bar (brand v1.5).
export default function AppShell({ children, hideNav = false, hideFooter = false, flushFooter = false, wide = false, bleed = false, overHero = false }) {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();
  const [navigationSearch, setNavigationSearch] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [themeReady, setThemeReady] = useState(false);
  const menuButtonRef = useRef(null);
  const menuCloseButtonRef = useRef(null);
  const menuWasOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let stored;
    try { stored = localStorage.getItem('mlTheme'); } catch {}
    const initial = stored === 'dark' || stored === 'light' ? stored : 'light';
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady || typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('mlTheme', theme); } catch {}
  }, [theme, themeReady]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      menuWasOpenRef.current = true;
      // Finish the opening input event without waiting for a rendered animation frame.
      const focusTimer = window.setTimeout(() => menuCloseButtonRef.current?.focus(), 0);
      return () => window.clearTimeout(focusTimer);
    }

    if (menuWasOpenRef.current) {
      menuWasOpenRef.current = false;
      menuButtonRef.current?.focus();
    }
  }, [menuOpen]);

  const container = wide ? 'max-w-7xl' : 'max-w-3xl';
  const copy = getShellCopy(lang);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  // On the homepage the header shares the navy hero until the page scrolls.
  const onNavy = overHero && !scrolled;

  return (
    <div className="app-viewport flex flex-col">
      <RouteProgress routeKey={`${pathname}?${navigationSearch ?? ''}`} />
      <a
        href="#main-content"
        className="fixed start-4 top-3 z-[120] -translate-y-24 rounded-xl bg-[#152B54] px-4 py-3 text-sm font-bold text-white shadow-lift focus-visible:translate-y-0"
      >
        {copy.skipToContent}
      </a>
      <header
        data-over-hero={onNavy || undefined}
        className={`site-header sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-base ease-brand ${
          scrolled
            ? 'is-scrolled backdrop-blur-xl border-b border-border shadow-soft'
            : 'backdrop-blur-xl border-b border-transparent'
        }`}
      >
        <div className={`container-x relative flex items-center justify-between gap-2 transition-[height] duration-base ease-brand ${scrolled ? 'h-14 sm:h-[60px]' : 'h-16 sm:h-[72px]'}`}>
          <Link href="/" aria-label={t('appName')} className="flex min-h-11 min-w-11 items-center gap-2 rounded-xl sm:gap-2.5 shrink tap-highlight">
            <BrandLogo priority onDark={onNavy} />
          </Link>

          {/* centered desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <HeaderLink href="/" label={t('home')} navigationSearch={navigationSearch} />
            <HeaderLink href="/start-here" label={t('startEyebrow')} navigationSearch={navigationSearch} />
            <HeaderLink href="/post-project" label={copy.projectNav} ariaLabel={t('postProject')} navigationSearch={navigationSearch} />
            <HeaderLink href="/contractor" label={t('providerTypeContractor')} navigationSearch={navigationSearch} />
            <HeaderLink href="/contractor?type=consultant" label={copy.consultantNav} ariaLabel={t('providerTypeConsultant')} navigationSearch={navigationSearch} />
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex">
              <ThemeToggle theme={theme} onToggle={toggleTheme} copy={copy} />
            </span>
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="btn btn-outline h-11 w-11 px-0 text-[13px] min-[360px]:w-auto min-[360px]:px-3.5"
              aria-label={copy.switchLanguage}
              title={copy.switchLanguage}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span className="hidden min-[360px]:inline">{t('language')}</span>
            </button>
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(true)}
              className="btn btn-outline h-11 w-11 px-0"
              aria-label={copy.openMenu}
              aria-expanded={menuOpen}
              aria-controls="site-menu-drawer"
            >
              <Menu className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </div>
      </header>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        copy={copy}
        t={t}
        theme={theme}
        isDark={isDark}
        rtl={lang === 'ar'}
        onThemeToggle={toggleTheme}
        closeButtonRef={menuCloseButtonRef}
        navigationSearch={navigationSearch}
      />

      <main id="main-content" tabIndex={-1} className={`scroll-mt-20 flex-1 w-full ${hideFooter ? 'pb-10' : 'pb-0'}`}>
        <Suspense fallback={null}>
          <NavigationSearchSync onChange={setNavigationSearch} />
          <MarketingAttribution />
        </Suspense>
        {bleed ? (
          children
        ) : (
          <div className={`${container} app-content-x mx-auto py-4`}>{children}</div>
        )}
        {!hideFooter && <SiteFooter flush={flushFooter} />}
      </main>
    </div>
  );
}

// Keep query subscriptions inside a small boundary, not around the visible shell.
function NavigationSearchSync({ onChange }) {
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  useEffect(() => { onChange(search); }, [search, onChange]);
  return null;
}

function isNavigationActive(href, pathname, search) {
  const [targetPath, targetQuery = ''] = href.split('?');
  if (pathname !== targetPath) return false;
  if (targetPath !== '/contractor') return true;
  if (search === null) return false;

  const targetIsConsultant = new URLSearchParams(targetQuery).get('type') === 'consultant';
  const currentIsConsultant = new URLSearchParams(search).get('type') === 'consultant';
  return targetIsConsultant === currentIsConsultant;
}

function getShellCopy(lang) {
  if (lang === 'ar') {
    return {
      menu: 'القائمة',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      theme: 'المظهر',
      lightMode: 'الوضع الفاتح',
      darkMode: 'الوضع الليلي',
      switchToLight: 'التبديل إلى الوضع الفاتح',
      switchToNight: 'التبديل إلى الوضع الليلي',
      start: 'ابدأ هنا',
      startDesc: 'اختر هل لديك مشروع أو تريد الانضمام كمقدم خدمة.',
      homeDesc: 'الصفحة الرئيسية والخدمات.',
      projectDesc: 'أرسل تفاصيل المشروع ليتم مراجعته ومطابقته.',
      contractorDesc: 'انضم كمقاول لاستلام فرص مشاريع مناسبة.',
      consultantDesc: 'انضم كمكتب استشاري لاستلام فرص تصميم وإشراف.',
      projectOwnersDesc: 'شرح مختصر لأصحاب المشاريع.',
      contractorsDesc: 'شرح مختصر للمقاولين.',
      contact: 'تواصل معنا',
      contactDesc: 'واتساب، إنستغرام، البريد، والهاتف.',
      primary: 'انشر مشروعك',
      secondary: 'انضم كمقدم خدمة',
      social: 'قنوات التواصل',
      quickTitle: 'اختر المسار',
      quickSubtitle: 'ابدأ من الخيار الأقرب لك.',
      projectNav: 'مشروع جديد',
      consultantNav: 'مكتب استشاري',
      moreLinks: 'روابط سريعة',
      allPaths: 'كل المسارات',
      appearance: 'المظهر',
      switchLanguage: 'تبديل اللغة',
      skipToContent: 'تجاوز إلى المحتوى الرئيسي',
    };
  }
  return {
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    theme: 'Theme',
    lightMode: 'Light mode',
    darkMode: 'Night mode',
    switchToLight: 'Switch to light',
    switchToNight: 'Switch to night',
    start: 'Start here',
    startDesc: 'Choose whether you have a project or want to join as a provider.',
    homeDesc: 'Homepage and services.',
    projectDesc: 'Send your project details for review and matching.',
    contractorDesc: 'Join as a contractor to receive suitable opportunities.',
    consultantDesc: 'Join as a consultant office for design and supervision opportunities.',
    projectOwnersDesc: 'Short explanation for project owners.',
    contractorsDesc: 'Short explanation for contractors.',
    contact: 'Contact',
    contactDesc: 'WhatsApp, Instagram, email, and phone.',
    primary: 'Post project',
    secondary: 'Join as provider',
    social: 'Contact channels',
    quickTitle: 'Choose your path',
    quickSubtitle: 'Start with the closest option.',
    projectNav: 'New project',
    consultantNav: 'Consultant',
    moreLinks: 'Quick links',
    allPaths: 'All paths',
    appearance: 'Appearance',
    switchLanguage: 'Switch language',
    skipToContent: 'Skip to main content',
  };
}

function ThemeToggle({ theme, onToggle, copy }) {
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="btn btn-outline h-11 w-11 px-0"
      aria-label={isDark ? copy.lightMode : copy.darkMode}
      title={isDark ? copy.lightMode : copy.darkMode}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
    </button>
  );
}

function MenuDrawer({ open, onClose, copy, t, theme, isDark, rtl, onThemeToggle, closeButtonRef, navigationSearch }) {
  const pathname = usePathname();
  const drawerRef = useRef(null);
  const actionItems = [
    { href: '/post-project', label: t('startProjectTitle'), helper: t('startProjectCta'), icon: Building2, accent: 'teal' },
    { href: '/contractor', label: t('startContractorTitle'), helper: t('startContractorCta'), icon: Hammer, accent: 'navy' },
    { href: '/contractor?type=consultant', label: t('startConsultantTitle'), helper: t('startConsultantCta'), icon: ClipboardList, accent: 'navy' },
  ];
  const secondaryItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/start-here', label: copy.allPaths, icon: Sparkles },
    { href: '/for-projects', label: t('startProjectEyebrow'), icon: Users },
    { href: '/for-contractors', label: t('startContractorEyebrow'), icon: CheckCircle2 },
  ];
  const isActive = (href) => isNavigationActive(href, pathname, navigationSearch);
  const keepFocusInDrawer = (event) => {
    if (!open || event.key !== 'Tab') return;
    const focusable = Array.from(drawerRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) || []).filter((element) => !element.hasAttribute('hidden'));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[110] overflow-hidden ${open ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}
      aria-hidden={!open}
      {...(!open ? { inert: '' } : {})}
      onKeyDown={keepFocusInDrawer}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-[#07111D]/45 backdrop-blur-[5px] transition-opacity duration-base ease-brand dark:bg-black/60 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        id="site-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={copy.menu}
        onClick={(event) => {
          if (event.target.closest('a[href]')) onClose();
        }}
        className={`absolute bottom-0 top-0 ${rtl ? 'left-0' : 'right-0'} w-[min(88vw,390px)] overflow-x-hidden overflow-y-auto border-s border-border bg-card text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition-transform duration-base ease-brand ${
          open ? 'translate-x-0' : rtl ? '-translate-x-full' : 'translate-x-full'
        }`}
      >
        <div className="menu-drawer-content min-h-full">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label={t('appName')} className="flex min-h-11 min-w-11 items-center gap-2.5 rounded-xl tap-highlight">
              <BrandLogo />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="btn btn-outline h-11 w-11 shrink-0 px-0"
              aria-label={copy.closeMenu}
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <section className="mt-6">
            <p className="text-[12px] font-semibold text-teal">{t('startEyebrow')}</p>
            <h2 className="mt-1 text-[25px] leading-tight text-navy">{copy.quickTitle}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{copy.quickSubtitle}</p>
          </section>

          <nav className="mt-5 space-y-2.5" aria-label={copy.quickTitle}>
            {actionItems.map((item) => (
              <ActionTile
                key={item.href}
                item={item}
                active={isActive(item.href)}
              />
            ))}
          </nav>

          <div className="mt-6">
            <p className="mb-2.5 text-[12px] font-semibold text-muted-foreground">{copy.moreLinks}</p>
            <div className="grid grid-cols-2 gap-2.5 max-[263px]:grid-cols-1">
              {secondaryItems.map((item) => (
                <SecondaryDrawerLink key={item.href} item={item} active={isActive(item.href)} />
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[12px] border border-border bg-muted/60 dark:bg-white/[0.04] p-2.5">
            <button
              type="button"
              onClick={onThemeToggle}
              className="flex w-full min-w-0 items-center justify-between gap-2.5 rounded-[12px] px-2.5 py-2 text-start transition hover:bg-white dark:hover:bg-white/[0.06]"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF7F4] text-[#152B54] dark:bg-[#009F91]/20 dark:text-[#009F91]">
                  {isDark ? <Sun className="h-[17px] w-[17px]" /> : <Moon className="h-[17px] w-[17px]" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-semibold text-navy">{copy.appearance}</span>
                  <span className="block text-[12px] text-muted-foreground">{theme === 'dark' ? copy.darkMode : copy.lightMode}</span>
                </span>
              </span>
              <span className="hidden shrink-0 whitespace-nowrap text-[12px] font-semibold text-teal min-[360px]:inline">{isDark ? copy.switchToLight : copy.switchToNight}</span>
            </button>

            <div className="mt-2.5 grid grid-cols-2 gap-2 min-[264px]:grid-cols-4 min-[264px]:gap-2.5">
              <ContactIcon href="mailto:mimaary.qa@gmail.com" label={t('contactEmail')} icon={Mail} />
              <ContactIcon href="https://wa.me/97466259219" label={t('contactWhatsapp')} icon={WhatsAppIcon} external />
              <ContactIcon href="tel:+97466259219" label={t('contactPhone')} icon={Phone} />
              <ContactIcon href="https://instagram.com/MimaarLink" label={t('contactInstagram')} icon={Instagram} external />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ActionTile({ item, active }) {
  const Icon = item.icon;
  const accents = {
    teal: {
      icon: 'bg-[#EAF7F4] text-[#152B54] dark:bg-[#009F91]/20 dark:text-[#009F91]',
      active: 'border-[#009F91]/45 bg-[#EAF7F4]/55 dark:bg-[#009F91]/15',
    },
    navy: {
      icon: 'bg-[#F6F8FB] text-[#152B54] dark:bg-white/[0.08] dark:text-white',
      active: 'border-[#152B54]/30 bg-[#F6F8FB] dark:border-white/20 dark:bg-white/[0.08]',
    },
  };
  const accent = accents[item.accent] || accents.teal;
  return (
    <Link
      href={item.href}
      data-tone={item.accent}
      aria-current={active ? 'page' : undefined}
      className={`group flex items-center gap-3 rounded-[12px] border px-3.5 py-3 transition-colors duration-fast ease-brand tap-highlight max-[263px]:gap-2 max-[263px]:px-2.5 ${
        active
          ? `${accent.active} shadow-soft`
          : 'border-border bg-card hover:border-[#009F91]/45'
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full max-[263px]:h-10 max-[263px]:w-10 ${accent.icon}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold text-navy leading-snug">{item.label}</span>
        <span className="mt-0.5 block text-[12px] font-semibold text-muted-foreground">{item.helper}</span>
      </span>
    </Link>
  );
}

function SecondaryDrawerLink({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={`flex min-h-11 items-center gap-2 rounded-[12px] border px-3 py-2.5 text-[12px] font-semibold leading-tight transition-colors duration-fast ease-brand tap-highlight max-[359px]:gap-1 max-[359px]:px-2 ${
        active
          ? 'border-[#009F91]/35 bg-[#EAF7F4]/55 text-navy dark:bg-[#009F91]/15'
          : 'border-border bg-white text-muted-foreground hover:text-navy hover:border-[#009F91]/35 dark:bg-transparent'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0">{item.label}</span>
    </Link>
  );
}

function HeaderLink({ href, label, ariaLabel = label, navigationSearch }) {
  const pathname = usePathname();
  const active = isNavigationActive(href, pathname, navigationSearch);
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      title={ariaLabel}
      className={`relative inline-flex min-h-11 items-center whitespace-nowrap px-3.5 py-2 text-[14px] font-medium transition-colors duration-fast ease-brand tap-highlight ${
        active ? 'text-navy after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:rounded-full after:bg-[#009F91]' : 'text-muted-foreground hover:text-navy'
      }`}
    >
      {label}
    </Link>
  );
}

// Calm navy footer (brand v1.5): text links and written-out contacts, small social icon.
function SiteFooter({ flush = false }) {
  const { t, dir } = useLang();
  const year = new Date().getFullYear();
  const rtl = dir === 'rtl';
  const links = [
    ['/post-project', t('postProject')],
    ['/contractor', t('providerTypeContractor')],
    ['/contractor?type=consultant', t('providerTypeConsultant')],
    ['/start-here', t('startTitle')],
    ['/privacy', t('privacyNotice')],
  ];
  const contacts = [
    [t('contactEmail'), 'mimaary.qa@gmail.com', 'mailto:mimaary.qa@gmail.com'],
    [t('contactWhatsapp'), '+974 6625 9219', 'https://wa.me/97466259219'],
    [t('contactPhone'), '+974 6625 9219', 'tel:+97466259219'],
  ];
  return (
    <footer className={`${flush ? 'mt-0' : 'mt-16'} site-footer premium-panel text-white`}>
      <div className="container-x pb-[max(2rem,env(safe-area-inset-bottom))] pt-12 lg:pt-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo/mimaary-logo-bilingual-dark.svg" alt={t('appName')} width={160} height={69} className="h-auto w-[160px]" decoding="async" />
        <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/70">
          {rtl ? 'للمشاريع والمقاولين والاستشاريين في قطر.' : 'For projects, contractors and consultants in Qatar.'}
          <span className="block text-white/55">{t('contactLocationValue')}</span>
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6" aria-label={t('startEyebrow')}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="inline-flex min-h-11 items-center text-[14px] font-medium text-white/85 transition-colors hover:text-white">{label}</Link>
          ))}
        </nav>

        <div className="mt-6 grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-3">
          {contacts.map(([label, value, href]) => (
            <div key={href}>
              <p className="text-[12px] text-white/55">{label}</p>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="mt-1 inline-flex min-h-11 items-center text-[15px] font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                <bdi dir="ltr">{value}</bdi>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-[12px] leading-relaxed text-white/60">
            &copy; {year} {t('appName')} &middot; {t('allRights')}
            <span className="block">{rtl ? 'منصة معماري الرقمية · سجل تجاري رقم 243332' : 'Mimaary Digital Platform · CR No. 243332'}</span>
          </p>
          <a
            href="https://instagram.com/MimaarLink"
            target="_blank"
            rel="noreferrer"
            aria-label={t('contactInstagram')}
            title={t('contactInstagram')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// Contact buttons in the menu drawer.
function ContactIcon({ href, label, icon: Icon, external = false }) {
  const classes = 'border-border bg-white text-navy hover:border-[#009F91]/45 hover:bg-[#EAF7F4]/45 focus-visible:ring-offset-background dark:bg-transparent dark:text-white/85 dark:hover:text-[#0AC7CE]';
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`cta-press tap-highlight relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-fast ease-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009F91]/50 focus-visible:ring-offset-2 ${classes}`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </a>
  );
}
