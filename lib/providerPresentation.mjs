const cleanText = (value) => String(value || '').trim();

export const providerTypeLabel = (provider, t) => (
  provider?.providerType === 'consultant' ? t('providerTypeConsultant') : t('providerTypeContractor')
);

export const providerDisplayName = (provider, t, { includeCr = false } = {}) => {
  const companyName = cleanText(provider?.companyName);
  if (companyName) return companyName;

  const crNumber = cleanText(provider?.crNumber);
  if (includeCr && crNumber) return `${t('crNumber')} ${crNumber}`;

  return t('provider');
};
