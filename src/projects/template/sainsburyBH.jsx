import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./sb-bh.css";

// ── Animation helpers ───────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, on];
}

function CountUp({ to, suffix = "", duration = 1600, decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => { observer.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [to, duration, decimals]);
  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>;
}

function PopIn({ children }) {
  const [ref, on] = useReveal(0.3);
  return (
    <span ref={ref} className={`sb-bh-popin${on ? " sb-bh-popin--on" : ""}`}>
      {children}
    </span>
  );
}

// ── Section Components ──────────────────────────────────────────────────────

function StatsBar() {
  return (
    <section className="sb-bh-stats">
      <div className="sb-bh-stats-item">
        <span className="sb-bh-stats-val"><PopIn>1 in 3</PopIn></span>
        <span className="sb-bh-stats-lbl">shoppers needed staff assistance at least once per visit</span>
      </div>
      <div className="sb-bh-stats-div" />
      <div className="sb-bh-stats-item">
        <span className="sb-bh-stats-val"><CountUp to={47} suffix="%" /></span>
        <span className="sb-bh-stats-lbl">of observed transactions triggered at least one error state</span>
      </div>
      <div className="sb-bh-stats-div" />
      <div className="sb-bh-stats-item">
        <span className="sb-bh-stats-val"><CountUp to={3} suffix="×" decimals={1} /></span>
        <span className="sb-bh-stats-lbl">longer average wait when a machine error required staff resolution</span>
      </div>
    </section>
  );
}

function ProblemSection() {
  const [ref, on] = useReveal(0.08);
  return (
    <section ref={ref} className={`sb-bh-section sb-bh-problem${on ? " sb-bh-r--on" : ""}`}>
      <div className="sb-bh-section-label">01 / Problem</div>
      <h2 className="sb-bh-section-h2">
        When convenience becomes a burden <span className="sb-bh-arrow">↘</span>
      </h2>
      <p className="sb-bh-section-body">
        It started with a personal observation. As an international student in the UK,
        I struggled with Sainsbury's self-checkout machines: the confusing prompts, the
        unexpected error states, the bagging area that seemed to have a mind of its own.
        But standing in a queue one afternoon, I watched local customers — people who had
        used these machines for years — experiencing the exact same friction.
      </p>

      <div className="sb-bh-problem-grid">
        <div className="sb-bh-problem-card">
          <span className="sb-bh-problem-num">Problem: 01</span>
          <p className="sb-bh-problem-text">Machine error mid-scan. Had to call for staff twice in a single visit.</p>
        </div>
        <div className="sb-bh-problem-card sb-bh-problem-card--raised">
          <span className="sb-bh-problem-num">Problem: 02</span>
          <p className="sb-bh-problem-text">The bagging area rejected my items repeatedly. No clue why.</p>
        </div>
        <div className="sb-bh-problem-card">
          <span className="sb-bh-problem-num">Problem: 03</span>
          <p className="sb-bh-problem-text">The screen froze on payment and I had to abandon my trolley entirely.</p>
        </div>
        <div className="sb-bh-problem-card">
          <span className="sb-bh-problem-num">Problem: 04</span>
          <p className="sb-bh-problem-text">Error messages just say 'unexpected item'. There's no guidance on what to do.</p>
        </div>
        <div className="sb-bh-problem-card sb-bh-problem-card--lowered">
          <span className="sb-bh-problem-num">Problem: 05</span>
          <p className="sb-bh-problem-text">Easier to queue for a staffed till. At least that actually works every time.</p>
        </div>
        <div className="sb-bh-problem-card">
          <span className="sb-bh-problem-num">Problem: 06</span>
          <p className="sb-bh-problem-text">Waited 5 minutes for staff to override a weighing error on a bag of apples.</p>
        </div>
      </div>

      <blockquote className="sb-bh-quote">
        "Why has nobody fixed this?"
        <cite>The question that started everything</cite>
      </blockquote>
    </section>
  );
}

function ResearchSection() {
  const [ref, on] = useReveal(0.08);
  const methods = [
    { icon: "📖", name: "Literature Review", detail: "Existing UX research on self-checkout failure modes and retail automation" },
    { icon: "📋", name: "Survey", detail: "n=17 participants · quantitative baseline on error frequency & satisfaction" },
    { icon: "🎙", name: "Interviews", detail: "n=5 semi-structured sessions · qualitative deep-dive into lived experience" },
    { icon: "👁", name: "Observational Fieldwork", detail: "Two weeks at Sainsbury's New Cross Road · 47% error rate recorded" },
    { icon: "📊", name: "Thematic Analysis", detail: "Coded interview & survey data into three compounding failure themes" },
  ];
  return (
    <section ref={ref} className={`sb-bh-section${on ? " sb-bh-r--on" : ""}`}>
      <div className="sb-bh-section-label">02 / Research</div>
      <h2 className="sb-bh-section-h2">Mixed methods. One compounding story.</h2>
      <p className="sb-bh-section-body">
        Rather than assume, I investigated. Five research methods, each revealing a different
        layer of the same systemic failure.
      </p>
      <div className="sb-bh-research-table">
        {methods.map((m) => (
          <div key={m.name} className="sb-bh-research-row">
            <span className="sb-bh-research-icon">{m.icon}</span>
            <span className="sb-bh-research-name">{m.name}</span>
            <span className="sb-bh-research-detail">{m.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThemesSection() {
  const [ref, on] = useReveal(0.08);
  return (
    <section ref={ref} className={`sb-bh-section${on ? " sb-bh-r--on" : ""}`}>
      <div className="sb-bh-section-label">03 / Findings</div>
      <h2 className="sb-bh-section-h2">Three themes. One compounding failure chain.</h2>
      <p className="sb-bh-section-body">
        Reliability failures make error recovery critical. Poor error recovery increases
        staff dependency. Staff dependency defeats the purpose of self-checkout.
      </p>
      <div className="sb-bh-themes">
        <div className="sb-bh-theme-card">
          <span className="sb-bh-theme-num">01</span>
          <h3 className="sb-bh-theme-title">Unclear Error Recovery</h3>
          <p className="sb-bh-theme-body">When errors occurred, messaging was ambiguous. Users didn't know what action to take, leading to paralysis, embarrassment, and staff dependency.</p>
        </div>
        <div className="sb-bh-theme-card">
          <span className="sb-bh-theme-num">02</span>
          <h3 className="sb-bh-theme-title">Poor Physical Design</h3>
          <p className="sb-bh-theme-body">The bagging area was too small and awkwardly positioned. Users constantly collided with carts or dropped items due to spatial misalignment.</p>
        </div>
        <div className="sb-bh-theme-card">
          <span className="sb-bh-theme-num">03</span>
          <h3 className="sb-bh-theme-title">Staff Dependency</h3>
          <p className="sb-bh-theme-body">Every reliability failure and every unclear error state led to the same outcome: waiting for staff. The machine's promise of autonomy was consistently broken.</p>
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const [ref, on] = useReveal(0.08);
  return (
    <section ref={ref} className={`sb-bh-section sb-bh-solution${on ? " sb-bh-r--on" : ""}`}>
      <div className="sb-bh-section-label">04 / Solution</div>
      <h2 className="sb-bh-section-h2">Smart Basket: change the interaction model entirely.</h2>
      <p className="sb-bh-section-body">
        Instead of fixing a broken checkout, I questioned the premise: why does scanning
        happen at the checkout at all? The Smart Basket pre-scans items during shopping.
        By the time the customer reaches the terminal, scanning is already done — leaving
        only confirmation and payment.
      </p>
      <div className="sb-bh-solution-grid">
        <div className="sb-bh-solution-card">
          <div className="sb-bh-solution-accent" />
          <h3>Scan-free checkout</h3>
          <p>RFID tags on items allow automatic basket scanning as you shop. No queue. No scanner. Just walk to the terminal.</p>
        </div>
        <div className="sb-bh-solution-card">
          <div className="sb-bh-solution-accent" />
          <h3>Proactive error messaging</h3>
          <p>Instead of ambiguous alerts, the redesigned UI tells you exactly what happened, why, and what to do next.</p>
        </div>
        <div className="sb-bh-solution-card">
          <div className="sb-bh-solution-accent" />
          <h3>Weighted item flow</h3>
          <p>Produce and loose items get a dedicated confirmation step — so the scale never rejects a bag of apples again.</p>
        </div>
        <div className="sb-bh-solution-card">
          <div className="sb-bh-solution-accent" />
          <h3>Staff request, redesigned</h3>
          <p>When staff are genuinely needed, the system gives live status: who's coming, ETA, and what they'll do.</p>
        </div>
      </div>
    </section>
  );
}

function DesignProcessSection() {
  const [ref, on] = useReveal(0.08);
  const phases = [
    { n: "01", title: "Discover", body: "Literature review + survey established the quantitative baseline: 1 in 3 users, 47% error rate, 3× wait time. Before spending a minute observing, I needed to know the scale of the problem." },
    { n: "02", title: "Explore", body: "Five semi-structured interviews surfaced the emotional toll: embarrassment, frustration, loss of trust. Observational fieldwork at New Cross Road turned the statistics into lived sequences." },
    { n: "03", title: "Define", body: "Thematic analysis coded 60+ data points into three compounding failure themes. The hypothesis: eliminate scanning at the terminal, and you eliminate the root cause of every error state." },
    { n: "04", title: "Design", body: "The Smart Basket concept redesigns the interaction model, not just the interface. RFID-enabled baskets, a simplified terminal flow, and a WCAG 2.1 AA accessible kiosk UI." },
  ];
  return (
    <section ref={ref} className={`sb-bh-section${on ? " sb-bh-r--on" : ""}`}>
      <div className="sb-bh-section-label">05 / Design Process</div>
      <h2 className="sb-bh-section-h2">Four phases. One hypothesis tested.</h2>
      <div className="sb-bh-process">
        {phases.map((p) => (
          <div key={p.n} className="sb-bh-process-item">
            <div className="sb-bh-process-num">{p.n}</div>
            <div className="sb-bh-process-content">
              <h3 className="sb-bh-process-title">{p.title}</h3>
              <p className="sb-bh-process-body">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const KIOSK_W = 1224;
const KIOSK_H = 690;

function PrototypeSection() {
  const [ref, on] = useReveal(0.08);
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [src, setSrc] = useState("https://akankshaux.in/sb-prototype/");

  useEffect(() => {
    const update = () => {
      if (wrapRef.current) setScale(wrapRef.current.offsetWidth / KIOSK_W);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section ref={ref} className={`sb-bh-section sb-bh-proto${on ? " sb-bh-r--on" : ""}`}>
      <div className="sb-bh-section-label">06 / Prototype</div>
      <h2 className="sb-bh-section-h2">Try the full checkout flow.</h2>
      <p className="sb-bh-section-body">
        Walk through the redesigned experience — Smart Basket scanning, item review, and tap-to-pay.
      </p>
      <div ref={wrapRef} className="sb-bh-proto-wrap" style={{ height: Math.round(KIOSK_H * scale) }}>
        <iframe
          src={src}
          onError={() => { if (src !== "http://localhost:5174") setSrc("http://localhost:5174"); }}
          title="Sainsbury's Self-Checkout Prototype"
          style={{
            width: KIOSK_W, height: KIOSK_H, border: "none", display: "block",
            transformOrigin: "top left", transform: `scale(${scale})`,
          }}
        />
      </div>
    </section>
  );
}

function UserFlowSection() {
  const [ref, on] = useReveal(0.08);
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
    <section ref={ref} className={`sb-bh-section${on ? " sb-bh-r--on" : ""}`}>
      <div className="sb-bh-section-label">07 / User Flow</div>
      <h2 className="sb-bh-section-h2">Pre-scanned. Confirmed. Done.</h2>
      <p className="sb-bh-section-body">
        The Smart Basket pre-scans items during shopping. By the time the customer reaches
        the terminal, scanning is already done — leaving only confirmation and payment.
      </p>
      <div className="sb-bh-uf-diagram">
        <svg viewBox="0 0 980 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="sb-bh-uf-svg">
          <path d="M 140 228 C 162 228 162 70 180 70" stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 140 228 L 180 228" stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 140 228 C 162 228 162 356 180 356" stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 288 70 C 310 70 310 40 325 40" stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 288 70 C 310 70 310 100 325 100" stroke={LC} strokeWidth={LW} fill="none"/>
          <line x1="427" y1="40" x2="457" y2="40" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="40" x2="589" y2="40" stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="40" x2="721" y2="40" stroke={LC} strokeWidth={LW}/>
          <line x1="427" y1="100" x2="457" y2="100" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="100" x2="589" y2="100" stroke={LC} strokeWidth={LW}/>
          <path d="M 288 228 C 310 228 310 198 325 198" stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 288 228 C 310 228 310 258 325 258" stroke={LC} strokeWidth={LW} fill="none"/>
          <line x1="427" y1="198" x2="457" y2="198" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="198" x2="589" y2="198" stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="198" x2="721" y2="198" stroke={LC} strokeWidth={LW}/>
          <line x1="823" y1="198" x2="853" y2="198" stroke={LC} strokeWidth={LW}/>
          <line x1="427" y1="258" x2="457" y2="258" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="258" x2="589" y2="258" stroke={LC} strokeWidth={LW}/>
          <line x1="288" y1="356" x2="325" y2="356" stroke={LC} strokeWidth={LW}/>
          <line x1="427" y1="356" x2="457" y2="356" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="356" x2="589" y2="356" stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="356" x2="721" y2="356" stroke={LC} strokeWidth={LW}/>
          <rect x="10" y="208" width="130" height="40" rx="20" fill="#F06C00"/>
          <text x="75" y="233" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600" fontFamily="'Overused Grotesk',sans-serif">Smart Basket</text>
          {[{ label: "Shopping", cy: 70 }, { label: "Confirmation", cy: 228 }, { label: "Need Help", cy: 356 }].map(({ label, cy }) => (
            <g key={label}>
              <rect x="180" y={cy - 17} width="108" height="34" rx="17" fill="#e8e8e8" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
              <text x="234" y={cy + 5} textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize="11.5" fontFamily="'Overused Grotesk',sans-serif">{label}</text>
            </g>
          ))}
          {stepNodes([{ x: 325, label: "Place Items" }, { x: 457, label: "Auto-Scanned" }, { x: 589, label: "Basket Ready" }, { x: 721, label: "At Terminal" }], 26)}
          {stepNodes([{ x: 325, label: "Weighted Item" }, { x: 457, label: "Flagged" }, { x: 589, label: "Confirm/Remove" }], 86)}
          {stepNodes([{ x: 325, label: "Review Items" }, { x: 457, label: "All Clear" }, { x: 589, label: "Pay" }, { x: 721, label: "Receipt" }, { x: 853, label: "Exit" }], 184)}
          {stepNodes([{ x: 325, label: "Item Issue" }, { x: 457, label: "Remove Item" }, { x: 589, label: "Re-confirm" }], 244)}
          {stepNodes([{ x: 325, label: "Call Staff" }, { x: 457, label: "Live Status" }, { x: 589, label: "Staff Assists" }, { x: 721, label: "Resolved" }], 342)}
        </svg>
      </div>
    </section>
  );
}

function ReflectionsSection() {
  const [ref, on] = useReveal(0.08);
  return (
    <section ref={ref} className={`sb-bh-dark${on ? " sb-bh-r--on" : ""}`}>
      <div className="sb-bh-dark-inner">
        <div className="sb-bh-section-label sb-bh-section-label--light">08 / Reflections</div>
        <h2 className="sb-bh-dark-h2">What I'd do differently.</h2>
        <div className="sb-bh-reflections">
          <div className="sb-bh-reflection">
            <span className="sb-bh-reflection-num">01</span>
            <div>
              <h3>Recruit a broader sample</h3>
              <p>17 survey respondents and 5 interviews gave real insights but limited generalisability. I'd spend more time recruiting across age groups and accessibility needs.</p>
            </div>
          </div>
          <div className="sb-bh-reflection">
            <span className="sb-bh-reflection-num">02</span>
            <div>
              <h3>Test the concept with real users</h3>
              <p>The Smart Basket concept is plausible but untested. A low-fidelity wizard-of-oz study would have validated whether the model holds up under real shopping behaviour.</p>
            </div>
          </div>
          <div className="sb-bh-reflection">
            <span className="sb-bh-reflection-num">03</span>
            <div>
              <h3>Explore the operational implications</h3>
              <p>RFID infrastructure costs, item tagging workflows, loss prevention — these weren't in scope but matter enormously for real-world feasibility.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export function SainsburyBHPage({ project }) {
  const navigate = useNavigate();
  const overview = project.overview || {};

  return (
    <div className="sb-bh-page">
      <button className="sb-bh-back" onClick={() => navigate("/?section=work")} type="button">
        <span>←</span> All Work
      </button>

      {/* ── HERO ── */}
      <section className="sb-bh-hero">
        <div className="sb-bh-hero-inner">
          <div className="sb-bh-category">Sainsbury's Smart Basket</div>
          <h1 className="sb-bh-h1">
            Self-checkout was meant<br />
            to save time. It didn't.<br />
            So we redesigned it.
          </h1>
          <div className="sb-bh-tags">
            {["UX Research", "Survey n=17", "Interviews n=5", "Observational Research", "Concept Design"].map(t => (
              <span key={t} className="sb-bh-tag">{t}</span>
            ))}
          </div>
          <div className="sb-bh-meta">
            <span>UX Researcher &amp; Designer</span>
            <span className="sb-bh-sep">|</span>
            <span>3 months</span>
            <span className="sb-bh-sep">|</span>
            <span>Independent study</span>
            <span className="sb-bh-sep">|</span>
            <span>2023</span>
          </div>
        </div>
        <div className="sb-bh-ghost" aria-hidden="true">SCO</div>
        <div className="sb-bh-hero-img-wrap">
          <img
            src="/assets/projects/1%20sains.jpg"
            alt="Sainsbury's self-checkout fieldwork at New Cross Road"
            className="sb-bh-hero-img"
          />
          <div className="sb-bh-hero-img-caption">New Cross Road · London · Sainsbury's 2023</div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsBar />

      {/* ── PROBLEM ── */}
      <ProblemSection />

      {/* ── RESEARCH ── */}
      <ResearchSection />

      {/* ── THEMES ── */}
      <ThemesSection />

      {/* ── SOLUTION ── */}
      <SolutionSection />

      {/* ── DESIGN PROCESS ── */}
      <DesignProcessSection />

      {/* ── USER FLOW ── */}
      <UserFlowSection />

      {/* ── PROTOTYPE ── */}
      <PrototypeSection />

      {/* ── REFLECTIONS (dark) ── */}
      <ReflectionsSection />

      {/* ── FOOTER ── */}
      <footer className="sb-bh-footer">
        <p className="sb-bh-footer-year">2023 · UX Research &amp; Design</p>
        <h2 className="sb-bh-footer-h2">Thank you for<br />reading through!</h2>
        <button className="sb-bh-footer-btn" onClick={() => navigate("/?section=work")} type="button">
          ← Back to all work
        </button>
      </footer>
    </div>
  );
}
