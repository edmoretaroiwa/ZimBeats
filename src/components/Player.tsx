import { usePlayer } from './PlayerContext'
import { fmt } from '../lib/supabase'
import { useState } from 'react'
import NowPlayingCard from './NowPlayingCard'
import { Next, Pause, Play, Prev, Vol } from './Icons'
export default function Player() {
  const p = usePlayer(); const s = p.current; const [open, setOpen] = useState(false)
  if (!s) return null
  return (<>
    {open && <NowPlayingCard onClose={() => setOpen(false)} />}
    <div className="fixed inset-x-0 bottom-14 md:bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur">
      <input type="range" min={0} max={p.dur || 1} step={0.1} value={p.pos} onChange={e => p.seek(+e.target.value)}
        aria-label="Seek" className="md:hidden block w-full accent-gold !h-1" />
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2 md:px-6 md:py-3">
        <button onClick={() => setOpen(true)} aria-label="Open now playing" className="flex min-w-0 flex-1 items-center gap-3 text-left md:w-1/4 md:flex-none">
          <div className="spin-slow relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-gold to-flame ring-2 ring-black" style={{ animationPlayState: p.playing ? 'running' : 'paused' }}>
            {s.cover_url && <img src={s.cover_url} alt="" className="h-full w-full object-cover" />}
            <i className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg ring-1 ring-line" /></div>
          <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{s.title}</p>
            <p className="truncate text-xs text-zinc-400">{s.artist}</p></div>
        </button>
        <div className="flex flex-col items-center md:flex-1">
          <div className="flex items-center gap-4">
            <button onClick={p.prev} aria-label="Previous" className="text-zinc-300 hover:text-white"><Prev /></button>
            <button onClick={p.toggle} aria-label={p.playing ? 'Pause' : 'Play'}
              className="grid h-10 w-10 place-items-center rounded-full bg-gold text-black hover:shadow-glow">
              {p.playing ? <Pause /> : <Play />}</button>
            <button onClick={p.next} aria-label="Next" className="text-zinc-300 hover:text-white"><Next /></button>
          </div>
          <div className="mt-1 hidden w-full max-w-xl items-center gap-2 text-xs text-zinc-500 md:flex">
            <span className="w-9 text-right">{fmt(p.pos)}</span>
            <input type="range" min={0} max={p.dur || 1} step={0.1} value={p.pos} onChange={e => p.seek(+e.target.value)}
              aria-label="Seek" className="flex-1 accent-gold" />
            <span className="w-9">{fmt(p.dur)}</span></div>
        </div>
        <div className="hidden w-1/4 items-center justify-end gap-2 md:flex">
          <Vol c="w-5 h-5 text-zinc-400" />
          <input type="range" min={0} max={1} step={0.01} value={p.vol} onChange={e => p.setVol(+e.target.value)}
            aria-label="Volume" className="w-24 accent-gold" /></div>
      </div></div></>)
}
