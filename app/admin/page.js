'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import PageState from '@/components/PageState';
import AdminStatusBadge from '@/components/AdminStatusBadge';
import { useLang } from '@/lib/LangContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building2, CalendarClock, ChevronLeft, ChevronRight, ClipboardCheck, Copy, ExternalLink, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const formatAdminTime = (value, lang = 'en') => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-QA' : 'en-QA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const providerTypeLabel = (provider, t) => (
  provider?.providerType === 'consultant' ? t('providerTypeConsultant') : t('providerTypeContractor')
);

const consultantGradeLabel = (grade, t) => {
  if (grade === 'grade_a') return t('gradeA');
  if (grade === 'grade_b') return t('gradeB');
  if (grade === 'grade_c') return t('gradeC');
  return t('gradeUnknown');
};

const providerServices = (provider) => (
  provider?.providerType === 'consultant' ? (provider.consultantServices || []) : (provider.categories || [])
);

function AdminInner() {
  const { t, lang, dir } = useLang();
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
        const projectsRes = await fetch('/api/projects');
        const projectsJson = await projectsRes.json().catch(() => null);

        const contractorsRes = await fetch('/api/contractors');
        const contractorsJson = await contractorsRes.json().catch(() => null);

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

  const Next = dir === 'rtl' ? ChevronLeft : ChevronRight;

  if (!authed) return (
    <AppShell hideNav hideFooter>
      <Card className="mx-auto mt-8 max-w-md">
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
            <Button onClick={login} disabled={busy} className="w-full h-11" style={{ background: '#152B54' }}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : t('login')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );

  return (
    <AppShell hideNav hideFooter>
      <h1 className="display-title mb-4 text-[26px] sm:text-[30px]">{t('adminTitle')}</h1>
      {loadError && (
        <Card className="mb-4 border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10">
          <CardContent className="p-4">
            <div className="text-sm font-semibold text-red-700 dark:text-red-200">Admin data could not load</div>
            <p className="mt-1 text-xs leading-relaxed text-red-700/80 dark:text-red-200/80">{loadError}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="h-11 sm:h-9"
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
                className="h-11 sm:h-9"
              >
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="projects">{t('projects')} ({loadingData ? '…' : projects.length})</TabsTrigger>
          <TabsTrigger value="contractors">{t('contractors')} ({loadingData ? '…' : contractors.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="space-y-2">
          {loadingData && <PageState kind="loading" compact title={t('loading')} />}
          {!loadingData && !loadError && projects.length === 0 && <PageState kind="empty" compact title={t('noProjects')} />}
          {!loadingData && !loadError && projects.map(p => (
            <Card key={p.id} className="interactive-card hover:border-[#00B59E]/45 focus-within:border-[#00B59E]/45">
              <CardContent className="p-3.5">
                <button type="button" onClick={() => router.push(`/admin/project/${p.id}`)} className="w-full rounded-xl text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/30 focus-visible:ring-offset-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-navy text-sm">{t(`cat_${p.category}`)}</span>
                        <AdminStatusBadge status={p.status}>{t(`status_${p.status}`)}</AdminStatusBadge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{p.location}</div>
                      <div className="text-xs text-muted-foreground truncate">{p.description}</div>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                        <span>{t('applicationTime')}: {formatAdminTime(p.createdAt, lang)}</span>
                      </div>
                    </div>
                    <Next className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </button>
                <div className="mt-3 rounded-xl bg-secondary p-2.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t('requesterLink')}</div>
                  <div className="mt-1 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-1.5">
                    <code className="col-span-2 min-w-0 truncate text-[11px] text-navy sm:flex-1">/project/{p.id}</code>
                    <Button variant="outline" size="sm" className="h-11 w-full px-3 text-[11px] sm:h-9 sm:w-auto sm:px-2" onClick={() => copyProjectLink(p.id)}>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="ms-1">{t('copyLink')}</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-11 w-full px-3 text-[11px] sm:h-9 sm:w-auto sm:px-2" onClick={() => window.open(`/project/${p.id}`, '_blank', 'noopener,noreferrer')}>
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
          {loadingData && <PageState kind="loading" compact title={t('loading')} />}
          {!loadingData && !loadError && contractors.length === 0 && <PageState kind="empty" compact title={t('noContractors')} />}
          {!loadingData && !loadError && contractors.map(c => {
            const isConsultant = c.providerType === 'consultant';
            const TypeIcon = isConsultant ? ClipboardCheck : Building2;
            const services = providerServices(c);

            return (
            <Link key={c.id} href={`/admin/contractor/${c.id}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/30 focus-visible:ring-offset-2">
              <Card className="interactive-card hover:border-[#00B59E]/45">
                <CardContent className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-navy text-sm">{c.companyName}</span>
                        <Badge variant="outline" className="gap-1 text-[11px]">
                          <TypeIcon className="h-3 w-3" />
                          {providerTypeLabel(c, t)}
                        </Badge>
                        {c.verificationStatus === 'verified' && <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#00B59E' }} />}
                      </div>
                      <div className="mt-0.5 break-words text-xs text-muted-foreground">{c.contactPerson} · {c.whatsapp}</div>
                      {isConsultant && (
                        <div className="text-[11px] text-muted-foreground mt-0.5">{consultantGradeLabel(c.consultantGrade, t)}</div>
                      )}
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                        <span>{t('applicationTime')}: {formatAdminTime(c.createdAt, lang)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {services.slice(0,3).map(cat => (
                          <span key={cat} className="rounded-full bg-secondary px-2 py-1 text-[11px] font-medium text-navy">{t(`cat_${cat}`)}</span>
                        ))}
                      </div>
                    </div>
                    <AdminStatusBadge status={c.verificationStatus}>{t(`cstatus_${c.verificationStatus}`)}</AdminStatusBadge>
                  </div>
                </CardContent>
              </Card>
            </Link>
            );
          })}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

export default function AdminPage() {
  const { t } = useLang();
  return <Suspense fallback={<AppShell hideNav hideFooter><PageState kind="loading" title={t('loading')} /></AppShell>}><AdminInner /></Suspense>;
}
