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
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(location.search);
  const BRAND = AR ? 'ذا آرت جاليري' : 'the ART GALLERY';

  // ---------- Strings
  const T = AR ? {
    home: 'الرئيسية', exhibitions: 'المعارض', artworks: 'الأعمال', artists: 'الفنانون', about: 'من نحن', work: 'تعاون معنا',
    lang: 'English', langCode: 'en', menu: 'فتح القائمة', close: 'إغلاق', prev: 'السابق', next: 'التالي',
    no: 'رقم', hosted: 'استضافة', artist1: 'فنان', artistsN: 'فنانًا', work1: 'عمل', worksN: 'عملًا',
    all: 'الكل', search: 'ابحث بالفنان أو العنوان', searchArtists: 'ابحث عن فنان', noMatch: 'لا توجد نتائج.',
    viewEx: 'شاهد المعرض', seeAll: 'كل المعارض', seeWorks: 'كل الأعمال', open: 'افتح', exhibitedIn: 'شارك في',
    worksIn: 'الأعمال في المعرض', photosSoon: 'أعمال بدون صور بعد', views: 'من المعرض', guest: 'فنانو هذا المعرض من برنامج Art Routes ولا يظهرون في فهرس فنانينا.',
    about1: 'نبذة', prevEx: 'المعرض السابق', nextEx: 'المعرض التالي', prevArtist: 'الفنان السابق', nextArtist: 'الفنان التالي',
    notFound: 'لم نجد هذه الصفحة.', backTo: 'العودة إلى', cm: 'سم', of: 'من', shown: 'معروضة', more: 'عرض المزيد',
    keyVisual: 'الهوية البصرية لمعرض', photoOf: 'صورة', portraitOf: 'صورة', curated: 'تنسيق', hostedLabel: 'معرض مستضاف',
    beyond: 'خارج الجاليري', email: 'البريد', instagram: 'إنستجرام', rights: 'ذا آرت جاليري', view: 'عرض', slide: 'شريحة',
    pause: 'إيقاف', play: 'تشغيل', exhibition: 'المعرض', artist: 'الفنان', count: 'عدد', years: 'السنوات'
  } : {
    home: 'Home', exhibitions: 'Exhibitions', artworks: 'Artworks', artists: 'Artists', about: 'About', work: 'Work with us',
    lang: 'عربي', langCode: 'ar', menu: 'Open menu', close: 'Close', prev: 'Previous', next: 'Next',
    no: 'No.', hosted: 'Hosted', artist1: 'artist', artistsN: 'artists', work1: 'artwork', worksN: 'artworks',
    all: 'All', search: 'Search by artist or title', searchArtists: 'Search artists', noMatch: 'Nothing matches that search.',
    viewEx: 'View exhibition', seeAll: 'All exhibitions', seeWorks: 'All artworks', open: 'Open', exhibitedIn: 'Exhibited in',
    worksIn: 'Works in the show', photosSoon: 'Also shown (photos to come)', views: 'From the exhibition', guest: "This exhibition's artists come from Art Routes' programme and are not part of our artist index.",
    about1: 'About', prevEx: 'Previous exhibition', nextEx: 'Next exhibition', prevArtist: 'Previous artist', nextArtist: 'Next artist',
    notFound: "We couldn't find that page.", backTo: 'Back to', cm: 'cm', of: 'of', shown: 'shown', more: 'Show more',
    keyVisual: 'Key visual for', photoOf: 'Photo of', portraitOf: 'Portrait of', curated: 'Curated', hostedLabel: 'Hosted exhibition',
    beyond: 'Beyond the gallery', email: 'Email', instagram: 'Instagram', rights: 'the ART GALLERY', view: 'View', slide: 'Slide',
    pause: 'Pause', play: 'Play', exhibition: 'Exhibition', artist: 'Artist', count: 'Count', years: 'Years'
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
  const url = {
    home: ROOT, about: ROOT + 'about/', exhibitions: ROOT + 'exhibitions/', artists: ROOT + 'artists/',
    ex: id => `${ROOT}exhibition/?id=${id}`, artist: name => `${ROOT}artist/?a=${slug(name)}`,
    artworks: id => ROOT + 'artworks/' + (id ? `?ex=${id}` : ''), work: ROOT + '#work'
  };
  const img = (p, w) => BASE + p;
  const workSrc = (f, thumb) => `${BASE}assets/img/works/${thumb ? 't/' : ''}${f}.jpg`;
  const viewSrc = (f, thumb) => `${BASE}assets/img/views/${thumb ? 't/' : ''}${f}.jpg`;
  const portrait = name => PORTRAITS[name] ? `${BASE}assets/img/artists/${PORTRAITS[name]}.jpg` : '';
  const fmtSize = s => !s ? '' : /\d/.test(s) && !/cm|h\b/i.test(s) ? `${s.replace(/x/gi, '×')} ${T.cm}` : s.replace(/x/gi, '×');

  // ---------- Data model
  const exById = Object.fromEntries(EX.map(e => [e.id, e]));
  const ALL = [];                        // every artwork
  for (const [exId, rows] of Object.entries(WORKS)) {
    rows.forEach((r, i) => ALL.push({
      ex: exId, i, artist: r[0], title: r[1], size: r[2], year: r[3], medium: r[4], notes: r[5],
      imgs: (r[6] || []).map(([f, w, h]) => ({ f, w, h }))
    }));
  }
  const chrono = EX.map((e, i) => ({ e, i }));
  ALL.sort((a, b) => EX.indexOf(exById[b.ex]) - EX.indexOf(exById[a.ex]));
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

  // ---------- Header & footer
  const navItems = [
    ['exhibitions', url.exhibitions], ['artworks', url.artworks()], ['artists', url.artists], ['about', url.about]
  ];
  const active = { exhibitions: ['exhibitions', 'exhibition'], artworks: ['artworks'], artists: ['artists', 'artist'], about: ['about'] };
  const header = $('#site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <div class="wrap">
        <a class="brand" href="${url.home}" aria-label="the ART GALLERY, ${esc(T.home)}">
          <img class="logo" src="${BASE}assets/logo.png" alt="the ART GALLERY" width="900" height="288">
        </a>
        <nav class="nav" id="nav">
          ${navItems.map(([k, h]) => `<a href="${h}"${active[k].includes(PAGE) ? ' aria-current="page"' : ''}>${T[k]}</a>`).join('')}
          <a class="lang" href="${OTHER}${B.path || ''}${location.search}" hreflang="${T.langCode}" lang="${T.langCode}">${T.lang}</a>
          <a class="btn" href="${url.work}">${T.work}</a>
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
          <nav aria-label="${esc(T.home)}">${navItems.map(([k, h]) => `<a href="${h}">${T[k]}</a>`).join('')}<a href="${url.work}">${T.work}</a></nav>
          <nav aria-label="${esc(T.instagram)}">
            <a href="mailto:info@theartgallery.world" dir="ltr">info@theartgallery.world</a>
            <a href="https://www.instagram.com/theartgallery_eg/" dir="ltr">@theartgallery_eg</a>
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
    const e = exById[w.ex];
    return `${withArtist ? `<a class="lb-artist" href="${url.artist(w.artist)}" dir="ltr">${esc(w.artist)}</a>` : ''}
      <span class="lb-title" dir="auto">${esc(w.title)}</span>
      ${meta(w) ? `<span class="lb-meta" dir="auto">${meta(w)}</span>` : ''}
      ${withEx && e ? `<a class="lb-ex" href="${url.ex(e.id)}">${esc(L(e, 'title'))} · ${num(e.year)}</a>` : ''}`;
  };
  // flatten works into viewer slides (every photo of every work)
  const slidesFor = (works, opts = {}) => {
    const s = [];
    works.forEach(w => w.imgs.forEach(im => s.push({ src: workSrc(im.f), alt: `${w.title}, ${w.artist}`, cap: workCap(w, opts.artist !== false, opts.ex !== false), w })));
    return s;
  };

  // ---------- Artwork grid
  function workCard(w, k, opts = {}) {
    const e = exById[w.ex];
    if (!w.imgs.length) {
      return `<li class="wcard is-text">
        <span class="wc-steps" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="wc-title" dir="auto">${esc(w.title)}</span>
        ${opts.artist !== false ? `<a class="wc-artist" href="${url.artist(w.artist)}" dir="ltr">${esc(w.artist)}</a>` : ''}
        <span class="wc-meta" dir="auto">${meta(w)}${w.notes ? ' · ' + esc(w.notes) : ''}</span>
        ${opts.ex !== false && e ? `<a class="wc-ex" href="${url.ex(e.id)}">${esc(L(e, 'title'))}</a>` : ''}
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
      ${opts.ex !== false && e ? `<a class="wc-ex" href="${url.ex(e.id)}">${esc(L(e, 'title'))}</a>` : ''}
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
  function revealIn(root = document) { $$('.reveal:not(.in), .wcard:not(.in)', root).forEach(el => io.observe(el)); }

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
      <span class="img"><img src="${img(e.image)}" alt="${esc(T.keyVisual)} ${esc(L(e, 'title'))}" loading="lazy" ${e.imagePos ? `style="object-position:${e.imagePos}"` : ''}></span>
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
      mq.innerHTML = `<div class="mq-track">${names}</div><div class="mq-track" aria-hidden="true">${names.replace(/<a /g, '<a tabindex="-1" ')}</div>`;
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
              <img src="${img(e.image)}" alt="" ${i > 2 ? 'loading="lazy"' : ''} ${e.imagePos ? `style="object-position:${e.imagePos}"` : ''}>
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
      tl.innerHTML = rows.map(r => `
        <li class="reveal"><span class="tl-year">${num(r.y)}</span>
          <ul>${r.items.map(it => it.e
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
      </section>`).join('');
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
          <div class="ex-hero-img reveal"><img src="${img(e.image)}" alt="${esc(T.keyVisual)} ${esc(L(e, 'title'))}" data-parallax=".25" ${e.imagePos ? `style="object-position:${e.imagePos}"` : ''}></div>
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
            ${names.length > 1 ? `<label class="select"><span class="visually-hidden">${T.artist}</span>
              <select id="artist-filter"><option value="">${T.all} · ${plural(names.length, 'artistsN')}</option>
              ${[...new Set(shown.map(w => w.artist))].sort().map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}</select></label>` : ''}
          </div>
          <ul class="masonry" id="ex-works"></ul>
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
    const ul = $('#ex-works');
    if (ul) {
      const draw = name => renderWorks(ul, name ? shown.filter(w => w.artist === name) : shown, { ex: false, page: 400 });
      draw('');
      const sel = $('#artist-filter'); if (sel) sel.onchange = () => draw(sel.value);
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
            ${BIOS[a.name] ? `<p class="bio" dir="ltr" lang="en">${esc(BIOS[a.name])}</p>` : ''}
            <p class="eyebrow">${T.exhibitedIn}</p>
            <ul class="show-chips">${shows.map(s => `<li><a href="${url.ex(s.id)}"><span class="no">${label(s)}</span> ${esc(L(s, 'title'))} <span class="y">${num(s.year)}</span></a></li>`).join('')}</ul>
          </div>
        </div>
      </section>
      ${shows.map(s => {
        const ws = works.filter(w => w.ex === s.id);
        if (!ws.length) return '';
        return `<section class="section tight artist-show">
          <div class="wrap">
            <div class="bar reveal"><h2 class="h-sec"><a href="${url.ex(s.id)}">${esc(L(s, 'title'))}</a> <span>${esc(L(s, 'dates'))}</span></h2></div>
            <ul class="masonry" data-ex="${s.id}"></ul>
          </div>
        </section>`;
      }).join('')}
      <nav class="pager" aria-label="${T.artists}">
        <div class="wrap">
          ${prev ? `<a class="pg prev" href="${url.artist(prev.name)}"><span class="pg-k">${T.prevArtist}</span><span class="pg-t" dir="ltr">${esc(prev.name)}</span></a>` : '<span></span>'}
          ${next ? `<a class="pg next" href="${url.artist(next.name)}"><span class="pg-k">${T.nextArtist}</span><span class="pg-t" dir="ltr">${esc(next.name)}</span></a>` : '<span></span>'}
        </div>
      </nav>`;
    $$('.masonry[data-ex]', main).forEach(ul => renderWorks(ul, works.filter(w => w.ex === ul.dataset.ex), { artist: false, ex: false, page: 200 }));
    revealIn(main);
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
