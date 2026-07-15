-- AgriVeda shared backend schema
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.farmers (
  id uuid primary key default gen_random_uuid(),
  device_id text unique not null,
  name text,
  phone text,
  preferred_language text default 'hi',
  created_at timestamptz default now()
);

create table if not exists public.spray_logs (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmers(id) on delete cascade,
  crop_id text not null,
  field_id text,
  product_id text not null,
  product_name text not null,
  moa_group text,
  spray_date date not null,
  dose_used text,
  growth_stage text,
  created_at timestamptz default now()
);

create index if not exists spray_logs_farmer_id_idx on public.spray_logs (farmer_id);
create index if not exists spray_logs_spray_date_idx on public.spray_logs (spray_date desc);

create table if not exists public.outbreak_reports (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmers(id) on delete set null,
  crop_id text not null,
  pest_or_disease text not null,
  photo_url text,
  latitude double precision not null,
  longitude double precision not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  verified boolean default false,
  report_date timestamptz default now()
);

create index if not exists outbreak_reports_report_date_idx
  on public.outbreak_reports (report_date desc);

-- pest_or_disease format: "pest:p1" or "disease:d2"

-- ---------------------------------------------------------------------------
-- Row Level Security — deny all anon / authenticated direct access.
-- Server APIs use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- ---------------------------------------------------------------------------

alter table public.farmers enable row level security;
alter table public.spray_logs enable row level security;
alter table public.outbreak_reports enable row level security;

drop policy if exists "anon_select_farmers" on public.farmers;
drop policy if exists "anon_insert_farmers" on public.farmers;
drop policy if exists "anon_select_spray_logs" on public.spray_logs;
drop policy if exists "anon_insert_spray_logs" on public.spray_logs;
drop policy if exists "anon_select_outbreak_reports" on public.outbreak_reports;
drop policy if exists "anon_insert_outbreak_reports" on public.outbreak_reports;

-- No policies for anon/authenticated ⇒ default deny.
-- (Re-run this block alone on existing projects — see rls-lockdown.sql)

-- ---------------------------------------------------------------------------
-- Demo seed data (optional — nearby Jaipur for map testing)
-- Insert as SQL editor (postgres role) — bypasses RLS.
-- ---------------------------------------------------------------------------

insert into public.outbreak_reports (crop_id, pest_or_disease, latitude, longitude, severity, verified, report_date)
values
  ('paddy', 'pest:p1', 26.9124, 75.7873, 'medium', false, now() - interval '2 days'),
  ('paddy', 'pest:p1', 26.9180, 75.7920, 'high', false, now() - interval '36 hours'),
  ('paddy', 'pest:p1', 26.9150, 75.7850, 'medium', false, now() - interval '1 day'),
  ('maize', 'pest:p1', 26.9200, 75.7800, 'high', true, now() - interval '3 days'),
  ('cotton', 'pest:p1', 21.1458, 79.0882, 'medium', false, now() - interval '5 days'),
  ('tomato', 'disease:d1', 12.9716, 77.5946, 'high', false, now() - interval '4 days');
