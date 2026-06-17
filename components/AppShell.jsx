'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/LangContext';
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  FilePlus,
  Globe,
  Hammer,
  Home,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Sparkles,
  Sun,
  Users,
  X,
} from 'lucide-react';
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
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('mlTheme');
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

  const container = wide ? 'max-w-7xl' : 'max-w-3xl';
  const copy = getShellCopy(lang);
  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`site-header sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'is-scrolled backdrop-blur-xl border-b border-border shadow-soft'
            : 'backdrop-blur-xl border-b border-transparent'
        }`}
      >
        <div className="container-x relative h-[58px] sm:h-[68px] flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink tap-highlight">
            <Logo className="h-8 sm:h-10" />
            <BrandText size={17} onDark={isDark} />
          </Link>

          {/* centered desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <HeaderLink href="/" label={t('home')} />
            <HeaderLink href="/start-here" label={t('startEyebrow')} />
            <HeaderLink href="/post-project" label={t('postProject')} />
            <HeaderLink href="/contractor" label={t('providerTypeContractor')} />
            <HeaderLink href="/contractor?type=consultant" label={t('providerTypeConsultant')} />
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle theme={theme} onToggle={toggleTheme} copy={copy} />
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="btn btn-outline h-10 px-3.5 text-[13px]"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4 shrink-0" />
              {t('language')}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="btn btn-outline h-10 w-10 px-0"
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
        onThemeToggle={toggleTheme}
      />

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
          <div className="flex items-center gap-1 bg-white/95 dark:bg-[#0B1624]/95 backdrop-blur-xl rounded-full px-1.5 py-1.5 shadow-lift border border-border">
            <NavBtn href="/" icon={Home} label={t('home')} matches={['/']} />
            <NavBtn href="/post-project" icon={FilePlus} label={t('postProject')} matches={['/post-project', '/for-projects']} />
            <NavBtn href="/contractor" icon={Hammer} label={t('joinContractor')} matches={['/contractor', '/consultant', '/for-contractors']} />
          </div>
        </nav>
      )}
    </div>
  );
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
      themeHint: 'تبديل المظهر',
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
    };
  }
  return {
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    theme: 'Theme',
    lightMode: 'Light mode',
    darkMode: 'Night mode',
    themeHint: 'Toggle theme',
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
  };
}

function ThemeToggle({ theme, onToggle, copy }) {
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="btn btn-outline h-10 w-10 px-0"
      aria-label={isDark ? copy.lightMode : copy.darkMode}
      title={isDark ? copy.lightMode : copy.darkMode}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
    </button>
  );
}

function MenuDrawer({ open, onClose, copy, t, theme, isDark, onThemeToggle }) {
  const pathname = usePathname();
  const [currentSearch, setCurrentSearch] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') setCurrentSearch(window.location.search);
  }, [pathname]);
  const items = [
    { href: '/', label: t('home'), desc: copy.homeDesc, icon: Home },
    { href: '/start-here', label: copy.start, desc: copy.startDesc, icon: Sparkles },
    { href: '/post-project', label: t('postProject'), desc: copy.projectDesc, icon: Building2, accent: 'teal' },
    { href: '/contractor', label: t('providerTypeContractor'), desc: copy.contractorDesc, icon: Hammer, accent: 'amber' },
    { href: '/contractor?type=consultant', label: t('providerTypeConsultant'), desc: copy.consultantDesc, icon: ClipboardList, accent: 'navy' },
    { href: '/for-projects', label: t('startProjectEyebrow'), desc: copy.projectOwnersDesc, icon: Users },
    { href: '/for-contractors', label: t('startContractorEyebrow'), desc: copy.contractorsDesc, icon: CheckCircle2 },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-[#07111D]/35 backdrop-blur-[5px] transition-opacity duration-300 dark:bg-black/60 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label={copy.closeMenu}
        onClick={onClose}
      />
      <aside
        id="site-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={copy.menu}
        className={`absolute top-0 bottom-0 right-0 w-[min(88vw,390px)] overflow-y-auto bg-white dark:bg-[#07111D] text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.24)] border-s border-border transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="min-h-full px-5 py-6 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2.5 min-w-0 tap-highlight">
              <Logo className="h-9" />
              <BrandText size={17} onDark={isDark} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline h-10 w-10 px-0 rounded-full"
              aria-label={copy.closeMenu}
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="mt-7 rounded-[1.25rem] border border-border bg-muted/60 dark:bg-white/[0.04] p-2">
            <button
              type="button"
              onClick={onThemeToggle}
              className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white dark:bg-[#0B1624] border border-border px-4 py-3 text-start shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D0F2EE] text-[#0B8E7C] dark:bg-[#0B8E7C]/25 dark:text-[#5EEAD4]">
                  {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                </span>
                <span>
                  <span className="block text-[13px] font-extrabold text-navy">{copy.theme}</span>
                  <span className="block text-[12px] text-muted-foreground">
                    {theme === 'dark' ? copy.darkMode : copy.lightMode}
                  </span>
                </span>
              </span>
              <span className="text-[12px] font-bold text-teal">{copy.themeHint}</span>
            </button>
          </div>

          <nav className="mt-5 space-y-2.5">
            {items.map((item) => (
              <DrawerItem
                key={item.href}
                item={item}
                active={
                  item.href.includes('?')
                    ? `${pathname}${currentSearch}` === item.href
                    : pathname === item.href
                }
              />
            ))}
          </nav>

          <div className="mt-7 grid grid-cols-2 gap-2.5">
            <Link href="/post-project" className="btn btn-primary h-12 px-4 text-[13px]">
              {copy.primary}
            </Link>
            <Link href="/start-here" className="btn btn-navy h-12 px-4 text-[13px]">
              {copy.secondary}
            </Link>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-[12px] font-extrabold uppercase text-muted-foreground">{copy.social}</p>
            <div className="grid grid-cols-4 gap-2.5">
              <FooterIcon href="mailto:MimaarLink@gmail.com" label={t('contactEmail')} icon={Mail} variant="surface" />
              <FooterIcon href="https://wa.me/97466259219" label={t('contactWhatsapp')} icon={WhatsAppIcon} external variant="surface" />
              <FooterIcon href="tel:+97466259219" label={t('contactPhone')} icon={Phone} variant="surface" />
              <FooterIcon href="https://instagram.com/MimaarLink" label={t('contactInstagram')} icon={Instagram} external variant="surface" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DrawerItem({ item, active }) {
  const Icon = item.icon;
  const accents = {
    teal: 'bg-[#D0F2EE] text-[#0B8E7C] dark:bg-[#0B8E7C]/25 dark:text-[#5EEAD4]',
    amber: 'bg-[#FFF2D7] text-[#9A6100] dark:bg-[#FFB638]/[0.18] dark:text-[#FFCF75]',
    navy: 'bg-[#EEF2F7] text-[#0D1B2A] dark:bg-white/[0.08] dark:text-white',
  };
  const accent = accents[item.accent] || 'bg-muted text-navy dark:bg-white/[0.08] dark:text-white';
  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 rounded-[1.25rem] border px-3.5 py-3.5 transition-all tap-highlight ${
        active
          ? 'border-[#0EB59E]/35 bg-[#D0F2EE]/55 dark:bg-[#0B8E7C]/14 shadow-soft'
          : 'border-border bg-white dark:bg-[#0B1624]/70 hover:-translate-y-0.5 hover:border-[#0EB59E]/35 hover:shadow-card'
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-extrabold text-navy leading-snug">{item.label}</span>
        <span className="mt-0.5 block text-[12px] leading-relaxed text-muted-foreground">{item.desc}</span>
      </span>
      <ArrowUpRight className="h-[18px] w-[18px] shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
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

function FooterIcon({ href, label, icon: Icon, external = false, variant = 'footer' }) {
  const classes = variant === 'surface'
    ? 'border-border bg-white text-navy shadow-soft hover:border-[#0EB59E]/45 hover:text-[#0B8E7C] hover:bg-[#D0F2EE]/45 dark:bg-[#0B1624] dark:text-white/85 dark:hover:text-[#5EEAD4]'
    : 'border-white/15 bg-white/5 text-white/80 hover:border-[#5EEAD4]/50 hover:text-[#5EEAD4] hover:bg-white/10';
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all tap-highlight ${classes}`}
    >
      <Icon className="h-[16px] w-[16px]" />
    </a>
  );
}
