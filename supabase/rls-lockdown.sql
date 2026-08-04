-- Run this on EXISTING Supabase projects to lock down open anon RLS
-- and private photo storage.
-- Dashboard → SQL → New query → paste → Run
--
-- After this, only the service role (server) can read/write these tables.
-- Set SUPABASE_SERVICE_ROLE_KEY on Vercel / .env.local (never NEXT_PUBLIC_).

-- Core tables
alter table if exists public.farmers enable row level security;
alter table if exists public.spray_logs enable row level security;
alter table if exists public.outbreak_reports enable row level security;

drop policy if exists "anon_select_farmers" on public.farmers;
drop policy if exists "anon_insert_farmers" on public.farmers;
drop policy if exists "anon_select_spray_logs" on public.spray_logs;
drop policy if exists "anon_insert_spray_logs" on public.spray_logs;
drop policy if exists "anon_select_outbreak_reports" on public.outbreak_reports;
drop policy if exists "anon_insert_outbreak_reports" on public.outbreak_reports;

-- Expert queries (if table exists)
alter table if exists public.expert_queries enable row level security;
drop policy if exists "anon_select_expert_queries" on public.expert_queries;
drop policy if exists "anon_insert_expert_queries" on public.expert_queries;
drop policy if exists "anon_update_expert_queries" on public.expert_queries;
drop policy if exists "anon_all_expert_queries" on public.expert_queries;

-- OTP / rate-limit KV + in-app notifications
alter table if exists public.app_kv enable row level security;
alter table if exists public.farmer_notifications enable row level security;
drop policy if exists "anon_select_app_kv" on public.app_kv;
drop policy if exists "anon_all_app_kv" on public.app_kv;
drop policy if exists "anon_select_farmer_notifications" on public.farmer_notifications;
drop policy if exists "anon_all_farmer_notifications" on public.farmer_notifications;

-- Private farmer photo bucket (signed URLs from server only)
update storage.buckets
set public = false
where id = 'expert-query-photos';

-- Drop any wide-open storage policies if present
drop policy if exists "Public read expert-query-photos" on storage.objects;
drop policy if exists "Public access expert-query-photos" on storage.objects;
drop policy if exists "Anyone can upload expert-query-photos" on storage.objects;
drop policy if exists "anon read expert photos" on storage.objects;
drop policy if exists "anon upload expert photos" on storage.objects;

-- No anon policies ⇒ default deny for anon/authenticated.
-- Service role bypasses RLS for API routes.
