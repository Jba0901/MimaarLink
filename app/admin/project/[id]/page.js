'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
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
import { ArrowLeft, ArrowRight, CalendarClock, Plus, ShieldCheck, FileText, Loader2, ExternalLink, Trash2, Paperclip } from 'lucide-react';
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

  if (loading) return <AppShell><div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div></AppShell>;
  if (!d || d.error) return <AppShell><p>Not found</p></AppShell>;

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
    <AppShell>
      <button onClick={() => tryNavigate('/admin')} className="flex items-center gap-1 text-sm text-navy mb-3"><Back className="w-4 h-4" />{t('backToList')}</button>
      <h1 className="text-xl font-bold text-navy">{t(`cat_${project.category}`)}</h1>
      <div className="text-xs text-muted-foreground mb-3">{project.location}</div>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{t('projectDetailsTitle')}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            <span>{t('applicationTime')}: {formatAdminTime(project.createdAt, lang)}</span>
          </div>
          <div className="text-sm leading-relaxed">{project.description}</div>
          {project.timeline && <div className="text-xs"><span className="font-semibold">{t('timeline')}:</span> {project.timeline}</div>}
          {project.budgetRange && <div className="text-xs"><span className="font-semibold">{t('budget')}:</span> {project.budgetRange}</div>}
          {requester && (
            <div className="mt-2 pt-2 border-t border-border text-xs space-y-0.5">
              <div><span className="font-semibold">{requester.name}</span> · {requester.role}</div>
              <div className="text-muted-foreground">{requester.company}</div>
              <div className="text-muted-foreground">{requester.phone} · {requester.email}</div>
            </div>
          )}
          {project.files && project.files.length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="text-xs font-semibold mb-1.5">{t('uploadedFiles')}</div>
              <div className="space-y-1">
                {project.files.map((f, i) => (
                  <a key={i} href={f.data} download={f.name} className="flex items-center gap-2 text-xs text-navy bg-secondary rounded-lg px-2 py-1.5">
                    <FileText className="w-3.5 h-3.5" /><span className="truncate">{f.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-2">
          <Label className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">{t('changeStatus')}</Label>
          <Select value={statusDraft || project.status} onValueChange={changeStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{PROJECT_STATUSES.map(s => <SelectItem key={s} value={s}>{t(`status_${s}`)}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" className="w-full mt-1" onClick={() => router.push(`/bids/${id}`)}>
            <ExternalLink className="w-3.5 h-3.5 me-1.5" />{t('viewBids')}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Dialog open={openAssign} onOpenChange={setOpenAssign}>
          <DialogTrigger asChild><Button variant="outline" className="h-11"><Plus className="w-4 h-4 me-1" />{t('assignProvider')}</Button></DialogTrigger>
          <DialogContent dir={dir}>
            <DialogHeader><DialogTitle>{t('assignProvider')}</DialogTitle></DialogHeader>
            <Select value={assignContractor} onValueChange={setAssignContractor}>
              <SelectTrigger><SelectValue placeholder={t('selectProvider')} /></SelectTrigger>
              <SelectContent>{allContractors.map(c => <SelectItem key={c.id} value={c.id}>{providerOptionLabel(c, t)}</SelectItem>)}</SelectContent>
            </Select>
            <DialogFooter><Button onClick={submitAssign}>{t('save')}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openBid} onOpenChange={setOpenBid}>
          <DialogTrigger asChild>
            <Button className="h-11" style={{ background: '#0EB59E' }}><Plus className="w-4 h-4 me-1" />{t('addBid')}</Button>
          </DialogTrigger>
          <DialogContent dir={dir} className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('addBidFor')}</DialogTitle></DialogHeader>
            <div className="space-y-2.5">
              <div>
                <Label className="text-xs">{t('selectProvider')}</Label>
                <Select value={bidForm.contractorId} onValueChange={v => setBidForm(f => ({...f, contractorId: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{allContractors.map(c => <SelectItem key={c.id} value={c.id}>{providerOptionLabel(c, t)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">{t('price')}</Label><Input type="number" value={bidForm.price} onChange={e => setBidForm(f => ({...f, price: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('timelineWeeks')}</Label><Input value={bidForm.timeline} onChange={e => setBidForm(f => ({...f, timeline: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('warranty')}</Label><Input value={bidForm.warranty} onChange={e => setBidForm(f => ({...f, warranty: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('exclusions')}</Label><Input value={bidForm.exclusions} onChange={e => setBidForm(f => ({...f, exclusions: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('notes')}</Label><Textarea value={bidForm.notes} onChange={e => setBidForm(f => ({...f, notes: e.target.value}))} /></div>
            </div>
            <DialogFooter><Button onClick={submitBid} style={{ background: '#0D1B2A' }}>{t('save')}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('invitedProviders')} ({invites.length})</div>
          {invites.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
          <div className="space-y-1.5">
            {invites.map(inv => (
              <div key={inv.id} className="text-sm flex items-center justify-between bg-secondary rounded-lg p-2">
                <div className="min-w-0 flex-1 me-2">
                  <span className="block text-navy truncate">{cmap[inv.contractorId]?.companyName || inv.contractorId}</span>
                  {cmap[inv.contractorId] && (
                    <span className="block text-[10px] text-muted-foreground">{providerTypeLabel(cmap[inv.contractorId], t)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant="outline" className="text-[10px]">{inv.responseStatus}</Badge>
                  <button onClick={() => deleteInvite(inv.id)} className="w-7 h-7 rounded-md bg-white hover:bg-red-50 flex items-center justify-center text-red-600" title={t('delete')}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('bids')} ({bids.length})</div>
          {bids.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
          <div className="space-y-2">
            {bids.map(b => {
              const fileCount = (b.attachments || []).length;
              return (
                <div key={b.id} className="bg-secondary rounded-lg p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-navy text-sm truncate">{cmap[b.contractorId]?.companyName}</span>
                        {cmap[b.contractorId] && (
                          <span className="text-[10px] bg-white text-navy px-1.5 py-0.5 rounded-full">{providerTypeLabel(cmap[b.contractorId], t)}</span>
                        )}
                        {fileCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] bg-white text-navy px-1.5 py-0.5 rounded-full">
                            <Paperclip className="w-2.5 h-2.5" />{fileCount}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{b.price.toLocaleString()} QAR · {b.timeline}</div>
                      {fileCount > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {b.attachments.map((f, i) => (
                            <a key={i} href={f.data} download={f.name} className="flex items-center gap-1.5 text-[11px] text-navy bg-white rounded px-2 py-1">
                              <FileText className="w-3 h-3" /><span className="truncate">{f.name}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <label className="w-8 h-8 rounded-md bg-white hover:bg-background flex items-center justify-center cursor-pointer text-navy" title={t('uploadAgreement')}>
                        <Paperclip className="w-3.5 h-3.5" />
                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => uploadBidFile(b.id, b.attachments, e)} />
                      </label>
                      <button onClick={() => deleteBid(b.id)} className="w-8 h-8 rounded-md bg-white hover:bg-red-50 flex items-center justify-center text-red-600" title={t('delete')}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('adminNotes')}</div>
          <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t('addNote')} className="min-h-[60px]" />
          <div className="mt-3 space-y-1.5">
            {notes.map(n => (
              <div key={n.id} className="text-xs bg-secondary rounded-lg p-2">
                <div className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                <div className="text-navy">{n.note}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveAll} disabled={saving} className="w-full mt-4 h-12 text-base" style={{ background: '#0D1B2A' }}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('save')}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full mt-4 h-11 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="w-4 h-4 me-1.5" />{t('deleteProject')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir={dir}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteConfirmDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProject} className="bg-red-600 hover:bg-red-700">{t('delete')}</AlertDialogAction>
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
            <AlertDialogAction onClick={confirmDiscard} className="bg-red-600 hover:bg-red-700">{t('discardLeave')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
