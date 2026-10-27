import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GENRES, Song, supabase } from '../lib/supabase'
import SongCard from '../components/SongCard'
export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]), [loading, setLoading] = useState(true)
  const [q, setQ] = useState(''), [genre, setGenre] = useState('All'), [sp] = useSearchParams()
  useEffect(() => { supabase.from('songs').select('*').order('created_at', { ascending: false })
    .then(({ data }) => { setSongs((data as Song[]) ?? []); setLoading(false) }) }, [])
  const list = useMemo(() => songs.filter(s => (genre === 'All' || s.genre === genre) &&
    `${s.title} ${s.artist}`.toLowerCase().includes(q.toLowerCase())), [songs, q, genre])
  return (<>
    <h1 className="font-sora text-3xl font-extrabold text-white md:text-5xl">Zimbabwe's sound, <span className="text-gold">all in one place.</span></h1>
    <p className="mt-2 max-w-lg text-zinc-400">Stream and download the latest from Harare, Bulawayo and beyond.</p>
    <input value={q} onChange={e => setQ(e.target.value)} autoFocus={sp.has('search')} placeholder="Search songs or artists"
      className="mt-6 w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-gold md:max-w-md" />
    <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      {['All', ...GENRES].map(g => <button key={g} onClick={() => setGenre(g)}
        className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${genre === g ? 'border-transparent bg-gradient-to-r from-gold to-flame font-semibold text-black' : 'border-line bg-card text-zinc-300 hover:border-gold/50'}`}>{g}</button>)}</div>
    {loading ? <p className="mt-10 text-zinc-500">Loading songs…</p> : list.length === 0
      ? <p className="mt-10 text-zinc-500">No songs found. Try another genre or search.</p>
      : <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {list.map(s => <SongCard key={s.id} song={s} queue={list} />)}</div>}
  </>)
}
