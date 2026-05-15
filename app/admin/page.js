'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LangContext';
import { PROJECT_STATUSES, CONTRACTOR_STATUSES } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronRight, Copy, ExternalLink, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const statusColor = (s) => {
  if (['verified','approved','meeting_arranged','closed','bids_received'].includes(s)) return '#0EB59E';
  if (['suspended'].includes(s)) return '#dc2626';
  return '#0D1B2A';
};

function AdminInner() {
  const { t } = useLang();
  const router = useRouter();
  const sp = useSearchParams();
  const initialTab = sp.get('tab') === 'contractors' ? 'contractors' : 'projects';
  const [tab, setTab] = useState(initialTab);
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('mlAdmin') === '1') setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    const loadAdminData = async () => {
      setLoadingData(true);
      setLoadError('');
      try {
        const [projectsRes, contractorsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/contractors'),
        ]);
        const [projectsJson, contractorsJson] = await Promise.all([
          projectsRes.json().catch(() => null),
          contractorsRes.json().catch(() => null),
        ]);

        if (projectsRes.status === 401 || contractorsRes.status === 401) {
          localStorage.removeItem('mlAdmin');
          setAuthed(false);
          throw new Error('Please log in again.');
        }
        if (!projectsRes.ok) throw new Error(projectsJson?.error || 'Could not load projects');
        if (!contractorsRes.ok) throw new Error(contractorsJson?.error || 'Could not load contractors');
        if (!Array.isArray(projectsJson)) throw new Error(projectsJson?.error || 'Projects API returned invalid data');
        if (!Array.isArray(contractorsJson)) throw new Error(contractorsJson?.error || 'Contractors API returned invalid data');

        setProjects(projectsJson);
        setContractors(contractorsJson);
      } catch (e) {
        setProjects([]);
        setContractors([]);
        setLoadError(e.message || 'Admin data could not be loaded');
      } finally {
        setLoadingData(false);
      }
    };

    loadAdminData();
  }, [authed]);

  const login = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd }) });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || 'Admin login failed');
      }
      localStorage.setItem('mlAdmin', '1');
      setAuthed(true);
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };

  const projectPublicUrl = (id) => {
    if (typeof window === 'undefined') return `/project/${id}`;
    return `${window.location.origin}/project/${id}`;
  };

  const copyProjectLink = async (id) => {
    await navigator.clipboard.writeText(projectPublicUrl(id));
    toast.success(t('linkCopied'));
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
      {loadError && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-sm font-semibold text-red-700">Admin data could not load</div>
            <p className="mt-1 text-xs leading-relaxed text-red-700/80">{loadError}</p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="h-9"
              >
                Try again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
                  localStorage.removeItem('mlAdmin');
                  setAuthed(false);
                  setLoadError('');
                }}
                className="h-9"
              >
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {loadingData && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading admin data...
        </div>
      )}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="projects">{t('projects')} ({projects.length})</TabsTrigger>
          <TabsTrigger value="contractors">{t('contractors')} ({contractors.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="space-y-2">
          {projects.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">{t('noProjects')}</p>}
          {projects.map(p => (
            <Card key={p.id} className="hover:border-navy transition">
              <CardContent className="p-3.5">
                <button type="button" onClick={() => router.push(`/admin/project/${p.id}`)} className="w-full text-start">
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
                </button>
                <div className="mt-3 rounded-lg bg-secondary p-2">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">{t('requesterLink')}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <code className="min-w-0 flex-1 truncate text-[11px] text-navy">/project/{p.id}</code>
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => copyProjectLink(p.id)}>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="ms-1">{t('copyLink')}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => window.open(`/project/${p.id}`, '_blank', 'noopener,noreferrer')}>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="ms-1">{t('openLink')}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default function AdminPage() {
  return <Suspense fallback={null}><AdminInner /></Suspense>;
}
