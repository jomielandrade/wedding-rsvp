-- Allow admin to manually override guest RSVP status.

alter table public.guests
  add column if not exists status_override text check (status_override in ('attending', 'declining')),
  add column if not exists status_override_at timestamptz;

create index if not exists guests_status_override_idx
  on public.guests (status_override);
