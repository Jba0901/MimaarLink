'use client';
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Loader2, PencilLine, RotateCcw } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

// Shared pieces for one-question-per-screen forms (brand/BRAND.md section 7).
const COPY = {
  en: {
    continue: 'Continue',
    skip: 'Skip',
    back: 'Back',
    backToReview: 'Back to review',
    edit: 'Edit',
    lastStep: 'Last step: review and send',
    stepsLeft: (n) => (n === 1 ? '1 step left' : `${n} steps left`),
    draftTitle: 'We saved your draft',
    draftBody: 'Pick up where you left off, or start again.',
    draftFiles: 'Attachments are not saved in drafts, so add them again.',
    draftContinue: 'Continue draft',
    draftRestart: 'Start over',
  },
  ar: {
    continue: 'متابعة',
    skip: 'تخطَّ',
    back: 'رجوع',
    backToReview: 'العودة إلى المراجعة',
    edit: 'تعديل',
    lastStep: 'الخطوة الأخيرة: راجع وأرسل',
    stepsLeft: (n) => (n === 1 ? 'بقيت خطوة واحدة' : n === 2 ? 'بقيت خطوتان' : `بقيت ${n} خطوات`),
    draftTitle: 'حفظنا مسودتك',
    draftBody: 'أكمل من حيث توقفت، أو ابدأ من جديد.',
    draftFiles: 'المرفقات لا تُحفظ في المسودة، لذا أضفها مرة أخرى.',
    draftContinue: 'متابعة المسودة',
    draftRestart: 'البدء من جديد',
  },
};

export function useFlowCopy() {
  const { lang } = useLang();
  return COPY[lang === 'ar' ? 'ar' : 'en'];
}

/** Segmented bar plus "N steps left"; no time estimates. */
export function StepsLeft({ index, total }) {
  const copy = useFlowCopy();
  const left = total - index - 1;
  const label = left === 0 ? copy.lastStep : copy.stepsLeft(left);
  return (
    <div className="ml-flow-progress">
      <div className="ml-flow-bar" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1} aria-valuetext={label}>
        {Array.from({ length: total }, (_, i) => <span key={i} data-state={i < index ? 'done' : i === index ? 'current' : 'todo'} aria-hidden="true" />)}
      </div>
      <p className="ml-flow-left" aria-live="polite">{label}</p>
    </div>
  );
}

/**
 * One question per screen. Re-keyed on every step so it slides in from the
 * reading direction (mirrored in Arabic); moves focus to the question.
 */
export function StepFrame({ stepKey, direction = 'forward', title, description, onSubmit, children }) {
  const headingRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const finePointer = window.matchMedia?.('(pointer: fine)').matches;
    const first = finePointer && formRef.current?.querySelector('[data-autofocus]');
    if (first) first.focus({ preventScroll: true });
    else headingRef.current?.focus({ preventScroll: true });
  }, [stepKey]);

  return (
    <form
      ref={formRef}
      key={stepKey}
      noValidate
      className="ml-step"
      data-direction={direction}
      onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}
    >
      <h2 ref={headingRef} tabIndex={-1} className="ml-step-title">{title}</h2>
      {description && <p className="ml-step-desc">{description}</p>}
      <div className="ml-step-body">{children}</div>
    </form>
  );
}

/** Back + one teal primary. The primary reads "Skip" while an optional answer is empty. */
export function StepNav({ onBack, primaryLabel, optionalEmpty = false, returnToReview = false, busy = false, busyLabel, disabled = false, describedBy }) {
  const copy = useFlowCopy();
  const label = primaryLabel || (returnToReview ? copy.backToReview : optionalEmpty ? copy.skip : copy.continue);
  return (
    <div className="ml-flow-nav">
      {onBack ? (
        <button type="button" className="btn btn-secondary ml-flow-back" onClick={onBack} disabled={busy}>
          <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" aria-hidden="true" />{copy.back}
        </button>
      ) : <span />}
      <button
        type="submit"
        className={`btn ${optionalEmpty && !returnToReview && !primaryLabel ? 'btn-secondary' : 'btn-primary'}`}
        disabled={disabled || busy}
        aria-busy={busy || undefined}
        aria-describedby={describedBy}
      >
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{busyLabel}</> : <>{label}<ArrowRight className="btn-arrow h-4 w-4 rtl:rotate-180" aria-hidden="true" /></>}
      </button>
    </div>
  );
}

/** Answers with an Edit action each. Empty answers show `emptyLabel`. */
export function ReviewList({ rows }) {
  const copy = useFlowCopy();
  return (
    <dl className="ml-review">
      {rows.map((row) => (
        <div key={row.key} className="ml-review-row">
          <dt>{row.label}</dt>
          <dd>
            <span className={row.empty ? 'ml-review-empty' : undefined} dir="auto">{row.value}</span>
            {row.onEdit && (
              <button type="button" className="ml-review-edit" onClick={row.onEdit} aria-label={`${copy.edit}: ${row.label}`}>
                <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />{copy.edit}
              </button>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DraftNotice({ hadFiles, onContinue, onRestart }) {
  const copy = useFlowCopy();
  return (
    <section className="ml-draft" role="status" aria-live="polite">
      <div>
        <p className="ml-draft-title">{copy.draftTitle}</p>
        <p className="ml-draft-body">{copy.draftBody}{hadFiles ? ` ${copy.draftFiles}` : ''}</p>
      </div>
      <div className="ml-draft-actions">
        <button type="button" className="btn btn-primary" onClick={onContinue}>{copy.draftContinue}</button>
        <button type="button" className="btn btn-secondary" onClick={onRestart}><RotateCcw className="h-4 w-4" aria-hidden="true" />{copy.draftRestart}</button>
      </div>
    </section>
  );
}

/**
 * Quick-pick chips that set a text answer (tap again to clear). With `multiple`,
 * chips add or remove themselves from a comma-separated answer.
 */
export function ChoiceChips({ options, value, onChange, label, multiple = false, separator = ', ' }) {
  const parts = multiple ? String(value || '').split(/\s*[,،]\s*/).filter(Boolean) : [];
  const isSelected = (option) => (multiple ? parts.includes(option) : value === option);
  const toggle = (option) => {
    if (!multiple) { onChange(isSelected(option) ? '' : option); return; }
    onChange((isSelected(option) ? parts.filter(p => p !== option) : [...parts, option]).join(separator));
  };
  return (
    <div className="ml-chips" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option} type="button" aria-pressed={isSelected(option)} className="ml-chip" onClick={() => toggle(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}
