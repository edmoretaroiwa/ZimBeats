import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GENRES, Song, supabase } from '../lib/supabase'
import SongCard from '../components/SongCard'
import Hero3D from '../components/Hero3D'
import Logo3D from '../components/Logo3D'
export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]), [loading, setLoading] = useState(true)
  const [q, setQ] = useState(''), [genre, setGenre] = useState('All'), [sp] = useSearchParams()
  useEffect(() => { supabase.from('songs').select('*').order('created_at', { ascending: false })
    .then(({ data }) => { setSongs((data as Song[]) ?? []); setLoading(false) }) }, [])
  const list = useMemo(() => songs.filter(s => (genre === 'All' || s.genre === genre) &&
    `${s.title} ${s.artist}`.toLowerCase().includes(q.toLowerCase())), [songs, q, genre])
  return (<>
    <section className="relative min-h-[300px] overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-[#0d1f12] via-bg to-[#220d04] p-6 md:min-h-[380px] md:p-10">
      <Hero3D />
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-bg/85 via-bg/30 to-transparent" />
      <div className="relative z-10 max-w-md md:pt-10">
        <div className="mb-3"><Logo3D className="text-5xl md:text-7xl" /></div>
        <h1 className="font-sora text-3xl font-extrabold text-white md:text-5xl">Zimbabwe's sound, <span className="text-gold">all in one place.</span></h1>
        <p className="mt-3 text-zinc-300">Stream and download the latest from Harare, Bulawayo and beyond.</p></div>
    </section>
    <input value={q} onChange={e => setQ(e.target.value)} autoFocus={sp.has('search')} placeholder="Search songs or artists"
      className="mt-6 w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-gold md:max-w-md" />
    <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      {['All', ...GENRES].map(g => <button key={g} onClick={() => setGenre(g)}
        className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${genre === g ? 'border-transparent bg-gradient-to-r from-gold to-flame font-semibold text-black' : 'border-line bg-card text-zinc-300 hover:border-gold/50'}`}>{g}</button>)}</div>
    {loading ? <p className="mt-10 text-zinc-500">Loading songs…</p> : list.length === 0
      ? <p className="mt-10 text-zinc-500">No songs found. Try another genre or search.</p>
      : <div className="mt-6 grid perspective-1000 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {list.map(s => <SongCard key={s.id} song={s} queue={list} />)}</div>}
  </>)
}
