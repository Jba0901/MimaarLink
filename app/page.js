'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import Reveal from '@/components/Reveal';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { PROJECT_CATEGORIES } from '@/lib/i18n';
import {
  Cpu, GitCompare, MapPin, ArrowRight, ArrowUpRight, Building2,
  Layers, Wrench, Snowflake, HardHat, ClipboardCheck, MoreHorizontal,
  Hammer, ShieldCheck, Mail, Phone, Instagram, CheckCircle2, FileText
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
      <div className="v2-ambient overflow-hidden rounded-[28px] px-1 sm:px-2">
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

              <div className="motion-fade-up motion-delay-3 mt-7 flex flex-col sm:flex-row gap-3">
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

      {/* ============ ROLE SELECTOR ============ */}
      <section className="py-8 lg:py-12">
        <Reveal>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="eyebrow mb-1.5">{t('startEyebrow')}</div>
              <h2 className="display-title text-[22px] sm:text-[28px]">{t('startTitle')}</h2>
            </div>
            <Link href="/start-here" className="hidden sm:inline-flex items-center gap-1 text-[12.5px] font-bold text-[#0B8E7C] tap-highlight">
              {t('seeAll')} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-2.5 lg:grid-cols-3">
          <Reveal>
            <RoleCard href="/post-project" icon={Building2} title={t('startProjectTitle')} desc={t('startProjectDesc')} accent="#0EB59E" Arrow={Arrow} />
          </Reveal>
          <Reveal delay={80}>
            <RoleCard href="/contractor" icon={Hammer} title={t('startContractorTitle')} desc={t('startContractorDesc')} accent="#FFB638" Arrow={Arrow} />
          </Reveal>
          <Reveal delay={160}>
            <RoleCard href="/contractor?type=consultant" icon={ClipboardCheck} title={t('startConsultantTitle')} desc={t('startConsultantDesc')} accent="#142A44" Arrow={Arrow} />
          </Reveal>
        </div>
      </section>

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

function RoleCard({ href, icon: Icon, title, desc, accent, Arrow }) {
  return (
    <Link href={href} className="block h-full cursor-pointer tap-highlight">
      <article
        className="interactive-card group flex h-full min-h-[96px] items-center gap-3 rounded-[22px] border border-border bg-white p-4 shadow-soft hover:border-[#0EB59E]/35 hover:shadow-card lg:min-h-[124px]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-soft transition group-hover:scale-105" style={{ background: accent }}>
          <Arrow />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[18px] font-extrabold leading-tight text-navy lg:text-[19px]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground lg:text-[13px]">{desc}</p>
        </div>
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px]" style={{ background: `${accent}12` }}>
          <Icon className="h-[23px] w-[23px]" style={{ color: accent }} />
        </div>
      </article>
    </Link>
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
