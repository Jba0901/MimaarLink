'use client';
import React from 'react';
import MarketingLanding from '@/components/MarketingLanding';
import { useLang } from '@/lib/LangContext';
import { ShieldCheck, GitCompare, Wallet } from 'lucide-react';

export default function ForProjectsPage() {
  const { t } = useLang();
  return (
    <MarketingLanding
      eyebrow={t('projL_eyebrow')}
      tagline={t('projL_tag')}
      subtitle={t('projL_sub')}
      ctaLabel={t('projL_cta')}
      ctaHref="/post-project"
      ctaSubtext={t('projL_ctaSub')}
      benefits={[
        { icon: ShieldCheck, title: t('projL_b1'), desc: t('projL_b1d') },
        { icon: GitCompare, title: t('projL_b2'), desc: t('projL_b2d') },
        { icon: Wallet, title: t('projL_b3'), desc: t('projL_b3d') },
      ]}
      popularTypesTitle={t('projL_popularTitle')}
      popularTypes={[
        t('ptype_fitout'),
        t('ptype_maintenance'),
        t('ptype_civil'),
        t('ptype_mep'),
        t('ptype_renovation'),
        t('ptype_landscaping'),
      ]}
      steps={[
        { title: t('projL_s1'), desc: t('projL_s1d') },
        { title: t('projL_s2'), desc: t('projL_s2d') },
        { title: t('projL_s3'), desc: t('projL_s3d') },
      ]}
      privacyLine={t('projL_privacy')}
      finalTitle={t('projL_finalTitle')}
      finalSub={t('projL_finalSub')}
    />
  );
}
