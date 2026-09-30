'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { trackMeta } from '@/lib/marketingAttribution';
import { ArrowRight, Check, FileCheck2, ShieldCheck, Lock, MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/97466259219';

// Homepage copy follows brand/BRAND.md section 10. Every figure in the offer
// examples is illustrative and labelled as such on the page.
const COPY = {
  ar: {
    heroLabel: 'تنفيذ مشاريعك في قطر',
    heroTitle: 'طلب واحد. من ثلاثة إلى خمسة عروض. والقرار لك.',
    heroSub: 'صف مشروعك بكلماتك، ونحوّله إلى وصف واضح نرسله إلى مقاولين واستشاريين معتمدين، ثم نعرض عروضهم جنبًا إلى جنب.',
    primary: 'انشر مشروعك',
    secondary: 'انضم كمقاول أو استشاري',
    example: 'مثال توضيحي',
    panelProject: 'تجهيز مكتب · 220 م² · لوسيل',
    panelFigure: '3–5 عروض',
    panelFigureNote: 'لكل طلب، على الوصف نفسه',
    howLabel: 'كيف تعمل المنصة',
    howTitle: 'أربع خطوات، وتعرف دائمًا ما التالي.',
    steps: [
      ['صف مشروعك', 'اكتب ما تحتاجه بكلماتك، بالعربية أو الإنجليزية.'],
      ['نحدّد النطاق', 'نحوّله إلى وصف واضح تستطيع الشركات تسعيره بدقة.'],
      ['استلم العروض', 'يرسل مقاولون أو استشاريون معتمدون عروضهم على الوصف نفسه.'],
      ['اختر', 'قارن السعر والمدة والنطاق والاستثناءات، ثم قرّر.'],
    ],
    compareLabel: 'المقارنة',
    compareTitle: 'كل العروض في صفحة واحدة.',
    compareSub: 'تسعّر الشركات الوصف نفسه، فتقارن بين عروض متكافئة: السعر والمدة والضمان وما هو مستثنى.',
    compareNote: 'مثال توضيحي. الأسماء والأرقام افتراضية وليست عروضًا حقيقية.',
    currency: (n) => `${n} ر.ق`,
    firms: ['شركة أ', 'شركة ب', 'شركة ج'],
    duration: 'المدة',
    warranty: 'الضمان',
    exclusions: 'الاستثناءات',
    selected: 'العرض المختار',
    vetted: 'معتمد',
    offers: [
      { price: '38,500', duration: '6 أسابيع', warranty: '12 شهرًا', exclusions: 'الأثاث، تمديدات الشبكات', selected: true },
      { price: '42,000', duration: '5 أسابيع', warranty: '18 شهرًا', exclusions: 'الأثاث' },
      { price: '35,900', duration: '8 أسابيع', warranty: '6 أشهر', exclusions: 'الأثاث، التصاريح، تمديدات الشبكات' },
    ],
    providersLabel: 'للمقاولين والاستشاريين',
    providersTitle: 'أعمال جادّة، بنطاق واضح.',
    providersSub: 'قدّم طلب الانضمام. تستلم الشركات المؤهلة مشاريع تناسب قدراتها.',
    providerPoints: [
      ['وصف واضح قبل التسعير', 'تصلك المشاريع موصوفة بوضوح، فتسعّر نطاقًا حقيقيًا لا تخمينًا.'],
      ['مشاريع تناسبك', 'نرسل لك ما يطابق تخصصك وحجم أعمالك ومنطقتك.'],
      ['كيف يتم التأهيل', 'نتحقق من رقم السجل التجاري ونراجع تفاصيل خدماتك قبل أن تستلم أي مشروع.'],
    ],
    applyContractor: 'قدّم كمقاول',
    applyConsultant: 'قدّم كمكتب استشاري',
    sectorsLabel: 'القطاعات',
    sectorsTitle: 'نغطي أعمال البناء والتجهيز في قطر.',
    sectors: ['التجهيزات الداخلية', 'الأعمال الكهروميكانيكية', 'المشاريع التجارية', 'الرعاية الصحية والمطاعم', 'الفلل', 'المشاريع الصناعية', 'التصميم والإشراف'],
    trustLabel: 'الثقة',
    trustTitle: 'ما الذي نلتزم به.',
    trust: [
      ['مراجعة الشركات', 'نتحقق من رقم السجل التجاري لكل شركة ونراجع خدماتها قبل أن تستلم المشاريع.'],
      ['مسجّلة في قطر', 'معمار لينك منصة قطرية. سجل تجاري رقم [يُضاف لاحقًا].'],
      ['خصوصية بياناتك', 'نشارك تفاصيل مشروعك فقط بالقدر اللازم للتنسيق والمطابقة.'],
      ['دعم من أشخاص حقيقيين', 'فريقنا على بُعد رسالة واتساب في أي خطوة.'],
    ],
    trustNote: 'العقد النهائي يكون بينك وبين الشركة التي تختارها.',
    closeTitle: 'ابدأ بطلب واحد.',
    closeSub: 'صف مشروعك في دقائق، واستلم عروضًا يمكنك مقارنتها بوضوح.',
    whatsapp: 'أو راسلنا على واتساب',
  },
  en: {
    heroLabel: 'Project sourcing in Qatar',
    heroTitle: 'One request. Three to five offers. You choose.',
    heroSub: 'Describe your project in your own words. We turn it into a clear brief, send it to vetted contractors and consultants, and put their offers side by side.',
    primary: 'Post your project',
    secondary: 'Join as a contractor or consultant',
    example: 'Example',
    panelProject: 'Office fit-out · 220 m² · Lusail',
    panelFigure: '3–5 offers',
    panelFigureNote: 'per request, on the same brief',
    howLabel: 'How it works',
    howTitle: 'Four steps. You always know what happens next.',
    steps: [
      ['Describe', 'Tell us what you need in your own words, in Arabic or English.'],
      ['Define', 'We turn it into a clear brief that firms can price accurately.'],
      ['Receive offers', 'Vetted contractors or consultants price the same brief.'],
      ['Choose', 'Compare price, timeline, scope and exclusions, then decide.'],
    ],
    compareLabel: 'The comparison',
    compareTitle: 'Every offer on the same page.',
    compareSub: 'Firms price the same brief, so you compare like with like: price, duration, warranty and what is excluded.',
    compareNote: 'Example. Firm names and figures are illustrative, not real offers.',
    currency: (n) => `QAR ${n}`,
    firms: ['Firm A', 'Firm B', 'Firm C'],
    duration: 'Duration',
    warranty: 'Warranty',
    exclusions: 'Exclusions',
    selected: 'Selected',
    vetted: 'Vetted',
    offers: [
      { price: '38,500', duration: '6 weeks', warranty: '12 months', exclusions: 'Furniture, IT cabling', selected: true },
      { price: '42,000', duration: '5 weeks', warranty: '18 months', exclusions: 'Furniture' },
      { price: '35,900', duration: '8 weeks', warranty: '6 months', exclusions: 'Furniture, permits, IT cabling' },
    ],
    providersLabel: 'For contractors & consultants',
    providersTitle: 'Serious work, clearly scoped.',
    providersSub: 'Apply to join. Qualified firms receive projects that match their capability.',
    providerPoints: [
      ['A clear brief before you price', 'Projects arrive clearly described, so you price real scope, not guesses.'],
      ['Projects that fit', 'We send you work that matches your trade, size and area.'],
      ['How qualification works', 'We verify your CR number and review your service details before you receive any project.'],
    ],
    applyContractor: 'Apply as a contractor',
    applyConsultant: 'Apply as a consultant',
    sectorsLabel: 'Sectors',
    sectorsTitle: "Across Qatar's built environment.",
    sectors: ['Fit-out', 'MEP', 'Commercial', 'Healthcare & F&B', 'Villas', 'Industrial', 'Design & Supervision'],
    trustLabel: 'Trust',
    trustTitle: 'What we hold ourselves to.',
    trust: [
      ['Firms are reviewed', 'We verify every firm’s CR number and review its services before it receives projects.'],
      ['Registered in Qatar', 'MimaarLink is a Qatari platform. CR No. [placeholder].'],
      ['Your details stay private', 'Project details are shared only as needed for coordination and matching.'],
      ['A person is one tap away', 'Our team is one WhatsApp message away at every step.'],
    ],
    trustNote: 'The final contract is between you and the firm you choose.',
    closeTitle: 'Start with one request.',
    closeSub: 'Describe your project in a few minutes and receive offers you can compare clearly.',
    whatsapp: 'Or message us on WhatsApp',
  },
};

// Sector → existing post-project category, where one exists.
const SECTOR_CATEGORY = ['fitout', 'mep', null, null, null, null, 'consultancy'];
const TRUST_ICONS = [ShieldCheck, FileCheck2, Lock, MessageCircle];

function VettedBadge({ label }) {
  return <span className="ml-vetted"><Check size={12} strokeWidth={2.5} aria-hidden="true" />{label}</span>;
}

function OfferCard({ copy, offer, index, compact = false }) {
  return (
    <article className={`ml-offer ${offer.selected ? 'is-selected ml-cut' : ''} ${compact ? 'is-compact' : ''}`} aria-label={`${copy.firms[index]}${offer.selected ? `, ${copy.selected}` : ''}`}>
      <div className="ml-offer-head">
        <span className="ml-offer-firm">{copy.firms[index]}</span>
        {offer.selected ? <span className="ml-offer-selected">{copy.selected}</span> : <VettedBadge label={copy.vetted} />}
      </div>
      <p className="ml-offer-price"><bdi>{copy.currency(offer.price)}</bdi></p>
      <dl className="ml-offer-rows">
        <div><dt>{copy.duration}</dt><dd>{offer.duration}</dd></div>
        {!compact && <div><dt>{copy.warranty}</dt><dd>{offer.warranty}</dd></div>}
        {!compact && <div><dt>{copy.exclusions}</dt><dd className="ml-offer-excl">{offer.exclusions}</dd></div>}
      </dl>
    </article>
  );
}

export default function HomePage() {
  const { dir } = useLang();
  const copy = COPY[dir === 'rtl' ? 'ar' : 'en'];
  const arrow = <ArrowRight className="btn-arrow h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden="true" />;
  const trackPath = (pathType) => () => trackMeta('PathSelected', { path_type: pathType }, { custom: true });

  return (
    <AppShell wide bleed flushFooter>
      <div className="ml-home">
        {/* 1. Hero */}
        <section className="ml-hero ml-wrap" aria-labelledby="hero-title">
          <div className="ml-hero-copy">
            <p className="eyebrow">{copy.heroLabel}</p>
            <h1 id="hero-title">{copy.heroTitle}</h1>
            <p className="ml-lead">{copy.heroSub}</p>
            <div className="ml-actions">
              <Link href="/post-project" className="btn btn-primary">{copy.primary}{arrow}</Link>
              <Link href="/contractor" className="btn btn-secondary" onClick={trackPath('contractor')}>{copy.secondary}</Link>
            </div>
          </div>
          <aside className="ml-signature ml-cut" aria-label={copy.example}>
            <div className="ml-signature-top">
              <span className="ml-signature-label">{copy.example}</span>
              <span className="ml-signature-project">{copy.panelProject}</span>
            </div>
            <p className="ml-signature-figure">{copy.panelFigure}<span>{copy.panelFigureNote}</span></p>
            <div className="ml-signature-offers">
              {copy.offers.map((offer, i) => <OfferCard key={i} copy={copy} offer={offer} index={i} compact />)}
            </div>
          </aside>
        </section>

        {/* 2. How it works */}
        <section className="ml-section ml-wrap" aria-labelledby="how-title">
          <p className="eyebrow">{copy.howLabel}</p>
          <h2 id="how-title">{copy.howTitle}</h2>
          <ol className="ml-steps">
            {copy.steps.map(([title, desc], i) => (
              <li key={title}>
                <span className="ml-step-num" aria-hidden="true">{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. The comparison */}
        <section className="ml-band" aria-labelledby="compare-title">
          <div className="ml-section ml-wrap">
            <p className="eyebrow">{copy.compareLabel}</p>
            <h2 id="compare-title">{copy.compareTitle}</h2>
            <p className="ml-sub">{copy.compareSub}</p>
            <p className="ml-example-note"><span>{copy.example}</span>{copy.compareNote}</p>
            <div className="ml-compare">
              {copy.offers.map((offer, i) => <OfferCard key={i} copy={copy} offer={offer} index={i} />)}
            </div>
          </div>
        </section>

        {/* 4. For contractors & consultants */}
        <section className="ml-section ml-wrap ml-split" aria-labelledby="providers-title">
          <div>
            <p className="eyebrow">{copy.providersLabel}</p>
            <h2 id="providers-title">{copy.providersTitle}</h2>
            <p className="ml-sub">{copy.providersSub}</p>
            <div className="ml-actions">
              <Link href="/contractor" className="btn btn-secondary" onClick={trackPath('contractor')}>{copy.applyContractor}{arrow}</Link>
              <Link href="/contractor?type=consultant" className="btn btn-secondary" onClick={trackPath('consultant')}>{copy.applyConsultant}{arrow}</Link>
            </div>
          </div>
          <ul className="ml-lines">
            {copy.providerPoints.map(([title, desc]) => <li key={title}><h3>{title}</h3><p>{desc}</p></li>)}
          </ul>
        </section>

        {/* 5. Sectors */}
        <section className="ml-section ml-wrap ml-sectors-section" aria-labelledby="sectors-title">
          <p className="eyebrow">{copy.sectorsLabel}</p>
          <h2 id="sectors-title">{copy.sectorsTitle}</h2>
          <ul className="ml-sectors">
            {copy.sectors.map((sector, i) => {
              const category = SECTOR_CATEGORY[i];
              return (
                <li key={sector}>
                  <Link href={category ? `/post-project?category=${category}` : '/post-project'}>
                    <span>{sector}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 6. Trust */}
        <section className="ml-band" aria-labelledby="trust-title">
          <div className="ml-section ml-wrap">
            <p className="eyebrow">{copy.trustLabel}</p>
            <h2 id="trust-title">{copy.trustTitle}</h2>
            <ul className="ml-trust">
              {copy.trust.map(([title, desc], i) => {
                const Icon = TRUST_ICONS[i];
                return <li key={title}><Icon size={20} strokeWidth={1.75} aria-hidden="true" /><h3>{title}</h3><p>{desc}</p></li>;
              })}
            </ul>
            <p className="ml-trust-note">{copy.trustNote}</p>
          </div>
        </section>

        {/* 7. Close */}
        <section className="ml-close" aria-labelledby="close-title">
          <div className="ml-wrap ml-close-inner">
            <div>
              <h2 id="close-title">{copy.closeTitle}</h2>
              <p>{copy.closeSub}</p>
            </div>
            <div className="ml-actions">
              <Link href="/post-project" className="btn btn-primary">{copy.primary}{arrow}</Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="ml-whatsapp"><WhatsAppIcon className="h-4 w-4" />{copy.whatsapp}</a>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
