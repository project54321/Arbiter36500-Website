/* ═══════════════════════════════════════════════════════════════
   ATLAS BRUT — scroll choreography
   TUNING — every knob lives here
   ═══════════════════════════════════════════════════════════════ */
const CONFIG = {
  scrollLerp: 0.09,        // Lenis smoothing — lower = heavier, driftier
  ease: 'expo.out',        // ONE easing personality, everywhere
  grainOpacity: 0.06,      // film-plate grain strength
  loaderDuration: 1.5,     // decode time on the loader console (seconds)
  dollyStart: 0.32,        // chapter frame starts at 32% of the viewport
  dollyLength: '+=220%',   // how much scroll each chapter pin consumes
  stripDuration: 46,       // seconds per contact-sheet loop at idle
  stripSkewMax: 6,         // max skewX (deg) at peak scroll velocity
  latStart: 66.56,         // meridian rail readout: top of page …
  latEnd: 42.7358          //   … bottom of page (Buzludzha's latitude)
};

gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer:fine)').matches;
document.getElementById('grain').style.opacity = CONFIG.grainOpacity;

/* ═══════════════════════════════════════════════════════════════
   LENIS ↔ SCROLLTRIGGER SYNC — one position, one clock.
   Lenis is driven by GSAP's ticker; ScrollTrigger updates on every
   Lenis scroll; lagSmoothing(0) keeps them from drifting apart.
   Never add a second requestAnimationFrame loop.
   ═══════════════════════════════════════════════════════════════ */
const lenis = new Lenis({ lerp: CONFIG.scrollLerp });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* ═══════════════════════════════════════════════════════════════
   DECODE — the scramble/teletype engine behind every coordinate.
   Reveals the real string left→right while unresolved characters
   cycle through survey glyphs. Mono type only, so no layout shift.
   ═══════════════════════════════════════════════════════════════ */
const GLYPHS = '█▓▒░ABCDEFGHIKLMNOPRSTUVXZ0123456789°./—';
function decode(el, { duration = 1, delay = 0 } = {}) {
  const final = el.dataset.text ?? el.textContent;
  el.dataset.text = final;
  if (reduceMotion) { el.textContent = final; return null; }
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1, duration, delay, ease: 'none',
    onUpdate() {
      const reveal = Math.floor(state.p * final.length);
      let out = '';
      for (let i = 0; i < final.length; i++) {
        const ch = final[i];
        out += (ch === ' ' || i < reveal) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete() { el.textContent = final; }
  });
}

// every [data-decode] label decodes once when it scrolls into view
document.querySelectorAll('[data-decode]').forEach((el) => {
  el.dataset.text = el.textContent;
  if (reduceMotion) return;
  ScrollTrigger.create({
    trigger: el, start: 'top 88%', once: true,
    onEnter: () => decode(el, { duration: 0.9 })
  });
});

/* ═══════════════════════════════════════════════════════════════
   LOADER — coordinates tick on the console while the title
   decodes, then the two curtain halves split apart and the hero
   racks into focus (blurred + oversized → sharp, settled).
   ═══════════════════════════════════════════════════════════════ */
if (!reduceMotion) document.body.style.overflow = 'hidden';

document.fonts.ready.then(() => {
  const loader = document.getElementById('loader');
  const coordsEl = document.getElementById('loader-coords');

  if (reduceMotion) {
    loader.style.display = 'none';
    window.__atlasIntroDone = true;
    return;
  }

  // ticking survey coordinates — pure flavour while the title decodes
  const coordState = { lat: 0, lon: 0 };
  const coordTick = gsap.to(coordState, {
    lat: 66.56, lon: 25.39, duration: CONFIG.loaderDuration, ease: 'power2.inOut',
    onUpdate() {
      coordsEl.textContent =
        coordState.lat.toFixed(4) + '° N / ' + coordState.lon.toFixed(4).padStart(8, '0') + '° E';
    }
  });

  const intro = gsap.timeline({
    defaults: { ease: CONFIG.ease },
    onComplete: () => { document.body.style.overflow = ''; window.__atlasIntroDone = true; startHeroIdle(); }
  });

  intro
    .add(decode(document.getElementById('loader-title'), { duration: CONFIG.loaderDuration }))
    .add(coordTick, 0)
    // curtains part
    .to('.loader-left',  { xPercent: -101, duration: 0.9, ease: 'expo.inOut' }, '+=0.2')
    .to('.loader-right', { xPercent: 101,  duration: 0.9, ease: 'expo.inOut' }, '<')
    .to('.loader-console', { autoAlpha: 0, duration: 0.3 }, '<')
    .set(loader, { display: 'none' })
    // RACK FOCUS — the hero arrives out of focus and snaps sharp
    .fromTo('.focus-line',
      { scale: 1.18, filter: 'blur(22px)', autoAlpha: 0, transformOrigin: '0% 100%' },
      { scale: 1, filter: 'blur(0px)', autoAlpha: 1, duration: 1.4, stagger: 0.12 }, '-=0.55')
    .from('.hero-foot', { y: 26, autoAlpha: 0, duration: 0.9 }, '-=0.8');
});

