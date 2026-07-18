'use client';

import { lazy, Suspense, useEffect, useState } from 'react';

const FormAside = lazy(() => import('@/components/FormAside'));

function FormAsideFallback() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[22rem] animate-pulse rounded-[22px] border border-border bg-card shadow-soft"
    />
  );
}

export default function DesktopFormAside(props) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(query.matches);

    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return isDesktop ? (
    <Suspense fallback={<FormAsideFallback />}>
      <FormAside {...props} />
    </Suspense>
  ) : null;
}
