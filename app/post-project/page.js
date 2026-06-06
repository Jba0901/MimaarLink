'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import FormProgress from '@/components/FormProgress';
import { useLang } from '@/lib/LangContext';
import { PROJECT_CATEGORIES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Upload, X, Loader2, Copy, Layers, Wrench, Snowflake, HardHat, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { MAX_FILE_SIZE_BYTES, fileTooLargeMessage } from '@/lib/uploadLimits';

const PROJECT_CATEGORY_ICONS = {
  fitout: Layers,
  maintenance: Wrench,
  mep: Snowflake,
  civil: HardHat,
  other: MoreHorizontal,
};

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
  const [tried2, setTried2] = useState(false);
  const [tried3, setTried3] = useState(false);
  const [data, setData] = useState({
    category: '', location: '', description: '', timeline: '', budgetRange: '', files: [],
    name: '', company: '', phone: '+974 ', email: '', role: '', languagePreference: 'en',
  });

  useEffect(() => {
    const cat = sp.get('category');
    if (cat && PROJECT_CATEGORIES.includes(cat)) {
      setData(d => ({ ...d, category: cat }));
      setStep(2);
    }
  }, [sp]);

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const onFiles = async (e) => {
    const list = Array.from(e.target.files || []).slice(0, 5);
    const items = [];
    for (const f of list) {
      if (f.size > MAX_FILE_SIZE_BYTES) { toast.error(fileTooLargeMessage(f.name)); continue; }
      const dataUrl = await fileToDataURL(f);
      items.push({ name: f.name, type: f.type, size: f.size, data: dataUrl });
    }
    setData(d => ({ ...d, files: [...d.files, ...items].slice(0, 5) }));
    e.target.value = '';
  };

  const submit = async () => {
    setTried3(true);
    const phoneDigits = (data.phone || '').replace(/\D/g, '').length;
    if (!data.name || !data.phone || phoneDigits < 8) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      setCreatedId(json.project.id);
      setStep(4);
    } catch (e) { toast.error(e.message); } finally { setSubmitting(false); }
  };

  return (
    <AppShell hideFooter hideNav>
      <h1 className="text-2xl font-bold text-navy mb-1 motion-fade-up">{t('postTitle')}</h1>
      <p className="text-sm text-muted-foreground mb-4 motion-fade-up motion-delay-1">{t('subtitle')}</p>
      {step < 4 && (
        <FormProgress
          step={step}
          total={3}
          label={t('stepLabel')}
          title={step === 1 ? t('projectStep1Title') : step === 2 ? t('projectStep2Title') : t('projectStep3Title')}
          desc={step === 1 ? t('projectStep1Desc') : step === 2 ? t('projectStep2Desc') : t('projectStep3Desc')}
        />
      )}

      {step === 1 && (
        <div>
          <Label className="text-sm font-semibold text-navy mb-3 block">{t('selectCategory')}</Label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PROJECT_CATEGORIES.map(c => {
              const Icon = PROJECT_CATEGORY_ICONS[c] || MoreHorizontal;
              return (
                <button key={c} type="button" onClick={() => { update('category', c); setStep(2); }}
                  className={`interactive-card tap-highlight min-h-[62px] text-start rounded-2xl border px-4 py-3 shadow-soft ${data.category === c ? 'border-navy bg-secondary' : 'border-border bg-white hover:border-navy/35 hover:bg-secondary/40'}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl light-teal">
                      <Icon className="h-5 w-5 text-teal" />
                    </span>
                    <span className="text-[15px] font-bold text-navy leading-tight">{t(`cat_${c}`)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3.5">
          <RequiredField label={t('location')} value={data.location} onChange={v => update('location', v)} tried={tried2} t={t} placeholder={t('locationPh')} />
          <div>
            <Label className="text-sm">{t('description')} <span className="text-red-600">*</span></Label>
            <Textarea
              value={data.description}
              onChange={e => update('description', e.target.value)}
              placeholder={t('descriptionPh')}
              className={`mt-1.5 min-h-[110px] ${tried2 && !data.description ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
            />
            {tried2 && !data.description && <div className="text-[11px] text-red-600 mt-1">{t('requireField')}</div>}
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
            <label className="interactive-card tap-highlight flex items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-border hover:border-navy/40 cursor-pointer bg-secondary/50">
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
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 cta-press">{t('back')}</Button>
            <Button onClick={() => { setTried2(true); if (data.location && data.description) setStep(3); }} className="flex-1 h-11 cta-press" style={{ background: '#142A44' }}>{t('next')}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3.5">
          <h2 className="text-base font-semibold text-navy">{t('contactDetails')}</h2>
          <RequiredField label={t('name')} value={data.name} onChange={v => update('name', v)} tried={tried3} t={t} />
          <div>
            <Label className="text-sm">{t('company')}</Label>
            <Input value={data.company} onChange={e => update('company', e.target.value)} className="h-11 mt-1.5" />
          </div>
          <RequiredField label={t('phone')} value={data.phone} onChange={v => update('phone', v)} tried={tried3} t={t} placeholder="+974 ..." kind="phone" />
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
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 cta-press">{t('back')}</Button>
            <Button onClick={submit} disabled={submitting} className="flex-1 h-11 cta-press" style={{ background: '#142A44' }}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-1.5" />{t('submitting')}</> : t('submit')}
            </Button>
          </div>
        </div>
      )}

      {step === 4 && createdId && (
        <Card className="border-2 motion-fade-up" style={{ borderColor: '#14A88E' }}>
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: 'rgba(20,168,142,0.15)' }}>
              <CheckCircle2 className="w-7 h-7" style={{ color: '#14A88E' }} />
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
            <Button onClick={() => router.push('/project/' + createdId)} className="w-full mt-4 h-11" style={{ background: '#142A44' }}>{t('viewProject')}</Button>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

function RequiredField({ label, value, onChange, tried, t, placeholder, inputMode, type, kind }) {
  const isPhone = kind === 'phone';
  const PREFIX = '+974';

  if (isPhone) {
    const localPart = (value || '').replace(/^\+974\s*/, '');
    const handleLocalChange = (raw) => {
      const cleaned = raw.replace(/[^\d\s-]/g, '');
      onChange(PREFIX + ' ' + cleaned);
    };
    const digitCount = (value || '').replace(/\D/g, '').length;
    const empty = !localPart.trim();
    const tooShort = !empty && digitCount < 8;
    const showError = tried && (empty || tooShort);
    const errMsg = tooShort ? t('invalidPhone') : t('requireField');
    return (
      <div>
        <Label className="text-sm">
          {label} <span className="text-red-600">*</span>
        </Label>
        <div dir="ltr" className={`mt-1.5 flex items-stretch h-11 rounded-md overflow-hidden border ${showError ? 'border-red-400' : 'border-input'} focus-within:ring-1 ${showError ? 'focus-within:ring-red-400' : 'focus-within:ring-ring'}`}>
          <div className="px-3 flex items-center bg-secondary text-navy text-sm font-semibold select-none border-e border-input shrink-0">
            {PREFIX}
          </div>
          <input
            value={localPart}
            onChange={e => handleLocalChange(e.target.value)}
            inputMode="tel"
            className="flex-1 px-3 bg-background outline-none text-sm"
          />
        </div>
        {showError && <div className="text-[11px] text-red-600 mt-1">{errMsg}</div>}
      </div>
    );
  }

  const showError = tried && !value;
  return (
    <div>
      <Label className="text-sm">
        {label} <span className="text-red-600">*</span>
      </Label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        type={type}
        className={`h-11 mt-1.5 ${showError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
      />
      {showError && <div className="text-[11px] text-red-600 mt-1">{t('requireField')}</div>}
    </div>
  );
}

export default function PostProjectPage() {
  return <Suspense fallback={null}><PostProjectInner /></Suspense>;
}
