'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { CATEGORIES } from '@/lib/i18n';
import {
  ShieldCheck, GitCompare, Handshake, ArrowRight, ArrowUpRight,
  Wrench, Snowflake, Plug, Droplets, Layers, HardHat, Hammer,
  PaintBucket, Square, Frame, MoreHorizontal, Sparkles, MapPin
} from 'lucide-react';

const CAT_ICONS = {
  mep: Wrench, hvac: Snowflake, electrical: Plug, plumbing: Droplets, fitout: Layers,
  civil: HardHat, joinery: Hammer, flooring: Square, painting: PaintBucket, aluminum: Frame, other: MoreHorizontal,
};

export default function HomePage() {
  const { t, dir } = useLang();
  const isRTL = dir === 'rtl';
  const Arrow = isRTL ? () => <ArrowRight className="w-4 h-4 rotate-180" /> : () => <ArrowRight className="w-4 h-4" />;

  return (
    <AppShell>
      {/* HERO — dark navy card, app-like */}
      <section className="relative overflow-hidden rounded-[28px] navy grain text-white px-5 pt-6 pb-7 mb-4 shadow-soft">
        <div className="absolute -top-16 -end-16 w-44 h-44 rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,158,137,0.35), transparent 70%)' }} />
        <div className="absolute -bottom-20 -start-20 w-52 h-52 rounded-full" style={{ background: 'radial-gradient(circle, rgba(14,158,137,0.18), transparent 70%)' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-medium">
            <Sparkles className="w-3 h-3 text-teal" style={{ color: '#5EEAD4' }} />
            <span className="tracking-tight">Qatar · platform-reviewed contractors</span>
          </div>

          <h1 className="mt-4 text-[28px] sm:text-[32px] font-bold leading-[1.1] tracking-tight">
            {t('tagline')}
          </h1>
          <p className="mt-3 text-[14px] text-white/70 leading-relaxed max-w-md">{t('subtitle')}</p>

          <div className="mt-5 grid gap-2.5">
            <Link href="/post-project">
              <button className="w-full h-12 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 glow-teal" style={{ background: '#0E9E89' }}>
                {t('postProject')} <Arrow />
              </button>
            </Link>
            <Link href="/contractor">
              <button className="w-full h-12 rounded-2xl text-[15px] font-semibold border border-white/20 bg-white/5 hover:bg-white/10 transition flex items-center justify-center">
                {t('joinContractor')}
              </button>
            </Link>
          </div>

          {/* mini stats strip */}
          <div className="mt-5 flex items-center gap-3 text-[11px] text-white/65">
            <div className="flex -space-x-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A1628]" style={{ background: ['#0E9E89','#5EEAD4','#FBBF24'][i] }} />
              ))}
            </div>
            <span>Verified contractors active in <strong className="text-white">Doha · Lusail · Al Wakrah</strong></span>
          </div>
        </div>
      </section>

      {/* TRUST — bento style asymmetric */}
      <section className="grid grid-cols-2 gap-2.5 mb-5">
        <BentoCard
          icon={ShieldCheck}
          title={t('trustReview')}
          desc={t('trustReviewDesc')}
          big
        />
        <BentoCard icon={GitCompare} title={t('trustCompare')} desc={t('trustCompareDesc')} />
        <BentoCard icon={Handshake} title={t('trustQatar')} desc={t('trustQatarDesc')} accent />
      </section>

      {/* CATEGORIES — horizontal scroll chips */}
      <section className="mb-6 -mx-4">
        <div className="flex items-center justify-between px-4 mb-2.5">
          <h2 className="text-base font-bold text-navy">{t('serviceCategories')}</h2>
          <Link href="/post-project" className="text-[11px] text-navy/60 font-semibold flex items-center gap-0.5">
            {t('seeAll')} <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICONS[c] || MoreHorizontal;
            return (
              <Link key={c} href={`/post-project?category=${c}`} className="shrink-0">
                <div className="w-[88px] h-[100px] rounded-2xl bg-white border border-border hover:border-navy/40 hover:shadow-soft transition-all px-2 py-3 flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(14,158,137,0.10)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#0E9E89' }} />
                  </div>
                  <span className="text-[11px] font-semibold text-navy text-center leading-tight">{t(`cat_${c}`)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS — vertical timeline with connector */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-navy mb-3">{t('howItWorks')}</h2>
        <div className="relative">
          <div className={`absolute top-3 bottom-3 w-px bg-border ${isRTL ? 'right-[15px]' : 'left-[15px]'}`} />
          <div className="space-y-3">
            {[1,2,3].map((n) => (
              <div key={n} className="relative flex gap-3 items-start">
                <div className="relative z-10 w-8 h-8 rounded-full navy text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-soft">{n}</div>
                <div className="flex-1 bg-white border border-border rounded-2xl px-4 py-3 shadow-soft">
                  <div className="text-[14px] font-bold text-navy">{t(`step${n}Title`).replace(/^[\d.\s\u0660-\u0669]+/, '')}</div>
                  <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{t(`step${n}Desc`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <Link href="/post-project">
        <div className="rounded-2xl border-2 border-dashed border-navy/15 bg-white/50 px-4 py-4 flex items-center justify-between mb-4 hover:bg-white transition">
          <div>
            <div className="text-[13px] font-bold text-navy">{t('postProject')}</div>
            <div className="text-[11px] text-muted-foreground">{t('subtitle').slice(0, 60)}…</div>
          </div>
          <div className="w-9 h-9 rounded-full navy flex items-center justify-center text-white"><Arrow /></div>
        </div>
      </Link>

      <p className="text-[11px] text-muted-foreground text-center pb-1 flex items-center justify-center gap-1">
        <MapPin className="w-3 h-3" /> {t('poweredBy')}
      </p>
    </AppShell>
  );
}

function BentoCard({ icon: Icon, title, desc, big = false, accent = false }) {
  return (
    <div className={`${big ? 'col-span-2' : ''} ${accent ? 'navy text-white' : 'bg-white border border-border'} rounded-2xl p-3.5 shadow-soft`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${accent ? 'bg-white/10' : ''}`} style={!accent ? { background: 'rgba(14,158,137,0.12)' } : {}}>
        <Icon className="w-4.5 h-4.5" style={{ color: accent ? '#5EEAD4' : '#0E9E89' }} />
      </div>
      <div className={`text-[13px] font-bold ${accent ? 'text-white' : 'text-navy'}`}>{title}</div>
      <div className={`text-[11.5px] mt-0.5 leading-relaxed ${accent ? 'text-white/70' : 'text-muted-foreground'}`}>{desc}</div>
    </div>
  );
}
