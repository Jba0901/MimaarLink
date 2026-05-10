'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Clock, Wallet, FileWarning, FileCheck2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BidsPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const { t } = useLang();
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => fetch(`/api/projects/${projectId}/bids`).then(r => r.json()).then(j => { setD(j); setLoading(false); });
  useEffect(() => { load(); }, [projectId]);

  if (loading) return <AppShell><div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-navy" /></div></AppShell>;
  if (!d || d.error) return <AppShell><p>Not found</p></AppShell>;

  const action = async (act, contractorId) => {
    await fetch('/api/projects/shortlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId, contractorId, action: act }) });
    toast.success(act === 'meeting' ? t('bidRequest') : t('shortlistDone'));
    load();
  };

  const sortedBids = [...d.bids].sort((a, b) => a.price - b.price);
  const lowest = sortedBids[0]?.price;

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-navy">{t('bidComparison')}</h1>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>{t('back')}</Button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{t('onlyVerified')}</p>

      <div className="space-y-3">
        {sortedBids.map((b) => {
          const c = d.contractors[b.contractorId] || {};
          const isLowest = b.price === lowest;
          return (
            <Card key={b.id} className={`border-2 ${isLowest ? '' : 'border-border'}`} style={isLowest ? { borderColor: '#0FAE96' } : {}}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-navy text-base">{c.companyName || 'Contractor'}</span>
                      {c.verificationStatus === 'verified' && <ShieldCheck className="w-4 h-4" style={{ color: '#0FAE96' }} />}
                    </div>
                    {c.serviceAreas && <div className="text-xs text-muted-foreground mt-0.5">{c.serviceAreas}</div>}
                  </div>
                  {isLowest && <Badge style={{ background: '#0FAE96' }} className="text-white text-[10px]">Lowest</Badge>}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-secondary rounded-lg p-2.5">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Wallet className="w-3 h-3" />{t('price')}</div>
                    <div className="text-base font-bold text-navy mt-0.5">{b.price.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">QAR</span></div>
                  </div>
                  <div className="bg-secondary rounded-lg p-2.5">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{t('timeline')}</div>
                    <div className="text-sm font-semibold text-navy mt-0.5">{b.timeline}</div>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {b.warranty && <div className="text-xs flex items-start gap-2"><FileCheck2 className="w-3.5 h-3.5 text-navy mt-0.5 shrink-0" /><span><span className="font-semibold">{t('warranty')}:</span> {b.warranty}</span></div>}
                  {b.exclusions && <div className="text-xs flex items-start gap-2"><FileWarning className="w-3.5 h-3.5 text-navy mt-0.5 shrink-0" /><span><span className="font-semibold">{t('exclusions')}:</span> {b.exclusions}</span></div>}
                  {b.notes && <div className="text-xs text-muted-foreground leading-relaxed">{b.notes}</div>}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => action('shortlist', b.contractorId)}>{t('shortlist')}</Button>
                  <Button size="sm" className="flex-1" style={{ background: '#0D1F3C' }} onClick={() => action('meeting', b.contractorId)}>{t('requestMeeting')}</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
