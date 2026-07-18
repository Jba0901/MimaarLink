'use client';

import PageState from '@/components/PageState';
import { useLang } from '@/lib/LangContext';

export default function NotFound() {
  const { lang } = useLang();
  const arabic = lang === 'ar';

  return (
    <main className="v2-ambient app-viewport app-content-x">
      <PageState
        kind="missing"
        title={arabic ? 'الصفحة غير موجودة' : 'Page not found'}
        description={arabic ? 'قد يكون الرابط غير صحيح أو أن الصفحة لم تعد متاحة.' : 'The link may be incorrect or the page may no longer be available.'}
        actionHref="/"
        actionLabel={arabic ? 'العودة للرئيسية' : 'Back to home'}
        actionVariant="primary"
        fullHeight
        className="relative z-10"
      />
    </main>
  );
}
