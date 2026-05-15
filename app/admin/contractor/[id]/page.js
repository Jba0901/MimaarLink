'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { CONTRACTOR_STATUSES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, ArrowRight, Loader2, FileText, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminContractorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, dir } = useLang();
  const [c, setC] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDraft, setStatusDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('mlAdmin') !== '1') router.push('/admin');
  }, [router]);

  const load = () => fetch(`/api/contractors/${id}`).then(r => r.json()).then(j => {
    setC(j); setLoading(false);
    if (j?.verificationStatus) setStatusDraft(j.verificationStatus);
  });
  useEffect(() => { load(); }, [id]);

  // Warn before closing tab when there are unsaved changes
  useEffect(() => {
    const dirty = !!(statusDraft && c && statusDraft !== c.verificationStatus);
    if (!dirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [statusDraft, c]);

  if (loading) return <AppShell><div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div></AppShell>;
  if (!c || c.error) return <AppShell><p>Not found</p></AppShell>;

  const saveAll = async () => {
    if (!statusDraft || statusDraft === c.verificationStatus) { toast.message(t('saved')); router.push('/admin?tab=contractors'); return; }
    setSaving(true);
    try {
      await fetch(`/api/contractors/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ verificationStatus: statusDraft }) });
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
    const dirty = !!(statusDraft && c && statusDraft !== c.verificationStatus);
    if (dirty) setConfirmLeave(true);
    else router.push('/admin?tab=contractors');
  };

  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <AppShell>
      <button onClick={tryNavigate} className="flex items-center gap-1 text-sm text-navy mb-3"><Back className="w-4 h-4" />{t('backToList')}</button>

      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-xl font-bold text-navy">{c.companyName}</h1>
        {c.verificationStatus === 'verified' && <ShieldCheck className="w-5 h-5" style={{ color: '#0FAE96' }} />}
      </div>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-1.5 text-sm">
          <div><span className="font-semibold">{t('crNumber')}:</span> {c.crNumber}</div>
          <div><span className="font-semibold">{t('contactPerson')}:</span> {c.contactPerson}</div>
          <div><span className="font-semibold">{t('whatsapp')}:</span> {c.whatsapp}</div>
          {c.email && <div><span className="font-semibold">{t('email')}:</span> {c.email}</div>}
          <div><span className="font-semibold">{t('serviceAreas')}:</span> {c.serviceAreas}</div>
          <div><span className="font-semibold">{t('projectSize')}:</span> {c.projectSizeRange}</div>
          <div className="flex flex-wrap gap-1 pt-1">
            {(c.categories || []).map(cat => (
              <span key={cat} className="text-[10px] bg-secondary text-navy px-1.5 py-0.5 rounded">{t(`cat_${cat}`)}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4">
          <Label className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">{t('verificationStatus')}</Label>
          <Select value={statusDraft || c.verificationStatus} onValueChange={setStatusDraft}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>{CONTRACTOR_STATUSES.map(s => <SelectItem key={s} value={s}>{t(`cstatus_${s}`)}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      {c.documents && c.documents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('documents')}</div>
            <div className="space-y-1.5">
              {c.documents.map((f, i) => (
                <a key={i} href={f.data} download={f.name} className="flex items-center gap-2 text-xs text-navy bg-secondary rounded-lg px-2 py-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-[10px] text-muted-foreground">{f.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={saveAll} disabled={saving} className="w-full mt-4 h-12 text-base" style={{ background: '#0D1B2A' }}>
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
