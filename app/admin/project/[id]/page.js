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
import { ArrowLeft, ArrowRight, Plus, ShieldCheck, FileText, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, dir } = useLang();
  const [d, setD] = useState(null);
  const [allContractors, setAllContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openBid, setOpenBid] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [note, setNote] = useState('');
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
  };
  useEffect(() => { load(); }, [id]);

  if (loading) return <AppShell><div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div></AppShell>;
  if (!d || d.error) return <AppShell><p>Not found</p></AppShell>;

  const { project, requester, bids, invites, notes, contractors } = d;
  const cmap = Object.fromEntries(contractors.map(c => [c.id, c]));

  const changeStatus = async (s) => {
    await fetch(`/api/projects/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s }) });
    toast.success(t('statusUpdated')); load();
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

  const submitAssign = async () => {
    if (!assignContractor) return;
    await fetch('/api/bidinvites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId: id, contractorId: assignContractor }) });
    toast.success(t('invited')); setOpenAssign(false); setAssignContractor(''); load();
  };

  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <AppShell>
      <button onClick={() => router.push('/admin')} className="flex items-center gap-1 text-sm text-navy mb-3"><Back className="w-4 h-4" />{t('backToList')}</button>
      <h1 className="text-xl font-bold text-navy">{t(`cat_${project.category}`)}</h1>
      <div className="text-xs text-muted-foreground mb-3">{project.location}</div>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{t('projectDetailsTitle')}</div>
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
          <Select value={project.status} onValueChange={changeStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{PROJECT_STATUSES.map(s => <SelectItem key={s} value={s}>{t(`status_${s}`)}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" className="w-full mt-1" onClick={() => router.push(`/bids/${id}`)}>
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />{t('viewBids')}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Dialog open={openAssign} onOpenChange={setOpenAssign}>
          <DialogTrigger asChild><Button variant="outline" className="h-11"><Plus className="w-4 h-4 mr-1" />{t('assignContractor')}</Button></DialogTrigger>
          <DialogContent dir={dir}>
            <DialogHeader><DialogTitle>{t('assignContractor')}</DialogTitle></DialogHeader>
            <Select value={assignContractor} onValueChange={setAssignContractor}>
              <SelectTrigger><SelectValue placeholder={t('selectContractor')} /></SelectTrigger>
              <SelectContent>{allContractors.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName} {c.verificationStatus !== 'verified' ? `(${t('notVerified')})` : ''}</SelectItem>)}</SelectContent>
            </Select>
            <DialogFooter><Button onClick={submitAssign}>{t('save')}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={openBid} onOpenChange={setOpenBid}>
          <DialogTrigger asChild><Button className="h-11" style={{ background: '#0D1F3C' }}><Plus className="w-4 h-4 mr-1" />{t('addBid')}</Button></DialogTrigger>
          <DialogContent dir={dir} className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('addBidFor')}</DialogTitle></DialogHeader>
            <div className="space-y-2.5">
              <div>
                <Label className="text-xs">{t('selectContractor')}</Label>
                <Select value={bidForm.contractorId} onValueChange={v => setBidForm(f => ({...f, contractorId: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{allContractors.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">{t('price')}</Label><Input type="number" value={bidForm.price} onChange={e => setBidForm(f => ({...f, price: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('timelineWeeks')}</Label><Input value={bidForm.timeline} onChange={e => setBidForm(f => ({...f, timeline: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('warranty')}</Label><Input value={bidForm.warranty} onChange={e => setBidForm(f => ({...f, warranty: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('exclusions')}</Label><Input value={bidForm.exclusions} onChange={e => setBidForm(f => ({...f, exclusions: e.target.value}))} /></div>
              <div><Label className="text-xs">{t('notes')}</Label><Textarea value={bidForm.notes} onChange={e => setBidForm(f => ({...f, notes: e.target.value}))} /></div>
            </div>
            <DialogFooter><Button onClick={submitBid} style={{ background: '#0D1F3C' }}>{t('save')}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('invitedContractors')} ({invites.length})</div>
          {invites.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
          <div className="space-y-1.5">
            {invites.map(inv => (
              <div key={inv.id} className="text-sm flex items-center justify-between bg-secondary rounded-lg p-2">
                <span className="text-navy">{cmap[inv.contractorId]?.companyName || inv.contractorId}</span>
                <Badge variant="outline" className="text-[10px]">{inv.responseStatus}</Badge>
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
            {bids.map(b => (
              <div key={b.id} className="text-xs bg-secondary rounded-lg p-2.5">
                <div className="flex justify-between font-semibold text-navy text-sm"><span>{cmap[b.contractorId]?.companyName}</span><span>{b.price.toLocaleString()} QAR</span></div>
                <div className="text-muted-foreground">{b.timeline}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('adminNotes')}</div>
          <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t('addNote')} className="min-h-[60px]" />
          <Button onClick={addNote} className="mt-2 w-full h-9" size="sm" style={{ background: '#0D1F3C' }}>{t('save')}</Button>
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
    </AppShell>
  );
}
