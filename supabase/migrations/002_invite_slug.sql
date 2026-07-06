-- Migration: tie RSVPs to invite slugs and block anonymous inserts
-- Run if you already applied the original schema.sql

alter table public.rsvp
  add column if not exists invite_slug text;

-- Backfill only if you have existing rows without slugs (optional/manual step)
-- update public.rsvp set invite_slug = 'legacy-' || id::text where invite_slug is null;

alter table public.rsvp
  alter column invite_slug set not null;

create unique index if not exists rsvp_invite_slug_idx on public.rsvp (invite_slug);

drop policy if exists "Allow public RSVP inserts" on public.rsvp;

create policy "Deny public inserts"
  on public.rsvp
  for insert
  to anon, authenticated
  with check (false);
