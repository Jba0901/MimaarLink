'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { ArrowRight, Building2, Hammer } from 'lucide-react';

export default function StartHerePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = () => isRTL ? <ArrowRight className="h-4 w-4 rotate-180" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <AppShell hideNav>
      <div className="mx-auto flex min-h-[calc(100vh-190px)] max-w-md flex-col justify-center py-2">
        <section className="rounded-[28px] border border-border bg-white px-5 pt-6 pb-5 shadow-card motion-fade-up">
          <div className="text-center mb-5">
            <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold text-muted-foreground/80 mb-4">
              {t('startEyebrow')}
            </div>
            <h1 className="text-[28px] font-bold leading-tight text-navy">{t('startTitle')}</h1>
            <p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-relaxed text-muted-foreground">
              {t('startSubtitle')}
            </p>
          </div>

          <div className="grid gap-2.5">
            <SimpleChoice
              href="/post-project"
              icon={Building2}
              title={t('startProjectTitle')}
              desc={t('startProjectDesc')}
              cta={t('startProjectCta')}
              accent="#0EB59E"
              Arrow={Arrow}
            />
            <SimpleChoice
              href="/contractor"
              icon={Hammer}
              title={t('startContractorTitle')}
              desc={t('startContractorDesc')}
              cta={t('startContractorCta')}
              accent="#FFB638"
              Arrow={Arrow}
            />
          </div>

          <div className="mt-4 rounded-2xl bg-background px-4 py-3 text-center">
            <p className="text-[12.5px] font-semibold text-muted-foreground">{t('startHelpTitle')}</p>
            <a
              href="https://wa.me/97466259219"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-1.5 text-[13px] font-bold text-navy hover:text-[#0EB59E] transition-colors"
            >
              <WhatsAppIcon className="h-[15px] w-[15px]" style={{ color: '#0EB59E' }} />
              {t('startWhatsapp')}
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function SimpleChoice({ href, icon: Icon, title, desc, cta, accent, Arrow }) {
  return (
    <Link href={href} className="block">
      <article className="interactive-card tap-highlight flex items-center gap-3.5 rounded-2xl border border-border bg-white p-3.5 shadow-soft hover:shadow-card hover:border-opacity-40 transition-all">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: `${accent}18` }}>
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-bold leading-tight text-navy">{title}</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>
        </div>
        <div className="shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-soft" style={{ background: accent }}>
            <Arrow />
          </span>
        </div>
      </article>
    </Link>
  );
}
