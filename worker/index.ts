// Serves crawler-friendly HTML (title, meta, JSON-LD, plain links) for / and /song/:id, plus /sitemap.xml
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
async function q(env: any, query: string): Promise<any[]> {
  try { const r = await fetch(`${env.SUPABASE_URL}/rest/v1/songs?${query}`, { headers: { apikey: env.SUPABASE_KEY } }); return r.ok ? await r.json() : [] } catch { return [] }
}
export default {
  async fetch(req: Request, env: any): Promise<Response> {
    const url = new URL(req.url), origin = url.origin
    if (url.pathname === '/sitemap.xml') {
      const songs = await q(env, 'select=id,created_at&order=created_at.desc&limit=1000')
      const urls = [`<url><loc>${origin}/</loc></url>`, ...songs.map(s => `<url><loc>${origin}/song/${s.id}</loc><lastmod>${new Date(s.created_at).toISOString()}</lastmod></url>`)]
      return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
        { headers: { 'content-type': 'application/xml', 'cache-control': 'public, max-age=3600' } })
    }
    const page = await env.ASSETS.fetch(new Request(origin + '/'))
    let title = 'ZimBeats – Stream and download Zimbabwe music'
    let desc = 'Stream and download the latest Zimbabwean music: Zimdancehall, HipHop, Afro, Sungura and Amapiano on ZimBeats.'
    let image = '', ld: any = null, body = '', type = 'website', status = 200
    const m = url.pathname.match(/^\/song\/([^/]+)$/)
    if (m) {
      const [s] = UUID.test(m[1]) ? await q(env, `id=eq.${m[1]}&select=*`) : []
      if (!s) status = 404
      else {
        title = `${s.title} by ${s.artist} – ZimBeats`; type = 'music.song'; image = s.cover_url ?? ''
        desc = `Listen to and download "${s.title}" by ${s.artist}${s.genre ? ` (${s.genre})` : ''} on ZimBeats, Zimbabwe's music site. ${s.plays ?? 0} plays.`
        ld = { '@context': 'https://schema.org', '@type': 'MusicRecording', name: s.title, url: origin + url.pathname,
          byArtist: { '@type': 'MusicGroup', name: s.artist }, genre: s.genre ?? undefined, image: image || undefined,
          datePublished: s.created_at, duration: s.duration ? `PT${Math.floor(s.duration / 60)}M${s.duration % 60}S` : undefined,
          audio: { '@type': 'AudioObject', contentUrl: s.file_url, encodingFormat: 'audio/mpeg' } }
        body = `<main><h1>${esc(s.title)}</h1><p>Artist: ${esc(s.artist)}</p><p>Genre: ${esc(s.genre ?? 'Zimbabwean music')}</p><p><a href="/">More Zimbabwe music on ZimBeats</a></p></main>`
      }
    } else if (url.pathname === '/') {
      const songs = await q(env, 'select=id,title,artist,genre&order=created_at.desc&limit=40')
      body = `<main><h1>ZimBeats – Zimbabwe music</h1><p>${esc(desc)}</p><ul>${songs.map(s =>
        `<li><a href="/song/${s.id}">${esc(s.title)} – ${esc(s.artist)}</a>${s.genre ? ` (${esc(s.genre)})` : ''}</li>`).join('')}</ul></main>`
    }
    const set = (name: string, v: string) => ({ element(e: any) { e.setAttribute(name, v) } })
    const canon = origin + (m ? url.pathname : '/')
    let rw = new HTMLRewriter()
      .on('title', { element(e: any) { e.setInnerContent(title) } })
      .on('meta[name="description"]', set('content', desc)).on('meta[property="og:description"]', set('content', desc))
      .on('meta[name="twitter:description"]', set('content', desc))
      .on('meta[property="og:title"]', set('content', title)).on('meta[name="twitter:title"]', set('content', title))
      .on('meta[property="og:type"]', set('content', type)).on('meta[property="og:url"]', set('content', canon))
      .on('link[rel="canonical"]', set('href', canon))
      .on('head', { element(e: any) {
        let h = ''
        if (image) h += `<meta property="og:image" content="${esc(image)}"><meta name="twitter:image" content="${esc(image)}">`
        if (ld) h += `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`
        if (status === 404) h += '<meta name="robots" content="noindex">'
        if (h) e.append(h, { html: true }) } })
      .on('div#root', { element(e: any) { if (body) e.append(body, { html: true }) } })
    return rw.transform(new Response(page.body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } }))
  } }
