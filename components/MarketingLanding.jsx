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
              <div className="motion-fade-up mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#00B59E]/25 bg-[#00B59E]/8 px-3 py-1.5 text-[12px] font-bold text-navy">
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
              <Link href={ctaHref} className="btn btn-primary soft-shine w-full px-9 text-[15px] sm:w-auto" style={{ minHeight: 52 }}>
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
              <div className="interactive-card flex h-full items-start gap-4 rounded-3xl border border-border bg-white p-5 shadow-soft sm:block sm:p-6" style={{ borderInlineStartWidth: 3, borderInlineStartColor: '#00B59E' }}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:mb-4 sm:h-12 sm:w-12" style={{ background: 'rgba(0,181,158,0.10)' }}>
                  <b.icon className="w-[22px] h-[22px]" style={{ color: '#00B59E' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15.5px] font-bold leading-snug text-navy sm:text-[16px]">{b.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:mt-1.5">{b.desc}</p>
                </div>
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
                  className="rounded-full border border-border bg-secondary/70 px-4 py-2 text-[13px] font-semibold text-navy"
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
          <div className="grid gap-0 sm:grid-cols-3 sm:gap-3">
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className={`relative flex gap-3.5 px-1 text-start sm:block sm:px-3 sm:text-center ${i < steps.length - 1 ? 'pb-6 sm:pb-0' : ''}`}>
                  {i < steps.length - 1 && <span className="absolute bottom-0 start-7 top-12 w-px bg-border sm:hidden" aria-hidden="true" />}
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-white shadow-card sm:mx-auto sm:h-14 sm:w-14">
                    <span className="text-[17px] font-extrabold text-navy sm:text-[18px]">{i + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1 sm:pt-0">
                    <h3 className="text-[16px] font-bold leading-snug text-navy sm:mt-4">{s.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:mx-auto sm:mt-1.5 sm:max-w-[240px]">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        {privacyLine && (
          <Reveal delay={150}>
            <div className="mt-7 flex items-center justify-center gap-2.5 px-1">
              <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#00B59E' }} />
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
              <p className="mb-7 mt-2.5 text-[14px] text-white/75">{finalSub}</p>
              <Link href={ctaHref} className="btn btn-primary soft-shine w-full px-9 text-[15px] sm:w-auto" style={{ minHeight: 52 }}>
                {ctaLabel} <Arrow />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </AppShell>
  );
}
