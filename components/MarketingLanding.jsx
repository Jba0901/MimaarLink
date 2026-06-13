'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import Reveal from '@/components/Reveal';
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

  const words = (tagline || '').trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : null;

  return (
    <AppShell hideNav wide>
      <div className="v2-ambient -mx-4 sm:-mx-6 px-4 sm:px-6">
        {/* ============ HERO ============ */}
        <section className="relative z-10 pt-6 pb-10 lg:pt-14 lg:pb-12 text-center">
          <div className="max-w-2xl mx-auto">
            {eyebrow && (
              <div className="motion-fade-up inline-flex items-center gap-1.5 rounded-full border border-[#0EB59E]/25 bg-[#0EB59E]/8 px-3 py-1.5 text-[12px] font-bold text-[#0B8E7C] mb-5">
                {eyebrow}
              </div>
            )}
            <h1 className="motion-fade-up motion-delay-1 display-title text-[30px] sm:text-[42px] lg:text-[46px]">
              {words.join(' ')}{' '}
              {lastWord && <span className="text-teal">{lastWord}</span>}
            </h1>
            <p className="motion-fade-up motion-delay-2 mt-4 text-[15px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
              {subtitle}
            </p>
            <div className="motion-fade-up motion-delay-3 mt-7">
              <Link href={ctaHref} className="btn btn-primary soft-shine px-9 text-[15px]" style={{ minHeight: 52 }}>
                {ctaLabel} <Arrow />
              </Link>
              {ctaSubtext && <p className="mt-3 text-[12.5px] text-muted-foreground/80">{ctaSubtext}</p>}
            </div>
          </div>
        </section>
      </div>

      {/* ============ BENEFITS (accent-bordered cards) ============ */}
      <section className="py-8 lg:py-10">
        <div className="grid sm:grid-cols-3 gap-3.5">
          {benefits.map((b, i) => (
            <Reveal key={i} delay={i * 110}>
              <div className="interactive-card h-full bg-white border border-border rounded-3xl p-6 shadow-soft" style={{ borderInlineStartWidth: 3, borderInlineStartColor: '#0EB59E' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(14,181,158,0.10)' }}>
                  <b.icon className="w-[22px] h-[22px]" style={{ color: '#0EB59E' }} />
                </div>
                <h3 className="text-[16px] font-bold text-navy leading-snug">{b.title}</h3>
                <p className="text-[13px] mt-1.5 leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ POPULAR PROJECT TYPES ============ */}
      {popularTypes && popularTypes.length > 0 && (
        <section className="py-8 lg:py-10">
          <Reveal>
            <h2 className="display-title text-[22px] sm:text-[26px] text-center mb-7">{popularTypesTitle}</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
              {popularTypes.map((p, i) => (
                <span
                  key={i}
                  className="text-[13px] font-semibold text-navy bg-white border border-border rounded-full px-4 py-2 shadow-soft transition-colors hover:border-[#0EB59E]/45"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ============ HOW IT WORKS (stepper) ============ */}
      <section className="py-8 lg:py-10">
        <Reveal>
          <h2 className="display-title text-[24px] sm:text-[30px] text-center mb-9">{t('howItWorks')}</h2>
        </Reveal>
        <div className="relative">
          <div className="hidden sm:block absolute top-7 inset-x-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-3">
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className="relative text-center px-3">
                  <div className="relative z-10 mx-auto w-14 h-14 rounded-2xl bg-white border border-border shadow-card flex items-center justify-center">
                    <span className="text-[18px] font-extrabold text-navy">{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-bold text-navy leading-snug">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground max-w-[240px] mx-auto">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        {privacyLine && (
          <Reveal delay={150}>
            <div className="mt-7 flex items-center justify-center gap-2.5 px-1">
              <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#0EB59E' }} />
              <p className="text-[12.5px] text-muted-foreground leading-relaxed text-center">{privacyLine}</p>
            </div>
          </Reveal>
        )}
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-8 lg:py-12">
        <Reveal>
          <div className="rounded-[28px] premium-panel glass-line text-white px-6 py-10 sm:px-10 sm:py-12 shadow-card relative overflow-hidden text-center">
            <div className="relative max-w-xl mx-auto">
              <h3 className="text-[24px] sm:text-[30px] font-extrabold leading-tight">{finalTitle}</h3>
              <p className="text-[14px] text-white/60 mt-2.5 mb-7">{finalSub}</p>
              <Link href={ctaHref} className="btn btn-primary soft-shine px-9 text-[15px]" style={{ minHeight: 52 }}>
                {ctaLabel} <Arrow />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </AppShell>
  );
}