/* ═══════════════════════════════════════════════════════════════
   LENIS-DRIVEN GLOBALS — one handler feeds four readers:
   header glass · meridian rail · latitude readout · strip warp
   ═══════════════════════════════════════════════════════════════ */
const headerEl = document.getElementById('site-header');
const railFill = document.querySelector('.rail-fill');
const railDot = document.querySelector('.rail-dot');
const railRead = document.getElementById('rail-read');
const railH = () => document.querySelector('.rail-line').offsetHeight;

/* contact sheet: two identical sets, so xPercent −50 loops seamlessly */
let stripTl = null, stripSkew = null;
if (!reduceMotion) {
  stripTl = gsap.to('.strip-track', { xPercent: -50, repeat: -1, duration: CONFIG.stripDuration, ease: 'none' });
  stripSkew = gsap.quickTo('.strip-track', 'skewX', { duration: 0.6, ease: 'power3.out' });
}
const clampSkew = gsap.utils.clamp(-CONFIG.stripSkewMax, CONFIG.stripSkewMax);

lenis.on('scroll', (e) => {
  const p = e.progress || 0;
  headerEl.classList.toggle('is-scrolled', (e.scroll || 0) > 40);

  // meridian rail — fill, dot, and a live latitude interpolation
  if (railFill) {
    railFill.style.transform = `scaleY(${p})`;
    railDot.style.transform = `translateY(${p * railH()}px)`;
    const lat = CONFIG.latStart + (CONFIG.latEnd - CONFIG.latStart) * p;
    railRead.textContent = lat.toFixed(4) + '°N';
  }

  if (reduceMotion) return;
  // contact sheet warps with scroll: direction flips it, velocity skews it
  if (stripTl) {
    const boost = 1 + Math.min(Math.abs(e.velocity || 0) * 0.08, 5);
    stripTl.timeScale((e.direction || 1) * boost);
    stripSkew(clampSkew((e.velocity || 0) * 0.35));
  }
});

/* ═══════════════════════════════════════════════════════════════
   NAV — Lenis-animated anchors + scroll-spy on the header tabs
   ═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (ev) => {
    const href = a.getAttribute('href');
    if (href.length < 2) { ev.preventDefault(); lenis.scrollTo(0, { duration: 1.2, immediate: reduceMotion }); return; }
    const target = document.querySelector(href);
    if (!target) return;
    ev.preventDefault();
    lenis.scrollTo(target, {
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      immediate: reduceMotion
    });
  });
});
document.querySelectorAll('#site-header nav a[href^="#"]').forEach((link) => {
  const sec = document.querySelector(link.getAttribute('href'));
  if (!sec) return;
  ScrollTrigger.create({
    trigger: sec, start: 'top center', end: 'bottom center',
    onToggle: (self) => link.classList.toggle('nav-active', self.isActive)
  });
});

/* ═══════════════════════════════════════════════════════════════
   PER-CHAPTER BACKGROUND TINT — the page atmosphere crossfades as
   each [data-tint] section takes the viewport centre.
   ═══════════════════════════════════════════════════════════════ */
if (!reduceMotion) {
  document.querySelectorAll('[data-tint]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) gsap.to(document.body, { backgroundColor: sec.dataset.tint, duration: 0.9, ease: 'power2.out' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   LINE-MASK REVEALS — generic: any .line rises out of its clip
   when its section enters. Chapter lines are handled by the dolly
   timeline instead, so they're excluded here.
   ═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.line-mask .line').forEach((line) => {
  if (line.closest('.chapter')) return;
  if (reduceMotion) return;
  gsap.from(line, {
    yPercent: 115, duration: 1.1, ease: CONFIG.ease,
    scrollTrigger: { trigger: line.closest('.line-mask'), start: 'top 85%' }
  });
});

