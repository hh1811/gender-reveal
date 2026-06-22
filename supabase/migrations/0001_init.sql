create extension if not exists pgcrypto;

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vote text not null check (vote in ('nino', 'nina')),
  message text,
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists event_settings (
  id smallint primary key default 1,
  reveal text not null default 'none' check (reveal in ('none', 'nino', 'nina')),
  parent_names text not null default 'Héctor y Liz',
  updated_at timestamptz not null default now(),
  constraint event_settings_single_row check (id = 1)
);

insert into event_settings (id) values (1) on conflict (id) do nothing;

alter table votes enable row level security;
alter table event_settings enable row level security;

-- Anyone can read votes/settings (dashboard, admin, and realtime subscribers all use the
-- public anon key for read-only access). All writes go through Next.js API routes using
-- the service-role key, so there are no insert/update/delete policies for anon here.
create policy "public read votes" on votes for select using (true);
create policy "public read settings" on event_settings for select using (true);

alter publication supabase_realtime add table votes;
alter publication supabase_realtime add table event_settings;

-- Storage: create a public bucket named "vote-photos" for guest selfies (Dashboard ->
-- Storage -> New bucket -> public). Uploads happen server-side with the service-role key,
-- so no anon insert policy is required; a public-read policy lets <img>/background-image
-- tags load the photos directly.
-- insert into storage.buckets (id, name, public) values ('vote-photos', 'vote-photos', true)
--   on conflict (id) do nothing;
-- create policy "public read vote photos" on storage.objects for select
--   using (bucket_id = 'vote-photos');
