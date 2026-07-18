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
  actionVariant = 'outline',
  compact = false,
  fullHeight = false,
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
          : 'rounded-[22px] border border-border bg-card p-5 shadow-soft sm:rounded-[24px] sm:p-8'
      } ${className}`}
      role={kind === 'loading' ? 'status' : undefined}
      aria-live={kind === 'loading' ? 'polite' : undefined}
    >
      <span
        className={`mx-auto flex items-center justify-center rounded-2xl ${visual.tileClass} ${
          compact ? 'h-11 w-11' : 'h-[52px] w-[52px] sm:h-14 sm:w-14'
        }`}
        aria-hidden="true"
      >
        <Icon className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} ${visual.iconClass}`} />
      </span>
      <Heading className={`${compact ? 'mt-3 text-sm' : 'mt-4 text-[20px]'} font-bold leading-snug text-navy`}>{title}</Heading>
      {description && <p className="mx-auto mt-2 max-w-sm text-[14px] leading-6 text-muted-foreground">{description}</p>}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className={`btn ${actionVariant === 'primary' ? 'btn-primary' : 'btn-outline'} mt-5 h-auto min-h-11 w-full whitespace-normal px-5 py-2 text-center text-[14px] leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#07111D] sm:w-auto`}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );

  if (compact) return content;

  return (
    <div className={`mx-auto flex w-full max-w-md items-center justify-center py-8 ${fullHeight ? 'min-h-screen' : 'min-h-[46vh]'}`}>
      {content}
    </div>
  );
}
