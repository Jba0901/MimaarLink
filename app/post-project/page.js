'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { CATEGORIES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Upload, X, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';

async function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PostProjectInner() {
  const { t } = useLang();
  const router = useRouter();
  const sp = useSearchParams();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [data, setData] = useState({
    category: '', location: '', description: '', timeline: '', budgetRange: '', files: [],
    name: '', company: '', phone: '', email: '', role: '', languagePreference: 'en',
  });

  useEffect(() => {
    const cat = sp.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setData(d => ({ ...d, category: cat }));
      setStep(2);
    }
  }, [sp]);

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const onFiles = async (e) => {
    const list = Array.from(e.target.files || []).slice(0, 5);
    const items = [];
    for (const f of list) {
      if (f.size > 2 * 1024 * 1024) { toast.error(`${f.name} > 2MB`); continue; }
      const dataUrl = await fileToDataURL(f);
      items.push({ name: f.name, type: f.type, size: f.size, data: dataUrl });
    }
    setData(d => ({ ...d, files: [...d.files, ...items].slice(0, 5) }));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      setCreatedId(json.project.id);
      setStep(4);
    } catch (e) { toast.error(e.message); } finally { setSubmitting(false); }
  };

  const Stepper = () => (
    <div className="flex items-center gap-1.5 mb-5">
      {[1,2,3,4].map(n => (
        <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? '' : 'bg-secondary'}`} style={n <= step ? { background: '#0D1F3C' } : {}} />
      ))}
    </div>
  );

  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-navy mb-1">{t('postTitle')}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t('subtitle')}</p>
      <Stepper />

      {step === 1 && (
        <div>
          <Label className="text-sm font-semibold text-navy mb-3 block">{t('selectCategory')}</Label>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => { update('category', c); setStep(2); }}
                className={`text-start rounded-xl border-2 p-3.5 transition-all ${data.category === c ? 'border-navy bg-secondary' : 'border-border hover:border-navy/40'}`}>
                <div className="text-sm font-semibold text-navy">{t(`cat_${c}`)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3.5">
          <div>
            <Label className="text-sm">{t('location')} *</Label>
            <Input value={data.location} onChange={e => update('location', e.target.value)} placeholder={t('locationPh')} className="h-11 mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">{t('description')} *</Label>
            <Textarea value={data.description} onChange={e => update('description', e.target.value)} placeholder={t('descriptionPh')} className="mt-1.5 min-h-[110px]" />
          </div>
          <div>
            <Label className="text-sm">{t('timeline')}</Label>
            <Input value={data.timeline} onChange={e => update('timeline', e.target.value)} placeholder={t('timelinePh')} className="h-11 mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">{t('budget')}</Label>
            <Input value={data.budgetRange} onChange={e => update('budgetRange', e.target.value)} placeholder={t('budgetPh')} className="h-11 mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">{t('uploadFilesLabel')}</Label>
            <div className="text-[11px] text-muted-foreground mb-2">{t('uploadHint')}</div>
            <label className="flex items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-border hover:border-navy/40 cursor-pointer bg-secondary/50">
              <Upload className="w-4 h-4 text-navy" />
              <span className="text-sm text-navy font-medium">{t('uploadFiles')}</span>
              <input type="file" multiple className="hidden" onChange={onFiles} accept="image/*,application/pdf" />
            </label>
            {data.files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {data.files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-secondary rounded-lg px-3 py-2">
                    <span className="truncate">{f.name}</span>
                    <button onClick={() => update('files', data.files.filter((_, j) => j !== i))} className="text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">{t('back')}</Button>
            <Button onClick={() => setStep(3)} disabled={!data.location || !data.description} className="flex-1 h-11" style={{ background: '#0D1F3C' }}>{t('next')}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3.5">
          <h2 className="text-base font-semibold text-navy">{t('contactDetails')}</h2>
          <div>
            <Label className="text-sm">{t('name')} *</Label>
            <Input value={data.name} onChange={e => update('name', e.target.value)} className="h-11 mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">{t('company')}</Label>
            <Input value={data.company} onChange={e => update('company', e.target.value)} className="h-11 mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">{t('phone')} *</Label>
            <Input value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+974 ..." className="h-11 mt-1.5" inputMode="tel" />
          </div>
          <div>
            <Label className="text-sm">{t('email')}</Label>
            <Input value={data.email} onChange={e => update('email', e.target.value)} className="h-11 mt-1.5" type="email" />
          </div>
          <div>
            <Label className="text-sm">{t('role')}</Label>
            <Input value={data.role} onChange={e => update('role', e.target.value)} placeholder={t('rolePh')} className="h-11 mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">{t('preferredLanguage')}</Label>
            <Select value={data.languagePreference} onValueChange={v => update('languagePreference', v)}>
              <SelectTrigger className="h-11 mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11">{t('back')}</Button>
            <Button onClick={submit} disabled={!data.name || !data.phone || submitting} className="flex-1 h-11" style={{ background: '#0D1F3C' }}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-1.5" />{t('submitting')}</> : t('submit')}
            </Button>
          </div>
        </div>
      )}

      {step === 4 && createdId && (
        <Card className="border-2" style={{ borderColor: '#0FAE96' }}>
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: 'rgba(15,174,150,0.15)' }}>
              <CheckCircle2 className="w-7 h-7" style={{ color: '#0FAE96' }} />
            </div>
            <h2 className="text-xl font-bold text-navy">{t('confirmation')}</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t('confirmationDesc')}</p>
            <div className="mt-4 p-3 rounded-lg bg-secondary text-start">
              <div className="text-[11px] text-muted-foreground mb-1">{t('saveLink')}</div>
              <div className="flex items-center gap-2">
                <code className="text-[11px] flex-1 truncate">/project/{createdId}</code>
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/project/' + createdId); toast.success(t('linkCopied')); }}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <Button onClick={() => router.push('/project/' + createdId)} className="w-full mt-4 h-11" style={{ background: '#0D1F3C' }}>{t('viewProject')}</Button>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

export default function PostProjectPage() {
  return <Suspense fallback={null}><PostProjectInner /></Suspense>;
}
