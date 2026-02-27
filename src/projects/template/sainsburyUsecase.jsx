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

function BasketScreen() {
  const items = [
    { name: "Whole Milk 2L",   price: "£1.45", done: true  },
    { name: "Sourdough Bread", price: "£2.20", done: true  },
    { name: "Mature Cheddar",  price: "£3.50", done: true  },
    { name: "Loose Apples",    price: "wt.",   done: false },
  ];
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Backgrounds */}
      <rect width="480" height="300" fill="#F8F5F1"/>
      <rect width="270" height="300" fill="#FFFFFF"/>

      {/* ── FULL-WIDTH ORANGE HEADER ── */}
      <rect width="480" height="52" fill="#F06C00"/>
      {/* Sainsbury's wordmark */}
      <text x="14" y="34" fontSize="17" fontWeight="700" fontStyle="italic" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif">Sainsbury's</text>
      <rect x="126" y="14" width="1" height="24" fill="rgba(255,255,255,0.3)"/>
      <text x="136" y="23" fontSize="8" fill="rgba(255,255,255,0.7)" fontFamily="'Overused Grotesk',system-ui,sans-serif" letterSpacing="1.2" fontWeight="700">SMART BASKET</text>
      <text x="136" y="38" fontSize="11.5" fontWeight="600" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif">Basket scanning active</text>
      <circle cx="268" cy="28" r="3.5" fill="#4ade80"/>
      <text x="277" y="32" fontSize="8.5" fill="rgba(255,255,255,0.88)" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="700">LIVE</text>
      {/* Help button */}
      <rect x="436" y="16" width="30" height="20" rx="5" fill="rgba(255,255,255,0.18)"/>
      <text x="451" y="30" fontSize="11.5" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="middle">?</text>
      {/* Right header: My Basket */}
      <line x1="270" y1="0" x2="270" y2="52" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <text x="284" y="27" fontSize="13" fontWeight="700" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif">My Basket</text>
      <rect x="349" y="14" width="22" height="16" rx="8" fill="rgba(255,255,255,0.28)"/>
      <text x="360" y="26" fontSize="9.5" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="middle" fontWeight="700">4</text>
      <text x="284" y="42" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="'Overused Grotesk',system-ui,sans-serif">3 confirmed · 1 weighing</text>

      {/* ── LEFT PANEL ── */}
      <text x="14" y="68" fontSize="8" fill="#bbb" fontFamily="'Overused Grotesk',system-ui,sans-serif" letterSpacing="0.8" fontWeight="600">CURRENTLY DETECTING</text>

      {/* Product detection card */}
      <rect x="14" y="74" width="242" height="86" rx="10" fill="#FFF8F2" stroke="#F5E6D5" strokeWidth="1"/>
      {/* Product icon swatch */}
      <rect x="26" y="86" width="48" height="50" rx="8" fill="#EDF7E6"/>
      <ellipse cx="50" cy="107" rx="11" ry="14" fill="#7CB342" fillOpacity="0.75"/>
      <path d="M50,93 Q55,89 59,91" stroke="#558B2F" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Item info */}
      <text x="84" y="95" fontSize="13.5" fontWeight="700" fill="#111" fontFamily="'Overused Grotesk',system-ui,sans-serif">Loose Apples</text>
      <text x="84" y="108" fontSize="9.5" fill="#999" fontFamily="'Overused Grotesk',system-ui,sans-serif">Fruit · Produce aisle</text>
      <rect x="84" y="116" width="98" height="17" rx="8.5" fill="#FFFBEB" stroke="#FCD34D" strokeWidth="0.8"/>
      <circle cx="94" cy="124.5" r="3" fill="#F59E0B"/>
      <text x="102" y="128" fontSize="8.5" fill="#D97706" fontWeight="600" fontFamily="'Overused Grotesk',system-ui,sans-serif">Detecting weight…</text>
      {/* Price placeholder */}
      <text x="246" y="102" fontSize="14" fontWeight="700" fill="#D0C8BE" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end">wt.</text>
      <text x="246" y="116" fontSize="8.5" fill="#D0C8BE" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end">per kg</text>

      {/* Progress bar */}
      <text x="14" y="177" fontSize="8" fill="#bbb" fontFamily="'Overused Grotesk',system-ui,sans-serif" letterSpacing="0.5" fontWeight="600">BASKET PROGRESS</text>
      <rect x="14" y="183" width="242" height="5" rx="2.5" fill="#EEE"/>
      <rect x="14" y="183" width="182" height="5" rx="2.5" fill="#F06C00"/>
      <text x="14" y="199" fontSize="9" fill="#777" fontFamily="'Overused Grotesk',system-ui,sans-serif">3 of 4 items confirmed</text>
      <text x="256" y="199" fontSize="9" fill="#F06C00" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end" fontWeight="700">75%</text>

      {/* Confirmed chips */}
      <text x="14" y="216" fontSize="8" fill="#bbb" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="600">CONFIRMED</text>
      {[
        { label: "Milk",      x: 14,  w: 40  },
        { label: "Sourdough", x: 60,  w: 68  },
        { label: "Cheddar",   x: 134, w: 62  },
        { label: "Apples ↻",  x: 202, w: 64, pending: true },
      ].map(({ label, x, w, pending }) => (
        <g key={label}>
          <rect x={x} y={221} width={w} height={19} rx={9.5} fill={pending ? "#FFFBEB" : "#F0FFF4"} stroke={pending ? "#FCD34D" : "#86efac"} strokeWidth="1"/>
          <text x={x + w / 2} y={234} fontSize="8.5" textAnchor="middle" fill={pending ? "#D97706" : "#16a34a"} fontWeight="600" fontFamily="'Overused Grotesk',system-ui,sans-serif">{label}</text>
        </g>
      ))}

      {/* Nectar strip */}
      <rect x="14" y="248" width="242" height="22" rx="7" fill="#F5F0FF" stroke="rgba(124,58,237,0.2)" strokeWidth="1"/>
      <text x="26" y="263" fontSize="9.5" fill="#7C3AED" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="700">Nectar</text>
      <text x="66" y="263" fontSize="9.5" fill="#555" fontFamily="'Overused Grotesk',system-ui,sans-serif">You'll earn approximately</text>
      <text x="248" y="263" fontSize="9.5" fill="#7C3AED" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="700" textAnchor="end">+8 pts</text>

      {/* ── RIGHT PANEL ── */}
      <line x1="270" y1="52" x2="270" y2="300" stroke="#EDE9E3" strokeWidth="1"/>
      {items.map(({ name, price, done }, i) => {
        const y = 60 + i * 46;
        return (
          <g key={i}>
            {i > 0 && <line x1="278" y1={y} x2="468" y2={y} stroke="#F0EBE5" strokeWidth="1"/>}
            <rect x="278" y={y + 11} width="18" height="18" rx="9" fill={done ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)"}/>
            <text x="287" y={y + 24} fontSize="10" fill={done ? "#22c55e" : "#F59E0B"} textAnchor="middle" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="700">{done ? "✓" : "↻"}</text>
            <text x="304" y={y + 18} fontSize="11.5" fontWeight="600" fill={done ? "#111" : "#999"} fontFamily="'Overused Grotesk',system-ui,sans-serif">{name}</text>
            <text x="304" y={y + 31} fontSize="9" fill={done ? "#16a34a" : "#D97706"} fontFamily="'Overused Grotesk',system-ui,sans-serif">{done ? "Added to basket" : "Weighing…"}</text>
            <text x="466" y={y + 21} fontSize="13" fontWeight="700" fill={done ? "#111" : "#ccc"} fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end">{price}</text>
          </g>
        );
      })}
      <line x1="270" y1="248" x2="480" y2="248" stroke="#E8E3DD" strokeWidth="1.5"/>
      <text x="278" y="262" fontSize="10" fill="#888" fontFamily="'Overused Grotesk',system-ui,sans-serif">Subtotal (3 of 4 items)</text>
      <text x="468" y="262" fontSize="13.5" fontWeight="700" fill="#111" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end">£7.15</text>
      <rect x="278" y="270" width="190" height="26" rx="7" fill="#F06C00"/>
      <text x="373" y="287" fontSize="11.5" fontWeight="700" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="middle">Go to checkout  →</text>
    </svg>
  );
}

