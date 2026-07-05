-- Wedding RSVP Database Schema
-- Run this in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists public.rsvp (
  id uuid primary key default uuid_generate_v4(),
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

alter table public.rsvp enable row level security;

-- Allow anonymous inserts for RSVP submissions
create policy "Allow public RSVP inserts"
  on public.rsvp
  for insert
  to anon, authenticated
  with check (true);

-- Restrict reads/updates/deletes to service role only (admin uses server-side)
create policy "Deny public reads"
  on public.rsvp
  for select
  to anon
  using (false);

create policy "Deny public updates"
  on public.rsvp
  for update
  to anon
  using (false);

create policy "Deny public deletes"
  on public.rsvp
  for delete
  to anon
  using (false);
