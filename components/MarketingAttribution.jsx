'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLang } from '@/lib/LangContext';
import { ShieldCheck } from 'lucide-react';
import {
  captureMarketingAttribution,
  getMarketingConsent,
  MARKETING_CONSENT_KEY,
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
  const [consentReady, setConsentReady] = useState(false);
  const lastTrackedUrl = useRef('');
  const search = searchParams.toString();
  const isPrivate = PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const hasDedicatedSettings = pathname === '/privacy';
  const shouldPrompt = !isPrivate && !hasDedicatedSettings && (metaPixelConfigured() || hasTrackedMarketingParams(search));
  const sitsAboveMobileNav = pathname === '/';
  const isForm = pathname === '/post-project' || pathname === '/contractor' || pathname === '/consultant';

  useEffect(() => {
    setConsent(getMarketingConsent());
    setConsentReady(true);
    const syncConsent = (event) => {
      if (event.key === MARKETING_CONSENT_KEY || event.key === null) {
        setConsent(getMarketingConsent());
      }
    };
    window.addEventListener('storage', syncConsent);
    return () => window.removeEventListener('storage', syncConsent);
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

  if (!consentReady || !shouldPrompt || consent !== 'pending') return null;

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
      className={`marketing-consent-panel mx-auto rounded-[18px] border border-[#00B59E]/25 bg-card p-2.5 ${
        isForm
          ? 'marketing-consent-inline relative mt-3 w-[calc(100%-2rem)] max-w-7xl shadow-soft sm:w-[calc(100%-3rem)] sm:p-3 lg:w-[calc(100%-4rem)]'
          : `fixed inset-x-2.5 z-[100] max-w-xl overflow-y-auto overscroll-contain shadow-lift sm:inset-x-3 sm:rounded-[22px] sm:p-5 ${sitsAboveMobileNav
            ? 'bottom-[calc(5.75rem+env(safe-area-inset-bottom))] max-h-[calc(100dvh_-_6.5rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] lg:bottom-4 lg:max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))]'
            : 'bottom-[calc(0.75rem+env(safe-area-inset-bottom))] max-h-[calc(100dvh_-_1.5rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))]'}`
      }`}
      dir={arabic ? 'rtl' : 'ltr'}
    >
      <div className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 ${isForm ? 'max-[359px]:grid-cols-1' : 'sm:block'}`}>
        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E] sm:flex sm:h-11 sm:w-11 sm:rounded-2xl" aria-hidden="true">
            <ShieldCheck className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div id="marketing-consent-title" className="break-words text-[12.5px] font-extrabold leading-snug text-navy sm:text-[14px]">
              {arabic ? 'قياس الإعلانات' : 'Advertising measurement'}
            </div>
            <p id="marketing-consent-description" className="mt-0.5 break-words text-[11.5px] leading-4 text-muted-foreground sm:mt-1 sm:text-[12.5px] sm:leading-relaxed">
              {arabic
                ? 'نستخدم أدوات Meta لقياس الإعلان فقط بموافقتك.'
                : 'We use Meta tools to measure advertising only with your consent.'}
              {' '}
              <Link
                href="/privacy"
                target={isForm ? '_blank' : undefined}
                rel={isForm ? 'noopener noreferrer' : undefined}
                className="font-bold text-teal underline decoration-2 underline-offset-2"
              >
                {arabic ? 'التفاصيل' : 'Details'}
                {isForm && <span className="sr-only">{arabic ? ' (تفتح في علامة تبويب جديدة)' : ' (opens in a new tab)'}</span>}
              </Link>
            </p>
          </div>
        </div>
        <div className={`flex gap-1.5 ${isForm ? 'max-[359px]:grid max-[359px]:grid-cols-2' : 'z-10 bg-card/95 backdrop-blur-sm sm:mt-4 sm:grid sm:grid-cols-2 sm:gap-2.5 sm:pt-2'}`}>
          <button type="button" onClick={reject} className="btn btn-outline h-11 min-h-11 whitespace-normal px-2.5 py-2 text-center text-[12px] leading-snug sm:h-auto sm:px-3 sm:text-[13px]">
            {arabic ? 'رفض' : 'Decline'}
          </button>
          <button type="button" onClick={accept} className="btn btn-primary h-11 min-h-11 whitespace-normal px-2.5 py-2 text-center text-[12px] leading-snug sm:h-auto sm:px-3 sm:text-[13px]">
            {arabic ? 'موافقة' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}
