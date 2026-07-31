-- Expert query inbox (farmer → admin reply)
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.expert_queries (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references public.farmers(id) on delete set null,
  device_id text,
  farmer_name text,
  farmer_phone text,
  farmer_village text,
  farmer_district text,
  farmer_state text,
  crop_slug text,
  crop_name text not null,
  query_text text not null,
  photo_url text,
  ai_diagnosis jsonb,
  source text not null default 'ask-query'
    check (source in ('ask-query', 'ai-doctor')),
  status text not null default 'pending'
    check (status in ('pending', 'in_review', 'answered', 'closed')),
  expert_reply text,
  expert_name text,
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expert_queries_status_created_idx
  on public.expert_queries (status, created_at desc);

create index if not exists expert_queries_device_id_idx
  on public.expert_queries (device_id);

create index if not exists expert_queries_farmer_id_idx
  on public.expert_queries (farmer_id);

create index if not exists expert_queries_created_at_idx
  on public.expert_queries (created_at desc);

alter table public.expert_queries enable row level security;

-- No anon policies — server service role only

-- Optional photo bucket (Dashboard → Storage → New bucket: expert-query-photos, private)
-- Service role uploads from API; signed URLs not required if using public bucket.
-- Recommended: private bucket + service role returns public URL after upload with
-- temporary signed URL, or make bucket public-read for farmer photo display.

insert into storage.buckets (id, name, public)
values ('expert-query-photos', 'expert-query-photos', true)
on conflict (id) do nothing;
