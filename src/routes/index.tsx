import { createFileRoute } from "@tanstack/react-router";
import { useEffect, type CSSProperties } from "react";
import "@/atlas-brut/atlas-brut.css";

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230C0D0F'/%3E%3Cline x1='50' y1='14' x2='50' y2='86' stroke='%23E7E3DA' stroke-width='5'/%3E%3Cline x1='14' y1='50' x2='86' y2='50' stroke='%23E7E3DA' stroke-width='5'/%3E%3Ccircle cx='50' cy='50' r='9' fill='%23FF4A1F'/%3E%3C/svg%3E";

const DESCRIPTION =
  "ATLAS BRUT — a photographic expedition through the great concrete monuments of the 20th century. Coordinates, plates, and field notes.";
const TITLE = "ATLAS BRUT — A Field Guide to Concrete Monuments";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#0C0D0F" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: FAVICON },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
    scripts: [
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" },
      { src: "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" },
      { src: "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" },
    ],
  }),
  component: AtlasBrut,
});

function AtlasBrut() {
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__atlasIntroDone = false;
    const failsafe = window.setTimeout(() => {
      if (!w.__atlasIntroDone) {
        const l = document.getElementById("loader");
        if (l) l.style.display = "none";
        document.body.style.overflow = "";
        // eslint-disable-next-line no-console
        console.warn("[ATLAS] intro did not complete — revealed page via fail-safe.");
      }
    }, 6000);

    let scriptEl: HTMLScriptElement | null = null;
    let cancelled = false;

    const loadAtlas = () => {
      if (cancelled) return;
      if (w.gsap && w.ScrollTrigger && w.Lenis) {
        if (w.__atlasScriptLoaded) return;
        w.__atlasScriptLoaded = true;
        scriptEl = document.createElement("script");
        scriptEl.src = "/atlas-brut.js";
        scriptEl.async = false;
        document.body.appendChild(scriptEl);
      } else {
        window.setTimeout(loadAtlas, 50);
      }
    };
    loadAtlas();

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
    };
  }, []);

  return (
    <>

{/* ░░ GRAIN — film-plate texture over everything ░░ */}
<div id="grain" aria-hidden="true"></div>

{/* ░░ LOADER — decoding console + curtain split ░░ */}
<div id="loader" aria-hidden="true">
  <div className="loader-half loader-left"></div>
  <div className="loader-half loader-right"></div>
  <div className="loader-console mono">
    <p id="loader-title" data-text="ATLAS BRUT — FIELD RECORD">████ ████ — ████ ██████</p>
    <p id="loader-coords">00.0000° N / 000.0000° W</p>
  </div>
</div>

{/* Fail-safe: if a CDN never loads or the intro errors, reveal the page after 6s */}

{/* ░░ CURSOR — crosshair with live coordinate readout ░░ */}
<div id="cursor" aria-hidden="true">
  <span className="cur-v"></span><span className="cur-h"></span><span className="cur-dot"></span>
  <span id="cur-read" className="mono">00.00° / 00.00°</span>
</div>

{/* ░░ MERIDIAN RAIL — latitude instrument, replaces the usual progress bar ░░ */}
<aside id="rail" aria-hidden="true">
  <span className="rail-cap mono">N</span>
  <div className="rail-line">
    <div className="rail-fill"></div>
    <div className="rail-dot"></div>
  </div>
  <span className="rail-cap mono">S</span>
  <span id="rail-read" className="mono">66.5600°N</span>
</aside>

{/* ░░ HEADER ░░ */}
<header id="site-header">
  <a href="#" className="wordmark">ATLAS<span className="accent">✚</span>BRUT</a>
  <nav className="mono">
    <a href="#ch-01">Monuments</a>
    <a href="#route">Route</a>
    <a href="#ledger">Ledger</a>
    <a href="#dispatches">Dispatches</a>
    <a href="#volume">Volume</a>
  </nav>
  <div className="head-tools">
    <button id="sound-btn" className="mono" aria-pressed="false" aria-label="Toggle ambient sound">SND · OFF</button>
    <p id="field-clock" className="mono">—:— UTC</p>
    <a href="#volume" className="pill mono">Pre-order</a>
    <button id="menu-btn" aria-label="Open index" aria-expanded="false" aria-controls="menu-overlay"><span></span><span></span></button>
  </div>
</header>

{/* ░░ MENU OVERLAY — the index. Full-screen on every size; doubles as mobile nav ░░ */}
<div id="menu-overlay" aria-hidden="true">
  <div className="menu-top">
    <span className="wordmark">ATLAS<span className="accent">✚</span>BRUT</span>
    <button id="menu-close" className="mono" aria-label="Close index">CLOSE ✕</button>
  </div>
  <nav className="menu-links">
    <a href="#ch-01"><span className="mono m-no">01</span><span className="m-name">Monuments</span></a>
    <a href="#route"><span className="mono m-no">02</span><span className="m-name">Route</span></a>
    <a href="#ledger"><span className="mono m-no">03</span><span className="m-name">Ledger</span></a>
    <a href="#dispatches"><span className="mono m-no">04</span><span className="m-name">Dispatches</span></a>
    <a href="#volume"><span className="mono m-no">05</span><span className="m-name">The Volume</span></a>
    <a href="#contact"><span className="mono m-no">06</span><span className="m-name">Expedition</span></a>
  </nav>
  <div className="menu-foot mono dim">
    <span>ATLAS BRUT — INDEX</span>
    <span>52.4820°N / 13.3170°E</span>
  </div>
</div>

<main>

{/* ░░ HERO — rack-focus title: blurred and oversized, snaps into focus ░░ */}
<section className="hero" data-tint="#0C0D0F">
  <p className="hero-label mono" data-decode="">FIELD GUIDE — 20TH CENTURY CONCRETE</p>
  <h1>
    <span className="hero-line focus-line">ATLAS</span>
    <span className="hero-line focus-line">BRUT<span className="accent">✚</span></span>
  </h1>
  <div className="hero-foot">
    <p className="hero-desc">Seven monuments. Three continents. One material that refuses to apologise. A photographic expedition through the concrete century — surveyed, plated, and filed.</p>
    <p className="mono dim" data-decode="">SCROLL TO DESCEND — 66.56°N → 42.73°N</p>
  </div>
</section>

{/* ░░ PROLOGUE — short field note, masked line rise ░░ */}
<section className="prologue" data-tint="#0C0D0F">
  <p className="mono dim sec-label" data-decode="">PROLOGUE / HOW TO READ THIS ATLAS</p>
  <p className="prologue-text">
    <span className="line-mask"><span className="line">Every monument in this record is approached the same way:</span></span>
    <span className="line-mask"><span className="line">from a distance, through the viewfinder, until the concrete</span></span>
    <span className="line-mask"><span className="line">fills the frame and there is nowhere left to look.</span></span>
  </p>
</section>

{/* ░░ CHAPTER 01 — dolly-zoom: framed slide grows to swallow the viewport ░░ */}
<section className="chapter" id="ch-01" data-tint="#0D0F13">
  <div className="ch-stage">
    <div className="ch-mask">
      <img className="ch-img" src="https://images.unsplash.com/photo-1672191189482-012f0157b3d9?w=3840&q=80" alt="Geisel Library — raking concrete piers" loading="lazy" decoding="async" />
      <div className="ch-scrim"></div>
    </div>
    <div className="ch-head mono">
      <span className="ch-no">MONUMENT 01 / 07</span>
      <span className="ch-coord" data-decode="">32.8810°N / 117.2376°W</span>
    </div>
    <div className="ch-meta">
      <h2 className="ch-title"><span className="line-mask"><span className="line">Geisel Library</span></span></h2>
      <p className="ch-facts mono"><span className="line-mask"><span className="line">WILLIAM L. PEREIRA — 1970 — LA JOLLA, US</span></span></p>
      <p className="ch-desc"><span className="line-mask"><span className="line">A lantern of concrete and glass held out over the canyon</span></span><span className="line-mask"><span className="line">on eight raking piers — a spaceship that chose to become a library.</span></span></p>
    </div>
  </div>
</section>

{/* ░░ CHAPTER 02 ░░ */}
<section className="chapter" id="ch-02" data-tint="#101312">
  <div className="ch-stage">
    <div className="ch-mask">
      <img className="ch-img" src="https://images.unsplash.com/photo-1701455103645-705f6ab68ed8?w=3840&q=80" alt="Habitat 67 — stacked modular volumes" loading="lazy" decoding="async" />
      <div className="ch-scrim"></div>
    </div>
    <div className="ch-head mono">
      <span className="ch-no">MONUMENT 02 / 07</span>
      <span className="ch-coord" data-decode="">45.5017°N / 73.5540°W</span>
    </div>
    <div className="ch-meta">
      <h2 className="ch-title"><span className="line-mask"><span className="line">Habitat 67</span></span></h2>
      <p className="ch-facts mono"><span className="line-mask"><span className="line">MOSHE SAFDIE — 1967 — MONTREAL, CA</span></span></p>
      <p className="ch-desc"><span className="line-mask"><span className="line">Three hundred and fifty-four boxes stacked against gravity,</span></span><span className="line-mask"><span className="line">each one lending its roof to a stranger's garden.</span></span></p>
    </div>
  </div>
</section>

{/* ░░ CHAPTER 03 ░░ */}
<section className="chapter" id="ch-03" data-tint="#14100C">
  <div className="ch-stage">
    <div className="ch-mask">
      <img className="ch-img" src="https://images.unsplash.com/photo-1630007808426-7be055a4e7e1?w=3840&q=80" alt="Buzludzha — abandoned concrete monument" loading="lazy" decoding="async" />
      <div className="ch-scrim"></div>
    </div>
    <div className="ch-head mono">
      <span className="ch-no">MONUMENT 03 / 07</span>
      <span className="ch-coord" data-decode="">42.7358°N / 25.3937°E</span>
    </div>
    <div className="ch-meta">
      <h2 className="ch-title"><span className="line-mask"><span className="line">Buzludzha</span></span></h2>
      <p className="ch-facts mono"><span className="line-mask"><span className="line">GEORGI STOILOV — 1981 — KAZANLAK, BG</span></span></p>
      <p className="ch-desc"><span className="line-mask"><span className="line">A saucer of concrete left to the frost at 1,432 metres —</span></span><span className="line-mask"><span className="line">the century's most confident ruin.</span></span></p>
    </div>
  </div>
</section>

{/* ░░ THE ROUTE — pinned survey map; the expedition line draws itself and
     waypoints ping on as the pen passes them. Covers all seven monuments. ░░ */}
<section id="route" data-tint="#0D1013">
  <div className="route-stage">
    <div className="route-head">
      <p className="mono dim sec-label" data-decode="">THE ROUTE / SEVEN LEGS — 14,212 KM</p>
      <h2 className="sec-title">One line through<br />the concrete century.</h2>
    </div>
    <div className="route-map">
      <svg viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* graticule */}
        <g className="graticule">
          <line x1="100" y1="0" x2="100" y2="640"></line><line x1="200" y1="0" x2="200" y2="640"></line>
          <line x1="300" y1="0" x2="300" y2="640"></line><line x1="400" y1="0" x2="400" y2="640"></line>
          <line x1="500" y1="0" x2="500" y2="640"></line><line x1="600" y1="0" x2="600" y2="640"></line>
          <line x1="700" y1="0" x2="700" y2="640"></line><line x1="800" y1="0" x2="800" y2="640"></line>
          <line x1="900" y1="0" x2="900" y2="640"></line><line x1="1000" y1="0" x2="1000" y2="640"></line>
          <line x1="1100" y1="0" x2="1100" y2="640"></line>
          <line x1="0" y1="80" x2="1200" y2="80"></line><line x1="0" y1="160" x2="1200" y2="160"></line>
          <line x1="0" y1="240" x2="1200" y2="240"></line><line x1="0" y1="320" x2="1200" y2="320"></line>
          <line x1="0" y1="400" x2="1200" y2="400"></line><line x1="0" y1="480" x2="1200" y2="480"></line>
          <line x1="0" y1="560" x2="1200" y2="560"></line>
          {/* latitude ticks — the grid earns its keep */}
          <text x="8" y="74">70°N</text><text x="8" y="154">60°N</text>
          <text x="8" y="234">50°N</text><text x="8" y="314">40°N</text>
          <text x="8" y="394">30°N</text><text x="8" y="474">20°N</text>
          <text x="8" y="554">10°N</text>
        </g>
        {/* the expedition line — straight survey legs, dashoffset scrubbed 1000 → 0 */}
        <path id="route-path" pathLength="1000" d="M140,520 L400,350 L480,210 L760,150 L860,330 L990,260 L1080,380"></path>
        {/* waypoints spread across the full grid; every label sits on the
             side of its dot that the line does NOT pass through */}
        <g className="wp" data-at="0.01" transform="translate(140,520)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="16" y="26">GEISEL LIBRARY</text></g>
        <g className="wp" data-at="0.25" transform="translate(400,350)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="16" y="26">BOSTON CITY HALL</text></g>
        <g className="wp" data-at="0.37" transform="translate(480,210)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="30">HABITAT 67</text></g>
        <g className="wp" data-at="0.60" transform="translate(760,150)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="-16">BARBICAN ESTATE</text></g>
        <g className="wp" data-at="0.76" transform="translate(860,330)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="30">UNITÉ D'HABITATION</text></g>
        <g className="wp" data-at="0.88" transform="translate(990,260)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="-16">WESTERN CITY GATE</text></g>
        <g className="wp" data-at="0.99" transform="translate(1080,380)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="30" textAnchor="end">BUZLUDZHA</text></g>
        {/* the survey pen — rides the tip of the line as it draws */}
        <g id="route-pen"><circle className="pen-ring" r="9"></circle><circle className="pen-dot" r="3.5"></circle></g>
      </svg>
      <p className="route-read mono">
        <span id="route-leg">LEG 00 / 07</span>
        <span id="route-km" className="accent">0 KM</span>
      </p>
    </div>
  </div>
