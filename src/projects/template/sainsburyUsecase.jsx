import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function TypedText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    const clearTimers = () => timersRef.current.forEach(clearTimeout);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayed("");
          setDone(false);
          clearTimers();
          timersRef.current = [];
          let i = 0;
          const start = setTimeout(() => {
            const interval = setInterval(() => {
              i++;
              setDisplayed(text.slice(0, i));
              if (i >= text.length) { clearInterval(interval); setDone(true); }
            }, 55);
            timersRef.current.push(interval);
          }, delay);
          timersRef.current.push(start);
        } else {
          clearTimers();
          setDisplayed("");
          setDone(false);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); clearTimers(); };
  }, [text, delay]);

  return <span ref={ref}>{displayed}{!done && <span className="ulio-cursor">|</span>}</span>;
}

function CountUp({ to, suffix = "", duration = 1600, decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setCount(parseFloat((eased * to).toFixed(decimals)));
            if (t < 1) { rafRef.current = requestAnimationFrame(tick); }
          };
          rafRef.current = requestAnimationFrame(tick);
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          setCount(0);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [to, duration, decimals]);

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>;
}

function PaddedCountUp({ to, duration = 1400 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setCount(Math.round(eased * to));
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          setCount(0);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [to, duration]);

  return <span ref={ref}>{String(count).padStart(2, '0')}</span>;
}

function PopIn({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`sb-pop-in${visible ? " sb-pop-in--on" : ""}`}>
      {children}
    </span>
  );
}

const SB_PROBLEM_CARDS = [
  { num: "01", text: "Machine error mid-scan. Had to call for staff twice in a single visit." },
  { num: "02", text: "The bagging area rejected my items repeatedly. No clue why." },
  { num: "03", text: "The screen froze on payment and I had to abandon my trolley entirely." },
  { num: "04", text: "Error messages just say 'unexpected item'. There's no guidance on what to do." },
  { num: "05", text: "Easier to queue for a staffed till. At least that actually works every time." },
  { num: "06", text: "Waited 5 minutes for staff to override a weighing error on a bag of apples." },
];

const SB_SOLUTIONS_LEFT = [
  "Move scanning to the basket. A sensor-embedded basket auto-identifies items as they're placed inside. The terminal becomes confirmation and payment only.",
  "Transparency over assumption. The confirmation screen shows every item with explicit 'Confirmed' status. Trust through visibility, not hope.",
  "Flag weighted items proactively. Estimated-weight items are flagged before payment. User confirms or removes. No machine error, no staff needed.",
];

const SB_SOLUTIONS_RIGHT = [
  "Escape route always visible. 'Call for Assistance' is always on screen with a live staff availability indicator. Never hidden, never a last resort.",
  "One task at a time. By eliminating item-by-item scanning, the primary source of errors and staff interventions is removed entirely.",
  "WCAG 2.1 AA throughout. All touch targets minimum 44×44px. Colour is never the sole status indicator, satisfying accessibility requirements.",
];

const SB_DESIGN_PROCESS = [
  {
    phase: "Phase 01 / Literature Review",
    text: "Academic papers and industry reports on Self-Service Technology adoption, failure modes, and human factors, establishing the theoretical foundation.",
  },
  {
    phase: "Phase 02 / User Survey",
    text: "Quantitative satisfaction data across four SST dimensions: Convenience, Reliability, Speed of Service, and Customisation. (n=17)",
  },
  {
    phase: "Phase 03 / In-Depth Interviews",
    text: "Semi-structured interviews surfacing emotional dimensions: the frustration, embarrassment, and workarounds users had developed. (n=5)",
  },
  {
    phase: "Phase 04 / Observational Research",
    text: "Two weeks at Sainsbury's New Cross Road documenting error frequency, staff intervention rates, and normalised behavioural workarounds.",
  },
];

