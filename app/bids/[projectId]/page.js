'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageState from '@/components/PageState';
import { ShieldCheck, Clock, Wallet, FileWarning, FileCheck2, FileText, Paperclip } from 'lucide-react';
import { toast } from 'sonner';

const providerTypeLabel = (provider, t) => (
  provider?.providerType === 'consultant' ? t('providerTypeConsultant') : t('providerTypeContractor')
);

export default function BidsPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const { t } = useLang();
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => fetch(`/api/projects/${projectId}/bids`).then(r => r.json()).then(j => { setD(j); setLoading(false); });
  useEffect(() => { load(); }, [projectId]);

  if (loading) return <AppShell><PageState kind="loading" title={t('loading')} /></AppShell>;
  if (!d || d.error) return <AppShell><PageState kind="missing" title={t('notFound')} actionHref="/" actionLabel={t('backToHome')} /></AppShell>;

  const action = async (act, contractorId) => {
    await fetch('/api/projects/shortlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId, contractorId, action: act }) });
    toast.success(act === 'meeting' ? t('bidRequest') : t('shortlistDone'));
    load();
  };

  const sortedBids = [...d.bids].sort((a, b) => a.price - b.price);
  const lowest = sortedBids[0]?.price;

  return (
    <AppShell>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h1 className="display-title min-w-0 text-[24px] sm:text-[28px]">{t('bidComparison')}</h1>
        <Button variant="ghost" size="sm" className="h-11 shrink-0 px-3 sm:h-9" onClick={() => router.back()}>{t('back')}</Button>
      </div>
      <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground">{t('onlyVerified')}</p>

      <div className="space-y-3">
        {sortedBids.length === 0 && <PageState kind="empty" compact title={t('noBidsYet')} />}
        {sortedBids.map((b) => {
          const c = d.contractors[b.contractorId] || {};
          const isLowest = b.price === lowest;
          return (
            <Card key={b.id} className={`rounded-[18px] border shadow-soft ${isLowest ? 'border-[#00B59E] ring-1 ring-[#00B59E]/15' : 'border-border'}`}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col items-start gap-2 mb-2 sm:flex-row sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="min-w-0 break-words font-semibold text-navy text-base">{c.companyName || t('provider')}</span>
                      {c.providerType && (
                        <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold text-navy">{providerTypeLabel(c, t)}</span>
                      )}
                      {c.verificationStatus === 'verified' && <ShieldCheck className="w-4 h-4" style={{ color: '#00B59E' }} aria-hidden="true" />}
                    </div>
                    {c.serviceAreas && <div className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{c.serviceAreas}</div>}
                  </div>
                  {isLowest && <Badge variant="success" className="shrink-0 text-[11px]">{t('lowestBid')}</Badge>}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                  <div className="rounded-[14px] border border-border/70 bg-secondary/70 p-3">
                    <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground"><Wallet className="h-3 w-3" aria-hidden="true" />{t('price')}</div>
                    <div className="text-base font-bold text-navy mt-0.5">{b.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{t('currencyQar')}</span></div>
                  </div>
                  <div className="rounded-[14px] border border-border/70 bg-secondary/70 p-3">
                    <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground"><Clock className="h-3 w-3" aria-hidden="true" />{t('timeline')}</div>
                    <div className="text-sm font-semibold text-navy mt-0.5">{b.timeline}</div>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {b.warranty && <div className="flex items-start gap-2 text-[13px] leading-relaxed"><FileCheck2 className="w-3.5 h-3.5 text-navy mt-0.5 shrink-0" aria-hidden="true" /><span><span className="font-semibold">{t('warranty')}:</span> {b.warranty}</span></div>}
                  {b.exclusions && <div className="flex items-start gap-2 text-[13px] leading-relaxed"><FileWarning className="w-3.5 h-3.5 text-navy mt-0.5 shrink-0" aria-hidden="true" /><span><span className="font-semibold">{t('exclusions')}:</span> {b.exclusions}</span></div>}
                  {b.notes && <div className="text-[13px] leading-relaxed text-muted-foreground">{b.notes}</div>}
                </div>

                {b.attachments && b.attachments.length > 0 && (
                  <div className="mt-3 border-t border-border pt-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <Paperclip className="w-3 h-3" aria-hidden="true" />
                      {t('bidFiles')}
                    </div>
                    <div className="space-y-1.5">
                      {b.attachments.map((f, i) => (
                        <a
                          key={i}
                          href={f.data || f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-h-11 items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-[13px] text-navy hover:bg-secondary/70"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span className="min-w-0 flex-1 truncate">{f.name || t('files')}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-2 min-[390px]:flex-row">
                  <Button variant="outline" size="sm" className="h-11 w-full flex-1" onClick={() => action('shortlist', b.contractorId)}>{t('shortlist')}</Button>
                  <Button size="sm" className="h-11 w-full flex-1" style={{ background: '#152B54' }} onClick={() => action('meeting', b.contractorId)}>{t('requestMeeting')}</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
