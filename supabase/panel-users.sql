-- Multi-expert Admin Console (owner grants permission → experts reply farmers)
-- Run in Supabase SQL Editor after expert-queries.sql

create table if not exists public.panel_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text not null,
  password_hash text not null,
  role text not null default 'expert'
    check (role in ('owner', 'manager', 'expert')),
  -- Fine-grained flags (owner can toggle)
  can_assign boolean not null default false,
  can_manage_experts boolean not null default false,
  can_view_all boolean not null default false,
  active boolean not null default true,
  crop_scopes text[] default '{}',
  created_by uuid references public.panel_users(id) on delete set null,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists panel_users_role_idx on public.panel_users (role);
create index if not exists panel_users_active_idx on public.panel_users (active);

alter table public.panel_users enable row level security;

-- Assignment on farmer tickets
alter table public.expert_queries
  add column if not exists assigned_to uuid references public.panel_users(id) on delete set null;

alter table public.expert_queries
  add column if not exists assigned_at timestamptz;

create index if not exists expert_queries_assigned_to_idx
  on public.expert_queries (assigned_to);

-- Defaults by role (application also enforces):
-- owner: all flags true
-- manager: can_assign + can_view_all
-- expert: reply only assigned (or claim unassigned)
