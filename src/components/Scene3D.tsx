import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
const still = matchMedia('(prefers-reduced-motion: reduce)').matches
const small = matchMedia('(max-width: 768px)').matches
function Note({ p, s, sp, mat }: { p: [number, number, number]; s: number; sp: number; mat: THREE.Material }) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => { const t = clock.elapsedTime; if (!g.current) return
    g.current.rotation.y = t * sp; g.current.position.y = p[1] + Math.sin(t * sp + p[0]) * 0.4 })
  return (<group ref={g} position={p} scale={s}>
    <mesh material={mat}><sphereGeometry args={[0.28, 6, 5]} /></mesh>
    <mesh material={mat} position={[0.24, 0.6, 0]}><boxGeometry args={[0.07, 1.2, 0.07]} /></mesh>
    <mesh material={mat} position={[0.42, 1.15, 0]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.4, 0.1, 0.07]} /></mesh></group>)
}
function World() {
  const root = useRef<THREE.Group>(null), shards = useRef<THREE.Group>(null)
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 0.8, roughness: 0.35, flatShading: true }), [])
  const shardMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#FFD700', wireframe: true, transparent: true, opacity: 0.35 }), [])
  const notes = useMemo(() => Array.from({ length: small ? 8 : 14 }, () => ({
    p: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 9, -1 - Math.random() * 8] as [number, number, number],
    s: 0.35 + Math.random() * 0.35, sp: 0.2 + Math.random() * 0.4 })), [])
  const bits = useMemo(() => Array.from({ length: small ? 10 : 22 }, () => [(Math.random() - 0.5) * 18, (Math.random() - 0.5) * 10, -Math.random() * 9] as [number, number, number]), [])
  useFrame(({ clock }) => { if (still) return
    if (root.current) root.current.position.y = Math.min(scrollY, 1500) * 0.0025
    if (shards.current) shards.current.rotation.y = clock.elapsedTime * 0.04 })
  return (<>
    <fog attach="fog" args={['#0a0a0a', 8, 22]} />
    <ambientLight intensity={0.6} /><directionalLight position={[3, 4, 5]} intensity={2} color="#fff1b0" />
    <group ref={root}>
      {notes.map((n, i) => <Note key={i} {...n} mat={mat} />)}
      <group ref={shards}>{bits.map((p, i) => <mesh key={i} position={p} material={shardMat}><icosahedronGeometry args={[0.14, 0]} /></mesh>)}</group>
      <Sparkles count={small ? 25 : 50} scale={[18, 10, 8]} size={3} speed={0.3} color="#FFD700" opacity={0.6} />
    </group></>)
}
export default function Scene3D() {
  return (<div aria-hidden className="pointer-events-none fixed inset-0 -z-10"><div className="fog3d" />
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 50 }} frameloop={still ? 'demand' : 'always'}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}><World /></Canvas></div>)
}