</section>

{/* ░░ THE LEDGER — index rows + fixed dossier plate that swaps on hover ░░ */}
<section id="ledger" data-tint="#0E1011">
  <div className="ledger-head">
    <p className="mono dim sec-label" data-decode="">THE LEDGER / ALL FILED MONUMENTS</p>
    <h2 className="sec-title">Seven entries,<br />filed by latitude.</h2>
  </div>
  <div className="ledger-grid">
    <ul className="ledger-rows">
      <li><button className="l-row" data-img="https://images.unsplash.com/photo-1527576539890-dfa815648363?q=80&w=1200&auto=format&fit=crop" data-coord="32.8810°N / 117.2376°W">
        <span className="l-no mono">00</span>
        <span className="l-name">Geisel Library</span>
        <span className="l-meta mono">LA JOLLA, US · 1970</span>
      </button></li>
      <li><button className="l-row" data-img="https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=1200&auto=format&fit=crop" data-coord="45.5017°N / 73.5540°W">
        <span className="l-no mono">01</span>
        <span className="l-name">Habitat 67</span>
        <span className="l-meta mono">MONTREAL, CA · 1967</span>
      </button></li>
      <li><button className="l-row" data-img="https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1200&auto=format&fit=crop" data-coord="51.5202°N / 0.0937°W">
        <span className="l-no mono">02</span>
        <span className="l-name">Barbican Estate</span>
        <span className="l-meta mono">LONDON, UK · 1976</span>
      </button></li>
      <li><button className="l-row" data-img="https://images.unsplash.com/photo-1460574283810-2aab119d8511?q=80&w=1200&auto=format&fit=crop" data-coord="42.3603°N / 71.0580°W">
        <span className="l-no mono">03</span>
        <span className="l-name">Boston City Hall</span>
        <span className="l-meta mono">BOSTON, US · 1968</span>
      </button></li>
      <li><button className="l-row" data-img="https://images.unsplash.com/photo-1431576901776-e539bd916ba2?q=80&w=1200&auto=format&fit=crop" data-coord="43.2612°N / 5.3964°E">
        <span className="l-no mono">04</span>
        <span className="l-name">Unité d'Habitation</span>
        <span className="l-meta mono">MARSEILLE, FR · 1952</span>
      </button></li>
      <li><button className="l-row" data-img="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop" data-coord="42.7358°N / 25.3937°E">
        <span className="l-no mono">05</span>
        <span className="l-name">Buzludzha</span>
        <span className="l-meta mono">KAZANLAK, BG · 1981</span>
      </button></li>
      <li><button className="l-row" data-img="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" data-coord="44.8125°N / 20.4612°E">
        <span className="l-no mono">06</span>
        <span className="l-name">Western City Gate</span>
        <span className="l-meta mono">BELGRADE, RS · 1977</span>
      </button></li>
    </ul>
    {/* the dossier: a fixed specimen plate — image wipes in, coordinates decode */}
    <div className="plate-wrap" aria-hidden="true">
      <div className="plate">
        <img className="plate-img plate-a" src="https://images.unsplash.com/photo-1527576539890-dfa815648363?q=80&w=1200&auto=format&fit=crop" alt="" />
        <img className="plate-img plate-b" src="" alt="" />
        <span className="plate-corner tl"></span><span className="plate-corner tr"></span>
        <span className="plate-corner bl"></span><span className="plate-corner br"></span>
      </div>
      <p className="plate-read mono"><span id="plate-coord">32.8810°N / 117.2376°W</span></p>
    </div>
  </div>
