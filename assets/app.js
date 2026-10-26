/* ==========================================================
   the ART GALLERY — site script (no build step)
   Every page sets <body data-page="…" data-base="…" data-path="…">.
   data-base = path back to the site root (for assets),
   data-path = this page's path inside a language (for the EN/AR switch).
   Header, footer and the artwork viewer are rendered here so each
   page stays a small shell.
   ========================================================== */
(() => {
  const AR = document.documentElement.lang === 'ar';
  const B = document.body.dataset;
  const BASE = B.base || '';
  const PAGE = B.page || 'home';
  const ROOT = BASE + (AR ? 'ar/' : '');
  const OTHER = BASE + (AR ? '' : 'ar/');
  const EX = window.EXHIBITIONS || [];
  const WORKS = window.WORKS || {};
  const BIOS = window.BIOS || {};
  const PORTRAITS = window.PORTRAITS || {};
  const VIEWS = window.VIEWS || {};
  const SETS = window.SETS || {};
  const PROJECTS = window.PROJECTS || [];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(location.search);
  const BRAND = AR ? 'ذا آرت جاليري' : 'the ART GALLERY';

  // ---------- Strings
  const T = AR ? {
    home: 'الرئيسية', exhibitions: 'المعارض', artworks: 'الأعمال', artists: 'الفنانون', about: 'من نحن', work: 'تعاون معنا',
    notice: 'مساحتنا في الشيخ زايد مغلقة أمام الزوار للتجديد. التنسيق والتأجير متاحان.', noticeLink: 'تواصل معنا', noticeShort: 'مغلق للتجديد · التنسيق والتأجير متاحان',
    lang: 'English', langCode: 'en', menu: 'فتح القائمة', close: 'إغلاق', prev: 'السابق', next: 'التالي',
    no: 'رقم', hosted: 'استضافة', artist1: 'فنان', artistsN: 'فنانًا', work1: 'عمل', worksN: 'عملًا',
    all: 'الكل', search: 'ابحث بالفنان أو العنوان', searchArtists: 'ابحث عن فنان', noMatch: 'لا توجد نتائج.',
    viewEx: 'شاهد المعرض', seeAll: 'كل المعارض', seeWorks: 'كل الأعمال', open: 'افتح', exhibitedIn: 'شارك في',
    worksIn: 'الأعمال في المعرض', photosSoon: 'أعمال أخرى في المعرض', views: 'من المعرض', guest: 'فنانو هذا المعرض من برنامج Art Routes ولا يظهرون في فهرس فنانينا.',
    about1: 'نبذة', prevEx: 'المعرض السابق', nextEx: 'المعرض التالي', prevArtist: 'الفنان السابق', nextArtist: 'الفنان التالي',
    notFound: 'لم نجد هذه الصفحة.', backTo: 'العودة إلى', cm: 'سم', of: 'من', shown: 'معروضة', more: 'عرض المزيد',
    keyVisual: 'الهوية البصرية لمعرض', photoOf: 'صورة', portraitOf: 'صورة', curated: 'تنسيق', hostedLabel: 'معرض مستضاف',
    beyond: 'خارج الجاليري', email: 'البريد', instagram: 'إنستجرام', whatsapp: 'واتساب', rights: 'ذا آرت جاليري', view: 'عرض', slide: 'شريحة',
    pause: 'إيقاف', play: 'تشغيل', exhibition: 'المعرض', artist: 'الفنان', count: 'عدد', years: 'السنوات', space: 'شاهدها في مساحتك', byArtist: 'الأعمال حسب الفنان', skip: 'انتقل إلى المحتوى', bioEn: 'النبذة بالإنجليزية', trySpace: 'جرّبه على جدارك', tryLede: 'أضف صورة جدارك واختر عملًا لتراه بمقاسه الحقيقي، ثم اطلب شراءه من أي مكان في العالم.', tryBtn: 'جرّب الآن', projects: 'مشروعات التنسيق', projectsLede: 'خارج معارضنا، ننسّق الفن للمساحات السكنية والتجارية.', viewProject: 'شاهد المشروع', installed: 'ما تم تركيبه', piecesN: 'قطع', inProjects: 'في مشروعات التنسيق', photos: 'صور المشروع', place: 'المكان', setNote: 'صور من أعمال الفنان في المعرض'
  } : {
    home: 'Home', exhibitions: 'Exhibitions', artworks: 'Artworks', artists: 'Artists', about: 'About', work: 'Work with us',
    notice: 'Our Sheikh Zayed space is closed to visitors for renovation. Curation and rentals are open.', noticeLink: 'Get in touch', noticeShort: 'Closed for renovation · curation & rentals open',
    lang: 'عربي', langCode: 'ar', menu: 'Open menu', close: 'Close', prev: 'Previous', next: 'Next',
    no: 'No.', hosted: 'Hosted', artist1: 'artist', artistsN: 'artists', work1: 'artwork', worksN: 'artworks',
    all: 'All', search: 'Search by artist or title', searchArtists: 'Search artists', noMatch: 'Nothing matches that search.',
    viewEx: 'View exhibition', seeAll: 'All exhibitions', seeWorks: 'All artworks', open: 'Open', exhibitedIn: 'Exhibited in',
    worksIn: 'Works in the show', photosSoon: 'More works in the show', views: 'From the exhibition', guest: "This exhibition's artists come from Art Routes' programme and are not part of our artist index.",
    about1: 'About', prevEx: 'Previous exhibition', nextEx: 'Next exhibition', prevArtist: 'Previous artist', nextArtist: 'Next artist',
    notFound: "We couldn't find that page.", backTo: 'Back to', cm: 'cm', of: 'of', shown: 'shown', more: 'Show more',
    keyVisual: 'Key visual for', photoOf: 'Photo of', portraitOf: 'Portrait of', curated: 'Curated', hostedLabel: 'Hosted exhibition',
    beyond: 'Beyond the gallery', email: 'Email', instagram: 'Instagram', whatsapp: 'WhatsApp', rights: 'the ART GALLERY', view: 'View', slide: 'Slide',
    pause: 'Pause', play: 'Play', exhibition: 'Exhibition', artist: 'Artist', count: 'Count', years: 'Years', space: 'View in your space', byArtist: 'Works by artist', skip: 'Skip to content', bioEn: 'Biography in English', trySpace: 'See it on your wall', tryLede: 'Add a photo of your wall, pick a piece and see it at its real size, then request it from anywhere in the world.', tryBtn: 'Try it now', projects: 'Curation projects', projectsLede: 'Beyond our exhibitions, we curate art for residential and commercial spaces.', viewProject: 'View project', installed: 'What we installed', piecesN: 'pieces', inProjects: 'In our curation projects', photos: 'The space', place: 'Place', setNote: "Photos of the artist's works in the show"
  };

  // ---------- Helpers
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const num = n => AR ? Number(n).toLocaleString('ar-EG', { useGrouping: false }) : String(n);
  const pad = n => AR ? num(String(n).padStart(2, '0')).replace(/٬/g, '') : String(n).padStart(2, '0');
  const padAr = n => AR ? String(n).padStart(2, '0').replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n).padStart(2, '0');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const L = (e, k) => (AR && e[k + 'Ar']) || e[k] || '';
  const AR_FORMS = { artistsN: ['فنان', 'فنانان', 'فنانين', 'فنانًا'], worksN: ['عمل', 'عملان', 'أعمال', 'عملًا'] };
  const plural = (n, key) => {
    if (!AR) return `${num(n)} ${n === 1 ? T[key === 'artistsN' ? 'artist1' : 'work1'] : T[key]}`;
    const f = AR_FORMS[key]; const m = n % 100;
    if (n === 1) return f[0]; if (n === 2) return f[1];
    return `${num(n)} ${m >= 3 && m <= 10 ? f[2] : f[3]}`;
  };
  const label = e => e.no ? `${T.no} ${padAr(e.no)}` : T.hosted;
  // posters are shown whole; very tall ones sit inside a box at most 1.3× as tall as wide
  const poster = e => { const [w, h] = e.imageSize || [1, 1]; return { w, h, box: `${w} / ${Math.min(h, Math.round(w * 1.3))}`, tall: h > w * 1.3 }; };
  const url = {
    home: ROOT, about: ROOT + 'about/', exhibitions: ROOT + 'exhibitions/', artists: ROOT + 'artists/',
    ex: id => `${ROOT}exhibition/?id=${id}`, artist: name => `${ROOT}artist/?a=${slug(name)}`,
    artworks: id => ROOT + 'artworks/' + (id ? `?ex=${id}` : ''), work: ROOT + 'contact/',
    space: w => ROOT + 'space/' + (w ? `?w=${w.ex}.${w.i}` : ''),
    project: id => `${ROOT}project/?id=${id}`, portfolio: ROOT + 'portfolio/'
  };
  const img = (p, w) => BASE + p;
  const workSrc = (f, thumb) => `${BASE}assets/img/works/${thumb ? 't/' : ''}${f}.jpg`;
  const projSrc = (p, f, thumb) => `${BASE}assets/img/projects/${p.id}/${thumb ? 't/' : ''}${f}.jpg`;
  const projCard = p => `
    <a class="card proj-card" href="${url.project(p.id)}">
      <span class="img" style="aspect-ratio:4/3"><img src="${projSrc(p, p.image, true)}" alt="${esc(L(p, 'title'))}" loading="lazy"></span>
      <span class="info"><span class="no">${esc(L(p, 'kind')).split(' · ')[0]}</span><span class="year">${num(p.year)}</span></span>
      <span class="title">${esc(L(p, 'title'))}</span>
      <span class="meta">${esc(L(p, 'place'))}</span>
    </a>`;
  const viewSrc = (f, thumb) => `${BASE}assets/img/views/${thumb ? 't/' : ''}${f}.jpg`;
  const setSrc = (f, thumb) => `${BASE}assets/img/sets/${thumb ? 't/' : ''}${f}.jpg`;
  // a strip of photos of one artist's works in one show (pieces not told apart)
  const setStrip = (exId, name, withName) => {
    const list = (SETS[exId] || {})[name]; if (!list) return '';
    return `<div class="set reveal">
      ${withName ? `<h3 class="set-name"><a href="${url.artist(name)}" dir="ltr">${esc(name)}</a></h3>` : ''}
      <p class="set-note">${T.setNote}</p>
      <ul class="set-strip" data-set="${exId}|${esc(name)}">${list.map(([f, w, h], k) => `<li><button type="button" data-k="${k}" aria-label="${esc(T.view)} ${num(k + 1)}: ${esc(name)}"><img src="${setSrc(f, true)}" alt="${esc(name)}" loading="lazy" width="${w}" height="${h}"></button></li>`).join('')}</ul>
    </div>`;
  };
  document.addEventListener('click', ev => {
    const b = ev.target.closest('[data-set] [data-k]'); if (!b) return;
    const [exId, name] = b.closest('[data-set]').dataset.set.split('|');
    const e = exById[exId];
    lbOpen(SETS[exId][name].map(([f]) => ({ src: setSrc(f), alt: name,
      cap: `<a class="lb-artist" href="${url.artist(name)}" dir="ltr">${esc(name)}</a><span class="lb-meta">${T.setNote}</span>${e ? `<a class="lb-ex" href="${url.ex(e.id)}">${esc(L(e, 'title'))} · ${num(e.year)}</a>` : ''}` })), +b.dataset.k);
  });
  const portrait = name => PORTRAITS[name] ? `${BASE}assets/img/artists/${PORTRAITS[name]}.jpg` : '';
  const fmtSize = s => !s ? '' : /\d/.test(s) && !/cm|h\b/i.test(s) ? `${s.replace(/x/gi, '×')} ${T.cm}` : s.replace(/x/gi, '×');

  // ---------- Data model
  const exById = Object.fromEntries(EX.map(e => [e.id, e]));
  // a work belongs to an exhibition, or (WORKS key = project id) to a curation project
  const placeOf = w => { const e = exById[w.ex]; if (e) return { href: url.ex(e.id), title: L(e, 'title'), year: e.year };
    const p = PROJECTS.find(x => x.id === w.ex); return p ? { href: url.project(p.id), title: L(p, 'title'), year: p.year } : null; };
  const ALL = [];                        // every artwork
  for (const [exId, rows] of Object.entries(WORKS)) {
    rows.forEach((r, i) => ALL.push({
      ex: exId, i, artist: r[0], title: r[1], size: r[2], year: r[3], medium: r[4], notes: r[5],
      // a 4th value of 1 marks a photo of a whole set of frames (not usable at one piece's size)
      imgs: (r[6] || []).map(([f, w, h, set]) => ({ f, w, h, set: !!set }))
    }));
  }
  const chrono = EX.map((e, i) => ({ e, i }));
  const rank = w => exById[w.ex] ? EX.indexOf(exById[w.ex]) : EX.length;
  ALL.sort((a, b) => rank(b) - rank(a));
  const artists = new Map();
  EX.forEach(e => {
    if (e.index === false) return;
    e.artists.forEach(name => {
      if (!artists.has(name)) artists.set(name, { name, slug: slug(name), shows: [] });
      artists.get(name).shows.push(e);
    });
  });
  const artistList = [...artists.values()].sort((a, b) => a.name.localeCompare(b.name));
  const bySlug = new Map(artistList.map(a => [a.slug, a]));
  const worksOf = name => ALL.filter(w => w.artist === name);
  const countWorks = rows => rows.reduce((m, w) => m + (parseInt((String(w.notes).match(/(\d+) works/) || [])[1]) || 1), 0);
  const withImg = ALL.filter(w => w.imgs.length);
  const meta = w => [fmtSize(w.size), w.year, w.medium].filter(Boolean).map(esc).join(' · ');
  // real size in cm for wall pieces: two numbers (a third, if any, is a small depth)
  const dims = w => {
    if (!w.imgs.length || w.imgs[0].set || /\bh\b|variable/i.test(w.size)) return null;
    const n = (w.size.split('/')[0].match(/\d+(?:\.\d+)?/g) || []).map(Number);
    if (n.length < 2 || (n.length === 3 && n[2] > 6) || n.length > 3) return null;
    const [a, b] = n, im = w.imgs[0], r = im.w / im.h;
    return Math.abs(a / b - r) <= Math.abs(b / a - r) ? { w: a, h: b } : { w: b, h: a };
  };

  // ---------- Header & footer
  const navItems = [
    ['exhibitions', url.exhibitions], ['artworks', url.artworks()], ['artists', url.artists], ['about', url.about]
  ];
  // a small framed-picture icon for the View in your space call to action
  const FRAME_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="4.5" width="17" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 14.5l3.5-4 3 3 2-2 2.5 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 21h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const active = { exhibitions: ['exhibitions', 'exhibition', 'project'], artworks: ['artworks'], artists: ['artists', 'artist'], about: ['about'] };
  const header = $('#site-header');
  if (header) {
    header.className = 'site-header';
    const main = $('main');
    if (main && !main.id) main.id = 'main';
    header.innerHTML = `
      <a class="skip" href="#${main ? main.id : 'main'}">${T.skip}</a>
      <div class="h-strip">
        <div class="wrap">
          <p class="notice-full"><i class="dot" aria-hidden="true"></i>${T.notice} <a href="${url.work}">${T.noticeLink} <span aria-hidden="true">${AR ? '←' : '→'}</span></a></p>
          <a class="notice-short" href="${url.work}"><i class="dot" aria-hidden="true"></i>${T.noticeShort}</a>
          <a class="lang" href="${OTHER}${B.path || ''}${location.search}" hreflang="${T.langCode}" lang="${T.langCode}">${T.lang}</a>
        </div>
      </div>
      <div class="wrap h-main">
        <a class="brand" href="${url.home}" aria-label="the ART GALLERY, ${esc(T.home)}">
          <img class="logo" src="${BASE}assets/logo.png" alt="the ART GALLERY" width="900" height="288">
        </a>
        <nav class="nav" id="nav">
          <span class="nav-links">${navItems.map(([k, h]) => `<a href="${h}"${active[k].includes(PAGE) ? ' aria-current="page"' : ''}>${T[k]}</a>`).join('')}</span>
          <span class="nav-ctas">
            <a class="btn btn-quiet" href="${url.work}"${PAGE === 'contact' ? ' aria-current="page"' : ''}>${T.work}</a>
            <a class="btn btn-try" href="${url.space()}"${PAGE === 'space' ? ' aria-current="page"' : ''}>${FRAME_ICON}<span>${T.space}</span></a>
          </span>
        </nav>
        <button class="menu-toggle" type="button" aria-label="${T.menu}" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
      </div>`;
    const toggle = $('.menu-toggle', header);
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open);
    });
    $$('.nav a', header).forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', false);
    }));
    // hide on scroll down, show on scroll up
    let lastY = scrollY, ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        header.classList.toggle('is-hidden', y > lastY && y > 160 && !document.body.classList.contains('nav-open'));
        header.classList.toggle('is-scrolled', y > 8);
        lastY = y; ticking = false;
      });
    }, { passive: true });
  }
  const footer = $('#site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="wrap">
        <div class="f-top">
          <a class="brand" href="${url.home}" aria-label="the ART GALLERY, ${esc(T.home)}">
            <img class="logo" src="${BASE}assets/logo-light.png" alt="the ART GALLERY" width="900" height="288">
          </a>
          <p class="f-line">${AR ? 'أي مساحة. أي وسيط. أي حجم. <em>بتنسيق فني.</em>' : 'Any space. Any medium. Any scale. <em>Curated.</em>'}</p>
        </div>
        <div class="f-cols">
          <nav aria-label="${esc(T.home)}">${navItems.map(([k, h]) => `<a href="${h}">${T[k]}</a>`).join('')}<a href="${url.space()}">${T.space}</a><a href="${url.work}">${T.work}</a></nav>
          <nav aria-label="${esc(T.instagram)}">
            <a href="mailto:info@theartgallery.world" dir="ltr">info@theartgallery.world</a>
            <a href="https://www.instagram.com/theartgallery.world/">${T.instagram} · <bdi dir="ltr">@theartgallery.world</bdi></a>
            <a href="https://wa.me/theartgallery.world">${T.whatsapp} · <bdi dir="ltr">@theartgallery.world</bdi></a>
            <a href="https://linktr.ee/theartgallery_eg">Linktree</a>
            <a href="${OTHER}${B.path || ''}${location.search}" hreflang="${T.langCode}" lang="${T.langCode}">${T.lang}</a>
          </nav>
        </div>
        <p class="f-copy">© ${num(new Date().getFullYear())} ${T.rights} · theartgallery.world</p>
      </div>`;
  }

  // ---------- Artwork viewer (lightbox)
  const lb = document.createElement('dialog');
  lb.className = 'lightbox';
  lb.setAttribute('aria-label', T.artworks);
  lb.innerHTML = `
    <button class="lb-close" type="button" aria-label="${T.close}">×</button>
    <button class="lb-nav lb-prev" type="button" aria-label="${T.prev}"><span aria-hidden="true">${AR ? '→' : '←'}</span></button>
    <button class="lb-nav lb-next" type="button" aria-label="${T.next}"><span aria-hidden="true">${AR ? '←' : '→'}</span></button>
    <figure class="lb-fig"><div class="lb-stage"><img alt=""></div><figcaption class="lb-cap"></figcaption></figure>`;
  document.body.appendChild(lb);
  let lbList = [], lbAt = 0;
  const lbImg = $('img', lb), lbCap = $('.lb-cap', lb);
  function lbShow(i) {
    lbAt = (i + lbList.length) % lbList.length;
    const it = lbList[lbAt];
    lbImg.classList.remove('in');
    lbImg.onload = () => lbImg.classList.add('in');
    lbImg.src = it.src; lbImg.alt = it.alt || '';
    lbCap.innerHTML = it.cap + `<span class="lb-count">${num(lbAt + 1)} / ${num(lbList.length)}</span>`;
    $$('.lb-nav', lb).forEach(b => b.hidden = lbList.length < 2);
  }
  function lbOpen(list, i) {
    lbList = list; if (!list.length) return;
    lbShow(i);
    if (!lb.open) lb.showModal();
    document.body.classList.add('lb-open');
  }
  $('.lb-close', lb).addEventListener('click', () => lb.close());
  $('.lb-prev', lb).addEventListener('click', () => lbShow(lbAt - 1));
  $('.lb-next', lb).addEventListener('click', () => lbShow(lbAt + 1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) lb.close(); });
  lb.addEventListener('close', () => document.body.classList.remove('lb-open'));
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') lbShow(lbAt + (AR ? -1 : 1));
    if (e.key === 'ArrowLeft') lbShow(lbAt + (AR ? 1 : -1));
  });
  let tx = null;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) lbShow(lbAt + ((dx < 0) !== AR ? 1 : -1));
  });
  const workCap = (w, withArtist = true, withEx = true) => {
    const e = placeOf(w);
    return `${withArtist ? `<a class="lb-artist" href="${url.artist(w.artist)}" dir="ltr">${esc(w.artist)}</a>` : ''}
      <span class="lb-title" dir="auto">${esc(w.title)}</span>
      ${meta(w) ? `<span class="lb-meta" dir="auto">${meta(w)}</span>` : ''}
      ${withEx && e ? `<a class="lb-ex" href="${e.href}">${esc(e.title)} · ${num(e.year)}</a>` : ''}
      ${dims(w) ? `<a class="lb-space" href="${url.space(w)}">${T.space} <span aria-hidden="true">${AR ? '←' : '→'}</span></a>` : ''}`;
  };
  // flatten works into viewer slides (every photo of every work)
  const slidesFor = (works, opts = {}) => {
    const s = [];
    works.forEach(w => w.imgs.forEach(im => s.push({ src: workSrc(im.f), alt: `${w.title}, ${w.artist}`, cap: workCap(w, opts.artist !== false, opts.ex !== false), w })));
    return s;
  };

  // ---------- Artwork grid
  function workCard(w, k, opts = {}) {
    const e = placeOf(w);
    if (!w.imgs.length) {
      return `<li class="wcard is-text">
        <span class="wc-steps" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="wc-title" dir="auto">${esc(w.title)}</span>
        ${opts.artist !== false ? `<a class="wc-artist" href="${url.artist(w.artist)}" dir="ltr">${esc(w.artist)}</a>` : ''}
        <span class="wc-meta" dir="auto">${meta(w)}${w.notes ? ' · ' + esc(w.notes) : ''}</span>
        ${opts.ex !== false && e ? `<a class="wc-ex" href="${e.href}">${esc(e.title)}</a>` : ''}
      </li>`;
    }
    const im = w.imgs[0];
    return `<li class="wcard">
      <button class="wc-img" type="button" data-slide="${k}" style="aspect-ratio:${im.w}/${im.h}" aria-label="${esc(T.view)}: ${esc(w.title)}, ${esc(w.artist)}">
        <img src="${workSrc(im.f, true)}" alt="${esc(w.title)}, ${esc(w.artist)}" loading="lazy" width="${im.w}" height="${im.h}">
        ${w.imgs.length > 1 ? `<span class="wc-more">+${num(w.imgs.length - 1)}</span>` : ''}
      </button>
      <span class="wc-title" dir="auto">${esc(w.title)}</span>
      ${opts.artist !== false ? `<a class="wc-artist" href="${url.artist(w.artist)}" dir="ltr">${esc(w.artist)}</a>` : ''}
      <span class="wc-meta" dir="auto">${meta(w)}${w.notes ? ' · ' + esc(w.notes) : ''}</span>
      ${opts.ex !== false && e ? `<a class="wc-ex" href="${e.href}">${esc(e.title)}</a>` : ''}
    </li>`;
  }
  // render a works list into a <ul class="masonry">, paged for speed
  function renderWorks(ul, works, opts = {}) {
    const slides = slidesFor(works, opts);
    const firstSlide = []; let k = 0;
    works.forEach(w => { firstSlide.push(w.imgs.length ? k : -1); k += w.imgs.length; });
    const page = opts.page || 60; let shown = 0;
    ul.innerHTML = '';
    const more = opts.moreBtn;
    function next() {
      const chunk = works.slice(shown, shown + page);
      ul.insertAdjacentHTML('beforeend', chunk.map((w, j) => workCard(w, firstSlide[shown + j], opts)).join(''));
      shown += chunk.length;
      if (more) more.hidden = shown >= works.length;
      revealIn(ul);
    }
    if (more) more.onclick = next;
    ul.onclick = ev => {
      const b = ev.target.closest('[data-slide]'); if (!b) return;
      lbOpen(slides, +b.dataset.slide);
    };
    next();
  }

  // ---------- Reveal on scroll, count-up, parallax
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: .06, rootMargin: '0px 0px -4% 0px' });
  function revealIn(root = document) {
    $$('.reveal:not(.in), .wcard:not(.in)', root).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('in'); else io.observe(el);
    });
  }

  function countUp(el, to, suffix = '') {
    if (REDUCED) { el.textContent = num(to) + suffix; return; }
    const t0 = performance.now(), d = 1400;
    const step = t => {
      const p = Math.min(1, (t - t0) / d), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = num(v) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const counted = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; counted.unobserve(el);
    countUp(el, +el.dataset.to, el.dataset.suffix || '');
  }), { threshold: .4 });

  function parallax() {
    const els = $$('[data-parallax]'); if (!els.length || REDUCED) return;
    let ticking = false;
    const run = () => {
      els.forEach(el => {
        const r = el.getBoundingClientRect(), k = +el.dataset.parallax;
        const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = `translate3d(0, ${(c * k * 100).toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

  const totalWorks = countWorks(ALL);
  const stats = {
    exhibitions: EX.filter(e => e.no).length,
    artists: artistList.length,
    works: Math.floor(totalWorks / 50) * 50,
    years: new Date().getFullYear() - 2020
  };
  $$('[data-count]').forEach(el => {
    const k = el.dataset.count; if (!(k in stats)) return;
    el.dataset.to = stats[k]; el.textContent = num(stats[k]) + (el.dataset.suffix || '');
    if (el.dataset.animate !== undefined) { el.textContent = num(0); counted.observe(el); }
  });

  // ---------- Exhibition card (used by home carousel and exhibitions page)
  const exCard = (e, cls = 'card') => `
    <a class="${cls}" href="${url.ex(e.id)}">
      <span class="img${poster(e).tall ? ' is-tall' : ''}" style="aspect-ratio:${poster(e).box}"><img src="${img(e.image)}" alt="${esc(T.keyVisual)} ${esc(L(e, 'title'))}" loading="lazy" width="${poster(e).w}" height="${poster(e).h}"></span>
      <span class="info"><span class="no">${label(e)}</span><span class="year">${num(e.year)}</span></span>
      <span class="title">${esc(L(e, 'title'))}</span>
      <span class="meta">${esc(L(e, 'dates'))}${e.artists.length ? ' · ' + plural(e.artists.length, 'artistsN') : ''}</span>
    </a>`;

  // ======================================================
  //  Pages
  // ======================================================
  const pages = {};

  // ---------- Home
  pages.home = () => {
    // old shareable links → new pages
    const m = location.hash.match(/^#(ex|artist)-(.+)$/);
    if (m) location.replace(m[1] === 'ex' ? url.ex(m[2]) : `${ROOT}artist/?a=${m[2]}`);

    // marquee of artist names
    const mq = $('#marquee');
    if (mq) {
      const names = artistList.map(a => `<a href="${url.artist(a.name)}" dir="ltr">${esc(a.name)}</a><i aria-hidden="true"></i>`).join('');
      const quiet = names.replace(/<a /g, '<a tabindex="-1" ');
      mq.innerHTML = `<div class="mq-track">${quiet}</div><div class="mq-track" aria-hidden="true">${quiet}</div>`;
    }

    // exhibitions carousel
    const car = $('#carousel');
    if (car) {
      const list = [...EX].reverse();
      car.innerHTML = `
        <div class="car-track" tabindex="0" aria-roledescription="carousel" aria-label="${esc(T.exhibitions)}">
          ${list.map((e, i) => `
          <article class="slide" aria-roledescription="${esc(T.slide)}" aria-label="${num(i + 1)} ${esc(T.of)} ${num(list.length)}">
            <a class="slide-img" href="${url.ex(e.id)}" tabindex="-1" aria-hidden="true">
              <span class="slide-bg" style="background-image:url('${img(e.image)}')"></span>
              <img src="${img(e.image)}" alt="" ${i > 2 ? 'loading="lazy"' : ''} width="${poster(e).w}" height="${poster(e).h}">
            </a>
            <div class="slide-info">
              <p class="eyebrow"><span class="level">${label(e)}</span> ${esc(L(e, 'dates'))}</p>
              <h3><a href="${url.ex(e.id)}">${esc(L(e, 'title'))}</a></h3>
              <p class="slide-blurb">${esc(L(e, 'blurb'))}</p>
              <p class="slide-meta">${e.artists.length ? plural(e.artists.length, 'artistsN') : ''}${(WORKS[e.id] || []).length ? ' · ' + plural(countWorks(ALL.filter(w => w.ex === e.id)), 'worksN') : ''}</p>
              <a class="link-arrow" href="${url.ex(e.id)}">${T.viewEx} <span aria-hidden="true">${AR ? '←' : '→'}</span></a>
            </div>
          </article>`).join('')}
        </div>
        <div class="car-ctrl">
          <div class="car-dots" role="tablist">${list.map((e, i) => `<button type="button" role="tab" aria-label="${esc(L(e, 'title'))}" data-i="${i}"><i></i></button>`).join('')}</div>
          <div class="car-btns">
            <button class="car-play" type="button" aria-label="${T.pause}"><span class="i-pause" aria-hidden="true"></span></button>
            <button class="car-prev" type="button" aria-label="${T.prev}">${AR ? '→' : '←'}</button>
            <button class="car-next" type="button" aria-label="${T.next}">${AR ? '←' : '→'}</button>
          </div>
        </div>`;
      const track = $('.car-track', car), slides = $$('.slide', car), dots = $$('.car-dots button', car);
      let at = 0, timer = null, playing = !REDUCED;
      const DUR = 6000;
      const go = (i, smooth = true) => {
        at = (i + slides.length) % slides.length;
        const s = slides[at];
        track.scrollTo({ left: s.offsetLeft - track.offsetLeft - (AR ? 0 : 0), behavior: smooth && !REDUCED ? 'smooth' : 'auto' });
        mark();
      };
      const mark = () => {
        dots.forEach((d, i) => { d.setAttribute('aria-selected', i === at); d.classList.remove('run'); });
        if (playing) { void dots[at].offsetWidth; dots[at].classList.add('run'); }
        slides.forEach((s, i) => s.classList.toggle('is-active', i === at));
      };
      const play = () => { clearInterval(timer); if (playing) timer = setInterval(() => go(at + 1), DUR); mark(); };
      const setPlaying = p => {
        playing = p; const b = $('.car-play', car);
        b.setAttribute('aria-label', p ? T.pause : T.play); b.firstElementChild.className = p ? 'i-pause' : 'i-play';
        play();
      };
      $('.car-prev', car).onclick = () => { go(at - 1); play(); };
      $('.car-next', car).onclick = () => { go(at + 1); play(); };
      $('.car-play', car).onclick = () => setPlaying(!playing);
      dots.forEach(d => d.onclick = () => { go(+d.dataset.i); play(); });
      // follow manual swipes / scrolls
      let st;
      track.addEventListener('scroll', () => {
        clearTimeout(st);
        st = setTimeout(() => {
          const x = Math.abs(track.scrollLeft);
          let best = 0, bd = Infinity;
          slides.forEach((s, i) => { const d = Math.abs(Math.abs(s.offsetLeft - track.offsetLeft) - x); if (d < bd) { bd = d; best = i; } });
          if (best !== at) { at = best; mark(); }
        }, 90);
      }, { passive: true });
      track.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { go(at + (AR ? -1 : 1)); play(); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { go(at + (AR ? 1 : -1)); play(); e.preventDefault(); }
      });
      ['mouseenter', 'focusin', 'touchstart'].forEach(ev => car.addEventListener(ev, () => clearInterval(timer), { passive: true }));
      ['mouseleave', 'focusout'].forEach(ev => car.addEventListener(ev, () => play()));
      // pause when off-screen
      new IntersectionObserver(([en]) => { if (en.isIntersecting) play(); else clearInterval(timer); }).observe(car);
      setPlaying(playing);
    }

    // featured artworks: a different selection every day
    const feat = $('#featured');
    if (feat) {
      const day = Math.floor(Date.now() / 864e5);
      const pool = withImg.filter(w => w.imgs[0].h / w.imgs[0].w < 1.6);
      const pick = []; const seen = new Set();
      for (let i = 0; pick.length < 10 && i < pool.length * 3; i++) {
        const w = pool[(day * 7919 + i * 104729) % pool.length];
        if (seen.has(w.artist)) continue; seen.add(w.artist); pick.push(w);
      }
      const slides = slidesFor(pick);
      let k = 0;
      feat.innerHTML = pick.map(w => {
        const im = w.imgs[0], s = k; k += w.imgs.length;
        return `<li><button type="button" data-slide="${s}" aria-label="${esc(T.view)}: ${esc(w.title)}, ${esc(w.artist)}">
          <img src="${workSrc(im.f, true)}" alt="${esc(w.title)}, ${esc(w.artist)}" loading="lazy" width="${im.w}" height="${im.h}"></button>
          <span class="fw-title" dir="auto">${esc(w.title)}</span><a class="fw-artist" href="${url.artist(w.artist)}" dir="ltr">${esc(w.artist)}</a></li>`;
      }).join('');
      feat.onclick = ev => { const b = ev.target.closest('[data-slide]'); if (b) lbOpen(slides, +b.dataset.slide); };
    }
    parallax();
  };

  // ---------- About
  pages.about = () => {
    const tl = $('#timeline');
    if (tl) {
      const rows = [{ y: 2020, items: [{ t: AR ? 'تأسيس ذا آرت جاليري على يد رانا خليل' : 'Rana Khalil founds the ART GALLERY' }] }];
      EX.forEach(e => {
        let r = rows.find(x => x.y === e.year); if (!r) rows.push(r = { y: e.year, items: [] });
        r.items.push({ e });
      });
      PROJECTS.forEach(p => {
        let r = rows.find(x => x.y === p.year); if (!r) rows.push(r = { y: p.year, items: [] });
        r.items.push({ p });
      });
      tl.innerHTML = rows.map(r => `
        <li class="reveal"><span class="tl-year">${num(r.y)}</span>
          <ul>${r.items.map(it => it.p
            ? `<li><a href="${url.project(it.p.id)}"><span class="tl-no">${T.projects.split(' ')[0]}</span> ${esc(L(it.p, 'title'))}</a> <span class="tl-tag">${esc(L(it.p, 'place')).split('،')[0].split(',').slice(-2)[0].trim()}</span></li>`
            : it.e
            ? `<li><a href="${url.ex(it.e.id)}"><span class="tl-no">${label(it.e)}</span> ${esc(L(it.e, 'title'))}</a>${it.e.beyond ? ` <span class="tl-tag">${T.beyond}</span>` : ''}</li>`
            : `<li class="tl-note">${esc(it.t)}</li>`).join('')}</ul>
        </li>`).join('');
    }
    const own = $('#founder-works');
    if (own) renderWorks(own, worksOf('Rana Khalil'), { artist: false, page: 24 });
    parallax();
  };

  // ---------- Exhibitions
  pages.exhibitions = () => {
    const root = $('#ex-list');
    const years = [...new Set(EX.map(e => e.year))].sort((a, b) => b - a);
    root.innerHTML = years.map(y => `
      <section class="year-group">
        <h2 class="year-label reveal"><span>${num(y)}</span></h2>
        <div class="archive">${EX.filter(e => e.year === y).reverse().map(e => exCard(e, 'card reveal')).join('')}</div>
      </section>`).join('') + (PROJECTS.length ? `
      <section class="year-group projects-group" id="projects">
        <h2 class="year-label reveal"><span>${T.projects}</span></h2>
        <div>
          <p class="section-lede reveal" style="margin-bottom:24px">${T.projectsLede}</p>
          <div class="archive">${PROJECTS.map(p => projCard(p).replace('class="card proj-card"', 'class="card proj-card reveal"')).join('')}</div>
        </div>
      </section>` : '');
    revealIn(root);
  };

  // ---------- Single exhibition
  pages.exhibition = () => {
    const e = exById[params.get('id')];
    const main = $('#main');
    if (!e) return notFound(main, url.exhibitions, T.exhibitions);
    const i = EX.indexOf(e), prev = EX[i - 1], next = EX[i + 1];
    document.title = `${L(e, 'title')} — ${BRAND}`;
    setMeta(L(e, 'blurb'), img(e.image));
    const works = ALL.filter(w => w.ex === e.id);
    const shown = works.filter(w => w.imgs.length), text = works.filter(w => !w.imgs.length);
    const names = [...e.artists].sort((a, b) => a.localeCompare(b));
    const views = VIEWS[e.id] || [];
    main.innerHTML = `
      <section class="ex-hero">
        <div class="wrap">
          <div class="ex-hero-img reveal"><img src="${img(e.image)}" alt="${esc(T.keyVisual)} ${esc(L(e, 'title'))}" width="${poster(e).w}" height="${poster(e).h}"></div>
          <div class="ex-hero-info reveal">
            <a class="crumb" href="${url.exhibitions}">${AR ? '→' : '←'} ${T.exhibitions}</a>
            <p class="eyebrow"><span class="level">${label(e)}</span> ${esc(L(e, 'dates'))}</p>
            <h1 class="display">${esc(L(e, 'title'))}</h1>
            ${AR ? (e.title !== e.titleAr ? `<p class="alt-title" dir="ltr">${esc(e.title)}</p>` : '') : (e.titleAr ? `<p class="alt-title" lang="ar" dir="rtl">${esc(e.titleAr)}</p>` : '')}
            <p class="ex-blurb">${esc(L(e, 'blurb'))}</p>
            <dl class="ex-facts">
              <div><dt>${AR ? 'المكان' : 'Venue'}</dt><dd>${esc(L(e, 'venue'))}</dd></div>
              ${e.curators ? `<div><dt>${T.curated}</dt><dd>${esc(L(e, 'curators')).replace(/^(Curated by|تنسيق)\s*/, '')}</dd></div>` : ''}
              ${e.partner ? `<div><dt>${AR ? 'بالتعاون' : 'With'}</dt><dd>${esc(L(e, 'partner'))}</dd></div>` : ''}
              <div><dt>${T.artists}</dt><dd>${names.length ? num(names.length) : '—'}</dd></div>
              ${works.length ? `<div><dt>${T.artworks}</dt><dd>${num(countWorks(works))}</dd></div>` : ''}
            </dl>
          </div>
        </div>
      </section>

      ${shown.length ? `
      <section class="section tight">
        <div class="wrap">
          <div class="bar reveal">
            <h2 class="h-sec">${T.worksIn}</h2>
          </div>
          <ul class="masonry" id="ex-works"></ul>
        </div>
      </section>` : ''}

      ${SETS[e.id] ? `
      <section class="section tight">
        <div class="wrap">
          <h2 class="h-sec reveal">${T.byArtist}</h2>
          <div class="sets">${names.filter(n => SETS[e.id][n]).map(n => setStrip(e.id, n, true)).join('')}</div>
        </div>
      </section>` : ''}

      ${views.length ? `
      <section class="section tight on-dark">
        <div class="wrap">
          <h2 class="h-sec reveal">${T.views}</h2>
          <ul class="views" id="views">${views.map(([f, w, h], k) => `<li class="reveal"><button type="button" data-v="${k}" aria-label="${esc(T.view)} ${num(k + 1)}"><img src="${viewSrc(f, true)}" alt="${esc(T.views)}: ${esc(L(e, 'title'))}" loading="lazy" width="${w}" height="${h}"></button></li>`).join('')}</ul>
        </div>
      </section>` : ''}

      <section class="section tight">
        <div class="wrap">
          <h2 class="h-sec reveal">${T.artists} ${names.length ? `<span>${plural(names.length, 'artistsN')}</span>` : ''}</h2>
          ${!names.length ? `<p class="note">${esc(L(e, 'artistsNote'))}</p>`
            : e.index === false ? `<p class="note">${esc(T.guest)}</p><ul class="name-cloud">${names.map(n => `<li dir="ltr">${esc(n)}</li>`).join('')}</ul>`
            : `<ul class="name-cloud links">${names.map(n => `<li><a href="${url.artist(n)}" dir="ltr">${esc(n)}</a></li>`).join('')}</ul>`}
          ${text.length ? `
          <details class="more-works reveal">
            <summary>${T.photosSoon} <span>${num(text.length)}</span></summary>
            <ul class="tlist">${text.map(w => `<li><a href="${url.artist(w.artist)}" dir="ltr">${esc(w.artist)}</a><span class="t" dir="auto">${esc(w.title)}</span><span class="m" dir="auto">${meta(w)}${w.notes ? ' · ' + esc(w.notes) : ''}</span></li>`).join('')}</ul>
          </details>` : ''}
        </div>
      </section>

      <nav class="pager" aria-label="${T.exhibitions}">
        <div class="wrap">
          ${prev ? `<a class="pg prev" href="${url.ex(prev.id)}"><span class="pg-k">${T.prevEx}</span><span class="pg-t">${esc(L(prev, 'title'))}</span></a>` : '<span></span>'}
          ${next ? `<a class="pg next" href="${url.ex(next.id)}"><span class="pg-k">${T.nextEx}</span><span class="pg-t">${esc(L(next, 'title'))}</span></a>` : '<span></span>'}
        </div>
      </nav>`;
    // one card per artist; it opens every photographed piece the artist showed here
    const ul = $('#ex-works');
    if (ul) {
      const groups = [...new Set(shown.map(w => w.artist))].sort((a, b) => a.localeCompare(b))
        .map(name => ({ name, list: shown.filter(w => w.artist === name), n: countWorks(works.filter(w => w.artist === name)) }));
      ul.innerHTML = groups.map((g, k) => {
        const im = g.list[0].imgs[0], more = g.list.reduce((m, w) => m + w.imgs.length, 0) - 1;
        return `<li class="wcard">
          <button class="wc-img" type="button" data-group="${k}" style="aspect-ratio:${im.w}/${im.h}" aria-label="${esc(T.view)}: ${esc(g.name)}">
            <img src="${workSrc(im.f, true)}" alt="${esc(g.list[0].title)}, ${esc(g.name)}" loading="lazy" width="${im.w}" height="${im.h}">
            ${more > 0 ? `<span class="wc-more">+${num(more)}</span>` : ''}
          </button>
          <a class="wc-title wc-name" href="${url.artist(g.name)}" dir="ltr">${esc(g.name)}</a>
          <span class="wc-meta">${plural(g.n, 'worksN')}</span>
        </li>`;
      }).join('');
      ul.onclick = ev => {
        const b = ev.target.closest('[data-group]'); if (!b) return;
        lbOpen(slidesFor(groups[+b.dataset.group].list, { ex: false }), 0);
      };
      revealIn(ul);
    }
    const vl = $('#views');
    if (vl) {
      const vs = views.map(([f]) => ({ src: viewSrc(f), alt: L(e, 'title'), cap: `<span class="lb-title">${esc(L(e, 'title'))}</span><span class="lb-meta">${esc(L(e, 'venue'))}</span>` }));
      vl.onclick = ev => { const b = ev.target.closest('[data-v]'); if (b) lbOpen(vs, +b.dataset.v); };
    }
    revealIn(main); parallax();
  };

  // ---------- All artworks
  pages.artworks = () => {
    const chips = $('#chips'), ul = $('#works'), q = $('#q'), count = $('#works-count'), empty = $('#works-empty');
    const exs = [...EX].reverse().filter(e => ALL.some(w => w.ex === e.id));
    let cur = params.get('ex') && exById[params.get('ex')] ? params.get('ex') : '';
    chips.innerHTML = `<button type="button" data-ex="">${T.all}</button>` +
      exs.map(e => `<button type="button" data-ex="${e.id}">${esc(L(e, 'title'))} <span>${num(ALL.filter(w => w.ex === e.id).length)}</span></button>`).join('');
    const draw = () => {
      $$('button', chips).forEach(b => b.setAttribute('aria-pressed', b.dataset.ex === cur));
      const s = q.value.trim().toLowerCase();
      let list = cur ? ALL.filter(w => w.ex === cur) : ALL;
      // photos first; text-only records after
      list = [...list.filter(w => w.imgs.length), ...list.filter(w => !w.imgs.length)];
      if (s) list = list.filter(w => (w.artist + ' ' + w.title + ' ' + w.medium).toLowerCase().includes(s));
      count.textContent = plural(countWorks(list), 'worksN');
      empty.hidden = list.length > 0;
      renderWorks(ul, list, { ex: !cur, page: 48, moreBtn: $('#more') });
      const e = exById[cur];
      $('#ex-note').innerHTML = e ? `<a class="link-arrow" href="${url.ex(e.id)}">${T.viewEx}: ${esc(L(e, 'title'))} <span aria-hidden="true">${AR ? '←' : '→'}</span></a>` : '';
    };
    chips.onclick = ev => {
      const b = ev.target.closest('button'); if (!b) return;
      cur = b.dataset.ex; history.replaceState(null, '', cur ? `?ex=${cur}` : location.pathname);
      draw();
      if (b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: REDUCED ? 'auto' : 'smooth' });
    };
    let t; q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(draw, 120); });
    draw();
    const on = $('[aria-pressed="true"]', chips);
    if (on && cur) chips.scrollLeft += on.getBoundingClientRect().left - chips.getBoundingClientRect().left - 40 * (AR ? -1 : 1) - (AR ? chips.clientWidth - on.offsetWidth : 0);
    // keep loading as you scroll
    const more = $('#more');
    new IntersectionObserver(([en]) => { if (en.isIntersecting && !more.hidden) more.click(); }, { rootMargin: '600px' }).observe(more);
  };

  // ---------- Artists index
  pages.artists = () => {
    const az = $('#az'), q = $('#artist-search'), empty = $('#artist-empty');
    const groups = {};
    artistList.forEach(a => { const k = a.name[0].toUpperCase(); (groups[k] = groups[k] || []).push(a); });
    $('#az-letters').innerHTML = Object.keys(groups).sort().map(k => `<a href="#l-${k}">${k}</a>`).join('');
    az.innerHTML = Object.keys(groups).sort().map(k => `
      <div class="az-group" id="l-${k}">
        <h2 class="az-letter">${k}</h2>
        <ul>${groups[k].map(a => {
          const p = portrait(a.name) || (worksOf(a.name).find(w => w.imgs.length) ? workSrc(worksOf(a.name).find(w => w.imgs.length).imgs[0].f, true) : '');
          return `<li data-name="${esc(a.name.toLowerCase())}">
            <a class="aname" href="${url.artist(a.name)}" dir="ltr" ${p ? `data-preview="${p}"` : ''}>${esc(a.name)}</a>
            <span class="ashows">${a.shows.map(s => `<a href="${url.ex(s.id)}" title="${esc(L(s, 'title'))}">${s.no ? padAr(s.no) : '·'}</a>`).join('')}</span>
          </li>`;
        }).join('')}</ul>
      </div>`).join('');
    q.addEventListener('input', () => {
      const s = q.value.trim().toLowerCase(); let n = 0;
      $$('.az-group', az).forEach(g => {
        let any = false;
        $$('li', g).forEach(li => { const hit = !s || li.dataset.name.includes(s); li.hidden = !hit; if (hit) { any = true; n++; } });
        g.hidden = !any;
      });
      empty.hidden = n > 0;
    });
    // floating preview that follows the cursor (pointer devices only)
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const pv = document.createElement('div'); pv.className = 'preview'; pv.innerHTML = '<img alt="">';
      document.body.appendChild(pv);
      const pimg = $('img', pv); let raf;
      az.addEventListener('mouseover', ev => {
        const a = ev.target.closest('[data-preview]');
        if (!a) { pv.classList.remove('on'); return; }
        if (pimg.getAttribute('src') !== a.dataset.preview) pimg.src = a.dataset.preview;
        pv.classList.add('on');
      });
      az.addEventListener('mouseleave', () => pv.classList.remove('on'));
      addEventListener('mousemove', ev => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { pv.style.transform = `translate3d(${ev.clientX + 24}px, ${ev.clientY - 90}px, 0)`; });
      }, { passive: true });
    }
  };

  // ---------- Single artist
  pages.artist = () => {
    const a = bySlug.get(params.get('a'));
    const main = $('#main');
    if (!a) return notFound(main, url.artists, T.artists);
    const i = artistList.indexOf(a), prev = artistList[i - 1], next = artistList[i + 1];
    document.title = `${a.name} — ${BRAND}`;
    const works = worksOf(a.name);
    const p = portrait(a.name);
    const cover = p || (works.find(w => w.imgs.length) ? workSrc(works.find(w => w.imgs.length).imgs[0].f) : '');
    setMeta(BIOS[a.name] || `${a.name} — ${T.exhibitedIn} ${a.shows.map(s => L(s, 'title')).join(', ')}`, cover);
    const shows = [...a.shows].reverse();
    main.innerHTML = `
      <section class="artist-hero">
        <div class="wrap">
          ${p ? `<figure class="a-portrait reveal"><img src="${p}" alt="${esc(T.portraitOf)} ${esc(a.name)}" onload="if(this.naturalWidth<300)this.parentNode.classList.add('is-small')"></figure>` : ''}
          <div class="a-info reveal">
            <a class="crumb" href="${url.artists}">${AR ? '→' : '←'} ${T.artists}</a>
            <h1 class="display" dir="ltr">${esc(a.name)}</h1>
            ${BIOS[a.name] ? `${AR ? `<p class="bio-note">${T.bioEn}</p>` : ''}<p class="bio" dir="ltr" lang="en">${esc(BIOS[a.name])}</p>` : ''}
            ${a.name === 'Rana Khalil' ? `<p><a class="btn btn-try pf-cta" href="${url.portfolio}">${AR ? 'شاهد ملف أعمالها الكامل' : 'See her full portfolio'} <span class="arrow" aria-hidden="true">${AR ? '←' : '→'}</span></a></p>` : ''}
            <p class="eyebrow">${T.exhibitedIn}</p>
            <ul class="show-chips">${shows.map(s => `<li><a href="${url.ex(s.id)}"><span class="no">${label(s)}</span> ${esc(L(s, 'title'))} <span class="y">${num(s.year)}</span></a></li>`).join('')}</ul>
            ${PROJECTS.some(p => p.works.some(w => w.artist === a.name)) ? `<p class="eyebrow" style="margin-top:22px">${T.inProjects}</p>
            <ul class="show-chips">${PROJECTS.filter(p => p.works.some(w => w.artist === a.name)).map(p => `<li><a href="${url.project(p.id)}">${esc(L(p, 'title'))} <span class="y">${num(p.year)}</span></a></li>`).join('')}</ul>` : ''}
          </div>
        </div>
      </section>
      ${shows.map(s => {
        const ws = works.filter(w => w.ex === s.id);
        if (!ws.length) return '';
        return `<section class="section tight artist-show">
          <div class="wrap">
            <div class="bar reveal"><h2 class="h-sec"><a href="${url.ex(s.id)}">${esc(L(s, 'title'))}</a> <span>${esc(L(s, 'dates'))}</span></h2></div>
            ${setStrip(s.id, a.name, false)}
            <ul class="masonry" data-ex="${s.id}"></ul>
          </div>
        </section>`;
      }).join('')}
      ${PROJECTS.filter(p => works.some(w => w.ex === p.id)).map(p => `<section class="section tight artist-show">
          <div class="wrap">
            <div class="bar reveal"><h2 class="h-sec"><a href="${url.project(p.id)}">${esc(L(p, 'title'))}</a> <span>${esc(L(p, 'dates'))}</span></h2></div>
            <ul class="masonry" data-ex="${p.id}"></ul>
          </div>
        </section>`).join('')}
      <nav class="pager" aria-label="${T.artists}">
        <div class="wrap">
          ${prev ? `<a class="pg prev" href="${url.artist(prev.name)}"><span class="pg-k">${T.prevArtist}</span><span class="pg-t" dir="ltr">${esc(prev.name)}</span></a>` : '<span></span>'}
          ${next ? `<a class="pg next" href="${url.artist(next.name)}"><span class="pg-k">${T.nextArtist}</span><span class="pg-t" dir="ltr">${esc(next.name)}</span></a>` : '<span></span>'}
        </div>
      </nav>`;
    $$('.masonry[data-ex]', main).forEach(ul => renderWorks(ul, works.filter(w => w.ex === ul.dataset.ex), { artist: false, ex: false, page: 200 }));
    revealIn(main);
  };

  // ---------- View in your space
  // Everything happens in the visitor's browser: the room photo is never uploaded.
  // Coordinates are kept in room-image pixels; pxPerCm comes from the orange
  // measuring line the visitor lays over something of known size.
  pages.space = () => {
    const S = AR ? {
      sample: 'غرفة تجريبية', upload: 'أضف صورة جدارك', change: 'غيّر الصورة',
      lineIs: 'طول الخط البرتقالي', cm: 'سم', adjust: 'اضبط الخط', done: 'تم',
      wallIs: 'عرض الصورة يقارب', m: 'م', pick: 'اختر عملًا', allEx: 'كل المعارض', search: 'ابحث بالفنان أو العنوان',
      width: 'العرض', height: 'الارتفاع', swap: 'تبديل', frame: 'إطار', none: 'بدون',
      mat: 'حافة بيضاء (Passe-partout)', light: 'الإضاءة', download: 'حمّل الصورة', share: 'شارك', request: 'اطلب الشراء',
      name: 'الاسم', country: 'الدولة والمدينة', notes: 'ملاحظات (اختياري)', send: 'أرسل الطلب بالبريد',
      avail: 'اسأل عن التوفر', reqNote: 'نؤكد السعر والتوفر والشحن إلى أي مكان في العالم عبر البريد. أرفق الصورة التي حمّلتها لنرى مساحتك.',
      choose: 'اختر عملًا من القائمة', drag: 'اسحب العمل لتحريكه', measureHint: 'اسحب طرفي الخط البرتقالي فوق شيء تعرف مقاسه، ثم اكتب طوله.',
      tips: 'أمثلة: باب ≈ ٨٠–٩٠ سم عرضًا و٢٠٠ سم ارتفاعًا، ورقة A4 = ٢٩٫٧ سم، مفتاح كهرباء ≈ ٨ سم.',
      subject: 'طلب شراء', hello: 'مرحبًا، أودّ شراء هذا العمل:', link: 'الرابط', mySpace: 'سأرفق صورة العمل في مساحتي.',
      noMatch: 'لا توجد نتائج.', n: 'عملًا',
      dragMany: 'اسحب أي عمل لتحريكه، واضغط عليه لتضبطه.', onWall: 'الأعمال على الجدار', remove: 'احذف هذا العمل من الجدار', removeOne: 'احذف العمل من الجدار',
      helloMany: 'مرحبًا، أودّ شراء هذه الأعمال:', noFrame: 'بدون إطار', frames: { black: 'أسود رفيع', white: 'أبيض للمعارض', oak: 'خشب طبيعي' }
    } : {
      sample: 'Try a sample room', upload: 'Add a photo of your wall', change: 'Change photo',
      lineIs: 'The orange line is', cm: 'cm', adjust: 'Adjust the line', done: 'Done',
      wallIs: 'Your photo shows about', m: 'm across', pick: 'Choose an artwork', allEx: 'All exhibitions', search: 'Search by artist or title',
      width: 'Width', height: 'Height', swap: 'Swap', frame: 'Frame', none: 'None',
      mat: 'White mount', light: 'Light', download: 'Download image', share: 'Share', request: 'Request to purchase',
      name: 'Your name', country: 'Country & city', notes: 'Notes (optional)', send: 'Send request by email',
      avail: 'Ask about availability', reqNote: 'We confirm price, availability and shipping anywhere in the world by email. Attach the image you downloaded so we can see your space.',
      choose: 'Choose an artwork from the list', drag: 'Drag the artwork to move it', measureHint: 'Drag the ends of the orange line onto something you know the size of, then type its length.',
      tips: 'For example: a door is about 80–90 cm wide and 200 cm tall, an A4 sheet is 29.7 cm, a light switch about 8 cm.',
      subject: 'Purchase request', hello: "Hello, I'd like to buy this artwork:", link: 'Link', mySpace: "I'll attach a picture of it in my space.",
      noMatch: 'Nothing matches that search.', n: 'artworks',
      dragMany: 'Drag any piece to move it; tap one to adjust it.', onWall: 'Pieces on your wall', remove: 'Remove this piece from the wall', removeOne: 'Remove the piece from the wall',
      helloMany: "Hello, I'd like to buy these artworks:", noFrame: 'No frame', frames: { black: 'Slim black', white: 'Gallery white', oak: 'Natural oak' }
    };
    const pool = ALL.filter(dims);
    const cv = $('#stage'), ctx = cv.getContext('2d');
    const st = {
      room: null, sample: true, rw: 1600, rh: 1000, line: { x1: 450, y1: 760, x2: 1150, y2: 760 }, lineCm: 175,
      items: [], sel: -1, light: 1, measure: false
    };
    // three frame styles, each drawn with its own colour and bevel; the width is set per piece in cm
    const FRAME = {
      black: { base: '#161616', hi: '#3a3a3a', lo: '#000', inner: '#000' },
      white: { base: '#f3f2ee', hi: '#ffffff', lo: '#d6d3cc', inner: '#c9c5bc' },
      oak: { base: '#b8895a', hi: '#d4a877', lo: '#8a6239', inner: '#6e4c2b', grain: true }
    };
    const cur = () => st.items[st.sel];
    const pxPerCm = () => Math.hypot(st.line.x2 - st.line.x1, st.line.y2 - st.line.y1) / Math.max(1, st.lineCm);

    // sample room, drawn rather than photographed: 1600×1000 px = 400 cm of wall
    function drawSample(c) {
      const g = c.createLinearGradient(0, 0, 0, 780); g.addColorStop(0, '#ece8e1'); g.addColorStop(1, '#dcd6cc');
      c.fillStyle = g; c.fillRect(0, 0, 1600, 1000);
      c.fillStyle = '#a98c6d'; c.fillRect(0, 860, 1600, 140);
      c.fillStyle = '#f3f1ec'; c.fillRect(0, 846, 1600, 16);
      // sofa, 175 cm
      c.fillStyle = '#5a6670'; const r = (x, y, w, h, rad) => { c.beginPath(); c.roundRect(x, y, w, h, rad); c.fill(); };
      r(440, 640, 720, 150, 26); c.fillStyle = '#4c5760'; r(420, 690, 70, 150, 22); r(1110, 690, 70, 150, 22);
      c.fillStyle = '#66737d'; r(480, 735, 640, 85, 18);
      c.fillStyle = '#2a2a2a'; c.fillRect(470, 836, 14, 24); c.fillRect(1116, 836, 14, 24);
      // plant + side table
      c.fillStyle = '#2a2a2a'; c.fillRect(1290, 740, 120, 12); c.fillRect(1344, 752, 12, 108);
      c.fillStyle = '#c9c2b6'; r(1310, 690, 80, 52, 10);
      c.fillStyle = '#5f7d55'; for (let k = 0; k < 7; k++) { c.beginPath(); c.ellipse(1350 + Math.cos(k) * 40, 630 + Math.sin(k * 2) * 30, 18, 46, k, 0, 7); c.fill(); }
    }

    const wrap = $('#stage-wrap');
    let view = 1, dpr = 1;
    function fit() {
      const W = wrap.clientWidth, maxH = innerWidth < 960 ? Math.max(220, innerHeight * .45) : Math.max(320, innerHeight - 180);
      view = Math.min(W / st.rw, maxH / st.rh);
      dpr = devicePixelRatio || 1;
      cv.style.width = `${st.rw * view}px`; cv.style.height = `${st.rh * view}px`;
      cv.width = Math.round(st.rw * view * dpr); cv.height = Math.round(st.rh * view * dpr);
      draw();
    }
    // a piece's rectangle (with frame and mount) in room pixels
    function rectOf(it) {
      const k = pxPerCm(), f = it.frame === 'none' ? 0 : it.fw, m = it.mat ? 7 : 0;
      const w = (it.wcm + 2 * (f + m)) * k, h = (it.hcm + 2 * (f + m)) * k;
      return { x: it.x - w / 2, y: it.y - h / 2, w, h, f: f * k, m: m * k };
    }
    function paintFrame(c, r, fr) {
      const { x, y, w, h, f } = r;
      c.fillStyle = fr.base; c.fillRect(x, y, w, h);
      if (fr.grain) {
        c.save(); c.globalAlpha = .18; c.strokeStyle = fr.lo; c.lineWidth = Math.max(.6, f * .05);
        for (let k = 1; k < 6; k++) { const o = f * k / 6; c.strokeRect(x + o, y + o, w - 2 * o, h - 2 * o); }
        c.restore();
      }
      // bevel: light from the top left
      const b = Math.min(f * .35, 18);
      c.fillStyle = fr.hi; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(x + w - b, y + b); c.lineTo(x + b, y + b); c.lineTo(x + b, y + h - b); c.lineTo(x, y + h); c.fill();
      c.fillStyle = fr.lo; c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.lineTo(x + b, y + h - b); c.lineTo(x + w - b, y + h - b); c.lineTo(x + w - b, y + b); c.fill();
      c.fillStyle = fr.base; c.fillRect(x + b, y + b, w - 2 * b, h - 2 * b);
      c.strokeStyle = fr.inner; c.lineWidth = Math.max(1, f * .06); c.strokeRect(x + f, y + f, w - 2 * f, h - 2 * f);
    }
    function paintItem(c, it) {
      const r = rectOf(it);
      c.save();
      c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = r.w * .04; c.shadowOffsetX = r.w * .012; c.shadowOffsetY = r.w * .02;
      c.fillStyle = it.frame === 'none' ? '#000' : FRAME[it.frame].base; c.fillRect(r.x, r.y, r.w, r.h);
      c.restore();
      if (it.frame !== 'none') paintFrame(c, r, FRAME[it.frame]);
      if (it.mat) { c.fillStyle = '#fbfaf7'; c.fillRect(r.x + r.f, r.y + r.f, r.w - 2 * r.f, r.h - 2 * r.f); }
      const ix = r.x + r.f + r.m, iy = r.y + r.f + r.m, iw = r.w - 2 * (r.f + r.m), ih = r.h - 2 * (r.f + r.m);
      if (it.img) {
        c.save(); c.filter = `brightness(${st.light})`;
        // cover-fit the photo into the artwork's real proportions
        const s = Math.max(iw / it.img.naturalWidth, ih / it.img.naturalHeight), sw = iw / s, sh = ih / s;
        c.drawImage(it.img, (it.img.naturalWidth - sw) / 2, (it.img.naturalHeight - sh) / 2, sw, sh, ix, iy, iw, ih);
        c.restore();
      }
      return r;
    }
    function paint(c, handles) {
      if (st.sample) drawSample(c); else c.drawImage(st.room, 0, 0, st.rw, st.rh);
      st.items.forEach((it, k) => {
        const r = paintItem(c, it);
        if (handles && !st.measure && k === st.sel) { c.strokeStyle = 'rgba(226,129,23,.9)'; c.lineWidth = 2 / view; c.setLineDash([8 / view, 6 / view]); c.strokeRect(r.x - 6 / view, r.y - 6 / view, r.w + 12 / view, r.h + 12 / view); c.setLineDash([]); }
      });
      if (handles && st.measure) {
        const { x1, y1, x2, y2 } = st.line;
        c.strokeStyle = '#E28117'; c.lineWidth = 4 / view; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
        [[x1, y1], [x2, y2]].forEach(([x, y]) => { c.fillStyle = '#E28117'; c.beginPath(); c.arc(x, y, 11 / view, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 4 / view, 0, 7); c.fill(); });
        c.font = `${15 / view}px Urbanist, sans-serif`; c.fillStyle = '#000'; c.textAlign = 'center';
        const lbl = `${num(st.lineCm)} ${S.cm}`, mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 16 / view, tw = c.measureText(lbl).width + 14 / view;
        c.fillStyle = '#E28117'; c.fillRect(mx - tw / 2, my - 14 / view, tw, 22 / view); c.fillStyle = '#000'; c.fillText(lbl, mx, my + 2 / view);
      }
    }
    function draw() {
      ctx.setTransform(dpr * view, 0, 0, dpr * view, 0, 0);
      ctx.clearRect(0, 0, st.rw, st.rh);
      paint(ctx, true);
      $('#wall-size').textContent = `${S.wallIs} ${num((st.rw / pxPerCm() / 100).toFixed(1))} ${S.m}`;
      $('#stage-hint').textContent = st.measure ? S.measureHint : st.items.length > 1 ? S.dragMany : st.items.length ? S.drag : S.choose;
    }

    // pointer: drag line handles in measure mode; otherwise pick and drag the piece under the pointer
    let drag = null;
    const pt = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / view, y: (e.clientY - r.top) / view }; };
    const hit = (p, tol = 0) => { for (let k = st.items.length - 1; k >= 0; k--) { const r = rectOf(st.items[k]); if (p.x > r.x - tol && p.x < r.x + r.w + tol && p.y > r.y - tol && p.y < r.y + r.h + tol) return k; } return -1; };
    cv.addEventListener('pointerdown', e => {
      const p = pt(e), tol = 26 / view;
      if (st.measure) {
        if (Math.hypot(p.x - st.line.x1, p.y - st.line.y1) < tol) drag = { h: 1 };
        else if (Math.hypot(p.x - st.line.x2, p.y - st.line.y2) < tol) drag = { h: 2 };
        else drag = { h: 0, ox: p.x, oy: p.y, l: { ...st.line } };
      } else {
        let k = hit(p); if (k < 0 && st.sel >= 0 && hit(p, tol) === st.sel) k = st.sel;
        if (k >= 0) {
          // bring the touched piece to the front and make it the one being tuned
          const it = st.items.splice(k, 1)[0]; st.items.push(it); setSel(st.items.length - 1);
          drag = { w: 1, dx: p.x - it.x, dy: p.y - it.y };
        }
      }
      if (drag) { cv.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    cv.addEventListener('pointermove', e => {
      const p = pt(e);
      if (!drag) { if (!st.measure) cv.style.cursor = hit(p) >= 0 ? 'grab' : 'default'; return; }
      const cl = (v, max) => Math.max(0, Math.min(max, v));
      if (drag.w) { const it = cur(); it.x = cl(p.x - drag.dx, st.rw); it.y = cl(p.y - drag.dy, st.rh); }
      else if (drag.h === 1) { st.line.x1 = cl(p.x, st.rw); st.line.y1 = cl(p.y, st.rh); }
      else if (drag.h === 2) { st.line.x2 = cl(p.x, st.rw); st.line.y2 = cl(p.y, st.rh); }
      else { const dx = p.x - drag.ox, dy = p.y - drag.oy; Object.assign(st.line, { x1: drag.l.x1 + dx, y1: drag.l.y1 + dy, x2: drag.l.x2 + dx, y2: drag.l.y2 + dy }); }
      draw();
    });
    ['pointerup', 'pointercancel'].forEach(t => cv.addEventListener(t, () => { drag = null; }));

    // step 1: room
    const file = $('#room-file');
    file.addEventListener('change', () => {
      const f = file.files[0]; if (!f) return;
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, 2200 / Math.max(im.naturalWidth, im.naturalHeight));
        const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(im.src);
        const sx = c.width / st.rw, sy = c.height / st.rh;
        st.items.forEach(it => { it.x *= sx; it.y *= sy; });
        Object.assign(st, { room: c, sample: false, rw: c.width, rh: c.height, lineCm: 100 });
        st.line = { x1: c.width * .3, y1: c.height * .62, x2: c.width * .7, y2: c.height * .62 };
        $('#line-cm').value = 100;
        setMeasure(true); $('#room-label').textContent = S.change; fit();
        $('#step-scale').scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' });
      };
      im.src = URL.createObjectURL(f);
    });
    $('#use-sample').onclick = () => {
      const sx = 1600 / st.rw, sy = 1000 / st.rh;
      st.items.forEach(it => { it.x *= sx; it.y *= sy; });
      Object.assign(st, { room: null, sample: true, rw: 1600, rh: 1000, line: { x1: 450, y1: 760, x2: 1150, y2: 760 }, lineCm: 175 });
      $('#line-cm').value = 175; setMeasure(false); fit();
    };
    // step 2: scale
    const setMeasure = on => { st.measure = on; $('#measure-btn').textContent = on ? S.done : S.adjust; $('#measure-btn').setAttribute('aria-pressed', on); draw(); };
    $('#measure-btn').onclick = () => setMeasure(!st.measure);
    $('#line-cm').addEventListener('input', e => { const v = parseFloat(e.target.value); if (v > 0) { st.lineCm = v; draw(); } });

    // step 3: pick — each tap adds a piece (or selects it if it is already on the wall)
    const grid = $('#pick-grid'), exSel = $('#pick-ex'), q = $('#pick-q');
    exSel.innerHTML = `<option value="">${S.allEx}</option>` + [...EX].reverse().filter(e => pool.some(w => w.ex === e.id)).map(e => `<option value="${e.id}">${esc(L(e, 'title'))}</option>`).join('');
    const idOf = w => `${w.ex}.${w.i}`;
    const onWall = id => st.items.findIndex(it => idOf(it.w) === id);
    function list() {
      const s = q.value.trim().toLowerCase();
      const items = pool.filter(w => (!exSel.value || w.ex === exSel.value) && (!s || (w.artist + ' ' + w.title).toLowerCase().includes(s)));
      grid.innerHTML = items.map(w => `<li><button type="button" data-w="${idOf(w)}" aria-pressed="${onWall(idOf(w)) >= 0}" title="${esc(w.title)} — ${esc(w.artist)}">
        <img src="${workSrc(w.imgs[0].f, true)}" alt="${esc(w.title)}, ${esc(w.artist)}" loading="lazy"><span>${esc(w.artist)}</span></button></li>`).join('') || `<li class="empty">${S.noMatch}</li>`;
      $('#pick-count').textContent = `${num(items.length)} ${S.n}`;
    }
    exSel.onchange = list; let qt; q.oninput = () => { clearTimeout(qt); qt = setTimeout(list, 120); };
    grid.onclick = e => { const b = e.target.closest('[data-w]'); if (b) add(b.dataset.w); };
    function add(id, opts = {}) {
      const have = onWall(id); if (have >= 0) { setSel(have); return; }
      const [ex, i] = id.split('.'); const w = pool.find(x => x.ex === ex && x.i === +i); if (!w) return;
      const d = dims(w), prev = cur(), k = pxPerCm();
      // place a new piece beside the last one, so pieces don't land on top of each other
      let x = st.rw / 2, y = st.sample ? 330 : st.rh * .38;
      if (prev) { const r = rectOf(prev); x = r.x + r.w + (d.w / 2 + 15 + (prev.fw || 3)) * k; y = prev.y; if (x + d.w / 2 * k > st.rw * .97) {
        // no room on the right: go left of the leftmost piece, or start a new row higher up
        const left = Math.min(...st.items.map(o => rectOf(o).x));
        x = left - (d.w / 2 + 15 + (prev.fw || 3)) * k;
        if (x - d.w / 2 * k < st.rw * .03) { x = st.rw / 2; y = Math.max(d.h / 2 * k + 20, r.y - (d.h / 2 + 15) * k); }
      } }
      const it = { w, img: null, wcm: d.w, hcm: d.h, x, y, frame: prev ? prev.frame : 'black', fw: prev ? prev.fw : 3, mat: prev ? prev.mat : false };
      st.items.push(it); setSel(st.items.length - 1);
      const im = new Image(); im.onload = () => { it.img = im; if (!opts.quiet) setMeasure(false); draw(); }; im.src = workSrc(w.imgs[0].f);
      list(); syncUrl();
    }
    function remove(k) {
      st.items.splice(k, 1); setSel(Math.min(k, st.items.length - 1)); list(); syncUrl();
    }
    const syncUrl = () => history.replaceState(null, '', st.items.length ? `?w=${st.items.map(it => idOf(it.w)).join(',')}` : location.pathname);
    // the selected piece's details, plus a row of every piece on the wall
    function setSel(k) {
      st.sel = k; const it = cur();
      $('#tune').hidden = !it; $('#buy').hidden = !st.items.length;
      if (it) {
        $('#w-cm').value = it.wcm; $('#h-cm').value = it.hcm; $('#mat').checked = it.mat;
        $('#fw').value = it.fw; $('#fw-out').textContent = `${num(it.fw)} ${S.cm}`; $('#fw').disabled = it.frame === 'none';
        $$('[data-frame]').forEach(x => x.setAttribute('aria-pressed', x.dataset.frame === it.frame));
      }
      const many = st.items.length > 1;
      $('#picked').innerHTML = !it ? '' : `
        ${many ? `<div class="on-wall" role="list" aria-label="${S.onWall}">${st.items.map((x, j) => `<span class="ow${j === k ? ' on' : ''}" role="listitem"><button type="button" data-sel="${j}" aria-pressed="${j === k}" title="${esc(x.w.title)} — ${esc(x.w.artist)}"><img src="${workSrc(x.w.imgs[0].f, true)}" alt="${esc(x.w.title)}"></button><button type="button" class="rm" data-rm="${j}" aria-label="${S.remove}: ${esc(x.w.title)}">×</button></span>`).join('')}</div>` : ''}
        <a href="${url.artist(it.w.artist)}" dir="ltr">${esc(it.w.artist)}</a><span class="t" dir="auto">${esc(it.w.title)}</span>
        <span class="m" dir="auto">${meta(it.w)}</span>${placeOf(it.w) ? `<a class="x" href="${placeOf(it.w).href}">${esc(placeOf(it.w).title)}</a>` : ''}<span class="av">${S.avail}</span>`;
      $('#remove').textContent = many ? S.remove : S.removeOne;
      draw();
    }
    $('#picked').onclick = e => {
      const s = e.target.closest('[data-sel]'), r = e.target.closest('[data-rm]');
      if (r) remove(+r.dataset.rm); else if (s) setSel(+s.dataset.sel);
    };
    // step 4: tune the selected piece
    const num2 = v => Math.max(1, parseFloat(v) || 1);
    $('#w-cm').oninput = e => { if (cur()) { cur().wcm = num2(e.target.value); draw(); } };
    $('#h-cm').oninput = e => { if (cur()) { cur().hcm = num2(e.target.value); draw(); } };
    $('#swap').onclick = () => { const it = cur(); if (!it) return; [it.wcm, it.hcm] = [it.hcm, it.wcm]; $('#w-cm').value = it.wcm; $('#h-cm').value = it.hcm; draw(); };
    $('#frames').onclick = e => { const b = e.target.closest('[data-frame]'); if (!b || !cur()) return; cur().frame = b.dataset.frame; setSel(st.sel); };
    $('#fw').oninput = e => { const it = cur(); if (!it) return; it.fw = +e.target.value; $('#fw-out').textContent = `${num(it.fw)} ${S.cm}`; draw(); };
    $('#mat').onchange = e => { if (cur()) { cur().mat = e.target.checked; draw(); } };
    $('#light').oninput = e => { st.light = +e.target.value; draw(); };
    $('#remove').onclick = () => { if (st.sel >= 0) remove(st.sel); };

    // step 5: snapshot, share, request
    const titleLine = () => st.items.length === 1 ? `${st.items[0].w.title} — ${st.items[0].w.artist} · ${num(st.items[0].wcm)}×${num(st.items[0].hcm)} ${S.cm}`
      : `${num(st.items.length)} ${S.n}: ${st.items.map(it => `${it.w.title} — ${it.w.artist}`).join(' · ')}`;
    function snapshot() {
      const c = document.createElement('canvas'), bar = Math.round(st.rw * .045);
      c.width = st.rw; c.height = st.rh + bar;
      const x = c.getContext('2d'); paint(x, false);
      x.fillStyle = '#000'; x.fillRect(0, st.rh, st.rw, bar);
      x.font = `${Math.round(bar * .38)}px Urbanist, sans-serif`; x.textBaseline = 'middle';
      x.fillStyle = '#F2F2F2'; x.textAlign = 'left';
      let t = st.items.length ? titleLine() : ''; const max = st.rw * .72;
      while (t.length > 4 && x.measureText(t).width > max) t = t.slice(0, -2);
      if (st.items.length && t !== titleLine()) t += '…';
      x.fillText(t, bar * .4, st.rh + bar / 2);
      x.fillStyle = '#E28117'; x.textAlign = 'right'; x.fillText('theartgallery.world', st.rw - bar * .4, st.rh + bar / 2);
      return new Promise(res => c.toBlob(res, 'image/jpeg', .9));
    }
    const fname = () => `the-art-gallery-${st.items.length === 1 ? slug(st.items[0].w.artist + ' ' + st.items[0].w.title) : 'my-wall'}.jpg`;
    $('#dl').onclick = async () => {
      const b = await snapshot(), a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = fname(); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    };
    const shareBtn = $('#share');
    shareBtn.hidden = !(navigator.canShare && navigator.canShare({ files: [new File([''], 'x.jpg', { type: 'image/jpeg' })] }));
    shareBtn.onclick = async () => {
      const f = new File([await snapshot()], fname(), { type: 'image/jpeg' });
      try { await navigator.share({ files: [f], title: 'the ART GALLERY', text: `${st.items.length ? titleLine() : ''}\n${location.href}` }); } catch (e) { /* cancelled */ }
    };
    $('#req-toggle').onclick = () => { const f = $('#req'); f.hidden = !f.hidden; if (!f.hidden) $('#req-name').focus(); };
    $('#req').onsubmit = e => {
      e.preventDefault(); if (!st.items.length) return;
      const fr = it => it.frame === 'none' ? S.noFrame : `${S.frames[it.frame]} ${S.frame.toLowerCase()}, ${num(it.fw)} ${S.cm}${it.mat ? ' + ' + S.mat.toLowerCase() : ''}`;
      const pieces = st.items.map((it, k) => { const ex = placeOf(it.w); return [`${num(k + 1)}. ${it.w.title} — ${it.w.artist}`, `   ${fmtSize(it.w.size)}${it.w.medium ? ' · ' + it.w.medium : ''}${ex ? ` · ${ex.title} (${ex.year})` : ''}`, `   ${fr(it)}`, `   ${S.link}: ${new URL(url.space(it.w), location.href).href}`].join('\n'); });
      const body = [st.items.length > 1 ? S.helloMany : S.hello, '', ...pieces, '', `${S.name}: ${$('#req-name').value}`, `${S.country}: ${$('#req-country').value}`,
        $('#req-notes').value ? `\n${$('#req-notes').value}` : '', '', S.mySpace].join('\n');
      const subj = st.items.length > 1 ? `${S.subject}: ${num(st.items.length)} ${S.n}` : `${S.subject}: ${st.items[0].w.title} — ${st.items[0].w.artist}`;
      location.href = `mailto:info@theartgallery.world?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    };

    addEventListener('resize', () => { clearTimeout(fit.t); fit.t = setTimeout(fit, 100); });
    list(); fit();
    const want = params.get('w'); if (want) want.split(',').forEach(id => add(id, { quiet: true }));
  };

  // ---------- Rana Khalil's portfolio (her own work, for grants and residencies)
  pages.portfolio = () => {
    const P = window.PORTFOLIO; const main = $('#main');
    if (!P) return;
    const S = AR ? { kicker: 'أعمال فنية', statement: 'عن الممارسة', bio: 'نبذة', works: 'الأعمال', cv: 'السيرة الذاتية', contact: 'تواصل', shows: 'معارض', commissions: 'أعمال بالتكليف', curation: 'تنسيق فني', teaching: 'تدريس', education: 'التعليم', awards: 'جوائز ومسابقات', languages: 'اللغات', galleryLink: 'المعارض التي نسّقتها', series: 'سلسلة', inquire: 'للتعاون أو الأعمال بالتكليف', view: 'عرض', of: 'من' }
      : { kicker: 'Portfolio', statement: 'Statement', bio: 'Biography', works: 'Work', cv: 'CV', contact: 'Contact', shows: 'Exhibitions', commissions: 'Commissions', curation: 'Curation', teaching: 'Teaching', education: 'Education', awards: 'Awards and competitions', languages: 'Languages', galleryLink: 'Exhibitions I have curated', series: 'Series', inquire: 'For collaborations or commissions', view: 'View', of: 'of' };
    const src = (f, t) => `${BASE}assets/img/portfolio/${t ? 't/' : ''}${f}.jpg`;
    const ar = (o, k) => AR && o[k + 'Ar'] ? o[k + 'Ar'] : o[k];
    // every image on the page, in order, for the viewer
    const slides = [];
    const cap = (t, m) => `<span class="lb-artist" dir="ltr">Rana Khalil</span><span class="lb-title" dir="auto">${esc(t)}</span>${m ? `<span class="lb-meta" dir="auto">${esc(m)}</span>` : ''}`;
    const add = (im, t, m) => { slides.push({ src: src(im[0]), alt: `${t}, Rana Khalil`, cap: cap(t, m) }); return slides.length - 1; };
    const line = w => [w.m, w.s, w.y].filter(Boolean).join(' · ');
    const fig = (w, cls = '') => {
      const k = add(w.img, w.t, [line(w), w.note].filter(Boolean).join(' · '));
      return `<figure class="pf-work ${cls} reveal"><button type="button" data-k="${k}" style="aspect-ratio:${w.img[1]}/${w.img[2]}" aria-label="${S.view}: ${esc(w.t)}"><img src="${src(w.img[0], true)}" alt="${esc(w.t)}, Rana Khalil" loading="lazy" width="${w.img[1]}" height="${w.img[2]}"></button>
        <figcaption><span class="t" dir="ltr">${esc(w.t)}</span>${line(w) ? `<span class="m" dir="ltr">${esc(line(w))}</span>` : ''}${w.note ? `<span class="n" dir="ltr">${esc(w.note)}</span>` : ''}</figcaption></figure>`;
    };
    const group = g => {
      const ks = g.imgs.map(im => add(im, g.t, [g.m, g.y].join(' · ')));
      return `<div class="pf-group reveal"><div class="pf-group-head"><h3 dir="ltr">${esc(g.t)}</h3><p dir="ltr">${esc([g.m, g.y].join(' · '))}${g.shown ? `<br><span class="n">${esc(g.shown)}</span>` : ''}</p></div>
        <ul class="pf-strip">${g.imgs.map((im, j) => `<li style="flex:${(im[1] / im[2]).toFixed(3)}"><button type="button" data-k="${ks[j]}" aria-label="${S.view}: ${esc(g.t)} ${num(j + 1)} ${S.of} ${num(g.imgs.length)}"><img src="${src(im[0], true)}" alt="${esc(g.t)}, Rana Khalil" loading="lazy" width="${im[1]}" height="${im[2]}"></button></li>`).join('')}</ul></div>`;
    };
    const rows = (list) => `<dl class="pf-cv-list">${list.map(([y, t]) => `<div><dt>${esc(y)}</dt><dd dir="ltr">${esc(t)}</dd></div>`).join('')}</dl>`;
    const series = P.series;
    main.innerHTML = `
      <section class="pf-hero">
        <div class="pf-hero-img"><img src="${src(P.cover[0])}" alt="${AR ? 'تفصيل من لوحة Purple Sea، ٢٠٢٦' : 'Detail of Purple Sea, 2026'}" data-parallax=".1"></div>
        <div class="wrap pf-hero-text reveal">
          <p class="eyebrow"><span class="level">${S.kicker}</span> ${esc(ar(P, 'role'))}</p>
          <h1 class="display" dir="ltr">Rana<span>Khalil</span></h1>
          <p class="pf-line" ${AR ? 'lang="ar"' : ''}>${esc(ar(P, 'line'))}</p>
          <nav class="pf-index" aria-label="${S.works}">${series.map((s, i) => `<a href="#${s.id}"><span class="no">${num(i + 1).padStart(2, AR ? '٠' : '0')}</span> ${esc(ar(s, 'title'))}</a>`).join('')}<a href="#cv"><span class="no">—</span> ${S.cv}</a></nav>
        </div>
      </section>

      <section class="section pf-statement" id="statement">
        <div class="wrap pf-two">
          <div class="reveal"><p class="eyebrow">${S.statement}</p><h2 class="display">${esc(ar(P, 'statementTitle'))}</h2></div>
          <div class="pf-prose reveal">${(AR ? P.statementAr : P.statement).map(p => `<p>${esc(p)}</p>`).join('')}
            <blockquote lang="ar" dir="rtl">${esc(P.lineAr)}</blockquote>
            <p class="eyebrow" style="margin-top:36px">${S.bio}</p><p>${esc(ar(P, 'bio'))}</p></div>
        </div>
      </section>

      ${series.map((s, i) => `
      <section class="section tight pf-series pf-${s.id}" id="${s.id}">
        <div class="wrap">
          <div class="pf-series-head reveal">
            <span class="no">${num(i + 1).padStart(2, AR ? '٠' : '0')}</span>
            <div><h2 class="h-sec">${esc(ar(s, 'title'))} ${s.years ? `<span>${esc(s.years)}</span>` : ''}</h2>
            <p>${esc(ar(s, 'intro'))}</p></div>
          </div>
          ${s.works[0] && s.works[0].group ? s.works.map(w => group(w.group)).join('') : `<div class="pf-grid">${s.works.map(w => fig(w)).join('')}</div>`}
        </div>
      </section>`).join('')}

      <section class="section pf-cv on-dark" id="cv">
        <div class="wrap">
          <div class="pf-series-head reveal"><span class="no">—</span><div><h2 class="h-sec">${S.cv}</h2></div></div>
          <div class="pf-cv-grid">
            <div class="reveal"><h3>${S.shows}</h3>${rows(P.cv.shows)}<h3>${S.commissions}</h3>${rows(P.cv.commissions)}</div>
            <div class="reveal"><h3>${S.curation}</h3>${rows(P.cv.curation)}<p><a class="link-arrow" href="${url.exhibitions}">${S.galleryLink} <span aria-hidden="true">${AR ? '←' : '→'}</span></a></p>
              <h3>${S.teaching}</h3>${rows(P.cv.teaching)}<h3>${S.education}</h3>${rows(P.cv.education)}<h3>${S.awards}</h3>${rows(P.cv.awards)}
              <h3>${S.languages}</h3><p dir="ltr">${esc(P.cv.languages)}</p></div>
          </div>
        </div>
      </section>

      <section class="section pf-contact" id="contact">
        <div class="wrap reveal">
          <p class="eyebrow">${S.contact}</p>
          <h2 class="display">${S.inquire}</h2>
          <p class="pf-links"><a href="mailto:${P.email}" dir="ltr">${P.email}</a><a href="https://www.instagram.com/${P.instagram}/" dir="ltr">Instagram · @${P.instagram}</a></p>
        </div>
      </section>`;
    main.onclick = e => { const b = e.target.closest('[data-k]'); if (b) lbOpen(slides, +b.dataset.k); };
    revealIn(main); parallax();
  };

  // ---------- Curation project
  pages.project = () => {
    const p = PROJECTS.find(x => x.id === params.get('id'));
    const main = $('#main');
    if (!p) return notFound(main, url.exhibitions, T.exhibitions);
    document.title = `${L(p, 'title')} — ${BRAND}`;
    setMeta(L(p, 'blurb'), projSrc(p, p.image));
    const n = p.works.reduce((m, w) => m + w.qty, 0);
    const people = [...new Set(p.works.map(w => w.artist))];
    const slides = p.photos.map(([f]) => ({ src: projSrc(p, f), alt: L(p, 'title'), cap: `<span class="lb-title">${esc(L(p, 'title'))}</span><span class="lb-meta">${esc(L(p, 'place'))}</span>` }));
    main.innerHTML = `
      <section class="proj-hero">
        <div class="proj-hero-img"><img src="${projSrc(p, p.image)}" alt="${esc(L(p, 'title'))}" data-parallax=".12"></div>
        <div class="wrap proj-hero-text reveal">
          <a class="crumb" href="${url.exhibitions}#projects">${AR ? '→' : '←'} ${T.projects}</a>
          <p class="eyebrow"><span class="level">${esc(L(p, 'kind'))}</span></p>
          <h1 class="display">${esc(L(p, 'title'))}</h1>
        </div>
      </section>
      <section class="section tight">
        <div class="wrap ex-hero" style="padding:0">
          <div class="wrap" style="padding:0">
            <p class="ex-blurb reveal" style="margin-top:0">${esc(L(p, 'blurb'))}</p>
          </div>
          <dl class="ex-facts reveal">
            <div><dt>${T.place}</dt><dd>${esc(L(p, 'place'))}</dd></div>
            <div><dt>${AR ? 'التاريخ' : 'When'}</dt><dd>${esc(L(p, 'dates'))}</dd></div>
            <div><dt>${T.artists}</dt><dd>${num(people.length)}</dd></div>
            <div><dt>${T.artworks}</dt><dd>${num(n)}</dd></div>
          </dl>
        </div>
      </section>
      <section class="section tight on-dark">
        <div class="wrap">
          <h2 class="h-sec reveal">${T.photos}</h2>
          <ul class="views" id="proj-photos">${p.photos.map(([f, w, h], k) => `<li class="reveal"><button type="button" data-v="${k}" aria-label="${esc(T.view)} ${num(k + 1)}"><img src="${projSrc(p, f, true)}" alt="${esc(L(p, 'title'))}" loading="lazy" width="${w}" height="${h}"></button></li>`).join('')}</ul>
        </div>
      </section>
      <section class="section tight">
        <div class="wrap">
          <h2 class="h-sec reveal">${T.installed} <span>${plural(people.length, 'artistsN')} · ${num(n)} ${T.piecesN}</span></h2>
          <ul class="tlist proj-works reveal">${p.works.map(w => `<li>${artists.has(w.artist) ? `<a href="${url.artist(w.artist)}" dir="ltr">${esc(w.artist)}</a>` : `<span class="na" dir="ltr">${esc(w.artist)}</span>`}
            <span class="t">${esc(w.medium)}</span><span class="m">${fmtSize(w.size)} · × ${num(w.qty)}</span></li>`).join('')}</ul>
        </div>
      </section>
      <section class="section on-dark tight">
        <div class="wrap bar">
          <h2 class="display reveal">${AR ? 'أعطنا مساحة.<span><em>وسنمنحها الحياة.</em></span>' : 'Bring us a space.<span><em>We\'ll bring it to life.</em></span>'}</h2>
          <a class="btn btn-quiet btn-lg reveal" href="${url.work}">${T.work} <span class="arrow">${AR ? '←' : '→'}</span></a>
        </div>
      </section>`;
    $('#proj-photos').onclick = ev => { const b = ev.target.closest('[data-v]'); if (b) lbOpen(slides, +b.dataset.v); };
    revealIn(main); parallax();
  };

  function notFound(main, back, name) {
    main.innerHTML = `<section class="section"><div class="wrap"><h1 class="display">${T.notFound}</h1><p class="lede"><a class="link-arrow" href="${back}">${T.backTo} ${name}</a></p></div></section>`;
  }
  function setMeta(desc, image) {
    const d = $('meta[name="description"]'); if (d && desc) d.setAttribute('content', desc.slice(0, 300));
    const og = $('meta[property="og:image"]'); if (og && image) og.setAttribute('content', new URL(image, location.href).href);
  }

  (pages[PAGE] || (() => {}))();
  revealIn();
})();
