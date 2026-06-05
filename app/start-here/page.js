'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Hammer,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function StartHerePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () => isRTL ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <AppShell hideNav>
      <section className="relative overflow-hidden rounded-[28px] navy-deep px-5 pb-6 pt-6 text-white shadow-soft">
        <div className="absolute -top-20 -end-20 h-56 w-56 rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(14,181,158,0.30), transparent 70%)' }} />
        <div className="absolute -bottom-24 -start-24 h-60 w-60 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, rgba(94,234,212,0.12), transparent 70%)' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
            <Sparkles className="h-3 w-3" style={{ color: '#5EEAD4' }} />
            <span>{t('startEyebrow')}</span>
          </div>

          <h1 className="mt-4 text-[30px] font-bold leading-[1.12] tracking-tight sm:text-[34px]">
            {t('startTitle')}
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/70">
            {t('startSubtitle')}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 text-[11.5px] text-white/75">
            <TrustChip icon={ShieldCheck} label={t('startTrust1')} />
            <TrustChip icon={ClipboardList} label={t('startTrust2')} />
            <TrustChip icon={MessageCircle} label={t('startTrust3')} />
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3">
        <ChoiceCard
          href="/post-project"
          icon={Building2}
          eyebrow={t('startProjectEyebrow')}
          title={t('startProjectTitle')}
          desc={t('startProjectDesc')}
          meta={t('startProjectMeta')}
          cta={t('startProjectCta')}
          Arrow={Arrow}
          tone="project"
        />
        <ChoiceCard
          href="/contractor"
          icon={Hammer}
          eyebrow={t('startContractorEyebrow')}
          title={t('startContractorTitle')}
          desc={t('startContractorDesc')}
          meta={t('startContractorMeta')}
          cta={t('startContractorCta')}
          Arrow={Arrow}
          tone="contractor"
        />
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-white p-4 shadow-soft">
        <div className="text-[13.5px] font-bold text-navy">{t('startHelpTitle')}</div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{t('startHelpDesc')}</p>
        <a
          href="https://wa.me/97466259219"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-bold text-white"
          style={{ background: '#0EB59E' }}
        >
          <MessageCircle className="h-4 w-4" />
          {t('startWhatsapp')}
        </a>
      </section>
    </AppShell>
  );
}

function TrustChip({ icon: Icon, label }) {
  return (
    <div className="flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-2 text-center">
      <Icon className="h-4 w-4" style={{ color: '#5EEAD4' }} />
      <span className="leading-tight">{label}</span>
    </div>
  );
}

function ChoiceCard({ href, icon: Icon, eyebrow, title, desc, meta, cta, Arrow, tone }) {
  const accent = tone === 'project' ? '#0EB59E' : '#F5B63D';
  const accentBg = tone === 'project' ? 'rgba(14,181,158,0.10)' : 'rgba(245,182,61,0.14)';

  return (
    <Link href={href} className="group block">
      <article className="rounded-[22px] border border-border bg-white p-4 shadow-soft transition hover:border-navy/25 hover:-translate-y-0.5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: accentBg }}>
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-normal text-muted-foreground">{eyebrow}</div>
            <h2 className="mt-1 text-[19px] font-bold leading-tight text-navy">{title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-3 py-2.5">
          <span className="text-[12px] font-semibold leading-tight text-muted-foreground">{meta}</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold text-white" style={{ background: accent }}>
            {cta} <Arrow />
          </span>
        </div>
      </article>
    </Link>
  );
}
