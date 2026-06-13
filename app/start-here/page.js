'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { ArrowRight, Building2, ClipboardCheck, Hammer, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

export default function StartHerePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () => isRTL ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <AppShell hideNav hideFooter>
      <div className="v2-ambient overflow-hidden rounded-[28px] px-1 min-h-[calc(100vh-118px)]">
        <div className="relative z-10 mx-auto w-full max-w-md py-4">
          <div className="mb-4 motion-fade-up">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal/15 bg-white/75 px-2.5 py-1 text-[11px] font-extrabold text-teal shadow-soft">
              <Sparkles className="h-3.5 w-3.5" />
              {t('startEyebrow')}
            </div>
            <h1 className="display-title mt-3 text-[25px] sm:text-[30px]">{t('startTitle')}</h1>
            <p className="mt-1.5 max-w-[330px] text-[12.5px] leading-relaxed text-muted-foreground">
              {t('startSubtitle')}
            </p>
          </div>

          <div className="grid gap-2.5 motion-fade-up motion-delay-1">
            <SimpleChoice
              href="/post-project"
              icon={Building2}
              eyebrow={t('startProjectEyebrow')}
              title={t('startProjectTitle')}
              desc={t('startProjectDesc')}
              meta={t('startProjectCta')}
              accent="#0EB59E"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor"
              icon={Hammer}
              eyebrow={t('startContractorEyebrow')}
              title={t('startContractorTitle')}
              desc={t('startContractorDesc')}
              meta={t('startContractorCta')}
              accent="#F5A623"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor?type=consultant"
              icon={ClipboardCheck}
              eyebrow={t('startConsultantEyebrow')}
              title={t('startConsultantTitle')}
              desc={t('startConsultantDesc')}
              meta={t('startConsultantCta')}
              accent="#142A44"
              Arrow={Arrow}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 motion-fade-up motion-delay-2">
            <TrustPill icon={ShieldCheck} label={t('startTrust1')} />
            <TrustPill icon={ClipboardCheck} label={t('startTrust2')} />
            <TrustPill icon={MessageCircle} label={t('startTrust3')} />
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-white/85 p-3 shadow-soft motion-fade-up motion-delay-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12.5px] font-extrabold text-navy">{t('startHelpTitle')}</p>
                <p className="mt-0.5 truncate text-[11.5px] font-medium text-muted-foreground">{t('startHelpDesc')}</p>
              </div>
              <a
                href="https://wa.me/97466259219"
                target="_blank"
                rel="noreferrer"
                className="btn btn-soft h-9 shrink-0 px-3 text-[12px]"
              >
                <WhatsAppIcon className="h-[15px] w-[15px]" />
                {t('contactWhatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SimpleChoice({ href, icon: Icon, eyebrow, title, desc, meta, accent, Arrow }) {
  const ctaStyle = accent === '#F5A623'
    ? { background: 'linear-gradient(180deg, #FFC75F, #F5A623)', color: '#4A2D00' }
    : accent === '#142A44'
      ? { background: 'linear-gradient(180deg, #173653, #0D1B2A)', color: '#fff' }
      : { background: 'linear-gradient(180deg, #12C3AA, #0BA890)', color: '#fff' };

  return (
    <Link href={href} className="block cursor-pointer tap-highlight">
      <article
        className="group interactive-card relative overflow-hidden rounded-[20px] border border-border bg-white p-3 shadow-soft hover:border-[#0EB59E]/35 hover:shadow-card"
        style={{ borderInlineStartWidth: 4, borderInlineStartColor: accent }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${accent}14` }}>
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-[10.5px] font-extrabold leading-none" style={{ color: accent }}>{eyebrow}</div>
            <h2 className="truncate text-[15.5px] font-extrabold leading-tight text-navy">{title}</h2>
            <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-muted-foreground">{desc}</p>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-soft transition group-hover:scale-105" style={{ background: accent }}>
            <Arrow />
          </span>
        </div>
        <div className="mt-2 border-t border-border/70 pt-2">
          <span
            className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-[14px] px-3 text-[11.5px] font-extrabold shadow-soft transition group-hover:scale-[1.015]"
            style={ctaStyle}
          >
            {meta} <Arrow />
          </span>
        </div>
      </article>
    </Link>
  );
}

function TrustPill({ icon: Icon, label }) {
  return (
    <div className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-white/75 px-2 text-center shadow-soft">
      <Icon className="h-3.5 w-3.5 text-teal" />
      <span className="text-[10.5px] font-bold leading-tight text-navy">{label}</span>
    </div>
  );
}
