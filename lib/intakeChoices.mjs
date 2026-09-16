// Keep the existing text payloads. Both language labels identify the same choice
// so switching the interface language never drops a selection or edits user data.
const choices = {
  timeline: [
    { en: 'As soon as possible', ar: 'أقرب وقت ممكن' },
    { en: 'Within 2 weeks', ar: 'خلال أسبوعين' },
    { en: 'Within 1 month', ar: 'خلال شهر' },
    { en: 'Within 3 months', ar: 'خلال ٣ أشهر' },
    { en: 'Flexible', ar: 'الموعد مرن' },
  ],
  budget: [
    { en: 'Under 25,000', ar: 'أقل من 25,000' },
    { en: '25,000–100,000', ar: '25,000–100,000' },
    { en: '100,000+', ar: '100,000 فأكثر' },
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
