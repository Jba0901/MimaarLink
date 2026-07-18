'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { getMarketingConsent, setMarketingConsent } from '@/lib/marketingAttribution';
import { Check, ShieldCheck } from 'lucide-react';

export default function MarketingConsentSettings() {
  const { lang } = useLang();
  const [status, setStatus] = useState('pending');
  const arabic = lang === 'ar';

  useEffect(() => {
    setStatus(getMarketingConsent());
  }, []);

  const withdraw = () => {
    setMarketingConsent('rejected');
    setStatus('rejected');
    window.location.reload();
  };

  const accept = () => {
    setMarketingConsent('accepted');
    setStatus('accepted');
    window.location.reload();
  };

  const statusLabel = status === 'accepted'
    ? (arabic ? 'موافق' : 'Accepted')
    : status === 'rejected'
      ? (arabic ? 'مرفوض' : 'Declined')
      : (arabic ? 'لم يتم الاختيار' : 'Not selected');
  const statusClasses = status === 'accepted'
    ? 'border-[#00B59E]/40 bg-[#00B59E] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]'
    : status === 'rejected'
      ? 'border-border bg-muted text-muted-foreground'
      : 'border-[#FFB638]/50 bg-[#FFB638] text-[#152B54] dark:bg-[#FFB638]/15 dark:text-[#FFB638]';

  return (
    <div className="rounded-[20px] border border-border bg-card p-4 shadow-soft min-[390px]:rounded-[22px] min-[390px]:p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-0 break-words text-[15px] font-extrabold text-navy">{arabic ? 'إعدادات القياس' : 'Measurement settings'}</div>
            <span aria-live="polite" className={`inline-flex min-h-6 max-w-full items-center rounded-full border px-2.5 py-1 text-[12px] font-bold leading-none ${statusClasses}`}>{statusLabel}</span>
          </div>
          <p className="mt-1 break-words text-[12.5px] leading-relaxed text-muted-foreground">
            {arabic ? 'يمكنك تغيير اختيارك في أي وقت. لن يؤثر ذلك على استخدام الموقع أو النماذج.' : 'You can change your choice at any time. The website and forms will continue to work.'}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2.5 border-t border-border pt-4 min-[360px]:grid-cols-2">
        <button
          type="button"
          onClick={withdraw}
          aria-pressed={status === 'rejected'}
          className={`btn h-auto min-h-11 w-full whitespace-normal px-4 py-2 text-center text-[13px] leading-snug ${status === 'rejected' ? 'border border-[#FFB638]/55 bg-[#FFB638]/15 text-navy shadow-sm' : 'btn-outline'}`}
        >
          {status === 'rejected' && <Check className="h-4 w-4" aria-hidden="true" />}
          {arabic ? 'رفض أو سحب الموافقة' : 'Decline or withdraw'}
        </button>
        <button type="button" onClick={accept} aria-pressed={status === 'accepted'} className="btn btn-primary h-auto min-h-11 w-full whitespace-normal px-4 py-2 text-center text-[13px] leading-snug">
          {status === 'accepted' && <Check className="h-4 w-4" aria-hidden="true" />}
          {arabic ? 'موافقة' : 'Accept'}
        </button>
      </div>
    </div>
  );
}
