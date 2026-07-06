-- Track when guests open their personal invite links

alter table public.guests
  add column if not exists first_opened_at timestamptz,
  add column if not exists last_opened_at timestamptz,
  add column if not exists open_count integer not null default 0 check (open_count >= 0);

create index if not exists guests_first_opened_at_idx
  on public.guests (first_opened_at desc nulls last);
