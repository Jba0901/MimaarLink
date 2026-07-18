'use client';

import InlineFieldMessage from '@/components/InlineFieldMessage';
import { useLang } from '@/lib/LangContext';

const COPY = {
  en: {
    title: "We couldn't send this yet",
    description: 'Your entries are still on this page. Check your connection and try again.',
  },
  ar: {
    title: 'تعذّر إرسال الطلب الآن',
    description: 'بياناتك ما زالت موجودة في هذه الصفحة. تحقق من الاتصال ثم حاول مرة أخرى.',
  },
};

export default function SubmissionRetryNotice({ id }) {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.en;

  return (
    <InlineFieldMessage id={id} className="mt-0 rounded-2xl px-3 py-3 text-[13px] leading-5">
      <span className="block font-bold">{copy.title}</span>
      <span className="mt-0.5 block font-normal text-muted-foreground">{copy.description}</span>
    </InlineFieldMessage>
  );
}
