'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { CONTRACTOR_STATUSES } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageState from '@/components/PageState';
import StatusTimeline from '@/components/StatusTimeline';
import StatusBadge from '@/components/StatusBadge';
import { ClipboardCheck, Download, FileText, Hammer, MapPin, Wallet } from 'lucide-react';

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

  useEffect(() => {
    fetch(`/api/contractor-status/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setContractor(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <AppShell><PageState kind="loading" title={t('loading')} /></AppShell>;
  }

  if (!contractor || contractor.error) {
    return <AppShell><PageState kind="missing" title={t('notFound')} actionHref="/" actionLabel={t('backToHome')} /></AppShell>;
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
        <div className="flex flex-col items-start gap-2.5 mb-4 sm:flex-row sm:justify-between">
          <div>
            <h1 className="display-title text-[24px] sm:text-[28px]">{t('providerStatus')}</h1>
            <p className="text-xs text-muted-foreground mt-1">{contractor.companyName}</p>
          </div>
          <StatusBadge status={status}>
            {t(`cstatus_${status}`)}
          </StatusBadge>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[1.45fr_1fr]">
          {/* details column */}
          <div className="order-2 space-y-3 lg:order-1">
            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-4 space-y-2.5 sm:p-5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{t('providerSummary')}</div>
                <div className="flex items-start gap-2 text-sm text-navy">
                  <ServiceIcon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <span className="min-w-0 break-words">{serviceKeys.map((cat) => t(`cat_${cat}`)).join(', ')}</span>
                </div>
                {isConsultant && (
                  <div className="text-sm text-muted-foreground leading-relaxed">{consultantGradeLabel(contractor.consultantGrade, t)}</div>
                )}
                {contractor.otherCategoryDesc && (
                  <div className="text-sm text-muted-foreground leading-relaxed">{contractor.otherCategoryDesc}</div>
                )}
                {contractor.serviceAreas && (
                  <div className="flex items-start gap-2 text-sm text-navy">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span>{contractor.serviceAreas}</span>
                  </div>
                )}
                {contractor.projectSizeRange && (
                  <div className="flex items-start gap-2 text-sm text-navy">
                    <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span>{contractor.projectSizeRange}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {uploadedDocuments.length > 0 && (
              <Card className="rounded-2xl shadow-soft">
                <CardContent className="p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('documents')}</div>
                  <div className="space-y-1.5">
                    {uploadedDocuments.map((file, i) => (
                      <a
                        key={i}
                        href={file.data || file.url}
                        download={file.name}
                        className="flex min-h-11 items-center gap-2 text-sm text-navy bg-secondary rounded-xl px-3 py-2 hover:bg-secondary/70"
                      >
                        <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate">{file.name || t('files')}</span>
                        <Badge variant="secondary" className="shrink-0 gap-1 border border-border bg-card text-[11px] text-navy">
                          <Download className="w-3 h-3" aria-hidden="true" />
                          {t('download')}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* status column */}
          <div className="order-1 space-y-3 lg:order-2 lg:sticky lg:top-20">
            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-4 sm:p-5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">{t('statusTimeline')}</div>
                <StatusTimeline statuses={statusOrder} currentIndex={statusIndex} getLabel={(item) => t(`cstatus_${item}`)} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-4 sm:p-5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('documentChecklist')}</div>
                <div className="space-y-1.5">
                  {documentChecklist.map((doc) => {
                    const present = Boolean(documentChecks[doc.key]);
                    return (
                      <div key={doc.key} className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-secondary px-3 py-2 text-sm text-navy">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <span className="min-w-0">{doc.label}</span>
                        </div>
                        <Badge variant={present ? 'success' : 'warning'} className="shrink-0 text-[11px]">
                          {present ? t('present') : t('missing')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => router.push('/')} className="w-full h-11" style={{ background: '#152B54' }}>
              {t('backToHome')}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
