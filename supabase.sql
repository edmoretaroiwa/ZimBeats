-- Run in Supabase > SQL Editor
create table if not exists songs (
  id uuid default gen_random_uuid() primary key,
  title text not null, artist text not null, genre text,
  cover_url text, file_url text not null, original_file_url text,
  file_type text default 'mp3', file_size int, duration int,
  plays int default 0, created_at timestamp default now());
alter table songs enable row level security;
create policy "read songs" on songs for select using (true);
create policy "insert songs" on songs for insert with check (true);
create or replace function increment_plays(song_id uuid) returns void
language sql security definer as $$ update songs set plays = plays + 1 where id = song_id $$;
grant execute on function increment_plays(uuid) to anon;
insert into storage.buckets (id,name,public) values
 ('covers','covers',true),('songs','songs',true),('originals','originals',false)
 on conflict (id) do nothing;
create policy "public read media" on storage.objects for select using (bucket_id in ('covers','songs'));
create policy "upload media" on storage.objects for insert with check (bucket_id in ('covers','songs','originals'));
