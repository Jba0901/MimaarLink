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
      <div className="min-h-[calc(100vh-118px)] px-4 py-8">
        <div className="mx-auto w-full max-w-[448px]">
          <div className="mb-7 text-center motion-fade-up">
            <div className="text-[12px] font-extrabold text-teal">
              {t('startEyebrow')}
            </div>
            <h1 className="mt-3 text-[30px] font-extrabold leading-tight text-navy sm:text-[34px]">{t('startTitle')}</h1>
            <p className="mx-auto mt-3 max-w-[330px] text-[13px] leading-relaxed text-muted-foreground">
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

          <div className="mt-6 text-center motion-fade-up motion-delay-2">
            <p className="mb-2 text-[12.5px] font-medium text-muted-foreground">{t('startHelpTitle')}</p>
            <a
              href="https://wa.me/97466259219"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 text-[13px] font-extrabold text-navy shadow-soft transition hover:border-teal/35 hover:text-teal"
            >
              <WhatsAppIcon className="h-[15px] w-[15px] text-teal" />
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
    <Link href={href} className="block cursor-pointer tap-highlight">
      <article
        className="group interactive-card flex min-h-[96px] items-center gap-3 rounded-[22px] border border-border bg-white p-4 shadow-soft hover:border-[#0EB59E]/35 hover:shadow-card"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-soft transition group-hover:scale-105" style={{ background: accent }}>
          <Arrow />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[18px] font-extrabold leading-tight text-navy">{title}</h2>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>
        </div>
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px]" style={{ background: `${accent}12` }}>
          <Icon className="h-[23px] w-[23px]" style={{ color: accent }} />
        </div>
      </article>
    </Link>
  );
}
