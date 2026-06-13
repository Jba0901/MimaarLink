'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { ArrowRight, Building2, ClipboardCheck, Hammer } from 'lucide-react';

export default function StartHerePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () => isRTL ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <AppShell hideNav hideFooter>
      <div className="hero-ambient -mx-4 sm:-mx-6 px-4 sm:px-6 min-h-[calc(100vh-130px)] flex flex-col justify-center">
        <div className="mx-auto w-full max-w-md py-6">
          <div className="text-center mb-7 motion-fade-up">
            <div className="eyebrow justify-center mb-3">{t('startEyebrow')}</div>
            <h1 className="display-title text-[30px] sm:text-[34px]">{t('startTitle')}</h1>
            <p className="mx-auto mt-2.5 max-w-[300px] text-[13.5px] leading-relaxed text-muted-foreground">
              {t('startSubtitle')}
            </p>
          </div>

          <div className="grid gap-3 motion-fade-up motion-delay-1">
            <SimpleChoice
              href="/post-project"
              icon={Building2}
              title={t('startProjectTitle')}
              desc={t('startProjectDesc')}
              accent="#0EB59E"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor"
              icon={Hammer}
              title={t('startContractorTitle')}
              desc={t('startContractorDesc')}
              accent="#FFB638"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor?type=consultant"
              icon={ClipboardCheck}
              title={t('startConsultantTitle')}
              desc={t('startConsultantDesc')}
              cta={t('startConsultantCta')}
              accent="#142A44"
              Arrow={Arrow}
            />
          </div>

          <div className="mt-5 text-center motion-fade-up motion-delay-2">
            <p className="text-[12.5px] font-semibold text-muted-foreground">{t('startHelpTitle')}</p>
            <a
              href="https://wa.me/97466259219"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline mt-2.5 px-5 text-[13px]"
              style={{ minHeight: 42 }}
            >
              <WhatsAppIcon className="h-[15px] w-[15px]" style={{ color: '#0EB59E' }} />
              {t('startWhatsapp')}
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SimpleChoice({ href, icon: Icon, title, desc, accent, Arrow }) {
  return (
    <Link href={href} className="block tap-highlight">
      <article className="interactive-card flex items-center gap-4 rounded-[22px] border border-border bg-white p-4 shadow-soft hover:shadow-card">
        <div className="flex shrink-0 items-center justify-center rounded-2xl" style={{ background: `${accent}16`, width: 52, height: 52 }}>
          <Icon className="h-[22px] w-[22px]" style={{ color: accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[16.5px] font-bold leading-tight text-navy">{title}</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-soft" style={{ background: accent }}>
          <Arrow />
        </span>
      </article>
    </Link>
  );
}
