import { CheckCircle2, Upload } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function FileUploadDropzone({
  label,
  hint,
  error = false,
  hasFiles = false,
  className,
  inputClassName,
  ...inputProps
}) {
  const disabled = Boolean(inputProps.disabled);

  return (
    <label
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        'file-upload-dropzone group flex min-h-20 min-w-0 items-center gap-3 rounded-2xl border-2 border-dashed bg-card px-4 py-3 text-start shadow-soft focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background',
        !disabled && 'interactive-card tap-highlight cursor-pointer',
        disabled
          ? 'cursor-default border-[#00B59E]/40 bg-[#D0F2EE]/20 shadow-none dark:bg-[#00B59E]/[0.08]'
          : error
            ? 'border-[#EF4444] bg-[#EF4444]/[0.03] focus-within:ring-[#EF4444]/30 dark:bg-[#EF4444]/[0.06]'
            : hasFiles
              ? 'border-[#00B59E]/45 bg-[#D0F2EE]/20 hover:border-[#00B59E]/60 hover:bg-[#D0F2EE]/35 focus-within:border-[#00B59E]/60 focus-within:ring-[#00B59E]/30 dark:bg-[#00B59E]/[0.08] dark:hover:bg-[#00B59E]/[0.12]'
              : 'border-border hover:border-[#00B59E]/45 hover:bg-[#D0F2EE]/30 focus-within:border-[#00B59E]/60 focus-within:ring-[#00B59E]/30 dark:hover:bg-[#00B59E]/10',
        className
      )}
    >
      <span className={cn('relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]', !disabled && 'transition-transform group-hover:scale-[1.03]')} aria-hidden="true">
        <Upload className="h-5 w-5" aria-hidden="true" />
        {hasFiles && <CheckCircle2 className="absolute -end-1 -top-1 h-4 w-4 rounded-full bg-card text-[#00B59E] ring-2 ring-card" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-bold leading-snug text-foreground">{label}</span>
        {hint && <span className="mt-0.5 block break-words text-[12px] leading-5 text-muted-foreground">{hint}</span>}
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
