-- Drop the unused song_request column. It was always written as null and never
-- populated or read, so no data is lost.

alter table public.rsvp drop column if exists song_request;
