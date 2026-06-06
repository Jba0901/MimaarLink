'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

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
  const Arrow = () => isRTL ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />;

  return (
    <AppShell hideNav>
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] premium-panel glass-line text-white px-5 pt-6 pb-6 mb-5 shadow-soft motion-fade-up">
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-medium">
            <Sparkles className="w-3 h-3" style={{ color: '#5EEAD4' }} />
            <span>{eyebrow}</span>
          </div>

          <h1 className="mt-4 text-[28px] sm:text-[32px] font-bold leading-[1.15]">
            {tagline}
          </h1>
          <p className="mt-3 text-[14px] text-white/70 leading-relaxed max-w-md">{subtitle}</p>

          <div className="mt-5">
            <Link href={ctaHref}>
              <button className="cta-press tap-highlight w-full h-14 rounded-2xl text-[16px] font-bold flex items-center justify-center gap-2 glow-teal text-white" style={{ background: '#0EB59E' }}>
                {ctaLabel} <Arrow />
              </button>
            </Link>
            {ctaSubtext && (
              <p className="mt-2.5 text-[12px] text-white/65 text-center">{ctaSubtext}</p>
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="grid grid-cols-1 gap-2.5 mb-6 motion-fade-up motion-delay-1">
        {benefits.map((b, i) => (
          <Card key={i} className="interactive-card border border-border shadow-soft">
            <CardContent className="p-4 flex gap-3 items-start">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(14,181,158,0.10)' }}>
                <b.icon className="w-5 h-5" style={{ color: '#0EB59E' }} />
              </div>
              <div>
                <div className="text-[14.5px] font-bold text-navy leading-tight">{b.title}</div>
                <div className="text-[12.5px] mt-1 leading-relaxed text-muted-foreground">{b.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* POPULAR PROJECT TYPES (optional) */}
      {popularTypes && popularTypes.length > 0 && (
        <section className="mb-6 motion-fade-up motion-delay-2">
          <h2 className="text-base font-bold text-navy mb-3">{popularTypesTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {popularTypes.map((p, i) => (
              <span
                key={i}
                className="text-[12.5px] font-semibold text-navy bg-white border border-border rounded-full px-3 py-1.5 shadow-soft"
              >
                {p}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="mb-6 motion-fade-up motion-delay-3">
        <h2 className="text-base font-bold text-navy mb-3">{t('howItWorks')}</h2>
        <div className="relative">
          <div className={`absolute top-3 bottom-3 w-px bg-border ${isRTL ? 'right-[15px]' : 'left-[15px]'}`} />
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="relative flex gap-3 items-start">
                <div className="relative z-10 w-8 h-8 rounded-full navy text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-soft">{i + 1}</div>
                <div className="interactive-card flex-1 bg-white border border-border rounded-2xl px-4 py-3 shadow-soft">
                  <div className="text-[14px] font-bold text-navy">{s.title}</div>
                  <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY / TRUST LINE (optional) */}
      {privacyLine && (
        <div className="mb-4 flex items-start gap-2 px-1">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#0EB59E' }} />
          <p className="text-[12.5px] text-muted-foreground leading-relaxed">{privacyLine}</p>
        </div>
      )}

      {/* FINAL CTA */}
      <section className="mb-3 motion-fade-up motion-delay-4">
        <div className="rounded-[24px] premium-panel-soft text-white p-5 shadow-soft relative overflow-hidden">
          <div className="relative text-center">
            <h3 className="text-[20px] font-bold leading-tight">{finalTitle}</h3>
            <p className="text-[13px] text-white/70 mt-1">{finalSub}</p>
            <Link href={ctaHref}>
              <button className="cta-press tap-highlight w-full mt-4 h-12 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 text-white glow-teal" style={{ background: '#0EB59E' }}>
                {ctaLabel} <Arrow />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
