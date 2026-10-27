import { CSSProperties, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayer } from './PlayerContext'
import { fmt } from '../lib/supabase'
import { Next, Pause, Play, Prev } from './Icons'
const streak = (c: string, top: string) => ({ top, background: c, '--p': 0 }) as CSSProperties
export default function NowPlayingCard({ onClose }: { onClose: () => void }) {
  const p = usePlayer(), s = p.current, [back, setBack] = useState(false)
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  if (!s) return null
  const face = 'absolute inset-0 flex flex-col rounded-3xl border border-white/10 bg-zinc-950/95 p-6 shadow-glow [backface-visibility:hidden]'
  const i = p.queue.findIndex(x => x.id === s.id)
  const up = [...p.queue.slice(i + 1), ...p.queue.slice(0, Math.max(i, 0))].slice(0, 5)
  const rows: [string, string][] = [['Genre', s.genre ?? '—'], ['Released', String(new Date(s.created_at).getFullYear())],
    ['Length', s.duration ? fmt(s.duration) : '—'], ['Format', s.file_type.toUpperCase()], ['Plays', s.plays.toLocaleString()]]
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/85 backdrop-blur-md" onClick={onClose}>
      <div className="streak" style={streak('#16a34a', '12%')} /><div className="streak" style={streak('#FFD700', '40%')} /><div className="streak" style={streak('#dc2626', '66%')} />
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full border border-line bg-card px-4 py-2 text-sm">Close</button>
      <div className="np-float relative h-[min(72vh,560px)] w-[min(88vw,380px)] [perspective:1400px]" onClick={e => e.stopPropagation()}>
        <div className="h-full w-full transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: `rotateY(${back ? 180 : 0}deg)` }}>
          <div className={face}>
            <div className="absolute inset-x-0 top-0 flex h-1.5 overflow-hidden rounded-t-3xl"><i className="flex-1 bg-green-600" /><i className="flex-1 bg-gold" /><i className="flex-1 bg-red-600" /><i className="flex-1 bg-black" /></div>
            <span className="self-start rounded-full bg-gradient-to-r from-gold to-flame px-3 py-1 text-xs font-bold text-black">NOW PLAYING</span>
            <div className="spin-slow relative mx-auto mt-5 aspect-square w-3/4 overflow-hidden rounded-full bg-gradient-to-br from-gold to-flame ring-8 ring-black"
              style={{ animationPlayState: p.playing ? 'running' : 'paused' }}>
              {s.cover_url && <img src={s.cover_url} alt="" className="h-full w-full object-cover" />}
              <i className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg ring-2 ring-line" /></div>
            <h2 className="mt-5 truncate font-sora text-2xl font-extrabold text-white">{s.title}</h2>
            <p className="truncate text-zinc-400">{s.artist}</p>
            <input type="range" min={0} max={p.dur || 1} step={0.1} value={p.pos} onChange={e => p.seek(+e.target.value)} aria-label="Seek" className="mt-4 w-full accent-gold" />
            <div className="flex justify-between text-xs text-zinc-500"><span>{fmt(p.pos)}</span><span>{fmt(p.dur)}</span></div>
            <div className="mt-2 flex items-center justify-center gap-6">
              <button onClick={p.prev} aria-label="Previous"><Prev c="h-7 w-7" /></button>
              <button onClick={p.toggle} aria-label={p.playing ? 'Pause' : 'Play'} className="grid h-14 w-14 place-items-center rounded-full orb text-black">{p.playing ? <Pause c="h-7 w-7" /> : <Play c="h-7 w-7" />}</button>
              <button onClick={p.next} aria-label="Next"><Next c="h-7 w-7" /></button></div>
            <button onClick={() => setBack(true)} className="mt-auto pt-3 text-sm text-gold">Track info</button>
          </div>
          <div className={`${face} [transform:rotateY(180deg)]`}>
            <h3 className="font-sora text-xl font-bold text-white">Track info</h3>
            <dl className="mt-4 divide-y divide-line text-sm">{rows.map(([k, val]) => <div key={k} className="flex justify-between py-2"><dt className="text-zinc-400">{k}</dt><dd className="text-white">{val}</dd></div>)}</dl>
            <p className="mt-4 text-sm text-zinc-400">Up next</p>
            <ul className="mt-2 space-y-1 overflow-y-auto">{up.length === 0 && <li className="text-sm text-zinc-500">Nothing queued.</li>}
              {up.map((t, n) => <li key={t.id}><button onClick={() => p.play(t, p.queue)} className="flex w-full justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-card">
                <span className="truncate"><b className="mr-2 text-gold">{String(n + 1).padStart(2, '0')}</b>{t.title}</span><span className="text-zinc-500">{t.duration ? fmt(t.duration) : ''}</span></button></li>)}</ul>
            <div className="mt-auto flex justify-between pt-3 text-sm"><button onClick={() => setBack(false)} className="text-gold">Back</button>
              <Link to={`/song/${s.id}`} onClick={onClose} className="text-gold">Song page</Link></div>
          </div>
        </div>
      </div>
    </div>)
}
