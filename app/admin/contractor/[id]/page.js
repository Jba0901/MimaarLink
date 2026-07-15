'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import AdminAttribution from '@/components/AdminAttribution';
import PageState from '@/components/PageState';
import { useLang } from '@/lib/LangContext';
import { CONTRACTOR_STATUSES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight, Building2, CalendarClock, ClipboardCheck, Loader2, FileText, ShieldCheck, Trash2, Copy, ExternalLink } from 'lucide-react';
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

  if (loading) return <AppShell><PageState kind="loading" title={t('loading')} /></AppShell>;
  if (!c || c.error) return <AppShell><PageState kind="missing" title={t('notFound')} actionHref="/admin?tab=contractors" actionLabel={t('backToList')} /></AppShell>;

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
    <AppShell>
      <button onClick={tryNavigate} className="mb-3 flex min-h-11 items-center gap-1 text-sm text-navy"><Back className="w-4 h-4" />{t('backToList')}</button>

      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-xl font-bold text-navy">{c.companyName}</h1>
        {c.verificationStatus === 'verified' && <ShieldCheck className="w-5 h-5" style={{ color: '#00B59E' }} />}
      </div>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-1.5 text-sm">
          <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            <span>{t('applicationTime')}: {formatAdminTime(c.createdAt, lang)}</span>
          </div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold text-navy">
            <TypeIcon className="h-3.5 w-3.5" />
            {providerTypeLabel(c, t)}
          </div>
          <div><span className="font-semibold">{t('crNumber')}:</span> {c.crNumber}</div>
          <div><span className="font-semibold">{t('contactPerson')}:</span> {c.contactPerson}</div>
          <div><span className="font-semibold">{t('whatsapp')}:</span> {c.whatsapp}</div>
          {c.email && <div><span className="font-semibold">{t('email')}:</span> {c.email}</div>}
          <div><span className="font-semibold">{t('serviceAreas')}:</span> {c.serviceAreas}</div>
          <div><span className="font-semibold">{t('projectSize')}:</span> {c.projectSizeRange}</div>
          {isConsultant && (
            <div><span className="font-semibold">{t('consultantGrade')}:</span> {consultantGradeLabel(c.consultantGrade, t)}</div>
          )}
          <div className="flex flex-wrap gap-1 pt-1">
            {serviceKeys.map(cat => (
              <span key={cat} className="text-[10px] bg-secondary text-navy px-1.5 py-0.5 rounded">{t(`cat_${cat}`)}</span>
            ))}
          </div>
          {serviceKeys.includes('other') && c.otherCategoryDesc && (
            <div className="pt-2 mt-1 border-t border-border">
              <div className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">{t('otherCategoryLabel')}</div>
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

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{t('providerStatusLink')}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-1.5">
            <code className="col-span-2 min-w-0 truncate text-[11px] text-navy sm:flex-1">/contractor-status/{id}</code>
            <Button variant="outline" size="sm" className="h-11 w-full px-3 text-[11px] sm:h-9 sm:w-auto sm:px-2" onClick={copyContractorLink}>
              <Copy className="w-3.5 h-3.5" />
              <span className="ms-1">{t('copyLink')}</span>
            </Button>
            <Button variant="outline" size="sm" className="h-11 w-full px-3 text-[11px] sm:h-9 sm:w-auto sm:px-2" onClick={() => window.open(`/contractor-status/${id}`, '_blank', 'noopener,noreferrer')}>
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="ms-1">{t('openLink')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('documentChecklist')}</div>
          <div className="space-y-1.5">
            {documentChecklist.map((doc) => {
              const present = Boolean(documentChecksDraft[doc.key]);
              return (
                <div key={doc.key} className="flex flex-col items-start gap-2 rounded-xl bg-secondary px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium text-navy">{doc.label}</span>
                  <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setDocumentPresent(doc.key, true)}
                      className={`min-h-11 rounded-full px-3 text-[11px] font-semibold transition sm:min-h-9 ${present ? 'text-[#152B54]' : 'bg-white text-muted-foreground hover:text-navy'}`}
                      style={present ? { background: '#00B59E' } : {}}
                    >
                      {t('present')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocumentPresent(doc.key, false)}
                      className={`min-h-11 rounded-full px-3 text-[11px] font-semibold transition sm:min-h-9 ${!present ? 'text-[#152B54]' : 'bg-white text-muted-foreground hover:text-navy'}`}
                      style={!present ? { background: '#FFB638' } : {}}
                    >
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
                <a key={i} href={f.data} download={f.name} className="flex min-h-11 items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-xs text-navy">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-[10px] text-muted-foreground">{f.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={saveAll} disabled={saving} className="w-full mt-4 h-12 text-base" style={{ background: '#152B54' }}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('save')}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full mt-4 h-11 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="w-4 h-4 me-1.5" />{t('deleteContractor')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteConfirmDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteContractor} className="bg-red-600 hover:bg-red-700">{t('delete')}</AlertDialogAction>
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
            <AlertDialogAction onClick={() => router.push('/admin?tab=contractors')} className="bg-red-600 hover:bg-red-700">{t('discardLeave')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
