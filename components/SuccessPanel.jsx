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
  const copyReference = async () => {
    const fullUrl = `${window.location.origin}${referencePath}`;
    await navigator.clipboard.writeText(fullUrl);
    toast.success(copiedLabel);
  };

  return (
    <div className="mx-auto w-full max-w-xl py-2">
      <section
        className="motion-fade-up overflow-hidden rounded-[24px] border border-[#00B59E]/40 bg-card shadow-card sm:rounded-[28px]"
        aria-live="polite"
      >
        <div className="h-1.5 bg-[#00B59E]" />
        <div className="p-4 text-center sm:p-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#D0F2EE] dark:bg-[#00B59E]/15 sm:h-16 sm:w-16 sm:rounded-[22px]" aria-hidden="true">
            <CheckCircle2 className="h-7 w-7 text-[#00B59E] sm:h-8 sm:w-8" />
          </span>

          <h1 className="mt-3 text-[20px] font-extrabold leading-tight text-navy sm:mt-4 sm:text-[24px]">{title}</h1>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-muted-foreground sm:text-sm">{description}</p>

          <div className="mt-5 rounded-2xl bg-secondary/60 p-2.5 text-start sm:mt-6 sm:p-4">
            <div className="mb-2 text-[11px] font-semibold leading-relaxed text-muted-foreground">{referenceLabel}</div>
            <div className="grid min-w-0 gap-2 min-[360px]:grid-cols-[minmax(0,1fr)_auto]">
              <code className="min-w-0 flex-1 truncate rounded-xl bg-card px-3 py-2.5 text-[11px] text-navy" dir="ltr">
                {referencePath}
              </code>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-11 w-full px-3 min-[360px]:w-auto"
                aria-label={copyLabel}
                title={copyLabel}
                onClick={copyReference}
              >
                <Copy className="h-4 w-4" />
                <span>{copyLabel}</span>
              </Button>
            </div>
          </div>

          <Button asChild variant="navy" size="lg" className="mt-4 w-full text-sm">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
