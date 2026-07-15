'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import { useLang } from '@/lib/LangContext';
import { PROJECT_CATEGORIES } from '@/lib/i18n';
import {
  Cpu, GitCompare, MapPin, ArrowRight, ArrowUpRight, Building2,
  Layers, Wrench, Snowflake, HardHat, ClipboardCheck, MoreHorizontal,
  Hammer, ShieldCheck, CheckCircle2, FileText,
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
    isRTL ? <ArrowRight className="btn-arrow w-4 h-4 rotate-180 shrink-0" /> : <ArrowRight className="btn-arrow w-4 h-4 shrink-0" />;

  const words = t('tagline').trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : null;

  return (
    <AppShell hideNav wide bleed>
      {/* ============ HERO ============ */}
      <section className="v2-ambient">
        <div className="container-x relative z-10 pt-10 pb-14 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="motion-fade-up inline-flex items-center gap-1.5 rounded-full border border-[#00B59E]/25 bg-[#00B59E]/8 px-3.5 py-1.5 text-[12.5px] font-bold text-[#0B8E7C] mb-6">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                {t('heroBadge')}
              </div>

              <h1 className="motion-fade-up motion-delay-1 display-title text-[34px] sm:text-[48px] lg:text-[58px]">
                {words.join(' ')}{' '}
                {lastWord && <span className="text-teal">{lastWord}</span>}
              </h1>

              <p className="motion-fade-up motion-delay-2 mt-5 text-[15px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-xl">
                {t('subtitle')}
              </p>

              <div className="motion-fade-up motion-delay-3 mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/post-project" className="btn btn-primary soft-shine glow-teal px-8 text-[15px]" style={{ minHeight: 56 }}>
                  {t('postProject')} <Arrow />
                </Link>
                <Link href="/contractor" className="btn btn-navy px-7 text-[14.5px]" style={{ minHeight: 56 }}>
                  <Hammer className="w-4 h-4 shrink-0" />
                  {t('joinContractor')} <Arrow />
                </Link>
              </div>

              <div className="motion-fade-up motion-delay-4 mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5">
                {[t('benefit_ai'), t('benefit_bids'), t('benefit_local')].map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#00B59E' }} />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* matched-providers visual — desktop only */}
            <div className="hidden lg:block motion-fade-up motion-delay-2 lg:justify-self-end w-full max-w-lg mx-auto lg:mx-0">
              <MatchPreview t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ QATAR MARKET BAND (full-bleed navy) ============ */}
      <MarketBand t={t} />

      {/* ============ PROCESS STEPPER ============ */}
      <section className="py-14 lg:py-20">
        <div className="container-x">
          <Reveal>
            <h2 className="display-title text-[26px] sm:text-[34px] text-center mb-12">{t('howItWorks')}</h2>
          </Reveal>
          <div className="relative mx-auto max-w-5xl">
            <div className="hidden sm:block absolute top-8 inset-x-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
              {[
                { icon: FileText, title: t('step1Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step1Desc') },
                { icon: Cpu, title: t('step2Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step2Desc') },
                { icon: GitCompare, title: t('step3Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step3Desc') },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 110}>
                  <div className="relative text-center px-3">
                    <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-white border border-border shadow-card flex items-center justify-center">
                      <s.icon className="w-7 h-7" style={{ color: '#00B59E' }} />
                      <span className="absolute -top-2 w-6 h-6 rounded-full navy text-white text-[11px] font-bold flex items-center justify-center shadow-soft" style={{ insetInlineEnd: '-8px' }}>
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[17px] font-bold text-navy leading-snug">{s.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground max-w-[260px] mx-auto">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-12 lg:py-16">
        <div className="container-x">
          <Reveal>
            <div className="flex items-end justify-between mb-8 gap-3">
              <h2 className="display-title text-[26px] sm:text-[34px]">{t('serviceCategories')}</h2>
              <Link href="/post-project" className="inline-flex items-center gap-1 text-[13px] font-bold text-[#0B8E7C] shrink-0 tap-highlight">
                {t('seeAll')} <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PROJECT_CATEGORIES.map((c, i) => {
              const Icon = CAT_ICONS[c] || MoreHorizontal;
              return (
                <Reveal key={c} delay={Math.min(i * 60, 360)}>
                  <Link href={`/post-project?category=${c}`} className="block tap-highlight">
                    <div className="interactive-card h-full min-h-[124px] rounded-2xl bg-white border border-border shadow-soft p-5 flex flex-col items-center justify-center gap-3.5 hover:border-[#00B59E]/45">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,181,158,0.10)' }}>
                        <Icon className="w-6 h-6" style={{ color: '#00B59E' }} />
                      </div>
                      <span className="text-[12.5px] font-bold text-navy text-center leading-tight">{t(`cat_${c}`)}</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ WHY MIMAARLINK (tinted band) ============ */}
      <section className="surface-band py-14 lg:py-20">
        <div className="container-x">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-11">
              <h2 className="display-title text-[26px] sm:text-[34px]">{t('whyTitle')}</h2>
              <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{t('whySubtitle')}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BadgeCheck, title: t('why1Title'), desc: t('why1Desc') },
              { icon: Wallet, title: t('why2Title'), desc: t('why2Desc') },
              { icon: Scale, title: t('why3Title'), desc: t('why3Desc') },
              { icon: MapPin, title: t('why4Title'), desc: t('why4Desc') },
            ].map((w, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="interactive-card h-full rounded-[22px] border border-border bg-white p-6 shadow-soft hover:border-[#00B59E]/40">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'rgba(0,181,158,0.10)' }}>
                    <w.icon className="h-[22px] w-[22px]" style={{ color: '#00B59E' }} />
                  </span>
                  <h3 className="mt-5 text-[16px] font-bold text-navy leading-snug">{w.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AUDIENCE — three clear paths ============ */}
      <section className="py-14 lg:py-20">
        <div className="container-x">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-11">
              <div className="eyebrow justify-center mb-3">{t('startEyebrow')}</div>
              <h2 className="display-title text-[26px] sm:text-[34px]">{t('startTitle')}</h2>
              <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{t('startSubtitle')}</p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { href: '/post-project', icon: Building2, eyebrow: t('startProjectEyebrow'), title: t('startProjectTitle'), desc: t('startProjectDesc'), cta: t('startProjectCta'), btn: 'btn-primary', tone: 'teal' },
              { href: '/contractor', icon: Hammer, eyebrow: t('startContractorEyebrow'), title: t('startContractorTitle'), desc: t('startContractorDesc'), cta: t('startContractorCta'), btn: 'btn-amber', tone: 'amber' },
              { href: '/contractor?type=consultant', icon: ClipboardCheck, eyebrow: t('startConsultantEyebrow'), title: t('startConsultantTitle'), desc: t('startConsultantDesc'), cta: t('startConsultantCta'), btn: 'btn-navy', tone: 'navy' },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 100}>
                <article
                  className="group path-card interactive-card card-sheen relative flex h-full flex-col overflow-hidden rounded-[26px] border p-7 shadow-soft hover:shadow-card"
                  data-tone={r.tone}
                  style={{ borderTopWidth: 3, borderTopColor: 'var(--path-accent)' }}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" style={{ background: 'var(--path-accent-soft)', color: 'var(--path-accent)' }}>
                    <r.icon className="h-7 w-7" />
                  </span>
                  <div className="mt-5 text-[12px] font-bold uppercase tracking-wide" style={{ color: 'var(--path-accent)' }}>{r.eyebrow}</div>
                  <h3 className="mt-1.5 text-[22px] font-extrabold leading-tight text-navy">{r.title}</h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{r.desc}</p>
                  <Link href={r.href} className={`btn ${r.btn} mt-6 w-full text-[14px]`} style={{ minHeight: 50 }}>
                    {r.cta} <Arrow />
                  </Link>
                  <r.icon className="absolute bottom-[-22px] w-28 h-28 pointer-events-none select-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" style={{ color: 'var(--path-accent-soft)', insetInlineEnd: '-10px' }} />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <FaqSection t={t} />

      {/* ============ FINAL CTA (teal band) ============ */}
      <section className="launch-cta-band">
        <div className="container-x py-16 lg:py-24 text-center text-white">
          <Reveal>
            <h2 className="text-[28px] sm:text-[40px] font-extrabold leading-tight max-w-2xl mx-auto">{t('projL_finalTitle')}</h2>
            <p className="mt-4 text-[15px] sm:text-[16px] text-white/85 max-w-xl mx-auto">{t('projL_finalSub')}</p>
            <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/post-project" className="btn px-8 text-[15px]" style={{ minHeight: 54, background: '#fff', color: '#0B6E60' }}>
                {t('postProject')} <Arrow />
              </Link>
              <Link href="/contractor" className="btn btn-ghost-light px-7 text-[14px]" style={{ minHeight: 54 }}>
                <Hammer className="w-4 h-4 shrink-0" />
                {t('joinContractor')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </AppShell>
  );
}

function MarketBand({ t }) {
  const stats = [
    { value: t('marketStat1Value'), label: t('marketStat1Label'), icon: Landmark, animate: true },
    { value: '10%+', label: t('marketStat2Label'), icon: TrendingUp, animate: true },
    { value: t('marketVisionValue'), label: t('marketVisionLabel'), icon: ShieldCheck, animate: false },
  ];
  return (
    <section className="premium-panel market-skyline-panel text-white">
      <div className="container-x relative z-10 py-14 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
          <Reveal>
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-[12.5px] font-bold mb-4" style={{ color: '#5EEAD4' }}>
                <Landmark className="h-3.5 w-3.5 shrink-0" />
                {t('contactLocationValue')}
              </div>
              <h2 className="text-[26px] sm:text-[36px] font-extrabold leading-tight">{t('marketTitle')}</h2>
              <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-white/65">{t('marketSubtitle')}</p>
              <p className="mt-5 text-[11.5px] text-white/40">{t('marketSource')}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 130} className="h-full">
                <div className="stat-card card-sheen h-full rounded-2xl p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                    <s.icon className="h-[19px] w-[19px]" style={{ color: '#5EEAD4' }} />
                  </span>
                  {s.animate
                    ? <CountUp value={s.value} className="mt-4 block text-[30px] sm:text-[32px] font-black leading-none text-white" />
                    : <span className="mt-4 block text-[30px] sm:text-[32px] font-black leading-none text-white"><bdi dir="ltr">{s.value}</bdi></span>}
                  <p className="mt-2.5 text-[12px] leading-relaxed text-white/55">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ t }) {
  const items = [1, 2, 3, 4, 5].map((n) => ({ q: t(`faqQ${n}`), a: t(`faqA${n}`) }));
  const [open, setOpen] = useState(0);
  return (
    <section className="py-14 lg:py-20">
      <div className="container-x">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="display-title text-[26px] sm:text-[34px]">{t('faqTitle')}</h2>
            <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{t('faqSubtitle')}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="mx-auto max-w-3xl grid gap-2.5">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className={`rounded-2xl border bg-white shadow-soft transition-colors ${isOpen ? 'border-[#00B59E]/40' : 'border-border'}`}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start tap-highlight sm:px-6 sm:py-5"
                  >
                    <span className="text-[14.5px] font-bold text-navy leading-snug">{it.q}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? 'text-white' : 'text-navy'}`}
                      style={isOpen ? { background: '#00B59E' } : { background: 'rgba(21,43,84,0.06)' }}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-muted-foreground sm:px-6 sm:pb-5">{it.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MatchPreview({ t }) {
  return (
    <div className="float-soft rounded-[24px] bg-white border border-border shadow-lift p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="min-w-0">
          <div className="text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground/70">{t('projectStatus')}</div>
          <div className="truncate text-[15px] font-bold text-navy mt-0.5">{t('status_contractors_invited')}</div>
        </div>
        <span className="pulse-dot flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(0,181,158,0.12)' }}>
          <Cpu className="h-[18px] w-[18px]" style={{ color: '#00B59E' }} />
        </span>
      </div>

      <div className="space-y-2.5">
        <ProviderRow icon={Hammer} title={t('providerTypeContractor')} sub={t('cstatus_verified')} tone="teal" />
        <ProviderRow icon={ClipboardCheck} title={t('providerTypeConsultant')} sub={t('cstatus_verified')} tone="amber" />
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-[#00B59E]/20 bg-[#00B59E]/8 py-3.5 text-[13px] font-bold text-[#0B6E60]">
        <GitCompare className="h-4 w-4 shrink-0" />
        {t('bidComparison')}
      </div>
    </div>
  );
}

function ProviderRow({ icon: Icon, title, sub, tone }) {
  const bg = tone === 'amber' ? 'rgba(255,182,56,0.14)' : 'rgba(0,181,158,0.12)';
  const fg = tone === 'amber' ? '#C8860B' : '#00B59E';
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: bg }}>
        <Icon className="h-[19px] w-[19px]" style={{ color: fg }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-bold text-navy leading-tight truncate">{title}</div>
        <div className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: '#00B59E' }} />
          {sub}
        </div>
      </div>
    </div>
  );
}