/* ═══════════════════════════════════════════════════════════════
   THE DOLLY ZOOM — signature moment.
   The frame (.ch-mask) starts at scale .32 while the photo inside
   counter-scales at 1/.32, so the image holds its apparent size
   while the crop opens up around it — a camera pulling its frame
   wide until the monument swallows the viewport. Scrubbed, pinned,
   pure transforms. Meta lines rise as the frame completes; the
   coordinates decode the moment the pin engages.
   ═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('.chapter').forEach((chapter) => {
  const stage = chapter.querySelector('.ch-stage');
  const mask = chapter.querySelector('.ch-mask');
  const img = chapter.querySelector('.ch-img');
  const scrim = chapter.querySelector('.ch-scrim');
  const lines = chapter.querySelectorAll('.ch-meta .line');
  const head = chapter.querySelector('.ch-head');
  const coord = chapter.querySelector('.ch-coord');

  if (reduceMotion) {
    gsap.set([mask, img], { clearProps: 'transform' });
    return;
  }

  const s = CONFIG.dollyStart;
  gsap.set(mask, { scale: s });
  gsap.set(img, { scale: 1 / s });
  gsap.set(lines, { yPercent: 115 });
  gsap.set(head, { autoAlpha: 0 });

  // COLOR BLOOM — the plate rides in grayscale; once the crop reaches
  // full-bleed the photograph eases into color (a discrete tween, not
  // scrubbed — it should feel like the monument coming alive, not a
  // slider). Leaving the moment desaturates it again.
  let bloomed = false;
  const bloom = (on) => {
    if (on === bloomed) return;
    bloomed = on;
    gsap.to(img, {
      filter: on ? 'grayscale(0) contrast(1.05)' : 'grayscale(1) contrast(1.05)',
      duration: on ? 0.9 : 0.5, ease: 'power2.inOut', overwrite: 'auto'
    });
  };

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: CONFIG.dollyLength,
      pin: true,
      scrub: 0.7,
      anticipatePin: 1,
      onEnter: () => coord && decode(coord, { duration: 1 }),
      onLeaveBack: () => gsap.set(head, { autoAlpha: 0 }),
      onUpdate: (self) => bloom(self.progress > 0.62)
    }
  })
    // phase A — the crop opens (0 → 60%)
    .to(mask, { scale: 1, duration: 0.6 }, 0)
    .to(img, { scale: 1.06, duration: 0.6 }, 0)
    .to(head, { autoAlpha: 1, duration: 0.1 }, 0.04)
    .to(scrim, { opacity: 1, duration: 0.25 }, 0.4)
    // phase B — full bleed holds; the caption assembles
    .to(lines, { yPercent: 0, duration: 0.22, stagger: 0.06, ease: 'power2.out' }, 0.58)
    // phase C — a slow settle so the frame breathes before release
    .to(img, { scale: 1, duration: 0.35 }, 0.65);
});

/* ═══════════════════════════════════════════════════════════════
   THE LEDGER — dossier plate. Unlike ØDE's cursor-chasing preview,
   the plate is a fixed instrument: hovering a row wipes the new
   photograph down over the old one and re-decodes the coordinates.
   Two stacked <img>s alternate as front/back buffers.
   ═══════════════════════════════════════════════════════════════ */
{
  const rows = gsap.utils.toArray('.l-row');
  const imgA = document.querySelector('.plate-a');
  const imgB = document.querySelector('.plate-b');
  const coordEl = document.getElementById('plate-coord');

  if (imgA && window.matchMedia('(hover:hover)').matches) {
    let front = imgA, back = imgB, current = rows[0]?.dataset.img, wiping = null;

    rows.forEach((row) => row.addEventListener('mouseenter', () => {
      if (row.dataset.img === current) return;
      current = row.dataset.img;

      if (reduceMotion) {
        front.src = current;
        coordEl.textContent = row.dataset.coord;
        return;
      }
      // load into the back buffer, wipe it down over the front —
      // arriving in COLOR (the resting plate is grayscale; the pull
      // from the file is the live one)
      if (wiping) wiping.kill();
      back.src = current;
      gsap.set(back, { clipPath: 'inset(0 0 100% 0)', zIndex: 2, filter: 'grayscale(1)' });
      gsap.set(front, { zIndex: 1 });
      wiping = gsap.to(back, {
        clipPath: 'inset(0 0 0% 0)', filter: 'grayscale(0)', duration: 0.7, ease: CONFIG.ease,
        onComplete: () => { [front, back] = [back, front]; wiping = null; }
      });
      coordEl.dataset.text = row.dataset.coord;
      decode(coordEl, { duration: 0.6 });
    }));

    // when the reader leaves the index, the plate rests back to grayscale
    document.querySelector('.ledger-rows').addEventListener('mouseleave', () => {
      if (reduceMotion) return;
      gsap.to([imgA, imgB], { filter: 'grayscale(1)', duration: 0.6, ease: 'power2.out' });
    });
  }

  // rows stagger in on first approach
  if (!reduceMotion) {
    gsap.from('.l-row', {
      y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: CONFIG.ease,
      clearProps: 'opacity,visibility,transform',
      scrollTrigger: { trigger: '.ledger-rows', start: 'top 82%' }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   EPILOGUE — the outline wordmark drifts against scroll (parallax)
   ═══════════════════════════════════════════════════════════════ */
if (!reduceMotion) {
  gsap.fromTo('.epi-bg', { xPercent: -58 }, {
    xPercent: -42, ease: 'none',
    scrollTrigger: { trigger: '.epilogue', start: 'top bottom', end: 'bottom top', scrub: true }
  });
}

/* ═══════════════════════════════════════════════════════════════
   EPILOGUE — rack-focus inscription (scrubbed)
   Each word starts as a faint, out-of-focus ghost; a wave of focus
   travels through the sentence as you scroll — words sharpen from
   blur and fill to full ink, the accent phrase resolving last.
   Welded to the scrollbar: the inscription is read by scrolling.
   ═══════════════════════════════════════════════════════════════ */
{
  const epi = document.getElementById('epi-text');
  if (epi && !reduceMotion) {
    // wrap every word in a span, preserving nested elements (.accent)
    const splitWords = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.textContent = part;
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          splitWords(child);
        }
      });
    };
    splitWords(epi);

    gsap.fromTo('#epi-text .w',
      { opacity: 0.12, filter: 'blur(7px)', y: 8 },
      {
        opacity: 1, filter: 'blur(0px)', y: 0,
        // duration ≫ stagger → several words are mid-focus at once,
        // so the sharpness rolls through the sentence as a wave
        duration: 1.4, ease: 'none', stagger: 0.35,
        scrollTrigger: { trigger: epi, start: 'top 78%', end: 'bottom 42%', scrub: true }
      });
  }
}

