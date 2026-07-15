import React from 'react';
import Link from 'next/link';
import { Inbox, Loader2, SearchX, TriangleAlert } from 'lucide-react';

const stateVisuals = {
  loading: {
    icon: Loader2,
    iconClass: 'animate-spin text-[#00B59E]',
    tileClass: 'bg-[#D0F2EE]/70 dark:bg-[#00B59E]/15',
  },
  empty: {
    icon: Inbox,
    iconClass: 'text-[#152B54] dark:text-[#00B59E]',
    tileClass: 'bg-[#D0F2EE]/70 dark:bg-[#00B59E]/15',
  },
  missing: {
    icon: SearchX,
    iconClass: 'text-[#152B54] dark:text-[#00B59E]',
    tileClass: 'bg-[#D0F2EE]/70 dark:bg-[#00B59E]/15',
  },
  error: {
    icon: TriangleAlert,
    iconClass: 'text-[#EF4444]',
    tileClass: 'bg-[#EF4444]/10',
  },
};

export default function PageState({
  kind = 'empty',
  title,
  description,
  actionHref,
  actionLabel,
  compact = false,
  className = '',
}) {
  const visual = stateVisuals[kind] || stateVisuals.empty;
  const Icon = visual.icon;
  const Heading = compact ? 'h3' : 'h1';
  const content = (
    <div
      className={`w-full text-center ${
        compact
          ? 'rounded-2xl bg-secondary/55 px-4 py-6'
          : 'rounded-[24px] border border-border bg-card p-6 shadow-soft sm:p-8'
      } ${className}`}
      role={kind === 'loading' ? 'status' : undefined}
      aria-live={kind === 'loading' ? 'polite' : undefined}
    >
      <span
        className={`mx-auto flex items-center justify-center rounded-2xl ${visual.tileClass} ${
          compact ? 'h-11 w-11' : 'h-14 w-14'
        }`}
        aria-hidden="true"
      >
        <Icon className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} ${visual.iconClass}`} />
      </span>
      <Heading className={`${compact ? 'mt-3 text-sm' : 'mt-4 text-lg'} font-bold leading-snug text-navy`}>{title}</Heading>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn btn-outline mt-5 w-full px-5 text-sm sm:w-auto">
          {actionLabel}
        </Link>
      )}
    </div>
  );

  if (compact) return content;

  return <div className="mx-auto flex min-h-[46vh] w-full max-w-md items-center justify-center py-8">{content}</div>;
}
