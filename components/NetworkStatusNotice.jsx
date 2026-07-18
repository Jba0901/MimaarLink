'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, WifiOff } from 'lucide-react';

import { useLang } from '@/lib/LangContext';
import { cn } from '@/lib/utils';

const COPY = {
  en: {
    offlineTitle: "You're offline",
    offlineDescription: 'You can keep filling this page, but your entries are not saved or sent. Reconnect before submitting.',
    restoredTitle: 'Back online',
    restoredDescription: "You can submit when you're ready.",
  },
  ar: {
    offlineTitle: 'أنت غير متصل بالإنترنت',
    offlineDescription: 'يمكنك متابعة تعبئة الصفحة، لكن بياناتك غير محفوظة ولن تُرسل. أعد الاتصال قبل تقديم الطلب.',
    restoredTitle: 'عاد الاتصال بالإنترنت',
    restoredDescription: 'يمكنك تقديم الطلب عندما تكون جاهزاً.',
  },
};

export default function NetworkStatusNotice() {
  const { lang } = useLang();
  const [status, setStatus] = useState(null);
  const wasOffline = useRef(false);
  const dismissTimer = useRef(null);

  useEffect(() => {
    const clearDismissTimer = () => {
      if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    };
    const showOffline = () => {
      clearDismissTimer();
      wasOffline.current = true;
      setStatus('offline');
    };
    const showRestored = () => {
      if (!wasOffline.current) return;
      clearDismissTimer();
      wasOffline.current = false;
      setStatus('restored');
      dismissTimer.current = window.setTimeout(() => setStatus(null), 4000);
    };

    if (navigator.onLine) setStatus(null);
    else showOffline();

    window.addEventListener('offline', showOffline);
    window.addEventListener('online', showRestored);
    return () => {
      clearDismissTimer();
      window.removeEventListener('offline', showOffline);
      window.removeEventListener('online', showRestored);
    };
  }, []);

  if (!status) return null;

  const copy = COPY[lang] || COPY.en;
  const offline = status === 'offline';
  const Icon = offline ? WifiOff : CheckCircle2;

  return (
    <div
      role="status"
      aria-live="polite"
      data-network-status={status}
      className={cn(
        'mb-3 flex min-w-0 items-start gap-3 rounded-2xl border px-3 py-3 text-start shadow-soft sm:mb-4',
        offline
          ? 'border-[#FFB638]/50 bg-[#FFB638]/[0.10] dark:bg-[#FFB638]/[0.12]'
          : 'border-[#00B59E]/40 bg-[#D0F2EE]/40 dark:bg-[#00B59E]/[0.12]'
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
          offline
            ? 'bg-[#FFB638]/20 text-[#9A6200] dark:text-[#FFB638]'
            : 'bg-[#D0F2EE] text-[#007F70] dark:bg-[#00B59E]/15 dark:text-[#00B59E]'
        )}
        aria-hidden="true"
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-[13px] font-bold leading-5 text-navy">
          {offline ? copy.offlineTitle : copy.restoredTitle}
        </span>
        <span className="mt-0.5 block break-words text-[12px] leading-5 text-muted-foreground">
          {offline ? copy.offlineDescription : copy.restoredDescription}
        </span>
      </span>
    </div>
  );
}
