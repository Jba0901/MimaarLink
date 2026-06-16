'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { PROJECT_STATUSES } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, FileText, MapPin, Calendar, Wallet, Loader2, Download } from 'lucide-react';

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <AppShell><div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div></AppShell>;
  if (!data || data.error) return <AppShell><p className="text-center py-10">Not found</p></AppShell>;

  const idx = PROJECT_STATUSES.indexOf(data.status);

  return (
    <AppShell wide>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="display-title text-[24px] sm:text-[28px]">{t('projectStatus')}</h1>
          <Badge style={{ background: '#0FAE96' }} className="text-white">{t(`status_${data.status}`)}</Badge>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[1.45fr_1fr]">
          {/* details column */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4 space-y-2.5 sm:p-5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{t('projectSummary')}</div>
                <div className="text-sm font-semibold text-navy">{t(`cat_${data.category}`)}</div>
                {data.location && <div className="flex items-start gap-2 text-sm text-navy"><MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" /><span>{data.location}</span></div>}
                <div className="text-sm text-muted-foreground leading-relaxed">{data.description}</div>
                {data.timeline && <div className="flex items-center gap-2 text-sm text-navy"><Calendar className="w-4 h-4 text-muted-foreground" />{data.timeline}</div>}
                {data.budgetRange && <div className="flex items-center gap-2 text-sm text-navy"><Wallet className="w-4 h-4 text-muted-foreground" />{data.budgetRange}</div>}
              </CardContent>
            </Card>

            {data.files && data.files.length > 0 && (
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">{t('uploadedFiles')}</div>
                  <div className="space-y-1.5">
                    {data.files.map((f, i) => (
                      <a key={i} href={f.data} download={f.name} className="flex items-center gap-2 text-sm text-navy bg-secondary rounded-lg px-3 py-2 hover:bg-secondary/70">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate flex-1">{f.name}</span>
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
          </div>

          {/* status column */}
          <div className="space-y-3 lg:sticky lg:top-20">
            <Card>
              <CardContent className="p-4 sm:p-5">
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">{t('statusTimeline')}</div>
                <div className="space-y-2">
                  {PROJECT_STATUSES.map((s, i) => {
                    const done = i <= idx;
                    return (
                      <div key={s} className="flex items-center gap-2.5">
                        {done ? <CheckCircle2 className="w-4 h-4" style={{ color: '#0FAE96' }} /> : <Circle className="w-4 h-4 text-muted-foreground/40" />}
                        <span className={`text-sm ${done ? 'text-navy font-medium' : 'text-muted-foreground'}`}>{t(`status_${s}`)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card style={{ background: 'rgba(15,174,150,0.08)' }}>
              <CardContent className="p-4 sm:p-5">
                <div className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: '#0FAE96' }}>{t('nextStep')}</div>
                <div className="text-sm text-navy">{t(`msg_${data.status}`)}</div>
              </CardContent>
            </Card>

            {['bids_received', 'shortlisted', 'meeting_arranged'].includes(data.status) ? (
              <Button onClick={() => router.push(`/bids/${id}`)} className="w-full h-12 text-base" style={{ background: '#0D1F3C' }}>
                {t('viewBids')}
              </Button>
            ) : (
              <p className="text-xs text-center text-muted-foreground">{t('noBidsYet')}</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
