'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { CATEGORIES } from '@/lib/i18n';
import {
  Cpu, GitCompare, MapPin as PinIcon, ArrowRight, ArrowUpRight,
  Wrench, Snowflake, Plug, Droplets, Layers, HardHat, Hammer,
  PaintBucket, Square, Frame, MoreHorizontal, Sparkles, ShieldCheck, MapPin, Mail, Phone
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
      {/* HERO — soft navy gradient with single primary CTA */}
      <section className="relative overflow-hidden rounded-[28px] navy-deep text-white px-5 pt-6 pb-6 mb-4 shadow-soft">
        <div className="absolute -top-20 -end-20 w-56 h-56 rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(20,168,142,0.30), transparent 70%)' }} />
        <div className="absolute -bottom-24 -start-24 w-60 h-60 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, rgba(94,234,212,0.12), transparent 70%)' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-medium">
            <Sparkles className="w-3 h-3" style={{ color: '#5EEAD4' }} />
            <span className="tracking-tight">AI-powered · Qatar</span>
          </div>

          <h1 className="mt-4 text-[28px] sm:text-[32px] font-bold leading-[1.15] tracking-tight">
            {t('tagline')}
          </h1>
          <p className="mt-3 text-[14px] text-white/70 leading-relaxed max-w-md">{t('subtitle')}</p>

          <div className="mt-5">
            <Link href="/post-project">
              <button className="w-full h-14 rounded-2xl text-[16px] font-bold flex items-center justify-center gap-2 glow-teal text-white" style={{ background: '#14A88E' }}>
                {t('postProject')} <Arrow />
              </button>
            </Link>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-white/65">
              <span>{isRTL ? 'هل أنت مقاول؟' : 'Are you a contractor?'}</span>
              <Link href="/contractor" className="text-white font-semibold underline-offset-2 hover:underline">
                {t('joinContractor')} <ArrowUpRight className="inline w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* benefits chips row */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11.5px] text-white/75">
            <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" style={{ color: '#5EEAD4' }} />{t('benefit_ai')}</span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" style={{ color: '#5EEAD4' }} />{t('benefit_bids')}</span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1.5"><PinIcon className="w-3.5 h-3.5" style={{ color: '#5EEAD4' }} />{t('benefit_local')}</span>
          </div>
        </div>
      </section>

      {/* TRUST — bento style, all light & consistent */}
      <section className="grid grid-cols-2 gap-2.5 mb-5">
        <BentoCard icon={Cpu} title={t('trustReview')} desc={t('trustReviewDesc')} big />
        <BentoCard icon={GitCompare} title={t('trustCompare')} desc={t('trustCompareDesc')} />
        <BentoCard icon={PinIcon} title={t('trustQatar')} desc={t('trustQatarDesc')} />
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(20,168,142,0.10)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#14A88E' }} />
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

      {/* CONTACT — proper footer card */}
      <section className="mt-2 mb-2">
        <div className="rounded-[24px] navy-deep text-white p-5 shadow-soft relative overflow-hidden">
          <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, rgba(14,181,158,0.25), transparent 70%)' }} />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-medium mb-3">
              <Mail className="w-3 h-3" style={{ color: '#5EEAD4' }} />
              <span className="tracking-tight">{t('contactTitle')}</span>
            </div>
            <h3 className="text-[20px] font-bold leading-tight">{t('contactTitle')}</h3>
            <p className="text-[13px] text-white/65 mt-1">{t('contactSubtitle')}</p>

            <div className="mt-4 grid gap-2">
              <a href="mailto:hello@bunyanplatform.qa" className="flex items-center gap-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-3 transition">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(14,181,158,0.18)' }}>
                  <Mail className="w-4 h-4" style={{ color: '#0EB59E' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-white/55 uppercase tracking-wide">{t('contactEmail')}</div>
                  <div className="text-[13.5px] font-semibold text-white truncate">hello@bunyanplatform.qa</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/50" />
              </a>
              <a href="tel:+97444001234" className="flex items-center gap-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-3 transition">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,182,61,0.18)' }}>
                  <Phone className="w-4 h-4" style={{ color: '#F5B63D' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-white/55 uppercase tracking-wide">{t('contactPhone')}</div>
                  <div className="text-[13.5px] font-semibold text-white truncate" dir="ltr">+974 4400 1234</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/50" />
              </a>
            </div>

            <Link href="mailto:hello@bunyanplatform.qa">
              <button className="w-full mt-4 h-11 rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 text-white glow-teal" style={{ background: '#0EB59E' }}>
                <Mail className="w-4 h-4" />
                {t('contactEmailUs')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground text-center pt-3 pb-1">
        {t('poweredBy')} · {new Date().getFullYear()} · {t('allRights')}
      </p>
    </AppShell>
  );
}

function BentoCard({ icon: Icon, title, desc, big = false }) {
  return (
    <div className={`${big ? 'col-span-2' : ''} bg-white border border-border rounded-2xl p-4 shadow-soft`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5" style={{ background: 'rgba(20,168,142,0.10)' }}>
        <Icon className="w-5 h-5" style={{ color: '#14A88E' }} />
      </div>
      <div className="text-[13.5px] font-bold text-navy">{title}</div>
      <div className="text-[12px] mt-1 leading-relaxed text-muted-foreground">{desc}</div>
    </div>
  );
}
