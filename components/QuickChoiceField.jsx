'use client';

import { useRef, useState } from 'react';
import { Check, PencilLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { matchesChoice } from '@/lib/intakeChoices.mjs';

/** An optional single answer, with tap-to-toggle presets and an unrestricted custom input. */
export default function QuickChoiceField({ id, label, value, onChange, options, placeholder, t }) {
  const isPreset = options.some(option => matchesChoice(option, value));
  const [customMode, setCustomMode] = useState(Boolean(value && !isPreset));
  const [customDraft, setCustomDraft] = useState(isPreset ? '' : value);
  const inputRef = useRef(null);
  const firstChoiceRef = useRef(null);

  const buttonClass = active => `flex min-h-12 min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-start text-sm font-medium leading-relaxed transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E] focus-visible:ring-offset-2 focus-visible:ring-offset-background ${active
    ? 'border-[#00B59E]/70 bg-[#D0F2EE]/65 text-foreground dark:bg-[#00B59E]/15'
    : 'border-border bg-card text-foreground hover:border-[#00B59E]/50 hover:bg-secondary/60'}`;

  return (
    <fieldset className="min-w-0" data-quick-choice={id}>
      <legend className="mb-2 text-sm font-medium leading-relaxed">
        {label} <span className="ms-1 text-xs font-normal text-muted-foreground">({t('optional')})</span>
      </legend>
      <div className={`grid grid-cols-2 gap-2 ${options.length > 3 ? 'sm:grid-cols-3' : ''}`}>
        {options.map((option, index) => {
          const active = !customMode && matchesChoice(option, value);
          return (
            <button key={option.id} ref={index === 0 ? firstChoiceRef : undefined} type="button" aria-pressed={active} className={buttonClass(active)}
              onClick={() => { setCustomMode(false); onChange(active ? '' : option.value); }}>
              <span className="min-w-0 flex-1 break-words" dir="auto">{option.label}</span>
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active ? 'border-[#00B59E] bg-[#00B59E] text-[#0D1B2A]' : 'border-border'}`} aria-hidden="true">
                {active && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
        <button type="button" aria-pressed={customMode} aria-expanded={customMode} aria-controls={`${id}-custom`}
          className={buttonClass(customMode)} onClick={() => {
            setCustomMode(true);
            onChange(customDraft);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}>
          <span className="min-w-0 flex-1 break-words">{t('enterOwnAnswer')}</span>
          <PencilLine className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </div>
      {customMode && (
        <div id={`${id}-custom`} className="mt-2">
          <label htmlFor={id} className="sr-only">{label} — {t('enterOwnAnswer')}</label>
          <Input ref={inputRef} id={id} value={value} placeholder={placeholder} dir="auto"
            onChange={event => { setCustomDraft(event.target.value); onChange(event.target.value); }} />
        </div>
      )}
      {(value || customMode) && (
        <button type="button" className="mt-1 min-h-11 rounded-lg px-1 text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]"
          aria-label={`${t('clearAnswer')}: ${label}`}
          onClick={() => {
            setCustomMode(false);
            setCustomDraft('');
            onChange('');
            requestAnimationFrame(() => firstChoiceRef.current?.focus());
          }}>
          {t('clearAnswer')}
        </button>
      )}
    </fieldset>
  );
}
