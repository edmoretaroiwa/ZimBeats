import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? 'http://localhost',
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'anon')
export type Song = { id: string; title: string; artist: string; genre: string | null; cover_url: string | null
  file_url: string; original_file_url: string | null; file_type: string; file_size: number | null
  duration: number | null; plays: number; created_at: string }
export const GENRES = ['Zimdancehall', 'HipHop', 'Afro', 'Sungura', 'Amapiano']
export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
