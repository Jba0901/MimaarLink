import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';

export default function InlineFieldMessage({ id, children, className }) {
  if (!children) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn(
        'mt-1.5 flex items-start gap-1.5 rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/[0.05] px-2.5 py-1.5 text-[12px] font-semibold leading-5 text-[#EF4444] dark:bg-[#EF4444]/[0.08]',
        className
      )}
    >
      <CircleAlert className="mt-[3px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 break-words">{children}</span>
    </p>
  );
}
