import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Song } from '../lib/supabase'
import { enableGyro, gx, gy } from '../lib/gyro'
import { usePlayer } from './PlayerContext'
import { Pause, Play } from './Icons'
export default function SongCard({ song, queue }: { song: Song; queue: Song[] }) {
  const p = usePlayer(), active = p.current?.id === song.id
  const mx = useMotionValue(0), my = useMotionValue(0), spring = { stiffness: 220, damping: 18 }
  const rotateY = useSpring(useTransform([mx, gx], ([a, b]: number[]) => (a + b) * 18), spring)
  const rotateX = useSpring(useTransform([my, gy], ([a, b]: number[]) => -(a + b) * 18), spring)
  const imgX = useTransform(rotateY, v => v * -0.8), imgY = useTransform(rotateX, v => v * 0.8)
  const move = (e: React.PointerEvent<HTMLDivElement>) => { if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5) }
  return (
    <motion.div onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0) }} onPointerDown={e => { if (e.pointerType === 'touch') enableGyro() }}
      style={{ rotateX, rotateY, transformPerspective: 900, boxShadow: '0 0 0 1px rgba(255,215,0,0), 0 0 0 rgba(0,0,0,0)' }}
      whileHover={{ scale: 1.05, y: -6, boxShadow: '0 0 0 1px #FFD700, 0 22px 40px -12px rgba(255,215,0,.5)' }}
      className="group transform-style-3d rounded-xl border border-line bg-card/80 p-3 backdrop-blur">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gold/80 to-flame shadow-xl [transform:translateZ(28px)]">
        {song.cover_url ? <motion.img src={song.cover_url} alt={song.title} loading="lazy" style={{ x: imgX, y: imgY, scale: 1.12 }} className="h-full w-full object-cover" />
          : <span className="grid h-full place-items-center font-sora text-5xl font-bold text-black/60">{song.title[0]}</span>}
        <button onClick={() => p.play(song, queue)} aria-label={`Play ${song.title}`}
          className={`orb absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full text-black transition
          ${active && p.playing ? 'opacity-100' : 'opacity-100 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'}`}>
          {active && p.playing ? <Pause /> : <Play />}</button>
      </div>
      <Link to={`/song/${song.id}`} className={`mt-3 block truncate text-sm font-semibold [transform:translateZ(14px)] ${active ? 'text-gold' : 'text-white'}`}>{song.title}</Link>
      <p className="truncate text-xs text-zinc-400">{song.artist}</p>
      <p className="mt-1 text-[11px] text-zinc-500">{song.plays.toLocaleString()} plays{song.genre ? ` · ${song.genre}` : ''}</p>
    </motion.div>)
}
