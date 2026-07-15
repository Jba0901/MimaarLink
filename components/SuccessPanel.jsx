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
        className="motion-fade-up overflow-hidden rounded-[28px] border border-[#00B59E]/40 bg-card shadow-card"
        aria-live="polite"
      >
        <div className="h-1.5 bg-[#00B59E]" />
        <div className="p-6 text-center sm:p-8">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#D0F2EE] dark:bg-[#00B59E]/15" aria-hidden="true">
            <CheckCircle2 className="h-8 w-8 text-[#00B59E]" />
          </span>

          <h1 className="mt-4 text-[22px] font-extrabold leading-tight text-navy sm:text-[24px]">{title}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-6 rounded-2xl bg-secondary/60 p-3 text-start sm:p-4">
            <div className="mb-2 text-[11px] font-semibold leading-relaxed text-muted-foreground">{referenceLabel}</div>
            <div className="flex min-w-0 items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-xl bg-card px-3 py-2.5 text-[11px] text-navy" dir="ltr">
                {referencePath}
              </code>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-11 shrink-0 px-3"
                aria-label={copyLabel}
                title={copyLabel}
                onClick={copyReference}
              >
                <Copy className="h-4 w-4" />
                <span className="hidden min-[360px]:inline">{copyLabel}</span>
              </Button>
            </div>
          </div>

          <Link href={actionHref} className="btn btn-navy mt-4 w-full px-6 text-sm" style={{ minHeight: 48, background: '#152B54' }}>
            {actionLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
