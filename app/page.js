'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { PROJECT_CATEGORIES } from '@/lib/i18n';
import {
  Cpu,
  GitCompare,
  MapPin as PinIcon,
  ArrowRight,
  ArrowUpRight,
  Wrench,
  Snowflake,
  Plug,
  Droplets,
  Layers,
  HardHat,
  Hammer,
  PaintBucket,
  Square,
  Frame,
  MoreHorizontal,
  Sparkles,
  ShieldCheck,
  Mail,
  Phone,
  Instagram,
  FileText,
  CheckCircle2,
  Clock3,
} from 'lucide-react';

const CAT_ICONS = {
  mep: Wrench,
  hvac: Snowflake,
  electrical: Plug,
  plumbing: Droplets,
  fitout: Layers,
  civil: HardHat,
  maintenance: Wrench,
  joinery: Hammer,
  flooring: Square,
  painting: PaintBucket,
  aluminum: Frame,
  other: MoreHorizontal,
};

export default function HomePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () => (
    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
  );
  const heroBadge = isRTL ? 'مطابقة مقاولين في قطر' : 'Qatar contractor matching';

  return (
    <AppShell hideNav>
      <section className="relative overflow-hidden rounded-[26px] premium-panel glass-line px-5 pb-5 pt-6 text-white shadow-lift motion-fade-up sm:px-7">
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
              <Sparkles className="h-3 w-3" style={{ color: '#5EEAD4' }} />
              <span>{heroBadge}</span>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-white/70 sm:flex">
              <CheckCircle2 className="h-3 w-3" style={{ color: '#5EEAD4' }} />
              <span>{t('benefits')}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1.08fr_0.92fr] md:items-end">
            <div>
              <h1 className="text-[31px] font-bold leading-[1.12] sm:text-[38px]">
                {t('tagline')}
              </h1>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
                {t('subtitle')}
              </p>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-[1fr_0.72fr]">
                <Link href="/post-project" className="block">
                  <button className="cta-press tap-highlight flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-bold text-white glow-teal" style={{ background: '#0EB59E' }}>
                    {t('postProject')} <Arrow />
                  </button>
                </Link>
                <Link href="/contractor" className="block">
                  <button className="cta-press tap-highlight flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 text-[14px] font-bold text-white/90 transition hover:bg-white/15">
                    {t('joinContractor')} <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>

              <div className="assurance-rail mt-4 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 p-1.5">
                <Assurance icon={Sparkles} label={t('benefit_ai')} />
                <Assurance icon={ShieldCheck} label={t('benefit_bids')} />
                <Assurance icon={PinIcon} label={t('benefit_local')} />
              </div>
            </div>

            <HeroFlow t={t} />
          </div>
        </div>
      </section>

      <section className="my-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 motion-fade-up motion-delay-1">
        <ProofCard icon={Cpu} title={t('trustReview')} desc={t('trustReviewDesc')} />
        <ProofCard icon={GitCompare} title={t('trustCompare')} desc={t('trustCompareDesc')} />
        <ProofCard icon={PinIcon} title={t('trustQatar')} desc={t('trustQatarDesc')} />
      </section>

      <section className="mb-6 motion-fade-up motion-delay-2">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-navy">{t('serviceCategories')}</h2>
          <Link href="/post-project" className="inline-flex items-center gap-1 text-[11px] font-bold text-navy/60">
            {t('seeAll')} <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          {PROJECT_CATEGORIES.map((c) => (
            <CategoryTile key={c} category={c} t={t} />
          ))}
        </div>
      </section>

      <section className="mb-7 rounded-[24px] border border-white/75 surface-card p-4 motion-fade-up motion-delay-3 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-navy">{t('howItWorks')}</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{t('benefits')}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary">
            <Clock3 className="h-5 w-5 text-teal" />
          </div>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <TimelineStep key={n} number={n} title={t(`step${n}Title`).replace(/^[\d.\s\u0660-\u0669]+/, '')} desc={t(`step${n}Desc`)} />
          ))}
        </div>
      </section>

      <section className="mb-2 motion-fade-up motion-delay-4">
        <div className="relative overflow-hidden rounded-[24px] premium-panel-soft p-5 text-white shadow-lift">
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
              <Mail className="h-3 w-3" style={{ color: '#5EEAD4' }} />
              <span>{t('contactTitle')}</span>
            </div>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-[22px] font-bold leading-tight">{t('contactTitle')}</h3>
                <p className="mt-1 text-[13px] text-white/70">{t('contactSubtitle')}</p>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:min-w-[310px]">
                <ContactAction href="mailto:MimaarLink@gmail.com" label={t('contactEmail')} icon={Mail} />
                <ContactAction href="https://wa.me/97466259219" label={t('contactWhatsapp')} icon={WhatsAppIcon} external />
                <ContactAction href="tel:+97466259219" label={t('contactPhone')} icon={Phone} />
                <ContactAction href="https://instagram.com/MimaarLink" label={t('contactInstagram')} icon={Instagram} external />
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="pb-1 pt-3 text-center text-[11px] text-muted-foreground">
        {t('poweredBy')} · {new Date().getFullYear()} · {t('allRights')}
      </p>
    </AppShell>
  );
}

