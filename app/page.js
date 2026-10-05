'use client';
import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import RevealGroup from '@/components/RevealGroup';
import HeroSkyline from '@/components/HeroSkyline';
import { useLang } from '@/lib/LangContext';
import { trackMeta } from '@/lib/marketingAttribution';
import { ArrowRight, Check, CheckCircle2, ChevronDown, FileCheck2, FileText, Inbox, Lock, MessageCircle, PenLine, ShieldCheck } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/97466259219';

// Homepage copy follows brand/BRAND.md section 10 (v1.5). Every figure in the offer
// examples is illustrative and labelled as such on the page. FAQ answers use only
// decided facts from DECISIONS.md; never add figures or claims here.
const COPY = {
  ar: {
    heroLabel: 'تنفيذ مشاريعك في قطر',
    heroLines: ['طلب واحد.', 'من ثلاثة إلى خمسة عروض.'],
    heroAccent: 'والقرار لك.',
    heroSub: 'صف مشروعك بكلماتك، ونحوّله إلى وصف واضح نرسله إلى مقاولين واستشاريين معتمدين، ثم نعرض عروضهم جنبًا إلى جنب.',
    primary: 'انشر مشروعك',
    paths: [
      ['لديك مشروع؟', 'صفه مرة واحدة، ونرسله إلى شركات معتمدة ونضع عروضها جنبًا إلى جنب.'],
      ['مقاول أو استشاري؟', 'قدّم طلب الانضمام واستلم مشاريع واضحة النطاق تناسب خدماتك.'],
    ],
    apply: 'قدّم طلب الانضمام',
    example: 'مثال توضيحي',
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
      ['مشاريع تناسبك', 'نرسل لك ما يطابق تخصصك وحجم أعمالك.'],
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
      ['مسجّلة في قطر', 'معمار لينك منصة قطرية مسجّلة. سجل تجاري رقم 243332.'],
      ['خصوصية بياناتك', 'نشارك تفاصيل مشروعك فقط بالقدر اللازم للتنسيق والمطابقة.'],
      ['دعم من أشخاص حقيقيين', 'فريقنا على بُعد رسالة واتساب في أي خطوة.'],
    ],
    trustNote: 'العقد النهائي يكون بينك وبين الشركة التي تختارها.',
    faqLabel: 'أسئلة شائعة',
    faqTitle: 'إجابات قبل أن تبدأ.',
    faq: [
      ['هل استخدام معمار لينك مجاني؟', 'نعم، حاليًا. نشر المشروع والتقديم كشركة كلاهما مجاني.'],
      ['كيف تتحققون من الشركات؟', 'نتحقق من رقم السجل التجاري لكل شركة ونراجع خدماتها قبل أن تستلم أي مشروع.'],
      ['ماذا يحدث بعد نشر مشروعي؟', 'نراجع طلبك ونستوضح أي تفاصيل ناقصة، ثم نرسله إلى شركات معتمدة مناسبة. تظهر العروض في صفحة المتابعة فور وصولها لتقارن بينها جنبًا إلى جنب.'],
      ['هل يمكنني الكتابة بالعربية؟', 'نعم. صف مشروعك بالعربية أو الإنجليزية، وبكلماتك الخاصة.'],
      ['مع من أوقّع العقد؟', 'مع الشركة التي تختارها. نساعدك في الحصول على عروض واضحة قابلة للمقارنة، والعقد النهائي يكون بينك وبين تلك الشركة.'],
    ],
    closeTitle: 'ابدأ بطلب واحد.',
    closeSub: 'صف مشروعك في دقائق، واستلم عروضًا يمكنك مقارنتها بوضوح.',
    whatsapp: 'أو راسلنا على واتساب',
  },
  en: {
    heroLabel: 'Project sourcing in Qatar',
    heroLines: ['One request.', 'Three to five offers.'],
    heroAccent: 'You choose.',
    heroSub: 'Describe your project in your own words. We turn it into a clear brief, send it to vetted contractors and consultants, and put their offers side by side.',
    primary: 'Post your project',
    paths: [
      ['Have a project?', 'Describe it once. We send it to vetted firms and put their offers side by side.'],
      ['Contractor or consultant?', 'Apply to join and receive clearly scoped projects that match your services.'],
    ],
    apply: 'Apply to join',
    example: 'Example',
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
      ['Projects that fit', 'We send you work that matches your trade and project size.'],
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
      ['Registered in Qatar', 'MimaarLink is a registered Qatari platform. CR No. 243332.'],
      ['Your details stay private', 'Project details are shared only as needed for coordination and matching.'],
      ['A person is one tap away', 'Our team is one WhatsApp message away at every step.'],
    ],
    trustNote: 'The final contract is between you and the firm you choose.',
    faqLabel: 'Questions',
    faqTitle: 'Answers before you start.',
    faq: [
      ['Is MimaarLink free?', 'Yes, for now. Posting a project and applying as a firm are both free.'],
      ['How do you check the firms?', 'We verify each firm’s commercial registration (CR) number and review its services before it receives any project.'],
      ['What happens after I post a project?', 'We review your brief and clarify anything missing, then send it to suitable vetted firms. Offers appear on your tracking page as they arrive, so you can compare them side by side.'],
      ['Can I write in Arabic?', 'Yes. Describe your project in Arabic or English, in your own words.'],
      ['Who do I sign the contract with?', 'With the firm you choose. We help you get clear, comparable offers; the final contract is between you and that firm.'],
    ],
    closeTitle: 'Start with one request.',
    closeSub: 'Describe your project in a few minutes and receive offers you can compare clearly.',
    whatsapp: 'Or message us on WhatsApp',
  },
};

