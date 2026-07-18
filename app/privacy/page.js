'use client';

import AppShell from '@/components/AppShell';
import MarketingConsentSettings from '@/components/MarketingConsentSettings';
import { useLang } from '@/lib/LangContext';
import { Mail } from 'lucide-react';

export default function PrivacyPage() {
  const { lang } = useLang();
  const ar = lang === 'ar';

  const sections = ar ? [
    ['البيانات التي نستلمها', 'نستلم المعلومات التي ترسلها في نماذج المشاريع أو طلبات المقاولين والمكاتب الاستشارية، بما في ذلك بيانات التواصل والمستندات التي تختار رفعها.'],
    ['استخدام البيانات', 'نستخدم البيانات لمراجعة الطلب، التواصل معك، مطابقة المشروع مع مقدمي خدمة مناسبين، إدارة حالة الطلب، وتحسين تشغيل معمار لينك.'],
    ['قياس الإعلانات', 'بعد موافقتك فقط، قد نحفظ مصدر الزيارة ومعرّفات الحملة ونستخدم Meta Pixel لقياس زيارات الصفحات وبدء النماذج وإكمال الطلبات. لا نرسل إلى Meta الاسم أو الهاتف أو البريد أو رقم السجل التجاري أو وصف المشروع أو الملفات.'],
    ['التخزين والمشاركة', 'تُخزن بيانات الطلب في أنظمة معمار لينك ومزودي البنية التقنية المستخدمين لتشغيل الخدمة. لا نشارك تفاصيل المشروع إلا بالقدر اللازم للتنسيق والمطابقة.'],
    ['اختياراتك', 'يمكنك رفض قياس الإعلانات أو سحب موافقتك من هذه الصفحة. سيستمر الموقع والنماذج في العمل. يمكنك التواصل معنا لطلب الاستفسار عن بياناتك أو تصحيحها أو حذفها، مع مراعاة المتطلبات النظامية والتشغيلية.'],
  ] : [
    ['Information we receive', 'We receive the information you submit in project and provider forms, including contact details and documents you choose to upload.'],
    ['How we use it', 'We use the information to review requests, contact you, match projects with suitable providers, manage application status, and improve MimaarLink operations.'],
    ['Advertising measurement', 'Only after consent, we may save visit-source and campaign identifiers and use Meta Pixel to measure page visits, form starts, and completed applications. We do not send Meta names, phone numbers, email addresses, CR numbers, project descriptions, or files.'],
    ['Storage and sharing', 'Application data is stored in MimaarLink systems and the technical providers used to operate the service. Project details are shared only as needed for coordination and matching.'],
    ['Your choices', 'You can decline advertising measurement or withdraw consent on this page. The website and forms will continue to work. Contact us to ask about, correct, or request deletion of your data, subject to operational and legal requirements.'],
  ];

  return (
    <AppShell hideNav>
      <div className="mx-auto max-w-3xl py-4 sm:py-8">
        <div className="eyebrow">{ar ? 'الخصوصية' : 'Privacy'}</div>
        <h1 className="display-title mt-3 break-words text-[30px] sm:text-[38px]">{ar ? 'إشعار الخصوصية والقياس' : 'Privacy and measurement notice'}</h1>
        <p className="mt-3 max-w-2xl break-words text-[14px] leading-6 text-muted-foreground">
          {ar ? 'يوضح هذا الإشعار طريقة تعامل معمار لينك مع بيانات النماذج وقياس الحملات الإعلانية.' : 'This notice explains how MimaarLink handles form data and advertising measurement.'}
        </p>

        <div className="mt-6 overflow-hidden rounded-[20px] border border-border bg-card shadow-soft sm:rounded-[24px]">
          {sections.map(([title, body], index) => (
            <section key={title} className={`grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-3 gap-y-2.5 p-3.5 min-[390px]:gap-x-3.5 min-[390px]:p-4 sm:p-6 ${index < sections.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[12px] font-extrabold text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
                {index + 1}
              </span>
              <h2 className="min-w-0 self-center break-words text-[15.5px] font-extrabold leading-snug text-navy sm:text-base">{title}</h2>
              <p className="col-span-2 min-w-0 break-words text-[13.5px] leading-6 text-muted-foreground min-[390px]:col-span-1 min-[390px]:col-start-2 sm:text-sm sm:leading-relaxed">{body}</p>
            </section>
          ))}
        </div>

        <div className="mt-5">
          <MarketingConsentSettings />
        </div>

        <a
          className="group mt-5 flex min-h-[64px] items-center gap-3 rounded-[18px] border border-border bg-secondary/50 px-3.5 py-2.5 shadow-soft transition-colors hover:border-[#00B59E]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#07111D]"
          href="mailto:MimaarLink@gmail.com"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
            <Mail className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-semibold text-muted-foreground">{ar ? 'للتواصل' : 'Contact'}</span>
            <span className="mt-0.5 block break-all text-[13.5px] font-extrabold text-navy transition-colors group-hover:text-[#00B59E]">
              <bdi dir="ltr">MimaarLink@gmail.com</bdi>
            </span>
          </span>
        </a>
      </div>
    </AppShell>
  );
}
