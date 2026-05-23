'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { CONTRACTOR_STATUSES } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Download, FileText, Hammer, Loader2, MapPin, Wallet } from 'lucide-react';

const statusColor = (status) => {
  if (status === 'verified') return '#0EB59E';
  if (status === 'cr_checked') return '#FFB638';
  if (status === 'suspended') return '#dc2626';
  return '#0D1B2A';
};

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
    return <AppShell><div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div></AppShell>;
  }

  if (!contractor || contractor.error) {
    return <AppShell><p className="text-center py-10">Not found</p></AppShell>;
  }

  const status = contractor.verificationStatus || 'applied';
  const statusOrder = CONTRACTOR_STATUSES.filter((s) => s !== 'suspended');
  const statusIndex = status === 'suspended' ? statusOrder.length - 1 : statusOrder.indexOf(status);
  const documentChecklist = [
    { key: 'cr', label: t('uploadCR') },
    { key: 'trade', label: t('uploadTrade') },
    { key: 'establishment', label: t('uploadEstablishment') },
  ];
  const documentChecks = contractor.documentChecks || {};
  const uploadedDocuments = contractor.documents || [];

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h1 className="text-xl font-bold text-navy">{t('contractorStatus')}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{contractor.companyName}</p>
        </div>
        <Badge style={{ background: statusColor(status) }} className="text-white">
          {t(`cstatus_${status}`)}
        </Badge>
      </div>

      <Card className="mb-3">
        <CardContent className="p-4 space-y-2.5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{t('contractorSummary')}</div>
          <div className="flex items-start gap-2 text-sm text-navy">
            <Hammer className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
            <span>{(contractor.categories || []).map((cat) => t(`cat_${cat}`)).join(', ')}</span>
          </div>
          {contractor.otherCategoryDesc && (
            <div className="text-sm text-muted-foreground leading-relaxed">{contractor.otherCategoryDesc}</div>
          )}
          {contractor.serviceAreas && (
            <div className="flex items-center gap-2 text-sm text-navy">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {contractor.serviceAreas}
            </div>
          )}
          {contractor.projectSizeRange && (
            <div className="flex items-center gap-2 text-sm text-navy">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              {contractor.projectSizeRange}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">{t('statusTimeline')}</div>
          <div className="space-y-2">
            {statusOrder.map((s, i) => {
              const done = i <= statusIndex;
              return (
                <div key={s} className="flex items-center gap-2.5">
                  {done ? <CheckCircle2 className="w-4 h-4" style={{ color: '#0FAE96' }} /> : <Circle className="w-4 h-4 text-muted-foreground/40" />}
                  <span className={`text-sm ${done ? 'text-navy font-medium' : 'text-muted-foreground'}`}>{t(`cstatus_${s}`)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('documentChecklist')}</div>
          <div className="space-y-1.5">
            {documentChecklist.map((doc) => {
              const present = Boolean(documentChecks[doc.key]);
              return (
                <div key={doc.key} className="flex items-center justify-between gap-2 text-sm text-navy bg-secondary rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>{doc.label}</span>
                  </div>
                  <Badge style={{ background: present ? '#0EB59E' : '#FFB638' }} className="text-white text-[10px]">
                    {present ? t('present') : t('missing')}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {uploadedDocuments.length > 0 && (
        <Card className="mb-3">
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('documents')}</div>
            <div className="space-y-1.5">
              {uploadedDocuments.map((file, i) => (
                <a
                  key={i}
                  href={file.data || file.url}
                  download={file.name}
                  className="flex items-center gap-2 text-sm text-navy bg-secondary rounded-lg px-3 py-2 hover:bg-secondary/70"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{file.name || t('files')}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-navy">
                    <Download className="w-3 h-3" />
                    {t('download')}
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={() => router.push('/')} className="w-full h-11" style={{ background: '#0D1B2A' }}>
        {t('backToHome')}
      </Button>
    </AppShell>
  );
}
