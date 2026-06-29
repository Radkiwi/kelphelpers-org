-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query)

create table if not exists signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source_page text,
  created_at timestamptz not null default now()
);

create table if not exists interactions (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,        -- e.g. 'cta_click', 'initiative_view', 'product_click'
  label text,                      -- e.g. 'plant-a-kelp-tree', 'kiwikrete'
  page text,
  session_id text,
  created_at timestamptz not null default now()
);

alter table signups enable row level security;
alter table interactions enable row level security;

-- Allow anonymous inserts only (no reads) from the public anon key
create policy "anon can insert signups" on signups
  for insert to anon
  with check (true);

create policy "anon can insert interactions" on interactions
  for insert to anon
  with check (true);