function TerminalScreen() {
  const items = [
    { name: "Whole Milk 2L",       price: "£1.45" },
    { name: "Sourdough Bread",     price: "£2.20" },
    { name: "Mature Cheddar 400g", price: "£3.50" },
    { name: "Loose Apples 280g",   price: "£0.89" },
  ];
  return (
    <svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Backgrounds */}
      <rect width="480" height="300" fill="#111111"/>
      <rect width="270" height="300" fill="#0C0C0C"/>

      {/* ── FULL-WIDTH ORANGE HEADER ── */}
      <rect width="480" height="52" fill="#F06C00"/>
      {/* Sainsbury's wordmark */}
      <text x="14" y="34" fontSize="17" fontWeight="700" fontStyle="italic" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif">Sainsbury's</text>
      <rect x="126" y="14" width="1" height="24" fill="rgba(255,255,255,0.3)"/>
      <text x="136" y="24" fontSize="8" fill="rgba(255,255,255,0.7)" fontFamily="'Overused Grotesk',system-ui,sans-serif" letterSpacing="1.2" fontWeight="700">SELF CHECKOUT</text>
      <text x="136" y="39" fontSize="12" fontWeight="600" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif">Confirm &amp; Pay</text>
      {/* Scan-complete badge */}
      <rect x="244" y="17" width="82" height="19" rx="9.5" fill="rgba(0,0,0,0.22)"/>
      <circle cx="255" cy="26.5" r="3.5" fill="#4ade80"/>
      <text x="263" y="30.5" fontSize="8.5" fill="rgba(255,255,255,0.9)" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="600">Scan complete</text>
      {/* Right: ORDER TOTAL */}
      <line x1="272" y1="0" x2="272" y2="52" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <text x="286" y="22" fontSize="8" fill="rgba(255,255,255,0.65)" fontFamily="'Overused Grotesk',system-ui,sans-serif" letterSpacing="1" fontWeight="700">ORDER TOTAL</text>
      <text x="286" y="43" fontSize="20" fontWeight="700" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif">£7.54</text>

      {/* ── LEFT PANEL ── */}
      {/* All items banner */}
      <rect x="12" y="60" width="252" height="30" rx="7" fill="rgba(22,163,74,0.12)" stroke="rgba(74,222,128,0.22)" strokeWidth="1"/>
      <circle cx="24" cy="75" r="7" fill="rgba(34,197,94,0.18)"/>
      <text x="24" y="79.5" fontSize="10" fill="#4ade80" textAnchor="middle" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="700">✓</text>
      <text x="37" y="73" fontSize="10" fill="#4ade80" fontWeight="700" fontFamily="'Overused Grotesk',system-ui,sans-serif">All 4 items scanned</text>
      <text x="37" y="85" fontSize="8.5" fill="rgba(74,222,128,0.55)" fontFamily="'Overused Grotesk',system-ui,sans-serif">Ready for payment · No re-scanning needed</text>

      <text x="14" y="106" fontSize="8" fill="rgba(255,255,255,0.28)" fontFamily="'Overused Grotesk',system-ui,sans-serif" letterSpacing="0.8" fontWeight="600">YOUR BASKET</text>

      {items.map(({ name, price }, i) => {
        const y = 112 + i * 35;
        return (
          <g key={i}>
            <rect x="12" y={y} width="252" height="29" rx="7" fill="#1C1C1C"/>
            <rect x="12" y={y} width="3.5" height="29" rx="1.75" fill="#F06C00" fillOpacity="0.65"/>
            <circle cx="30" cy={y + 14.5} r="5" fill="rgba(34,197,94,0.15)"/>
            <text x="30" y={y + 18.5} fontSize="9" fill="#22c55e" textAnchor="middle" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="700">✓</text>
            <text x="43" y={y + 12} fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.85)" fontFamily="'Overused Grotesk',system-ui,sans-serif">{name}</text>
            <text x="43" y={y + 24} fontSize="8.5" fill="rgba(255,255,255,0.25)" fontFamily="'Overused Grotesk',system-ui,sans-serif">×1 · Confirmed</text>
            <text x="256" y={y + 19} fontSize="11.5" fontWeight="700" fill="rgba(255,255,255,0.85)" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end">{price}</text>
          </g>
        );
      })}

      {/* Nectar strip */}
      <rect x="12" y="258" width="252" height="34" rx="8" fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.25)" strokeWidth="1"/>
      <rect x="12" y="258" width="3.5" height="34" rx="1.75" fill="#7C3AED"/>
      <text x="26" y="273" fontSize="9.5" fill="#A78BFA" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="700">Nectar</text>
      <text x="68" y="273" fontSize="9.5" fill="rgba(255,255,255,0.45)" fontFamily="'Overused Grotesk',system-ui,sans-serif">Points earned today</text>
      <text x="257" y="273" fontSize="9.5" fill="#A78BFA" fontFamily="'Overused Grotesk',system-ui,sans-serif" fontWeight="700" textAnchor="end">+8 pts</text>
      <text x="26" y="285" fontSize="8.5" fill="rgba(167,139,250,0.5)" fontFamily="'Overused Grotesk',system-ui,sans-serif">Linked: J. Smith · 1,248 total pts</text>

      {/* ── RIGHT PANEL ── */}
      <line x1="272" y1="52" x2="272" y2="300" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

      {/* Order summary card */}
      <rect x="282" y="60" width="186" height="92" rx="10" fill="#1C1C1C"/>
      <text x="296" y="78" fontSize="8" fill="rgba(255,255,255,0.28)" fontFamily="'Overused Grotesk',system-ui,sans-serif" letterSpacing="0.8" fontWeight="600">ORDER SUMMARY</text>
      <line x1="296" y1="84" x2="458" y2="84" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      <text x="296" y="101" fontSize="10.5" fill="rgba(255,255,255,0.4)" fontFamily="'Overused Grotesk',system-ui,sans-serif">Subtotal (4 items)</text>
      <text x="458" y="101" fontSize="10.5" fill="rgba(255,255,255,0.5)" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end">£8.04</text>
      <text x="296" y="119" fontSize="10.5" fill="rgba(255,255,255,0.4)" fontFamily="'Overused Grotesk',system-ui,sans-serif">Nectar saving</text>
      <text x="458" y="119" fontSize="10.5" fill="#4ade80" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end">−£0.50</text>
      <line x1="296" y1="127" x2="458" y2="127" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x="296" y="145" fontSize="13" fontWeight="700" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif">Total</text>
      <text x="458" y="145" fontSize="17" fontWeight="700" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="end">£7.54</text>

      {/* Pay by Card CTA */}
      <rect x="282" y="162" width="186" height="46" rx="10" fill="#F06C00"/>
      <text x="375" y="181" fontSize="13" fontWeight="700" fill="white" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="middle">Pay by Card</text>
      <text x="375" y="197" fontSize="9.5" fill="rgba(255,255,255,0.75)" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="middle">Insert · Tap · Swipe</text>

      {/* Pay by Phone */}
      <rect x="282" y="216" width="186" height="38" rx="10" fill="#1C1C1C" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <text x="375" y="232" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.55)" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="middle">Pay by Phone</text>
      <text x="375" y="246" fontSize="8.5" fill="rgba(255,255,255,0.25)" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="middle">Apple Pay · Google Pay</text>

      {/* Assistance */}
      <rect x="282" y="264" width="186" height="28" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      <text x="375" y="282" fontSize="9.5" fill="rgba(255,255,255,0.28)" fontFamily="'Overused Grotesk',system-ui,sans-serif" textAnchor="middle">Need help? Call for assistance →</text>
    </svg>
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

