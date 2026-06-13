'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';

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
  const Arrow = () =>
    isRTL ? <ArrowRight className="w-4 h-4 rotate-180 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />;

  return (
    <AppShell hideNav>
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] premium-panel glass-line text-white px-5 pt-7 pb-6 mb-5 shadow-card motion-fade-up">
        <div className="relative">
          {eyebrow && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 border border-white/12 text-[11px] font-semibold text-white/80 mb-4">
              {eyebrow}
            </div>
          )}
          <h1 className="text-[28px] sm:text-[32px] font-bold leading-[1.18]">{tagline}</h1>
          <p className="mt-3 text-[14px] text-white/68 leading-relaxed max-w-sm">{subtitle}</p>
          <div className="mt-6">
            <Link href={ctaHref}>
              <button
                className="cta-press soft-shine tap-highlight w-full rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 glow-teal text-white"
                style={{ background: '#0DB69E', minHeight: '52px' }}
              >
                {ctaLabel} <Arrow />
              </button>
            </Link>
            {ctaSubtext && (
              <p className="mt-2.5 text-[12px] text-white/55 text-center">{ctaSubtext}</p>
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 motion-fade-up motion-delay-1">
        {benefits.map((b, i) => (
          <div key={i} className="interactive-card bg-white border border-border rounded-2xl p-4 shadow-soft hover:shadow-card flex gap-3 items-start">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(14,181,158,0.10)' }}
            >
              <b.icon className="w-5 h-5" style={{ color: '#0EB59E' }} />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-bold text-navy leading-snug">{b.title}</div>
              <div className="text-[12.5px] mt-1 leading-relaxed text-muted-foreground">{b.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* POPULAR PROJECT TYPES */}
      {popularTypes && popularTypes.length > 0 && (
        <section className="mb-6 motion-fade-up motion-delay-2">
          <h2 className="section-title">{popularTypesTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {popularTypes.map((p, i) => (
              <span
                key={i}
                className="text-[12.5px] font-semibold text-navy bg-white border border-border rounded-full px-3.5 py-1.5 shadow-soft"
              >
                {p}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="mb-6 motion-fade-up motion-delay-3">
        <h2 className="section-title">{t('howItWorks')}</h2>
        <div className="relative">
          <div className={`absolute top-4 bottom-4 w-px bg-border/70 ${isRTL ? 'right-[15px]' : 'left-[15px]'}`} />
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="relative flex gap-3 items-start">
                <div className="relative z-10 w-8 h-8 rounded-full navy text-white flex items-center justify-center text-[12px] font-bold shrink-0 shadow-soft">
                  {i + 1}
                </div>
                <div className="interactive-card flex-1 bg-white border border-border rounded-2xl px-4 py-3.5 shadow-soft">
                  <div className="text-[14px] font-bold text-navy">{s.title}</div>
                  <div className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY / TRUST LINE */}
      {privacyLine && (
        <div className="mb-5 flex items-start gap-2.5 px-1">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#0EB59E' }} />
          <p className="text-[12.5px] text-muted-foreground leading-relaxed">{privacyLine}</p>
        </div>
      )}

      {/* FINAL CTA */}
      <section className="mb-3 motion-fade-up motion-delay-4">
        <div className="rounded-[24px] premium-panel-soft text-white px-5 py-6 shadow-card relative overflow-hidden">
          <div className="relative text-center">
            <h3 className="text-[20px] font-bold leading-tight">{finalTitle}</h3>
            <p className="text-[13px] text-white/60 mt-1 mb-5">{finalSub}</p>
            <Link href={ctaHref}>
              <button
                className="cta-press soft-shine tap-highlight w-full rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 text-white glow-teal"
                style={{ background: '#0DB69E', minHeight: '48px' }}
              >
                {ctaLabel} <Arrow />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
