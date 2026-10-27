# ZimBeats
1. Supabase: run `supabase.sql` in the SQL Editor (table, buckets, policies, play counter).
2. `cp .env.example .env` and fill in the Supabase URL + anon key.
3. `npm install && npm run dev`
4. Cloudflare Pages: build command `npm run build`, output `dist`, add the 3 env vars. `public/_redirects` handles SPA routes.
