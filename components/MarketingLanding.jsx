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
  tone = 'teal',
}) {
  const { dir, t } = useLang();
  const isRTL = dir === 'rtl';
  const isAmber = tone === 'amber';
  const accentColor = isAmber ? '#FFB638' : '#00B59E';
  const accentSoft = isAmber ? 'rgba(255,182,56,0.14)' : 'rgba(0,181,158,0.10)';
  const Arrow = () =>
    isRTL
      ? <ArrowRight className="h-4 w-4 shrink-0 rotate-180" aria-hidden="true" />
      : <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />;

  const words = (tagline || '').trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : null;

  return (
    <AppShell hideNav wide>
      <div className="v2-ambient -mx-4 sm:-mx-6 px-4 sm:px-6">
        {/* ============ HERO ============ */}
        <section className="relative z-10 pb-8 pt-5 text-center sm:pb-10 sm:pt-6 lg:pb-12 lg:pt-14">
          <div className="max-w-2xl mx-auto">
            {eyebrow && (
              <div
                className="motion-fade-up mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold text-navy sm:mb-5"
                style={{ borderColor: `${accentColor}40`, background: accentSoft }}
              >
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
      <section className="py-7 sm:py-8 lg:py-10">
        <div className="grid sm:grid-cols-3 gap-3.5">
          {benefits.map((b, i) => (
            <Reveal key={i} delay={i * 110}>
              <div className="interactive-card flex h-full items-start gap-3.5 rounded-[22px] border border-border bg-white p-4 shadow-soft sm:block sm:rounded-3xl sm:p-6" style={{ borderInlineStartWidth: 3, borderInlineStartColor: accentColor }}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:mb-4 sm:h-12 sm:w-12" style={{ background: accentSoft }}>
                  <b.icon
                    className={`h-[22px] w-[22px] ${isAmber ? 'text-[#152B54] dark:text-[#FFB638]' : 'text-[#00B59E]'}`}
                    aria-hidden="true"
                  />
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
        <section className="py-7 sm:py-8 lg:py-10">
          <Reveal>
            <h2 className="display-title mb-5 text-center text-[22px] sm:mb-7 sm:text-[26px]">{popularTypesTitle}</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2.5">
              {popularTypes.map((p, i) => (
                <span
                  key={i}
                  className="flex min-h-11 items-center justify-center rounded-2xl border border-border bg-secondary/70 px-3 py-2 text-center text-[12.5px] font-semibold leading-5 text-navy sm:min-h-0 sm:rounded-full sm:px-4 sm:text-[13px]"
                >
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ============ HOW IT WORKS (stepper) ============ */}
      <section className="py-7 sm:py-8 lg:py-10">
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
              <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: '#00B59E' }} aria-hidden="true" />
              <p className="text-[12.5px] text-muted-foreground leading-relaxed text-center">{privacyLine}</p>
            </div>
          </Reveal>
        )}
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-7 sm:py-8 lg:py-12">
        <Reveal>
          <div className="premium-panel glass-line relative overflow-hidden rounded-[24px] px-5 py-8 text-center text-white shadow-card sm:rounded-[28px] sm:px-10 sm:py-12">
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
