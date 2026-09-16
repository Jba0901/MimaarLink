'use client';

import { useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { matchesChoice } from '@/lib/intakeChoices.mjs';

/** A calm summary row that reveals optional single-choice answers only on demand. */
export default function QuickChoiceField({ id, label, value, onChange, options, placeholder, icon: Icon, lang, t }) {
  const matchedOption = options.find(option => matchesChoice(option, value));
  const isCustomValue = Boolean(value && !matchedOption);
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(isCustomValue);
  const [customDraft, setCustomDraft] = useState(isCustomValue ? value : '');
  const inputRef = useRef(null);
  const rtl = lang === 'ar';
  const Arrow = rtl ? ChevronLeft : ChevronRight;
  const summary = matchedOption?.label || (isCustomValue ? value : t('notSelected'));

  const changeOpen = nextOpen => {
    if (nextOpen) {
      const custom = Boolean(value && !options.some(option => matchesChoice(option, value)));
      setCustomMode(custom);
      if (custom) setCustomDraft(value);
    }
    setOpen(nextOpen);
  };

  const choosePreset = option => {
    setCustomMode(false);
    onChange(option.value);
    setOpen(false);
  };

  const beginCustom = () => {
    setCustomMode(true);
    if (customDraft) onChange(customDraft);
    else if (matchedOption) onChange('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <button
          id={`${id}-picker`}
          type="button"
          aria-label={`${label}: ${summary}`}
          className="group flex min-h-[68px] w-full min-w-0 items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 text-start shadow-soft transition-[border-color,box-shadow,background-color] hover:border-[#00B59E]/45 hover:bg-secondary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors motion-reduce:transition-none ${value ? 'bg-[#D0F2EE] text-[#0D1B2A] dark:bg-[#00B59E]/18 dark:text-[#00B59E]' : 'bg-secondary text-muted-foreground group-hover:text-navy'}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-medium leading-5 text-muted-foreground">
              {label} <span className="font-normal">({t('optional')})</span>
            </span>
            <span className={`mt-0.5 block truncate text-start text-[14px] font-semibold leading-5 ${value ? 'text-navy' : 'text-muted-foreground'}`}>
              <bdi dir="auto">{summary}</bdi>
            </span>
          </span>
          {value
            ? <Check className="h-5 w-5 shrink-0 text-[#00B59E]" aria-hidden="true" />
            : <Arrow className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none rtl:group-hover:-translate-x-0.5" aria-hidden="true" />}
        </button>
      </DialogTrigger>

      <DialogContent
        closeLabel={t('closePicker')}
        className="!bottom-0 !left-0 !top-auto !w-full !max-w-none !translate-x-0 !translate-y-0 gap-0 rounded-b-none rounded-t-[28px] p-0 motion-reduce:!animate-none sm:!bottom-auto sm:!left-1/2 sm:!top-1/2 sm:!w-[calc(100%_-_32px)] sm:!max-w-md sm:!-translate-x-1/2 sm:!-translate-y-1/2 sm:rounded-[24px]"
      >
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-border sm:hidden" aria-hidden="true" />
        <DialogHeader className="px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{t('pickerHelp')}</DialogDescription>
        </DialogHeader>

        <div role="radiogroup" aria-label={label} className="border-y border-border/80 bg-secondary/25 px-3 py-2 sm:px-4">
          {options.map(option => {
            const active = !customMode && matchesChoice(option, value);
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => choosePreset(option)}
                className={`flex min-h-[54px] w-full items-center gap-3 rounded-xl px-3 text-start text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/40 motion-reduce:transition-none ${active ? 'bg-[#D0F2EE]/65 text-navy dark:bg-[#00B59E]/15' : 'text-foreground hover:bg-card'}`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-[#00B59E] bg-[#00B59E] text-[#0D1B2A]' : 'border-border bg-card'}`} aria-hidden="true">
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1 break-words text-start leading-snug"><bdi dir="auto">{option.label}</bdi></span>
              </button>
            );
          })}

          <button
            type="button"
            role="radio"
            aria-checked={customMode}
            aria-expanded={customMode}
            aria-controls={`${id}-custom`}
            onClick={beginCustom}
            className={`flex min-h-[54px] w-full items-center gap-3 rounded-xl px-3 text-start text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/40 motion-reduce:transition-none ${customMode ? 'bg-[#D0F2EE]/65 text-navy dark:bg-[#00B59E]/15' : 'text-foreground hover:bg-card'}`}
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${customMode ? 'border-[#00B59E] bg-[#00B59E] text-[#0D1B2A]' : 'border-border bg-card'}`} aria-hidden="true">
              {customMode && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="min-w-0 flex-1">{t('enterOwnAnswer')}</span>
            <PencilLine className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>

        {customMode && (
          <div id={`${id}-custom`} className="px-5 pt-4 sm:px-6">
            <label htmlFor={id} className="sr-only">{label} — {t('enterOwnAnswer')}</label>
            <Input
              ref={inputRef}
              id={id}
              value={customDraft}
              placeholder={placeholder}
              dir="auto"
              onChange={event => {
                setCustomDraft(event.target.value);
                onChange(event.target.value);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 min-[340px]:grid-cols-2 min-[340px]:[&>*:only-child]:col-span-full sm:px-6 sm:pb-6">
          {value && (
            <Button type="button" variant="outline" onClick={() => {
              setCustomMode(false);
              setCustomDraft('');
              onChange('');
              setOpen(false);
            }}>
              {t('clearAnswer')}
            </Button>
          )}
          {customMode && (
            <Button type="button" variant="navy" disabled={!customDraft.trim()} onClick={() => setOpen(false)}>
              {t('confirmAnswer')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
