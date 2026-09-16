// Keep the existing text payloads. Both language labels identify the same choice
// so switching the interface language never drops a selection or edits user data.
const choices = {
  timeline: [
    { en: 'As soon as possible', ar: 'أقرب وقت ممكن' },
    { en: 'Within 2 weeks', ar: 'خلال أسبوعين' },
    { en: 'Within 1 month', ar: 'خلال شهر' },
    { en: 'Within 1–3 months', ar: 'خلال ١–٣ أشهر' },
    { en: 'Flexible', ar: 'الموعد مرن' },
    { en: 'Not sure yet', ar: 'لست متأكداً بعد' },
  ],
  budget: [
    { en: 'Not sure yet', ar: 'لست متأكداً بعد' },
    { en: 'Under 25,000', ar: 'أقل من 25,000' },
    { en: '25,000–100,000', ar: '25,000–100,000' },
    { en: '100,000–500,000', ar: '100,000–500,000' },
    { en: 'Over 500,000', ar: 'أكثر من 500,000' },
  ],
  projectSize: [
    { en: 'Varies by project', ar: 'يختلف حسب المشروع' },
    { en: 'Under 25,000', ar: 'أقل من 25,000' },
    { en: '25,000–100,000', ar: '25,000–100,000' },
    { en: '100,000–500,000', ar: '100,000–500,000' },
    { en: 'Over 500,000', ar: 'أكثر من 500,000' },
  ],
};

export function intakeChoices(kind, lang) {
  return (choices[kind] || []).map((labels, index) => ({
    id: `${kind}-${index}`,
    label: labels[lang] || labels.en,
    value: labels[lang] || labels.en,
    aliases: [...new Set(Object.values(labels))],
  }));
}

export function matchesChoice(option, value) {
  return option.value === value || option.aliases?.includes(value) || false;
}
