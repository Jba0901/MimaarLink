'use client';

import { lazy, Suspense } from 'react';

const SuccessPanel = lazy(() => import('@/components/SuccessPanel'));
const FileUploadDropzone = lazy(() => import('@/components/FileUploadDropzone'));
const NativeSelect = lazy(() => import('@/components/NativeSelect'));

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
    <Suspense fallback={<div aria-hidden="true" className="min-h-[92px] animate-pulse rounded-2xl border border-border bg-card" />}>
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
