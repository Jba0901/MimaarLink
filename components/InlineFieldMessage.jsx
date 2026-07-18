import { cn } from '@/lib/utils';

export default function InlineFieldMessage({ id, children, className }) {
  if (!children) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn(
        'mt-1.5 break-words text-[12px] font-semibold leading-5 text-[#EF4444]',
        className
      )}
    >
      {children}
    </p>
  );
}
