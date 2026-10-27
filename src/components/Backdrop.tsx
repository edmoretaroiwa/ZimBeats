import { CSSProperties, useEffect } from 'react'
const v = (o: Record<string, string | number>) => o as CSSProperties
const streaks = [['#16a34a', 6, -0.08], ['#FFD700', 26, -0.15], ['#dc2626', 50, -0.22], ['#FF4500', 74, -0.12]] as const
const notes = [['♪', 6, 14, 30, -0.12], ['♫', 88, 24, 38, -0.3], ['♬', 16, 56, 26, -0.2], ['♪', 74, 66, 34, -0.35], ['♫', 46, 40, 24, -0.18], ['♬', 92, 86, 28, -0.25]] as const
export default function Backdrop() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let r = 0
    const on = () => { cancelAnimationFrame(r); r = requestAnimationFrame(() => document.documentElement.style.setProperty('--sy', String(scrollY))) }
    addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on)
  }, [])
  return (<div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    {streaks.map(([c, top, p]) => <div key={c} className="streak" style={v({ top: `${top}%`, background: c, '--p': p })} />)}
    {notes.map(([n, x, y, s, p], i) => <div key={i} className="note" style={v({ left: `${x}%`, top: `${y}%`, fontSize: s, '--p': p })}>
      <span style={{ animationDelay: `${i * 0.7}s` }}>{n}</span></div>)}
  </div>)
}
