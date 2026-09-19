'use client';

import { useRef, useState } from 'react';
import { Check, PencilLine, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { matchesChoice } from '@/lib/intakeChoices.mjs';

/** A visual, inline scale for intake preferences. */
export default function QuickChoiceField({ id, label, value, onChange, options, placeholder, icon: Icon, t }) {
  const matchedOption = options.find(option => matchesChoice(option, value));
  const isCustomValue = Boolean(value && !matchedOption);
  const [customMode, setCustomMode] = useState(isCustomValue);
  const inputRef = useRef(null);
  const scaleOptions = options.filter(option => !option.auxiliary);
  const auxiliaryOptions = options.filter(option => option.auxiliary);
  const selectedIndex = scaleOptions.findIndex(option => matchesChoice(option, value));
  const fill = selectedIndex < 0 || scaleOptions.length < 2 ? 0 : (selectedIndex / (scaleOptions.length - 1)) * 100;
  const summary = matchedOption?.label || (isCustomValue ? value : t('notSelected'));

  const choosePreset = option => {
    setCustomMode(false);
    onChange(option.value);
  };

  const beginCustom = () => {
    setCustomMode(true);
    if (matchedOption) onChange('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const clear = () => {
    setCustomMode(false);
    onChange('');
  };

  return (
    <section className="rounded-2xl border border-border bg-card px-3.5 pb-3 pt-3 shadow-soft">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${value ? 'bg-[#D0F2EE] text-[#0D1B2A] dark:bg-[#00B59E]/18 dark:text-[#00B59E]' : 'bg-secondary text-muted-foreground'}`}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[12px] font-medium leading-4 text-muted-foreground">{label}</h3>
          <div className={`mt-0.5 truncate text-[14px] font-semibold leading-5 ${value ? 'text-navy' : 'text-muted-foreground'}`} aria-live="polite">
            <bdi dir="auto">{summary}</bdi>
          </div>
        </div>
        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label={t('clearAnswer')}
            title={t('clearAnswer')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/35 motion-reduce:transition-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div role="radiogroup" aria-label={label} className="relative mt-2.5 px-0.5">
        <div className="pointer-events-none absolute inset-x-[22px] top-[21px] h-1 rounded-full bg-border" aria-hidden="true">
          <span
            className="absolute inset-y-0 rounded-full bg-[#00B59E] transition-[inline-size] duration-300 motion-reduce:transition-none"
            style={{ insetInlineStart: 0, inlineSize: `${fill}%` }}
          />
        </div>
        <div className="relative grid" style={{ gridTemplateColumns: `repeat(${scaleOptions.length}, minmax(0, 1fr))` }}>
          {scaleOptions.map((option, index) => {
            const active = !customMode && matchesChoice(option, value);
            const reached = selectedIndex >= 0 && index <= selectedIndex;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={option.label}
                onClick={() => choosePreset(option)}
                className="group flex min-w-0 flex-col items-center rounded-xl px-0.5 pb-1 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/35"
              >
                <span className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-[3px] transition-[background-color,border-color,transform] motion-reduce:transition-none ${active ? 'scale-110 border-[#00B59E] bg-[#00B59E] text-white' : reached ? 'border-[#00B59E] bg-card' : 'border-border bg-card group-hover:border-[#00B59E]/60'}`} aria-hidden="true">
                  {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className={`mt-1.5 min-h-7 break-words text-center text-[10.5px] font-medium leading-[14px] min-[360px]:text-[11px] ${active ? 'text-navy' : 'text-muted-foreground'}`}>
                  <bdi dir={option.shortDir || 'auto'}>{option.shortLabel || option.label}</bdi>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-1.5 border-t border-border/70 pt-2.5">
        {auxiliaryOptions.map(option => {
          const active = !customMode && matchesChoice(option, value);
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => choosePreset(option)}
              className={`min-h-9 rounded-full border px-3 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/35 motion-reduce:transition-none ${active ? 'border-[#00B59E] bg-[#D0F2EE]/70 text-navy dark:bg-[#00B59E]/15' : 'border-border bg-background text-muted-foreground hover:border-[#00B59E]/45 hover:text-navy'}`}
            >
              {option.shortLabel || option.label}
            </button>
          );
        })}
        <button
          type="button"
          role="radio"
          aria-checked={customMode && isCustomValue}
          aria-expanded={customMode}
          aria-controls={`${id}-custom`}
          onClick={beginCustom}
          className={`flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/35 motion-reduce:transition-none ${customMode ? 'border-[#00B59E] bg-[#D0F2EE]/70 text-navy dark:bg-[#00B59E]/15' : 'border-border bg-background text-muted-foreground hover:border-[#00B59E]/45 hover:text-navy'}`}
        >
          <PencilLine className="h-3.5 w-3.5" aria-hidden="true" />
          {t('enterOwnAnswer')}
        </button>
      </div>

      {customMode && (
        <div id={`${id}-custom`} className="mt-2.5">
          <label htmlFor={id} className="sr-only">{label} — {t('enterOwnAnswer')}</label>
          <Input
            ref={inputRef}
            id={id}
            value={isCustomValue ? value : ''}
            placeholder={placeholder}
            dir="auto"
            onChange={event => onChange(event.target.value)}
            className="h-11"
          />
        </div>
      )}
    </section>
  );
}
