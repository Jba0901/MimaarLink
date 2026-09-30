'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import ResultFileLink from '@/components/ResultFileLink';
import PageState from '@/components/PageState';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';
import { ArrowRight, Check, Loader2, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { providerDisplayName, providerTypeLabel } from '@/lib/providerPresentation.mjs';

const COPY = {
  en: {
    eyebrow: 'Offer comparison',
    title: 'Compare your offers',
    sub: 'Every firm priced the same brief. Check what each one excludes before you choose.',
    sortBy: 'Sort by',
    sortPrice: 'Price',
    sortDuration: 'Duration',
    swipe: 'Swipe to see every offer',
    duration: 'Duration',
    warranty: 'Warranty',
    exclusions: 'Exclusions',
    notes: 'Notes',
    none: 'None stated',
    vetted: 'Vetted',
    selected: 'Selected',
    choose: 'Shortlist this offer',
    meeting: 'Request a meeting',
    meetingRequested: 'Meeting requested. Our team will coordinate with you.',
    emptyTitle: 'No offers yet',
    emptyBody: 'Offers will appear here as firms respond. We will also message you on WhatsApp.',
    backToStatus: 'Back to project status',
    whatsapp: 'Message us on WhatsApp',
    money: (n) => `QAR ${n}`,
  },
  ar: {
    eyebrow: 'مقارنة العروض',
    title: 'قارن العروض',
    sub: 'سعّرت كل الشركات الوصف نفسه. راجع ما يستثنيه كل عرض قبل أن تختار.',
    sortBy: 'الترتيب حسب',
    sortPrice: 'السعر',
    sortDuration: 'المدة',
    swipe: 'اسحب لمشاهدة كل العروض',
    duration: 'المدة',
    warranty: 'الضمان',
    exclusions: 'الاستثناءات',
    notes: 'ملاحظات',
    none: 'لم يُذكر',
    vetted: 'معتمد',
    selected: 'العرض المختار',
    choose: 'رشّح هذا العرض',
    meeting: 'اطلب اجتماعًا',
    meetingRequested: 'تم طلب الاجتماع، وسيتواصل فريقنا معك.',
    emptyTitle: 'لا توجد عروض بعد',
    emptyBody: 'ستظهر العروض هنا فور رد الشركات، وسنراسلك أيضًا عبر واتساب.',
    backToStatus: 'العودة إلى حالة المشروع',
    whatsapp: 'راسلنا على واتساب',
    money: (n) => `${n} ر.ق`,
  },
};

// Durations are free text ("6 weeks", "٤٥ يوم"); read a number and unit for sorting, unknowns last.
function durationInDays(text) {
  const normalized = String(text || '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return Number.POSITIVE_INFINITY;
  const n = parseFloat(match[1]);
  if (/month|شهر|أشهر/i.test(normalized)) return n * 30;
  if (/week|أسبوع|أسابيع/i.test(normalized)) return n * 7;
  return n;
}

// Which offer the owner shortlisted is kept on this device; the server records the project status.
const selectionKey = (projectId) => `ml:selected-offer:${projectId}`;
const readSelection = (projectId) => { try { return window.localStorage.getItem(selectionKey(projectId)); } catch { return null; } };
const writeSelection = (projectId, contractorId) => { try { window.localStorage.setItem(selectionKey(projectId), contractorId); } catch {} };

function OffersSkeleton() {
  return (
    <div className="mx-auto max-w-6xl py-4" aria-hidden="true">
      <div className="h-3 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-9 w-1/2 animate-pulse rounded-[6px] bg-muted" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <div key={i} className="h-80 animate-pulse rounded-[6px] bg-muted" />)}</div>
    </div>
  );
}

