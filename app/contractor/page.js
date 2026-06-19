'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import FormProgress from '@/components/FormProgress';
import FormAside from '@/components/FormAside';
import { useLang } from '@/lib/LangContext';
import { CATEGORIES, CONSULTANT_CATEGORIES, CONSULTANT_GRADES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Upload, X, Loader2, Copy, Building2, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { MAX_FILE_SIZE_BYTES, fileTooLargeMessage } from '@/lib/uploadLimits';

async function fileToDataURL(file) {
  return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file); });
}

export default function ContractorPage() {
  return (
    <Suspense fallback={null}>
      <ContractorApplicationInner />
    </Suspense>
  );
}

function ContractorApplicationInner() {
  const { t } = useLang();
  const sp = useSearchParams();
  const requestedType = sp.get('type') === 'consultant' ? 'consultant' : 'contractor';
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [triedBasics, setTriedBasics] = useState(false);
  const [triedServices, setTriedServices] = useState(false);
  const [triedDocuments, setTriedDocuments] = useState(false);
  const [data, setData] = useState({
    providerType: requestedType,
    companyName: '', crNumber: '', contactPerson: '', whatsapp: '+974 ', email: '',
    categories: [], consultantGrade: requestedType === 'consultant' ? 'unknown' : '', consultantServices: [],
    otherCategoryDesc: '', serviceAreas: '', projectSizeRange: '', documents: [],
  });

  useEffect(() => {
    setData(d => ({
      ...d,
      providerType: requestedType,
      consultantGrade: requestedType === 'consultant' ? (d.consultantGrade || 'unknown') : '',
      consultantServices: requestedType === 'consultant' ? d.consultantServices : [],
    }));
  }, [requestedType]);

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const isConsultant = data.providerType === 'consultant';
  const serviceOptions = isConsultant ? CONSULTANT_CATEGORIES : CATEGORIES;
  const serviceLabel = isConsultant ? t('consultantServicesLabel') : t('serviceCategoriesLabel');

  const selectProviderType = (providerType) => {
    setData(d => ({
      ...d,
      providerType,
      categories: [],
      consultantServices: [],
      consultantGrade: providerType === 'consultant' ? 'unknown' : '',
      otherCategoryDesc: '',
    }));
  };

  const toggleCat = (c) => {
    const isRemoving = data.categories.includes(c);
    const next = isRemoving ? data.categories.filter(x => x !== c) : [...data.categories, c];
    setData(d => ({
      ...d,
      categories: next,
      consultantServices: d.providerType === 'consultant' ? next : [],
      // clear the "other" description if user unchecks "other"
      otherCategoryDesc: c === 'other' && isRemoving ? '' : d.otherCategoryDesc,
    }));
  };

  const onFiles = async (e, label) => {
    const list = Array.from(e.target.files || []).slice(0, 3);
    const items = [];
    for (const f of list) {
      if (f.size > MAX_FILE_SIZE_BYTES) { toast.error(fileTooLargeMessage(f.name)); continue; }
      const dataUrl = await fileToDataURL(f);
      items.push({ name: f.name, type: f.type, size: f.size, data: dataUrl, label });
    }
    setData(d => ({ ...d, documents: [...d.documents, ...items] }));
    e.target.value = '';
  };

  const hasCR = data.documents.filter(d => d.label === 'cr').length > 0;
  const phoneDigits = (data.whatsapp || '').replace(/^\+974\s*/, '').replace(/\D/g, '').length;
  const phoneValid = phoneDigits >= 8;
  const hasOther = data.categories.includes('other');
  const otherDescValid = !hasOther || (data.otherCategoryDesc || '').trim().length >= 3;
  const basicsValid = data.companyName && data.crNumber && data.contactPerson && data.whatsapp && phoneValid;
  const servicesValid = data.categories.length > 0 && otherDescValid;
  const documentsValid = hasCR;
  const formValid = basicsValid && servicesValid && documentsValid;

  const goNextFromBasics = () => {
    setTriedBasics(true);
    if (basicsValid) setStep(2);
  };

  const goNextFromServices = () => {
    setTriedServices(true);
    if (servicesValid) setStep(3);
  };

  const submit = async () => {
    setTriedDocuments(true);
    if (!formValid) {
      if (!basicsValid) { setTriedBasics(true); setStep(1); return; }
      if (!servicesValid) { setTriedServices(true); setStep(2); return; }
      if (!hasCR) toast.error(t('uploadCR') + ' — ' + t('requireField'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contractors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      setCreatedId(json.id);
      setDone(true);
    } catch (e) { toast.error(e.message); } finally { setSubmitting(false); }
  };

  const documentFields = [
    { key: 'cr', label: t('uploadCR'), required: true },
    { key: 'trade', label: t('uploadTrade'), required: false },
    { key: 'establishment', label: t('uploadEstablishment'), required: false },
    { key: 'profile', label: t('uploadCompanyProfile'), required: false },
  ];

  if (done) return (
    <AppShell hideNav>
      <Card className="border-2 mt-4 motion-fade-up" style={{ borderColor: '#0FAE96' }}>
        <CardContent className="p-6 text-center">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: 'rgba(15,174,150,0.15)' }}>
            <CheckCircle2 className="w-7 h-7" style={{ color: '#0FAE96' }} />
          </div>
          <h2 className="text-xl font-bold text-navy">{t('contractorDone')}</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{isConsultant ? t('consultantDoneDesc') : t('contractorDoneDesc')}</p>
          {createdId && (
            <>
              <div className="mt-4 p-3 rounded-lg bg-secondary text-start">
                <div className="text-[11px] text-muted-foreground mb-1">{t('saveProviderLink')}</div>
                <div className="flex items-center gap-2">
                  <code className="text-[11px] flex-1 truncate">/contractor-status/{createdId}</code>
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/contractor-status/' + createdId); toast.success(t('linkCopied')); }}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <Button onClick={() => window.location.href = '/contractor-status/' + createdId} className="form-primary-btn w-full mt-4 h-11">{t('viewProviderStatus')}</Button>
            </>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );

  return (
    <AppShell hideFooter hideNav wide>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="w-full lg:max-w-2xl">
          <h1 className="display-title text-[26px] sm:text-[30px] mb-1.5 motion-fade-up">{isConsultant ? t('consultantTitle') : t('contractorTitle')}</h1>
          <p className="text-[13.5px] text-muted-foreground mb-5 motion-fade-up motion-delay-1 leading-relaxed">{isConsultant ? t('consultantSubtitle') : t('contractorSubtitle')}</p>
          <FormProgress
            step={step}
            total={3}
            label={t('stepLabel')}
            title={step === 1 ? t('contractorStep1Title') : step === 2 ? t('contractorStep2Title') : t('contractorStep3Title')}
            desc={step === 1 ? t('contractorStep1Desc') : step === 2 ? t('contractorStep2Desc') : t('contractorStep3Desc')}
          />

      {step === 1 && (
        <div className="space-y-3.5">
          <div>
            <Label className="text-sm mb-2 block">{t('providerTypeLabel')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <ProviderTypeButton
                active={data.providerType === 'contractor'}
                icon={Building2}
                title={t('providerTypeContractor')}
                desc={t('providerTypeContractorDesc')}
                onClick={() => selectProviderType('contractor')}
              />
              <ProviderTypeButton
                active={data.providerType === 'consultant'}
                icon={ClipboardCheck}
                title={t('providerTypeConsultant')}
                desc={t('providerTypeConsultantDesc')}
                onClick={() => selectProviderType('consultant')}
              />
            </div>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <RequiredField label={t('companyName')} value={data.companyName} onChange={v => update('companyName', v)} tried={triedBasics} t={t} />
            <RequiredField label={t('crNumber')} value={data.crNumber} onChange={v => update('crNumber', v)} tried={triedBasics} t={t} />
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <RequiredField label={t('contactPerson')} value={data.contactPerson} onChange={v => update('contactPerson', v)} tried={triedBasics} t={t} />
            <RequiredField label={t('whatsapp')} value={data.whatsapp} onChange={v => update('whatsapp', v)} tried={triedBasics} t={t} placeholder="+974 ..." kind="phone" />
          </div>
          <div>
            <Label className="text-sm">{t('email')}</Label>
            <Input value={data.email} onChange={e => update('email', e.target.value)} type="email" className="h-11 mt-1.5" />
          </div>
          <div className="pt-2">
            <Button onClick={goNextFromBasics} className="form-primary-btn w-full h-11 cta-press">{t('next')}</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3.5">
          {isConsultant && (
            <div>
              <Label className="text-sm">{t('consultantGrade')}</Label>
              <Select value={data.consultantGrade || 'unknown'} onValueChange={v => update('consultantGrade', v)}>
                <SelectTrigger className="h-11 mt-1.5">
                  <SelectValue placeholder={t('consultantGradePh')} />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTANT_GRADES.map(g => (
                    <SelectItem key={g} value={g}>{t(g === 'unknown' ? 'gradeUnknown' : g === 'grade_a' ? 'gradeA' : g === 'grade_b' ? 'gradeB' : 'gradeC')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label className="text-sm mb-2 block">
              {serviceLabel} <span className="text-red-600">*</span>
            </Label>
            <div className={`grid grid-cols-2 gap-2 ${triedServices && data.categories.length === 0 ? 'p-1.5 rounded-lg ring-1 ring-red-300' : ''}`}>
              {serviceOptions.map(c => (
                <button key={c} type="button" onClick={() => toggleCat(c)}
                  className={`interactive-card tap-highlight min-h-[46px] text-start text-[12.5px] font-semibold rounded-xl border px-3 py-2 ${
                    data.categories.includes(c)
                      ? 'border-[#0EB59E]/50 bg-secondary text-navy shadow-soft dark:border-[#5EEAD4]/45 dark:bg-[#0B8E7C]/15'
                      : 'border-border bg-card text-navy hover:border-[#0EB59E]/35 dark:bg-[#0B1624]/75'
                  }`}>
                  <span className="flex items-center justify-between gap-2">
                    <span>{t(`cat_${c}`)}</span>
                    {data.categories.includes(c) && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal" />}
                  </span>
                </button>
              ))}
            </div>
            {triedServices && data.categories.length === 0 && <div className="text-[11px] text-red-600 mt-1">{t('requireField')}</div>}
          </div>
          {hasOther && (
            <div>
              <Label className="text-sm">
                {t('otherCategoryLabel')} <span className="text-red-600">*</span>
              </Label>
              <textarea
                value={data.otherCategoryDesc}
                onChange={e => update('otherCategoryDesc', e.target.value)}
                placeholder={t('otherCategoryPh')}
                rows={3}
                maxLength={300}
                className={`w-full mt-1.5 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 ${triedServices && !otherDescValid ? 'border-red-400 focus-visible:ring-red-400' : 'border-input focus-visible:ring-ring'}`}
              />
              <div className="text-[11px] text-muted-foreground mt-1">{t('otherCategoryHelp')}</div>
              {triedServices && !otherDescValid && <div className="text-[11px] text-red-600 mt-1">{t('requireField')}</div>}
            </div>
          )}
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <Label className="text-sm">{t('serviceAreas')}</Label>
              <Input value={data.serviceAreas} onChange={e => update('serviceAreas', e.target.value)} placeholder={t('serviceAreasPh')} className="h-11 mt-1.5" />
            </div>
            <div>
              <Label className="text-sm">{t('projectSize')}</Label>
              <Input value={data.projectSizeRange} onChange={e => update('projectSizeRange', e.target.value)} placeholder={t('projectSizePh')} className="h-11 mt-1.5" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 cta-press">{t('back')}</Button>
            <Button onClick={goNextFromServices} className="form-primary-btn flex-1 h-11 cta-press">{t('next')}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3.5">
          {documentFields.map(it => {
            const filesForLabel = data.documents.filter(d => d.label === it.key);
            const showError = it.required && triedDocuments && filesForLabel.length === 0;
            return (
              <div key={it.key}>
                <Label className="text-sm">
                  {it.label}{it.required && <span className="text-red-600 ms-1">*</span>}
                  {!it.required && <span className="text-muted-foreground ms-1">({t('optional')})</span>}
                </Label>
                <div className="text-[11px] text-muted-foreground mt-1">{t('uploadHint')}</div>
                <label className={`interactive-card tap-highlight mt-1.5 flex items-center justify-center gap-2 h-16 rounded-xl border-2 border-dashed cursor-pointer bg-secondary/50 dark:bg-[#0B8E7C]/10 ${showError ? 'border-red-400' : 'border-border hover:border-[#0EB59E]/40'}`}>
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

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 cta-press">{t('back')}</Button>
            <Button onClick={submit} disabled={submitting} className="form-primary-btn flex-1 h-11 cta-press">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin me-2" />{t('submitting')}</> : t('submit')}
            </Button>
          </div>
        </div>
      )}
        </div>
        <FormAside
          steps={[
            { title: t('contL_s1'), desc: t('contL_s1d') },
            { title: t('contL_s2'), desc: t('contL_s2d') },
            { title: t('contL_s3'), desc: t('contL_s3d') },
          ]}
          note={t('contractorStep3Desc')}
        />
      </div>
    </AppShell>
  );
}

function RequiredField({ label, value, onChange, tried, t, placeholder, inputMode, type, kind }) {
  const isPhone = kind === 'phone';
  const PREFIX = '+974';

  if (isPhone) {
    const localPart = (value || '').replace(/^\+974\s*/, '');
    const handleLocalChange = (raw) => {
      // allow only digits, spaces, and dashes after the locked prefix
      const cleaned = raw.replace(/[^\d\s-]/g, '');
      onChange(PREFIX + ' ' + cleaned);
    };
    const digitCount = localPart.replace(/\D/g, '').length;
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

function ProviderTypeButton({ active, icon: Icon, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`provider-type-card interactive-card tap-highlight rounded-2xl border p-3 text-start transition ${active ? 'is-active' : ''}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-[#D0F2EE] text-[#0B8E7C] dark:bg-[#0B8E7C]/25 dark:text-[#5EEAD4]' : 'bg-muted text-muted-foreground'}`}>
          <Icon className="h-4 w-4" />
        </span>
        {active && <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" />}
      </span>
      <span className="mt-2 block text-[13px] font-bold leading-tight">{title}</span>
      <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{desc}</span>
    </button>
  );
}
