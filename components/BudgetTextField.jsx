'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { intakeChoices, matchesChoice } from '@/lib/intakeChoices.mjs';

/** One free-text budget answer, with a quick answer for owners who are unsure. */
export default function BudgetTextField({ id, label, value, onChange, placeholder, lang }) {
  const unsure = intakeChoices('budget', lang)[0];
  const isUnsure = matchesChoice(unsure, value);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="text"
        value={isUnsure ? '' : value}
        onFocus={() => { if (isUnsure) onChange(''); }}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        dir="auto"
        autoComplete="off"
        className="mt-1.5"
      />
      <button
        type="button"
        aria-pressed={isUnsure}
        onClick={() => onChange(isUnsure ? '' : unsure.value)}
        className={`mt-2 min-h-11 rounded-full border px-4 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/35 motion-reduce:transition-none ${isUnsure ? 'border-[#00B59E] bg-[#D0F2EE]/70 text-navy dark:bg-[#00B59E]/15' : 'border-border bg-card text-muted-foreground hover:border-[#00B59E]/45 hover:text-navy'}`}
      >
        {unsure.shortLabel}
      </button>
    </div>
  );
}
