'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import AdminAttribution from '@/components/AdminAttribution';
import ResultFileLink from '@/components/ResultFileLink';
import StatusBadge from '@/components/StatusBadge';
import PageState from '@/components/PageState';
import { useLang } from '@/lib/LangContext';
import { PROJECT_STATUSES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight, Building2, CalendarClock, ClipboardCheck, Clock, FileCheck2, FileWarning, Plus, ShieldCheck, Loader2, ExternalLink, Trash2, Paperclip, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { MAX_FILE_SIZE_BYTES, fileTooLargeMessage } from '@/lib/uploadLimits';

async function fileToDataURL(file) {
  return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file); });
}

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

const providerOptionLabel = (provider, t) => {
  if (!provider) return '';
  const status = provider.verificationStatus ? t(`cstatus_${provider.verificationStatus}`) : '';
  return `${provider.companyName} - ${providerTypeLabel(provider, t)}${status ? ` - ${status}` : ''}`;
};

const inviteResponseVariant = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (['accepted', 'responded', 'submitted'].includes(normalized)) return 'success';
  if (['declined', 'rejected'].includes(normalized)) return 'destructive';
  if (['pending', 'sent'].includes(normalized)) return 'warning';
  return 'outline';
};

const inviteResponseLabel = (status, lang) => {
  const normalized = String(status || '').toLowerCase();
  const labels = {
    accepted: ['Accepted', 'مقبول'],
    responded: ['Responded', 'تم الرد'],
    submitted: ['Submitted', 'تم التقديم'],
    declined: ['Declined', 'مرفوض'],
    rejected: ['Rejected', 'مرفوض'],
    pending: ['Pending', 'بانتظار الرد'],
    sent: ['Sent', 'تم الإرسال'],
  };
  return labels[normalized]?.[lang === 'ar' ? 1 : 0] || status || '-';
};

