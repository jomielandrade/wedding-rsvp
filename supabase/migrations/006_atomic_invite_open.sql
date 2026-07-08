-- Atomic invite-open counter.
-- Replaces the read-then-write in recordInviteOpen with a single UPDATE so the
-- open_count cannot be undercounted under concurrent opens.

create or replace function public.record_invite_open(p_slug text)
returns void
language sql
as $$
  update public.guests
  set
    last_opened_at = now(),
    open_count = open_count + 1,
    first_opened_at = coalesce(first_opened_at, now()),
    updated_at = now()
  where slug = p_slug;
$$;
