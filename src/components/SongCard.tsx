import { Link } from 'react-router-dom'
import { Song } from '../lib/supabase'
import { usePlayer } from './PlayerContext'
import { Pause, Play } from './Icons'
export default function SongCard({ song, queue }: { song: Song; queue: Song[] }) {
  const p = usePlayer(); const active = p.current?.id === song.id
  const move = (e: React.PointerEvent<HTMLDivElement>) => { if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
    e.currentTarget.style.transform = `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(10px)` }
  const leave = (e: React.PointerEvent<HTMLDivElement>) => { e.currentTarget.style.transform = '' }
  return (
    <div onPointerMove={move} onPointerLeave={leave}
      className="group rounded-xl border border-line bg-card/80 p-3 backdrop-blur transition duration-200 [transform-style:preserve-3d] hover:border-gold/50 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gold/80 to-flame shadow-xl [transform:translateZ(28px)]">
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