export default function BidsPage() {
  const { projectId } = useParams();
  const { t, lang } = useLang();
  const copy = COPY[lang === 'ar' ? 'ar' : 'en'];
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [selectedId, setSelectedId] = useState(null);
  const [meetingFor, setMeetingFor] = useState(null);

  const load = async ({ showErrorState = false } = {}) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/bids`);
      if (response.status === 404) {
        setD({ error: true });
        setLoadError(false);
        return false;
      }
      if (!response.ok) throw new Error('Bid comparison failed to load');
      setD(await response.json());
      setLoadError(false);
      return true;
    } catch {
      if (showErrorState) setLoadError(true);
      return false;
    } finally {
      if (showErrorState) setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedId(readSelection(projectId));
    load({ showErrorState: true });
  }, [projectId]);

  const retryLoad = () => {
    setLoadError(false);
    setLoading(true);
    load({ showErrorState: true });
  };

  if (loading) return <AppShell hideNav hideFooter wide><span className="sr-only" role="status">{t('loading')}</span><OffersSkeleton /></AppShell>;
  if (loadError) return <AppShell hideNav hideFooter><PageState kind="error" title={t('bidLoadErrorTitle')} description={t('bidLoadErrorDesc')} actionLabel={t('tryAgain')} actionOnClick={retryLoad} actionVariant="primary" /></AppShell>;
  if (!d || d.error) return <AppShell hideNav hideFooter><PageState kind="missing" title={t('notFound')} description={t('notFoundDesc')} actionHref="/" actionLabel={t('backToHome')} actionVariant="primary" /></AppShell>;

  const action = async (act, contractorId) => {
    if (pendingAction) return;
    setPendingAction(`${act}:${contractorId}`);
    try {
      const response = await fetch('/api/projects/shortlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId, contractorId, action: act }) });
      if (!response.ok) throw new Error('Bid action failed');
      writeSelection(projectId, contractorId);
      setSelectedId(contractorId);
      if (act === 'meeting') setMeetingFor(contractorId);
      toast.success(act === 'meeting' ? t('bidRequest') : t('shortlistDone'));
      await load();
    } catch {
      toast.error(t('actionFailed'));
    } finally {
      setPendingAction(null);
    }
  };

  const bids = [...d.bids].sort((a, b) => (sortBy === 'price' ? a.price - b.price : durationInDays(a.timeline) - durationInDays(b.timeline) || a.price - b.price));
  const statusLink = `/project/${projectId}`;

  if (bids.length === 0) {
    return (
      <AppShell hideNav hideFooter>
        <PageState kind="empty" title={copy.emptyTitle} description={copy.emptyBody} actionHref={statusLink} actionLabel={copy.backToStatus} actionVariant="primary" />
        <div className="mx-auto -mt-4 flex max-w-md justify-center pb-8">
          <a href="https://wa.me/97466259219" target="_blank" rel="noreferrer" className="btn btn-secondary"><WhatsAppIcon className="h-4 w-4" />{copy.whatsapp}</a>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell wide>
      <div className="mx-auto max-w-6xl pb-10 pt-2 sm:pt-6">
        <div>
          <Link href={statusLink} className="inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-muted-foreground hover:text-navy">
            <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" aria-hidden="true" />{copy.backToStatus}
          </Link>
        </div>
        <p className="eyebrow mt-4">{copy.eyebrow}</p>
        <h1 className="mt-3 text-[28px] leading-tight sm:text-[36px]">{copy.title}</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{copy.sub}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="ml-segment" role="group" aria-label={copy.sortBy}>
            <span className="text-[13px] text-muted-foreground">{copy.sortBy}</span>
            {[['price', copy.sortPrice], ['duration', copy.sortDuration]].map(([value, label]) => (
              <button key={value} type="button" aria-pressed={sortBy === value} onClick={() => setSortBy(value)}>{label}</button>
            ))}
          </div>
          {bids.length > 1 && <p className="text-[13px] text-muted-foreground md:hidden">{copy.swipe}</p>}
        </div>

        <div className="ml-offers" data-count={bids.length}>
          {bids.map((b) => {
            const c = d.contractors[b.contractorId] || {};
            const selected = selectedId === b.contractorId;
            const busyChoose = pendingAction === `shortlist:${b.contractorId}`;
            const busyMeeting = pendingAction === `meeting:${b.contractorId}`;
            const meetingDone = selected && (meetingFor === b.contractorId || d.project?.status === 'meeting_arranged');
            return (
              <article key={b.id} className={`ml-offer ml-offer-full ${selected ? 'is-selected ml-cut' : ''}`} aria-label={`${providerDisplayName(c, t)}${selected ? `, ${copy.selected}` : ''}`}>
                <div className="ml-offer-head">
                  <span className="ml-offer-firm" dir="auto">{providerDisplayName(c, t)}</span>
                  {selected
                    ? <span className="ml-offer-selected">{copy.selected}</span>
                    : c.verificationStatus === 'verified' && <span className="ml-vetted"><Check size={12} strokeWidth={2.5} aria-hidden="true" />{copy.vetted}</span>}
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">{providerTypeLabel(c, t)}{c.serviceAreas ? <> · <span dir="auto">{c.serviceAreas}</span></> : null}</p>
                <p className="ml-offer-price"><bdi>{copy.money(Number(b.price || 0).toLocaleString('en-US'))}</bdi></p>
                <dl className="ml-offer-rows">
                  <div><dt>{copy.duration}</dt><dd dir="auto">{b.timeline || copy.none}</dd></div>
                  <div><dt>{copy.warranty}</dt><dd dir="auto">{b.warranty || copy.none}</dd></div>
                  <div><dt>{copy.exclusions}</dt><dd dir="auto" className={b.exclusions ? 'ml-offer-excl' : undefined}>{b.exclusions || copy.none}</dd></div>
                </dl>
                {b.notes && <p dir="auto" className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-muted-foreground"><span className="font-medium text-navy">{copy.notes}: </span>{b.notes}</p>}
                {b.attachments?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-1.5 flex items-center gap-1.5 text-[13px] text-muted-foreground"><Paperclip className="h-3.5 w-3.5" aria-hidden="true" />{t('bidFiles')}</p>
                    <div className="space-y-1.5">{b.attachments.map((f, i) => <ResultFileLink key={i} file={f} fallbackLabel={t('files')} actionLabel={t('openLink')} newTab />)}</div>
                  </div>
                )}
                <div className="ml-offer-actions">
                  {!selected && (
                    <button type="button" className="btn btn-secondary w-full" disabled={Boolean(pendingAction)} aria-busy={busyChoose || undefined} onClick={() => action('shortlist', b.contractorId)}>
                      {busyChoose && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}{copy.choose}
                    </button>
                  )}
                  {selected && !meetingDone && (
                    <button type="button" className="btn btn-primary w-full" disabled={Boolean(pendingAction)} aria-busy={busyMeeting || undefined} onClick={() => action('meeting', b.contractorId)}>
                      {busyMeeting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}{copy.meeting}
                    </button>
                  )}
                  {meetingDone && <p className="text-[14px] font-medium text-signature-fg">{copy.meetingRequested}</p>}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <p className="text-[14px] text-muted-foreground">{t('onlyVerified')}</p>
          <a href="https://wa.me/97466259219" target="_blank" rel="noreferrer" className="btn btn-secondary ms-auto"><WhatsAppIcon className="h-4 w-4" />{copy.whatsapp}</a>
        </div>
      </div>
    </AppShell>
  );
}
