-- Migration: store guests in database for admin management

create table if not exists public.guests (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  full_name text not null,
  max_guests integer not null default 1 check (max_guests >= 1 and max_guests <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guests_slug_idx on public.guests (slug);
create index if not exists guests_full_name_idx on public.guests (full_name);

alter table public.guests enable row level security;

create policy "Deny public reads on guests"
  on public.guests for select to anon, authenticated using (false);

create policy "Deny public inserts on guests"
  on public.guests for insert to anon, authenticated with check (false);

create policy "Deny public updates on guests"
  on public.guests for update to anon, authenticated using (false);

create policy "Deny public deletes on guests"
  on public.guests for delete to anon, authenticated using (false);

-- Seed placeholder guests if migrating from wedding.ts
insert into public.guests (slug, full_name, max_guests)
values
  ('john-doe', 'John Doe', 1),
  ('jane-smith', 'Jane Smith', 1)
on conflict (slug) do nothing;
