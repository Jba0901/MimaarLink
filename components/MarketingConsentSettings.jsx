'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { getMarketingConsent, setMarketingConsent } from '@/lib/marketingAttribution';

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

  return (
    <div className="rounded-xl border border-border bg-secondary p-4">
      <div className="text-sm font-bold text-navy">{arabic ? 'إعدادات القياس' : 'Measurement settings'}</div>
      <p className="mt-1 text-xs text-muted-foreground">
        {arabic ? `الحالة الحالية: ${status === 'accepted' ? 'موافق' : status === 'rejected' ? 'مرفوض' : 'لم يتم الاختيار'}` : `Current status: ${status}`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={withdraw} className="btn btn-outline min-h-11 px-4 text-sm">
          {arabic ? 'رفض أو سحب الموافقة' : 'Decline or withdraw'}
        </button>
        <button type="button" onClick={accept} className="btn btn-primary min-h-11 px-4 text-sm">
          {arabic ? 'موافقة' : 'Accept'}
        </button>
      </div>
    </div>
  );
}
