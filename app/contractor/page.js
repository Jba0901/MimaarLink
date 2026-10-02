'use client';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import DesktopFormAside from '@/components/DesktopFormAside';
import InlineFieldMessage from '@/components/InlineFieldMessage';
import TextOrUnsureField from '@/components/TextOrUnsureField';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { DraftNotice, ReviewList, StepFrame, StepNav, StepsLeft } from '@/components/GuidedFlow';
import { LazyFileUploadDropzone, LazyNetworkStatusNotice, LazySubmissionRetryNotice, LazySuccessPanel } from '@/components/LazyFormControls';
import { useLang } from '@/lib/LangContext';
import { CATEGORIES, CONSULTANT_CATEGORIES, CONSULTANT_GRADES } from '@/lib/i18n';
import { clearDraft, loadDraft, saveDraft } from '@/lib/formDraft';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, X, FileText, Building2, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getMarketingAttribution, trackMeta, trackMetaOnce } from '@/lib/marketingAttribution';
import { focusFormField } from '@/lib/focusFormField';

const MAX_PROVIDER_PROFILE_FILES = 1;
const DRAFT_KEY = 'ml:draft:provider:v1';
// Only these fields are ever written to the browser draft. CR, WhatsApp, names, email and files are not.
const DRAFT_FIELDS = ['providerType', 'companyName', 'categories', 'consultantGrade', 'otherCategoryDesc', 'projectSizeRange'];
const GRADE_LABEL_KEYS = { unknown: 'gradeUnknown', grade_a: 'gradeA', grade_b: 'gradeB', grade_c: 'gradeC' };

// No service-area step: most work is in Doha (DECISIONS.md, 2026-10-02). The API stores an empty area.
const stepsFor = (isConsultant) => ['type', 'company', 'contact', 'services', ...(isConsultant ? ['grade'] : []), 'size', 'profile', 'review'];

const COPY = {
  en: {
    eyebrowAny: 'Join as a contractor or consultant',
    type: ['How would you like to join?', 'Choose the option that describes your company.'],
    company: ['Your company', 'The CR number is all we need to start verification.'],
    contact: ['How can we reach you?', 'We contact applicants on WhatsApp.'],
    services: ['What work do you take on?', 'Choose every service you want projects for.'],
    servicesConsultant: ['Which services does your office offer?', 'Choose every service you want projects for.'],
    grade: ['What is your classification?', 'If you are not sure, choose the first option.'],
    size: ['What project size suits you?', 'A typical range in QAR helps us match you.'],
    profile: ['Add a company profile?', 'Optional. One PDF or image helps our review.'],
    review: ['Review and apply', 'Check your details. You can edit anything before sending.'],
    listSeparator: ', ',
    send: 'Send application',
    sending: 'Sending…',
    rows: { type: 'Applying as', company: 'Company', contact: 'Contact', services: 'Services', grade: 'Classification', size: 'Typical project size', profile: 'Company profile' },
    notGiven: 'Skipped',
    none: 'None',
    successTitle: 'Application received.',
    nextTitle: 'What happens after you apply',
    next: ['We verify your CR number and review your services.', 'We may message you on WhatsApp to confirm details.', 'Once approved, you receive projects that match your services.', 'Your tracking link shows your application status at any time.'],
    whatsapp: 'Questions? Message us on WhatsApp',
  },
  ar: {
    eyebrowAny: 'انضم كمقاول أو استشاري',
    type: ['كيف تريد الانضمام؟', 'اختر ما يصف شركتك.'],
    company: ['بيانات شركتك', 'رقم السجل التجاري هو كل ما نحتاجه لبدء التحقق.'],
    contact: ['كيف نتواصل معك؟', 'نتواصل مع المتقدمين عبر واتساب.'],
    services: ['ما الأعمال التي تنفذها؟', 'اختر كل خدمة ترغب باستلام مشاريع لها.'],
    servicesConsultant: ['ما الخدمات التي يقدمها مكتبك؟', 'اختر كل خدمة ترغب باستلام مشاريع لها.'],
    grade: ['ما تصنيف مكتبك؟', 'إن لم تكن متأكدًا، اختر الخيار الأول.'],
    size: ['ما حجم المشاريع المناسب لك؟', 'يساعدنا نطاق تقريبي بالريال في مطابقتك مع المشاريع.'],
    profile: ['هل تريد إرفاق ملف تعريفي؟', 'اختياري. ملف PDF أو صورة واحدة تساعدنا في المراجعة.'],
    review: ['راجع وأرسل الطلب', 'تأكد من بياناتك، ويمكنك تعديل أي شيء قبل الإرسال.'],
    listSeparator: '، ',
    send: 'إرسال الطلب',
    sending: 'جارٍ الإرسال…',
    rows: { type: 'الانضمام كـ', company: 'الشركة', contact: 'التواصل', services: 'الخدمات', grade: 'التصنيف', size: 'حجم المشاريع المعتاد', profile: 'الملف التعريفي' },
    notGiven: 'تم التخطي',
    none: 'لا يوجد',
    successTitle: 'تم استلام طلبك.',
    nextTitle: 'ماذا يحدث بعد التقديم',
    next: ['نتحقق من رقم السجل التجاري ونراجع خدماتك.', 'قد نراسلك عبر واتساب لتأكيد بعض التفاصيل.', 'بعد الاعتماد، تستلم مشاريع تناسب خدماتك.', 'يعرض رابط المتابعة حالة طلبك في أي وقت.'],
    whatsapp: 'لديك سؤال؟ راسلنا على واتساب',
  },
};