export default function AdminProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, dir, lang } = useLang();
  const [d, setD] = useState(null);
  const [allContractors, setAllContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBid, setOpenBid] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [note, setNote] = useState('');
  const [statusDraft, setStatusDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [bidForm, setBidForm] = useState({ contractorId: '', price: '', timeline: '', warranty: '', exclusions: '', notes: '' });
  const [assignContractor, setAssignContractor] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('mlAdmin') !== '1') router.push('/admin');
  }, [router]);

  const load = async () => {
    const [a, b] = await Promise.all([
      fetch(`/api/projects/${id}/full`).then(r => r.json()),
      fetch('/api/contractors').then(r => r.json()),
    ]);
    setD(a); setAllContractors(b); setLoading(false);
    if (a?.project?.status) setStatusDraft(a.project.status);
  };
  useEffect(() => { load(); }, [id]);

  // Warn before closing/refreshing tab when there are unsaved changes
  useEffect(() => {
    const dirty = (statusDraft && d?.project && statusDraft !== d.project.status) || note.trim().length > 0;
    if (!dirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [statusDraft, note, d]);

  if (loading) return <AppShell hideNav hideFooter><PageState kind="loading" title={t('loading')} /></AppShell>;
  if (!d || d.error) return <AppShell hideNav hideFooter><PageState kind="missing" title={t('notFound')} description={t('notFoundDesc')} actionHref="/admin" actionLabel={t('backToList')} actionVariant="primary" /></AppShell>;

  const { project, requester, bids, invites, notes, contractors } = d;
  const cmap = Object.fromEntries(contractors.map(c => [c.id, c]));

  const isDirty = (statusDraft && statusDraft !== project.status) || note.trim().length > 0;

  const tryNavigate = (target) => {
    if (isDirty) { setPendingNav(target); setConfirmLeave(true); }
    else router.push(target);
  };

  const confirmDiscard = () => {
    setConfirmLeave(false);
    const target = pendingNav || '/admin';
    setPendingNav(null);
    router.push(target);
  };

  const changeStatus = (s) => {
    // local draft only — saved via the "Save" button at the bottom
    setStatusDraft(s);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const tasks = [];
      if (statusDraft && statusDraft !== project.status) {
        tasks.push(fetch(`/api/projects/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: statusDraft }) }));
      }
      if (note.trim()) {
        tasks.push(fetch('/api/adminnotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: id, note: note.trim() }) }));
      }
      if (tasks.length === 0) { toast.message(t('saved')); setSaving(false); router.push('/admin'); return; }
      await Promise.all(tasks);
      setNote('');
      toast.success(t('saved'));
      router.push('/admin');
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addNote = async () => {
    if (!note) return;
    await fetch('/api/adminnotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: id, note }) });
    setNote(''); toast.success(t('noteAdded')); load();
  };

  const submitBid = async () => {
    if (!bidForm.contractorId || !bidForm.price) { toast.error(t('requireField')); return; }
    await fetch('/api/bids', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...bidForm, projectId: id }) });
    toast.success(t('bidSubmitted'));
    setOpenBid(false); setBidForm({ contractorId: '', price: '', timeline: '', warranty: '', exclusions: '', notes: '' });
    load();
  };

  const deleteBid = async (bidId) => {
    await fetch(`/api/bids/${bidId}`, { method: 'DELETE' });
    toast.success(t('deleted')); load();
  };

  const submitAssign = async () => {
    if (!assignContractor) return;
    await fetch('/api/bidinvites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: id, contractorId: assignContractor }) });
    toast.success(t('invited')); setOpenAssign(false); setAssignContractor(''); load();
  };

  const deleteInvite = async (inviteId) => {
    await fetch(`/api/bidinvites/${inviteId}`, { method: 'DELETE' });
    toast.success(t('deleted')); load();
  };

  const uploadBidFile = async (bidId, currentAttachments, e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const items = [...(currentAttachments || [])];
    for (const f of files) {
      if (f.size > MAX_FILE_SIZE_BYTES) { toast.error(fileTooLargeMessage(f.name)); continue; }
      const dataUrl = await fileToDataURL(f);
      items.push({ name: f.name, type: f.type, size: f.size, data: dataUrl });
    }
    await fetch(`/api/bids/${bidId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attachments: items }) });
    toast.success(t('saved'));
    e.target.value = '';
    load();
  };

  const deleteProject = async () => {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success(t('deleted')); router.push('/admin'); }
    else toast.error('Failed');
  };

  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <AppShell hideNav hideFooter>
      <Button variant="ghost" onClick={() => tryNavigate('/admin')} className="-ms-3 mb-2 min-h-11 px-3 text-navy"><Back className="h-4 w-4" />{t('backToList')}</Button>
      <div className="mb-3 flex min-w-0 flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="break-words text-xl font-bold text-navy">{t(`cat_${project.category}`)}</h1>
          <div dir="auto" className="mt-0.5 break-words text-xs text-muted-foreground">{project.location}</div>
        </div>
        <StatusBadge status={project.status} className="self-start">{t(`status_${project.status}`)}</StatusBadge>
      </div>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('projectDetailsTitle')}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 break-words">{t('applicationTime')}: {formatAdminTime(project.createdAt, lang)}</span>
          </div>
          <div dir="auto" className="break-words text-sm leading-relaxed">{project.description}</div>
          {project.timeline && <div className="break-words text-xs"><span className="font-semibold">{t('timeline')}:</span><span dir="auto" className="mt-0.5 block">{project.timeline}</span></div>}
          {project.budgetRange && <div className="break-words text-xs"><span className="font-semibold">{t('budget')}:</span><span dir="ltr" className="mt-0.5 block">{project.budgetRange}</span></div>}
          {requester && (
            <div className="mt-2 pt-2 border-t border-border text-xs space-y-0.5">
              <div className="flex flex-wrap items-center gap-x-1 break-words"><span dir="auto" className="font-semibold">{requester.name}</span><span aria-hidden="true">·</span><span dir="auto">{requester.role}</span></div>
              <div dir="auto" className="break-words text-muted-foreground">{requester.company}</div>
              <div className="flex flex-wrap items-center gap-x-1 break-words text-muted-foreground"><span dir="ltr" className="inline-block whitespace-nowrap">{requester.phone}</span><span aria-hidden="true">·</span><span dir="ltr" className="break-all">{requester.email}</span></div>
            </div>
          )}
          <AdminAttribution value={project.marketingAttribution} lang={lang} />
          {project.files && project.files.length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="text-xs font-semibold mb-1.5">{t('uploadedFiles')}</div>
              <div className="space-y-1">
                {project.files.map((f, i) => (
                  <ResultFileLink key={i} file={f} fallbackLabel={t('files')} actionLabel={t('download')} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('changeStatus')}</Label>
          <Select dir={dir} value={statusDraft || project.status} onValueChange={changeStatus}>
            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>{PROJECT_STATUSES.map(s => <SelectItem key={s} value={s}>{t(`status_${s}`)}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" className="w-full mt-1" onClick={() => router.push(`/bids/${id}`)}>
            <ExternalLink className="w-3.5 h-3.5 me-1.5" />{t('viewBids')}
          </Button>
        </CardContent>
      </Card>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Dialog open={openAssign} onOpenChange={setOpenAssign}>
          <DialogTrigger asChild><Button variant="outline" className="h-auto min-h-11 whitespace-normal py-2 text-center"><Plus className="h-4 w-4" />{t('assignProvider')}</Button></DialogTrigger>
          <DialogContent dir={dir}>
            <DialogHeader><DialogTitle>{t('assignProvider')}</DialogTitle></DialogHeader>
            <Select dir={dir} value={assignContractor} onValueChange={setAssignContractor}>
              <SelectTrigger><SelectValue placeholder={t('selectProvider')} /></SelectTrigger>
              <SelectContent>{allContractors.map(c => <SelectItem key={c.id} value={c.id}>{providerOptionLabel(c, t)}</SelectItem>)}</SelectContent>
            </Select>
            <DialogFooter><Button variant="navy" onClick={submitAssign}>{t('save')}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openBid} onOpenChange={setOpenBid}>
          <DialogTrigger asChild>
            <Button variant="brand" className="h-auto min-h-11 whitespace-normal py-2 text-center"><Plus className="h-4 w-4" />{t('addBid')}</Button>
          </DialogTrigger>
          <DialogContent dir={dir}>
            <DialogHeader><DialogTitle>{t('addBidFor')}</DialogTitle></DialogHeader>
            <div className="space-y-2.5">
              <div>
                <Label className="text-xs">{t('selectProvider')}</Label>
                <Select dir={dir} value={bidForm.contractorId} onValueChange={v => setBidForm(f => ({...f, contractorId: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{allContractors.map(c => <SelectItem key={c.id} value={c.id}>{providerOptionLabel(c, t)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">{t('price')}</Label><Input dir="ltr" type="number" value={bidForm.price} onChange={e => setBidForm(f => ({...f, price: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('timelineWeeks')}</Label><Input value={bidForm.timeline} onChange={e => setBidForm(f => ({...f, timeline: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('warranty')}</Label><Input value={bidForm.warranty} onChange={e => setBidForm(f => ({...f, warranty: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('exclusions')}</Label><Input value={bidForm.exclusions} onChange={e => setBidForm(f => ({...f, exclusions: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('notes')}</Label><Textarea value={bidForm.notes} onChange={e => setBidForm(f => ({...f, notes: e.target.value}))} /></div>
            </div>
            <DialogFooter><Button variant="navy" onClick={submitBid}>{t('save')}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="mb-3 text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('invitedProviders')} ({invites.length})</div>
          {invites.length === 0 && <PageState kind="empty" compact title={t('noInvitesYet')} />}
          <div className="space-y-1.5">
            {invites.map(inv => {
              const provider = cmap[inv.contractorId];
              const ProviderIcon = provider?.providerType === 'consultant' ? ClipboardCheck : Building2;
              return (
                <div key={inv.id} className="rounded-2xl border border-border/70 bg-secondary/60 p-3 text-sm">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
                      <ProviderIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span dir="auto" className="block break-words font-semibold leading-snug text-navy">{provider?.companyName || inv.contractorId}</span>
                      {provider && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <Badge variant="secondary" className="max-w-full whitespace-normal text-start text-[12px]">{providerTypeLabel(provider, t)}</Badge>
                          {provider.verificationStatus === 'verified' && (
                            <Badge variant="outline" className="max-w-full gap-1 whitespace-normal text-start text-[12px] text-[#00B59E]">
                              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                              {t('cstatus_verified')}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex min-w-0 items-center justify-between gap-2 border-t border-border/70 pt-3">
                    <Badge variant={inviteResponseVariant(inv.responseStatus)} className="min-w-0 max-w-full whitespace-normal text-start text-[12px]">{inviteResponseLabel(inv.responseStatus, lang)}</Badge>
                    <Button type="button" variant="destructiveOutline" size="icon" onClick={() => deleteInvite(inv.id)} className="shrink-0 sm:h-8 sm:w-8 sm:rounded-lg" title={t('delete')} aria-label={t('delete')}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="mb-3 text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('bids')} ({bids.length})</div>
          {bids.length === 0 && <PageState kind="empty" compact title={t('noAdminBidsYet')} />}
          <div className="space-y-2">
            {bids.map(b => {
              const fileCount = (b.attachments || []).length;
              const provider = cmap[b.contractorId];
              const ProviderIcon = provider?.providerType === 'consultant' ? ClipboardCheck : Building2;
              return (
                <div key={b.id} className="overflow-hidden rounded-2xl border border-border/70 bg-secondary/60">
                  <div className="p-3 sm:p-4">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
                        <ProviderIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span dir="auto" className="block break-words text-sm font-semibold leading-snug text-navy">{provider?.companyName || b.contractorId || t('provider')}</span>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {provider && <Badge variant="secondary" className="max-w-full whitespace-normal text-start text-[12px]">{providerTypeLabel(provider, t)}</Badge>}
                          {provider?.verificationStatus === 'verified' && (
                            <Badge variant="outline" className="max-w-full gap-1 whitespace-normal text-start text-[12px] text-[#00B59E]">
                              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                              {t('cstatus_verified')}
                            </Badge>
                          )}
                          {fileCount > 0 && (
                            <Badge variant="info" className="max-w-full shrink-0 gap-1 whitespace-normal text-start text-[12px]">
                              <Paperclip className="h-3 w-3" aria-hidden="true" />{fileCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                      <div className="min-w-0 rounded-[14px] border border-[#00B59E]/30 bg-[#D0F2EE]/40 p-3 dark:bg-[#00B59E]/10">
                        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-muted-foreground ltr:uppercase ltr:tracking-wide"><Wallet className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="min-w-0 break-words">{t('price')}</span></div>
                        <div className="mt-1 min-w-0 text-navy" dir="ltr">
                          <span className="inline-flex min-w-0 max-w-full items-baseline gap-1">
                            <span className="min-w-0 break-all text-[20px] font-extrabold leading-none tabular-nums sm:text-[22px]">{b.price.toLocaleString()}</span>
                            <span className="shrink-0 text-xs font-semibold text-muted-foreground">{t('currencyQar')}</span>
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 rounded-[14px] border border-border/70 bg-card p-3">
                        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-muted-foreground ltr:uppercase ltr:tracking-wide"><Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="min-w-0 break-words">{t('timeline')}</span></div>
                        <div dir="auto" className="mt-1 break-words text-sm font-semibold leading-snug text-navy">{b.timeline || '-'}</div>
                      </div>
                    </div>

                    {(b.warranty || b.exclusions || b.notes) && (
                      <div className="mt-3 space-y-1.5">
                        {b.warranty && <div className="flex items-start gap-2 text-[13px] leading-relaxed"><FileCheck2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00B59E]" aria-hidden="true" /><span className="min-w-0 break-words"><span className="font-semibold text-navy">{t('warranty')}:</span><span dir="auto" className="mt-0.5 block">{b.warranty}</span></span></div>}
                        {b.exclusions && <div className="flex items-start gap-2 text-[13px] leading-relaxed"><FileWarning className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFB638]" aria-hidden="true" /><span className="min-w-0 break-words"><span className="font-semibold text-navy">{t('exclusions')}:</span><span dir="auto" className="mt-0.5 block">{b.exclusions}</span></span></div>}
                        {b.notes && <div dir="auto" className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-muted-foreground">{b.notes}</div>}
                      </div>
                    )}

                    {fileCount > 0 && (
                      <div className="mt-3 border-t border-border/70 pt-3">
                        <div className="mb-1.5 flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">
                          <Paperclip className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="min-w-0 break-words">{t('bidFiles')}</span>
                        </div>
                        <div className="space-y-1.5">
                          {b.attachments.map((f, i) => (
                            <ResultFileLink key={i} file={f} fallbackLabel={t('files')} actionLabel={t('download')} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/70 pt-3">
                      <label className="flex h-auto min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-center text-[12px] font-semibold leading-snug text-navy transition-[border-color,background-color] hover:border-[#00B59E]/35 hover:bg-[#D0F2EE]/35 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#00B59E]/30 dark:hover:bg-[#00B59E]/10" title={t('uploadAgreement')} aria-label={t('uploadAgreement')}>
                        <Paperclip className="h-3.5 w-3.5 shrink-0" />
                        <span className="min-w-0 break-words">{t('uploadAgreement')}</span>
                        <input type="file" className="sr-only" accept="image/*,application/pdf" onChange={(e) => uploadBidFile(b.id, b.attachments, e)} />
                      </label>
                      <Button type="button" variant="destructiveOutline" size="sm" onClick={() => deleteBid(b.id)} className="h-auto min-h-11 w-full whitespace-normal py-2 text-[12px] leading-snug" title={t('delete')} aria-label={t('delete')}>
                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                        <span className="min-w-0 break-words">{t('delete')}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="mb-2 text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('adminNotes')}</div>
          <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t('addNote')} className="min-h-[60px]" />
          <div className="mt-3 space-y-1.5">
            {notes.map(n => (
              <div key={n.id} className="rounded-xl border border-border/70 bg-secondary/60 p-3 text-xs">
                <div className="break-words text-[12px] text-muted-foreground">{formatAdminTime(n.createdAt, lang)}</div>
                <div dir="auto" className="mt-0.5 whitespace-pre-wrap break-words text-[13px] leading-relaxed text-navy">{n.note}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button variant="navy" size="lg" onClick={saveAll} disabled={saving} aria-busy={saving} className="mt-4 w-full text-base">
        {saving ? <><Loader2 className="animate-spin" aria-hidden="true" />{t('saving')}</> : t('save')}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructiveOutline" className="mt-4 w-full">
            <Trash2 className="w-4 h-4 me-1.5" />{t('deleteProject')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#EF4444]">{t('deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteConfirmDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteProject}>{t('delete')}</AlertDialogAction>
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
            <AlertDialogCancel onClick={() => setPendingNav(null)}>{t('stay')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDiscard}>{t('discardLeave')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
