import { FormEvent, useState } from 'react'
import { GENRES, supabase } from '../lib/supabase'
const ACCEPT = '.mp3,audio/mpeg' // later: '.mp3,.wav,.flac' and send wav/flac to the private `originals` bucket
const field = 'w-full rounded-xl border border-line bg-card px-4 py-3 outline-none focus:border-gold'
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const getDuration = (f: File) => new Promise<number>(res => { const a = new Audio(), u = URL.createObjectURL(f)
  a.preload = 'metadata'; a.onloadedmetadata = () => { res(Math.round(a.duration)); URL.revokeObjectURL(u) }
  a.onerror = () => res(0); a.src = u })
export default function UploadPage() {
  const [ok, setOk] = useState(sessionStorage.getItem('zb_admin') === '1'), [pw, setPw] = useState('')
  const [title, setTitle] = useState(''), [artist, setArtist] = useState(''), [genre, setGenre] = useState(GENRES[0])
  const [cover, setCover] = useState<File | null>(null), [audio, setAudio] = useState<File | null>(null)
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState('')
  if (!ok) return (<form className="mx-auto mt-10 max-w-sm space-y-4" onSubmit={e => { e.preventDefault()
    if (pw === import.meta.env.VITE_ADMIN_PASSWORD) { sessionStorage.setItem('zb_admin', '1'); setOk(true) } else setMsg('Wrong password') }}>
    <h1 className="font-sora text-2xl font-bold text-white">Upload access</h1>
    <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Admin password" className={field} />
    <button className="w-full rounded-xl bg-gold py-3 font-semibold text-black">Unlock</button>
    {msg && <p className="text-sm text-flame">{msg}</p>}</form>)
  const submit = async (e: FormEvent) => { e.preventDefault(); if (!audio) return
    const form = e.target as HTMLFormElement
    setBusy(true); setMsg('Uploading…')
    try { const stamp = `${Date.now()}-${slug(title)}`, ext = audio.name.split('.').pop()!.toLowerCase()
      const duration = await getDuration(audio); let cover_url: string | null = null
      if (cover) { const cp = `${stamp}.${cover.name.split('.').pop()}`
        const r = await supabase.storage.from('covers').upload(cp, cover); if (r.error) throw r.error
        cover_url = supabase.storage.from('covers').getPublicUrl(cp).data.publicUrl }
      const ap = `${stamp}.${ext}`, r = await supabase.storage.from('songs').upload(ap, audio, { contentType: audio.type || 'audio/mpeg' })
      if (r.error) throw r.error
      const file_url = supabase.storage.from('songs').getPublicUrl(ap).data.publicUrl
      const ins = await supabase.from('songs').insert({ title, artist, genre, cover_url, file_url, file_type: ext, file_size: audio.size, duration })
      if (ins.error) throw ins.error
      setMsg('Uploaded. The song is live on Home.'); setTitle(''); setArtist(''); setCover(null); setAudio(null); form.reset()
    } catch (err: any) { setMsg(`Upload failed: ${err.message ?? err}`) } setBusy(false) }
  return (<form onSubmit={submit} className="mx-auto max-w-lg space-y-4">
    <h1 className="font-sora text-2xl font-bold text-white">Upload a song</h1>
    <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className={field} />
    <input required value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artist" className={field} />
    <select value={genre} onChange={e => setGenre(e.target.value)} className={field}>{GENRES.map(g => <option key={g}>{g}</option>)}</select>
    <label className="block text-sm text-zinc-400">Cover image<input type="file" accept="image/*" onChange={e => setCover(e.target.files?.[0] ?? null)} className={`${field} mt-1`} /></label>
    <label className="block text-sm text-zinc-400">Audio file (MP3)<input required type="file" accept={ACCEPT} onChange={e => setAudio(e.target.files?.[0] ?? null)} className={`${field} mt-1`} /></label>
    <button disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-gold to-flame py-3 font-semibold text-black disabled:opacity-50">{busy ? 'Uploading…' : 'Publish song'}</button>
    {msg && <p className="text-sm text-zinc-300">{msg}</p>}</form>)
}
