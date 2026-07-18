import { CheckCircle2, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useLang } from '@/lib/LangContext';
import { fileSignature, MAX_FILE_SIZE_BYTES } from '@/lib/uploadLimits';

const BUSY_COPY = {
  en: {
    label: 'Preparing files…',
    hint: 'Keep this page open. Your files will appear here when ready.',
  },
  ar: {
    label: 'جاري تجهيز الملفات…',
    hint: 'ابقَ في هذه الصفحة. ستظهر الملفات هنا عند اكتمال التجهيز.',
  },
};

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function FileUploadDropzone({
  label,
  hint,
  error = false,
  hasFiles = false,
  busy = false,
  selectedFiles = [],
  maxFiles,
  onFilesReady,
  onBusyChange,
  className,
  inputClassName,
  ...inputProps
}) {
  const { lang, t } = useLang();
  const disabled = Boolean(inputProps.disabled || busy);
  const busyCopy = BUSY_COPY[lang] || BUSY_COPY.en;
  const visibleLabel = busy ? busyCopy.label : label;
  const visibleHint = busy ? busyCopy.hint : hint;

  const handleChange = async (event) => {
    const input = event.target;
    const selected = Array.from(input.files || []);
    if (selected.length === 0) return;

    onBusyChange?.(true);
    try {
      const seenFiles = new Set(selectedFiles.map(fileSignature));
      let duplicateName = '';
      const uniqueFiles = selected.filter((file) => {
        const signature = fileSignature(file);
        if (seenFiles.has(signature)) {
          duplicateName ||= file.name;
          return false;
        }
        seenFiles.add(signature);
        return true;
      });
      if (duplicateName) toast.warning(`${t('fileAlreadySelected')} ${duplicateName}`);

      const remainingSlots = Math.max(0, maxFiles - selectedFiles.length);
      if (uniqueFiles.length > remainingSlots) {
        toast.warning(t('fileLimitExceeded').replace('{max}', maxFiles));
      }

      const preparedFiles = [];
      for (const file of uniqueFiles.slice(0, remainingSlots)) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          toast.error(`${t('fileTooLarge')} ${file.name}`);
          continue;
        }
        preparedFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          data: await fileToDataURL(file),
        });
      }
      if (preparedFiles.length > 0) onFilesReady?.(preparedFiles);
    } catch {
      toast.error(t('actionFailed'));
    } finally {
      input.value = '';
      onBusyChange?.(false);
    }
  };

  return (
    <label
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
      data-busy={busy || undefined}
      aria-disabled={disabled || undefined}
      aria-busy={busy || undefined}
      className={cn(
        'file-upload-dropzone group flex min-h-20 min-w-0 items-center gap-3 rounded-2xl border-2 border-dashed bg-card px-4 py-3 text-start shadow-soft focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background',
        !disabled && 'interactive-card tap-highlight cursor-pointer',
        busy
          ? 'cursor-wait border-[#00B59E]/55 bg-[#D0F2EE]/30 shadow-none dark:bg-[#00B59E]/[0.12]'
          : disabled
            ? hasFiles
              ? 'cursor-default border-[#00B59E]/40 bg-[#D0F2EE]/20 shadow-none dark:bg-[#00B59E]/[0.08]'
              : 'cursor-not-allowed border-border bg-secondary/60 opacity-65 shadow-none'
            : error
              ? 'border-[#EF4444] bg-[#EF4444]/[0.03] focus-within:ring-[#EF4444]/30 dark:bg-[#EF4444]/[0.06]'
              : hasFiles
                ? 'border-[#00B59E]/45 bg-[#D0F2EE]/20 hover:border-[#00B59E]/60 hover:bg-[#D0F2EE]/35 focus-within:border-[#00B59E]/60 focus-within:ring-[#00B59E]/30 dark:bg-[#00B59E]/[0.08] dark:hover:bg-[#00B59E]/[0.12]'
                : 'border-border hover:border-[#00B59E]/45 hover:bg-[#D0F2EE]/30 focus-within:border-[#00B59E]/60 focus-within:ring-[#00B59E]/30 dark:hover:bg-[#00B59E]/10',
        className
      )}
    >
      <span className={cn('relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]', !disabled && 'transition-transform group-hover:scale-[1.03]')} aria-hidden="true">
        {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Upload className="h-5 w-5" aria-hidden="true" />}
        {hasFiles && !busy && <CheckCircle2 className="absolute -end-1 -top-1 h-4 w-4 rounded-full bg-card text-[#00B59E] ring-2 ring-card" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-bold leading-snug text-foreground">{visibleLabel}</span>
        {visibleHint && <span className="mt-0.5 block break-words text-[12px] leading-5 text-muted-foreground">{visibleHint}</span>}
      </span>
      <input
        {...inputProps}
        disabled={disabled}
        type="file"
        onChange={handleChange}
        className={cn('sr-only', inputClassName)}
        aria-invalid={error || undefined}
      />
    </label>
  );
}
