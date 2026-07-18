'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { PROJECT_STATUSES } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageState from '@/components/PageState';
import StatusTimeline from '@/components/StatusTimeline';
import StatusBadge from '@/components/StatusBadge';
import { FileText, MapPin, Calendar, Wallet, Download } from 'lucide-react';

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <AppShell><PageState kind="loading" title={t('loading')} /></AppShell>;
  if (!data || data.error) return <AppShell><PageState kind="missing" title={t('notFound')} actionHref="/" actionLabel={t('backToHome')} /></AppShell>;

  const idx = PROJECT_STATUSES.indexOf(data.status);

  return (
    <AppShell wide>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-2.5 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="display-title text-[24px] sm:text-[28px]">{t('projectStatus')}</h1>
          <StatusBadge status={data.status}>{t(`status_${data.status}`)}</StatusBadge>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[1.45fr_1fr]">
          {/* details column */}
          <div className="order-2 space-y-3 lg:order-1">
            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-4 space-y-2.5 sm:p-5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{t('projectSummary')}</div>
                <div className="text-sm font-semibold text-navy">{t(`cat_${data.category}`)}</div>
                {data.location && <div className="flex items-start gap-2 text-sm text-navy"><MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" aria-hidden="true" /><span>{data.location}</span></div>}
                <div className="text-sm text-muted-foreground leading-relaxed">{data.description}</div>
                {data.timeline && <div className="flex items-center gap-2 text-sm text-navy"><Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />{data.timeline}</div>}
                {data.budgetRange && <div className="flex items-center gap-2 text-sm text-navy"><Wallet className="w-4 h-4 text-muted-foreground" aria-hidden="true" />{data.budgetRange}</div>}
              </CardContent>
            </Card>

            {data.files && data.files.length > 0 && (
              <Card className="rounded-2xl shadow-soft">
                <CardContent className="p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('uploadedFiles')}</div>
                  <div className="space-y-1.5">
                    {data.files.map((f, i) => (
                      <a key={i} href={f.data} download={f.name} className="flex min-h-11 items-center gap-2 text-sm text-navy bg-secondary rounded-xl px-3 py-2 hover:bg-secondary/70">
                        <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate">{f.name}</span>
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
                <StatusTimeline statuses={PROJECT_STATUSES} currentIndex={idx} getLabel={(status) => t(`status_${status}`)} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-[#D0F2EE]/55 shadow-soft dark:bg-[#142A44]">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-navy">{t('nextStep')}</div>
                <div className="text-sm leading-relaxed text-navy">{t(`msg_${data.status}`)}</div>
              </CardContent>
            </Card>

            {['bids_received', 'shortlisted', 'meeting_arranged'].includes(data.status) ? (
              <Button onClick={() => router.push(`/bids/${id}`)} className="w-full h-12 text-base" style={{ background: '#152B54' }}>
                {t('viewBids')}
              </Button>
            ) : (
              <PageState kind="empty" compact title={t('noBidsYet')} />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
