'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import AdminPublicLinkActions from '@/components/AdminPublicLinkActions';
import PageState from '@/components/PageState';
import StatusBadge from '@/components/StatusBadge';
import { useLang } from '@/lib/LangContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building2, CalendarClock, ChevronLeft, ChevronRight, ClipboardCheck, Lock, Loader2, LogOut, RefreshCw, ShieldCheck, TriangleAlert } from 'lucide-react';
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
            <Button variant="navy" onClick={login} disabled={busy} aria-busy={busy} className="w-full">
              {busy ? <><Loader2 className="animate-spin" aria-hidden="true" />{t('loading')}</> : t('login')}
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
        <Card className="mb-4 border-[#EF4444]/35 bg-[#EF4444]/[0.06] dark:border-[#EF4444]/40 dark:bg-[#EF4444]/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EF4444]/10 text-[#EF4444]" aria-hidden="true">
                <TriangleAlert className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-[#EF4444]">Admin data could not load</div>
                <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{loadError}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="navy"
                size="sm"
                onClick={() => window.location.reload()}
                className="h-11 sm:h-9"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
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
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 grid min-w-0 w-full grid-cols-2">
          <TabsTrigger value="projects" className="h-auto min-w-0 whitespace-normal px-2 py-2 leading-tight">
            {t('projects')} ({loadingData ? '…' : projects.length})
          </TabsTrigger>
          <TabsTrigger value="contractors" className="h-auto min-w-0 whitespace-normal px-2 py-2 leading-tight">
            {t('contractors')} ({loadingData ? '…' : contractors.length})
          </TabsTrigger>
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
                        <span className="min-w-0 break-words text-sm font-semibold leading-snug text-navy">{t(`cat_${p.category}`)}</span>
                        <StatusBadge status={p.status}>{t(`status_${p.status}`)}</StatusBadge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{p.location}</div>
                      <div className="line-clamp-2 break-words text-xs leading-relaxed text-muted-foreground">{p.description}</div>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                        <span className="min-w-0 break-words">{t('applicationTime')}: {formatAdminTime(p.createdAt, lang)}</span>
                      </div>
                    </div>
                    <Next className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </button>
                <AdminPublicLinkActions
                  inset
                  className="mt-3"
                  label={t('requesterLink')}
                  path={`/project/${p.id}`}
                  copyLabel={t('copyLink')}
                  openLabel={t('openLink')}
                  onCopy={() => copyProjectLink(p.id)}
                  onOpen={() => window.open(`/project/${p.id}`, '_blank', 'noopener,noreferrer')}
                />
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
                    <div className="flex flex-col gap-2.5 min-[390px]:flex-row min-[390px]:items-start min-[390px]:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="break-words text-sm font-semibold leading-snug text-navy">{c.companyName}</span>
                        <Badge variant="outline" className="max-w-full gap-1 whitespace-normal text-start text-[12px]">
                          <TypeIcon className="h-3 w-3 shrink-0" />
                          {providerTypeLabel(c, t)}
                        </Badge>
                        {c.verificationStatus === 'verified' && <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#00B59E]" aria-hidden="true" />}
                      </div>
                      <div className="mt-0.5 break-words text-xs text-muted-foreground">{c.contactPerson} · {c.whatsapp}</div>
                      {isConsultant && (
                        <div className="mt-0.5 break-words text-[12px] text-muted-foreground">{consultantGradeLabel(c.consultantGrade, t)}</div>
                      )}
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                        <span className="min-w-0 break-words">{t('applicationTime')}: {formatAdminTime(c.createdAt, lang)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {services.slice(0,3).map(cat => (
                          <span key={cat} className="max-w-full break-words rounded-full bg-secondary px-2 py-1 text-[12px] font-medium text-navy">{t(`cat_${cat}`)}</span>
                        ))}
                        {services.length > 3 && <span className="rounded-full border border-border bg-card px-2 py-1 text-[12px] font-semibold text-muted-foreground">+{services.length - 3}</span>}
                      </div>
                    </div>
                    <div className="flex min-w-0 items-center justify-between gap-2 border-t border-border/70 pt-2 min-[390px]:shrink-0 min-[390px]:justify-end min-[390px]:border-0 min-[390px]:pt-0">
                      <StatusBadge status={c.verificationStatus}>{t(`cstatus_${c.verificationStatus}`)}</StatusBadge>
                      <Next className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </div>
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