function Assurance({ icon: Icon, label }) {
  return (
    <div className="flex min-h-[42px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-white/75">
      <Icon className="h-3.5 w-3.5" style={{ color: '#5EEAD4' }} />
      <span className="text-[10.5px] font-semibold leading-tight">{label}</span>
    </div>
  );
}

function HeroFlow({ t }) {
  return (
    <div className="rounded-[22px] border border-white/[0.12] bg-white/[0.075] p-3.5 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-white/50">{t('projectStatus')}</div>
          <div className="truncate text-[14px] font-bold text-white">{t('bidComparison')}</div>
        </div>
        <span className="pulse-dot float-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
          <CheckCircle2 className="h-4 w-4" style={{ color: '#5EEAD4' }} />
        </span>
      </div>

      <div className="my-3">
        <div className="flow-line" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <PreviewStep icon={FileText} title={t('status_received')} desc={t('projectDetails')} />
        <PreviewStep icon={ShieldCheck} title={t('status_contractors_invited')} desc={t('trustReview')} />
        <PreviewStep icon={GitCompare} title={t('status_bids_received')} desc={t('trustCompare')} active />
      </div>
    </div>
  );
}

function PreviewStep({ icon: Icon, title, desc, active = false }) {
  return (
    <div className={`relative min-w-0 rounded-2xl border px-2.5 py-2.5 text-center ${active ? 'active-glow border-white/25 bg-white/[0.14]' : 'border-white/10 bg-white/[0.055]'}`}>
      <span className={`mx-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-white text-navy' : 'bg-white/10 text-white/80'}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="mt-2 block min-w-0">
        <span className="block truncate text-[10.5px] font-bold text-white">{title}</span>
        <span className="mt-0.5 block truncate text-[9.5px] font-semibold text-white/50">{desc}</span>
      </span>
    </div>
  );
}

function ProofCard({ icon: Icon, title, desc }) {
  return (
    <article className="interactive-card surface-card rounded-[20px] border border-white/80 p-4">
      <div className="icon-rise mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
        <Icon className="h-5 w-5 text-teal" />
      </div>
      <h3 className="text-[14px] font-bold leading-tight text-navy">{title}</h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{desc}</p>
    </article>
  );
}

function CategoryTile({ category, t }) {
  const Icon = CAT_ICONS[category] || MoreHorizontal;
  return (
    <Link href={`/post-project?category=${category}`} className="shrink-0">
      <div className="interactive-card choice-card flex h-[92px] w-[92px] flex-col items-center justify-center gap-2 rounded-[20px] border border-white/80 px-2.5 py-3 shadow-soft">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
          <Icon className="h-5 w-5 text-teal" />
        </span>
        <span className="text-center text-[11px] font-bold leading-tight text-navy">{t(`cat_${category}`)}</span>
      </div>
    </Link>
  );
}

function TimelineStep({ number, title, desc }) {
  return (
    <article className="interactive-card rounded-[18px] border border-border/70 bg-white/72 p-3.5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full navy text-xs font-bold text-white shadow-soft">{number}</span>
        <div className="flow-line-light flex-1" />
      </div>
      <h3 className="text-[14px] font-bold leading-tight text-navy">{title}</h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{desc}</p>
    </article>
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
      className="interactive-card group flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3 text-center text-white/75 transition hover:bg-white/[0.12] hover:text-white"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-white/15">
        <Icon className="h-4 w-4" style={{ color: '#5EEAD4' }} />
      </span>
      <span className="max-w-full break-words text-[10px] font-semibold leading-tight">{label}</span>
    </a>
  );
}
