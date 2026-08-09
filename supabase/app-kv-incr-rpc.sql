-- Run this in Supabase SQL editor if app_kv already exists (adds atomic rate-limit RPC).
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
