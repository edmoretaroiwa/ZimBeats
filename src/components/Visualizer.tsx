import { motion } from 'framer-motion'
const dur = [0.9, 1.4, 1.1, 1.6, 1.0]
export default function Visualizer({ playing }: { playing: boolean }) {
  return (<div aria-hidden className="ml-2 flex h-6 shrink-0 items-end gap-[3px]" style={{ transform: 'perspective(200px) rotateX(12deg) rotateY(-22deg)', transformStyle: 'preserve-3d' }}>
    {dur.map((d, i) => <motion.i key={i} className="block h-full w-1 origin-bottom rounded-sm bg-gradient-to-t from-flame to-gold"
      style={{ boxShadow: '2px 0 0 #9a3b00, 0 -1px 0 #fff3a0' }}
      animate={playing ? { scaleY: [0.25, 1, 0.45, 0.85, 0.3] } : { scaleY: 0.15 }}
      transition={playing ? { duration: d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 } : { duration: 0.3 }} />)}</div>)
}