</section>

{/* ░░ FILM STRIP — auto-drifting contact sheet, warped by scroll velocity ░░ */}
<section id="strip" data-tint="#0C0D0F">
  <p className="mono dim sec-label strip-label" data-decode="">CONTACT SHEET / UNFILED FRAMES</p>
  <div className="strip-window">
    <div className="strip-track">
      <div className="strip-set">
        <figure><img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-014</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-022</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-031</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1439337153520-7082a56a81f4?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-047</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-058</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-063</figcaption></figure>
      </div>
      <div className="strip-set" aria-hidden="true">
        <figure><img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-014</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-022</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-031</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1439337153520-7082a56a81f4?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-047</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-058</figcaption></figure>
        <figure><img src="https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=900&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /><figcaption className="mono">FR-063</figcaption></figure>
      </div>
    </div>
  </div>
</section>

{/* ░░ DISPATCHES — sticky stacking field-note cards ░░ */}
<section id="dispatches" data-tint="#101112">
  <div className="disp-head">
    <p className="mono dim sec-label" data-decode="">DISPATCHES / NOTES FROM THE FIELD</p>
    <h2 className="sec-title">Filed en route.</h2>
  </div>
  <div className="stack">
    <article className="stack-card" style={{ ["--i" as any]: 0 } as CSSProperties}>
      <div className="sc-media"><img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /></div>
      <div className="sc-body">
        <p className="mono sc-date"><span className="accent">DISPATCH 03</span> — 02.11.2026 · FILED FROM 42.7358°N</p>
        <h3>The saucer in the frost</h3>
        <p className="sc-text">Eleven hundred metres of switchbacks, then the fog opened and it was simply there — a concrete disc balanced on the ridgeline, forty years abandoned and still the most certain object in the landscape. We exposed forty plates before our hands stopped working.</p>
        <p className="mono sc-more">READ IN FULL — VOL. I, P. 402 <span className="accent">→</span></p>
      </div>
    </article>
    <article className="stack-card" style={{ ["--i" as any]: 1 } as CSSProperties}>
      <div className="sc-media"><img src="https://images.unsplash.com/photo-1460574283810-2aab119d8511?q=80&w=1200&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /></div>
      <div className="sc-body">
        <p className="mono sc-date"><span className="accent">DISPATCH 02</span> — 14.09.2026 · FILED FROM 42.3603°N</p>
        <h3>Boston, defended</h3>
        <p className="sc-text">The most hated building in America is also the most photographed corner of our archive. Stand under the coffers at noon and the argument ends: this is a civic order poured in place, a city hall that refuses to flatter you into agreement.</p>
        <p className="mono sc-more">READ IN FULL — VOL. I, P. 214 <span className="accent">→</span></p>
      </div>
    </article>
    <article className="stack-card" style={{ ["--i" as any]: 2 } as CSSProperties}>
      <div className="sc-media"><img src="https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=1200&auto=format&fit=crop&sat=-100" alt="" loading="lazy" /></div>
      <div className="sc-body">
        <p className="mono sc-date"><span className="accent">DISPATCH 01</span> — 21.06.2026 · FILED FROM 45.5017°N</p>
        <h3>The gardens of Habitat</h3>
        <p className="sc-text">Fifty-nine years on, the boxes have grown vines. Residents wave from roofs that belong to their neighbours' living rooms. Utopia, it turns out, weathers exactly like concrete: slowly, honestly, and better than anyone predicted.</p>
        <p className="mono sc-more">READ IN FULL — VOL. I, P. 118 <span className="accent">→</span></p>
      </div>
    </article>
  </div>
