-- Wedding RSVP Database Schema
-- Run this in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists public.rsvp (
  id uuid primary key default uuid_generate_v4(),
  invite_slug text not null unique,
  full_name text not null,
  mobile_number text not null,
  email text,
  attendance text not null check (attendance in ('attending', 'declining')),
  guest_count integer not null default 1 check (guest_count >= 0 and guest_count <= 20),
  companion_names text[] not null default '{}',
  song_request text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists rsvp_attendance_idx on public.rsvp (attendance);
create index if not exists rsvp_created_at_idx on public.rsvp (created_at desc);
create index if not exists rsvp_full_name_idx on public.rsvp (full_name);
create unique index if not exists rsvp_invite_slug_idx on public.rsvp (invite_slug);

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

alter table public.rsvp enable row level security;

-- All writes go through the server API using the service role key.
-- No public/anonymous access to the rsvp table.
create policy "Deny public reads"
  on public.rsvp
  for select
  to anon, authenticated
  using (false);

create policy "Deny public inserts"
  on public.rsvp
  for insert
  to anon, authenticated
  with check (false);

create policy "Deny public updates"
  on public.rsvp
  for update
  to anon, authenticated
  using (false);

create policy "Deny public deletes"
  on public.rsvp
  for delete
  to anon, authenticated
  using (false);
