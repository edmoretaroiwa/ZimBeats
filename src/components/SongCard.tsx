import { Link } from 'react-router-dom'
import { Song } from '../lib/supabase'
import { usePlayer } from './PlayerContext'
import { Pause, Play } from './Icons'
export default function SongCard({ song, queue }: { song: Song; queue: Song[] }) {
  const p = usePlayer(); const active = p.current?.id === song.id
  return (
    <div className="group rounded-xl border border-line bg-card p-3 transition hover:border-gold/40 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gold/80 to-flame">
        {song.cover_url ? <img src={song.cover_url} alt={song.title} loading="lazy" className="h-full w-full object-cover" />
          : <span className="grid h-full place-items-center font-sora text-5xl font-bold text-black/60">{song.title[0]}</span>}
        <button onClick={() => p.play(song, queue)} aria-label={`Play ${song.title}`}
          className={`absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full bg-gold text-black shadow-lg transition
          ${active && p.playing ? 'opacity-100' : 'opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'}`}>
          {active && p.playing ? <Pause /> : <Play />}</button>
      </div>
      <Link to={`/song/${song.id}`} className={`mt-3 block truncate text-sm font-semibold ${active ? 'text-gold' : 'text-white'}`}>{song.title}</Link>
      <p className="truncate text-xs text-zinc-400">{song.artist}</p>
      <p className="mt-1 text-[11px] text-zinc-500">{song.plays.toLocaleString()} plays{song.genre ? ` · ${song.genre}` : ''}</p>
    </div>)
}