</section>

{/* ░░ PRESS — rotating testimony; sources decode in ░░ */}
<section id="press" data-tint="#0C0D0F">
  <p className="mono dim sec-label" data-decode="">PRESS / WHAT THE RECORD SAYS</p>
  <div className="pq-stage">
    <blockquote className="pq-item is-on">
      <p className="pq-quote">“Brutalism, finally given the atlas it deserves.”</p>
      <cite className="mono">— WALLPAPER*</cite>
    </blockquote>
    <blockquote className="pq-item">
      <p className="pq-quote">“A field guide that reads like a thriller.”</p>
      <cite className="mono">— DEZEEN</cite>
    </blockquote>
    <blockquote className="pq-item">
      <p className="pq-quote">“The most confident book about concrete ever assembled.”</p>
      <cite className="mono">— MONOCLE</cite>
    </blockquote>
    <blockquote className="pq-item">
      <p className="pq-quote">“The photography alone justifies the edition.”</p>
      <cite className="mono">— ARCHITECTURAL DIGEST</cite>
    </blockquote>
  </div>
  <div className="pq-index mono dim"><span id="pq-now">01</span> / 04</div>
</section>

{/* ░░ THE VOLUME — the conversion spine: a numbered printed edition.
     Pinned product theatre: the cloth-bound book tilts home in 3D while
     the specification sheet assembles and the copies-odometer rolls. ░░ */}
