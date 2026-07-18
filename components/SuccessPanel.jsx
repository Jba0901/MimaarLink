'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function SuccessPanel({
  title,
  description,
  referenceLabel,
  referencePath,
  copyLabel,
  copiedLabel,
  actionHref,
  actionLabel,
}) {
  React.useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, []);

  const copyReference = async () => {
    const fullUrl = `${window.location.origin}${referencePath}`;
    await navigator.clipboard.writeText(fullUrl);
    toast.success(copiedLabel);
  };

  return (
    <div className="mx-auto w-full max-w-xl pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:py-8">
      <section
        className="motion-fade-up overflow-hidden rounded-[24px] border border-[#00B59E]/40 bg-card shadow-card sm:rounded-[28px]"
        role="status"
        aria-live="polite"
      >
        <div className="h-1.5 bg-[#00B59E]" />
        <div className="p-4 text-center sm:p-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#D0F2EE] dark:bg-[#00B59E]/15 sm:h-16 sm:w-16 sm:rounded-[22px]" aria-hidden="true">
            <CheckCircle2 className="h-7 w-7 text-[#00B59E] sm:h-8 sm:w-8" />
          </span>

          <h1 className="mt-3 break-words text-[20px] font-extrabold leading-snug text-navy sm:mt-4 sm:text-[24px]">{title}</h1>
          <p className="mx-auto mt-2 max-w-md break-words text-[13.5px] leading-relaxed text-muted-foreground sm:text-sm">{description}</p>

          <div className="mt-5 rounded-2xl border border-border/70 bg-secondary/45 p-2.5 text-start sm:mt-6 sm:p-4">
            <div className="mb-2 break-words text-[12px] font-semibold leading-relaxed text-muted-foreground">{referenceLabel}</div>
            <div className="grid min-w-0 gap-2 min-[480px]:grid-cols-[minmax(0,1fr)_auto]">
              <code className="flex min-h-11 min-w-0 items-center break-all rounded-xl border border-border/70 bg-card px-3 py-2 text-start text-[12px] leading-5 text-navy shadow-sm" dir="ltr" title={referencePath}>
                {referencePath}
              </code>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-auto min-h-11 w-full whitespace-normal px-3 py-2 text-center leading-snug min-[480px]:w-auto"
                aria-label={copyLabel}
                title={copyLabel}
                onClick={copyReference}
              >
                <Copy className="h-4 w-4" />
                <span>{copyLabel}</span>
              </Button>
            </div>
          </div>

          <Button asChild variant="brand" size="lg" className="mt-4 h-auto min-h-12 w-full whitespace-normal py-2.5 text-center text-sm leading-snug">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