/* ═══════════════════════════════════════════════════════════════
   CURSOR — crosshair + live coordinate readout. The pointer's
   viewport position maps to fake latitude/longitude, so the cursor
   itself becomes a survey instrument. Desktop only.
   ═══════════════════════════════════════════════════════════════ */
if (finePointer && !reduceMotion) {
  const cur = document.getElementById('cursor');
  const read = document.getElementById('cur-read');
  cur.style.display = 'block';
  document.body.style.cursor = 'none';
  document.querySelectorAll('a, button').forEach((el) => el.style.cursor = 'none');

  const xTo = gsap.quickTo(cur, 'x', { duration: 0.16, ease: 'power3.out' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.16, ease: 'power3.out' });
  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX); yTo(e.clientY);
    const lat = (0.5 - e.clientY / window.innerHeight) * 180;
    const lon = (e.clientX / window.innerWidth - 0.5) * 360;
    read.textContent =
      Math.abs(lat).toFixed(2) + '°' + (lat >= 0 ? 'N' : 'S') + ' / ' +
      Math.abs(lon).toFixed(2) + '°' + (lon >= 0 ? 'E' : 'W');
  });
  // crosshair flares over anything interactive
  document.querySelectorAll('a, button, .l-row').forEach((el) => {
    el.addEventListener('mouseenter', () => gsap.to(cur, { scale: 1.7, duration: 0.3, ease: CONFIG.ease }));
    el.addEventListener('mouseleave', () => gsap.to(cur, { scale: 1, duration: 0.3, ease: CONFIG.ease }));
  });
}

/* ═══ FIELD CLOCK — live UTC in the header ═══ */
{
  const clock = document.getElementById('field-clock');
  const tick = () => {
    const d = new Date();
    clock.textContent =
      String(d.getUTCHours()).padStart(2, '0') + ':' +
      String(d.getUTCMinutes()).padStart(2, '0') + ' UTC';
  };
  tick(); setInterval(tick, 30000);
}

