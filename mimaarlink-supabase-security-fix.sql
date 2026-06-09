-- MimaarLink Supabase security fix
-- Run once in Supabase SQL Editor for project aehzinyjvnodbtfcamxd.
--
-- Purpose:
-- - Enable Row-Level Security on all public application tables.
-- - Do not create public read/write policies.
-- - Keep the website working because MimaarLink uses the server-side API
--   and Postgres connection for submissions/admin data.

alter table if exists public.requesters enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.contractors enable row level security;
alter table if exists public.bid_invites enable row level security;
alter table if exists public.bids enable row level security;
alter table if exists public.admin_notes enable row level security;

-- Confirm current RLS status.
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename in (
    'requesters',
    'projects',
    'contractors',
    'bid_invites',
    'bids',
    'admin_notes'
  )
order by tablename;
