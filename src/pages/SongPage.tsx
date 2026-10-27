import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Song, supabase, fmt } from '../lib/supabase'
import { usePlayer } from '../components/PlayerContext'
import { Down, Pause, Play, Share } from '../components/Icons'
export default function SongPage() {
  const { id } = useParams(), p = usePlayer()
  const [s, setS] = useState<Song | null>(null), [missing, setMissing] = useState(false), [msg, setMsg] = useState('')
  useEffect(() => { supabase.from('songs').select('*').eq('id', id).single()
    .then(({ data }) => data ? setS(data as Song) : setMissing(true)) }, [id])
  if (missing) return <p className="text-zinc-400">Song not found.</p>
  if (!s) return <p className="text-zinc-500">Loading…</p>
  const active = p.current?.id === s.id && p.playing
  const share = async () => { const url = location.href
    if (navigator.share) { try { await navigator.share({ title: s.title, text: `${s.title} – ${s.artist}`, url }) } catch {} }
    else { await navigator.clipboard.writeText(url); setMsg('Link copied') } }
  const download = async () => { try { const b = await (await fetch(s.file_url)).blob(), a = document.createElement('a')
    a.href = URL.createObjectURL(b); a.download = `${s.artist} - ${s.title}.mp3`; a.click(); URL.revokeObjectURL(a.href)
  } catch { window.open(s.file_url, '_blank') } }
  const btn = 'flex items-center gap-2 rounded-full border border-line bg-card px-5 py-3 hover:border-gold/50'
  return (<div className="grid gap-8 md:grid-cols-[360px_1fr] md:items-end">
    <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gold to-flame shadow-glow">
      {s.cover_url && <img src={s.cover_url} alt={s.title} className="h-full w-full object-cover" />}</div>
    <div><p className="text-sm text-gold">{s.genre ?? 'Single'}</p>
      <h1 className="font-sora text-4xl font-extrabold text-white md:text-6xl">{s.title}</h1>
      <p className="mt-1 text-xl text-zinc-300">{s.artist}</p>
      <p className="mt-3 text-sm text-zinc-500">{s.plays.toLocaleString()} plays{s.duration ? ` · ${fmt(s.duration)}` : ''}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => p.play(s, [s])} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-flame px-6 py-3 font-semibold text-black hover:shadow-glow">
          {active ? <Pause /> : <Play />}{active ? 'Pause' : 'Play'}</button>
        <button onClick={share} className={btn}><Share />Share</button>
        <button onClick={download} className={btn}><Down />Download MP3</button></div>
      {msg && <p className="mt-3 text-sm text-gold">{msg}</p>}</div></div>)
}
