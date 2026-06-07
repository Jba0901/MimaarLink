'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { ArrowRight, Building2, Hammer, Sparkles, ShieldCheck } from 'lucide-react';

export default function StartHerePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () => (
    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
  );

  return (
    <AppShell hideNav>
      <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-lg flex-col justify-center py-2">
        <section className="overflow-hidden rounded-[28px] premium-panel p-5 text-white shadow-lift motion-fade-up">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold">
              <Sparkles className="h-3 w-3" style={{ color: '#5EEAD4' }} />
              <span>{t('startEyebrow')}</span>
            </div>
            <h1 className="mx-auto mt-4 max-w-sm text-[31px] font-bold leading-tight">{t('startTitle')}</h1>
            <p className="mx-auto mt-2 max-w-[320px] text-[13.5px] leading-relaxed text-white/70">
              {t('startSubtitle')}
            </p>
          </div>

          <div className="my-5 flow-line" />

          <div className="grid gap-3">
            <SimpleChoice
              href="/post-project"
              icon={Building2}
              eyebrow={t('startProjectEyebrow')}
              title={t('startProjectTitle')}
              desc={t('startProjectDesc')}
              meta={t('startProjectMeta')}
              cta={t('startProjectCta')}
              accent="#0EB59E"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor"
              icon={Hammer}
              eyebrow={t('startContractorEyebrow')}
              title={t('startContractorTitle')}
              desc={t('startContractorDesc')}
              meta={t('startContractorMeta')}
              cta={t('startContractorCta')}
              accent="#F5B63D"
              Arrow={Arrow}
            />
          </div>

          <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.065] p-3">
            <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-semibold text-white/70">
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#5EEAD4' }} />
              <span>{t('startTrust1')}</span>
              <span className="text-white/25">·</span>
              <span>{t('startTrust2')}</span>
              <span className="text-white/25">·</span>
              <span>{t('startTrust3')}</span>
            </div>
            <a
              href="https://wa.me/97466259219"
              target="_blank"
              rel="noreferrer"
              className="cta-press tap-highlight flex h-11 items-center justify-center gap-2 rounded-2xl bg-white text-[13px] font-bold text-navy"
            >
              <WhatsAppIcon className="h-4 w-4" style={{ color: '#0EB59E' }} />
              {t('startWhatsapp')}
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function SimpleChoice({ href, icon: Icon, eyebrow, title, desc, meta, cta, accent, Arrow }) {
  return (
    <Link href={href} className="block">
      <article className="interactive-card tap-highlight rounded-[22px] border border-white/[0.12] bg-white/[0.09] p-3.5 transition hover:bg-white/[0.13]">
        <div className="flex items-start gap-3">
          <div className="icon-rise flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-semibold text-white/50">{eyebrow}</p>
            <h2 className="mt-1 text-[18px] font-bold leading-tight text-white">{title}</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-white/70">{desc}</p>
            <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/50">{meta}</p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-soft" style={{ background: accent }}>
            <Arrow />
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white/[0.055] px-3 py-2">
          <span className="text-[11.5px] font-bold text-white/80">{cta}</span>
          <span className="h-1.5 w-16 rounded-full" style={{ background: accent }} />
        </div>
      </article>
    </Link>
  );
}
