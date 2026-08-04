-- Durable KV for OTP + rate limits (multi-instance Vercel)
create table if not exists public.app_kv (
  key text primary key,
  value jsonb not null,
  expires_at timestamptz,
  updated_at timestamptz default now()
);

create index if not exists app_kv_expires_idx on public.app_kv (expires_at);

-- In-app farmer alerts when expert replies
create table if not exists public.farmer_notifications (
  id uuid primary key default gen_random_uuid(),
  device_id text,
  farmer_phone text,
  expert_query_id uuid references public.expert_queries(id) on delete set null,
  title text not null,
  body text not null,
  href text default '/my-queries',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists farmer_notifications_device_idx
  on public.farmer_notifications (device_id, created_at desc);

create index if not exists farmer_notifications_phone_idx
  on public.farmer_notifications (farmer_phone, created_at desc);

-- Prefer private photo storage (run in Supabase dashboard / storage policies)
-- update storage.buckets set public = false where id = 'expert-query-photos';
