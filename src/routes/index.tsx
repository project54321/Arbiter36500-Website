import { createFileRoute } from "@tanstack/react-router";
import { useEffect, type CSSProperties } from "react";
import "@/atlas-brut/atlas-brut.css";

const DESCRIPTION =
  "Arbiter FTC - An upcoming FIRST Tech Challenge team based in Austin Tx.";
const TITLE = "Arbiter FTC";

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
      { rel: "icon", href: "/logo.png", type: "image/png" },
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
  component: Arbiter,
});

function Arbiter() {
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__atlasIntroDone = false;
    const failsafe = window.setTimeout(() => {
      if (!w.__atlasIntroDone) {
        const l = document.getElementById("loader");
        if (l) l.style.display = "none";
        document.body.style.overflow = "";
        // eslint-disable-next-line no-console
        console.warn("Arbiter intro did not complete — revealed page via fail-safe.");
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
          <p id="loader-title" data-text="ARBITER #36500">████████ ██████████</p>
          <p id="loader-coords">FIRST TECH CHALLENGE</p>
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
        <span className="rail-cap mono">B</span>
        <div className="rail-line">
          <div className="rail-fill"></div>
          <div className="rail-dot"></div>
        </div>
        <span className="rail-cap mono">E</span>
        <span id="rail-read" className="mono">0</span>
      </aside>

      {/* ░░ HEADER ░░ */}
      <header id="site-header">
        <a href="#" className="wordmark"><span className="gold">ARBITER</span> #36500</a>
        <nav className="mono">
          <a href="#about">About</a>
          <a href="#ch-01">Design</a>
          <a href="#ch-02">Software</a>
          <a href="#ch-03">Outreach</a>
          <a href="#volume">Support Us</a>
        </nav>
        <div className="head-tools">
          <p id="field-clock" className="mono">—:— UTC</p>
          <a href="#contact" className="pill mono">Contact Us</a>
          <button id="menu-btn" aria-label="Open index" aria-expanded="false" aria-controls="menu-overlay"><span></span><span></span></button>
        </div>
      </header>

      {/* ░░ MENU OVERLAY — the index. Full-screen on every size; doubles as mobile nav ░░ */}
      <div id="menu-overlay" aria-hidden="true">
        <div className="menu-top">
          <span className="wordmark"><span className="gold">ARBITER</span><span className="gold"> #</span>36500</span>
          <button id="menu-close" className="mono" aria-label="Close index">CLOSE ✕</button>
        </div>
        <nav className="menu-links">
          <a href="#about"><span className="mono m-no">01</span><span className="m-name">About</span></a>
          <a href="#ch-01"><span className="mono m-no">02</span><span className="m-name">Design</span></a>
          <a href="#ch-02"><span className="mono m-no">03</span><span className="m-name">Software</span></a>
          <a href="#ch-03"><span className="mono m-no">04</span><span className="m-name">Outreach</span></a>
          <a href="#volume"><span className="mono m-no">05</span><span className="m-name">Support Us</span></a>
          <a href="#contact"><span className="mono m-no">06</span><span className="m-name">Contact Us</span></a>
        </nav>
        <div className="menu-foot mono dim">
          <span><span className="gold">ARBITER</span> #36500</span>
          <span>FIRST TECH CHALLENGE</span>
        </div>
      </div>

      <main>

        {/* ░░ HERO — rack-focus title: blurred and oversized, snaps into focus ░░ */}
        <section className="hero" data-tint="#0C0D0F">
          <p className="hero-label mono" data-decode="">FIRST TECH CHALLENGE TEAM - AUSTIN TEXAS</p>
          <h1>
            <span className="hero-line focus-line"><span className="gold">ARBITER</span></span>
            <span className="hero-line focus-line">#36500</span>
          </h1>
          <div className="hero-foot">
            <p className="hero-desc">Designed to innovate, compete, and tuned to perfection. Welcome to Arbiter, where robotics meets relentless ambition and a global legacy.</p>
            <p className="mono dim" data-decode="">LEARN ABOUT THE JOURNEY</p>
          </div>
        </section>

        {/* ░░ PROLOGUE / OUR MISSION — Cinematic Editorial Block ░░ */}
        <section className="prologue split-prologue" id="about" data-tint="#0C0D0F" style={{ padding: "10rem 0", position: "relative" }}>
          <style>{`
            @media (max-width: 1024px) {
              .prologue.split-prologue {
                padding: 5rem 0 !important;
              }
              .prologue-grid-container {
                grid-template-columns: 1fr !important;
                gap: 3rem !important;
                padding: 0 1.5rem !important;
              }
              .specimen-plate {
                margin: 0 auto;
                width: 100% !important;
                max-width: 380px;
              }
              .telemetry-line {
                gap: 1.5rem 2.5rem !important;
                flex-wrap: wrap !important;
              }
            }
          `}</style>

          <div className="prologue-grid-container" style={{ 
            display: "grid", 
            gridTemplateColumns: "minmax(0, 1fr) 1.15fr", 
            gap: "5rem", 
            alignItems: "center", 
            maxWidth: "100rem", 
            margin: "0 auto",
            padding: "0 4rem"
          }}>
            
            {/* Left Column: Framed Specimen Plate */}
            <div className="specimen-plate" style={{ 
              position: "relative", 
              border: "1px solid rgba(255,255,255,0.2)", 
              background: "#08090A",
              padding: "1rem",
              width: "fit-content",
              maxWidth: "100%",
              justifySelf: "center",
              boxSizing: "border-box"
            }}>
              <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/5", width: "100%" }}>
                <img 
                  src="/logo.png" 
                  alt="Arbiter FTC Team Logo" 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "contain", 
                    display: "block"
                  }} 
                  loading="lazy" 
                  decoding="async" 
                />
                <div style={{ position: "absolute", top: "12px", left: "12px", width: "16px", height: "16px", borderTop: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37" }}></div>
                <div style={{ position: "absolute", top: "12px", right: "12px", width: "16px", height: "16px", borderTop: "2px solid #D4AF37", borderRight: "2px solid #D4AF37" }}></div>
                <div style={{ position: "absolute", bottom: "12px", left: "12px", width: "16px", height: "16px", borderBottom: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37" }}></div>
                <div style={{ position: "absolute", bottom: "12px", right: "12px", width: "16px", height: "16px", borderBottom: "2px solid #D4AF37", borderRight: "2px solid #D4AF37" }}></div>
              </div>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "1rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>
                <span>OFF-SEASON // ARBITER-LOGO</span>
                <span>AUSTIN, TX — 30.2672° N</span>
              </div>
            </div>

            {/* Right Column: High Cinematic Typography & Raw Editorial Layout */}
            <div className="split-content" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              
              <div className="split-text-block">
                <p className="mono dim sec-label" data-decode="" style={{ marginBottom: "1.25rem", letterSpacing: "0.25em", fontSize: "0.75rem", color: "var(--gold, #D4AF37)" }}>
                  ARBITER #36500 / ABOUT US
                </p>
                
                <h2 className="sec-title" style={{ 
                  fontSize: "clamp(2.5rem, 4.5vw, 4.8rem)", 
                  lineHeight: "0.92", 
                  fontWeight: "900", 
                  textTransform: "uppercase", 
                  marginBottom: "2rem",
                  letterSpacing: "-0.02em",
                  color: "#fff"
                }}>
                  A MISSION <span style={{ color: "var(--gold, #D4AF37)" }}>BEYOND </span><span style={{ color: "var(--gold, #D4AF37)" }}>THE MACHINE.</span>
                </h2>

                <div className="prologue-text" style={{ 
                  fontSize: "1.05rem", 
                  lineHeight: "1.75", 
                  color: "rgba(255,255,255,0.8)", 
                  maxWidth: "40rem", 
                  fontWeight: "400",
                  marginBottom: "2.5rem"
                }}>
                  Arbiter #36500 is a FIRST Tech Challenge Team based in Austin Texas preparing to compete in a global robotics challenge where we design, build, and program an 18" × 18" robot to play a new game through autonomous and driver-controlled operation.
                  <br /><br />
                  Our mission is to promote an inclusive community where we tackle new challenges as a collective team. By embracing diverse perspectives and learning from one another, we aim to build technically strong robots and an even stronger community.
                </div>

                {/* Animated "Support Us" Button */}
                <div style={{ marginBottom: "3.5rem" }}>
                  <a
                    href="https://hcb.hackclub.com/donations/start/arbiterftc" target="_blank" rel="noopener noreferrer"
                    className="mono support-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.9rem 2rem",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#fff",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(212, 175, 55, 0.4)",
                      position: "relative",
                      overflow: "hidden",
                      textDecoration: "none",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--gold, #D4AF37)";
                      e.currentTarget.style.boxShadow = "0 0 25px rgba(212, 175, 55, 0.25)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.4)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <span>SUPPORT US</span>
                    <span style={{ color: "var(--gold, #D4AF37)", transition: "transform 0.3s ease" }}>→</span>
                  </a>
                </div>
              </div>

              {/* CINEMATIC RAW STATS */}
              <div className="telemetry-line mono" style={{ 
                display: "flex", 
                flexWrap: "wrap",
                gap: "3.5rem", 
                borderTop: "1px solid rgba(255,255,255,0.15)", 
                paddingTop: "2rem",
                justifyContent: "start"
              }}>
                <div>
                  <span className="gold odometer" style={{ fontSize: "3.2rem", fontWeight: "900", color: "#fff", display: "block", lineHeight: "1" }} data-value="300">30<span style={{ color: "var(--gold, #D4AF37)" }}>+</span></span>
                  <span className="mono dim" style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: "0.4rem", display: "block" }}>OUTREACH HOURS</span>
                </div>
                <div>
                  <span className="gold odometer" style={{ fontSize: "3.2rem", fontWeight: "900", color: "#fff", display: "block", lineHeight: "1" }} data-value="20">20<span style={{ color: "var(--gold, #D4AF37)" }}>+</span></span>
                  <span className="mono dim" style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: "0.4rem", display: "block" }}>PEOPLE IMPACTED</span>
                </div>
                <div>
                  <span className="gold odometer" style={{ fontSize: "3.2rem", fontWeight: "900", color: "#fff", display: "block", lineHeight: "1" }} data-value="3">3<span style={{ color: "var(--gold, #D4AF37)" }}>+</span></span>
                  <span className="mono dim" style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: "0.4rem", display: "block" }}>CONNECTIONS</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* ░░ CHAPTER 01 — dolly-zoom: framed slide grows to swallow the viewport ░░ */}
        <section className="chapter" id="ch-01" data-tint="#0D0F13">
          <div className="ch-stage">
            <div className="ch-mask">
              <img className="ch-img" src="/bot.png" alt="Geisel Library — raking concrete piers" loading="lazy" decoding="async" />
              <div className="ch-scrim"></div>
            </div>
            <div className="ch-head mono">
              <span className="ch-no">DESIGN PHASE - 01</span>
              <span className="ch-coord" data-decode="">INTO THE DEEP ROBOT PROTOTYPE</span>
            </div>
            <div className="ch-meta">
              <h2 className="ch-title"><span className="line-mask"><span className="line">PRECISION DESIGN.</span></span></h2>
              <p className="ch-facts mono"><span className="line-mask"><span className="line">ARBITER #36500 — 2026 — AUSTIN, TX</span></span></p>
              <p className="ch-desc"><span className="line-mask"><span className="line">Before the first movement, there was the blueprint — </span></span><span className="line-mask"><span className="line">a system of ideas transformed into a machine ready for the challenge.</span></span></p>
            </div>
          </div>
        </section>

        {/* ░░ THE LEDGER — index rows + fixed dossier plate that swaps on hover ░░ */}
        <section id="ledger" data-tint="#0E1011">
          <div className="ledger-head">
            <p className="mono dim sec-label" data-decode="">ARBITER #36500 / DESIGN</p>
            <h2 className="sec-title">Seven specs,<br />built for the challenge.</h2>
          </div>
          <div className="ledger-grid">
            <ul className="ledger-rows">
              <li><button className="l-row" data-img="dt.png" data-coord="HOLONOMIC DRIVETRAIN">
                <span className="l-no mono">01</span>
                <span className="l-name">Holonomic Drivetrain</span>
                <span className="l-meta mono">INTO THE DEEP · 2026</span>
              </button></li>
              <li><button className="l-row" data-img="pckt.png" data-coord="POCKETED PLATES">
                <span className="l-no mono">02</span>
                <span className="l-name">Pocketed Plates</span>
                <span className="l-meta mono">INTO THE DEEP · 2026</span>
              </button></li>
              <li><button className="l-row" data-img="odom.png" data-coord="ODOMETRY & PINPOINT">

                <span className="l-no mono">03</span>
                <span className="l-name">Odometry & Pinpoint</span>
                <span className="l-meta mono">INTO THE DEEP · 2026</span>
              </button></li>
              <li><button className="l-row" data-img="claw.png" data-coord="PIVOTING CLAW">
                <span className="l-no mono">04</span>
                <span className="l-name">Pivoting Claw</span>
                <span className="l-meta mono">INTO THE DEEP · 2026</span>
              </button></li>
              <li><button className="l-row" data-img="ex.png" data-coord="EXTENDING ARMS">
                <span className="l-no mono">05</span>
                <span className="l-name">Extending Arms</span>
                <span className="l-meta mono">INTO THE DEEP · 2026</span>
              </button></li>
              <li><button className="l-row" data-img="pv.png" data-coord="PIVOT MECHANISM">
                <span className="l-no mono">06</span>
                <span className="l-name">Pivot Mechanism</span>
                <span className="l-meta mono">INTO THE DEEP · 2026</span>
              </button></li>
              <li><button className="l-row" data-img="hng.png" data-coord="HANGING MECHANISM">
                <span className="l-no mono">07</span>
                <span className="l-name">Hanging Mechanism</span>
                <span className="l-meta mono">INTO THE DEEP · 2026</span>
              </button></li>
            </ul>
            {/* the dossier: a fixed specimen plate — image wipes in, coordinates decode */}
            <div className="plate-wrap" aria-hidden="true">
              <div className="plate">
                <img className="plate-img plate-a" src="dt.png" alt="" />
                <img className="plate-img plate-b" src="dt.png" alt="" />
                <span className="plate-corner tl"></span><span className="plate-corner tr"></span>
                <span className="plate-corner bl"></span><span className="plate-corner br"></span>
              </div>
              <p className="plate-read mono"><span id="plate-coord">HOLONOMIC DRIVETRAIN</span></p>
            </div>
          </div>
        </section>

        {/* ░░ CHAPTER 02 ░░ */}
        <section className="chapter" id="ch-02" data-tint="#101312">
          <div className="ch-stage">
            <div className="ch-mask">
              <img className="ch-img" src="sw.JPG" alt="Habitat 67 — stacked modular volumes" loading="lazy" decoding="async" />
              <div className="ch-scrim"></div>
            </div>
            <div className="ch-head mono">
              <span className="ch-no">PROGRAMMING - 02</span>
              <span className="ch-coord" data-decode="">DECODE ROBOT PRACTICE CODE</span>
            </div>
            <div className="ch-meta">
              <h2 className="ch-title"><span className="line-mask"><span className="line">CODEBASE</span></span></h2>
              <p className="ch-facts mono"><span className="line-mask"><span className="line">ARBITER #36500 — 2026 — AUSTIN, TX</span></span></p>
              <p className="ch-desc"><span className="line-mask"><span className="line">Every autonomous and teleOp begins as an idea. Countless hours of development</span></span><span className="line-mask"><span className="line"> and testing makes it something the team can trust in the final second.</span></span></p>
            </div>
          </div>
        </section>

        {/* ░░ THE ROUTE — pinned survey map; the expedition line draws itself and
        waypoints ping on as the pen passes them. Covers all seven monuments. ░░ */}
        <section id="route" data-tint="#0D1013">
          <div className="route-stage">
            <div className="route-head">
              <p className="mono dim sec-label" data-decode="">ARBITER #36500 / SOFTWARE</p>
              <h2 className="sec-title">Fifty Hertz,<br />minimal latency.</h2>
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
                </g>
                {/* the expedition line — straight survey legs, dashoffset scrubbed 1000 → 0 */}
                <path id="route-path" pathLength="1000" d="M140,520 L400,350 L480,210 L760,150 L860,330 L990,260 L1080,380"></path>
                {/* waypoints spread across the full grid; every label sits on the
             side of its dot that the line does NOT pass through */}
                <g className="wp" data-at="0.01" transform="translate(140,520)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="16" y="26">BASIC JAVA</text></g>
                <g className="wp" data-at="0.25" transform="translate(400,350)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="16" y="26">SENSORS & MOTORS</text></g>
                <g className="wp" data-at="0.37" transform="translate(480,210)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="30">DRIVETRAIN CODE</text></g>
                <g className="wp" data-at="0.60" transform="translate(760,150)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="-16">COMPUTER VISION</text></g>
                <g className="wp" data-at="0.76" transform="translate(860,330)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="30">PIDF CONTROL LOOPS</text></g>
                <g className="wp" data-at="0.88" transform="translate(990,260)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="-16">ODOMETRY</text></g>
                <g className="wp" data-at="0.99" transform="translate(1080,380)"><circle className="wp-ring" r="11"></circle><circle className="wp-dot" r="3.5"></circle><text x="14" y="30" textAnchor="end">PEDRO PATHING</text></g>
                {/* the survey pen — rides the tip of the line as it draws */}
                <g id="route-pen"><circle className="pen-ring" r="9"></circle><circle className="pen-dot" r="3.5"></circle></g>
              </svg>
              <p className="route-read mono">
                <span id="route-leg">01 / 07</span>
                <span id="route-km" className="accent">#0</span>
              </p>
            </div>
          </div>
        </section>

        {/* ░░ CHAPTER 03 ░░ */}
        <section className="chapter" id="ch-03" data-tint="#14100C">
          <div className="ch-stage">
            <div className="ch-mask">
              <img className="ch-img" src="/mg1.JPG" alt="Buzludzha — abandoned concrete monument" loading="lazy" decoding="async" />
              <div className="ch-scrim"></div>
            </div>
            <div className="ch-head mono">
              <span className="ch-no">COMMUNITY - 03</span>
              <span className="ch-coord" data-decode="">ROBOCAMP</span>
            </div>
            <div className="ch-meta">
              <h2 className="ch-title"><span className="line-mask"><span className="line">GROWING TOGETHER</span></span></h2>
              <p className="ch-facts mono"><span className="line-mask"><span className="line">ARBITER #36500 & WESTWOOD HS — 2026 — AUSTIN, TX</span></span></p>
              <p className="ch-desc"><span className="line-mask"><span className="line">Success means more when it's shared. Every connection, every mentor, and every </span></span><span className="line-mask"><span className="line">student we reach helps inspire the next generation and build a growing community.</span></span></p>
            </div>
          </div>
        </section>

        {/* ░░ DISPATCHES — sticky stacking field-note cards ░░ */}
        <section id="dispatches" data-tint="#101112">
          <div className="disp-head">
            <p className="mono dim sec-label" data-decode="">ARBITER #36500 / COMMUNITY ENGAGEMENT</p>
            <h2 className="sec-title">Inspiring The Next Generation.</h2>
          </div>
          <div className="stack">
            <article className="stack-card" style={{ ["--i" as any]: 0 } as CSSProperties}>
              <div className="sc-media"><img src="revHacks.png" alt="" loading="lazy" /></div>
              <div className="sc-body">
                <p className="mono sc-date"><span className="accent">HACKATHON</span> — Launching August · Supported by Arbiter Members</p>
                <h3>Reverie Hacks</h3>
                <p className="sc-text">ReverieHacks 2026 is a two-week creative playground for developers, designers, and beginners alike to build meaningful projects. Choose from 6 specialized tracks—including ML Prompting, Embedded Systems, and App Dev—to collaborate with mentors, gain hands-on experience, and compete for awesome prizes.</p>
                <p className="mono sc-more">Learn More <span className="accent">→</span></p>
              </div>
            </article>
            <article className="stack-card" style={{ ["--i" as any]: 1 } as CSSProperties}>
              <div className="sc-media"><img src="robocamp.JPEG" alt="" loading="lazy" /></div>
              <div className="sc-body">
                <p className="mono sc-date"><span className="accent">ROBOTICS CAMP</span> — June & July · Supported by Arbiter Volunteers/Org. Committee</p>
                <h3>RoboCamp</h3>
                <p className="sc-text">RoboCamp 2026 is a hands-on STEM camp where elementary and middle schoolers get to build, code, and explore the world of robotics. Kids learn directly from high school mentors through interactive projects, with all proceeds going toward fundraising to keep the Westwood High School robotics teams running and competing.</p>
                <p className="mono sc-more">Learn More <span className="accent">→</span></p>
              </div>
            </article>
            <article className="stack-card" style={{ ["--i" as any]: 2 } as CSSProperties}>
              <div className="sc-media"><img src="ph.JPG" alt="" loading="lazy" /></div>
              <div className="sc-body">
                <p className="mono sc-date"><span className="accent">UNDECIDED</span> — DATE TBD · STATUS TBD</p>
                <h3>Coming Soon!</h3>
                <p className="sc-text">The next big thing is taking shape, and we’re keeping the doors wide open. We're building a space for new ideas, fresh perspectives, and creative experiments—and we'd love to build it with you. Have an idea, want to partner up, or just want to pitch in? Reach out to us and let’s collaborate!</p>
                <p className="mono sc-more">arbiter.ftc26@gmail.com <span className="accent">→</span></p>
              </div>
            </article>
          </div>
        </section>

        {/* ░░ FILM STRIP — auto-drifting contact sheet, warped by scroll velocity ░░ */}
        <section id="strip" data-tint="#0C0D0F">
          <p className="mono dim sec-label strip-label" data-decode="">ARBITER #36500 / PHOTO GALLERY</p>
          <div className="strip-window">
            <div className="strip-track">
              <div className="strip-set">
                <figure><img src="/gallery/gyattdamncheggs.png" alt="" loading="lazy" /><figcaption className="mono">ROBOCAMP</figcaption></figure>
                <figure><img src="/gallery/botfs.png" alt="" loading="lazy" /><figcaption className="mono">INTO THE DEEP CAD</figcaption></figure>
                <figure><img src="/gallery/3.JPG" alt="" loading="lazy" /><figcaption className="mono">ROBANQUET</figcaption></figure>
                <figure><img src="/gallery/4.JPG" alt="" loading="lazy" /><figcaption className="mono">ROBANQUET</figcaption></figure>
                <figure><img src="/gallery/5.JPEG" alt="" loading="lazy" /><figcaption className="mono">ROBOCAMP</figcaption></figure>
                <figure><img src="/gallery/6.jpg" alt="" loading="lazy" /><figcaption className="mono">BACK TO SCHOOL BASH</figcaption></figure>

                <figure><img src="/gallery/gyattdamncheggs.png" alt="" loading="lazy" /><figcaption className="mono">ROBOCAMP</figcaption></figure>
                <figure><img src="/gallery/botfs.png" alt="" loading="lazy" /><figcaption className="mono">INTO THE DEEP CAD</figcaption></figure>
                <figure><img src="/gallery/3.JPG" alt="" loading="lazy" /><figcaption className="mono">ROBANQUET</figcaption></figure>
                <figure><img src="/gallery/4.JPG" alt="" loading="lazy" /><figcaption className="mono">ROBANQUET</figcaption></figure>
                <figure><img src="/gallery/5.JPEG" alt="" loading="lazy" /><figcaption className="mono">ROBOCAMP</figcaption></figure>
                <figure><img src="/gallery/6.jpg" alt="" loading="lazy" /><figcaption className="mono">BACK TO SCHOOL BASH</figcaption></figure>
              </div>
            </div>
          </div>
        </section>

        {/* ░░ THE VOLUME — the conversion spine: a numbered printed edition.
        Pinned product theatre: the cloth-bound book tilts home in 3D while
        the specification sheet assembles and the copies-odometer rolls. ░░ */}
        <section id="volume" data-tint="#12100D">
          <div className="vol-stage">
            <div className="vol-grid">
              <div className="vol-book-wrap">
                <div className="vol-book">
                  <div className="b-spine mono"><span className="gold">ARBITER</span> #36500 — AN OVERVIEW OF OUR ENGINEERING & IMPACT</div>
                  <div className="b-front">
                    <span className="b-frame" aria-hidden="true"></span>
                    <span className="b-top mono">AUSTIN TEXAS</span>
                    <span className="b-title"><span className="gold">ARBITER</span><br />#36500</span>
                    <span className="b-sub mono">A COMPREHENSIVE OVERVIEW OF<br />OUR ENGINEERING & IMPACT</span>
                  </div>
                </div>
                <span className="vol-shadow" aria-hidden="true"></span>
              </div>
              <div className="vol-info">
                <p className="mono dim sec-label" data-decode="">ARBITER #36500 / FINANCES & SUPPORT</p>
                <h2 className="sec-title">
                  <span className="line-mask"><span className="line vol-line">A new season</span></span>
                  <span className="line-mask"><span className="line vol-line">backed by our community.</span></span>
                </h2>
                <ul className="vol-specs mono">
                  <li className="vol-row"><span>SEASON BUDGET</span><span>$12,000</span></li>
                  <li className="vol-row"><span>SPONSORSHIP TIERS</span><span>WHITE, GOLD, OLIVE & BLACK</span></li>
                  <li className="vol-row"><span>PRIMARY EXPENSES</span><span>PARTS, REGISTRATION, TRAVEL</span></li>
                  <li className="vol-row"><span>SPONSOR PERKS</span><span>LOGO ON ROBOT, MERCH, ETC.</span></li>
                  <li className="vol-row"><span>TAX STATUS</span><span>501(c)(3) NON-PROFIT SPONSORED BY HCB</span></li>
                  <li className="vol-row"><span>CORPORATE MATCH</span><span>ELIGIBLE</span></li>
                </ul>
                <div className="vol-buy">
                  <a className="cta-btn vol-cta magnetic" href="mailto:arbiter.ftc26@gmail.com">
                    <svg className="btn-stroke" aria-hidden="true"><rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" pathLength="100"></rect></svg>
                    <span>Sponsorship Packet</span>
                    <span className="accent mono">→</span>
                  </a>
                  <p className="mono dim vol-ship">EMAIL US TO REQUEST A SPONSORSHIP PACKET (BUSINESS EMAIL)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ░░ EPILOGUE — field-note manifesto over a drifting outline wordmark ░░ */}
        <section className="epilogue" data-tint="#0C0D0F">
          <span className="epi-bg" aria-hidden="true">#36500</span>
          <p className="mono dim sec-label" data-decode="">ARBITER #36500 / CONCLUSION</p>
          {/* split into words by JS: each sharpens from a blurred ghost as the
       scroll's focus wave passes it — the inscription is read by scrolling */}
          <p className="epi-text" id="epi-text">A machine does not negotiate. It binds — the math, the metal, the intent of the builder — <span className="accent">into a consistent routine.</span></p>
        </section>
      </main>

      {/* ░░ FOOTER — expedition desk ░░ */}
      <footer id="contact" data-tint="#0C0D0F">
        <div className="foot-grid">
          <div className="foot-cta">
            <p className="mono dim sec-label" data-decode="">FIRST TECH CHALLENGE - 2026</p>
            <h2 className="cta-title">
              <span className="line-mask"><span className="line">Aspire.</span></span>
              <span className="line-mask"><span className="line">Ascend.</span></span>
              <span className="line-mask"><span className="line">Achieve.</span></span>
            </h2>
          </div>
          <div className="foot-meta mono">
            <div>
              <p className="foot-label">CONTACT INFO</p>
              <a href="mailto:arbiter.ftc26@gmail.com">arbiter.ftc26@gmail.com</a>
              <p>12300 Riata Trace Pkwy,<br />Austin, TX 78727</p>
            </div>
            <div>
              <p className="foot-label">SOCIAL</p>
              <a href="https://www.instagram.com/arbiter_ftc/" target="_blank" rel="noopener noreferrer">Instagram: @arbiter_ftc</a>
              <a href="https://www.youtube.com/@arbiter-ftc" target="_blank" rel="noopener noreferrer">Youtube: @arbiter-ftc</a>
            </div>
            <a className="cta-btn magnetic" href="https://hcb.hackclub.com/donations/start/arbiterftc" target="_blank" rel="noopener noreferrer">
              <svg className="btn-stroke" aria-hidden="true"><rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" pathLength="100"></rect></svg>
              <span>Support Us!</span>
              <span className="accent mono">→</span>
            </a>
          </div>
        </div>
        <div className="foot-mark" aria-hidden="true">ARBITER FTC</div>
      </footer>
    </>
  );
}
