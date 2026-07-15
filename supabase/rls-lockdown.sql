-- Run this on EXISTING Supabase projects to lock down open anon RLS.
-- Dashboard → SQL → New query → paste → Run

alter table public.farmers enable row level security;
alter table public.spray_logs enable row level security;
alter table public.outbreak_reports enable row level security;

drop policy if exists "anon_select_farmers" on public.farmers;
drop policy if exists "anon_insert_farmers" on public.farmers;
drop policy if exists "anon_select_spray_logs" on public.spray_logs;
drop policy if exists "anon_insert_spray_logs" on public.spray_logs;
drop policy if exists "anon_select_outbreak_reports" on public.outbreak_reports;
drop policy if exists "anon_insert_outbreak_reports" on public.outbreak_reports;

-- After this, only the service role (server) can read/write these tables.
-- Set SUPABASE_SERVICE_ROLE_KEY on Vercel / .env.local (never NEXT_PUBLIC_).
