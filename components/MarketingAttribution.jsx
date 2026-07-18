'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLang } from '@/lib/LangContext';
import { ShieldCheck } from 'lucide-react';
import {
  captureMarketingAttribution,
  getMarketingConsent,
  hasTrackedMarketingParams,
  metaPixelConfigured,
  setMarketingConsent,
  trackMeta,
} from '@/lib/marketingAttribution';

const PRIVATE_PREFIXES = ['/admin', '/project/', '/contractor-status/', '/bids/'];
const CONTENT_PATHS = new Set(['/start-here', '/for-projects', '/for-contractors']);

export default function MarketingAttribution() {
  const { lang } = useLang();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consent, setConsent] = useState('pending');
  const lastTrackedUrl = useRef('');
  const search = searchParams.toString();
  const isPrivate = PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const hasDedicatedSettings = pathname === '/privacy';
  const shouldPrompt = !isPrivate && !hasDedicatedSettings && (metaPixelConfigured() || hasTrackedMarketingParams(search));
  const sitsAboveMobileNav = pathname === '/';

  useEffect(() => {
    setConsent(getMarketingConsent());
  }, []);

  useEffect(() => {
    if (consent !== 'accepted' || isPrivate) return;
    captureMarketingAttribution();

    const currentUrl = `${pathname}?${search}`;
    if (lastTrackedUrl.current === currentUrl) return;
    lastTrackedUrl.current = currentUrl;

    trackMeta('PageView');
    if (CONTENT_PATHS.has(pathname)) {
      trackMeta('ViewContent', { content_name: pathname.slice(1) || 'home' });
    }
  }, [consent, isPrivate, pathname, search]);

  if (!shouldPrompt || consent !== 'pending') return null;

  const arabic = lang === 'ar';
  const accept = () => {
    setMarketingConsent('accepted');
    setConsent('accepted');
    captureMarketingAttribution();
  };
  const reject = () => {
    setMarketingConsent('rejected');
    setConsent('rejected');
  };

  return (
    <div
      role="region"
      aria-labelledby="marketing-consent-title"
      aria-describedby="marketing-consent-description"
      className={`fixed inset-x-3 z-[100] mx-auto max-w-xl rounded-[20px] border border-border bg-white p-3.5 shadow-lift sm:rounded-[22px] sm:p-5 ${
        sitsAboveMobileNav
          ? 'bottom-[calc(5.75rem+env(safe-area-inset-bottom))] lg:bottom-4'
          : 'bottom-[calc(0.75rem+env(safe-area-inset-bottom))]'
      }`}
      dir={arabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E] sm:h-11 sm:w-11 sm:rounded-2xl" aria-hidden="true">
          <ShieldCheck className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div id="marketing-consent-title" className="break-words text-[13.5px] font-extrabold leading-snug text-navy sm:text-[14px]">
            {arabic ? 'خيارات القياس والإعلانات' : 'Measurement and advertising choices'}
          </div>
          <p id="marketing-consent-description" className="mt-1 break-words text-[12px] leading-relaxed text-muted-foreground sm:text-[12.5px]">
            {arabic
              ? 'بموافقتك، نحفظ مصدر الزيارة ونستخدم أدوات Meta لقياس أداء الإعلانات. يمكنك الرفض وسيبقى الموقع والنماذج يعملان.'
              : 'With your consent, we save the visit source and use Meta tools to measure advertising. You can decline and the website and forms will still work.'}
            {' '}
            <Link href="/privacy" className="font-bold text-teal underline decoration-2 underline-offset-2">
              {arabic ? 'التفاصيل' : 'Details'}
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-2.5">
        <button type="button" onClick={reject} className="btn btn-outline h-auto min-h-11 whitespace-normal px-3 py-2 text-center text-[13px] leading-snug">
          {arabic ? 'رفض' : 'Decline'}
        </button>
        <button type="button" onClick={accept} className="btn btn-primary h-auto min-h-11 whitespace-normal px-3 py-2 text-center text-[13px] leading-snug">
          {arabic ? 'موافقة' : 'Accept'}
        </button>
      </div>
    </div>
  );
}
