'use client';
import React, { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import DesktopFormAside from '@/components/DesktopFormAside';
import InlineFieldMessage from '@/components/InlineFieldMessage';
import TextOrUnsureField from '@/components/TextOrUnsureField';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { ChoiceChips, DraftNotice, ReviewList, StepFrame, StepNav, StepsLeft } from '@/components/GuidedFlow';
import { LazyFileUploadDropzone, LazyNativeSelect, LazyNetworkStatusNotice, LazySubmissionRetryNotice, LazySuccessPanel } from '@/components/LazyFormControls';
import { useLang } from '@/lib/LangContext';
import { PROJECT_CATEGORIES } from '@/lib/i18n';
import { clearDraft, loadDraft, saveDraft } from '@/lib/formDraft';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, FileText, Layers, Wrench, Snowflake, HardHat, ClipboardCheck, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { getMarketingAttribution, trackMeta, trackMetaOnce } from '@/lib/marketingAttribution';
import { focusFormField } from '@/lib/focusFormField';

const PROJECT_CATEGORY_ICONS = {
  fitout: Layers,
  maintenance: Wrench,
  mep: Snowflake,
  civil: HardHat,
  consultancy: ClipboardCheck,
  other: MoreHorizontal,
};

const MAX_PROJECT_FILES = 5;
const DRAFT_KEY = 'ml:draft:project:v1';
const STEPS = ['type', 'describe', 'location', 'timing', 'budget', 'contact', 'review'];
const CONTACT_STEP = STEPS.indexOf('contact');
// Only these fields are ever written to the browser draft. Contact details and files are not.
const DRAFT_FIELDS = ['category', 'description', 'location', 'timeline', 'budgetRange'];

const COPY = {
  en: {
    pageTitle: 'Post your project',
    type: ['What kind of project is it?', 'Pick the closest match. You can explain the details next.'],
    describe: ['Describe the work', 'Write it in your own words: what needs doing, the space, and anything you already know.'],
    describeHint: 'Tip: press Ctrl + Enter to continue.',
    filesLabel: 'Photos or drawings',
    location: ['Where is the project?', 'Most projects are in Doha. Add the area if you know it, or skip.'],
    locationLabel: 'Area or district',
    locationPh: 'e.g. West Bay',
    locationChips: ['Doha', 'Lusail', 'Al Rayyan', 'Al Wakrah', 'Al Khor'],
    timing: ['When would you like to start?', 'A rough idea is enough. Choose "Not sure" if it is still open.'],
    budget: ['Do you have a budget in mind?', 'This helps firms price realistically. It is fine not to know yet.'],
    contact: ['How can we reach you?', 'We use these details only to coordinate your request.'],
    review: ['Review and send', 'Check your answers. You can edit anything before sending.'],
    send: 'Send project',
    sending: 'Sending…',
    rows: { type: 'Project type', describe: 'Description', files: 'Attachments', location: 'Location', timing: 'Start', budget: 'Budget', contact: 'Contact' },
    notGiven: 'Skipped',
    locationDefault: 'Skipped (Doha by default)',
    filesCount: (n) => (n === 1 ? '1 file' : `${n} files`),
    noFiles: 'None',
    successTitle: 'Brief received.',
    successDesc: 'We are reviewing it now and will send it to suitable vetted firms. Save your tracking link to follow each step.',
    nextTitle: 'What happens next',
    next: ['We review your brief and clarify anything missing.', 'We send it to suitable vetted contractors or consultants.', 'Offers appear on your tracking page as they arrive.', 'You compare them side by side and choose.'],
    whatsapp: 'Questions? Message us on WhatsApp',
  },
  ar: {
    pageTitle: 'انشر مشروعك',
    type: ['ما نوع مشروعك؟', 'اختر الأقرب، ويمكنك شرح التفاصيل في الخطوة التالية.'],
    describe: ['صف العمل المطلوب', 'اكتب بكلماتك: ما المطلوب تنفيذه، وطبيعة المكان، وأي تفاصيل تعرفها.'],
    describeHint: 'تلميح: اضغط Ctrl + Enter للمتابعة.',
    filesLabel: 'صور أو مخططات',
    location: ['أين يقع المشروع؟', 'معظم المشاريع في الدوحة. أضف المنطقة إن كنت تعرفها، أو تخطَّ هذه الخطوة.'],
    locationLabel: 'المنطقة أو الحي',
    locationPh: 'مثال: الخليج الغربي',
    locationChips: ['الدوحة', 'لوسيل', 'الريان', 'الوكرة', 'الخور'],
    timing: ['متى تريد البدء؟', 'تكفي فكرة تقريبية. اختر «غير متأكد» إن لم تحدد بعد.'],
    budget: ['هل لديك ميزانية تقريبية؟', 'تساعد الشركات على التسعير بواقعية، ولا بأس إن لم تحددها بعد.'],
    contact: ['كيف نتواصل معك؟', 'نستخدم هذه البيانات فقط للتنسيق بشأن طلبك.'],
    review: ['راجع وأرسل', 'تأكد من إجاباتك، ويمكنك تعديل أي شيء قبل الإرسال.'],
    send: 'إرسال المشروع',
    sending: 'جارٍ الإرسال…',
    rows: { type: 'نوع المشروع', describe: 'الوصف', files: 'المرفقات', location: 'الموقع', timing: 'موعد البدء', budget: 'الميزانية', contact: 'التواصل' },
    notGiven: 'تم التخطي',
    locationDefault: 'تم التخطي (الدوحة افتراضيًا)',
    filesCount: (n) => (n === 1 ? 'ملف واحد' : n === 2 ? 'ملفان' : `${n} ملفات`),
    noFiles: 'لا يوجد',
    successTitle: 'تم استلام طلبك.',
    successDesc: 'نراجعه الآن ثم نرسله إلى شركات معتمدة مناسبة. احفظ رابط المتابعة لتتابع كل خطوة.',
    nextTitle: 'ماذا يحدث بعد ذلك',
    next: ['نراجع طلبك ونستوضح أي تفاصيل ناقصة.', 'نرسله إلى مقاولين أو استشاريين معتمدين مناسبين.', 'تظهر العروض في صفحة المتابعة فور وصولها.', 'تقارن بينها جنبًا إلى جنب وتختار.'],
    whatsapp: 'لديك سؤال؟ راسلنا على واتساب',
  },
};

function PostProjectInner() {
  const { t, dir, lang } = useLang();
  const copy = COPY[lang === 'ar' ? 'ar' : 'en'];
  const sp = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [returnToReview, setReturnToReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processingFiles, setProcessingFiles] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [tried, setTried] = useState({});
  const [draft, setDraft] = useState(null);
  const started = useRef(false);
  const [data, setData] = useState({
    category: '', description: '', location: '', timeline: '', budgetRange: '', files: [],
    name: '', company: '', phone: '+974 ', email: '', role: '', languagePreference: lang === 'ar' ? 'ar' : 'en',
  });
  const step = STEPS[stepIndex];

  const goTo = useCallback((index, dirName = 'forward') => {
    setDirection(dirName);
    setStepIndex(index);
  }, []);

  useEffect(() => {
    const saved = loadDraft(DRAFT_KEY);
    if (saved && (saved.data?.category || saved.data?.description)) setDraft(saved);
    const cat = sp.get('category');
    if (cat && PROJECT_CATEGORIES.includes(cat)) {
      setData(d => ({ ...d, category: cat }));
      goTo(1);
    }
  }, [sp, goTo]);

  // Save the safe fields as the owner types; never contact details or files.
  useEffect(() => {
    if (!started.current || createdId) return;
    const timer = window.setTimeout(() => {
      const safe = Object.fromEntries(DRAFT_FIELDS.map(k => [k, data[k]]));
      saveDraft(DRAFT_KEY, { data: safe, stepIndex: Math.min(stepIndex, CONTACT_STEP), fileCount: data.files.length });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [data, stepIndex, createdId]);

  const markStarted = () => {
    started.current = true;
    if (draft) setDraft(null);
    trackMetaOnce('project_form_start', 'FormStart', { form_type: 'project' }, { custom: true });
  };
  const update = (k, v) => {
    markStarted();
    setData(d => ({ ...d, [k]: v }));
  };

  const continueDraft = () => {
    setData(d => ({ ...d, ...Object.fromEntries(DRAFT_FIELDS.map(k => [k, draft.data?.[k] ?? d[k]])) }));
    started.current = true;
    goTo(Math.min(draft.stepIndex || 0, CONTACT_STEP));
    setDraft(null);
  };
  const restartDraft = () => {
    clearDraft(DRAFT_KEY);
    setDraft(null);
    setData(d => ({ ...d, category: '', description: '', location: '', timeline: '', budgetRange: '' }));
    goTo(0, 'back');
  };

  const next = () => {
    if (returnToReview) {
      setReturnToReview(false);
      goTo(STEPS.indexOf('review'));
      return;
    }
    goTo(Math.min(stepIndex + 1, STEPS.length - 1));
  };
  const back = () => {
    setReturnToReview(false);
    goTo(Math.max(stepIndex - 1, 0), 'back');
  };
  const edit = (name) => () => {
    setReturnToReview(true);
    goTo(STEPS.indexOf(name), 'back');
  };

  const phoneDigits = (data.phone || '').replace(/^\+974\s*/, '').replace(/\D/g, '').length;
  const contactValid = Boolean(data.name.trim()) && phoneDigits >= 8;

  const submitStep = () => {
    if (step === 'type') {
      if (data.category) next();
      return;
    }
    if (step === 'describe') {
      setTried(s => ({ ...s, describe: true }));
      if (!data.description.trim()) { focusFormField('project-description'); return; }
      if (!processingFiles) next();
      return;
    }
    if (step === 'contact') {
      setTried(s => ({ ...s, contact: true }));
      if (!contactValid) { focusFormField(!data.name.trim() ? 'project-name' : 'project-phone'); return; }
      next();
      return;
    }
    if (step === 'review') { submit(); return; }
    next();
  };

  const submit = async () => {
    if (!contactValid) { goTo(CONTACT_STEP, 'back'); return; }
    setSubmitError(false);
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
      clearDraft(DRAFT_KEY);
      setCreatedId(json.project.id);
    } catch {
      setSubmitError(true);
      toast.error(t('actionFailed'));
    } finally { setSubmitting(false); }
  };

  if (createdId) {
    return (
      <AppShell hideFooter hideNav wide>
        <LazySuccessPanel
          title={copy.successTitle}
          description={copy.successDesc}
          referenceLabel={t('saveLink')}
          referencePath={`/project/${createdId}`}
          copyLabel={t('copyLink')}
          copiedLabel={t('linkCopied')}
          actionHref={`/project/${createdId}`}
          actionLabel={t('viewProject')}
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

  const [title, desc] = copy[step] || [];
  const unsureAware = (value) => !String(value || '').trim();
  const reviewRows = [
    { key: 'type', label: copy.rows.type, value: data.category ? t(`cat_${data.category}`) : copy.notGiven, empty: !data.category, onEdit: edit('type') },
    { key: 'describe', label: copy.rows.describe, value: data.description, onEdit: edit('describe') },
    { key: 'files', label: copy.rows.files, value: data.files.length ? copy.filesCount(data.files.length) : copy.noFiles, empty: !data.files.length, onEdit: edit('describe') },
    { key: 'location', label: copy.rows.location, value: data.location.trim() || copy.locationDefault, empty: !data.location.trim(), onEdit: edit('location') },
    { key: 'timing', label: copy.rows.timing, value: data.timeline.trim() || copy.notGiven, empty: unsureAware(data.timeline), onEdit: edit('timing') },
    { key: 'budget', label: copy.rows.budget, value: data.budgetRange.trim() || copy.notGiven, empty: unsureAware(data.budgetRange), onEdit: edit('budget') },
    { key: 'contact', label: copy.rows.contact, value: [data.name, data.phone, data.email].filter(v => v && v.trim() && v.trim() !== '+974').join(' · '), onEdit: edit('contact') },
  ];

  return (
    <AppShell hideFooter hideNav wide>
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div className="ml-flow project-form-flow min-w-0" data-form-step={stepIndex + 1}>
          <p className="eyebrow mb-4">{copy.pageTitle}</p>
          <LazyNetworkStatusNotice />
          {draft && <DraftNotice hadFiles={draft.fileCount > 0} onContinue={continueDraft} onRestart={restartDraft} />}
          <StepsLeft index={stepIndex} total={STEPS.length} />

          <StepFrame stepKey={step} direction={direction} title={title} description={desc} onSubmit={submitStep}>
            {step === 'type' && (
              <div className="ml-choice-list" role="group" aria-label={title}>
                {PROJECT_CATEGORIES.map(c => {
                  const Icon = PROJECT_CATEGORY_ICONS[c] || MoreHorizontal;
                  const selected = data.category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={selected}
                      className="ml-choice"
                      onClick={() => { update('category', c); if (returnToReview) { setReturnToReview(false); goTo(STEPS.indexOf('review')); } else goTo(1); }}
                    >
                      <span className="ml-choice-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <span className="ml-choice-text">{t(`cat_${c}`)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 'describe' && (
              <>
                <div>
                  <Label htmlFor="project-description">{t('description')}</Label>
                  <Textarea
                    id="project-description"
                    data-autofocus
                    value={data.description}
                    onChange={e => update('description', e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submitStep(); } }}
                    placeholder={t('descriptionPh')}
                    aria-invalid={Boolean(tried.describe && !data.description.trim())}
                    aria-required="true"
                    aria-describedby={tried.describe && !data.description.trim() ? 'project-description-error' : 'project-description-hint'}
                    className="mt-1.5 min-h-[160px]"
                  />
                  {tried.describe && !data.description.trim()
                    ? <InlineFieldMessage id="project-description-error">{t('requireField')}</InlineFieldMessage>
                    : <p id="project-description-hint" className="ml-field-hint hidden [@media(pointer:fine)]:block">{copy.describeHint}</p>}
                </div>
                <div>
                  <Label htmlFor="project-files">{copy.filesLabel} <span className="ms-1 text-[12px] font-normal text-muted-foreground">({t('optional')})</span></Label>
                  <LazyFileUploadDropzone
                    id="project-files"
                    className="mt-1.5"
                    label={data.files.length >= MAX_PROJECT_FILES ? `${data.files.length}/${MAX_PROJECT_FILES} ${t('files')}` : `${t('uploadFiles')} · ${data.files.length}/${MAX_PROJECT_FILES}`}
                    hint={data.files.length >= MAX_PROJECT_FILES ? t('fileLimitReached') : t('uploadHint')}
                    hasFiles={data.files.length > 0}
                    busy={processingFiles}
                    disabled={processingFiles || data.files.length >= MAX_PROJECT_FILES}
                    selectedFiles={data.files}
                    maxFiles={MAX_PROJECT_FILES}
                    onBusyChange={setProcessingFiles}
                    onFilesReady={(items) => {
                      markStarted();
                      setData(d => ({ ...d, files: [...d.files, ...items].slice(0, MAX_PROJECT_FILES) }));
                    }}
                    multiple
                    accept="image/*,application/pdf"
                  />
                  {data.files.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {data.files.map((f, i) => (
                        <div key={i} className="flex min-h-11 items-center gap-2 rounded-[6px] border border-border bg-secondary ps-3 pe-1 text-xs text-foreground">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="line-clamp-2 min-w-0 flex-1 break-words text-start leading-snug" dir="auto" title={f.name}>{f.name}</span>
                          <Button
                            type="button"
                            variant="destructiveGhost"
                            size="icon"
                            onClick={() => { update('files', data.files.filter((_, j) => j !== i)); focusFormField('project-files'); }}
                            disabled={processingFiles}
                            className="shrink-0"
                            aria-label={`${t('removeFile')}: ${f.name}`}
                            title={t('removeFile')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 'location' && (
              <div>
                <Label htmlFor="project-location">{copy.locationLabel}</Label>
                <Input id="project-location" data-autofocus dir="auto" autoComplete="off" value={data.location} onChange={e => update('location', e.target.value)} placeholder={copy.locationPh} className="mt-1.5" />
                <div className="mt-3">
                  <ChoiceChips options={copy.locationChips} value={data.location} onChange={v => update('location', v)} label={copy.locationLabel} />
                </div>
              </div>
            )}

            {step === 'timing' && (
              <TextOrUnsureField id="project-timeline" label={t('preferredStart')} value={data.timeline}
                onChange={value => update('timeline', value)} placeholder={t('timelinePh')}
                lang={dir === 'rtl' ? 'ar' : 'en'} choiceKind="timeline" />
            )}

            {step === 'budget' && (
              <TextOrUnsureField id="project-budget" label={t('budget')} value={data.budgetRange}
                onChange={value => update('budgetRange', value)} placeholder={t('budgetPh')}
                lang={dir === 'rtl' ? 'ar' : 'en'} choiceKind="budget" />
            )}

            {step === 'contact' && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <RequiredField id="project-name" label={t('name')} value={data.name} onChange={v => update('name', v)} tried={tried.contact} t={t} autoFocus autoComplete="name" />
                  <RequiredField id="project-phone" label={t('phone')} value={data.phone} onChange={v => update('phone', v)} tried={tried.contact} t={t} kind="phone" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <OptionalField id="project-email" label={t('email')} t={t} value={data.email} onChange={v => update('email', v)} type="email" dir="ltr" autoComplete="email" />
                  <OptionalField id="project-company" label={t('company')} t={t} value={data.company} onChange={v => update('company', v)} autoComplete="organization" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <OptionalField id="project-role" label={t('role')} t={t} value={data.role} onChange={v => update('role', v)} placeholder={t('rolePh')} autoComplete="organization-title" />
                  <div>
                    <Label htmlFor="project-preferred-language">{t('preferredLanguage')}</Label>
                    <LazyNativeSelect id="project-preferred-language" value={data.languagePreference} onChange={e => update('languagePreference', e.target.value)} wrapperClassName="mt-1.5">
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </LazyNativeSelect>
                  </div>
                </div>
              </>
            )}

            {step === 'review' && (
              <>
                <ReviewList rows={reviewRows} />
                {submitError && <LazySubmissionRetryNotice id="project-submit-error" />}
              </>
            )}

            {(step !== 'type' || data.category) && (
              <StepNav
                onBack={stepIndex > 0 ? back : undefined}
                optionalEmpty={['location', 'timing', 'budget'].includes(step) && !String(data[{ location: 'location', timing: 'timeline', budget: 'budgetRange' }[step]] || '').trim()}
                returnToReview={returnToReview}
                primaryLabel={step === 'review' ? copy.send : undefined}
                busy={submitting || (step === 'describe' && processingFiles)}
                busyLabel={step === 'review' ? copy.sending : t('loading')}
                describedBy={submitError ? 'project-submit-error' : undefined}
              />
            )}
          </StepFrame>
        </div>
        <DesktopFormAside
          steps={[
            { title: t('projL_s1'), desc: t('projL_s1d') },
            { title: t('projL_s2'), desc: t('projL_s2d') },
            { title: t('projL_s3'), desc: t('projL_s3d') },
          ]}
          note={t('projL_privacy')}
        />
      </div>
    </AppShell>
  );
}

function OptionalField({ id, label, t, value, onChange, ...inputProps }) {
  return (
    <div>
      <Label htmlFor={id}>{label} <span className="ms-1 text-[12px] font-normal text-muted-foreground">({t('optional')})</span></Label>
      <Input id={id} value={value} onChange={e => onChange(e.target.value)} className="mt-1.5" {...inputProps} />
    </div>
  );
}

function RequiredField({ id, label, value, onChange, tried, t, placeholder, kind, autoFocus = false, autoComplete }) {
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
        <Label htmlFor={id}>{label} <span aria-hidden="true" className="ms-1 text-warn">*</span></Label>
        <div dir="ltr" data-invalid={showError || undefined} className={`phone-field-shell mt-1.5 flex min-h-12 items-stretch overflow-hidden rounded-[6px] border bg-card transition-[border-color,box-shadow] ${showError ? 'border-warn focus-within:ring-2 focus-within:ring-[#B5462B]/25' : 'border-input hover:border-[#009F91]/45 focus-within:border-[#009F91] focus-within:ring-2 focus-within:ring-[#009F91]/25'}`}>
          <div className="flex shrink-0 select-none items-center border-e border-input bg-secondary px-3 text-sm font-semibold text-navy">{PREFIX}</div>
          <input
            id={id}
            value={localPart}
            onChange={e => onChange(`${PREFIX} ${e.target.value.replace(/[^\d\s-]/g, '')}`)}
            inputMode="tel"
            autoComplete="tel-national"
            aria-invalid={showError}
            aria-required="true"
            aria-describedby={showError ? errorId : undefined}
            className="min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-sm [@media(pointer:coarse)]:!text-base"
          />
        </div>
        {showError && <InlineFieldMessage id={errorId}>{tooShort ? t('invalidPhone') : t('requireField')}</InlineFieldMessage>}
      </div>
    );
  }

  const showError = tried && !String(value || '').trim();
  return (
    <div>
      <Label htmlFor={id}>{label} <span aria-hidden="true" className="ms-1 text-warn">*</span></Label>
      <Input
        id={id}
        data-autofocus={autoFocus || undefined}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={showError}
        aria-required="true"
        aria-describedby={showError ? errorId : undefined}
        className="mt-1.5"
      />
      {showError && <InlineFieldMessage id={errorId}>{t('requireField')}</InlineFieldMessage>}
    </div>
  );
}

export default function PostProjectPage() {
  return (
    <Suspense fallback={<FormLoadingState />}>
      <PostProjectInner />
    </Suspense>
  );
}

function FormLoadingState() {
  return (
    <AppShell hideFooter hideNav wide>
      <div className="ml-flow" aria-hidden="true">
        <div className="mb-7 h-1 w-full animate-pulse rounded-full bg-muted" />
        <div className="h-8 w-2/3 animate-pulse rounded-[6px] bg-muted" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded-[6px] bg-muted" />
        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-16 animate-pulse rounded-[6px] bg-muted" />)}
        </div>
      </div>
    </AppShell>
  );
}
