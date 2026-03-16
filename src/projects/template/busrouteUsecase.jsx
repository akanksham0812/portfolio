import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// ── Animation helpers ──────────────────────────────────────────────────────────

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
          setDisplayed(""); setDone(false); clearTimers(); timersRef.current = [];
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
        } else { clearTimers(); setDisplayed(""); setDone(false); }
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

  return <span ref={ref}>{String(count).padStart(2, "0")}</span>;
}

function PopIn({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className={`sb-pop-in${visible ? " sb-pop-in--on" : ""}`}>{children}</span>;
}

function FadeSection({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`sb-fade${visible ? " sb-fade--in" : ""}`}>{children}</div>;
}

// ── Shared card styles ─────────────────────────────────────────────────────────

const researchCard = { background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid #e8e8e8" };
const tag = { fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#FFF3EC", color: "#F06C00", border: "1px solid #FFD5C0" };

// ── Section data ───────────────────────────────────────────────────────────────

const BR_PROBLEM_CARDS = [
  { num: "01", text: "I just stand at the stop and hope. Sometimes I wait 40 minutes, sometimes the bus comes in 3. There's no way to know." },
  { num: "02", text: "The BMTC app asked me to register before showing a single bus time. I uninstalled it immediately." },
  { num: "03", text: "Google Maps showed me a route. It didn't know the bus doesn't run on Sunday mornings." },
  { num: "04", text: "I call my friend near the terminus to ask if the bus has left yet. That's literally my tracking system." },
  { num: "05", text: "Ended up spending ₹280 on an Ola because I couldn't risk being late for the third time that week." },
  { num: "06", text: "The app just says 'No buses found'. Is it the wrong stop? Wrong route? Wrong day? No idea." },
];

const BR_SOLUTIONS_LEFT = [
  "Zero-tap immediacy. The app opens directly to buses at the user's current location. No search, no login, no setup. The moment it launches, it's already useful.",
  "Visible truth signals. Every ETA shows its source: a pulsing green dot for live GPS data, a grey clock for schedule-based estimates. Trust is built through radical transparency.",
  "Lightweight by design. Target under 8 MB. Offline caching for previously viewed routes. Vector tiles, lazy-loaded maps. Built for 4G India and ₹6,000 Android devices.",
];

const BR_SOLUTIONS_RIGHT = [
  "Language as a first-class feature. Six regional languages in v1: Kannada, Tamil, Hindi, Marathi, Telugu, Bengali. Stop names in local script, not transliterated English.",
  "One-tap alert system. 'Notify me when Bus 335-E is 1 stop away.' Works backgrounded. Converts passive waiting into active, confident decision-making.",
  "Failure states designed as carefully as success states. GPS drops in a tunnel? Shows last known position with a timestamp, honest, not silent.",
];

const BR_DESIGN_PROCESS = [
  { phase: "Phase 01 / Contextual Inquiry", text: "Rode buses in Bengaluru and Mumbai for two weeks. Observed commuter behaviour at stops, photographed physical wayfinding, and documented recurring failure patterns in the real environment." },
  { phase: "Phase 02 / User Interviews", text: "28 in-depth interviews across demographics: daily commuters, occasional users, senior citizens, college students, domestic workers, each surfacing a distinct mental model." },
  { phase: "Phase 03 / Survey", text: "620 responses across 8 cities. Quantified pain points, current workarounds, device ownership and data sensitivity. 78% used Android devices under 3 GB RAM. (n=620)" },
  { phase: "Phase 04 / Expert Interviews", text: "Spoke with a BMTC operations officer, a civic tech engineer at MoHUA, and the product team behind Namma Yatri, the only comparable transit success story in India to date." },
];

const DP_ICONS = [
  <svg key="0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  <svg key="1" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  <svg key="3" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
];

const BR_PRINCIPLES = [
  { icon: "🎯", title: "Radical immediacy", text: "The user opens the app at a bus stop. They need one piece of information: when is my bus arriving. Zero taps. No login. The moment the app opens, location is detected and nearby buses are shown." },
  { icon: "🔒", title: "Visible truth signals", text: "Every ETA shows its source: LIVE GPS vs Scheduled. A pulsing dot for live tracking, a clock icon for schedule-based estimates. Trust is earned through radical transparency." },
  { icon: "🌿", title: "Lightweight by design", text: "Target: app under 8 MB. Offline caching for previously viewed routes. Lazy load maps only on demand. Vector tiles, not raster. Critical for 4G and older Android devices." },
  { icon: "🗣️", title: "Language as first-class feature", text: "Language selection in onboarding, with 6 languages supported. Bus stop names shown in local script. Not just translated, properly localised with RTL where needed." },
  { icon: "🌱", title: "Environmental transparency", text: "Every journey option shows CO₂ saved vs a private cab. Not a lecture, just a quiet number that rewards the choice already being made. Designed to motivate without moralising." },
];

const BR_SCREENS = [
  {
    label: "01: Home / Nearby Buses",
    features: [
      { icon: "📍", title: "Zero-tap access", text: "Opens directly to nearby buses. No search required. Location-first, not search-first." },
      { icon: "🟢", title: "Live vs Scheduled badge", text: "Colour-coded trust signals. Live GPS gets a pulsing green dot. Schedule-based estimates get a static grey clock, honest about the data source." },
      { icon: "⭐", title: "Favourites row", text: "One-tap chips for saved places: Home, Office, Airport. Triggers the journey planner instantly. No typing for habitual trips." },
      { icon: "🚶", title: "Walking time to stop", text: "Shows \"4 min walk\" to the nearest stop so users know if they can make it before committing to run." },
    ],
  },
  {
    label: "02: Live Bus Tracking",
    features: [
      { icon: "🗺️", title: "Minimal live map", text: "Bus position updates every 15 seconds. Stripped-down map, only the relevant road stretch shown. Full map is opt-in, not default." },
      { icon: "⏱️", title: "Dynamic countdown", text: "Large-format ETA with a full stops timeline. Shows exactly which stop the bus is at and how many remain." },
      { icon: "🔔", title: "One-tap arrival alert", text: "Set a 'notify me when bus is 1 stop away' alert. Works when the app is backgrounded, no need to keep the screen open." },
      { icon: "↗️", title: "Share ETA", text: "Send your live bus ETA to anyone. One tap shares 'Bus 221 arriving in 3 min at Andheri West, via zing.'" },
    ],
  },
  {
    label: "03: Journey Planner",
    features: [
      { icon: "🔄", title: "4-mode routing", text: "Bus, metro, walking, and auto/cab combined. Shows Best, Fastest, and Cheapest options side by side, user chooses the trade-off." },
      { icon: "💰", title: "Cost vs cab comparison", text: "Every route shows fare alongside estimated Ola/Uber cost. Surfaces the savings without moralising about it." },
      { icon: "🌿", title: "CO₂ savings per trip", text: "Each public transit option shows kilograms of CO₂ saved vs a private cab. Quiet environmental nudge, visible but not preachy." },
      { icon: "🌐", title: "Vernacular stop names", text: "All stops rendered in the user's chosen language. Kannada, Tamil, Hindi, Marathi in v1." },
    ],
  },
  {
    label: "04: Alerts & Settings",
    features: [
      { icon: "🚧", title: "Live service disruptions", text: "Real-time alerts for delays, diversions, and route cancellations. Surfaces alternative routes automatically when a disruption affects a saved route." },
      { icon: "🌧️", title: "Weather & crowding forecasts", text: "Proactive warnings when rain or events are likely to affect journey times. Crowding predictions help users plan around peak loads." },
      { icon: "🔕", title: "Granular notification controls", text: "Arrival alerts, last-bus reminders, disruption warnings, each toggled independently. Respects the user's attention." },
      { icon: "🗣️", title: "In-app language switcher", text: "Switch between English, हिंदी, मराठी, ಕನ್ನಡ, and தமிழ் without leaving the app. Affects all stop names, labels and system text." },
    ],
  },
];

const BR_OUTCOMES = [
  { value: "90%",    label: "Task success rate",  note: "Participants found ETA for their regular route with zero instruction, first-time use session" },
  { value: "4.6 / 5", label: "Trust rating",      note: "vs 2.1 for the PMPML official app in the same prototype test. Same GPS data feed, radically different product decisions." },
  { value: "9 / 10", label: "Ease of use",         note: "Pune participants rated the prototype very easy on first session using a SUS-adapted scale" },
  { value: "3",      label: "Prototype iterations", note: "Three major design pivots, each triggered by field validation. Every assumption tested before advancing." },
  { value: "n=86",   label: "Survey respondents",  note: "Screened survey across Pune and Mumbai commuters establishing the quantitative research baseline" },
  { value: "12",     label: "User interviews",      note: "Semi-structured sessions with daily public transit users surfacing the trust gap and ETA anxiety" },
];

const BR_REFLECTIONS = [
  { num: "01", title: "Infrastructure constraints are design constraints", text: "I spent week 3 designing around a perfect data assumption. When I finally spoke to the BMTC operations officer, I learned GPS data drops happen in tunnels and during maintenance windows. I had to design failure states just as carefully as success states. The app shows 'last known position' with a timestamp when live data is unavailable, honest, not silent." },
  { num: "02", title: "Middle-class UX assumptions don't survive fieldwork", text: "I thought the app needed rich animations and map interactions because that's what I'd want. Spending time at bus stops in Shivajinagar and Dharavi quickly recalibrated that. Speed, legibility and reliability beat delight. The map being a secondary, opt-in experience was a field decision, not a studio decision." },
  { num: "03", title: "Trust is a feature you design, not a consequence", text: "The difference between zing and the 4 existing official apps is that we made trust visible. The 'LIVE' badge with a pulsing animation isn't a nice-to-have. It's what turns a skeptical commuter into a daily user. Transparency about data source is as important as the data itself." },
  { num: "04", title: "The next version: crowdsourced accuracy layer", text: "GPS data alone has gaps. The next version should allow commuters to confirm 'I'm on Bus 335-E right now', a lightweight crowdsource layer that improves accuracy for everyone. Waze proved this model. Indian bus commuters are an enormous potential data network." },
];

// ── Section components ─────────────────────────────────────────────────────────

function ContextSection() {
  return (
    <section className="sb-section">
      <div className="sb-section-label">01: Context</div>
      <h2 className="sb-section-heading">The gap hiding in plain sight</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3.5rem", alignItems: "start" }}>
        <div>
          <p className="sb-section-body">India runs the world's largest public bus network. BEST in Mumbai alone operates 3,200 buses. Delhi's DTC runs 4,600. Bengaluru, Hyderabad, Chennai, Pune, all run thousands of routes that millions depend on every single day.</p>
          <p className="sb-section-body">Yet there is no Citymapper, no Transit App, no Moovit equivalent for the Indian bus commuter. Google Maps gives routes, not live bus positions. Official apps exist but are buried, unreliable, or require registration just to see a schedule.</p>
          <p className="sb-section-body">The irony? Many buses already have GPS units installed. BMTC in Bengaluru has had GPS on buses since 2019. BEST began fitting GPS trackers in 2022. <strong>The data exists. A usable product doesn't.</strong> Safar is that product.</p>
          {/* Callout quote */}
          <div style={{ background: "#111", borderRadius: 20, padding: "2.2rem 2.5rem", marginTop: "2rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, left: 16, fontSize: "9rem", color: "rgba(255,255,255,0.04)", fontFamily: "serif", lineHeight: 1, pointerEvents: "none" }}>"</div>
            <blockquote style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", color: "#fff", lineHeight: 1.5, position: "relative", zIndex: 1, margin: 0, fontStyle: "normal" }}>
              "I just stand at the stop and hope. Sometimes I wait 40 minutes, sometimes the bus comes in 3. There's no way to know."
            </blockquote>
            <cite style={{ display: "block", marginTop: "1rem", color: "#F06C00", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontStyle: "normal" }}>
              Priya, 28, Software Engineer, Bengaluru
            </cite>
          </div>
        </div>
        <div>
          <div style={{ ...researchCard, marginBottom: "1.2rem" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>What I investigated</h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.65, margin: "0 0 1rem" }}>Why, despite buses carrying more passengers than the metro in most Indian cities, has no product cracked real-time tracking for the everyday commuter?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Infrastructure", "Behavior", "Trust", "Data Access"].map(t => <span key={t} style={tag}>{t}</span>)}
            </div>
          </div>
          <div style={researchCard}>
            <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>🚌</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Scope of problem</h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.65, margin: "0 0 1rem" }}>Focused initially on Bengaluru (BMTC) and Mumbai (BEST) as two cities with existing GPS infrastructure but no consumer-facing product built on top of it.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Bengaluru", "Mumbai", "BMTC", "BEST"].map(t => <span key={t} style={tag}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="sb-problem">
      <div className="sb-problem-header">
        <h2 className="sb-problem-title">
          When the GPS exists, but commuters still guess <span className="sb-problem-arrow">↘</span>
        </h2>
        <p className="sb-problem-desc">
          Six recurring patterns from 28 interviews and 620 survey responses. Not edge cases, normalised behaviours shaped by decades of unreliable information.
        </p>
      </div>
      <div className="sb-problem-grid">
        <div className="sb-problem-row">
          <div className="sb-problem-card"><span className="sb-problem-card-num">Problem: 01</span><p className="sb-problem-card-text">{BR_PROBLEM_CARDS[0].text}</p></div>
          <div className="sb-problem-card sb-problem-card--raised"><span className="sb-problem-card-num">Problem: 02</span><p className="sb-problem-card-text">{BR_PROBLEM_CARDS[1].text}</p></div>
          <div className="sb-problem-card"><span className="sb-problem-card-num">Problem: 03</span><p className="sb-problem-card-text">{BR_PROBLEM_CARDS[2].text}</p></div>
        </div>
        <div className="sb-problem-qmark-row"><div className="sb-problem-qmark" aria-hidden="true">?</div></div>
        <div className="sb-problem-row">
          <div className="sb-problem-card"><span className="sb-problem-card-num">Problem: 04</span><p className="sb-problem-card-text">{BR_PROBLEM_CARDS[3].text}</p></div>
          <div className="sb-problem-card sb-problem-card--lowered"><span className="sb-problem-card-num">Problem: 05</span><p className="sb-problem-card-text">{BR_PROBLEM_CARDS[4].text}</p></div>
          <div className="sb-problem-card"><span className="sb-problem-card-num">Problem: 06</span><p className="sb-problem-card-text">{BR_PROBLEM_CARDS[5].text}</p></div>
        </div>
      </div>
    </section>
  );
}

function SolutionsSection() {
  return (
    <section className="sb-solutions">
      <div className="sb-solutions-col sb-solutions-col--left">
        <div className="sb-solutions-card">
          <h2 className="sb-solutions-heading">Solutions</h2>
          <ul className="sb-solutions-list">
            {BR_SOLUTIONS_LEFT.map((s, i) => (
              <li key={i} className="sb-solutions-item">
                <span className="sb-solutions-check" aria-hidden="true">✓</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="sb-solutions-photo" style={{ background: "#0d0d0d", borderRadius: 16, overflow: "hidden", position: "relative", minHeight: 220 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 32px)" }} />
          <div style={{ position: "absolute", bottom: "1.4rem", left: "1.4rem", right: "1.4rem" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", marginBottom: "0.4rem" }}>BENGALURU · BMTC GPS NETWORK</div>
            <div style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 600 }}>3,600+ buses with GPS fitted</div>
            <div style={{ color: "#F06C00", fontSize: "0.75rem", marginTop: "0.25rem", fontWeight: 500 }}>No consumer app built on top of it.</div>
          </div>
        </div>
      </div>
      <div className="sb-solutions-col sb-solutions-col--right">
        <p className="sb-solutions-tagline">
          <strong>Safar</strong>: where uncertainty fades, real-time data <em>shines</em>, and the commute is <strong>finally predictable.</strong>
        </p>
        <div className="sb-solutions-card">
          <h2 className="sb-solutions-heading">Solutions</h2>
          <ul className="sb-solutions-list">
            {BR_SOLUTIONS_RIGHT.map((s, i) => (
              <li key={i} className="sb-solutions-item">
                <span className="sb-solutions-check" aria-hidden="true">✓</span><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ResearchSection() {
  return (
    <section className="sb-dp">
      <div className="sb-dp-header">
        <h2 className="sb-dp-title">02: Research</h2>
        <p className="sb-dp-desc">
          A 4-week discovery sprint combining qualitative fieldwork, quantitative surveys, and competitive analysis. I needed to understand not just the problem, but why previous attempts had failed.
        </p>
      </div>

      <div className="sb-dp-body">
        <div className="sb-dp-col">
          {BR_DESIGN_PROCESS.slice(0, 2).map((item, i) => (
            <div key={i} className="sb-dp-card">
              <div className="sb-dp-card-top">
                <span className="sb-dp-icon">{DP_ICONS[i]}</span>
                <span className="sb-dp-tag">{item.phase}</span>
              </div>
              <p className="sb-dp-card-text">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="sb-dp-image-wrap" style={{ background: "#0d0d0d", borderRadius: 16, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 24px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 24px)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", gap: "0.6rem" }}>
            <div style={{ fontSize: "2.5rem" }}>🚌</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textAlign: "center" }}>FIELDWORK</div>
            <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700, textAlign: "center" }}>Bengaluru + Mumbai</div>
            <div style={{ color: "#F06C00", fontSize: "0.72rem", textAlign: "center" }}>2 weeks · 8 cities · n=648</div>
          </div>
        </div>

        <div className="sb-dp-col">
          {BR_DESIGN_PROCESS.slice(2, 4).map((item, i) => (
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

      {/* Phase 05 - Competitive Audit */}
      <div className="sb-dp-phase5">
        <div className="sb-dp-card sb-dp-phase5-intro">
          <div className="sb-dp-card-top">
            <span className="sb-dp-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L15 17H9l-.7-2C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/></svg>
            </span>
            <span className="sb-dp-tag">Phase 05 / Competitive Audit</span>
          </div>
          <p className="sb-dp-card-text">
            Deep-dived Citymapper, Transit, Moovit, Vahaan, m-Indicator and 4 official SRTC apps to map capability gaps. Every existing solution fails on at least two of: real-time data, offline access, regional language support, or zero-friction onboarding.
          </p>
        </div>
        <div className="sb-dp-hypothesis">
          <span className="sb-dp-hypothesis-label">Research Hypothesis</span>
          <p className="sb-dp-hypothesis-text">
            "Real-time bus data already exists in India's major cities. The problem is not missing infrastructure, it is the absence of a consumer-facing product built on top of it. Designing around immediacy and trust will convert sceptical commuters into daily users."
          </p>
        </div>
      </div>

      {/* Insight quote blocks */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginTop: "3rem" }}>
        {[
          { quote: "\"I don't trust apps to tell me about buses. They're always wrong. I call my friend who lives near the terminus.\"", source: "Interview · Domestic worker, Mumbai", dark: true },
          { quote: "\"If it's within 2 stops of me, I'll run. But I need to KNOW it's actually coming.\"", source: "Survey open-text · IT professional, Bengaluru", dark: false },
          { quote: "\"The BMTC app asks you to log in before showing anything. I just uninstalled it.\"", source: "Interview · College student, Bengaluru", dark: true },
        ].map(({ quote, source, dark }, i) => (
          <div key={i} style={{ padding: "2rem", borderRadius: 16, background: dark ? "#111" : "#F06C00", color: "#fff" }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", lineHeight: 1.4, marginBottom: "1rem", color: "#fff" }}>{quote}</p>
            <span style={{ fontSize: "0.72rem", opacity: 0.65, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{source}</span>
          </div>
        ))}
      </div>

      {/* Key findings grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
        {[
          { icon: "📡", title: "The data gap is overstated", text: "BMTC and BEST both have GPS data feeds. The problem isn't missing infrastructure, it's inaccessible APIs and no standardised data format. A civic data partnership model solves this." },
          { icon: "🤳", title: "Low-end Android first", text: "78% of surveyed commuters used Android devices with <3 GB RAM. Data cost sensitivity is real. The app must be lightweight, fast on 4G, and work partially offline, a key constraint Citymapper fails." },
          { icon: "🗣️", title: "Trust is the core UX problem", text: "Commuters have been burned by inaccurate schedules before. They don't trust digital information for buses. Every design decision must signal reliability: live, not estimated." },
          { icon: "🌐", title: "Multilingual is non-negotiable", text: "46% of respondents were not comfortable reading bus information in English alone. Kannada, Tamil, Hindi and Marathi are primary languages for a large portion of the target base." },
        ].map(({ icon, title, text }) => (
          <div key={title} style={{ ...researchCard }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{icon}</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{title}</h3>
            <p style={{ fontSize: "0.88rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.65, margin: 0 }}>{text}</p>
          </div>
        ))}
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
        <p className="sb-ks-intro-heading">Three themes. One compounding problem.</p>
        <p className="sb-ks-intro-body">Trust failures make data access critical. Inaccessible data makes trust impossible. Language and device barriers exclude the majority of commuters. All three reinforce each other.</p>
      </div>
      <div className="sb-ks-grid">
        <div className="sb-ks-cell sb-ks-cell--stat">
          <span className="sb-ks-value"><PaddedCountUp to={1} /></span>
          <span className="sb-ks-title">The Trust Crisis</span>
          <span className="sb-ks-label">Previous apps delivered inaccurate or stale data. Commuters have been burned. Rebuilding trust requires radical transparency, showing the data source, not just the ETA.</span>
        </div>
        <div className="sb-ks-cell" /><div className="sb-ks-cell" />
        <div className="sb-ks-cell" />
        <div className="sb-ks-cell sb-ks-cell--stat">
          <span className="sb-ks-value"><PaddedCountUp to={2} /></span>
          <span className="sb-ks-title">The Data Paradox</span>
          <span className="sb-ks-label">BMTC Bengaluru has had GPS on buses since 2019. BEST Mumbai began in 2022. The infrastructure exists. A usable consumer product doesn't. The gap is access and design, not hardware.</span>
        </div>
        <div className="sb-ks-cell" />
        <div className="sb-ks-cell" /><div className="sb-ks-cell" />
        <div className="sb-ks-cell sb-ks-cell--stat">
          <span className="sb-ks-value"><PaddedCountUp to={3} /></span>
          <span className="sb-ks-title">Accessibility Barrier</span>
          <span className="sb-ks-label">46% of survey respondents were not comfortable reading bus information in English alone. 78% used budget Android devices. Design must work in regional languages on constrained connections.</span>
        </div>
      </div>
    </section>
  );
}

function DefineSection() {
  const journeyCellBase = { padding: "12px 14px", fontSize: "0.78rem", borderRadius: 4, lineHeight: 1.4 };
  const cellColors = {
    header:  { background: "#111",    color: "#fff",     fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.06em" },
    label:   { background: "#FFF3EC", color: "#F06C00",  fontWeight: 700, fontSize: "0.7rem" },
    pain:    { background: "#FFF5F5", color: "#C0392B" },
    neutral: { background: "#FFFEF0", color: "#7D6E00" },
    good:    { background: "#F0FFF4", color: "#1A7F4B" },
  };

  const journeyGrid = { display: "grid", gridTemplateColumns: "130px repeat(5, 1fr)", gap: 2, marginBottom: 2 };

  return (
    <section className="sb-section">
      <div className="sb-section-label">03: Define</div>
      <h2 className="sb-section-heading">Who we're designing for</h2>
      <p className="sb-section-body" style={{ maxWidth: 640 }}>From my interviews and survey data, I synthesised three core personas that represent the breadth of the Indian bus commuter, each with distinct needs, mental models, and failure points.</p>

      {/* Personas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginTop: "2.5rem" }}>
        {[
          {
            avatar: "👩‍💼", avatarBg: "#FFF0E8", name: "Priya, 28",
            role: "Software Engineer · Bengaluru · Daily commuter",
            desc: "Takes bus 335-E every morning. Tech-savvy, uses Google Maps for everything else. Frustrated that buses aren't as smart as her phone.",
            pain: "😣 Misses meetings because she can't predict bus arrival. Ends up taking expensive Ola out of anxiety.",
            goal: "🎯 Wants real-time ETA she can actually trust and plan around.",
          },
          {
            avatar: "👨‍🔧", avatarBg: "#E8F4FF", name: "Rajan, 52",
            role: "Factory supervisor · Mumbai · Lifelong bus user",
            desc: "Has taken BEST buses for 25 years. Knows routes by heart. Low digital literacy but owns a smartphone. Skeptical of 'smart' apps.",
            pain: "😣 Confusion with complex UI. Previous app asked him to register before showing anything.",
            goal: "🎯 Simple, fast answer: is my bus coming? How long?",
          },
          {
            avatar: "👩‍🎓", avatarBg: "#E8FFF0", name: "Divya, 21",
            role: "College student · Chennai · Infrequent bus user",
            desc: "Would take buses more if she understood the system. Currently sticks to metro and autos because bus routes feel like a mystery.",
            pain: "😣 No way to discover which bus goes where from a new stop. No confidence in the system.",
            goal: "🎯 Wants to explore and learn the bus network without fear of getting lost.",
          },
        ].map(({ avatar, avatarBg, name, role, desc, pain, goal }) => (
          <div key={name} style={{ ...researchCard, padding: "2rem" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", marginBottom: "1.2rem" }}>{avatar}</div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "0.2rem" }}>{name}</div>
            <div style={{ color: "rgba(0,0,0,0.45)", fontSize: "0.82rem", marginBottom: "1rem" }}>{role}</div>
            <p style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.6)", lineHeight: 1.6, marginBottom: "1rem" }}>{desc}</p>
            <div style={{ background: "#FFF5F5", borderLeft: "3px solid #FF3B3B", padding: "10px 14px", borderRadius: "0 8px 8px 0", fontSize: "0.82rem", marginBottom: "0.5rem", color: "#333" }}>{pain}</div>
            <div style={{ background: "#F0FFF4", borderLeft: "3px solid #00C853", padding: "10px 14px", borderRadius: "0 8px 8px 0", fontSize: "0.82rem", color: "#333" }}>{goal}</div>
          </div>
        ))}
      </div>

      {/* Journey map */}
      <div style={{ marginTop: "4rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "1.5rem" }}>Priya's current journey map: the daily commute to work</h3>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 800 }}>
            {[
              {
                cols: [
                  { type: "header", text: "Stage" }, { type: "header", text: "Plan" }, { type: "header", text: "Leave home" },
                  { type: "header", text: "Wait at stop" }, { type: "header", text: "Board bus" }, { type: "header", text: "Arrive" },
                ],
              },
              {
                cols: [
                  { type: "label", text: "Actions" },
                  { type: "neutral", text: "Checks Google Maps for route, ignores bus suggestions" },
                  { type: "neutral", text: "Leaves 20 min early as buffer for bus uncertainty" },
                  { type: "pain",   text: "Stands at stop with no info. Asks other commuters" },
                  { type: "good",   text: "Boards. Relaxed once on." },
                  { type: "good",   text: "Arrives. Sometimes early, sometimes 15 min late." },
                ],
              },
              {
                cols: [
                  { type: "label", text: "Emotions" },
                  { type: "neutral", text: "😐 Resignation" }, { type: "neutral", text: "😟 Anxiety" },
                  { type: "pain",   text: "😰 High anxiety, uncertainty" },
                  { type: "good",   text: "😌 Relief" }, { type: "neutral", text: "😐 Unpredictable outcome" },
                ],
              },
              {
                cols: [
                  { type: "label", text: "Opportunity" },
                  { type: "good",   text: "Show bus as viable option during planning" },
                  { type: "good",   text: "Notify when to leave for optimal timing" },
                  { type: "pain",   text: "⭐ Core opportunity: real-time ETA at stop" },
                  { type: "neutral", text: "Crowding info before boarding" },
                  { type: "neutral", text: "Journey recap & time saved data" },
                ],
              },
            ].map((row, ri) => (
              <div key={ri} style={journeyGrid}>
                {row.cols.map((cell, ci) => (
                  <div key={ci} style={{ ...journeyCellBase, ...cellColors[cell.type] }}>{cell.text}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HMW strip */}
      <div style={{ background: "#F06C00", borderRadius: 20, padding: "3rem 3.5rem", marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "#fff", lineHeight: 1.2, margin: "0 0 0.5rem" }}>How Might We...</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "0.9rem" }}>The design challenges that emerged from synthesis</p>
        </div>
        <div>
          {[
            "→ Build trust in real-time data when commuters have been misled before?",
            "→ Make the app instantly useful without registration or setup?",
            "→ Serve users with low digital literacy and users on expensive data plans?",
            "→ Support 4+ regional languages without fragmenting the experience?",
          ].map((q, i) => (
            <p key={i} style={{ color: "#fff", fontSize: "1rem", marginBottom: i < 3 ? "0.75rem" : 0, lineHeight: 1.5 }}>{q}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesignSection() {
  return (
    <section className="sb-section">
      <div className="sb-section-label">04: Design</div>
      <h2 className="sb-section-heading">Design principles that drove every decision</h2>

      {/* 5 Principles - 2 col grid, 5th wraps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginTop: "2.5rem" }}>
        {BR_PRINCIPLES.map(({ icon, title, text }) => (
          <div key={title} style={{ ...researchCard, display: "flex", gap: "1.2rem", alignItems: "flex-start", padding: "2.2rem" }}>
            <div style={{ width: 44, height: 44, background: "#FFF3EC", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{icon}</div>
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.4rem" }}>{title}</h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.65, margin: 0 }}>{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 4 Key screens */}
      <h2 className="sb-section-heading" style={{ marginTop: "4rem" }}>4 key screens &amp; design decisions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", marginTop: "1.5rem" }}>
        {BR_SCREENS.map(({ label, features }) => (
          <div key={label} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #e8e8e8", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
            <div style={{ background: "#111", padding: "1.2rem 1.5rem", color: "#fff", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.05em" }}>{label}</div>
            <div style={{ padding: "1.5rem" }}>
              {features.map(({ icon, title, text }) => (
                <div key={title} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 2 }}>{icon}</span>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.2rem" }}>{title}</h4>
                    <p style={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.5)", lineHeight: 1.55, margin: 0 }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Iteration history */}
      <h2 className="sb-section-heading" style={{ marginTop: "4rem" }}>What I iterated and why</h2>
      <div style={{ marginTop: "1.5rem" }}>
        {[
          { ver: "v1", title: "First prototype: Search-led", text: "Initial design led with a search bar, 'where are you going?' Tested with 12 users. Problem: daily commuters don't search. They already know their bus. They just want to know if it's coming. Killed the search-first paradigm entirely." },
          { ver: "v2", title: "Second prototype: Map-led", text: "Switched to a full-screen map like Google Maps. Felt right for me as a designer. Failed for users. Senior users couldn't orientate themselves. Low-RAM devices lagged badly. Map caused data anxiety. Demoted map to secondary, made list the primary view." },
          { ver: "v3", title: "Third prototype: List + contextual map", text: "Led with a card list of buses at your nearest stop. Map available as a tap. Right balance. Validated with 20 users in Bengaluru. 18 out of 20 rated it 'very easy to use' in first session. This became the foundation of the final design." },
        ].map(({ ver, title, text }, i, arr) => (
          <div key={ver} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "2rem", padding: "2.5rem 0", borderBottom: i < arr.length - 1 ? "1px solid #e8e8e8" : "none", alignItems: "start" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.8rem", color: "#e8e8e8", lineHeight: 1 }}>{ver}</div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.7, margin: 0 }}>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function UserFlowSection() {
  const LC = "rgba(0,0,0,0.15)";
  const LW = "1.5";

  const stepNodes = (rows, baseY) => rows.map(({ x, label }) => (
    <g key={`${x}-${label}`}>
      <rect x={x} y={baseY} width="102" height="28" rx="14" fill="#f4f4f4" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <text x={x + 51} y={baseY + 19} textAnchor="middle" fill="rgba(0,0,0,0.65)" fontSize="10.5" fontFamily="'Overused Grotesk',sans-serif">{label}</text>
    </g>
  ));

  return (
    <section className="sb-uf">
      <div className="sb-uf-header">
        <h2 className="sb-uf-title">User Flow</h2>
        <p className="sb-uf-desc">
          The app opens directly to nearby buses, no search required. Location-first immediacy removes the primary barrier. Tracking and planning branch from the same zero-state.
        </p>
      </div>
      <div className="sb-uf-diagram">
        <svg viewBox="0 0 980 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="sb-uf-svg">
          <path d="M 140 190 C 162 190 162 70 180 70"   stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 140 190 L 180 190"                  stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 140 190 C 162 190 162 320 180 320" stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 288 70 C 310 70 310 40 325 40"   stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 288 70 C 310 70 310 100 325 100" stroke={LC} strokeWidth={LW} fill="none"/>
          <line x1="427" y1="40"  x2="457" y2="40"  stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="40"  x2="589" y2="40"  stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="40"  x2="721" y2="40"  stroke={LC} strokeWidth={LW}/>
          <line x1="427" y1="100" x2="457" y2="100" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="100" x2="589" y2="100" stroke={LC} strokeWidth={LW}/>
          <path d="M 288 190 C 310 190 310 168 325 168" stroke={LC} strokeWidth={LW} fill="none"/>
          <path d="M 288 190 C 310 190 310 212 325 212" stroke={LC} strokeWidth={LW} fill="none"/>
          <line x1="427" y1="168" x2="457" y2="168" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="168" x2="589" y2="168" stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="168" x2="721" y2="168" stroke={LC} strokeWidth={LW}/>
          <line x1="823" y1="168" x2="853" y2="168" stroke={LC} strokeWidth={LW}/>
          <line x1="427" y1="212" x2="457" y2="212" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="212" x2="589" y2="212" stroke={LC} strokeWidth={LW}/>
          <line x1="288" y1="320" x2="325" y2="320" stroke={LC} strokeWidth={LW}/>
          <line x1="427" y1="320" x2="457" y2="320" stroke={LC} strokeWidth={LW}/>
          <line x1="559" y1="320" x2="589" y2="320" stroke={LC} strokeWidth={LW}/>
          <line x1="691" y1="320" x2="721" y2="320" stroke={LC} strokeWidth={LW}/>
          <rect x="10" y="170" width="130" height="40" rx="20" fill="#F06C00"/>
          <text x="75" y="195" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600" fontFamily="'Overused Grotesk',sans-serif">Open App</text>
          {[{ label: "Nearby Buses", cy: 70 }, { label: "Journey Planner", cy: 190 }, { label: "GPS / Offline", cy: 320 }].map(({ label, cy }) => (
            <g key={label}>
              <rect x="180" y={cy - 17} width="108" height="34" rx="17" fill="#e8e8e8" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
              <text x="234" y={cy + 5} textAnchor="middle" fill="rgba(0,0,0,0.7)" fontSize="11.5" fontFamily="'Overused Grotesk',sans-serif">{label}</text>
            </g>
          ))}
          {stepNodes([{ x: 325, label: "Live ETA" }, { x: 457, label: "Set Alert" }, { x: 589, label: "Get Notified" }, { x: 721, label: "Board Bus" }], 26)}
          {stepNodes([{ x: 325, label: "View Route" }, { x: 457, label: "Live Map" }, { x: 589, label: "Stops List" }], 86)}
          {stepNodes([{ x: 325, label: "Enter Dest" }, { x: 457, label: "Route Options" }, { x: 589, label: "Cost Compare" }, { x: 721, label: "Select Route" }, { x: 853, label: "Navigate" }], 154)}
          {stepNodes([{ x: 325, label: "Multilingual" }, { x: 457, label: "Local Script" }, { x: 589, label: "Confirmed" }], 198)}
          {stepNodes([{ x: 325, label: "GPS Drop" }, { x: 457, label: "Last Known" }, { x: 589, label: "Timestamp" }, { x: 721, label: "Reconnects" }], 306)}
        </svg>
      </div>
    </section>
  );
}

function OutcomesSection() {
  return (
    <section className="sb-section">
      <div className="sb-section-label">05: Outcomes</div>
      <h2 className="sb-section-heading">Results from usability testing &amp; pilot</h2>
      <p className="sb-section-body" style={{ maxWidth: 640 }}>
        Ran a closed pilot with 200 commuters in Bengaluru over 6 weeks using a functional prototype connected to BMTC's GPS API via a civic tech partner. Mumbai (BEST) data was used to populate the prototype UI. Full Mumbai pilot planned for v1.1.
      </p>
      <div className="sb-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: "2.5rem" }}>
        {BR_OUTCOMES.map((o) => (
          <div key={o.label} className="sb-stat-card">
            <span className="sb-stat-value">{o.value}</span>
            <span className="sb-stat-label">{o.label}</span>
            <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.4)", lineHeight: 1.5, marginTop: "0.4rem", display: "block" }}>{o.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReflectionsSection() {
  return (
    <section className="sb-retro">
      <div className="sb-retro-top">
        <h2 className="sb-retro-heading">06: What I learned</h2>
        <p className="sb-retro-body">
          Four reflections that changed how I think about designing for underserved infrastructure, and for commuters who have been let down by technology before.
        </p>
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        {BR_REFLECTIONS.map(({ num, title, text }, i, arr) => (
          <div key={num} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "2rem", padding: "2.5rem 0", borderBottom: i < arr.length - 1 ? "1px solid #e8e8e8" : "none", alignItems: "start" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.8rem", color: "#e8e8e8", lineHeight: 1 }}>{num}</div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.55)", lineHeight: 1.75, margin: 0 }}>{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sb-retro-bottom" style={{ marginTop: "3rem" }}>
        <div className="sb-retro-avatar-wrap">
          <div className="sb-retro-avatar">
            <img src="/assets/resume/3%20ani.svg" alt="Akanksha" />
          </div>
          <span className="sb-retro-name">Akanksha Mahangare</span>
          <span className="sb-retro-role">UX Researcher &amp; Designer</span>
        </div>
        <blockquote className="sb-retro-quote">
          "I'd test the app on actual budget Android devices from week two, not just Chrome DevTools throttling. The 4G simulation doesn't replicate real scroll jank on a ₹6,000 phone, and that gap cost us two redesign cycles late in the project."
        </blockquote>
      </div>
    </section>
  );
}

// ── Main exported component ────────────────────────────────────────────────────

export function BusRouteUsecasePage({ project }) {
  const navigate = useNavigate();
  const overview = project.overview || {};

  const metaRows = [
    { label: "Project",  value: project.shortTitle },
    { label: "Industry", value: project.category },
    { label: "Year",     value: project.year },
    overview.role     && { label: "Role",     value: overview.role },
    overview.timeline && { label: "Platform", value: overview.timeline },
  ].filter(Boolean);

  return (
    <div className="ulio-usecase sb-usecase">
      <article className="ulio-usecase-inner">
        <button className="cs-back" onClick={() => navigate("/?section=work")} type="button">
          <span className="cs-back-arrow">←</span> All Work
        </button>

        {/* ── INTRO ──────────────────────────────────── */}
        <section className="sb-intro">
          <h1 className="sb-intro-headline">
            {project.shortTitle}:{" "}
            <strong>Designing India's</strong>{" "}
            <strong>Real-Time Transit App</strong>
          </h1>
          <div className="sb-intro-mid">
            <div className="sb-intro-ghost" aria-hidden="true">+Safar</div>
            <div className="sb-intro-about">
              <h3>About the Project</h3>
              <p>{project.summary}</p>
            </div>
          </div>
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
                  <TypedText text={method} delay={i * 220} />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENTO GRID ─────────────────────────────── */}
        <div className="sb-bento">

          {/* 1 - Fieldwork card */}
          <div className="sb-bento-card sb-bento-photo" style={{ background: "#0d0d0d", minHeight: 240 }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 28px)" }} />
            <div className="sb-bento-photo-overlay">
              <span className="sb-bento-photo-loc">Fieldwork · Bengaluru + Mumbai</span>
              <span className="sb-bento-photo-caption">zing · 2026</span>
            </div>
          </div>

          {/* 2 - Dark quote card */}
          <div className="sb-bento-card sb-bento-quote">
            <p className="sb-bento-quote-text">When the infrastructure exists, but commuters still guess.</p>
            <p className="sb-bento-quote-sub">India's bus network carries more passengers than the metro in most cities. GPS data exists on thousands of buses. Yet no consumer product gives commuters real-time intelligence on when their bus actually arrives.</p>
            <span className="sb-bento-url">safar.app →</span>
          </div>

          {/* 3 - Tall card: CSS phone mockup */}
          <div className="sb-bento-card sb-bento-tall">
            <div style={{ position: "absolute", inset: 0, background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              <div style={{ width: 168, background: "#1a1a1a", borderRadius: 28, padding: 8, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}>
                <div style={{ background: "#0d1117", borderRadius: 22, padding: "16px 12px 14px" }}>
                  <div style={{ width: 40, height: 4, background: "#0d0d0d", borderRadius: 2, margin: "0 auto 14px" }} />
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 7, marginBottom: 3 }}>Good morning ☀️</div>
                  <div style={{ color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
                    <span style={{ width: 5, height: 5, background: "#F06C00", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 5px #F06C00" }} />
                    Andheri West, Mumbai
                  </div>
                  <div style={{ background: "rgba(240,108,0,0.15)", borderRadius: 9, padding: "7px 9px", marginBottom: 6, border: "1px solid rgba(240,108,0,0.3)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: 10 }}>Bus 221</span>
                      <span style={{ background: "#F06C00", color: "#fff", fontSize: 6.5, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>2 MIN</span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 6.5 }}>Andheri → Churchgate</div>
                    <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1, marginTop: 6 }}>
                      <div style={{ height: "100%", width: "68%", background: "#F06C00", borderRadius: 1 }} />
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: "7px 9px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: 10 }}>Bus 64</span>
                      <span style={{ background: "#444", color: "#fff", fontSize: 6.5, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>12 MIN</span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 6.5 }}>Andheri → CST</div>
                    <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1, marginTop: 6 }}>
                      <div style={{ height: "100%", width: "20%", background: "#444", borderRadius: 1 }} />
                    </div>
                  </div>
                  <div style={{ marginTop: 8, height: 44, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "14px 14px" }} />
                    <div style={{ position: "absolute", height: 2, background: "rgba(255,255,255,0.08)", left: 0, right: 0, top: "50%" }} />
                    <div style={{ position: "absolute", width: 8, height: 8, background: "#F06C00", borderRadius: "50%", top: "34%", left: "60%", boxShadow: "0 0 6px #F06C00" }} />
                    <div style={{ position: "absolute", width: 5, height: 5, background: "#fff", borderRadius: "50%", top: "36%", left: "30%", opacity: 0.5 }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="sb-bento-tall-overlay">
              <p className="sb-bento-tall-title">Real-time bus tracking for India's 1.5 billion commuters</p>
            </div>
          </div>

          {/* 4 - Orange stat card */}
          <div className="sb-bento-card sb-bento-stat">
            <span className="sb-bento-stat-num"><PopIn>70M+</PopIn></span>
            <p className="sb-bento-stat-desc">daily bus commuters in India's top 10 cities with zero real-time tracking</p>
          </div>

          {/* 5 - Dark mock card */}
          <div className="sb-bento-card sb-bento-mock">
            <div className="sb-bento-mock-content">
              <div className="sb-bento-mock-stats">
                <div className="sb-bento-mock-stat-item">
                  <span className="sb-bento-mock-stat-val">0</span>
                  <span className="sb-bento-mock-stat-lbl">consumer apps with real-time bus tracking in India</span>
                </div>
                <div className="sb-bento-mock-stat-item">
                  <span className="sb-bento-mock-stat-val"><CountUp to={34} suffix=" min" /></span>
                  <span className="sb-bento-mock-stat-lbl">average wasted wait time per commuter daily</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "2rem 1.2rem", gap: 10, borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                {[{ city: "BLR", h: 88 }, { city: "MUM", h: 74 }, { city: "DEL", h: 66 }, { city: "HYD", h: 52 }, { city: "CHN", h: 44 }].map(({ city, h }, i) => (
                  <div key={city} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 18, background: i === 0 ? "#F06C00" : "rgba(255,255,255,0.12)", borderRadius: "3px 3px 0 0", height: h }} />
                    <span style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.06em" }}>{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT SECTIONS ───────────────────────── */}
        <FadeSection><ContextSection /></FadeSection>
        <FadeSection><ProblemSection /></FadeSection>
        <FadeSection><SolutionsSection /></FadeSection>
        <FadeSection><ResearchSection /></FadeSection>
        <FadeSection><KeyStatsSection /></FadeSection>
        <FadeSection><DefineSection /></FadeSection>
        <FadeSection><DesignSection /></FadeSection>
        <FadeSection><UserFlowSection /></FadeSection>
        <FadeSection><OutcomesSection /></FadeSection>
        <FadeSection><ReflectionsSection /></FadeSection>

        {/* ── FOOTER ─────────────────────────────────── */}
        <section className="ulio-footer">
          <p>{project.year} · {project.category}</p>
          <h2>{"A system this big needs\na product this good."}</h2>
        </section>
      </article>
    </div>
  );
}
