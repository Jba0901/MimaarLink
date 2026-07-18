import React from 'react';
import Link from 'next/link';
import { Inbox, Loader2, SearchX, TriangleAlert } from 'lucide-react';

const stateVisuals = {
  loading: {
    icon: Loader2,
    iconClass: 'animate-spin text-[#00B59E]',
    tileClass: 'bg-[#D0F2EE]/70 dark:bg-[#00B59E]/15',
    panelClass: '',
  },
  empty: {
    icon: Inbox,
    iconClass: 'text-[#152B54] dark:text-[#00B59E]',
    tileClass: 'bg-[#D0F2EE]/70 dark:bg-[#00B59E]/15',
    panelClass: '',
  },
  missing: {
    icon: SearchX,
    iconClass: 'text-[#FFB638]',
    tileClass: 'bg-[#FFB638]/15',
    panelClass: 'border border-[#FFB638]/30 bg-[#FFB638]/[0.03] dark:bg-[#FFB638]/[0.06]',
  },
  error: {
    icon: TriangleAlert,
    iconClass: 'text-[#EF4444]',
    tileClass: 'bg-[#EF4444]/10 dark:bg-[#EF4444]/15',
    panelClass: 'border border-[#EF4444]/30 bg-[#EF4444]/[0.03] dark:bg-[#EF4444]/[0.06]',
  },
};

export default function PageState({
  kind = 'empty',
  title,
  description,
  actionHref,
  actionOnClick,
  actionLabel,
  actionVariant = 'outline',
  compact = false,
  fullHeight = false,
  className = '',
}) {
  const visual = stateVisuals[kind] || stateVisuals.empty;
  const Icon = visual.icon;
  const Heading = compact ? 'h3' : 'h1';
  const panelSurfaceClass = compact ? visual.panelClass : (visual.panelClass || 'border-border bg-card');
  const actionClassName = `btn ${actionVariant === 'primary' ? 'btn-primary' : 'btn-outline'} mt-5 h-auto min-h-11 w-full whitespace-normal px-5 py-2 text-center text-[14px] leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#07111D] sm:w-auto`;
  const content = (
    <div
      className={`page-state-panel w-full text-center ${
        compact
          ? 'rounded-2xl bg-secondary/55 px-4 py-6'
          : 'rounded-[22px] border p-5 shadow-soft sm:rounded-[24px] sm:p-8'
      } ${panelSurfaceClass} ${className}`}
      role={kind === 'loading' ? 'status' : kind === 'error' ? 'alert' : undefined}
      aria-live={kind === 'loading' ? 'polite' : kind === 'error' ? 'assertive' : undefined}
    >
      <span
        className={`mx-auto flex items-center justify-center rounded-2xl ${visual.tileClass} ${
          compact ? 'h-11 w-11' : 'h-[52px] w-[52px] sm:h-14 sm:w-14'
        }`}
        aria-hidden="true"
      >
        <Icon className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} ${visual.iconClass}`} />
      </span>
      <Heading className={`${compact ? 'mt-3 text-sm' : 'mt-4 text-[20px]'} min-w-0 break-words font-bold leading-snug text-navy`}>{title}</Heading>
      {description && <p className="mx-auto mt-2 max-w-sm break-words text-[14px] leading-6 text-muted-foreground">{description}</p>}
      {actionLabel && actionOnClick && (
        <button type="button" onClick={actionOnClick} className={actionClassName}>{actionLabel}</button>
      )}
      {actionLabel && !actionOnClick && actionHref && (
        <Link href={actionHref} className={actionClassName}>{actionLabel}</Link>
      )}
    </div>
  );

  if (compact) return content;

  return (
    <div className={`page-state-layout ${fullHeight ? 'page-state-full min-h-[100dvh]' : 'min-h-[46dvh]'} mx-auto flex w-full max-w-md items-center justify-center pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:pt-8`}>
      {content}
    </div>
  );
}
