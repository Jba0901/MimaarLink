import { Upload } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function FileUploadDropzone({
  label,
  hint,
  error = false,
  className,
  inputClassName,
  ...inputProps
}) {
  return (
    <label
      className={cn(
        'interactive-card tap-highlight group flex min-h-20 cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed bg-card px-4 py-3 text-start shadow-soft transition focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
        error
          ? 'border-red-400 focus-within:ring-red-400/30'
          : 'border-border hover:border-[#00B59E]/45 hover:bg-[#D0F2EE]/30 focus-within:border-[#00B59E]/60 focus-within:ring-[#00B59E]/30 dark:hover:bg-[#00B59E]/10',
        className
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] transition-transform group-hover:scale-[1.03] dark:bg-[#00B59E]/15 dark:text-[#00B59E]">
        <Upload className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-foreground">{label}</span>
        {hint && <span className="mt-0.5 block text-[11px] leading-5 text-muted-foreground">{hint}</span>}
      </span>
      <input
        {...inputProps}
        type="file"
        className={cn('sr-only', inputClassName)}
        aria-invalid={error || undefined}
      />
    </label>
  );
}
