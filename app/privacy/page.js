'use client';

import AppShell from '@/components/AppShell';
import MarketingConsentSettings from '@/components/MarketingConsentSettings';
import { useLang } from '@/lib/LangContext';

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
        <h1 className="display-title mt-3 text-[28px] sm:text-[38px]">{ar ? 'إشعار الخصوصية والقياس' : 'Privacy and measurement notice'}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {ar ? 'يوضح هذا الإشعار طريقة تعامل معمار لينك مع بيانات النماذج وقياس الحملات الإعلانية.' : 'This notice explains how MimaarLink handles form data and advertising measurement.'}
        </p>

        <div className="mt-6 overflow-hidden rounded-[20px] border border-border bg-white shadow-soft sm:rounded-[24px]">
          {sections.map(([title, body], index) => (
            <section key={title} className={`flex flex-col items-start gap-2.5 p-4 min-[390px]:flex-row min-[390px]:gap-3.5 sm:p-6 ${index < sections.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[12px] font-extrabold text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[15.5px] font-extrabold leading-snug text-navy sm:text-base">{title}</h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground sm:text-sm">{body}</p>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-5">
          <MarketingConsentSettings />
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          {ar ? 'للتواصل: ' : 'Contact: '}
          <a className="font-semibold text-navy underline decoration-[#00B59E] decoration-2 underline-offset-4 transition-colors hover:text-[#00B59E]" href="mailto:MimaarLink@gmail.com">MimaarLink@gmail.com</a>
        </p>
      </div>
    </AppShell>
  );
}
