'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import ResultFileLink from '@/components/ResultFileLink';
import { CONTRACTOR_STATUSES } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageState from '@/components/PageState';
import StatusTimeline from '@/components/StatusTimeline';
import StatusBadge from '@/components/StatusBadge';
import { ClipboardCheck, FileText, Hammer, House, MapPin, Paperclip, Wallet } from 'lucide-react';

const consultantGradeLabel = (grade, t) => {
  if (grade === 'grade_a') return t('gradeA');
  if (grade === 'grade_b') return t('gradeB');
  if (grade === 'grade_c') return t('gradeC');
  return t('gradeUnknown');
};

const providerServices = (provider) => (
  provider?.providerType === 'consultant' ? (provider.consultantServices || []) : (provider.categories || [])
);

export default function ContractorStatusPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLang();
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch(`/api/contractor-status/${id}`);
      if (response.status === 404) {
        setContractor({ error: true });
        return;
      }
      if (!response.ok) throw new Error('Provider status failed to load');
      setContractor(await response.json());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) {
    return <AppShell hideNav hideFooter><PageState kind="loading" title={t('loading')} /></AppShell>;
  }

  if (loadError) {
    return <AppShell hideNav hideFooter><PageState kind="error" title={t('statusLoadErrorTitle')} description={t('statusLoadErrorDesc')} actionLabel={t('tryAgain')} actionOnClick={load} actionVariant="primary" /></AppShell>;
  }

  if (!contractor || contractor.error) {
    return <AppShell hideNav hideFooter><PageState kind="missing" title={t('notFound')} description={t('notFoundDesc')} actionHref="/" actionLabel={t('backToHome')} actionVariant="primary" /></AppShell>;
  }

  const status = contractor.verificationStatus || 'applied';
  const statusOrder = CONTRACTOR_STATUSES.filter((s) => s !== 'suspended');
  const statusIndex = status === 'suspended' ? -1 : statusOrder.indexOf(status);
  const documentChecklist = [
    { key: 'cr', label: t('uploadCR') },
    { key: 'trade', label: t('uploadTrade') },
    { key: 'establishment', label: t('uploadEstablishment') },
  ];
  const documentChecks = contractor.documentChecks || {};
  const uploadedDocuments = contractor.documents || [];
  const isConsultant = contractor.providerType === 'consultant';
  const ServiceIcon = isConsultant ? ClipboardCheck : Hammer;
  const serviceKeys = providerServices(contractor);

  return (
    <AppShell wide>
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex min-w-0 items-start gap-3 rounded-[20px] border border-border bg-card p-4 shadow-soft sm:items-center sm:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D0F2EE] text-[#152B54] max-[263px]:hidden dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
            <ServiceIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="display-title break-words text-[22px] sm:text-[28px]">{t('providerStatus')}</h1>
            <p dir="auto" className="mt-1 break-words text-[13px] font-semibold leading-snug text-muted-foreground">{contractor.companyName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="max-w-full whitespace-normal text-start text-[12px]">
                {isConsultant ? t('providerTypeConsultant') : t('providerTypeContractor')}
              </Badge>
              <StatusBadge status={status}>{t(`cstatus_${status}`)}</StatusBadge>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[1.45fr_1fr]">
          {/* details column */}
          <div className="order-2 min-w-0 space-y-3 lg:order-1">
            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-4 space-y-2.5 sm:p-5">
                <div className="text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('providerSummary')}</div>
                <div className="flex items-start gap-2 text-sm text-navy">
                  <ServiceIcon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {serviceKeys.map((cat) => (
                      <Badge key={cat} variant="secondary" className="max-w-full whitespace-normal text-start text-[12px] leading-4">
                        {t(`cat_${cat}`)}
                      </Badge>
                    ))}
                  </div>
                </div>
                {isConsultant && (
                  <div className="flex min-w-0 flex-col items-start gap-1.5 rounded-xl bg-secondary/60 px-3 py-2.5 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
                    <span className="break-words text-[12px] font-semibold leading-4 text-muted-foreground">{t('consultantGrade')}</span>
                    <Badge variant="info" className="max-w-full whitespace-normal text-start text-[12px] leading-4 min-[360px]:shrink-0">
                      {consultantGradeLabel(contractor.consultantGrade, t)}
                    </Badge>
                  </div>
                )}
                {contractor.otherCategoryDesc && (
                  <div dir="auto" className="break-words text-sm leading-relaxed text-muted-foreground">{contractor.otherCategoryDesc}</div>
                )}
                {contractor.serviceAreas && (
                  <div className="flex items-start gap-2 text-sm text-navy">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span dir="auto" className="min-w-0 break-words">{contractor.serviceAreas}</span>
                  </div>
                )}
                {contractor.projectSizeRange && (
                  <div className="flex items-start gap-2 text-sm text-navy">
                    <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span dir="ltr" className="min-w-0 break-words">{contractor.projectSizeRange}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {uploadedDocuments.length > 0 && (
              <Card className="rounded-2xl shadow-soft">
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">
                      <Paperclip className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 break-words">{t('documents')}</span>
                    </div>
                    <Badge variant="info" className="shrink-0 text-[12px]">{uploadedDocuments.length}</Badge>
                  </div>
                  <div className="space-y-1.5">
                    {uploadedDocuments.map((file, i) => (
                      <ResultFileLink key={i} file={file} fallbackLabel={t('files')} actionLabel={t('download')} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* status column */}
          <div className="order-1 min-w-0 space-y-3 lg:order-2 lg:sticky lg:top-20">
            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-2 text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('documentChecklist')}</div>
                <div className="space-y-1.5">
                  {documentChecklist.map((doc) => {
                    const present = Boolean(documentChecks[doc.key]);
                    return (
                      <div key={doc.key} className="flex min-h-11 min-w-0 flex-col items-stretch gap-2 rounded-xl bg-secondary px-3 py-2.5 text-sm text-navy min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <span className="min-w-0 break-words leading-snug">{doc.label}</span>
                        </div>
                        <Badge variant={present ? 'success' : 'warning'} className="max-w-full self-start whitespace-normal text-start text-[12px] leading-4 min-[360px]:max-w-[45%] min-[360px]:shrink-0">
                          {present ? t('present') : t('missing')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-3 text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('statusTimeline')}</div>
                <StatusTimeline statuses={statusOrder} currentIndex={statusIndex} getLabel={(item) => t(`cstatus_${item}`)} />
              </CardContent>
            </Card>

          </div>
        </div>

        <Button variant="outline" onClick={() => router.push('/')} className="mt-4 h-auto min-h-11 w-full whitespace-normal py-2 text-center leading-snug lg:ms-auto lg:flex lg:max-w-sm">
          <House className="h-4 w-4" aria-hidden="true" />
          {t('backToHome')}
        </Button>
      </div>
    </AppShell>
  );
}
