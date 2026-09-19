// Keep the existing text payloads. Both language labels identify the same choice
// so switching the interface language never drops a selection or edits user data.
const choices = {
  timeline: [
    { en: 'As soon as possible', ar: 'أقرب وقت ممكن', shortEn: 'Now', shortAr: 'الآن' },
    { en: 'Within 2 weeks', ar: 'خلال أسبوعين', shortEn: '2 weeks', shortAr: 'أسبوعان' },
    { en: 'Within 1 month', ar: 'خلال شهر', shortEn: '1 month', shortAr: 'شهر' },
    { en: 'Within 1–3 months', ar: 'خلال ١–٣ أشهر', shortEn: '1–3 mo', shortAr: '١–٣ أشهر' },
    { en: 'Flexible', ar: 'الموعد مرن', shortEn: 'Flexible', shortAr: 'مرن' },
    { en: 'Not sure yet', ar: 'لست متأكداً بعد', shortEn: 'Not sure', shortAr: 'غير متأكد', auxiliary: true },
  ],
  budget: [
    { en: 'Not sure yet', ar: 'لست متأكداً بعد', shortEn: 'Not sure', shortAr: 'غير متأكد', auxiliary: true },
    { en: 'Under 25,000', ar: 'أقل من 25,000', shortEn: 'Under 25k', shortAr: 'أقل ٢٥' },
    { en: '25,000–50,000', ar: '25,000–50,000', shortEn: '25–50k', shortAr: '٢٥–٥٠', shortDir: 'ltr' },
    { en: '50,000–100,000', ar: '50,000–100,000', shortEn: '50–100k', shortAr: '٥٠–١٠٠', shortDir: 'ltr' },
    { en: '100,000–250,000', ar: '100,000–250,000', shortEn: '100–250k', shortAr: '١٠٠–٢٥٠', shortDir: 'ltr' },
    { en: 'Over 250,000', ar: 'أكثر من 250,000', shortEn: '250k+', shortAr: '+٢٥٠', shortDir: 'ltr' },
  ],
  projectSize: [
    { en: 'Varies by project', ar: 'يختلف حسب المشروع', shortEn: 'Varies', shortAr: 'يختلف', auxiliary: true },
    { en: 'Under 25,000', ar: 'أقل من 25,000', shortEn: 'Under 25k', shortAr: 'أقل ٢٥ ألف' },
    { en: '25,000–100,000', ar: '25,000–100,000', shortEn: '25–100k', shortAr: '٢٥–١٠٠ ألف' },
    { en: '100,000–500,000', ar: '100,000–500,000', shortEn: '100–500k', shortAr: '١٠٠–٥٠٠ ألف' },
    { en: 'Over 500,000', ar: 'أكثر من 500,000', shortEn: '500k+', shortAr: '+٥٠٠ ألف' },
  ],
};

export function intakeChoices(kind, lang) {
  return (choices[kind] || []).map((labels, index) => ({
    id: `${kind}-${index}`,
    label: labels[lang] || labels.en,
    value: labels[lang] || labels.en,
    shortLabel: labels[lang === 'ar' ? 'shortAr' : 'shortEn'] || labels[lang] || labels.en,
    shortDir: labels.shortDir || 'auto',
    auxiliary: Boolean(labels.auxiliary),
    aliases: [...new Set([labels.en, labels.ar])],
  }));
}

export function matchesChoice(option, value) {
  return option.value === value || option.aliases?.includes(value) || false;
}