// Sector → existing post-project category, where one exists.
const SECTOR_CATEGORY = ['fitout', 'mep', null, null, null, null, 'consultancy'];
const STEP_ICONS = [PenLine, FileText, Inbox, CheckCircle2];
const TRUST_ICONS = [ShieldCheck, FileCheck2, Lock, MessageCircle];

// Section label with the logo arch as a small mark (brand v1.5).
function SectionLabel({ children }) {
  return (
    <p className="ml-label">
      <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" focusable="false"><path d="M1.5 14V6.5a4.5 4.5 0 0 1 9 0V14" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
      {children}
    </p>
  );
}

function VettedBadge({ label }) {
  return <span className="ml-vetted"><Check size={12} strokeWidth={2.5} aria-hidden="true" />{label}</span>;
}

function OfferCard({ copy, offer, index }) {
  return (
    <article className={`ml-offer ${offer.selected ? 'is-selected' : ''}`} aria-label={`${copy.firms[index]}${offer.selected ? `, ${copy.selected}` : ''}`}>
      <div className="ml-offer-head">
        <span className="ml-offer-firm">{copy.firms[index]}</span>
        {offer.selected ? <span className="ml-offer-selected">{copy.selected}</span> : <VettedBadge label={copy.vetted} />}
      </div>
      <p className="ml-offer-price"><bdi>{copy.currency(offer.price)}</bdi></p>
      <dl className="ml-offer-rows">
        <div><dt>{copy.duration}</dt><dd>{offer.duration}</dd></div>
        <div><dt>{copy.warranty}</dt><dd>{offer.warranty}</dd></div>
        <div><dt>{copy.exclusions}</dt><dd className="ml-offer-excl">{offer.exclusions}</dd></div>
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
    <AppShell wide bleed flushFooter overHero>
      <RevealGroup className="ml-home">
        {/* 1. Hero: navy, centred, two paths, arch skyline */}
        <section className="ml-hero ml-on-navy" aria-labelledby="hero-title">
          <div className="ml-wrap ml-hero-inner">
            <p className="ml-hero-label">{copy.heroLabel}</p>
            <h1 id="hero-title">
              {copy.heroLines.map((line) => <span key={line} className="ml-hero-line">{line} </span>)}
              <span className="ml-hero-line ml-accent">{copy.heroAccent}</span>
            </h1>
            <p className="ml-hero-sub">{copy.heroSub}</p>
            <div className="ml-paths">
              {copy.paths.map(([title, desc], i) => (
                <article key={title} className="ml-path" aria-labelledby={`path-${i}`}>
                  <span className="ml-path-num" aria-hidden="true">{`0${i + 1}`}</span>
                  <h2 id={`path-${i}`}>{title}</h2>
                  <p>{desc}</p>
                  {i === 0
                    ? <Link href="/post-project" className="btn btn-primary">{copy.primary}{arrow}</Link>
                    : <Link href="/contractor" className="btn btn-on-navy" onClick={trackPath('contractor')}>{copy.apply}</Link>}
                </article>
              ))}
            </div>
          </div>
          <HeroSkyline className="ml-hero-art" />
        </section>

        {/* 2. How it works */}
        <section className="ml-section ml-wrap" aria-labelledby="how-title">
          <SectionLabel>{copy.howLabel}</SectionLabel>
          <h2 id="how-title" data-reveal>{copy.howTitle}</h2>
          <ol className="ml-cards ml-cards-4" data-reveal-stagger>
            {copy.steps.map(([title, desc], i) => {
              const Icon = STEP_ICONS[i];
              return (
                <li key={title} className="ml-card">
                  <div className="ml-card-head">
                    <span className="ml-icon"><Icon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                    <span className="ml-step-num" aria-hidden="true">{`0${i + 1}`}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* 3. The comparison (always marked as an example) */}
        <section className="ml-white" aria-labelledby="compare-title">
          <div className="ml-section ml-wrap">
            <SectionLabel>{copy.compareLabel}</SectionLabel>
            <h2 id="compare-title" data-reveal>{copy.compareTitle}</h2>
            <p className="ml-sub">{copy.compareSub}</p>
            <p className="ml-example-note"><span>{copy.example}</span>{copy.compareNote}</p>
            <div className="ml-compare" data-reveal-stagger>
              {copy.offers.map((offer, i) => <OfferCard key={i} copy={copy} offer={offer} index={i} />)}
            </div>
          </div>
        </section>

        {/* 4. For contractors & consultants */}
        <section className="ml-on-navy" aria-labelledby="providers-title">
          <div className="ml-section ml-wrap ml-split">
            <div>
              <SectionLabel>{copy.providersLabel}</SectionLabel>
              <h2 id="providers-title" data-reveal>{copy.providersTitle}</h2>
              <p className="ml-sub">{copy.providersSub}</p>
              <div className="ml-actions">
                <Link href="/contractor" className="btn btn-on-navy" onClick={trackPath('contractor')}>{copy.applyContractor}{arrow}</Link>
                <Link href="/contractor?type=consultant" className="btn btn-on-navy" onClick={trackPath('consultant')}>{copy.applyConsultant}{arrow}</Link>
              </div>
            </div>
            <ul className="ml-navy-points" data-reveal-stagger>
              {copy.providerPoints.map(([title, desc]) => (
                <li key={title}>
                  <span className="ml-check"><Check size={18} strokeWidth={2} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Sectors */}
        <section className="ml-section ml-wrap" aria-labelledby="sectors-title">
          <SectionLabel>{copy.sectorsLabel}</SectionLabel>
          <h2 id="sectors-title" data-reveal>{copy.sectorsTitle}</h2>
          <ul className="ml-sectors" data-reveal-stagger>
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
        <section className="ml-white" aria-labelledby="trust-title">
          <div className="ml-section ml-wrap">
            <SectionLabel>{copy.trustLabel}</SectionLabel>
            <h2 id="trust-title" data-reveal>{copy.trustTitle}</h2>
            <ul className="ml-cards ml-cards-4" data-reveal-stagger>
              {copy.trust.map(([title, desc], i) => {
                const Icon = TRUST_ICONS[i];
                return (
                  <li key={title} className="ml-card">
                    <span className="ml-icon"><Icon size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </li>
                );
              })}
            </ul>
            <p className="ml-trust-note">{copy.trustNote}</p>
          </div>
        </section>

        {/* 7. Questions: decided facts only (DECISIONS.md) */}
        <section className="ml-section ml-wrap" aria-labelledby="faq-title">
          <SectionLabel>{copy.faqLabel}</SectionLabel>
          <h2 id="faq-title" data-reveal>{copy.faqTitle}</h2>
          <div className="ml-faq">
            {copy.faq.map(([question, answer]) => (
              <details key={question}>
                <summary><span>{question}</span><ChevronDown size={20} strokeWidth={1.75} aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 8. Close */}
        <section className="ml-close ml-on-navy" aria-labelledby="close-title">
          <div className="ml-wrap ml-close-inner" data-reveal>
            <h2 id="close-title">{copy.closeTitle}</h2>
            <p>{copy.closeSub}</p>
            <div className="ml-actions">
              <Link href="/post-project" className="btn btn-primary">{copy.primary}{arrow}</Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="ml-whatsapp"><WhatsAppIcon className="h-4 w-4" />{copy.whatsapp}</a>
            </div>
          </div>
        </section>
      </RevealGroup>
    </AppShell>
  );
}
