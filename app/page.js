'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import Reveal from '@/components/Reveal';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { PROJECT_CATEGORIES } from '@/lib/i18n';
import {
  Cpu, GitCompare, MapPin, ArrowRight, ArrowUpRight, Building2,
  Layers, Wrench, Snowflake, HardHat, ClipboardCheck, MoreHorizontal,
  Hammer, ShieldCheck, Mail, Phone, Instagram, CheckCircle2, FileText, Users,
  TrendingUp, Landmark, BadgeCheck, Wallet, Scale, Plus, Minus
} from 'lucide-react';

const CAT_ICONS = {
  fitout: Layers, maintenance: Wrench, mep: Snowflake, civil: HardHat,
  consultancy: ClipboardCheck, other: MoreHorizontal,
};

export default function HomePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () =>
    isRTL ? <ArrowRight className="w-4 h-4 rotate-180 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />;

  // teal-accent the last word of the headline
  const words = t('tagline').trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : null;

  return (
    <AppShell hideNav wide>
      <div className="v2-ambient -mx-4 sm:-mx-6 px-4 sm:px-6">
        {/* ============ HERO ============ */}
        <section className="relative z-10 pt-6 pb-10 lg:pt-14 lg:pb-14">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
            <div>
              <div className="motion-fade-up inline-flex items-center gap-1.5 rounded-full border border-[#0EB59E]/25 bg-[#0EB59E]/8 px-3 py-1.5 text-[12px] font-bold text-[#0B8E7C] mb-5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                {t('heroBadge')}
              </div>

              <h1 className="motion-fade-up motion-delay-1 display-title text-[32px] sm:text-[44px] lg:text-[50px]">
                {words.join(' ')}{' '}
                {lastWord && <span className="text-teal">{lastWord}</span>}
              </h1>

              <p className="motion-fade-up motion-delay-2 mt-4 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed max-w-md">
                {t('subtitle')}
              </p>

              <div className="motion-fade-up motion-delay-3 mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <Link href="/post-project" className="btn btn-primary soft-shine px-7 text-[15px]" style={{ minHeight: 52 }}>
                  {t('postProject')} <Arrow />
                </Link>
                <Link href="/contractor" className="btn btn-outline px-6 text-[14px]" style={{ minHeight: 52 }}>
                  <Hammer className="w-4 h-4 shrink-0" />
                  {t('providerTypeContractor')}
                </Link>
                <Link href="/contractor?type=consultant" className="btn btn-outline px-6 text-[14px]" style={{ minHeight: 52 }}>
                  <ClipboardCheck className="w-4 h-4 shrink-0" />
                  {t('providerTypeConsultant')}
                </Link>
              </div>

              <div className="motion-fade-up motion-delay-4 mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {[t('benefit_ai'), t('benefit_bids'), t('benefit_local')].map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#0EB59E' }} />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* matched-providers visual — desktop only; on mobile it just
                pushes the real content down without adding meaning */}
            <div className="hidden lg:block motion-fade-up motion-delay-2 lg:justify-self-end w-full max-w-md mx-auto lg:mx-0">
              <MatchPreview t={t} />
            </div>
          </div>
        </section>
      </div>

      {/* ============ QATAR MARKET BAND ============ */}
      <MarketBand t={t} />

      {/* ============ PROCESS STEPPER ============ */}
      <section className="py-10 lg:py-14">
        <Reveal>
          <h2 className="display-title text-[24px] sm:text-[30px] text-center mb-9">{t('howItWorks')}</h2>
        </Reveal>
        <div className="relative">
          {/* connector line (desktop) */}
          <div className="hidden sm:block absolute top-7 inset-x-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-3">
            {[
              { icon: FileText, title: t('step1Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step1Desc') },
              { icon: Cpu, title: t('step2Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step2Desc') },
              { icon: GitCompare, title: t('step3Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step3Desc') },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className="relative text-center px-3">
                  <div className="relative z-10 mx-auto w-14 h-14 rounded-2xl bg-white border border-border shadow-card flex items-center justify-center">
                    <s.icon className="w-6 h-6" style={{ color: '#0EB59E' }} />
                    <span className="absolute -top-2 w-6 h-6 rounded-full navy text-white text-[11px] font-bold flex items-center justify-center shadow-soft" style={{ insetInlineEnd: '-8px' }}>
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-bold text-navy leading-snug">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground max-w-[240px] mx-auto">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-10 lg:py-12">
        <Reveal>
          <div className="flex items-end justify-between mb-7 gap-3">
            <h2 className="display-title text-[24px] sm:text-[30px]">{t('serviceCategories')}</h2>
            <Link href="/post-project" className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#0B8E7C] shrink-0 tap-highlight">
              {t('seeAll')} <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PROJECT_CATEGORIES.map((c, i) => {
            const Icon = CAT_ICONS[c] || MoreHorizontal;
            return (
              <Reveal key={c} delay={Math.min(i * 60, 360)}>
                <Link href={`/post-project?category=${c}`} className="block tap-highlight">
                  <div className="interactive-card h-full min-h-[112px] rounded-2xl bg-white border border-border shadow-soft p-4 flex flex-col items-center justify-center gap-3 hover:border-[#0EB59E]/45">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,181,158,0.10)' }}>
                      <Icon className="w-[22px] h-[22px]" style={{ color: '#0EB59E' }} />
                    </div>
                    <span className="text-[12px] font-bold text-navy text-center leading-tight">{t(`cat_${c}`)}</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ WHY MIMAARLINK ============ */}
      <section className="py-10 lg:py-14">
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-9">
            <h2 className="display-title text-[24px] sm:text-[30px]">{t('whyTitle')}</h2>
            <p className="mt-2.5 text-[14px] text-muted-foreground leading-relaxed">{t('whySubtitle')}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: BadgeCheck, title: t('why1Title'), desc: t('why1Desc') },
            { icon: Wallet, title: t('why2Title'), desc: t('why2Desc') },
            { icon: Scale, title: t('why3Title'), desc: t('why3Desc') },
            { icon: MapPin, title: t('why4Title'), desc: t('why4Desc') },
          ].map((w, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="interactive-card h-full rounded-[22px] border border-border bg-white p-5 shadow-soft hover:border-[#0EB59E]/40">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'rgba(14,181,158,0.10)' }}>
                  <w.icon className="h-[21px] w-[21px]" style={{ color: '#0EB59E' }} />
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold text-navy leading-snug">{w.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ AUDIENCE SPLIT ============ */}
      <section className="py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* owners */}
          <Reveal>
            <div className="relative h-full rounded-[26px] border border-[#0EB59E]/20 p-7 sm:p-9 overflow-hidden" style={{ background: 'linear-gradient(150deg, #EAF9F6 0%, #F2FBF9 60%, #FFFFFF 100%)' }}>
              <div className="eyebrow mb-3">{t('startProjectEyebrow')}</div>
              <h3 className="display-title text-[23px] sm:text-[27px]">{t('startProjectTitle')}</h3>
              <p className="mt-2.5 text-[14px] text-muted-foreground leading-relaxed max-w-sm">{t('startProjectDesc')}</p>
              <Link href="/post-project" className="btn btn-primary mt-6 px-6 text-[14px]" style={{ minHeight: 46 }}>
                {t('startProjectCta')} <Arrow />
              </Link>
              <Building2 className="absolute bottom-[-22px] w-32 h-32 pointer-events-none select-none" style={{ color: 'rgba(14,181,158,0.08)', insetInlineEnd: '-10px' }} />
            </div>
          </Reveal>

          {/* providers: contractor + consultant */}
          <Reveal delay={120}>
            <div className="relative h-full rounded-[26px] premium-panel glass-line text-white p-7 sm:p-9 overflow-hidden">
              <div className="inline-flex items-center text-[12px] font-bold mb-3" style={{ color: '#FFD27A' }}>{t('joinContractor')}</div>
              <h3 className="text-[23px] sm:text-[27px] font-extrabold leading-tight">{t('providerJoinTitle')}</h3>
              <p className="mt-2.5 text-[14px] text-white/65 leading-relaxed max-w-sm">{t('providerJoinDesc')}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href="/contractor" className="btn btn-amber px-6 text-[14px]" style={{ minHeight: 46 }}>
                  {t('startContractorCta')} <Arrow />
                </Link>
                <Link
                  href="/contractor?type=consultant"
                  className="btn btn-ghost-light px-6 text-[14px]"
                  style={{ minHeight: 46 }}
                >
                  {t('startConsultantCta')} <Arrow />
                </Link>
              </div>
              <Users className="absolute bottom-[-16px] w-32 h-32 pointer-events-none select-none" style={{ color: 'rgba(255,255,255,0.05)', insetInlineEnd: '-8px' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <FaqSection t={t} />

      {/* ============ CONTACT ============ */}
      <section className="py-10 lg:py-12">
        <Reveal>
          <div className="rounded-[26px] bg-white border border-border shadow-card px-6 py-8 sm:px-9 text-center">
            <h3 className="display-title text-[22px] sm:text-[26px]">{t('contactTitle')}</h3>
            <p className="text-[13.5px] text-muted-foreground mt-1.5 mb-7">{t('contactSubtitle')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto">
              <ContactAction href="mailto:MimaarLink@gmail.com" label={t('contactEmail')} icon={Mail} />
              <ContactAction href="https://wa.me/97466259219" label={t('contactWhatsapp')} icon={WhatsAppIcon} external />
              <ContactAction href="tel:+97466259219" label={t('contactPhone')} icon={Phone} />
              <ContactAction href="https://instagram.com/MimaarLink" label={t('contactInstagram')} icon={Instagram} external />
            </div>
          </div>
        </Reveal>
      </section>
    </AppShell>
  );
}

function MarketBand({ t }) {
  const stats = [
    { value: '$68.7B', label: t('marketStat1Label'), icon: Landmark },
    { value: '34%', label: t('marketStat2Label'), icon: TrendingUp },
    { value: t('marketVisionValue'), label: t('marketVisionLabel'), icon: ShieldCheck },
  ];
  return (
    <section className="py-4 lg:py-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] premium-panel glass-line text-white px-6 py-9 sm:px-10 sm:py-11">
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-bold mb-3" style={{ color: '#5EEAD4' }}>
              <Landmark className="h-3.5 w-3.5 shrink-0" />
              {t('contactLocationValue')}
            </div>
            <h2 className="text-[24px] sm:text-[32px] font-extrabold leading-tight">{t('marketTitle')}</h2>
            <p className="mt-3 text-[13.5px] sm:text-[14.5px] leading-relaxed text-white/65">{t('marketSubtitle')}</p>
          </div>

          <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <s.icon className="h-[18px] w-[18px]" style={{ color: '#5EEAD4' }} />
                </span>
                <span className="mt-4 block text-[30px] font-black leading-none text-white"><bdi dir="ltr">{s.value}</bdi></span>
                <p className="mt-2 text-[12px] leading-relaxed text-white/55">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-5 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
            <span>{t('marketSource')}</span>
            <a
              href="https://oxfordbusinessgroup.com/reports/qatar/2025-report/construction-real-estate/built-to-last-sector-poised-for-continued-growth-fuelled-by-strategic-infrastructure-investment-and-regulatory-reforms-overview/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 px-2.5 py-1 text-white/60 transition hover:border-[#5EEAD4]/40 hover:text-[#5EEAD4]"
            >
              Oxford Business Group
            </a>
            <a
              href="https://www.gco.gov.qa/en/state-of-qatar/qatar-national-vision-2030/our-story/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 px-2.5 py-1 text-white/60 transition hover:border-[#5EEAD4]/40 hover:text-[#5EEAD4]"
            >
              Qatar National Vision 2030
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function FaqSection({ t }) {
  const items = [1, 2, 3, 4, 5].map((n) => ({ q: t(`faqQ${n}`), a: t(`faqA${n}`) }));
  const [open, setOpen] = useState(0);
  return (
    <section className="py-10 lg:py-14">
      <Reveal>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="display-title text-[24px] sm:text-[30px]">{t('faqTitle')}</h2>
          <p className="mt-2.5 text-[14px] text-muted-foreground leading-relaxed">{t('faqSubtitle')}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="mx-auto max-w-2xl grid gap-2.5">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`rounded-2xl border bg-white shadow-soft transition-colors ${isOpen ? 'border-[#0EB59E]/40' : 'border-border'}`}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start tap-highlight"
                >
                  <span className="text-[14px] font-bold text-navy leading-snug">{it.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? 'text-white' : 'text-navy'}`}
                    style={isOpen ? { background: '#0EB59E' } : { background: 'rgba(13,27,42,0.05)' }}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-[13px] leading-relaxed text-muted-foreground">{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function ContactAction({ href, label, icon: Icon, external = false }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="interactive-card group flex min-h-[88px] flex-col items-center justify-center gap-2.5 rounded-2xl border border-border bg-background px-3 py-4 text-center transition hover:border-[#0EB59E]/45 hover:bg-white tap-highlight"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(14,181,158,0.10)' }}>
        <Icon className="h-[17px] w-[17px]" style={{ color: '#0EB59E' }} />
      </span>
      <span className="text-[12px] font-bold text-navy leading-tight">{label}</span>
    </a>
  );
}

function MatchPreview({ t }) {
  return (
    <div className="float-soft rounded-[24px] bg-white border border-border shadow-lift p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground/70">{t('projectStatus')}</div>
          <div className="truncate text-[14px] font-bold text-navy mt-0.5">{t('status_contractors_invited')}</div>
        </div>
        <span className="pulse-dot flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(14,181,158,0.12)' }}>
          <Cpu className="h-4 w-4" style={{ color: '#0EB59E' }} />
        </span>
      </div>

      <div className="space-y-2.5">
        <ProviderRow icon={Hammer} title={t('providerTypeContractor')} sub={t('cstatus_verified')} tone="teal" />
        <ProviderRow icon={ClipboardCheck} title={t('providerTypeConsultant')} sub={t('cstatus_verified')} tone="amber" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[#0EB59E]/20 bg-[#0EB59E]/8 py-3 text-[12.5px] font-bold text-[#0B6E60]">
        <GitCompare className="h-4 w-4 shrink-0" />
        {t('bidComparison')}
      </div>
    </div>
  );
}

function ProviderRow({ icon: Icon, title, sub, tone }) {
  const bg = tone === 'amber' ? 'rgba(255,182,56,0.14)' : 'rgba(14,181,158,0.12)';
  const fg = tone === 'amber' ? '#C8860B' : '#0EB59E';
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-3.5 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: bg }}>
        <Icon className="h-[18px] w-[18px]" style={{ color: fg }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-navy leading-tight truncate">{title}</div>
        <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: '#0EB59E' }} />
          {sub}
        </div>
      </div>
    </div>
  );
}