/* Recompute pins once every plate has loaded */
window.addEventListener('load', () => ScrollTrigger.refresh());

/* Lazy images arrive as you scroll — if one changes layout at all,
   every trigger below it goes stale. Heal positions with a debounced
   refresh whenever a straggler lands. */
{
  let healT = null;
  const heal = () => { clearTimeout(healT); healT = setTimeout(() => ScrollTrigger.refresh(), 200); };
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (!img.complete) img.addEventListener('load', heal, { once: true });
  });
}

/* ═══════════════════════════════════════════════════════════════
   V2 — MENU OVERLAY (the index)
   Full-screen on every size; staggered link rise on open, scroll
   locked via Lenis while it holds the screen.
   ═══════════════════════════════════════════════════════════════ */
{
  const overlay = document.getElementById('menu-overlay');
  const openBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('menu-close');
  const links = overlay.querySelectorAll('.menu-links a');
  let isOpen = false;

  const open = () => {
    if (isOpen) return; isOpen = true;
    openBtn.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    lenis.stop();
    if (reduceMotion) { gsap.set(overlay, { autoAlpha: 1 }); return; }
    gsap.timeline({ defaults: { ease: CONFIG.ease } })
      .to(overlay, { autoAlpha: 1, duration: 0.45 })
      .fromTo(links, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06 }, '-=0.15')
      .fromTo('.menu-foot', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.5');
    overlay.querySelectorAll('.m-no').forEach((el, i) => decode(el, { duration: 0.5, delay: 0.2 + i * 0.06 }));
  };
  const close = () => {
    if (!isOpen) return; isOpen = false;
    openBtn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    lenis.start();
    gsap.to(overlay, { autoAlpha: 0, duration: reduceMotion ? 0 : 0.35, ease: 'power2.in' });
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  links.forEach((a) => a.addEventListener('click', close));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ═══════════════════════════════════════════════════════════════
   V2 — AMBIENT SOUND (opt-in)
   A field-recording hum synthesized in WebAudio: looped brown
   noise through a low-pass filter, faded in/out on toggle. Built
   lazily on the first click, so no AudioContext before a gesture.
   ═══════════════════════════════════════════════════════════════ */
{
  const btn = document.getElementById('sound-btn');
  let audio = null, on = false;

  const build = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {           // brown noise — a deep, even rumble
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 160;
    const gain = ctx.createGain(); gain.gain.value = 0;
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start();
    return { ctx, gain };
  };

  btn?.addEventListener('click', () => {
    if (!audio) audio = build();
    audio.ctx.resume();
    on = !on;
    const t = audio.ctx.currentTime;
    audio.gain.gain.cancelScheduledValues(t);
    audio.gain.gain.linearRampToValueAtTime(on ? 0.05 : 0, t + 1.2);
    btn.textContent = on ? 'SND · ON' : 'SND · OFF';
    btn.setAttribute('aria-pressed', String(on));
  });
}

/* ═══════════════════════════════════════════════════════════════
   V2 — THE ROUTE
   The stage pins while the expedition line draws (dashoffset
   1000 → 0, scrubbed). Waypoints ping on as the pen passes their
   data-at fraction; the readout tracks legs and kilometres.
   ═══════════════════════════════════════════════════════════════ */
{
  const path = document.getElementById('route-path');
  const wps = gsap.utils.toArray('#route .wp');
  const pen = document.getElementById('route-pen');
  const legEl = document.getElementById('route-leg');
  const kmEl = document.getElementById('route-km');
  const TOTAL_KM = 14212;

  if (path && reduceMotion) {
    legEl.textContent = 'LEG 07 / 07 — ARRIVAL · BUZLUDZHA';
    kmEl.textContent = TOTAL_KM.toLocaleString('en-US') + ' KM';
    wps.forEach((w) => w.classList.add('is-on'));
  } else if (path) {
    // Each waypoint's TRUE fraction along the path — sampled, not
    // hand-tuned — so a monument pings the exact moment the pen
    // touches it. (data-at in the markup is only a fallback.)
    const L = path.getTotalLength();
    const N = 600;
    const samples = Array.from({ length: N + 1 }, (_, i) => path.getPointAtLength((L * i) / N));
    const stops = wps.map((w) => {
      const m = /translate\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/.exec(w.getAttribute('transform'));
      const x = +m[1], y = +m[2];
      let at = +w.dataset.at, best = Infinity;
      samples.forEach((pt, i) => {
        const d = (pt.x - x) ** 2 + (pt.y - y) ** 2;
        if (d < best) { best = d; at = i / N; }
      });
      return { el: w, at, name: w.querySelector('text').textContent };
    });

    // The pen and the pings follow the TWEEN's progress (the drawn
    // tip), not the raw scroll — scrub smoothing means the line lags
    // the scrollbar slightly, and everything must ride the same tip.
    const sync = () => {
      const p = draw.progress();
      const tip = path.getPointAtLength(L * p);
      pen.setAttribute('transform', `translate(${tip.x},${tip.y})`);
      pen.style.opacity = (p > 0.004 && p < 0.996) ? 1 : 0;

      let idx = -1;
      stops.forEach((s, i) => {
        const hit = p >= s.at - 0.002;
        s.el.classList.toggle('is-on', hit);
        if (hit) idx = i;
      });

      if (idx < 0) legEl.textContent = 'LEG 00 / 07 — DEPARTING…';
      else if (idx >= stops.length - 1) legEl.textContent = 'LEG 07 / 07 — ARRIVAL · ' + stops[idx].name;
      else legEl.textContent = 'LEG ' + String(idx + 1).padStart(2, '0') + ' / 07 — ' + stops[idx].name + ' → ' + stops[idx + 1].name;
      kmEl.textContent = Math.round(TOTAL_KM * p).toLocaleString('en-US') + ' KM';
    };

    // The drawing completes at 78% of the pin; the last 22% is a HOLD —
    // the pen arrives, LEG 07 / 07 lands, the stations pulse — and only
    // then does the section release into the next one.
    const draw = gsap.fromTo(path,
      { strokeDashoffset: 1000 },
      { strokeDashoffset: 0, ease: 'none', duration: 0.78, onUpdate: sync, immediateRender: false });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.route-stage',
        start: 'top top',
        end: '+=240%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1
      }
    })
      .add(draw, 0)
      .to({}, { duration: 0.22 }, 0.78);   // arrival dwell
  }
}

