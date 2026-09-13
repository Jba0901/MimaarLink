'use client';

import { lazy, Suspense } from 'react';
import { Upload } from 'lucide-react';

const SuccessPanel = lazy(() => import('@/components/SuccessPanel'));
const FileUploadDropzone = lazy(() => import('@/components/FileUploadDropzone'));
const NativeSelect = lazy(() => import('@/components/NativeSelect'));
const SubmissionRetryNotice = lazy(() => import('@/components/SubmissionRetryNotice'));
const NetworkStatusNotice = lazy(() => import('@/components/NetworkStatusNotice'));

export function LazySuccessPanel(props) {
  return (
    <Suspense
      fallback={(
        <div className="mx-auto w-full max-w-xl pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:py-8">
          <div className="min-h-[20rem] animate-pulse rounded-[24px] border border-border bg-card shadow-card" />
        </div>
      )}
    >
      <SuccessPanel {...props} />
    </Suspense>
  );
}

export function LazyFileUploadDropzone(props) {
  return (
    <Suspense
      fallback={(
        <div aria-hidden="true" className="flex min-h-[92px] min-w-0 items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card px-4 py-3 text-start shadow-soft">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]">
            <Upload className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block break-words text-sm font-bold leading-snug text-foreground">{props.label}</span>
            {props.hint && <span className="mt-0.5 block break-words text-[12px] leading-5 text-muted-foreground">{props.hint}</span>}
          </span>
        </div>
      )}
    >
      <FileUploadDropzone {...props} />
    </Suspense>
  );
}

export function LazyNativeSelect(props) {
  return (
    <Suspense fallback={<div aria-hidden="true" className="h-11 animate-pulse rounded-xl border border-border bg-card" />}>
      <NativeSelect {...props} />
    </Suspense>
  );
}

export function LazySubmissionRetryNotice(props) {
  return (
    <Suspense fallback={null}>
      <SubmissionRetryNotice {...props} />
    </Suspense>
  );
}

export function LazyNetworkStatusNotice(props) {
  return (
    <Suspense fallback={null}>
      <NetworkStatusNotice {...props} />
    </Suspense>
  );
}
