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
  song_request text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists rsvp_attendance_idx on public.rsvp (attendance);
create index if not exists rsvp_created_at_idx on public.rsvp (created_at desc);
create index if not exists rsvp_full_name_idx on public.rsvp (full_name);
create unique index if not exists rsvp_invite_slug_idx on public.rsvp (invite_slug);

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
