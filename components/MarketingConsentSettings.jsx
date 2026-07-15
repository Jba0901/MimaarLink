'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { getMarketingConsent, setMarketingConsent } from '@/lib/marketingAttribution';
import { ShieldCheck } from 'lucide-react';

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
    ? 'bg-[#00B59E] text-[#152B54]'
    : status === 'rejected'
      ? 'bg-muted text-muted-foreground'
      : 'bg-[#FFB638] text-[#152B54]';

  return (
    <div className="rounded-[22px] border border-border bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[15px] font-extrabold text-navy">{arabic ? 'إعدادات القياس' : 'Measurement settings'}</div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClasses}`}>{statusLabel}</span>
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
            {arabic ? 'يمكنك تغيير اختيارك في أي وقت. لن يؤثر ذلك على استخدام الموقع أو النماذج.' : 'You can change your choice at any time. The website and forms will continue to work.'}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2.5 min-[420px]:grid-cols-2">
        <button type="button" onClick={withdraw} className="btn btn-outline min-h-11 w-full px-4 text-[13px]">
          {arabic ? 'رفض أو سحب الموافقة' : 'Decline or withdraw'}
        </button>
        <button type="button" onClick={accept} className="btn btn-primary min-h-11 w-full px-4 text-[13px]">
          {arabic ? 'موافقة' : 'Accept'}
        </button>
      </div>
    </div>
  );
}
