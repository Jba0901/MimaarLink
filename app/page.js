'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { CATEGORIES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, GitCompare, Handshake, ArrowRight, Wrench, Snowflake, Plug, Droplets, Layers, HardHat, Hammer, PaintBucket, Square, Frame, MoreHorizontal } from 'lucide-react';

const CAT_ICONS = {
  mep: Wrench, hvac: Snowflake, electrical: Plug, plumbing: Droplets, fitout: Layers,
  civil: HardHat, joinery: Hammer, flooring: Square, painting: PaintBucket, aluminum: Frame, other: MoreHorizontal,
};

export default function HomePage() {
  const { t, dir } = useLang();
  const Arrow = dir === 'rtl' ? () => <ArrowRight className="w-4 h-4 rotate-180" /> : () => <ArrowRight className="w-4 h-4" />;

  return (
    <AppShell>
      <section className="pt-2 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal/10 text-teal text-[11px] font-medium mb-3" style={{ background: 'rgba(15,174,150,0.1)', color: '#0FAE96' }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Qatar · verified contractors</span>
        </div>
        <h1 className="text-[26px] sm:text-3xl font-bold text-navy leading-[1.2] tracking-tight">
          {t('tagline')}
        </h1>
        <p className="mt-2.5 text-[15px] text-muted-foreground leading-relaxed">{t('subtitle')}</p>

        <div className="mt-5 grid gap-2.5">
          <Link href="/post-project">
            <Button className="w-full h-12 text-base font-semibold shadow-sm" style={{ background: '#0D1F3C' }}>
              {t('postProject')} <Arrow />
            </Button>
          </Link>
          <Link href="/contractor">
            <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 border-navy text-navy hover:bg-secondary">
              {t('joinContractor')}
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-7">
        {[
          { icon: ShieldCheck, t1: t('trustReview'), t2: t('trustReviewDesc') },
          { icon: GitCompare, t1: t('trustCompare'), t2: t('trustCompareDesc') },
          { icon: Handshake, t1: t('trustQatar'), t2: t('trustQatarDesc') },
        ].map((it, i) => (
          <Card key={i} className="border border-border">
            <CardContent className="p-3.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: 'rgba(15,174,150,0.12)' }}>
                <it.icon className="w-5 h-5" style={{ color: '#0FAE96' }} />
              </div>
              <div className="text-[13px] font-semibold text-navy">{it.t1}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{it.t2}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mb-7">
        <h2 className="text-base font-semibold text-navy mb-3">{t('serviceCategories')}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICONS[c] || MoreHorizontal;
            return (
              <Link key={c} href={`/post-project?category=${c}`}>
                <div className="rounded-xl border border-border bg-white px-2 py-3 hover:border-navy hover:shadow-sm transition-all flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#F4F6F8' }}>
                    <Icon className="w-4.5 h-4.5 text-navy" />
                  </div>
                  <span className="text-[11.5px] font-medium text-navy text-center leading-tight">{t(`cat_${c}`)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold text-navy mb-3">{t('howItWorks')}</h2>
        <div className="space-y-2">
          {[1,2,3].map((n) => (
            <div key={n} className="flex gap-3 p-3 rounded-xl bg-secondary">
              <div className="w-7 h-7 rounded-full navy text-white flex items-center justify-center text-xs font-semibold shrink-0">{n}</div>
              <div>
                <div className="text-sm font-semibold text-navy">{t(`step${n}Title`)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t(`step${n}Desc`)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground text-center pb-2">{t('poweredBy')}</p>
    </AppShell>
  );
}
