-- Durable KV for OTP + rate limits (multi-instance Vercel)
create table if not exists public.app_kv (
  key text primary key,
  value jsonb not null,
  expires_at timestamptz,
  updated_at timestamptz default now()
);

create index if not exists app_kv_expires_idx on public.app_kv (expires_at);

-- Atomic counter for rate limits (call via service role RPC)
create or replace function public.app_kv_incr(p_key text, p_window_ms bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  now_ms bigint := (extract(epoch from clock_timestamp()) * 1000)::bigint;
  row_val jsonb;
  cnt int;
  reset_at bigint;
  next_val jsonb;
begin
  perform pg_advisory_xact_lock(hashtext(p_key));

  select value into row_val from public.app_kv where key = p_key;

  if row_val is null or coalesce((row_val->>'resetAt')::bigint, 0) <= now_ms then
    cnt := 1;
    reset_at := now_ms + greatest(p_window_ms, 1000);
  else
    cnt := coalesce((row_val->>'count')::int, 0) + 1;
    reset_at := (row_val->>'resetAt')::bigint;
  end if;

  next_val := jsonb_build_object('count', cnt, 'resetAt', reset_at);

  insert into public.app_kv as k (key, value, expires_at, updated_at)
  values (
    p_key,
    next_val,
    to_timestamp(reset_at / 1000.0),
    now()
  )
  on conflict (key) do update
    set value = excluded.value,
        expires_at = excluded.expires_at,
        updated_at = excluded.updated_at;

  return next_val;
end;
$$;

revoke all on function public.app_kv_incr(text, bigint) from public;
grant execute on function public.app_kv_incr(text, bigint) to service_role;

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

-- Service role only — never expose OTP hashes / notifications via anon key
alter table public.app_kv enable row level security;
alter table public.farmer_notifications enable row level security;

-- Prefer private photo storage (also in rls-lockdown.sql)
update storage.buckets set public = false where id = 'expert-query-photos';
