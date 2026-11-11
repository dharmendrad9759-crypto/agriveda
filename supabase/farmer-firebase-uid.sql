-- Link farmer cloud profile to Google login, not only device_id.
-- Run in Supabase SQL Editor after farmer-cloud-sync.sql

alter table public.farmers
  add column if not exists firebase_uid text;

create unique index if not exists farmers_firebase_uid_idx
  on public.farmers (firebase_uid)
  where firebase_uid is not null;