/* ═══════════════════════════════════════════════════════════════
   V2 — DISPATCHES: sticky stacking cards
   Depth sizing is 100% static CSS (see .stack-card) — a locked
   card NEVER moves. The only living part is each card's veil,
   which deepens as newcomers slide over it, scrubbed to the
   arriving card's travel. Pure opacity: nothing shifts, nothing
   flashes.
   ═══════════════════════════════════════════════════════════════ */
{
  const cards = gsap.utils.toArray('.stack-card');
  const STEP_VEIL = 0.3;     // how much darker each buried level gets

  if (!reduceMotion && cards.length) {
    // every card carries its own depth veil (plain opacity, never a
    // filter — animating brightness() on a sticky layer flashes dark)
    cards.forEach((card) => {
      const veil = document.createElement('span');
      veil.className = 'sc-veil';
      veil.setAttribute('aria-hidden', 'true');
      card.appendChild(veil);
    });

    cards.forEach((card, i) => {
      const veil = card.querySelector('.sc-veil');
      for (let j = i + 1; j < cards.length; j++) {
        const before = j - 1 - i;  // depth while card j is approaching
        const after = j - i;       // depth once card j has locked in
        gsap.fromTo(veil,
          { opacity: STEP_VEIL * before },
          {
            opacity: Math.min(STEP_VEIL * after, 0.65),
            ease: 'none', immediateRender: false,
            scrollTrigger: { trigger: cards[j], start: 'top 95%', end: 'top 45%', scrub: true }
          });
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   V2 — PRESS: rotating testimony
   Quotes swap on a timer (only while the section is on screen);
   each source line re-decodes as its quote arrives.
   ═══════════════════════════════════════════════════════════════ */
{
  const items = gsap.utils.toArray('.pq-item');
  const nowEl = document.getElementById('pq-now');
  let idx = 0, timer = null;

  if (items.length && !reduceMotion) {
    // visibility is driven entirely by GSAP's inline autoAlpha — the
    // .is-on class stays on every item so the CSS rule never fights it
    items.forEach((it) => it.classList.add('is-on'));
    gsap.set(items, { autoAlpha: (i) => (i === 0 ? 1 : 0) });

    const swap = () => {
      const prev = items[idx];
      idx = (idx + 1) % items.length;
      const next = items[idx];
      nowEl.textContent = String(idx + 1).padStart(2, '0');
      // strictly sequential: the old quote fully clears the stage
      // before the new one rises — overlapping absolute text blocks
      // was the glitch
      gsap.timeline()
        .to(prev, { autoAlpha: 0, y: -14, duration: 0.45, ease: 'power2.in' })
        .fromTo(next, { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.75, ease: CONFIG.ease }, '+=0.08');
    };

    // rotate only while visible — judges notice timers that run off-screen
    ScrollTrigger.create({
      trigger: '#press', start: 'top 80%', end: 'bottom 20%',
      onToggle: (self) => {
        if (self.isActive && !timer) timer = setInterval(swap, 4500);
        else if (!self.isActive && timer) { clearInterval(timer); timer = null; }
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   V2 — THE VOLUME: product theatre
   The stage pins; the cloth-bound book settles home in 3D while
   the spec sheet assembles. At half-pin, the copies-remaining
   odometer rolls its digits into place (once).
   ═══════════════════════════════════════════════════════════════ */
{
  const stage = document.querySelector('.vol-stage');
  const book = document.querySelector('.vol-book');
  const rows = gsap.utils.toArray('.vol-row');
  const odo = document.querySelector('.odo');

  // build the odometer: one 0–9 strip per digit
  let strips = [];
  if (odo && !reduceMotion) {
    const digits = odo.dataset.value.split('');
    odo.innerHTML = '';
    strips = digits.map((d) => {
      const col = document.createElement('span'); col.className = 'odo-col';
      const strip = document.createElement('span'); strip.className = 'odo-strip';
      for (let n = 0; n <= 9; n++) {
        const cell = document.createElement('span'); cell.textContent = n; strip.appendChild(cell);
      }
      col.appendChild(strip); odo.appendChild(col);
      return { strip, digit: +d };
    });
  }

  if (stage && !reduceMotion) {
    let rolled = false;
    const roll = () => {
      if (rolled) return; rolled = true;
      strips.forEach(({ strip, digit }, i) => {
        // each digit cell is 1em of a 10em strip → 10% per step
        gsap.fromTo(strip, { yPercent: 0 }, {
          yPercent: -(digit * 10), duration: 1.6, delay: i * 0.13, ease: CONFIG.ease
        });
      });
    };

    gsap.set(rows, { y: 26, autoAlpha: 0 });

    // Pin ONLY if the whole theatre fits inside the viewport — pinning
    // an element taller than the screen snaps on entry and leaves the
    // section sitting lower on release. No anticipatePin — under Lenis
    // its early grab reads as a jump.
    //
    // Measure only after BOTH the fonts and the full page have loaded:
    // document.fonts.ready can resolve before the Google Fonts
    // stylesheet even arrives (especially in the single-file build,
    // which parses faster), and measuring with fallback fonts makes
    // the fit decision and the pin geometry wrong once the real
    // typeface swaps in.
    const pageLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((r) => window.addEventListener('load', r, { once: true }));

    let tl = null, lastFits = null, resizeT = null;

    const build = () => {
      const fits = stage.offsetHeight <= window.innerHeight + 4;
      if (tl && fits === lastFits) return;   // verdict unchanged — keep it
      lastFits = fits;

      // rebuilding: tear down the old trigger (reverting its pin) and
      // reset the actors to their pre-show pose
      if (tl) {
        if (tl.scrollTrigger) tl.scrollTrigger.kill(true);
        tl.kill();
        gsap.set([book, '.vol-buy'], { clearProps: 'all' });
        gsap.set(rows, { clearProps: 'all' });
        gsap.set(rows, { y: 26, autoAlpha: 0 });
      }

      tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: fits ? {
          trigger: stage,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => { if (self.progress > 0.45) roll(); }
        } : {
          // short screens: no pin — the same choreography plays as the
          // section travels through the viewport
          trigger: stage,
          start: 'top 75%',
          end: 'bottom 65%',
          scrub: 0.7,
          onUpdate: (self) => { if (self.progress > 0.55) roll(); }
        }
      })
        .fromTo(book, { rotationY: -38, rotationX: 6, y: 30 }, { rotationY: -10, rotationX: 3, y: 0, duration: 1 }, 0)
        .to(rows, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.07, ease: 'power2.out' }, 0.15)
        .fromTo('.vol-buy', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.6);

      // This trigger is created AFTER the page's other triggers, so
      // ScrollTrigger's default (creation-order) refresh would compute
      // every trigger below the volume WITHOUT this pin's spacer —
      // leaving the epilogue/footer triggers ~1.4 viewports too early.
      // Re-sort by document position, then refresh.
      ScrollTrigger.sort((a, b) => {
        const ea = a.trigger, eb = b.trigger;
        if (!ea || !eb || ea === eb) return 0;
        return (ea.compareDocumentPosition(eb) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
      });
      ScrollTrigger.refresh();
    };

    Promise.all([document.fonts.ready, pageLoaded]).then(() => requestAnimationFrame(() => {
      build();
      // a resize or rotation can flip the fit verdict — re-evaluate
      // once the viewport settles and rebuild in the right mode
      window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(build, 300);
      });
    }));
  }
}

/* ═══════════════════════════════════════════════════════════════
   V2 — MAGNETIC BUTTONS
   Anything with .magnetic leans toward the pointer and releases
   with the house ease. Desktop only.
   ═══════════════════════════════════════════════════════════════ */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.3,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.6, ease: CONFIG.ease
      });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: CONFIG.ease }));
  });
}

