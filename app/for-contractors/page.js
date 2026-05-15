'use client';
import React from 'react';
import MarketingLanding from '@/components/MarketingLanding';
import { useLang } from '@/lib/LangContext';
import { TrendingUp, Wallet, ShieldCheck } from 'lucide-react';

export default function ForContractorsPage() {
  const { t } = useLang();
  return (
    <MarketingLanding
      eyebrow={t('contL_eyebrow')}
      tagline={t('contL_tag')}
      subtitle={t('contL_sub')}
      ctaLabel={t('contL_cta')}
      ctaHref="/contractor"
      benefits={[
        { icon: TrendingUp, title: t('contL_b1'), desc: t('contL_b1d') },
        { icon: Wallet, title: t('contL_b2'), desc: t('contL_b2d') },
        { icon: ShieldCheck, title: t('contL_b3'), desc: t('contL_b3d') },
      ]}
      steps={[
        { title: t('contL_s1'), desc: t('contL_s1d') },
        { title: t('contL_s2'), desc: t('contL_s2d') },
        { title: t('contL_s3'), desc: t('contL_s3d') },
      ]}
      finalTitle={t('contL_finalTitle')}
      finalSub={t('contL_finalSub')}
    />
  );
}
