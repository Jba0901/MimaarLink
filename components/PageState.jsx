'use client';
import React from 'react';
import Link from 'next/link';
import { Inbox, Loader2, SearchX, TriangleAlert } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { useLang } from '@/lib/LangContext';

const HELP = { en: 'Message us on WhatsApp', ar: 'راسلنا على واتساب' };

const stateVisuals = {
  loading: {
    icon: Loader2,
    iconClass: 'animate-spin text-[#009F91]',
    tileClass: 'bg-[#EAF7F4]/70 dark:bg-[#009F91]/15',
    panelClass: '',
  },
  empty: {
    icon: Inbox,
    iconClass: 'text-[#152B54] dark:text-[#009F91]',
    tileClass: 'bg-[#EAF7F4]/70 dark:bg-[#009F91]/15',
    panelClass: '',
  },
  missing: {
    icon: SearchX,
    iconClass: 'text-[#B5462B]',
    tileClass: 'bg-[#B5462B]/15',
    panelClass: 'border border-[#B5462B]/30 bg-[#B5462B]/[0.03] dark:bg-[#F08A6C]/[0.06]',
  },
  error: {
    icon: TriangleAlert,
    iconClass: 'text-[#B5462B]',
    tileClass: 'bg-[#B5462B]/10 dark:bg-[#B5462B]/15',
    panelClass: 'border border-[#B5462B]/30 bg-[#B5462B]/[0.03] dark:bg-[#B5462B]/[0.06]',
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
  // Public pages offer a person as the fallback so no state is a dead end.
  whatsapp = false,
}) {
  const { lang } = useLang();
  const visual = stateVisuals[kind] || stateVisuals.empty;

  // Full-page loading shows the shape of what is coming instead of a spinner.
  if (kind === 'loading' && !compact) {
    return (
      <div className={`mx-auto w-full max-w-3xl py-6 ${className}`}>
        <span className="sr-only" role="status">{title}</span>
        <div aria-hidden="true">
          <div className="h-3 w-28 animate-pulse rounded ml-skel" />
          <div className="mt-4 h-9 w-2/3 animate-pulse rounded-[6px] ml-skel" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded ml-skel" />
          <div className="mt-8 grid gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-[6px] ml-skel" />)}</div>
        </div>
      </div>
    );
  }
  const Icon = visual.icon;
  const Heading = compact ? 'h3' : 'h1';
  const panelSurfaceClass = compact ? visual.panelClass : (visual.panelClass || 'border-border bg-card');
  const actionClassName = `btn ${actionVariant === 'primary' ? 'btn-primary' : 'btn-outline'} mt-5 h-auto min-h-11 w-full whitespace-normal px-5 py-2 text-center text-[14px] leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009F91] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#07111D] sm:w-auto`;
  const content = (
    <div
      className={`page-state-panel ${compact ? 'page-state-compact' : ''} w-full text-center ${
        compact
          ? 'rounded-2xl bg-secondary/55 px-4 py-6'
          : 'rounded-[6px] border p-4 shadow-soft min-[264px]:p-5 sm:rounded-[6px] sm:p-8'
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
      <Heading className={`${compact ? 'mt-3 text-sm' : 'mt-4 text-[19px] min-[264px]:text-[20px]'} min-w-0 break-words font-bold leading-snug text-navy`}>{title}</Heading>
      {description && <p className="mx-auto mt-2 max-w-sm break-words text-[14px] leading-6 text-muted-foreground">{description}</p>}
      {actionLabel && actionOnClick && (
        <button type="button" onClick={actionOnClick} className={actionClassName}>{actionLabel}</button>
      )}
      {actionLabel && !actionOnClick && actionHref && (
        <Link href={actionHref} className={actionClassName}>{actionLabel}</Link>
      )}
      {whatsapp && (
        <a href="https://wa.me/97466259219" target="_blank" rel="noreferrer" className="mx-auto mt-3 flex min-h-11 w-fit items-center gap-2 text-[14px] font-medium text-navy underline decoration-[#009F91] underline-offset-4">
          <WhatsAppIcon className="h-4 w-4" />{HELP[lang === 'ar' ? 'ar' : 'en']}
        </a>
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
