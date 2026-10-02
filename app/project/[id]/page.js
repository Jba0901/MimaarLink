'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import ResultFileLink from '@/components/ResultFileLink';
import PageState from '@/components/PageState';
import PhaseTimeline from '@/components/PhaseTimeline';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { ArrowRight } from 'lucide-react';

// The owner sees four brand phases; the admin keeps its detailed statuses.
const PHASE_OF_STATUS = {
  received: 0, reviewing: 0, approved: 0,
  contractors_invited: 1,
  bids_received: 2,
  shortlisted: 3, meeting_arranged: 3,
  closed: 4,
};
const OFFERS_VISIBLE = ['bids_received', 'shortlisted', 'meeting_arranged', 'closed'];

const COPY = {
  en: {
    eyebrow: 'Project status',
    phases: ['Brief received', 'Sent to firms', 'Offers in', 'Compare and choose'],
    timelineLabel: 'Project progress',
    nextLabel: 'What happens next',
    viewOffers: 'Compare offers',
    waitingOffers: 'Offers will appear here as firms respond. We will also message you on WhatsApp.',
    whatsapp: 'Message us on WhatsApp',
    details: 'Your brief',
    type: 'Project type',
    location: 'Location',
    description: 'Description',
    start: 'Start',
    budget: 'Budget',
    files: 'Attachments',
    saveLink: 'Keep this page’s link to check progress at any time.',
  },
  ar: {
    eyebrow: 'حالة المشروع',
    phases: ['تم استلام الطلب', 'أُرسل إلى الشركات', 'وصلت العروض', 'قارن واختر'],
    timelineLabel: 'مراحل المشروع',
    nextLabel: 'ماذا يحدث بعد ذلك',
    viewOffers: 'قارن العروض',
    waitingOffers: 'ستظهر العروض هنا فور رد الشركات، وسنراسلك أيضًا عبر واتساب.',
    whatsapp: 'راسلنا على واتساب',
    details: 'طلبك',
    type: 'نوع المشروع',
    location: 'الموقع',
    description: 'الوصف',
    start: 'موعد البدء',
    budget: 'الميزانية',
    files: 'المرفقات',
    saveLink: 'احتفظ برابط هذه الصفحة لمتابعة التقدم في أي وقت.',
  },
};

function StatusSkeleton() {
  return (
    <div className="mx-auto max-w-4xl py-4" aria-hidden="true">
      <div className="h-3 w-32 animate-pulse rounded ml-skel" />
      <div className="mt-4 h-9 w-2/3 animate-pulse rounded-[6px] ml-skel" />
      <div className="mt-8 grid gap-4 sm:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-10 animate-pulse rounded-[6px] ml-skel" />)}</div>
      <div className="mt-8 h-32 animate-pulse rounded-[6px] ml-skel" />
      <div className="mt-6 h-48 animate-pulse rounded-[6px] ml-skel" />
    </div>
  );
}

export default function ProjectPage() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const copy = COPY[lang === 'ar' ? 'ar' : 'en'];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.status === 404) {
        setData({ error: true });
        return;
      }
      if (!response.ok) throw new Error('Project status failed to load');
      setData(await response.json());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <AppShell hideNav hideFooter wide><span className="sr-only" role="status">{t('loading')}</span><StatusSkeleton /></AppShell>;
  if (loadError) return <AppShell hideNav hideFooter><PageState kind="error" title={t('statusLoadErrorTitle')} description={t('statusLoadErrorDesc')} actionLabel={t('tryAgain')} actionOnClick={load} actionVariant="primary" whatsapp /></AppShell>;
  if (!data || data.error) return <AppShell hideNav hideFooter><PageState kind="missing" title={t('notFound')} description={t('notFoundDesc')} actionHref="/" actionLabel={t('backToHome')} actionVariant="primary" whatsapp /></AppShell>;

  const phase = PHASE_OF_STATUS[data.status] ?? 0;
  const offersVisible = OFFERS_VISIBLE.includes(data.status);
  const details = [
    [copy.type, t(`cat_${data.category}`)],
    [copy.location, data.location],
    [copy.description, data.description],
    [copy.start, data.timeline],
    [copy.budget, data.budgetRange],
  ].filter(([, value]) => value && String(value).trim());

  return (
    <AppShell wide>
      <div className="mx-auto max-w-4xl pb-8 pt-2 sm:pt-6">
        <div className="ml-status-head">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 className="mt-3 text-[28px] leading-tight sm:text-[36px]">{copy.phases[Math.min(phase, 3)]}</h1>
          </div>
        </div>

        <section className="mt-8">
          <PhaseTimeline phases={copy.phases} currentIndex={phase} allDone={phase >= 4} label={copy.timelineLabel} />
        </section>

        <section className="ml-status-panel ml-cut mt-8 bg-signature" aria-labelledby="next-step-label">
          <p id="next-step-label" className="text-[12px] font-semibold text-signature-label ltr:uppercase ltr:tracking-[0.2em]">{copy.nextLabel}</p>
          <p className="ml-status-msg">{t(`msg_${data.status}`)}</p>
          {!offersVisible && <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{copy.waitingOffers}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            {offersVisible && (
              <Link href={`/bids/${id}`} className="btn btn-primary min-h-12">
                {copy.viewOffers}<ArrowRight className="btn-arrow h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            )}
            <a href="https://wa.me/97466259219" target="_blank" rel="noreferrer" className="btn btn-secondary min-h-12 bg-card">
              <WhatsAppIcon className="h-4 w-4" />{copy.whatsapp}
            </a>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="brief-title">
          <h2 id="brief-title" className="text-[22px]">{copy.details}</h2>
          <dl className="ml-meta mt-4">
            {details.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd><span dir="auto">{value}</span></dd></div>
            ))}
            {data.files?.length > 0 && (
              <div>
                <dt>{copy.files}</dt>
                <dd className="space-y-1.5">
                  {data.files.map((f, i) => <ResultFileLink key={i} file={f} fallbackLabel={t('files')} actionLabel={t('download')} />)}
                </dd>
              </div>
            )}
          </dl>
          <p className="mt-4 text-[13px] text-muted-foreground">{copy.saveLink}</p>
        </section>
      </div>
    </AppShell>
  );
}
