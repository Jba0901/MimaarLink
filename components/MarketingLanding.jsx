'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Clock3 } from 'lucide-react';

export default function MarketingLanding({
  eyebrow,
  tagline,
  subtitle,
  ctaLabel,
  ctaHref,
  ctaSubtext,
  benefits,
  popularTypesTitle,
  popularTypes,
  steps,
  privacyLine,
  finalTitle,
  finalSub,
}) {
  const { dir, t } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () => (
    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
  );

  return (
    <AppShell hideNav>
      <section className="relative overflow-hidden rounded-[26px] premium-panel glass-line px-5 pb-5 pt-6 text-white shadow-lift motion-fade-up sm:px-7">
        <div className="relative grid gap-5 md:grid-cols-[1.06fr_0.94fr] md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
              <Sparkles className="h-3 w-3" style={{ color: '#5EEAD4' }} />
              <span>{eyebrow}</span>
            </div>

            <h1 className="mt-4 text-[30px] font-bold leading-[1.12] sm:text-[38px]">
              {tagline}
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
              {subtitle}
            </p>

            <div className="mt-5">
              <Link href={ctaHref}>
                <button className="cta-press tap-highlight flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-bold text-white glow-teal" style={{ background: '#0EB59E' }}>
                  {ctaLabel} <Arrow />
                </button>
              </Link>
              {ctaSubtext && (
                <p className="mt-2.5 text-center text-[12px] text-white/70">{ctaSubtext}</p>
              )}
            </div>
          </div>

          <div className="rounded-[22px] border border-white/[0.12] bg-white/[0.075] p-3.5 backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold text-white/50">{t('howItWorks')}</div>
                <div className="text-[14px] font-bold text-white">{ctaLabel}</div>
              </div>
              <span className="pulse-dot float-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <CheckCircle2 className="h-4 w-4" style={{ color: '#5EEAD4' }} />
              </span>
            </div>
            <div className="flow-line mb-3" />
            <div className="grid gap-2">
              {steps.slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="truncate text-[11.5px] font-bold text-white">{s.title}</div>
                    <div className="truncate text-[10.5px] font-semibold text-white/50">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="my-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3 motion-fade-up motion-delay-1">
        {benefits.map((b, i) => (
          <BenefitCard key={i} icon={b.icon} title={b.title} desc={b.desc} />
        ))}
      </section>

      {popularTypes && popularTypes.length > 0 && (
        <section className="mb-6 rounded-[22px] border border-white/80 quiet-panel p-4 shadow-soft motion-fade-up motion-delay-2">
          <h2 className="mb-3 text-base font-bold text-navy">{popularTypesTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {popularTypes.map((p, i) => (
              <span key={i} className="rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[12px] font-bold text-navy shadow-soft">
                {p}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6 rounded-[24px] border border-white/75 surface-card p-4 motion-fade-up motion-delay-3 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-navy">{t('howItWorks')}</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary">
            <Clock3 className="h-5 w-5 text-teal" />
          </div>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {steps.map((s, i) => (
            <ProcessCard key={i} number={i + 1} title={s.title} desc={s.desc} />
          ))}
        </div>
      </section>

      {privacyLine && (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-white/70 bg-white/60 px-3 py-3 shadow-soft">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#0EB59E' }} />
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">{privacyLine}</p>
        </div>
      )}

      <section className="mb-3 motion-fade-up motion-delay-4">
        <div className="relative overflow-hidden rounded-[24px] premium-panel-soft p-5 text-white shadow-lift">
          <div className="relative text-center">
            <h3 className="text-[21px] font-bold leading-tight">{finalTitle}</h3>
            <p className="mt-1 text-[13px] text-white/70">{finalSub}</p>
            <Link href={ctaHref}>
              <button className="cta-press tap-highlight mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white glow-teal" style={{ background: '#0EB59E' }}>
                {ctaLabel} <Arrow />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function BenefitCard({ icon: Icon, title, desc }) {
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

function ProcessCard({ number, title, desc }) {
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
