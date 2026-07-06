-- Migration: store companion names on RSVP submissions

alter table public.rsvp
  add column if not exists companion_names text[] not null default '{}';
