import { useEffect, useRef } from 'react'
import * as THREE from 'three'
export default function Hero3D() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current!, still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); el.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100); cam.position.z = 9
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const gold = new THREE.PointLight(0xffd700, 70, 30); gold.position.set(3, 4, 6); scene.add(gold)
    const green = new THREE.PointLight(0x22c55e, 50, 30); green.position.set(-5, -2, 4); scene.add(green)
    const vinyl = (x: number, y: number, z: number, s: number, color: number) => {
      const outer = new THREE.Group(), spin = new THREE.Group(); outer.add(spin)
      spin.add(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.08, 64), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.25 })))
      for (let r = 0.6; r < 1.45; r += 0.12) { const g = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.015, 64), new THREE.MeshBasicMaterial({ color: 0x3a3a3a, side: THREE.DoubleSide }))
        g.rotation.x = -Math.PI / 2; g.position.y = 0.042; spin.add(g) }
      spin.add(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 48), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.45 })))
      outer.position.set(x, y, z); outer.scale.setScalar(s); outer.rotation.set(1.1, 0, 0.3); scene.add(outer); return { outer, spin, y } }
    const discs = [vinyl(3.4, 0.2, 0, 1.2, 0xffd700), vinyl(-3.6, -1.7, -1.5, 0.8, 0x16a34a), vinyl(0.5, 2.3, -4, 0.6, 0xff4500)]
    const n = 260, pos = new Float32Array(n * 3)
    for (let i = 0; i < n * 3; i++) pos[i] = (Math.random() - 0.5) * (i % 3 === 2 ? 10 : 18)
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffd700, size: 0.05, transparent: true, opacity: 0.7 })); scene.add(dust)
    const m = { x: 0, y: 0 }, onMove = (e: PointerEvent) => { m.x = e.clientX / innerWidth - 0.5; m.y = e.clientY / innerHeight - 0.5 }
    addEventListener('pointermove', onMove)
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h
      cam.updateProjectionMatrix(); scene.scale.setScalar(Math.min(1, (w / h) / 1.7)) }
    const ro = new ResizeObserver(resize); ro.observe(el); resize()
    let raf = 0
    const tick = (t: number) => { raf = requestAnimationFrame(tick); const k = t / 1000
      if (!still) discs.forEach((d, i) => { d.spin.rotation.y += 0.012 * (i % 2 ? -1 : 1); d.outer.position.y = d.y + Math.sin(k + i * 2) * 0.18 })
      scene.rotation.y += (m.x * 0.5 - scene.rotation.y) * 0.05; scene.rotation.x += (m.y * 0.3 - scene.rotation.x) * 0.05
      dust.rotation.y = still ? 0 : k * 0.02; renderer.render(scene, cam) }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('pointermove', onMove); renderer.dispose(); renderer.domElement.remove() }
  }, [])
  return <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden />
}
