-- Farmer cloud profile + farm + push tokens
-- Run in Supabase SQL Editor after schema.sql

alter table public.farmers
  add column if not exists profile_json jsonb,
  add column if not exists farm_data_json jsonb,
  add column if not exists profile_updated_at timestamptz,
  add column if not exists farm_updated_at timestamptz,
  add column if not exists push_token text,
  add column if not exists push_updated_at timestamptz,
  add column if not exists last_lat double precision,
  add column if not exists last_lon double precision;

create index if not exists farmers_push_token_idx
  on public.farmers (push_token)
  where push_token is not null;

create index if not exists farmers_last_geo_idx
  on public.farmers (last_lat, last_lon)
  where last_lat is not null and last_lon is not null;
