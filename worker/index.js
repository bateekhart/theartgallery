/* ==========================================================
   the ART GALLERY — Cloudflare Worker in front of the static site.
   - http:// and www. → https://theartgallery.world (301)
   - exhibition / artist / project pages get their own <title>,
     description and share image (WhatsApp, Instagram, Google),
     read from the same data files the site uses
   - /sitemap.xml built from that data
   Everything else is served unchanged from the static assets.
   ========================================================== */
import './shim.js';
import '../assets/data.js';
import '../assets/works.js';

const SITE = 'https://theartgallery.world';
const EX = globalThis.EXHIBITIONS || [];
const WORKS = globalThis.WORKS || {};
const BIOS = globalThis.BIOS || {};
const PORTRAITS = globalThis.PORTRAITS || {};
const PROJECTS = globalThis.PROJECTS || [];
const BRAND = { en: 'the ART GALLERY', ar: 'ذا آرت جاليري' };

const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const L = (o, k, lang) => (lang === 'ar' && o[k + 'Ar']) || o[k] || '';
const clip = (s, n = 200) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);

// artists who appear in the A–Z index, with the shows they were in
const ARTISTS = new Map();
for (const e of EX) {
  if (e.index === false) continue;
  for (const name of e.artists) {
    if (!ARTISTS.has(slug(name))) ARTISTS.set(slug(name), { name, shows: [] });
    ARTISTS.get(slug(name)).shows.push(e);
  }
}
const firstWorkImage = name => {
  for (const rows of Object.values(WORKS)) for (const r of rows) if (r[0] === name && r[6] && r[6][0]) return `/assets/img/works/${r[6][0][0]}.jpg`;
  return '';
};

function lookup(lang, kind, q) {
  const brand = BRAND[lang];
  const base = SITE + (lang === 'ar' ? '/ar/' : '/');
  if (kind === 'exhibition') {
    const e = EX.find(x => x.id === q.get('id'));
    if (!e) return null;
    return { title: `${L(e, 'title', lang)} — ${brand}`, desc: clip(L(e, 'blurb', lang)), image: SITE + '/' + e.image, url: `${base}exhibition/?id=${e.id}` };
  }
  if (kind === 'artist') {
    const a = ARTISTS.get(q.get('a') || '');
    if (!a) return null;
    const shows = a.shows.map(s => L(s, 'title', lang)).join(', ');
    const desc = BIOS[a.name] || (lang === 'ar' ? `${a.name} — شارك في ${shows}` : `${a.name} — exhibited in ${shows}`);
    const img = PORTRAITS[a.name] ? `/assets/img/artists/${PORTRAITS[a.name]}.jpg` : firstWorkImage(a.name) || '/assets/img/hero-stairwell.jpg';
    return { title: `${a.name} — ${brand}`, desc: clip(desc), image: SITE + img, url: `${base}artist/?a=${slug(a.name)}` };
  }
  if (kind === 'project') {
    const p = PROJECTS.find(x => x.id === q.get('id'));
    if (!p) return null;
    return { title: `${L(p, 'title', lang)} — ${brand}`, desc: clip(L(p, 'blurb', lang)), image: `${SITE}/assets/img/projects/${p.id}/${p.image}.jpg`, url: `${base}project/?id=${p.id}` };
  }
  return null;
}

function sitemap() {
  const pages = ['', 'about/', 'exhibitions/', 'artworks/', 'artists/', 'space/', 'contact/', 'portfolio/'];
  const urls = [];
  for (const lang of ['', 'ar/']) {
    pages.forEach(p => urls.push(SITE + '/' + lang + p));
    EX.forEach(e => urls.push(`${SITE}/${lang}exhibition/?id=${e.id}`));
    PROJECTS.forEach(p => urls.push(`${SITE}/${lang}project/?id=${p.id}`));
  }
  for (const k of ARTISTS.keys()) urls.push(`${SITE}/artist/?a=${k}`);
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => `  <url><loc>${u.replace(/&/g, '&amp;')}</loc></url>`).join('\n') + '\n</urlset>\n';
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}

const set = (attr, val) => ({ element(el) { el.setAttribute(attr, val); } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.endsWith('theartgallery.world') && (url.protocol === 'http:' || url.hostname !== 'theartgallery.world')) {
      url.protocol = 'https:'; url.hostname = 'theartgallery.world'; url.port = '';
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === '/sitemap.xml') return sitemap();

    const res = await env.ASSETS.fetch(request);
    const m = url.pathname.match(/^\/(ar\/)?(exhibition|artist|project)\/(index\.html)?$/);
    if (!m || res.status !== 200 || !(res.headers.get('content-type') || '').includes('text/html')) return res;
    const meta = lookup(m[1] ? 'ar' : 'en', m[2], url.searchParams);
    if (!meta) return res;
    return new HTMLRewriter()
      .on('title', { element(el) { el.setInnerContent(meta.title); } })
      .on('meta[name="description"]', set('content', meta.desc))
      .on('meta[property="og:title"]', set('content', meta.title))
      .on('meta[property="og:description"]', set('content', meta.desc))
      .on('meta[property="og:image"]', set('content', meta.image))
      .on('meta[property="og:url"]', set('content', meta.url))
      .on('head', { element(el) { el.append(`<link rel="canonical" href="${meta.url}"><meta name="twitter:card" content="summary_large_image">`, { html: true }); } })
      .transform(res);
  }
};
