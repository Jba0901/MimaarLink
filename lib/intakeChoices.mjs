// Keep the existing text payloads. Both language labels identify the same choice
// so switching the interface language never drops a selection or edits user data.
const choices = {
  timeline: [
    { en: 'Not sure yet', ar: 'لست متأكداً بعد', shortEn: 'Not sure', shortAr: 'غير متأكد', auxiliary: true },
  ],
  budget: [
    { en: 'Not sure yet', ar: 'لست متأكداً بعد', shortEn: 'Not sure', shortAr: 'غير متأكد', auxiliary: true },
  ],
  projectSize: [
    { en: 'Not sure yet', ar: 'لست متأكداً بعد', shortEn: 'Not sure', shortAr: 'غير متأكد', auxiliary: true },
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
