'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import ResultFileLink from '@/components/ResultFileLink';
import { useLang } from '@/lib/LangContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageState from '@/components/PageState';
import { BookmarkPlus, Building2, CalendarCheck2, ClipboardCheck, ShieldCheck, Clock, Wallet, FileWarning, FileCheck2, Paperclip } from 'lucide-react';
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
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
          <h1 className="display-title min-w-0 break-words text-[24px] sm:text-[28px]">{t('bidComparison')}</h1>
          <Button variant="ghost" size="sm" className="h-auto min-h-11 shrink-0 whitespace-normal px-3 py-2 text-center leading-snug sm:min-h-9" onClick={() => router.back()}>{t('back')}</Button>
        </div>
        <p className="mb-4 max-w-2xl break-words text-[13px] leading-relaxed text-muted-foreground">{t('onlyVerified')}</p>

        <div className="space-y-3">
          {sortedBids.length === 0 && <PageState kind="empty" compact title={t('noBidsYet')} />}
          {sortedBids.map((b) => {
            const c = d.contractors[b.contractorId] || {};
            const isLowest = b.price === lowest;
            const ProviderIcon = c.providerType === 'consultant' ? ClipboardCheck : Building2;
            return (
              <Card key={b.id} className={`overflow-hidden rounded-[18px] border shadow-soft ${isLowest ? 'border-[#00B59E]/70 bg-[#D0F2EE]/10 ring-1 ring-[#00B59E]/15 dark:bg-[#00B59E]/[0.04]' : 'border-border'}`}>
                {isLowest && <div className="h-1 bg-[#00B59E]" aria-hidden="true" />}
                <CardContent className="p-4 sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
                      <ProviderIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="min-w-0 break-words text-base font-bold leading-snug text-navy">{c.companyName || t('provider')}</div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {c.providerType && <Badge variant="secondary" className="max-w-full whitespace-normal text-start text-[12px]">{providerTypeLabel(c, t)}</Badge>}
                        {c.verificationStatus === 'verified' && (
                          <Badge variant="outline" className="max-w-full gap-1 whitespace-normal text-start text-[12px] text-[#00B59E]">
                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            {t('cstatus_verified')}
                          </Badge>
                        )}
                        {isLowest && <Badge variant="success" className="max-w-full whitespace-normal text-start text-[12px] leading-4">{t('lowestBid')}</Badge>}
                      </div>
                      {c.serviceAreas && <div className="mt-1.5 break-words text-[13px] leading-relaxed text-muted-foreground">{c.serviceAreas}</div>}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                    <div className={`min-w-0 rounded-[14px] border p-3 ${isLowest ? 'border-[#00B59E]/35 bg-[#D0F2EE]/45 dark:bg-[#00B59E]/10' : 'border-border/70 bg-secondary/70'}`}>
                      <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-muted-foreground ltr:uppercase ltr:tracking-wide"><Wallet className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="min-w-0 break-words">{t('price')}</span></div>
                      <div className="mt-1 min-w-0 text-navy" dir="ltr">
                        <span className="inline-flex min-w-0 max-w-full items-baseline gap-1">
                          <span className="min-w-0 break-all text-[22px] font-extrabold leading-none tabular-nums sm:text-[24px]">{b.price.toLocaleString()}</span>
                          <span className="shrink-0 text-xs font-semibold text-muted-foreground">{t('currencyQar')}</span>
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 rounded-[14px] border border-border/70 bg-secondary/70 p-3">
                      <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-muted-foreground ltr:uppercase ltr:tracking-wide"><Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="min-w-0 break-words">{t('timeline')}</span></div>
                      <div className="mt-1 break-words text-sm font-semibold leading-snug text-navy">{b.timeline || '—'}</div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {b.warranty && <div className="flex items-start gap-2 text-[13px] leading-relaxed"><FileCheck2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00B59E]" aria-hidden="true" /><span className="min-w-0 break-words"><span className="font-semibold text-navy">{t('warranty')}:</span> {b.warranty}</span></div>}
                    {b.exclusions && <div className="flex items-start gap-2 text-[13px] leading-relaxed"><FileWarning className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFB638]" aria-hidden="true" /><span className="min-w-0 break-words"><span className="font-semibold text-navy">{t('exclusions')}:</span> {b.exclusions}</span></div>}
                    {b.notes && <div className="break-words text-[13px] leading-relaxed text-muted-foreground">{b.notes}</div>}
                  </div>

                  {b.attachments && b.attachments.length > 0 && (
                    <div className="mt-3 border-t border-border pt-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground ltr:uppercase ltr:tracking-wide">
                        <Paperclip className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {t('bidFiles')}
                      </div>
                      <div className="space-y-1.5">
                        {b.attachments.map((f, i) => (
                          <ResultFileLink key={i} file={f} fallbackLabel={t('files')} actionLabel={t('openLink')} newTab />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 min-[390px]:flex-row">
                    <Button variant="outline" size="sm" className="h-auto min-h-11 w-full flex-1 whitespace-normal py-2 text-center leading-snug" onClick={() => action('shortlist', b.contractorId)}><BookmarkPlus className="h-4 w-4" aria-hidden="true" />{t('shortlist')}</Button>
                    <Button variant="brand" size="sm" className="h-auto min-h-11 w-full flex-1 whitespace-normal py-2 text-center leading-snug" onClick={() => action('meeting', b.contractorId)}><CalendarCheck2 className="h-4 w-4" aria-hidden="true" />{t('requestMeeting')}</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
