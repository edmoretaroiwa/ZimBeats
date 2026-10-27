import { motionValue } from 'framer-motion'
export const gx = motionValue(0), gy = motionValue(0)
let on = false
export async function enableGyro() {
  if (on || !('DeviceOrientationEvent' in window)) return
  const D = DeviceOrientationEvent as any
  if (typeof D.requestPermission === 'function') { try { if ((await D.requestPermission()) !== 'granted') return } catch { return } }
  on = true
  addEventListener('deviceorientation', e => {
    gx.set(Math.max(-0.5, Math.min(0.5, (e.gamma ?? 0) / 45)))
    gy.set(Math.max(-0.5, Math.min(0.5, ((e.beta ?? 45) - 45) / 45))) })
}
