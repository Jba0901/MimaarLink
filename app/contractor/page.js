'use client';
import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { CATEGORIES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

async function fileToDataURL(file) {
  return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file); });
}

export default function ContractorPage() {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [data, setData] = useState({
    companyName: '', crNumber: '', contactPerson: '', whatsapp: '', email: '',
    categories: [], serviceAreas: '', projectSizeRange: '', documents: [],
  });

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleCat = (c) => update('categories', data.categories.includes(c) ? data.categories.filter(x => x !== c) : [...data.categories, c]);

  const onFiles = async (e, label) => {
    const list = Array.from(e.target.files || []).slice(0, 3);
    const items = [];
    for (const f of list) {
      if (f.size > 2 * 1024 * 1024) { toast.error(`${f.name} > 2MB`); continue; }
      const dataUrl = await fileToDataURL(f);
      items.push({ name: f.name, type: f.type, size: f.size, data: dataUrl, label });
    }
    setData(d => ({ ...d, documents: [...d.documents, ...items] }));
    e.target.value = '';
  };

  const hasCR = data.documents.filter(d => d.label === 'cr').length > 0;
  const formValid = data.companyName && data.crNumber && data.contactPerson && data.whatsapp && data.categories.length > 0 && hasCR;

  const submit = async () => {
    setTriedSubmit(true);
    if (!formValid) {
      if (!hasCR) toast.error(t('uploadCR') + ' — ' + t('requireField'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contractors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Error');
      setDone(true);
    } catch (e) { toast.error(e.message); } finally { setSubmitting(false); }
  };

  if (done) return (
    <AppShell>
      <Card className="border-2 mt-4" style={{ borderColor: '#0FAE96' }}>
        <CardContent className="p-6 text-center">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: 'rgba(15,174,150,0.15)' }}>
            <CheckCircle2 className="w-7 h-7" style={{ color: '#0FAE96' }} />
          </div>
          <h2 className="text-xl font-bold text-navy">{t('contractorDone')}</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{t('contractorDoneDesc')}</p>
        </CardContent>
      </Card>
    </AppShell>
  );

  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-navy mb-1">{t('contractorTitle')}</h1>
      <p className="text-sm text-muted-foreground mb-5">{t('contractorSubtitle')}</p>

      <div className="space-y-3.5">
        <div>
          <Label className="text-sm">{t('companyName')} *</Label>
          <Input value={data.companyName} onChange={e => update('companyName', e.target.value)} className="h-11 mt-1.5" />
        </div>
        <div>
          <Label className="text-sm">{t('crNumber')} *</Label>
          <Input value={data.crNumber} onChange={e => update('crNumber', e.target.value)} className="h-11 mt-1.5" />
        </div>
        <div>
          <Label className="text-sm">{t('contactPerson')} *</Label>
          <Input value={data.contactPerson} onChange={e => update('contactPerson', e.target.value)} className="h-11 mt-1.5" />
        </div>
        <div>
          <Label className="text-sm">{t('whatsapp')} *</Label>
          <Input value={data.whatsapp} onChange={e => update('whatsapp', e.target.value)} placeholder="+974 ..." className="h-11 mt-1.5" inputMode="tel" />
        </div>
        <div>
          <Label className="text-sm">{t('email')}</Label>
          <Input value={data.email} onChange={e => update('email', e.target.value)} type="email" className="h-11 mt-1.5" />
        </div>
        <div>
          <Label className="text-sm mb-2 block">{t('serviceCategoriesLabel')} *</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => toggleCat(c)}
                className={`text-start text-xs rounded-lg border-2 px-3 py-2 ${data.categories.includes(c) ? 'border-navy bg-secondary' : 'border-border'}`}>
                {t(`cat_${c}`)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-sm">{t('serviceAreas')}</Label>
          <Input value={data.serviceAreas} onChange={e => update('serviceAreas', e.target.value)} placeholder={t('serviceAreasPh')} className="h-11 mt-1.5" />
        </div>
        <div>
          <Label className="text-sm">{t('projectSize')}</Label>
          <Input value={data.projectSizeRange} onChange={e => update('projectSizeRange', e.target.value)} placeholder={t('projectSizePh')} className="h-11 mt-1.5" />
        </div>

        {[
          { key: 'cr', label: t('uploadCR'), required: true },
          { key: 'trade', label: t('uploadTrade'), required: false },
          { key: 'past', label: t('uploadPast'), required: false },
          { key: 'cert', label: t('uploadCert'), required: false },
        ].map(it => {
          const filesForLabel = data.documents.filter(d => d.label === it.key);
          const showError = it.required && triedSubmit && filesForLabel.length === 0;
          return (
            <div key={it.key}>
              <Label className="text-sm">
                {it.label}{it.required && <span className="text-red-600 ms-1">*</span>}
              </Label>
              <label className={`mt-1.5 flex items-center justify-center gap-2 h-16 rounded-xl border-2 border-dashed cursor-pointer bg-secondary/50 ${showError ? 'border-red-400' : 'border-border hover:border-navy/40'}`}>
                <Upload className="w-4 h-4 text-navy" />
                <span className="text-sm text-navy font-medium">{t('uploadFiles')}</span>
                <input type="file" multiple className="hidden" onChange={(e) => onFiles(e, it.key)} accept="image/*,application/pdf" />
              </label>
              {showError && <div className="text-[11px] text-red-600 mt-1">{t('requireField')}</div>}
              <div className="mt-1 space-y-1">
                {filesForLabel.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-secondary rounded-lg px-3 py-1.5">
                    <span className="truncate">{f.name}</span>
                    <button onClick={() => update('documents', data.documents.filter(x => x !== f))} className="text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <Button onClick={submit} disabled={submitting}
          className="w-full h-12 text-base mt-2" style={{ background: '#142A44' }}>
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />{t('submitting')}</> : t('submit')}
        </Button>
      </div>
    </AppShell>
  );
}
