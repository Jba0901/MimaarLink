import { Copy, ExternalLink, Link2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminPublicLinkActions({
  label,
  path,
  copyLabel,
  openLabel,
  onCopy,
  onOpen,
  inset = false,
  className,
}) {
  return (
    <section
      className={cn(
        inset
          ? 'rounded-xl bg-secondary/70 p-2.5'
          : 'rounded-2xl border border-border bg-card p-4 shadow-soft',
        className
      )}
    >
      <div className="break-words text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn('mt-2 flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-border/70 px-3 py-2', inset ? 'bg-card' : 'bg-secondary/60')}>
        <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <code className="min-w-0 flex-1 truncate text-[12px] text-navy" dir="ltr" title={path}>{path}</code>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button type="button" variant="navy" size="sm" className="h-auto min-h-11 w-full whitespace-normal px-2 py-2 text-[12px] sm:min-h-9 sm:py-1.5" onClick={onCopy}>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          {copyLabel}
        </Button>
        <Button type="button" variant="outline" size="sm" className="h-auto min-h-11 w-full whitespace-normal px-2 py-2 text-[12px] sm:min-h-9 sm:py-1.5" onClick={onOpen}>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {openLabel}
        </Button>
      </div>
    </section>
  );
}
