'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import ResultFileLink from '@/components/ResultFileLink';
import { useLang } from '@/lib/LangContext';
import { PROJECT_STATUSES } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageState from '@/components/PageState';
import StatusTimeline from '@/components/StatusTimeline';
import StatusBadge from '@/components/StatusBadge';
import { MapPin, Calendar, Wallet } from 'lucide-react';

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
        <div className="mb-4 flex min-w-0 flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="display-title min-w-0 break-words text-[24px] sm:text-[28px]">{t('projectStatus')}</h1>
          <StatusBadge status={data.status} className="self-start">{t(`status_${data.status}`)}</StatusBadge>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[1.45fr_1fr]">
          {/* details column */}
          <div className="order-2 space-y-3 lg:order-1">
            <Card className="rounded-2xl shadow-soft">
              <CardContent className="p-4 space-y-2.5 sm:p-5">
                <div className="text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('projectSummary')}</div>
                <div className="break-words text-base font-bold text-navy">{t(`cat_${data.category}`)}</div>
                {data.location && <div className="flex items-start gap-2 text-sm text-navy"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="min-w-0 break-words">{data.location}</span></div>}
                <div className="break-words text-sm leading-relaxed text-muted-foreground">{data.description}</div>
                {data.timeline && <div className="flex items-start gap-2 text-sm text-navy"><Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="min-w-0 break-words">{data.timeline}</span></div>}
                {data.budgetRange && <div className="flex items-start gap-2 text-sm text-navy"><Wallet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="min-w-0 break-words">{data.budgetRange}</span></div>}
              </CardContent>
            </Card>

            {data.files && data.files.length > 0 && (
              <Card className="rounded-2xl shadow-soft">
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-2 text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('uploadedFiles')}</div>
                  <div className="space-y-1.5">
                    {data.files.map((f, i) => (
                      <ResultFileLink key={i} file={f} fallbackLabel={t('files')} actionLabel={t('download')} />
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
                <div className="mb-3 text-xs font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">{t('statusTimeline')}</div>
                <StatusTimeline statuses={PROJECT_STATUSES} currentIndex={idx} getLabel={(status) => t(`status_${status}`)} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-[#00B59E]/25 bg-[#D0F2EE]/55 shadow-soft dark:bg-[#142A44]">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-1 text-xs font-semibold text-navy ltr:uppercase ltr:tracking-wide">{t('nextStep')}</div>
                <div className="break-words text-sm leading-relaxed text-navy">{t(`msg_${data.status}`)}</div>
              </CardContent>
            </Card>

            {['bids_received', 'shortlisted', 'meeting_arranged'].includes(data.status) ? (
              <Button variant="navy" size="lg" onClick={() => router.push(`/bids/${id}`)} className="h-auto min-h-12 w-full whitespace-normal py-2.5 text-center text-base leading-snug">
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
