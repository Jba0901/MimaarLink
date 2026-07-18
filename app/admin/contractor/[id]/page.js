'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import AdminPublicLinkActions from '@/components/AdminPublicLinkActions';
import AdminAttribution from '@/components/AdminAttribution';
import ResultFileLink from '@/components/ResultFileLink';
import StatusBadge from '@/components/StatusBadge';
import PageState from '@/components/PageState';
import { useLang } from '@/lib/LangContext';
import { CONTRACTOR_STATUSES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight, Building2, CalendarClock, Check, ClipboardCheck, Loader2, ShieldCheck, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const formatAdminTime = (value, lang = 'en') => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-QA' : 'en-QA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const providerTypeLabel = (provider, t) => (
  provider?.providerType === 'consultant' ? t('providerTypeConsultant') : t('providerTypeContractor')
);

const consultantGradeLabel = (grade, t) => {
  if (grade === 'grade_a') return t('gradeA');
  if (grade === 'grade_b') return t('gradeB');
  if (grade === 'grade_c') return t('gradeC');
  return t('gradeUnknown');
};

const providerServices = (provider) => (
  provider?.providerType === 'consultant' ? (provider.consultantServices || []) : (provider.categories || [])
);

export default function AdminContractorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, dir, lang } = useLang();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDraft, setStatusDraft] = useState('');
  const [documentChecksDraft, setDocumentChecksDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('mlAdmin') !== '1') router.push('/admin');
  }, [router]);

  const load = () => fetch(`/api/contractors/${id}`).then(r => r.json()).then(j => {
    setC(j); setLoading(false);
    if (j?.verificationStatus) setStatusDraft(j.verificationStatus);
    if (j?.documentChecks) setDocumentChecksDraft(normalizeDocumentChecks(j.documentChecks));
  });
  useEffect(() => { load(); }, [id]);

  // Warn before closing tab when there are unsaved changes
  useEffect(() => {
    const dirty = isDirty();
    if (!dirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [statusDraft, documentChecksDraft, c]);

  if (loading) return <AppShell hideNav hideFooter><PageState kind="loading" title={t('loading')} /></AppShell>;
  if (!c || c.error) return <AppShell hideNav hideFooter><PageState kind="missing" title={t('notFound')} actionHref="/admin?tab=contractors" actionLabel={t('backToList')} /></AppShell>;

  const saveAll = async () => {
    if (!isDirty()) { toast.message(t('saved')); router.push('/admin?tab=contractors'); return; }
    setSaving(true);
    try {
      await fetch(`/api/contractors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: statusDraft || c.verificationStatus,
          documentChecks: normalizeDocumentChecks(documentChecksDraft),
        }),
      });
      toast.success(t('saved'));
      router.push('/admin?tab=contractors');
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const deleteContractor = async () => {
    const res = await fetch(`/api/contractors/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success(t('deleted')); router.push('/admin'); }
    else toast.error('Failed');
  };

  const tryNavigate = () => {
    if (isDirty()) setConfirmLeave(true);
    else router.push('/admin?tab=contractors');
  };

  const contractorPublicUrl = () => {
    if (typeof window === 'undefined') return `/contractor-status/${id}`;
    return `${window.location.origin}/contractor-status/${id}`;
  };

  const copyContractorLink = async () => {
    await navigator.clipboard.writeText(contractorPublicUrl());
    toast.success(t('linkCopied'));
  };

  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft;
  const isConsultant = c.providerType === 'consultant';
  const TypeIcon = isConsultant ? ClipboardCheck : Building2;
  const serviceKeys = providerServices(c);
  const documentChecklist = [
    { key: 'cr', label: t('uploadCR'), required: true },
    { key: 'trade', label: t('uploadTrade'), required: false },
    { key: 'establishment', label: t('uploadEstablishment'), required: false },
  ];

  function normalizeDocumentChecks(checks = {}) {
    return {
      cr: Boolean(checks.cr),
      trade: Boolean(checks.trade),
      establishment: Boolean(checks.establishment),
    };
  }

  function isDirty() {
    if (!c) return false;
    const statusChanged = Boolean(statusDraft && statusDraft !== c.verificationStatus);
    const currentChecks = JSON.stringify(normalizeDocumentChecks(c.documentChecks));
    const draftChecks = JSON.stringify(normalizeDocumentChecks(documentChecksDraft));
    return statusChanged || currentChecks !== draftChecks;
  }

  const setDocumentPresent = (key, present) => {
    setDocumentChecksDraft((checks) => ({ ...normalizeDocumentChecks(checks), [key]: present }));
  };

  return (
    <AppShell hideNav hideFooter>
      <Button variant="ghost" onClick={tryNavigate} className="-ms-3 mb-2 min-h-11 px-3 text-navy"><Back className="h-4 w-4" />{t('backToList')}</Button>

      <div className="mb-3 flex min-w-0 flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="min-w-0 break-words text-xl font-bold text-navy">{c.companyName}</h1>
          {c.verificationStatus === 'verified' && <ShieldCheck className="h-5 w-5 shrink-0 text-[#00B59E]" aria-hidden="true" />}
        </div>
        <StatusBadge status={c.verificationStatus} className="self-start">{t(`cstatus_${c.verificationStatus}`)}</StatusBadge>
      </div>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-1.5 text-sm">
          <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 break-words">{t('applicationTime')}: {formatAdminTime(c.createdAt, lang)}</span>
          </div>
          <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[12px] font-semibold text-navy">
            <TypeIcon className="h-3.5 w-3.5 shrink-0" />
            {providerTypeLabel(c, t)}
          </div>
          <dl className="grid gap-x-4 gap-y-3 pt-1 sm:grid-cols-2">
            <div><dt className="text-[12px] text-muted-foreground">{t('crNumber')}</dt><dd className="mt-0.5 break-words font-semibold text-navy">{c.crNumber}</dd></div>
            <div><dt className="text-[12px] text-muted-foreground">{t('contactPerson')}</dt><dd className="mt-0.5 break-words font-semibold text-navy">{c.contactPerson}</dd></div>
            <div><dt className="text-[12px] text-muted-foreground">{t('whatsapp')}</dt><dd className="mt-0.5 font-semibold text-navy" dir="ltr">{c.whatsapp}</dd></div>
            {c.email && <div><dt className="text-[12px] text-muted-foreground">{t('email')}</dt><dd className="mt-0.5 break-all font-semibold text-navy" dir="ltr">{c.email}</dd></div>}
            <div><dt className="text-[12px] text-muted-foreground">{t('serviceAreas')}</dt><dd className="mt-0.5 break-words font-semibold text-navy">{c.serviceAreas}</dd></div>
            <div><dt className="text-[12px] text-muted-foreground">{t('projectSize')}</dt><dd className="mt-0.5 break-words font-semibold text-navy">{c.projectSizeRange}</dd></div>
            {isConsultant && <div><dt className="text-[12px] text-muted-foreground">{t('consultantGrade')}</dt><dd className="mt-0.5 break-words font-semibold text-navy">{consultantGradeLabel(c.consultantGrade, t)}</dd></div>}
          </dl>
          <div className="flex flex-wrap gap-1 pt-1">
            {serviceKeys.map(cat => (
              <span key={cat} className="max-w-full break-words rounded-full bg-secondary px-2 py-1 text-[12px] font-medium text-navy">{t(`cat_${cat}`)}</span>
            ))}
          </div>
          {serviceKeys.includes('other') && c.otherCategoryDesc && (
            <div className="pt-2 mt-1 border-t border-border">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{t('otherCategoryLabel')}</div>
              <div className="text-[12px] text-navy mt-0.5 whitespace-pre-wrap leading-relaxed">{c.otherCategoryDesc}</div>
            </div>
          )}
          <AdminAttribution value={c.marketingAttribution} lang={lang} />
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4">
          <Label className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">{t('verificationStatus')}</Label>
          <Select value={statusDraft || c.verificationStatus} onValueChange={setStatusDraft}>
            <SelectTrigger className="mt-2 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>{CONTRACTOR_STATUSES.map(s => <SelectItem key={s} value={s}>{t(`cstatus_${s}`)}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      <AdminPublicLinkActions
        className="mb-3"
        label={t('providerStatusLink')}
        path={`/contractor-status/${id}`}
        copyLabel={t('copyLink')}
        openLabel={t('openLink')}
        onCopy={copyContractorLink}
        onOpen={() => window.open(`/contractor-status/${id}`, '_blank', 'noopener,noreferrer')}
      />

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('documentChecklist')}</div>
          <div className="space-y-1.5">
            {documentChecklist.map((doc) => {
              const present = Boolean(documentChecksDraft[doc.key]);
              return (
                <div key={doc.key} className="flex flex-col items-start gap-2.5 rounded-xl bg-secondary px-3 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <span className="break-words text-[13px] font-semibold leading-snug text-navy">{doc.label}</span>
                  <div className="grid w-full grid-cols-2 gap-2 sm:w-auto" role="group" aria-label={doc.label}>
                    <button
                      type="button"
                      onClick={() => setDocumentPresent(doc.key, true)}
                      aria-pressed={present}
                      className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-3 text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/35 sm:min-h-9 ${present ? 'border-[#00B59E]/55 bg-[#00B59E] text-[#152B54] shadow-soft' : 'border-border bg-card text-muted-foreground hover:border-[#00B59E]/35 hover:text-navy'}`}
                    >
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {t('present')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocumentPresent(doc.key, false)}
                      aria-pressed={!present}
                      className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-3 text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB638]/45 sm:min-h-9 ${!present ? 'border-[#FFB638]/65 bg-[#FFB638] text-[#152B54] shadow-soft' : 'border-border bg-card text-muted-foreground hover:border-[#FFB638]/45 hover:text-navy'}`}
                    >
                      <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {t('missing')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {c.documents && c.documents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('documents')}</div>
            <div className="space-y-1.5">
              {c.documents.map((f, i) => (
                <ResultFileLink key={i} file={f} fallbackLabel={t('files')} secondaryLabel={f.label} actionLabel={t('download')} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button variant="navy" size="lg" onClick={saveAll} disabled={saving} aria-busy={saving} className="mt-4 w-full text-base">
        {saving ? <><Loader2 className="animate-spin" aria-hidden="true" />{t('saving')}</> : t('save')}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructiveOutline" className="mt-4 w-full">
            <Trash2 className="w-4 h-4 me-1.5" />{t('deleteContractor')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#EF4444]">{t('deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteConfirmDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteContractor}>{t('delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmLeave} onOpenChange={setConfirmLeave}>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('unsavedTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('unsavedDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('stay')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => router.push('/admin?tab=contractors')}>{t('discardLeave')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