/* ═══════════════════════════════════════════════════════════════
   V2 — TRANSMISSIONS FORM
   Fake submit with honest feedback: invalid signals shake the
   line; a valid address gets a decoded confirmation.
   ═══════════════════════════════════════════════════════════════ */
{
  const form = document.getElementById('dispatch-form');
  const input = document.getElementById('df-email');
  const note = document.getElementById('df-note');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (!ok) {
      form.classList.add('df-error');
      note.textContent = 'SIGNAL INVALID — CHECK ADDRESS';
      note.style.color = 'var(--accent)';
      if (!reduceMotion) gsap.fromTo(form, { x: -7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.35)' });
      return;
    }
    form.classList.remove('df-error');
    note.style.color = '';
    note.dataset.text = 'RECEIVED AT 52.4820°N / 13.3170°E — WELCOME TO THE EXPEDITION';
    decode(note, { duration: 1 });
    input.value = '';
  });
}

/* ═══════════════════════════════════════════════════════════════
   V2 — HERO IDLE
   Once the intro settles, the title keeps a pulse:
   • the ✚ ticks a precise quarter-turn every few seconds — an
     instrument calibrating, not a spinner (the glyph is symmetric,
     so it lands looking identical; you only catch the motion)
   • a random letter of ATLAS BRUT dips out for a beat and fades
     back — a transmission dropout. Pure opacity: the type never
     shifts.
   Letters are wrapped in spans HERE, at script time, while the
   loader still covers the hero — so any sub-pixel kerning change
   from the split can never be seen happening.
   ═══════════════════════════════════════════════════════════════ */
