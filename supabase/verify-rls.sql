-- Verify RLS + private bucket after rls-lockdown.sql
-- Dashboard → SQL → New query → Run
-- Expected: every relrowsecurity = true; bucket public = false; zero anon policies on these tables.

select c.relname as table_name, c.relrowsecurity as rls_on
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'farmers', 'spray_logs', 'outbreak_reports', 'expert_queries',
    'app_kv', 'farmer_notifications', 'panel_users'
  )
order by 1;

select id, public
from storage.buckets
where id = 'expert-query-photos';

select schemaname, tablename, policyname, roles, cmd
from pg_policies
where tablename in (
  'farmers', 'spray_logs', 'outbreak_reports', 'expert_queries',
  'app_kv', 'farmer_notifications', 'panel_users'
)
order by tablename, policyname;
