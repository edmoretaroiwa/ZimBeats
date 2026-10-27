import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { Song, supabase } from '../lib/supabase'
type Ctx = { current: Song | null; playing: boolean; pos: number; dur: number; vol: number
  play: (s: Song, q?: Song[]) => void; toggle: () => void; next: () => void; prev: () => void
  seek: (t: number) => void; setVol: (v: number) => void }
const C = createContext<Ctx>(null as unknown as Ctx)
export const usePlayer = () => useContext(C)
export function PlayerProvider({ children }: { children: ReactNode }) {
  const howl = useRef<Howl | null>(null), queue = useRef<Song[]>([]), nextRef = useRef<() => void>(() => {})
  const [current, setCurrent] = useState<Song | null>(null)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0), [dur, setDur] = useState(0), [vol, setVolState] = useState(0.8)
  const volRef = useRef(0.8)
  const load = useCallback((s: Song) => {
    howl.current?.unload()
    const h: Howl = new Howl({ src: [s.file_url], html5: true, volume: volRef.current,
      onplay: () => { setPlaying(true); setDur(h.duration() || s.duration || 0) },
      onload: () => setDur(h.duration() || s.duration || 0),
      onpause: () => setPlaying(false), onstop: () => setPlaying(false), onend: () => nextRef.current() })
    howl.current = h; setCurrent(s); setPos(0); setDur(s.duration || 0); h.play()
  }, [])
  const play = useCallback((s: Song, q?: Song[]) => {
    queue.current = q ?? [s]
    if (howl.current && current?.id === s.id) { howl.current.playing() ? howl.current.pause() : howl.current.play() } else load(s)
  }, [current, load])
  const step = (d: number) => { const q = queue.current; if (!q.length || !current) return
    const i = q.findIndex(x => x.id === current.id); load(q[(i + d + q.length) % q.length]) }
  const next = () => step(1)
  const prev = () => { if (pos > 3 && howl.current) { howl.current.seek(0); setPos(0) } else step(-1) }
  nextRef.current = next
  const toggle = () => { const h = howl.current; if (h) h.playing() ? h.pause() : h.play() }
  const seek = (t: number) => { howl.current?.seek(t); setPos(t) }
  const setVol = (v: number) => { volRef.current = v; setVolState(v); howl.current?.volume(v) }
  useEffect(() => { if (!playing) return
    const t = setInterval(() => setPos(Number(howl.current?.seek()) || 0), 250); return () => clearInterval(t) }, [playing])
  useEffect(() => { // count a play after 5 seconds of listening
    if (!playing || !current) return
    const id = current.id
    const t = setTimeout(() => { supabase.rpc('increment_plays', { song_id: id }) }, 5000)
    return () => clearTimeout(t) }, [playing, current])
  return <C.Provider value={{ current, playing, pos, dur, vol, play, toggle, next, prev, seek, setVol }}>{children}</C.Provider>
}
