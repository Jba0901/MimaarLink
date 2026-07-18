'use client';

const FIELD_LABELS = {
  utm_source: ['Source', 'المصدر'],
  utm_medium: ['Medium', 'الوسيط'],
  utm_campaign: ['Campaign', 'الحملة'],
  utm_content: ['Creative', 'الإعلان'],
  landing_path: ['Landing page', 'صفحة الدخول'],
};

export default function AdminAttribution({ value, lang = 'en' }) {
  const attribution = value && typeof value === 'object' ? value : {};
  const rows = Object.entries(FIELD_LABELS).filter(([key]) => attribution[key]);
  if (rows.length === 0) return null;

  const arabic = lang === 'ar';

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
        {arabic ? 'مصدر الطلب' : 'Application source'}
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {rows.map(([key, labels]) => (
          <div key={key} className="rounded-xl bg-secondary px-3 py-2.5 text-xs">
            <div className="text-[12px] text-muted-foreground">{arabic ? labels[1] : labels[0]}</div>
            <div className="truncate font-semibold text-navy" dir="ltr" title={attribution[key]}>
              {attribution[key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