function SolutionsSection() {
  return (
    <section className="sb-solutions">
      {/* Left column: card + image */}
      <div className="sb-solutions-col sb-solutions-col--left">
        <div className="sb-solutions-card">
          <h2 className="sb-solutions-heading">Solutions</h2>
          <ul className="sb-solutions-list">
            {SB_SOLUTIONS_LEFT.map((s, i) => (
              <li key={i} className="sb-solutions-item">
                <span className="sb-solutions-check" aria-hidden="true">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="sb-solutions-photo">
          <img src="/assets/projects/1%20sains.jpg" alt="Sainsbury's fieldwork" className="sb-solutions-img" />
        </div>
      </div>

      {/* Right column: tagline + card */}
      <div className="sb-solutions-col sb-solutions-col--right">
        <p className="sb-solutions-tagline">
          <strong>Sainsbury's Smart Basket</strong>: where frustration fades, convenience <em>shines</em>, and checkout is <strong>effortless.</strong>
        </p>
        <div className="sb-solutions-card">
          <h2 className="sb-solutions-heading">Solutions</h2>
          <ul className="sb-solutions-list">
            {SB_SOLUTIONS_RIGHT.map((s, i) => (
              <li key={i} className="sb-solutions-item">
                <span className="sb-solutions-check" aria-hidden="true">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const DP_ICONS = [
  <svg key="0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  <svg key="1" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  <svg key="2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="3" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
];

function DesignProcessSection() {
  return (
    <section className="sb-dp">
      <div className="sb-dp-header">
        <h2 className="sb-dp-title">Design Process</h2>
        <p className="sb-dp-desc">
          Mixed-methods research combining four distinct approaches, each chosen to catch what the others miss.
          People's reported experience and their actual behaviour are often very different.
        </p>
      </div>

      <div className="sb-dp-body">
        {/* Left column — phases 1 & 2 */}
        <div className="sb-dp-col">
          {SB_DESIGN_PROCESS.slice(0, 2).map((item, i) => (
            <div key={i} className="sb-dp-card">
              <div className="sb-dp-card-top">
                <span className="sb-dp-icon">{DP_ICONS[i]}</span>
                <span className="sb-dp-tag">{item.phase}</span>
              </div>
              <p className="sb-dp-card-text">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Center — research image */}
        <div className="sb-dp-image-wrap">
          <img
            src="/assets/projects/1%20sains.jpg"
            alt="Fieldwork at Sainsbury's New Cross Road"
            className="sb-dp-img"
          />
        </div>

        {/* Right column — phases 3 & 4 */}
        <div className="sb-dp-col">
          {SB_DESIGN_PROCESS.slice(2, 4).map((item, i) => (
            <div key={i} className="sb-dp-card">
              <div className="sb-dp-card-top">
                <span className="sb-dp-icon">{DP_ICONS[i + 2]}</span>
                <span className="sb-dp-tag">{item.phase}</span>
              </div>
              <p className="sb-dp-card-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 05 — Hypothesis */}
      <div className="sb-dp-phase5">
        <div className="sb-dp-card sb-dp-phase5-intro">
          <div className="sb-dp-card-top">
            <span className="sb-dp-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L15 17H9l-.7-2C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/></svg>
            </span>
            <span className="sb-dp-tag">Phase 05 / Hypothesis</span>
          </div>
          <p className="sb-dp-card-text">
            Synthesised from all four research phases through thematic analysis and affinity mapping. Only patterns consistent across multiple methods were taken forward.
          </p>
        </div>
        <div className="sb-dp-hypothesis">
          <span className="sb-dp-hypothesis-label">Research Hypothesis</span>
          <p className="sb-dp-hypothesis-text">
            "Self-checkout failures are a design problem, not a user problem. If the interaction model is redesigned to remove item-by-item scanning from the terminal, replacing it with a sensor-embedded basket, staff interventions, error states, and transaction abandonment will decrease significantly."
          </p>
        </div>
      </div>
    </section>
  );
}


function WouldDoDifferentlySection() {
  return (
    <section className="sb-retro">
      <div className="sb-retro-top">
        <h2 className="sb-retro-heading">
          What I Would<br />Do Differently
        </h2>
        <p className="sb-retro-body">
          With more time, I'd broaden participant recruitment to include elderly shoppers and users with motor impairments, the groups most disadvantaged by existing self-checkout flows. I'd also bring store colleagues into co-design workshops from the very start of discovery, not just for late-stage validation. Their operational knowledge repeatedly reshaped assumptions I'd carried into the project.
        </p>
      </div>

      <div className="sb-retro-bottom">
        <div className="sb-retro-avatar-wrap">
          <div className="sb-retro-avatar">
            <img src="/assets/resume/3%20ani.svg" alt="Akanksha" />
          </div>
          <span className="sb-retro-name">Akanksha Mahangare</span>
          <span className="sb-retro-role">UX Researcher &amp; Designer</span>
        </div>
        <blockquote className="sb-retro-quote">
          "I'd test prototypes on physical kiosk hardware from week two. Browser simulations hide real interaction latency and screen-glare issues that only surface at the actual terminal."
        </blockquote>
      </div>
    </section>
  );
}

// Natural kiosk dimensions (Root.tsx: screen 1024×640 + 16px padding each side + 20+148 terminal)
const KIOSK_W = 1224;
const KIOSK_H = 690;

function PrototypeShowcaseSection() {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [src, setSrc] = useState("https://akankshaux.in/sb-prototype/");

  useEffect(() => {
    const update = () => {
      if (wrapRef.current) {
        setScale(wrapRef.current.offsetWidth / KIOSK_W);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="sb-proto-launch">
      <p className="sb-proto-eyebrow">Interactive Prototype</p>
      <h2 className="sb-proto-title">Try the full checkout flow</h2>
      <p className="sb-proto-launch-sub">
        Walk through the redesigned experience — Smart Basket scanning, item review, and tap-to-pay.
      </p>
      <div
        ref={wrapRef}
        className="sb-proto-embed-wrap"
        style={{ height: Math.round(KIOSK_H * scale) }}
      >
        <iframe
          src={src}
          onError={()=> {
            if (src != "http://localhost:5174") {
              setSrc("http://localhost:5174")
            }
          }}
          title="Sainsbury's Self-Checkout Prototype"
          style={{
            width: KIOSK_W,
            height: KIOSK_H,
            border: "none",
            display: "block",
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </section>
  );
}

function UserFlowSection() {
  const LC = "rgba(0,0,0,0.15)";
  const LW = "1.5";
  const stepNodes = (rows, baseY) => rows.map(({ x, label, y: rowY }) => (
    <g key={label}>
      <rect x={x} y={rowY ?? baseY} width="102" height="28" rx="14"
        fill="#f4f4f4" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <text x={x + 51} y={(rowY ?? baseY) + 19} textAnchor="middle"
        fill="rgba(0,0,0,0.65)" fontSize="10.5" fontFamily="'Overused Grotesk',sans-serif">{label}</text>
    </g>
  ));

  return (
    <section className="sb-uf">
      <div className="sb-uf-header">
        <h2 className="sb-uf-title">User Flow</h2>
        <p className="sb-uf-desc">
          The Smart Basket pre-scans items during shopping. By the time the customer reaches the terminal, scanning is already done, leaving only confirmation and payment.
        </p>
      </div>

      <div className="sb-uf-diagram">
        {/* step=132 (node 102 + gap 30) | cols: 325,457,589,721,853 */}
        {/* Shopping: rows y=26/86 (L2 cy=70) | Confirmation: y=184/244 (L2 cy=228) | Need Help: y=342 (L2 cy=356) */}
        <svg viewBox="0 0 980 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="sb-uf-svg">

          {/* ── BEZIER CONNECTORS ── */}
          {/* Orange (cy=228) → each L2 */}
          <path d="M 140 228 C 162 228 162 70 180 70"   stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 140 228 L 180 228"                  stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 140 228 C 162 228 162 356 180 356" stroke={LC} strokeWidth={LW} fill="none"/>

          {/* Shopping L2 (cy=70) → rows */}
          <path d="M 288 70 C 310 70 310 40 325 40"   stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 288 70 C 310 70 310 100 325 100" stroke={LC} strokeWidth={LW} fill="none"/>
          {/* Shopping row 1 (center y=40) — gap 30px */}
          <line x1="427" y1="40" x2="457" y2="40" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="40" x2="589" y2="40" stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="40" x2="721" y2="40" stroke={LC} strokeWidth={LW}/>
          {/* Shopping row 2 (center y=100) */}
          <line x1="427" y1="100" x2="457" y2="100" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="100" x2="589" y2="100" stroke={LC} strokeWidth={LW}/>

          {/* Confirmation L2 (cy=228) → rows */}
          <path d="M 288 228 C 310 228 310 198 325 198" stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 288 228 C 310 228 310 258 325 258" stroke={LC} strokeWidth={LW} fill="none"/>
          {/* Confirmation row 1 (center y=198) */}
          <line x1="427" y1="198" x2="457" y2="198" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="198" x2="589" y2="198" stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="198" x2="721" y2="198" stroke={LC} strokeWidth={LW}/>
          <line x1="823" y1="198" x2="853" y2="198" stroke={LC} strokeWidth={LW}/>
          {/* Confirmation row 2 (center y=258) */}
          <line x1="427" y1="258" x2="457" y2="258" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="258" x2="589" y2="258" stroke={LC} strokeWidth={LW}/>

          {/* Need Help L2 (cy=356) → row (center y=356) */}
          <line x1="288" y1="356" x2="325" y2="356" stroke={LC} strokeWidth={LW}/>
          <line x1="427" y1="356" x2="457" y2="356" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="356" x2="589" y2="356" stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="356" x2="721" y2="356" stroke={LC} strokeWidth={LW}/>

          {/* ── NODES ── */}
          {/* Orange start — center y=228 aligns with Confirmation L2 */}
          <rect x="10" y="208" width="130" height="40" rx="20" fill="#F06C00"/>
          <text x="75" y="233" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600" fontFamily="'Overused Grotesk',sans-serif">Smart Basket</text>

          {/* L2 nodes */}
          {[
            { label: "Shopping",     cy: 70  },
            { label: "Confirmation", cy: 228 },
            { label: "Need Help",    cy: 356 },
          ].map(({ label, cy }) => (
            <g key={label}>
              <rect x="180" y={cy - 17} width="108" height="34" rx="17"
                fill="#e8e8e8" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
              <text x="234" y={cy + 5} textAnchor="middle"
                fill="rgba(0,0,0,0.7)" fontSize="11.5" fontFamily="'Overused Grotesk',sans-serif">{label}</text>
            </g>
          ))}

          {/* Shopping Row 1 (baseY=26) */}
          {stepNodes([
            { x: 325, label: "Place Items"   },
            { x: 457, label: "Auto-Scanned"  },
            { x: 589, label: "Basket Ready"  },
            { x: 721, label: "At Terminal"   },
          ], 26)}

          {/* Shopping Row 2 (baseY=86) */}
          {stepNodes([
            { x: 325, label: "Weighted Item"  },
            { x: 457, label: "Flagged"        },
            { x: 589, label: "Confirm/Remove" },
          ], 86)}

          {/* Confirmation Row 1 (baseY=184) */}
          {stepNodes([
            { x: 325, label: "Review Items" },
            { x: 457, label: "All Clear"    },
            { x: 589, label: "Pay"          },
            { x: 721, label: "Receipt"      },
            { x: 853, label: "Exit"         },
          ], 184)}

          {/* Confirmation Row 2 (baseY=244) */}
          {stepNodes([
            { x: 325, label: "Item Issue"  },
            { x: 457, label: "Remove Item" },
            { x: 589, label: "Re-confirm"  },
          ], 244)}

          {/* Need Help Row (baseY=342) */}
          {stepNodes([
            { x: 325, label: "Call Staff"    },
            { x: 457, label: "Live Status"   },
            { x: 589, label: "Staff Assists" },
            { x: 721, label: "Resolved"      },
          ], 342)}

        </svg>
      </div>
    </section>
  );
}

function KeyStatsSection() {
  return (
    <section className="sb-ks">
      <div className="sb-ks-dots">
        <span className="sb-ks-dot sb-ks-dot--orange" />
        <span className="sb-ks-dot sb-ks-dot--yellow" />
        <span className="sb-ks-dot sb-ks-dot--purple" />
      </div>

      <div className="sb-ks-intro">
        <p className="sb-ks-intro-heading">Three themes. One compounding failure chain.</p>
        <p className="sb-ks-intro-body">Reliability failures make error recovery critical. Poor error recovery increases staff dependency. Staff dependency defeats the purpose of self-checkout. Physical design compounds everything.</p>
      </div>

      <div className="sb-ks-grid">
        {/* Row 1 — theme 01, left */}
        <div className="sb-ks-cell sb-ks-cell--stat">
          <span className="sb-ks-value"><PaddedCountUp to={1} /></span>
          <span className="sb-ks-title">Unclear Error Recovery</span>
          <span className="sb-ks-label">When errors occurred, messaging was ambiguous. Users didn't know what action to take, leading to paralysis, embarrassment, and staff dependency.</span>
        </div>
        <div className="sb-ks-cell" />
        <div className="sb-ks-cell" />

        {/* Row 2 — theme 02, center */}
        <div className="sb-ks-cell" />
        <div className="sb-ks-cell sb-ks-cell--stat">
          <span className="sb-ks-value"><PaddedCountUp to={2} /></span>
          <span className="sb-ks-title">Poor Physical Design</span>
          <span className="sb-ks-label">The bagging area was too small and awkwardly positioned. Users constantly collided with carts or dropped items due to spatial misalignment.</span>
        </div>
        <div className="sb-ks-cell" />

        {/* Row 3 — theme 03, right */}
        <div className="sb-ks-cell" />
        <div className="sb-ks-cell" />
        <div className="sb-ks-cell sb-ks-cell--stat">
          <span className="sb-ks-value"><PaddedCountUp to={3} /></span>
          <span className="sb-ks-title">Staff Dependency</span>
          <span className="sb-ks-label">Every reliability failure and every unclear error state led to the same outcome: waiting for staff. The machine's promise of autonomy was consistently broken.</span>
        </div>
      </div>
    </section>
  );
}

function ProblemSection({ section }) {
  return (
    <section className="sb-problem">
      <div className="sb-problem-header">
        <h2 className="sb-problem-title">
          {section.heading} <span className="sb-problem-arrow">↘</span>
        </h2>
        <p className="sb-problem-desc">
          {Array.isArray(section.body) ? section.body[0] : section.body}
        </p>
      </div>

      <div className="sb-problem-grid">
        {/* Top row — 3 cards */}
        <div className="sb-problem-row">
          <div className="sb-problem-card">
            <span className="sb-problem-card-num">Problem: 01</span>
            <p className="sb-problem-card-text">Machine error mid-scan. Had to call for staff twice in a single visit.</p>
          </div>
          <div className="sb-problem-card sb-problem-card--raised">
            <span className="sb-problem-card-num">Problem: 02</span>
            <p className="sb-problem-card-text">The bagging area rejected my items repeatedly. No clue why.</p>
          </div>
          <div className="sb-problem-card">
            <span className="sb-problem-card-num">Problem: 03</span>
            <p className="sb-problem-card-text">The screen froze on payment and I had to abandon my trolley entirely.</p>
          </div>
        </div>

        {/* Center — animated ? */}
        <div className="sb-problem-qmark-row">
          <div className="sb-problem-qmark" aria-hidden="true">?</div>
        </div>

        {/* Bottom row — 3 cards */}
        <div className="sb-problem-row">
          <div className="sb-problem-card">
            <span className="sb-problem-card-num">Problem: 04</span>
            <p className="sb-problem-card-text">Error messages just say 'unexpected item'. There's no guidance on what to do.</p>
          </div>
          <div className="sb-problem-card sb-problem-card--lowered">
            <span className="sb-problem-card-num">Problem: 05</span>
            <p className="sb-problem-card-text">Easier to queue for a staffed till. At least that actually works every time.</p>
          </div>
          <div className="sb-problem-card">
            <span className="sb-problem-card-num">Problem: 06</span>
            <p className="sb-problem-card-text">Waited 5 minutes for staff to override a weighing error on a bag of apples.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FadeSection({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`sb-fade${visible ? " sb-fade--in" : ""}`}>
      {children}
    </div>
  );
}

export function SainsburyUsecasePage({ project }) {
  const navigate = useNavigate();
  const sections = project.sections || [];
  const overview = project.overview || {};

  const metaRows = [
    { label: "Project",  value: project.shortTitle },
    { label: "Industry", value: project.category },
    { label: "Year",     value: project.year },
    overview.role     && { label: "Role",     value: overview.role },
    overview.timeline && { label: "Timeline", value: overview.timeline },
  ].filter(Boolean);

  return (
    <div className="ulio-usecase sb-usecase">
      <article className="ulio-usecase-inner">
        <button className="cs-back" onClick={() => navigate("/?section=work")} type="button">
          <span className="cs-back-arrow">←</span> All Work
        </button>

        {/* ── INTRO (white card, Babbel-style) ─────────────── */}
        <section className="sb-intro">

          {/* 1 — Large editorial headline */}
          <h1 className="sb-intro-headline">
            {project.shortTitle}:{" "}
            <strong>Redesigning Self-Checkout</strong> Through{" "}
            <strong>Mixed-Methods Research</strong>
          </h1>

          {/* 2 — Ghost brand name + about text */}
          <div className="sb-intro-mid">
            <div className="sb-intro-ghost" aria-hidden="true">
              +Sainsbury's
            </div>
            <div className="sb-intro-about">
              <h3>About the Project</h3>
              <p>{project.summary}</p>
            </div>
          </div>

          {/* 3 — Meta table + method tags */}
          <div className="sb-intro-bottom">
            <div className="sb-intro-meta">
              {metaRows.map((row) => (
                <div key={row.label} className="sb-meta-row">
                  <span className="sb-meta-label">{row.label}</span>
                  <span className="sb-meta-value">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="sb-intro-tags">
              {(overview.methods || []).map((method, i) => (
                <span key={method} className="sb-intro-tag">
                  <TypedText text={method} delay={i * 240} />
                </span>
              ))}
            </div>
          </div>

        </section>

        {/* ── BENTO GRID ───────────────────────────────────── */}
        <div className="sb-bento">

          {/* 1 — Grayscale photo card */}
          <div className="sb-bento-card sb-bento-photo">
            <img
              src="/assets/projects/1%20sains.jpg"
              alt="Sainsbury's self-checkout fieldwork"
              className="sb-bento-photo-img"
            />
            <div className="sb-bento-photo-overlay">
              <span className="sb-bento-photo-loc">New Cross Road · London</span>
              <span className="sb-bento-photo-caption">Sainsbury's · 2024</span>
            </div>
          </div>

          {/* 2 — Dark quote card */}
          <div className="sb-bento-card sb-bento-quote">
            <p className="sb-bento-quote-text">
              When convenience becomes a burden.
            </p>
            <p className="sb-bento-quote-sub">
              Every machine error requiring staff intervention negates the efficiency self-checkout was designed to deliver.
            </p>
            <span className="sb-bento-url">sainsburys.co.uk →</span>
          </div>

          {/* 4 — Tall hero card (spans both rows, right side) */}
          <div className="sb-bento-card sb-bento-tall">
            <img
              src="/assets/projects/2%20sains.jpg"
              alt="Smart Basket concept"
              className="sb-bento-tall-img"
            />
            <div className="sb-bento-tall-overlay">
              <p className="sb-bento-tall-title">Smart Basket: Redesigning Self-Checkout</p>
            </div>
          </div>

          {/* 5 — Orange stat card */}
          <div className="sb-bento-card sb-bento-stat">
            <span className="sb-bento-stat-num"><PopIn>1 in 3</PopIn></span>
            <p className="sb-bento-stat-desc">
              shoppers needed staff assistance at least once per visit
            </p>
          </div>

          {/* 6 — Dark wide card: key stats + mockup */}
          <div className="sb-bento-card sb-bento-mock">
            <div className="sb-bento-mock-content">
              <div className="sb-bento-mock-stats">
                <div className="sb-bento-mock-stat-item">
                  <span className="sb-bento-mock-stat-val"><CountUp to={47} suffix="%" /></span>
                  <span className="sb-bento-mock-stat-lbl">transactions hit an error state</span>
                </div>
                <div className="sb-bento-mock-stat-item">
                  <span className="sb-bento-mock-stat-val"><CountUp to={3} suffix="×" decimals={1} /></span>
                  <span className="sb-bento-mock-stat-lbl">longer wait when staff were needed</span>
                </div>
              </div>
              <img
                src="/assets/projects/3%20sains.jpg"
                alt="Smart Basket UI"
                className="sb-bento-mock-img"
              />
            </div>
          </div>

        </div>

        {/* ── SECTIONS ─────────────────────────────────────── */}
        {sections.map((section, idx) => idx === 0 ? (
          <React.Fragment key={idx}>
            <FadeSection>
              <ProblemSection section={section} />
            </FadeSection>
            <FadeSection>
              <SolutionsSection />
            </FadeSection>
            <FadeSection>
              <DesignProcessSection />
            </FadeSection>
            <FadeSection>
              <KeyStatsSection />
            </FadeSection>
            <FadeSection>
              <UserFlowSection />
            </FadeSection>
            <FadeSection>
              <PrototypeShowcaseSection />
            </FadeSection>
            <FadeSection>
              <WouldDoDifferentlySection />
            </FadeSection>
          </React.Fragment>
        ) : (
          <FadeSection key={idx}>
            <section className="sb-section">
              <div className="sb-section-label">{section.label}</div>
              <h2 className="sb-section-heading">{section.heading}</h2>

              {Array.isArray(section.body)
                ? section.body.map((p, i) => <p key={i} className="sb-section-body">{p}</p>)
                : section.body && <p className="sb-section-body">{section.body}</p>
              }

              {section.stats && (
                <div className="sb-stats-grid">
                  {section.stats.map((stat, si) => (
                    <div key={si} className="sb-stat-card">
                      <span className="sb-stat-value">{stat.value}</span>
                      <span className="sb-stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {section.items && (
                <div className="ulio-research-grid">
                  {section.items.map((item, ii) => (
                    <div key={ii} className="ulio-research-card">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.note && <p className="sb-note">{section.note}</p>}
            </section>
          </FadeSection>
        ))}

        {/* ── IMPACT ───────────────────────────────────────── */}
        {project.impact && project.impact.length > 0 && (
          <FadeSection>
            <section className="sb-section">
              <div className="sb-section-label">Key Outcomes</div>
              <ul className="ulio-pain-list" style={{ marginTop: "1rem" }}>
                {project.impact.map((item, i) => (
                  <li key={i}><span aria-hidden="true">🎯</span>{item}</li>
                ))}
              </ul>
            </section>
          </FadeSection>
        )}

        {/* ── FOOTER ───────────────────────────────────────── */}
        <section className="ulio-footer">
          <p>{project.year} · {project.category}</p>
          <h2>{"Thank you for\nreading through!"}</h2>
        </section>

      </article>
    </div>
  );
}