<section id="volume" data-tint="#12100D">
  <div className="vol-stage">
    <div className="vol-grid">
      <div className="vol-book-wrap">
        <div className="vol-book">
          <div className="b-spine mono">ATLAS BRUT — A FIELD GUIDE TO CONCRETE MONUMENTS — EDITION I</div>
          <div className="b-front">
            <span className="b-frame" aria-hidden="true"></span>
            <span className="b-top mono">66.56°N → 42.73°N</span>
            <span className="b-title">ATLAS<br />BRUT<span className="accent">✚</span></span>
            <span className="b-sub mono">A FIELD GUIDE TO<br />CONCRETE MONUMENTS</span>
          </div>
        </div>
        <span className="vol-shadow" aria-hidden="true"></span>
      </div>
      <div className="vol-info">
        <p className="mono dim sec-label" data-decode="">THE VOLUME / EDITION I OF 500</p>
        <h2 className="sec-title">
          <span className="line-mask"><span className="line vol-line">The whole record,</span></span>
          <span className="line-mask"><span className="line vol-line">bound in cloth.</span></span>
        </h2>
        <ul className="vol-specs mono">
          <li className="vol-row"><span>PAGES</span><span>528</span></li>
          <li className="vol-row"><span>PLATES</span><span>214 TRITONE</span></li>
          <li className="vol-row"><span>FORMAT</span><span>240 × 320 MM</span></li>
          <li className="vol-row"><span>BINDING</span><span>CLOTH, FOIL-STAMPED</span></li>
          <li className="vol-row"><span>MAPS</span><span>3 FOLD-OUTS</span></li>
          <li className="vol-row"><span>EDITION</span><span>500, NUMBERED</span></li>
        </ul>
        <div className="vol-count mono">
          <span className="dim">COPIES REMAINING</span>
          <span className="odo accent" data-value="217">217</span>
          <span className="dim">/ 500</span>
        </div>
        <div className="vol-buy">
          <a className="cta-btn vol-cta magnetic" href="mailto:desk@atlasbrut.org?subject=Pre-order%20ATLAS%20BRUT%20—%20Edition%20I">
            <svg className="btn-stroke" aria-hidden="true"><rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" pathLength="100"></rect></svg>
            <span>Pre-order — €120</span>
            <span className="accent mono">→</span>
          </a>
          <p className="mono dim vol-ship">SHIPS SPRING 2027 · WORLDWIDE</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* ░░ EPILOGUE — field-note manifesto over a drifting outline wordmark ░░ */}
