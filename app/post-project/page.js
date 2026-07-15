'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import PageState from '@/components/PageState';
import SuccessPanel from '@/components/SuccessPanel';
import FormProgress from '@/components/FormProgress';
import FormAside from '@/components/FormAside';
import FileUploadDropzone from '@/components/FileUploadDropzone';
import { useLang } from '@/lib/LangContext';
import { PROJECT_CATEGORIES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader2, FileText, Layers, Wrench, Snowflake, HardHat, ClipboardCheck, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { MAX_FILE_SIZE_BYTES, fileTooLargeMessage } from '@/lib/uploadLimits';
import { getMarketingAttribution, trackMeta, trackMetaOnce } from '@/lib/marketingAttribution';

const PROJECT_CATEGORY_ICONS = {
  fitout: Layers,
  maintenance: Wrench,
  mep: Snowflake,
  civil: HardHat,
  consultancy: ClipboardCheck,
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

  const markFormStarted = () => trackMetaOnce('project_form_start', 'FormStart', { form_type: 'project' }, { custom: true });
  const update = (k, v) => {
    markFormStarted();
    setData(d => ({ ...d, [k]: v }));
  };

  const onFiles = async (e) => {
    markFormStarted();
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
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, marketingAttribution: getMarketingAttribution() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      trackMeta('Lead', { content_name: 'project_submission', form_type: 'project' });
      setCreatedId(json.project.id);
      setStep(4);
    } catch (e) { toast.error(e.message); } finally { setSubmitting(false); }
  };

  return (
    <AppShell hideFooter hideNav wide>
      {step < 4 ? (
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="w-full lg:max-w-2xl">
          <h1 className="display-title text-[26px] sm:text-[30px] mb-1.5 motion-fade-up">{t('postTitle')}</h1>
          <p className="text-[13.5px] text-muted-foreground mb-4 motion-fade-up motion-delay-1 leading-relaxed">{t('subtitle')}</p>
          <FormProgress
            step={step}
            total={3}
            label={t('stepLabel')}
            title={step === 1 ? t('projectStep1Title') : step === 2 ? t('projectStep2Title') : t('projectStep3Title')}
            desc={step === 1 ? t('projectStep1Desc') : step === 2 ? t('projectStep2Desc') : t('projectStep3Desc')}
          />

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
          <div>
            <Label className="text-sm">
              {t('location')} <span className="ms-1 text-[11px] font-normal text-muted-foreground">({t('optional')})</span>
            </Label>
            <Input value={data.location} onChange={e => update('location', e.target.value)} placeholder={t('locationPh')} className="h-11 mt-1.5" />
          </div>
          <div>
            <Label className="text-sm">{t('description')} <span className="text-red-600">*</span></Label>
            <Textarea
              value={data.description}
              onChange={e => update('description', e.target.value)}
              placeholder={t('descriptionPh')}
              aria-invalid={tried2 && !data.description}
              className={`mt-1.5 min-h-[110px] ${tried2 && !data.description ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
            />
            {tried2 && !data.description && <div className="text-[11px] text-red-600 mt-1">{t('requireField')}</div>}
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <Label className="text-sm">{t('timeline')}</Label>
              <Input value={data.timeline} onChange={e => update('timeline', e.target.value)} placeholder={t('timelinePh')} className="h-11 mt-1.5" />
            </div>
            <div>
              <Label className="text-sm">{t('budget')}</Label>
              <Input value={data.budgetRange} onChange={e => update('budgetRange', e.target.value)} placeholder={t('budgetPh')} className="h-11 mt-1.5" />
            </div>
          </div>
          <div>
            <Label className="text-sm">{t('uploadFilesLabel')}</Label>
            <FileUploadDropzone
              className="mt-1.5"
              label={t('uploadFiles')}
              hint={t('uploadHint')}
              multiple
              onChange={onFiles}
              accept="image/*,application/pdf"
            />
            {data.files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {data.files.map((f, i) => (
                  <div key={i} className="flex min-h-11 items-center gap-2 text-xs bg-secondary rounded-xl ps-3 pe-1">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-start">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => update('files', data.files.filter((_, j) => j !== i))}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/80 hover:text-red-600"
                      aria-label={`${t('removeFile')}: ${f.name}`}
                      title={t('removeFile')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 cta-press">{t('back')}</Button>
            <Button onClick={() => { setTried2(true); if (data.description) setStep(3); }} className="flex-1 h-11 cta-press" style={{ background: '#152B54' }}>{t('next')}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3.5">
          <h2 className="text-base font-semibold text-navy">{t('contactDetails')}</h2>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <RequiredField label={t('name')} value={data.name} onChange={v => update('name', v)} tried={tried3} t={t} />
            <div>
              <Label className="text-sm">{t('company')}</Label>
              <Input value={data.company} onChange={e => update('company', e.target.value)} className="h-11 mt-1.5" />
            </div>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <RequiredField label={t('phone')} value={data.phone} onChange={v => update('phone', v)} tried={tried3} t={t} placeholder="+974 ..." kind="phone" />
            <div>
              <Label className="text-sm">{t('email')}</Label>
              <Input value={data.email} onChange={e => update('email', e.target.value)} className="h-11 mt-1.5" type="email" />
            </div>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
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
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 cta-press">{t('back')}</Button>
            <Button onClick={submit} disabled={submitting} className="flex-1 h-11 cta-press" style={{ background: '#152B54' }}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin me-1.5" />{t('submitting')}</> : t('submit')}
            </Button>
          </div>
        </div>
      )}
        </div>
        <FormAside
          steps={[
            { title: t('projL_s1'), desc: t('projL_s1d') },
            { title: t('projL_s2'), desc: t('projL_s2d') },
            { title: t('projL_s3'), desc: t('projL_s3d') },
          ]}
          note={t('projL_privacy')}
        />
      </div>
      ) : (
        <SuccessPanel
          title={t('confirmation')}
          description={t('confirmationDesc')}
          referenceLabel={t('saveLink')}
          referencePath={`/project/${createdId}`}
          copyLabel={t('copyLink')}
          copiedLabel={t('linkCopied')}
          actionHref={`/project/${createdId}`}
          actionLabel={t('viewProject')}
        />
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
        <div dir="ltr" className={`mt-1.5 flex min-h-11 items-stretch overflow-hidden rounded-xl border bg-card shadow-soft transition-[border-color,box-shadow] ${showError ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-400/25' : 'border-input hover:border-[#00B59E]/45 focus-within:border-[#00B59E]/60 focus-within:ring-2 focus-within:ring-[#00B59E]/25'}`}>
          <div className="px-3 flex items-center bg-secondary text-navy text-sm font-semibold select-none border-e border-input shrink-0">
            {PREFIX}
          </div>
          <input
            value={localPart}
            onChange={e => handleLocalChange(e.target.value)}
            inputMode="tel"
            aria-invalid={showError}
            className="min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-sm"
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
        aria-invalid={showError}
        className={`h-11 mt-1.5 ${showError ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
      />
      {showError && <div className="text-[11px] text-red-600 mt-1">{t('requireField')}</div>}
    </div>
  );
}

export default function PostProjectPage() {
  const { t } = useLang();
  return <Suspense fallback={<AppShell hideFooter hideNav wide><PageState kind="loading" title={t('loading')} /></AppShell>}><PostProjectInner /></Suspense>;
}
