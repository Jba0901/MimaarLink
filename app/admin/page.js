'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { PROJECT_STATUSES, CONTRACTOR_STATUSES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronRight, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const statusColor = (s) => {
  if (['verified','active','approved','meeting_arranged','closed','bids_received'].includes(s)) return '#0FAE96';
  if (['suspended'].includes(s)) return '#dc2626';
  return '#0D1F3C';
};

export default function AdminPage() {
  const { t } = useLang();
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [busy, setBusy] = useState(false);
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('mlAdmin') === '1') setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/projects').then(r => r.json()).then(setProjects);
    fetch('/api/contractors').then(r => r.json()).then(setContractors);
  }, [authed]);

  const login = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) });
      if (!res.ok) throw new Error('Invalid password');
      localStorage.setItem('mlAdmin', '1');
      setAuthed(true);
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };

  if (!authed) return (
    <AppShell hideNav>
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="w-12 h-12 rounded-full mx-auto navy flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-navy text-center">{t('adminTitle')}</h1>
          <div className="mt-5 space-y-3">
            <div>
              <Label>{t('adminPassword')}</Label>
              <Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} className="h-11 mt-1.5" />
            </div>
            <Button onClick={login} disabled={busy} className="w-full h-11" style={{ background: '#0D1F3C' }}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : t('login')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );

  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-navy mb-4">{t('adminTitle')}</h1>
      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="projects">{t('projects')} ({projects.length})</TabsTrigger>
          <TabsTrigger value="contractors">{t('contractors')} ({contractors.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="space-y-2">
          {projects.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">{t('noProjects')}</p>}
          {projects.map(p => (
            <Link key={p.id} href={`/admin/project/${p.id}`}>
              <Card className="hover:border-navy transition">
                <CardContent className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy text-sm">{t(`cat_${p.category}`)}</span>
                        <Badge style={{ background: statusColor(p.status) }} className="text-white text-[10px]">{t(`status_${p.status}`)}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{p.location}</div>
                      <div className="text-xs text-muted-foreground truncate">{p.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>
        <TabsContent value="contractors" className="space-y-2">
          {contractors.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">{t('noContractors')}</p>}
          {contractors.map(c => (
            <Link key={c.id} href={`/admin/contractor/${c.id}`}>
              <Card className="hover:border-navy transition">
                <CardContent className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-navy text-sm">{c.companyName}</span>
                        {c.verificationStatus === 'verified' && <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#0FAE96' }} />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{c.contactPerson} · {c.whatsapp}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(c.categories || []).slice(0,3).map(cat => (
                          <span key={cat} className="text-[10px] bg-secondary text-navy px-1.5 py-0.5 rounded">{t(`cat_${cat}`)}</span>
                        ))}
                      </div>
                    </div>
                    <Badge style={{ background: statusColor(c.verificationStatus) }} className="text-white text-[10px] shrink-0">{t(`cstatus_${c.verificationStatus}`)}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