function PrototypeShowcaseSection() {
  return (
    <section className="sb-proto">
      <div className="sb-proto-intro">
        <p className="sb-proto-eyebrow">Screen Prototype</p>
        <h2 className="sb-proto-title">
          <strong>Rethinking</strong> the checkout<br />from the basket up
        </h2>
      </div>

      <div className="sb-proto-stage">
        {/* ── Row 1: Kiosk (basket) + caption ── */}
        <div className="sb-proto-row">
          <div className="sb-proto-device-wrap">
            <div className="sb-proto-kiosk">
              <div className="sb-proto-kiosk-topbar"/>
              <div className="sb-proto-kiosk-screen-frame">
                <div className="sb-proto-screen-inner">
                  <BasketScreen />
                </div>
              </div>
              <div className="sb-proto-kiosk-base">
                <div className="sb-proto-kiosk-slot"/>
                <span className="sb-proto-kiosk-tap">◉ TAP</span>
              </div>
            </div>
          </div>
          <div className="sb-proto-caption">
            <span className="sb-proto-caption-tag">Smart Basket</span>
            <h3 className="sb-proto-caption-title">Scan-as-you-shop</h3>
            <p className="sb-proto-caption-body">
              Sensor-embedded basket auto-identifies items as they're placed inside. Real-time confirmation on the terminal display. No barcode scanning, no bagging area, no errors.
            </p>
            <ul className="sb-proto-caption-list">
              <li>Auto-identifies items by sensor array</li>
              <li>Flags weighted items before checkout</li>
              <li>Live subtotal updated in real time</li>
            </ul>
          </div>
        </div>

        {/* ── Row 2: caption + Kiosk (terminal) ── */}
        <div className="sb-proto-row sb-proto-row--flip">
          <div className="sb-proto-caption sb-proto-caption--dark">
            <span className="sb-proto-caption-tag">Checkout Terminal</span>
            <h3 className="sb-proto-caption-title">Confirm. Tap. Done.</h3>
            <p className="sb-proto-caption-body">
              By the time you reach the terminal, scanning is already complete. Review your pre-confirmed list, apply Nectar points, and pay in one tap. Assistance always on screen.
            </p>
            <ul className="sb-proto-caption-list sb-proto-caption-list--dark">
              <li>No item-by-item scanning at terminal</li>
              <li>Nectar loyalty applied automatically</li>
              <li>Call for Assistance always visible</li>
            </ul>
          </div>
          <div className="sb-proto-device-wrap">
            <div className="sb-proto-kiosk sb-proto-kiosk--right">
              <div className="sb-proto-kiosk-topbar"/>
              <div className="sb-proto-kiosk-screen-frame">
                <div className="sb-proto-screen-inner sb-proto-screen-inner--dark">
                  <TerminalScreen />
                </div>
              </div>
              <div className="sb-proto-kiosk-base">
                <div className="sb-proto-kiosk-slot"/>
                <span className="sb-proto-kiosk-tap">◉ TAP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserFlowSection() {
  const LC = "rgba(255,255,255,0.22)";
  const LW = "1.5";
  const stepNodes = (rows, baseY) => rows.map(({ x, label, y: rowY }) => (
    <g key={label}>
      <rect x={x} y={rowY ?? baseY} width="102" height="28" rx="14"
        fill="#1a1a1a" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      <text x={x + 51} y={(rowY ?? baseY) + 19} textAnchor="middle"
        fill="rgba(255,255,255,0.78)" fontSize="10.5" fontFamily="'Overused Grotesk',sans-serif">{label}</text>
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
                fill="#1e1e1e" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
              <text x="234" y={cy + 5} textAnchor="middle"
                fill="rgba(255,255,255,0.88)" fontSize="11.5" fontFamily="'Overused Grotesk',sans-serif">{label}</text>
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

        {/* ── ORANGE HERO CARD ─────────────────────────────── */}
        <section className="ulio-hero sb-hero">
          <div className="ulio-hero-pill">
            <span className="ulio-hero-pill-brand">
              <span className="ulio-hero-pill-logo">S</span>
              {project.shortTitle}
            </span>
            <span className="ulio-hero-pill-title">{project.category}</span>
          </div>
          <div className="ulio-hero-grid sb-hero-grid">
            <div className="ulio-hero-mockup-only">
              <img
                src="https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"
                alt={project.shortTitle}
                loading="eager"
                className="sb-hero-img"
              />
            </div>
          </div>
        </section>

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
