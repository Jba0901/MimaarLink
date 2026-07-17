'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { ArrowRight, Building2, ClipboardCheck, Hammer } from 'lucide-react';
import { trackMeta } from '@/lib/marketingAttribution';

export default function StartHerePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () => isRTL ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <AppShell hideNav hideFooter wide>
      <div className="v2-ambient -mx-4 flex min-h-[calc(100svh-120px)] flex-col justify-center px-4 py-5 sm:-mx-6 sm:min-h-[calc(100vh-130px)] sm:px-6 sm:py-8">
        <div className="relative z-10 mx-auto w-full max-w-md sm:max-w-3xl lg:max-w-4xl">
          <div className="mb-5 text-center motion-fade-up sm:mb-8">
            <div className="eyebrow mb-2.5 justify-center sm:mb-3">{t('startEyebrow')}</div>
            <h1 className="display-title text-[30px] sm:text-[36px]">{t('startTitle')}</h1>
            <p className="mx-auto mt-2.5 max-w-[420px] text-[13.5px] leading-relaxed text-muted-foreground sm:mt-3 sm:text-[14.5px]">
              {t('startSubtitle')}
            </p>
          </div>

          <div className="grid gap-2.5 motion-fade-up motion-delay-1 sm:grid-cols-3 sm:gap-3">
            <SimpleChoice
              href="/post-project"
              icon={Building2}
              title={t('startProjectTitle')}
              desc={t('startProjectDesc')}
              tone="teal"
              pathType="project"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor"
              icon={Hammer}
              title={t('startContractorTitle')}
              desc={t('startContractorDesc')}
              tone="amber"
              pathType="contractor"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor?type=consultant"
              icon={ClipboardCheck}
              title={t('startConsultantTitle')}
              desc={t('startConsultantDesc')}
              tone="navy"
              pathType="consultant"
              Arrow={Arrow}
            />
          </div>

          <div className="mt-5 text-center motion-fade-up motion-delay-2 sm:mt-7">
            <p className="mb-2 text-[12.5px] font-medium text-muted-foreground sm:mb-2.5">{t('startHelpTitle')}</p>
            <a
              href="https://wa.me/97466259219"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackMeta('Contact', { contact_method: 'whatsapp' })}
              className="btn btn-outline px-5 text-[13px]"
              style={{ minHeight: 44 }}
            >
              <WhatsAppIcon className="h-[15px] w-[15px]" style={{ color: '#00B59E' }} />
              {t('contactWhatsapp')}
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SimpleChoice({ href, icon: Icon, title, desc, tone, pathType, Arrow }) {
  return (
    <Link
      href={href}
      onClick={() => trackMeta('PathSelected', { path_type: pathType }, { custom: true })}
      className="block h-full cursor-pointer tap-highlight"
    >
      <article
        className="group path-card interactive-card relative flex h-full min-h-[104px] items-center gap-3 rounded-[20px] border p-3.5 shadow-soft hover:border-[#00B59E]/35 hover:shadow-card sm:min-h-0 sm:flex-col sm:items-stretch sm:gap-0 sm:rounded-[22px] sm:p-5"
        data-tone={tone}
      >
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-[52px] sm:w-[52px] sm:rounded-[18px]"
          style={{ background: 'var(--path-accent-soft)', color: 'var(--path-accent)' }}
          aria-hidden="true"
        >
          <Icon className="h-[22px] w-[22px] sm:h-[23px] sm:w-[23px]" />
        </span>
        <div className="min-w-0 flex-1 sm:mt-4">
          <h2 className="text-[16px] font-extrabold leading-tight text-navy sm:text-[17px]">{title}</h2>
          <p className="mt-1 text-[12.5px] leading-5 text-muted-foreground sm:mt-1.5 sm:leading-relaxed">{desc}</p>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-soft transition group-hover:scale-105 sm:absolute sm:top-5"
          style={{ background: 'var(--path-accent)', insetInlineEnd: '1.25rem' }}
          aria-hidden="true"
        >
          <Arrow />
        </span>
      </article>
    </Link>
  );
}
