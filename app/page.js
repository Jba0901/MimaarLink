'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import Reveal from '@/components/Reveal';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { CATEGORIES, PROJECT_CATEGORIES } from '@/lib/i18n';
import {
  Cpu, GitCompare, MapPin, ArrowRight, Building2,
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
  const Arrow = () =>
    isRTL ? <ArrowRight className="w-4 h-4 rotate-180 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />;

  // highlight the last word of the headline in teal
  const words = t('tagline').trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : null;

  return (
    <AppShell hideNav wide>
      <div className="hero-ambient -mx-4 sm:-mx-6 px-4 sm:px-6">
        {/* ============ HERO ============ */}
        <section className="relative pt-8 pb-12 lg:pt-16 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <div className="motion-fade-up inline-flex items-center gap-1.5 rounded-full border border-[#0EB59E]/25 bg-[#0EB59E]/8 px-3 py-1.5 text-[12px] font-bold text-[#0B8E7C] mb-5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {t('contactLocationValue')}
              </div>

              <h1 className="motion-fade-up motion-delay-1 display-title text-[34px] sm:text-[44px] lg:text-[50px]">
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
                <Link href="/contractor" className="btn btn-outline px-7 text-[14px]" style={{ minHeight: 52 }}>
                  <Hammer className="w-4 h-4 shrink-0" />
                  {t('joinContractor')}
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

            {/* product preview card */}
            <div className="motion-fade-up motion-delay-2 lg:justify-self-end w-full max-w-md mx-auto lg:mx-0">
              <WorkflowPreview t={t} />
            </div>
          </div>
        </section>
      </div>

      {/* ============ TRUST ============ */}
      <section className="py-10 lg:py-14">
        <Reveal>
          <h2 className="display-title text-[24px] sm:text-[30px] text-center mb-9">{t('howItWorks')}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-3.5">
          {[
            { icon: FileText, n: 1, title: t('step1Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step1Desc') },
            { icon: Cpu, n: 2, title: t('step2Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step2Desc') },
            { icon: GitCompare, n: 3, title: t('step3Title').replace(/^[\d.\s٠-٩]+/, ''), desc: t('step3Desc') },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 110}>
              <div className="interactive-card relative h-full bg-white border border-border rounded-3xl p-6 shadow-soft overflow-hidden">
                <span className="absolute top-3 text-[64px] font-extrabold leading-none select-none pointer-events-none" style={{ color: 'rgba(13,27,42,0.05)', insetInlineEnd: '1rem' }}>
                  {s.n}
                </span>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(14,181,158,0.10)' }}>
                  <s.icon className="w-[22px] h-[22px]" style={{ color: '#0EB59E' }} />
                </div>
                <h3 className="text-[16px] font-bold text-navy leading-snug">{s.title}</h3>
                <p className="text-[13px] mt-1.5 leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-10 lg:py-14">
        <Reveal>
          <h2 className="display-title text-[24px] sm:text-[30px] text-center mb-9">{t('serviceCategories')}</h2>
        </Reveal>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {CATEGORIES.map((c, i) => {
            const Icon = CAT_ICONS[c] || MoreHorizontal;
            const href = PROJECT_CATEGORIES.includes(c) ? `/post-project?category=${c}` : '/post-project';
            return (
              <Reveal key={c} delay={Math.min(i * 50, 350)}>
                <Link href={href} className="block tap-highlight">
                  <div className="interactive-card h-[104px] rounded-2xl bg-white border border-border shadow-soft px-2 py-3 flex flex-col items-center justify-center gap-2.5 hover:border-[#0EB59E]/45">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,181,158,0.10)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#0EB59E' }} />
                    </div>
                    <span className="text-[11px] font-semibold text-navy text-center leading-tight px-1">{t(`cat_${c}`)}</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ AUDIENCE SPLIT ============ */}
      <section className="py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-4">
          <Reveal>
            <div className="relative h-full rounded-[28px] border border-[#0EB59E]/20 p-7 sm:p-9 overflow-hidden" style={{ background: 'linear-gradient(150deg, #EAF9F6 0%, #F2FBF9 60%, #FFFFFF 100%)' }}>
              <div className="eyebrow mb-3">{t('startProjectEyebrow')}</div>
              <h3 className="display-title text-[24px] sm:text-[28px]">{t('startProjectTitle')}</h3>
              <p className="mt-2.5 text-[14px] text-muted-foreground leading-relaxed max-w-sm">{t('startProjectDesc')}</p>
              <p className="mt-2 text-[12.5px] text-muted-foreground/80 leading-relaxed max-w-sm">{t('startProjectMeta')}</p>
              <Link href="/post-project" className="btn btn-primary mt-6 px-6 text-[14px]" style={{ minHeight: 46 }}>
                {t('startProjectCta')} <Arrow />
              </Link>
              <Building2 className="absolute bottom-[-22px] w-36 h-36 pointer-events-none select-none" style={{ color: 'rgba(14,181,158,0.07)', insetInlineEnd: '-12px' }} />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative h-full rounded-[28px] premium-panel glass-line text-white p-7 sm:p-9 overflow-hidden">
              <div className="inline-flex items-center text-[12px] font-bold mb-3" style={{ color: '#5EEAD4' }}>{t('startContractorEyebrow')}</div>
              <h3 className="text-[24px] sm:text-[28px] font-extrabold leading-tight">{t('startContractorTitle')}</h3>
              <p className="mt-2.5 text-[14px] text-white/65 leading-relaxed max-w-sm">{t('startContractorDesc')}</p>
              <p className="mt-2 text-[12.5px] text-white/45 leading-relaxed max-w-sm">{t('startContractorMeta')}</p>
              <Link href="/contractor" className="btn btn-ghost-light mt-6 px-6 text-[14px]" style={{ minHeight: 46 }}>
                {t('startContractorCta')} <Arrow />
              </Link>
              <Hammer className="absolute bottom-[-18px] w-36 h-36 pointer-events-none select-none" style={{ color: 'rgba(255,255,255,0.05)', insetInlineEnd: '-10px' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="py-10 lg:py-14">
        <Reveal>
          <div className="rounded-[28px] bg-white border border-border shadow-card px-6 py-8 sm:px-9 text-center">
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
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition" style={{ background: 'rgba(14,181,158,0.10)' }}>
        <Icon className="h-[17px] w-[17px]" style={{ color: '#0EB59E' }} />
      </span>
      <span className="text-[12px] font-bold text-navy leading-tight">{label}</span>
    </a>
  );
}

function WorkflowPreview({ t }) {
  return (
    <div className="float-soft rounded-[26px] premium-panel glass-line text-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-white/40">{t('projectStatus')}</div>
          <div className="truncate text-[14px] font-bold text-white mt-0.5">{t('bidComparison')}</div>
        </div>
        <span className="pulse-dot flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
          <CheckCircle2 className="h-4 w-4" style={{ color: '#5EEAD4' }} />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <PreviewStep icon={FileText} title={t('status_received')} />
        <PreviewStep icon={ShieldCheck} title={t('status_contractors_invited')} />
        <PreviewStep icon={GitCompare} title={t('status_bids_received')} active />
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.05] px-3.5 py-3">
        <p className="text-[11.5px] leading-relaxed text-white/70">{t('msg_bids_received')}</p>
      </div>
      <div aria-hidden="true" className="mt-2.5 flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 py-2.5 text-[12.5px] font-bold text-white/85 select-none pointer-events-none">
        <GitCompare className="h-3.5 w-3.5" style={{ color: '#5EEAD4' }} />
        {t('viewBids')}
      </div>
    </div>
  );
}

function PreviewStep({ icon: Icon, title, active = false }) {
  return (
    <div className={`relative flex min-w-0 flex-col items-center rounded-xl border px-1.5 py-3 text-center ${active ? 'active-glow border-white/22 bg-white/[0.13]' : 'border-white/8 bg-white/[0.045]'}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-white text-navy' : 'bg-white/10 text-white/75'}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="mt-2 block w-full text-[10px] font-bold text-white leading-snug">{title}</span>
    </div>
  );
}
