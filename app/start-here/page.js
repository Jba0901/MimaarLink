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
    <AppShell hideNav hideFooter wide>
      <div className="v2-ambient -mx-4 sm:-mx-6 px-4 sm:px-6 flex min-h-[calc(100vh-130px)] flex-col justify-center py-8">
        <div className="relative z-10 mx-auto w-full max-w-md sm:max-w-3xl lg:max-w-4xl">
          <div className="mb-8 text-center motion-fade-up">
            <div className="eyebrow justify-center mb-3">{t('startEyebrow')}</div>
            <h1 className="display-title text-[30px] sm:text-[36px]">{t('startTitle')}</h1>
            <p className="mx-auto mt-3 max-w-[420px] text-[13.5px] sm:text-[14.5px] leading-relaxed text-muted-foreground">
              {t('startSubtitle')}
            </p>
          </div>

          <div className="grid gap-3 motion-fade-up motion-delay-1 sm:grid-cols-3">
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
              accent="#F5A623"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor?type=consultant"
              icon={ClipboardCheck}
              title={t('startConsultantTitle')}
              desc={t('startConsultantDesc')}
              accent="#142A44"
              Arrow={Arrow}
            />
          </div>

          <div className="mt-7 text-center motion-fade-up motion-delay-2">
            <p className="mb-2.5 text-[12.5px] font-medium text-muted-foreground">{t('startHelpTitle')}</p>
            <a
              href="https://wa.me/97466259219"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline px-5 text-[13px]"
              style={{ minHeight: 44 }}
            >
              <WhatsAppIcon className="h-[15px] w-[15px]" style={{ color: '#0EB59E' }} />
              {t('contactWhatsapp')}
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SimpleChoice({ href, icon: Icon, title, desc, accent, Arrow }) {
  return (
    <Link href={href} className="block h-full cursor-pointer tap-highlight">
      <article className="group interactive-card flex h-full flex-col rounded-[22px] border border-border bg-white p-5 shadow-soft hover:border-[#0EB59E]/35 hover:shadow-card">
        <div className="flex items-center justify-between gap-3">
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px]" style={{ background: `${accent}14` }}>
            <Icon className="h-[23px] w-[23px]" style={{ color: accent }} />
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-soft transition group-hover:scale-105" style={{ background: accent }}>
            <Arrow />
          </span>
        </div>
        <h2 className="mt-4 text-[17px] font-extrabold leading-tight text-navy">{title}</h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>
      </article>
    </Link>
  );
}
