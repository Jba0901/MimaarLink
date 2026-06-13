'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { PROJECT_CATEGORIES } from '@/lib/i18n';
import {
  Cpu, GitCompare, MapPin as PinIcon, ArrowRight, ArrowUpRight,
  Wrench, Snowflake, Plug, Droplets, Layers, HardHat, Hammer,
  PaintBucket, Square, Frame, MoreHorizontal, ShieldCheck, Mail, Phone, Instagram,
  FileText, CheckCircle2
} from 'lucide-react';

const CAT_ICONS = {
  mep: Wrench, hvac: Snowflake, electrical: Plug, plumbing: Droplets, fitout: Layers,
  civil: HardHat, maintenance: Wrench, joinery: Hammer, flooring: Square,
  painting: PaintBucket, aluminum: Frame, other: MoreHorizontal,
};

export default function HomePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = isRTL
    ? () => <ArrowRight className="w-4 h-4 rotate-180 shrink-0" />
    : () => <ArrowRight className="w-4 h-4 shrink-0" />;

  return (
    <AppShell hideNav>
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] premium-panel glass-line text-white px-5 pt-7 pb-6 mb-5 shadow-card motion-fade-up">
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/12 text-[11px] font-semibold text-white/80 mb-4">
            <PinIcon className="w-3 h-3 shrink-0" style={{ color: '#5EEAD4' }} />
            <span>Qatar · {new Date().getFullYear()}</span>
          </div>

          <h1 className="text-[28px] sm:text-[32px] font-bold leading-[1.18]">
            {t('tagline')}
          </h1>
          <p className="mt-3 text-[14px] text-white/68 leading-relaxed max-w-sm">{t('subtitle')}</p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link href="/post-project">
              <button className="cta-press soft-shine tap-highlight w-full h-13 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 glow-teal text-white" style={{ background: '#0DB69E', minHeight: '52px' }}>
                {t('postProject')} <Arrow />
              </button>
            </Link>
            <Link href="/contractor">
              <button className="cta-press tap-highlight flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 text-[14px] font-semibold text-white/88 transition hover:bg-white/14" style={{ minHeight: '44px' }}>
                {t('joinContractor')} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            </Link>
          </div>

          <WorkflowPreview t={t} />
        </div>
      </section>

      {/* TRUST — bento cards */}
      <section className="grid grid-cols-2 gap-2.5 mb-5 motion-fade-up motion-delay-1">
        <BentoCard icon={Cpu} title={t('trustReview')} desc={t('trustReviewDesc')} big />
        <BentoCard icon={GitCompare} title={t('trustCompare')} desc={t('trustCompareDesc')} />
        <BentoCard icon={PinIcon} title={t('trustQatar')} desc={t('trustQatarDesc')} />
      </section>

      {/* CATEGORIES — horizontal scroll */}
      <section className="mb-6 -mx-4 motion-fade-up motion-delay-2">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="section-title mb-0">{t('serviceCategories')}</h2>
          <Link href="/post-project" className="text-[11.5px] text-navy/55 font-semibold flex items-center gap-0.5 hover:text-navy transition-colors">
            {t('seeAll')} <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1.5">
          {PROJECT_CATEGORIES.map((c) => {
            const Icon = CAT_ICONS[c] || MoreHorizontal;
            return (
              <Link key={c} href={`/post-project?category=${c}`} className="shrink-0">
                <div className="interactive-card w-[86px] h-[96px] rounded-2xl bg-white border border-border shadow-soft px-2 py-3 flex flex-col items-center justify-center gap-2 hover:border-[#0EB59E]/40 hover:shadow-card">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,181,158,0.10)' }}>
                    <Icon className="w-[18px] h-[18px]" style={{ color: '#0EB59E' }} />
                  </div>
                  <span className="text-[10.5px] font-semibold text-navy text-center leading-tight">{t(`cat_${c}`)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mb-8 motion-fade-up motion-delay-3">
        <h2 className="section-title">{t('howItWorks')}</h2>
        <div className="relative">
          <div className={`absolute top-4 bottom-4 w-px bg-border/70 ${isRTL ? 'right-[15px]' : 'left-[15px]'}`} />
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="relative flex gap-3 items-start">
                <div className="relative z-10 w-8 h-8 rounded-full navy text-white flex items-center justify-center text-[12px] font-bold shrink-0 shadow-soft">
                  {n}
                </div>
                <div className="interactive-card flex-1 bg-white border border-border rounded-2xl px-4 py-3.5 shadow-soft">
                  <div className="text-[14px] font-bold text-navy">{t(`step${n}Title`).replace(/^[\d.\s٠-٩]+/, '')}</div>
                  <div className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">{t(`step${n}Desc`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mb-3 motion-fade-up motion-delay-4">
        <div className="rounded-[24px] premium-panel-soft text-white px-5 py-6 shadow-card relative overflow-hidden">
          <div className="relative">
            <h3 className="text-[19px] font-bold leading-tight">{t('contactTitle')}</h3>
            <p className="text-[13px] text-white/60 mt-1 mb-5">{t('contactSubtitle')}</p>
            <div className="grid grid-cols-4 gap-2">
              <ContactAction href="mailto:MimaarLink@gmail.com" label={t('contactEmail')} icon={Mail} />
              <ContactAction href="https://wa.me/97466259219" label={t('contactWhatsapp')} icon={WhatsAppIcon} external />
              <ContactAction href="tel:+97466259219" label={t('contactPhone')} icon={Phone} />
              <ContactAction href="https://instagram.com/MimaarLink" label={t('contactInstagram')} icon={Instagram} external />
            </div>
          </div>
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground/60 text-center pt-3 pb-1 font-medium">
        &copy; {new Date().getFullYear()} {t('appName')} · {t('allRights')}
      </p>
    </AppShell>
  );
}

function BentoCard({ icon: Icon, title, desc, big = false }) {
  return (
    <div className={`interactive-card ${big ? 'col-span-2' : ''} bg-white border border-border rounded-2xl p-4 shadow-soft hover:shadow-card`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(14,181,158,0.10)' }}>
        <Icon className="w-5 h-5" style={{ color: '#0EB59E' }} />
      </div>
      <div className="text-[13.5px] font-bold text-navy leading-snug">{title}</div>
      <div className="text-[12px] mt-1 leading-relaxed text-muted-foreground">{desc}</div>
    </div>
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
      className="interactive-card group flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-2 py-3 text-center transition hover:bg-white/12"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-white/18">
        <Icon className="h-[15px] w-[15px]" style={{ color: '#5EEAD4' }} />
      </span>
      <span className="max-w-full break-words text-[10.5px] font-semibold text-white/72 leading-tight group-hover:text-white/90">{label}</span>
    </a>
  );
}

function WorkflowPreview({ t }) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.065] p-3.5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-white/40">{t('projectStatus')}</div>
          <div className="truncate text-[13px] font-bold text-white mt-0.5">{t('bidComparison')}</div>
        </div>
        <span className="pulse-dot float-soft flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
          <CheckCircle2 className="h-4 w-4" style={{ color: '#5EEAD4' }} />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <PreviewStep icon={FileText} title={t('status_received')} desc={t('projectDetails')} />
        <PreviewStep icon={ShieldCheck} title={t('status_contractors_invited')} desc={t('trustReview')} />
        <PreviewStep icon={GitCompare} title={t('status_bids_received')} desc={t('trustCompare')} active />
      </div>
    </div>
  );
}

function PreviewStep({ icon: Icon, title, desc, active = false }) {
  return (
    <div className={`relative min-w-0 rounded-xl border px-2 py-2.5 text-center ${active ? 'active-glow border-white/22 bg-white/[0.13]' : 'border-white/8 bg-white/[0.045]'}`}>
      <span className={`mx-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-white text-navy' : 'bg-white/10 text-white/75'}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="mt-2 block min-w-0">
        <span className="block truncate text-[10px] font-bold text-white leading-tight">{title}</span>
        <span className="mt-0.5 block truncate text-[9px] font-semibold text-white/45">{desc}</span>
      </span>
    </div>
  );
}