<section className="epilogue" data-tint="#0C0D0F">
  <span className="epi-bg" aria-hidden="true">BRUT</span>
  <p className="mono dim sec-label" data-decode="">EPILOGUE / FIELD NOTE 07</p>
  {/* split into words by JS: each sharpens from a blurred ghost as the
       scroll's focus wave passes it — the inscription is read by scrolling */}
  <p className="epi-text" id="epi-text">Concrete does not apologise. It records — the weather, the century, the hand of the pour — <span className="accent">and waits to be read.</span></p>
</section>

</main>

{/* ░░ FOOTER — expedition desk ░░ */}
<footer id="contact" data-tint="#0C0D0F">
  {/* transmissions — lead capture */}
  <div className="foot-dispatch">
    <div>
      <p className="mono dim sec-label" data-decode="">TRANSMISSIONS / ONE PER MONTH</p>
      <p className="fd-lede">Field reports, plate previews, edition news. No noise.</p>
    </div>
    <form id="dispatch-form" noValidate>
      <div className="df-row">
        <input id="df-email" className="mono" type="email" required placeholder="OPERATOR@STATION.ORG" aria-label="Email address" autoComplete="email" />
        <button className="mono" type="submit">TRANSMIT →</button>
      </div>
      <p id="df-note" className="mono dim" aria-live="polite"></p>
    </form>
  </div>

  <div className="foot-grid">
    <div className="foot-cta">
      <p className="mono dim sec-label" data-decode="">EXPEDITION II — DEPARTS 2027</p>
      <h2 className="cta-title">
        <span className="line-mask"><span className="line">Own the</span></span>
        <span className="line-mask"><span className="line">whole record.</span></span>
      </h2>
      <a className="cta-btn magnetic" href="#volume">
        <svg className="btn-stroke" aria-hidden="true"><rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" pathLength="100"></rect></svg>
        <span>Pre-order the atlas</span>
        <span className="accent mono">→</span>
      </a>
    </div>
    <div className="foot-meta mono">
      <div>
        <p className="foot-label">FIELD DESK</p>
        <p>Rüdesheimer Str. 11<br />10713 Berlin, DE</p>
        <p className="foot-coord dim">52.4820°N / 13.3170°E</p>
      </div>
      <div>
        <p className="foot-label">CORRESPOND</p>
        <a href="mailto:desk@atlasbrut.org">desk@atlasbrut.org</a>
        <a href="#">Instagram</a>
        <a href="#">Are.na</a>
      </div>
    </div>
  </div>
  <div className="foot-mark" aria-hidden="true">ATLAS<span>✚</span>BRUT</div>
  <div className="foot-bar mono">
    <p>ATLAS BRUT © 2026 · A FICTION</p>
    <p>PLATES: UNSPLASH — PLACEHOLDERS</p>
    <p>SURVEYED, PLATED, FILED</p>
  </div>
</footer>
    </>
  );
}