export default function ContractorPage() {
  return (
    <Suspense fallback={<FormLoadingState />}>
      <ContractorApplicationInner />
    </Suspense>
  );
}

function FormLoadingState() {
  return (
    <AppShell hideFooter hideNav wide>
      <div className="ml-flow" aria-hidden="true">
        <div className="mb-7 h-1 w-full animate-pulse rounded-full ml-skel" />
        <div className="h-8 w-2/3 animate-pulse rounded-[6px] ml-skel" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded-[6px] ml-skel" />
        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => <div key={i} className="h-24 animate-pulse rounded-[6px] ml-skel" />)}
        </div>
      </div>
    </AppShell>
  );
}

function ContractorApplicationInner() {
  const { t, lang } = useLang();
  const copy = COPY[lang === 'ar' ? 'ar' : 'en'];
  const sp = useSearchParams();
  const requestedParam = sp.get('type');
  // Nothing is preselected: the type comes from a contractor/consultant link or from the applicant's tap.
  const requestedType = requestedParam === 'consultant' || requestedParam === 'contractor' ? requestedParam : '';
  const [stepName, setStepName] = useState('type');
  const [direction, setDirection] = useState('forward');
  const [returnToReview, setReturnToReview] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [processingDocumentKey, setProcessingDocumentKey] = useState('');
  const [submitError, setSubmitError] = useState(false);
  const [tried, setTried] = useState({});
  const [draft, setDraft] = useState(null);
  const started = useRef(false);
  const [data, setData] = useState({
    providerType: requestedType,
    companyName: '', crNumber: '', contactPerson: '', whatsapp: '+974 ', email: '',
    categories: [], consultantGrade: '', consultantServices: [],
    otherCategoryDesc: '', projectSizeRange: '', documents: [],
  });

  const isConsultant = data.providerType === 'consultant';
  const steps = stepsFor(isConsultant);
  const stepIndex = Math.max(steps.indexOf(stepName), 0);
  const serviceOptions = isConsultant ? CONSULTANT_CATEGORIES : CATEGORIES;

  const goTo = useCallback((name, dirName = 'forward') => {
    setDirection(dirName);
    setStepName(name);
  }, []);

  useEffect(() => {
    // Arriving from a contractor or consultant link skips the type question.
    if (requestedType) {
      setData(d => ({
        ...d,
        providerType: requestedType,
        consultantGrade: requestedType === 'consultant' ? d.consultantGrade : '',
        consultantServices: requestedType === 'consultant' ? d.consultantServices : [],
      }));
      goTo('company');
    }
    const saved = loadDraft(DRAFT_KEY);
    if (saved && (saved.data?.categories?.length || saved.data?.companyName)) setDraft(saved);
  }, [requestedType, goTo]);

  // Save the safe fields as the applicant types; never CR, WhatsApp, names, email or files.
  useEffect(() => {
    if (!started.current || createdId) return;
    const timer = window.setTimeout(() => {
      const safe = Object.fromEntries(DRAFT_FIELDS.map(k => [k, data[k]]));
      const resumeAt = ['type', 'company', 'contact'].includes(stepName) ? stepName : 'services';
      saveDraft(DRAFT_KEY, { data: safe, stepName: resumeAt, fileCount: data.documents.length });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [data, stepName, createdId]);

  const markFormStarted = (providerType = data.providerType) => {
    started.current = true;
    if (draft) setDraft(null);
    trackMetaOnce(`provider_form_start_${providerType}`, 'FormStart', { form_type: 'provider', provider_type: providerType }, { custom: true });
  };
  const update = (k, v) => {
    markFormStarted();
    setData(d => ({ ...d, [k]: v }));
  };

  const continueDraft = () => {
    const restored = Object.fromEntries(DRAFT_FIELDS.map(k => [k, draft.data?.[k]]).filter(([, v]) => v !== undefined));
    setData(d => {
      const merged = { ...d, ...restored };
      return { ...merged, consultantServices: merged.providerType === 'consultant' ? merged.categories : [] };
    });
    started.current = true;
    // Contact details are never saved, so resume where they are asked again.
    goTo(draft.data?.categories?.length ? 'company' : (draft.stepName || 'type'));
    setDraft(null);
  };
  const restartDraft = () => {
    clearDraft(DRAFT_KEY);
    setDraft(null);
    setData(d => ({ ...d, companyName: '', categories: [], consultantServices: [], consultantGrade: '', otherCategoryDesc: '', projectSizeRange: '' }));
    goTo(requestedType ? 'company' : 'type', 'back');
  };

  const selectProviderType = (providerType) => {
    markFormStarted(providerType);
    setData(d => (d.providerType === providerType ? d : {
      ...d,
      providerType,
      categories: [],
      consultantServices: [],
      consultantGrade: '',
      otherCategoryDesc: '',
    }));
    goTo('company');
  };

  const toggleCat = (c) => {
    markFormStarted();
    setData(d => {
      const isRemoving = d.categories.includes(c);
      const next = isRemoving ? d.categories.filter(x => x !== c) : [...d.categories, c];
      return {
        ...d,
        categories: next,
        consultantServices: d.providerType === 'consultant' ? next : [],
        otherCategoryDesc: c === 'other' && isRemoving ? '' : d.otherCategoryDesc,
      };
    });
  };

  const phoneDigits = (data.whatsapp || '').replace(/^\+974\s*/, '').replace(/\D/g, '').length;
  const phoneValid = phoneDigits >= 8;
  const hasOther = data.categories.includes('other');
  const otherDescValid = !hasOther || (data.otherCategoryDesc || '').trim().length >= 3;
  const servicesValid = data.categories.length > 0 && otherDescValid;

  const next = () => {
    if (returnToReview) { setReturnToReview(false); goTo('review'); return; }
    goTo(steps[Math.min(stepIndex + 1, steps.length - 1)]);
  };
  const back = () => {
    setReturnToReview(false);
    goTo(steps[Math.max(stepIndex - 1, 0)], 'back');
  };
  const edit = (name) => () => { setReturnToReview(true); goTo(name, 'back'); };

  const submitStep = () => {
    if (stepName === 'company') {
      setTried(s => ({ ...s, company: true }));
      if (!data.crNumber.trim()) { focusFormField('provider-cr-number'); return; }
    }
    if (stepName === 'contact') {
      setTried(s => ({ ...s, contact: true }));
      if (!phoneValid) { focusFormField('provider-whatsapp'); return; }
    }
    if (stepName === 'services') {
      setTried(s => ({ ...s, services: true }));
      if (!servicesValid) { focusFormField(data.categories.length === 0 ? 'provider-first-service' : 'provider-other-category'); return; }
    }
    if (stepName === 'profile' && processingDocumentKey) return;
    if (stepName === 'review') { submit(); return; }
    next();
  };

  const submit = async () => {
    if (!data.providerType) { goTo('type', 'back'); return; }
    if (!data.crNumber.trim()) { goTo('company', 'back'); return; }
    if (!phoneValid) { goTo('contact', 'back'); return; }
    if (!servicesValid) { goTo('services', 'back'); return; }
    setSubmitError(false);
    setSubmitting(true);
    try {
      const res = await fetch('/api/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // An unanswered classification is sent as 'unknown', as before.
        body: JSON.stringify({ ...data, consultantGrade: isConsultant ? (data.consultantGrade || 'unknown') : '', marketingAttribution: getMarketingAttribution() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      trackMeta('CompleteRegistration', { content_name: 'provider_application', provider_type: data.providerType });
      clearDraft(DRAFT_KEY);
      setCreatedId(json.id);
    } catch {
      setSubmitError(true);
      toast.error(t('actionFailed'));
    } finally { setSubmitting(false); }
  };

  const profileFiles = data.documents.filter(d => d.label === 'profile');
  const profileFileLimitReached = profileFiles.length >= MAX_PROVIDER_PROFILE_FILES;

  if (createdId) {
    return (
      <AppShell hideFooter hideNav wide>
        <LazySuccessPanel
          title={copy.successTitle}
          description={isConsultant ? t('consultantDoneDesc') : t('contractorDoneDesc')}
          referenceLabel={t('saveProviderLink')}
          referencePath={`/contractor-status/${createdId}`}
          copyLabel={t('copyLink')}
          copiedLabel={t('linkCopied')}
          actionHref={`/contractor-status/${createdId}`}
          actionLabel={t('viewProviderStatus')}
        >
          <div className="mt-6 text-start">
            <p className="text-[14px] font-semibold text-navy">{copy.nextTitle}</p>
            <ol className="ml-next-steps">
              {copy.next.map((line, i) => <li key={line}><span aria-hidden="true">{i + 1}</span>{line}</li>)}
            </ol>
          </div>
          <a href="https://wa.me/97466259219" target="_blank" rel="noreferrer" className="btn btn-secondary mt-5 w-full">
            <WhatsAppIcon className="h-4 w-4" />{copy.whatsapp}
          </a>
        </LazySuccessPanel>
      </AppShell>
    );
  }

  const [title, desc] = (stepName === 'services' && isConsultant ? copy.servicesConsultant : copy[stepName]) || [];
  const joinWith = (values) => values.filter(v => v && String(v).trim() && String(v).trim() !== '+974').join(' · ');
  const reviewRows = [
    { key: 'type', label: copy.rows.type, value: isConsultant ? t('providerTypeConsultant') : t('providerTypeContractor'), onEdit: edit('type') },
    { key: 'company', label: copy.rows.company, value: joinWith([data.companyName, `${t('crNumber')}: ${data.crNumber}`]), onEdit: edit('company') },
    { key: 'contact', label: copy.rows.contact, value: joinWith([data.contactPerson, data.whatsapp, data.email]), onEdit: edit('contact') },
    { key: 'services', label: copy.rows.services, value: [...data.categories.map(c => t(`cat_${c}`)), hasOther ? data.otherCategoryDesc : ''].filter(Boolean).join(copy.listSeparator), onEdit: edit('services') },
    ...(isConsultant ? [{ key: 'grade', label: copy.rows.grade, value: t(GRADE_LABEL_KEYS[data.consultantGrade || 'unknown']), onEdit: edit('grade') }] : []),
    { key: 'size', label: copy.rows.size, value: data.projectSizeRange.trim() || copy.notGiven, empty: !data.projectSizeRange.trim(), onEdit: edit('size') },
    { key: 'profile', label: copy.rows.profile, value: profileFiles[0]?.name || copy.none, empty: !profileFiles.length, onEdit: edit('profile') },
  ];
  const optionalEmpty = (stepName === 'size' && !data.projectSizeRange.trim())
    || (stepName === 'profile' && !profileFiles.length);

  return (
    <AppShell hideFooter hideNav wide>
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div className="ml-flow provider-form-flow min-w-0" data-form-step={stepIndex + 1}>
          <p className="eyebrow mb-4">{!data.providerType ? copy.eyebrowAny : isConsultant ? t('consultantTitle') : t('contractorTitle')}</p>
          <LazyNetworkStatusNotice />
          {draft && <DraftNotice hadFiles={draft.fileCount > 0} onContinue={continueDraft} onRestart={restartDraft} />}
          <StepsLeft index={stepIndex} total={steps.length} />

          <StepFrame stepKey={stepName} direction={direction} title={title} description={desc} onSubmit={submitStep}>
            {stepName === 'type' && (
              <div className="ml-choice-list" role="group" aria-label={t('providerTypeLabel')}>
                {[['contractor', Building2, t('providerTypeContractor'), t('providerTypeContractorDesc')], ['consultant', ClipboardCheck, t('providerTypeConsultant'), t('providerTypeConsultantDesc')]].map(([value, Icon, label, hint]) => (
                  <button key={value} type="button" aria-pressed={data.providerType === value} className="ml-choice" onClick={() => selectProviderType(value)}>
                    <span className="ml-choice-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="ml-choice-text">{label}<small>{hint}</small></span>
                  </button>
                ))}
              </div>
            )}

            {stepName === 'company' && (
              <>
                <FormField id="provider-cr-number" label={t('crNumber')} value={data.crNumber} onChange={v => update('crNumber', v)} tried={tried.company} t={t} autoFocus dir="ltr" />
                <FormField id="provider-company-name" label={t('companyName')} value={data.companyName} onChange={v => update('companyName', v)} tried={tried.company} t={t} required={false} autoComplete="organization" />
              </>
            )}

            {stepName === 'contact' && (
              <>
                <FormField id="provider-whatsapp" label={t('whatsapp')} value={data.whatsapp} onChange={v => update('whatsapp', v)} tried={tried.contact} t={t} kind="phone" />
                <FormField id="provider-contact-person" label={t('contactPerson')} value={data.contactPerson} onChange={v => update('contactPerson', v)} tried={tried.contact} t={t} required={false} autoComplete="name" />
                <FormField id="provider-email" label={t('email')} value={data.email} onChange={v => update('email', v)} tried={tried.contact} t={t} required={false} type="email" dir="ltr" autoComplete="email" />
              </>
            )}

            {stepName === 'services' && (
              <>
                {tried.services && data.categories.length === 0 && <InlineFieldMessage id="provider-services-error" className="mt-0">{t('requireField')}</InlineFieldMessage>}
                <div className="ml-choice-list" role="group" aria-label={title} aria-describedby={tried.services && data.categories.length === 0 ? 'provider-services-error' : undefined}>
                  {serviceOptions.map((c, index) => {
                    const selected = data.categories.includes(c);
                    return (
                      <button key={c} id={index === 0 ? 'provider-first-service' : undefined} type="button" aria-pressed={selected} className="ml-choice" style={{ minHeight: 56 }} onClick={() => toggleCat(c)}>
                        <span className="ml-choice-text">{t(`cat_${c}`)}</span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border ${selected ? 'border-[#009F91] bg-[#009F91] text-white' : 'border-border'}`} aria-hidden="true">
                          {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {hasOther && (
                  <div>
                    <Label htmlFor="provider-other-category">{t('otherCategoryLabel')} <span aria-hidden="true" className="ms-1 text-[#B5462B]">*</span></Label>
                    <Textarea
                      id="provider-other-category"
                      value={data.otherCategoryDesc}
                      onChange={e => update('otherCategoryDesc', e.target.value)}
                      placeholder={t('otherCategoryPh')}
                      rows={3}
                      maxLength={300}
                      aria-invalid={Boolean(tried.services && !otherDescValid)}
                      aria-required="true"
                      aria-describedby={`provider-other-category-help${tried.services && !otherDescValid ? ' provider-other-category-error' : ''}`}
                      className="mt-1.5"
                    />
                    <div id="provider-other-category-help" className="ml-field-hint">{t('otherCategoryHelp')}</div>
                    {tried.services && !otherDescValid && <InlineFieldMessage id="provider-other-category-error">{t('requireField')}</InlineFieldMessage>}
                  </div>
                )}
              </>
            )}

            {stepName === 'grade' && (
              <div className="ml-choice-list" role="group" aria-label={t('consultantGrade')}>
                {CONSULTANT_GRADES.map(g => (
                  <button key={g} type="button" aria-pressed={data.consultantGrade === g} className="ml-choice" onClick={() => { update('consultantGrade', g); next(); }}>
                    <span className="ml-choice-text">{t(GRADE_LABEL_KEYS[g])}</span>
                  </button>
                ))}
              </div>
            )}

            {stepName === 'size' && (
              <TextOrUnsureField id="provider-project-size" label={t('projectSize')} value={data.projectSizeRange}
                onChange={value => update('projectSizeRange', value)} placeholder={t('projectSizePh')}
                lang={lang} choiceKind="projectSize" />
            )}

            {stepName === 'profile' && (
              <div>
                <Label htmlFor="provider-document-profile">{t('uploadCompanyProfile')} <span className="ms-1 text-[12px] font-normal text-muted-foreground">({t('optional')})</span></Label>
                <LazyFileUploadDropzone
                  id="provider-document-profile"
                  className="mt-1.5 min-h-[72px]"
                  label={profileFileLimitReached ? `1/1 ${t('files')}` : `${t('uploadCompanyProfile')} · 0/1`}
                  hint={profileFileLimitReached ? t('fileLimitReached') : t('uploadHint')}
                  hasFiles={profileFiles.length > 0}
                  busy={processingDocumentKey === 'profile'}
                  disabled={Boolean(processingDocumentKey) || profileFileLimitReached}
                  selectedFiles={profileFiles}
                  maxFiles={MAX_PROVIDER_PROFILE_FILES}
                  onBusyChange={(isBusy) => setProcessingDocumentKey(isBusy ? 'profile' : '')}
                  onFilesReady={(items) => {
                    markFormStarted();
                    setData(d => ({ ...d, documents: items.slice(0, MAX_PROVIDER_PROFILE_FILES).map(item => ({ ...item, label: 'profile' })) }));
                  }}
                  accept="image/*,application/pdf"
                />
                <div className="mt-2 space-y-1">
                  {profileFiles.map((f, i) => (
                    <div key={i} className="flex min-h-11 items-center gap-2 rounded-[6px] border border-border bg-secondary ps-3 pe-1 text-xs text-foreground">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-2 min-w-0 flex-1 break-words text-start leading-snug" dir="auto" title={f.name}>{f.name}</span>
                      <Button type="button" variant="destructiveGhost" size="icon" onClick={() => { update('documents', []); focusFormField('provider-document-profile'); }} disabled={Boolean(processingDocumentKey)} className="shrink-0" aria-label={`${t('removeFile')}: ${f.name}`} title={t('removeFile')}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stepName === 'review' && (
              <>
                <ReviewList rows={reviewRows} />
                {submitError && <LazySubmissionRetryNotice id="provider-submit-error" />}
              </>
            )}

            {!['type', 'grade'].includes(stepName) && (
              <StepNav
                onBack={stepIndex > 0 ? back : undefined}
                optionalEmpty={optionalEmpty}
                returnToReview={returnToReview}
                primaryLabel={stepName === 'review' ? copy.send : undefined}
                busy={submitting || (stepName === 'profile' && Boolean(processingDocumentKey))}
                busyLabel={stepName === 'review' ? copy.sending : t('loading')}
                describedBy={submitError ? 'provider-submit-error' : undefined}
              />
            )}
            {stepName === 'grade' && <StepNav onBack={back} returnToReview={returnToReview} />}
          </StepFrame>
        </div>
        <DesktopFormAside
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

function FormField({ id, label, value, onChange, tried, t, placeholder, inputMode, type, kind, required = true, autoFocus = false, autoComplete, dir }) {
  const errorId = `${id}-error`;
  const PREFIX = '+974';

  if (kind === 'phone') {
    const localPart = (value || '').replace(/^\+974\s*/, '');
    const digitCount = localPart.replace(/\D/g, '').length;
    const empty = !localPart.trim();
    const tooShort = !empty && digitCount < 8;
    const showError = tried && (empty || tooShort);
    return (
      <div>
        <Label htmlFor={id}>{label} <span aria-hidden="true" className="ms-1 text-[#B5462B]">*</span></Label>
        <div dir="ltr" data-invalid={showError || undefined} className={`phone-field-shell mt-1.5 flex min-h-12 items-stretch overflow-hidden rounded-[6px] border bg-card transition-[border-color,box-shadow] ${showError ? 'border-[#B5462B] focus-within:ring-2 focus-within:ring-[#B5462B]/25' : 'border-input hover:border-[#009F91]/45 focus-within:border-[#009F91] focus-within:ring-2 focus-within:ring-[#009F91]/25'}`}>
          <div className="flex shrink-0 select-none items-center border-e border-input bg-secondary px-3 text-sm font-semibold text-navy">{PREFIX}</div>
          <input
            id={id}
            data-autofocus
            value={localPart}
            onChange={e => onChange(`${PREFIX} ${e.target.value.replace(/[^\d\s-]/g, '')}`)}
            inputMode="tel"
            autoComplete="tel-national"
            aria-invalid={showError}
            aria-required="true"
            aria-describedby={showError ? errorId : undefined}
            className="min-h-12 min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-sm [@media(pointer:coarse)]:!text-base"
          />
        </div>
        {showError && <InlineFieldMessage id={errorId}>{tooShort ? t('invalidPhone') : t('requireField')}</InlineFieldMessage>}
      </div>
    );
  }

  const showError = required && tried && !String(value || '').trim();
  return (
    <div>
      <Label htmlFor={id}>
        {label} {required
          ? <span aria-hidden="true" className="ms-1 text-[#B5462B]">*</span>
          : <span className="ms-1 text-[12px] font-normal text-muted-foreground">({t('optional')})</span>}
      </Label>
      <Input
        id={id}
        data-autofocus={autoFocus || undefined}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        type={type}
        dir={dir}
        autoComplete={autoComplete}
        aria-invalid={showError}
        aria-required={required ? 'true' : undefined}
        aria-describedby={showError ? errorId : undefined}
        className="mt-1.5"
      />
      {showError && <InlineFieldMessage id={errorId}>{t('requireField')}</InlineFieldMessage>}
    </div>
  );
}