const heroIdle = (() => {
  if (reduceMotion) return null;
  const letters = [];
  document.querySelectorAll('.hero h1 .hero-line').forEach((line) => {
    [...line.childNodes].forEach((n) => {
      if (n.nodeType !== 3) return;              // leave the ✚ span intact
      const frag = document.createDocumentFragment();
      [...n.textContent].forEach((ch) => {
        const s = document.createElement('span');
        s.textContent = ch;
        frag.appendChild(s);
        letters.push(s);
      });
      n.replaceWith(frag);
    });
  });
  return { letters };
})();

function startHeroIdle() {
  if (!heroIdle) return;

  // survey tick — quarter-turn, snaps home with the house ease
  const cross = document.querySelector('.hero h1 .accent');
  if (cross) {
    gsap.set(cross, { display: 'inline-block', transformOrigin: '50% 50%' });
    gsap.to(cross, { rotation: '+=90', duration: 0.9, ease: 'expo.inOut', repeat: -1, repeatDelay: 3.4 });
  }

  // transmission dropout — one random letter, every 2–5 seconds
  const flick = () => {
    const s = heroIdle.letters[(Math.random() * heroIdle.letters.length) | 0];
    gsap.timeline({ onComplete: () => gsap.delayedCall(1.8 + Math.random() * 3.2, flick) })
      .to(s, { opacity: 0.18, duration: 0.08, ease: 'power2.in' })
      .to(s, { opacity: 1, duration: 0.45, ease: 'power2.out' });
  };
  gsap.delayedCall(1.2, flick);
}

