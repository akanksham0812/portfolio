import "./bh-ops.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// ── Reveal on scroll ─────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, on];
}

function R({ children, delay = 0, style = {}, className = "" }) {
  const [ref, on] = useReveal();
  return (
    <div
      ref={ref}
      className={`bh-r ${on ? "bh-r--on" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

// ── CountUp ──────────────────────────────────────────────────────────────────
function CountUp({ to, suffix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 1400, 1);
        setV(Math.round((1 - Math.pow(1 - t, 3)) * to));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

// ── Dashboard mini UI ────────────────────────────────────────────────────────
function MiniDash() {
  const alerts = [
    { color: "#ef4444", label: "P1 · DB Latency spike", w: "82%" },
    { color: "#f59e0b", label: "P2 · API timeout rate", w: "64%" },
    { color: "#10b981", label: "P3 · Cache miss ratio", w: "48%" },
    { color: "#3b82f6", label: "P3 · Queue depth", w: "35%" },
  ];
  return (
    <div className="bh-dash">
      <div className="bh-dash-bar">
        <span className="bh-dot r" /><span className="bh-dot y" /><span className="bh-dot g" />
        <span className="bh-dash-url">ops.internal / overview</span>
      </div>
      <div className="bh-dash-body">
        <div className="bh-dash-sidebar">
          <div className="bh-dash-logo" />
          <div className="bh-dash-nav active" />
          <div className="bh-dash-nav" style={{ width: "80%" }} />
          <div className="bh-dash-nav" style={{ width: "90%" }} />
          <div className="bh-dash-nav" style={{ width: "70%" }} />
          <div className="bh-dash-nav" style={{ width: "85%" }} />
        </div>
        <div className="bh-dash-main">
          {/* Header */}
          <div className="bh-dash-topbar">
            <div className="bh-dash-greeting">
              <div className="bh-dash-title-line" />
              <div className="bh-dash-sub-line" />
            </div>
            <div className="bh-dash-status">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block", marginRight: 4 }} />
              <div style={{ width: 48, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.15)" }} />
            </div>
          </div>
          {/* KPIs */}
          <div className="bh-kpi-row">
            {[
              { label: "Active P1s", val: "3", c: "#ef4444" },
              { label: "MTTR avg", val: "18m", c: "#f59e0b" },
              { label: "Resolved", val: "94%", c: "#10b981" },
              { label: "On-call", val: "8/12", c: "#6366f1" },
            ].map(k => (
              <div key={k.label} className="bh-kpi">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: k.c, marginBottom: 5 }} />
                <div className="bh-kpi-val">{k.val}</div>
                <div className="bh-kpi-lbl">{k.label}</div>
              </div>
            ))}
          </div>
          {/* Alert rows */}
          <div className="bh-alerts">
            {alerts.map((a, i) => (
              <div key={i} className="bh-alert-row">
                <span className="bh-alert-dot" style={{ background: a.color }} />
                <div className="bh-alert-label">{a.label}</div>
                <div className="bh-alert-bar"><div style={{ width: a.w, height: "100%", background: a.color, opacity: 0.35, borderRadius: 3 }} /></div>
              </div>
            ))}
          </div>
          {/* Chart area */}
          <div className="bh-chart-row">
            <div className="bh-chart-main">
              <div className="bh-chart-inner">
                {[40, 65, 35, 80, 55, 90, 45, 70, 60, 85].map((h, i) => (
                  <div key={i} className="bh-bar" style={{ height: `${h}%`, background: i === 7 ? "#ef4444" : "rgba(255,255,255,0.15)" }} />
                ))}
              </div>
            </div>
            <div className="bh-chart-side">
              <div style={{ height: "48%", background: "rgba(255,255,255,0.06)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)" }} />
              <div style={{ height: "48%", background: "rgba(255,255,255,0.06)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Module data ──────────────────────────────────────────────────────────────
const MODULES = [
  {
    id: "home",
    tag: "01",
    title: "The Command Centre",
    sub: "Home — Live Operations Overview",
    body: "Operations managers begin every shift with an orientation tax — checking emails, logging into five tools, pulling up spreadsheets. The Home screen eliminates that entirely. Built on a newspaper front-page model: status at the top, actionable items below.",
    points: [
      "KPI bar above the fold: Active incidents, MTTR, Resolution rate, Team availability — status before any scrolling",
      "Priority-ranked incident feed replacing the undifferentiated alert stream that trained teams to ignore dashboards",
      "Quick Actions card: the two most frequent tasks surfaced as shortcuts, bypassing sub-module navigation",
      "Anomaly timeline shows last 24h pattern — making the invisible visible before it becomes a crisis",
    ],
  },
  {
    id: "incidents",
    tag: "02",
    title: "Incident Workspace",
    sub: "Incidents — Triage & Response",
    body: "The average incident triage involved switching between 5 tools — Slack, PagerDuty, Grafana, Jira, and email. Each switch added context loss. The Incident module makes all of that one surface. Most P2→P1 escalations happened at handoff — communication failure, not technical failure.",
    points: [
      "Contextual incident cards with full history inline — eliminated the need to reconstruct context from memory under pressure",
      "Inline communication thread co-located with the incident timeline — no Slack tab required",
      "Smart assignment surfacing team availability and domain expertise, reducing mis-assignment by design",
      "One-click escalation with automatic context bundling — no manual status writeup before handoff",
    ],
  },
  {
    id: "analytics",
    tag: "03",
    title: "Decisions, Not Data",
    sub: "Analytics — Intelligence Layer",
    body: "The difference between '847 alerts this week' and 'API alerts are 40% above baseline — your payment service is the likely root' is the entire value proposition. Every chart connects to an action. Every trend surfaces a recommendation.",
    points: [
      "Incident volume trends with drill-down — pattern recognition surfaced automatically, not manually",
      "MTTR tracking by team and priority tier, enabling targeted coaching and resource reallocation",
      "Escalation pattern analysis identifying systemic gaps in playbooks and on-call coverage",
      "Custom report builder for stakeholder communication — ops teams stop writing status emails",
    ],
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────
export function OpsUsecasePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("home");
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const s = el.scrollTop || document.body.scrollTop;
      const t = el.scrollHeight - el.clientHeight;
      setScrollPct(t > 0 ? (s / t) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const mod = MODULES.find(m => m.id === tab);

  return (
    <div className="bh-page">
      {/* Progress */}
      <div className="bh-progress" style={{ width: `${scrollPct}%` }} />

      {/* Back */}
      <button className="cs-back bh-back" onClick={() => navigate("/?section=work")}>
        <span className="cs-back-arrow">←</span> All Work
      </button>

      {/* ── HERO ── */}
      <section className="bh-hero">
        <div className="bh-hero-inner">
          {/* Small category label — like "NIVA MOBILE APPLICATION" */}
          <div className="bh-hero-category">Operations Intelligence Hub</div>

          {/* Large editorial heading — medium weight, not bold */}
          <h1 className="bh-hero-h1">
            From firefighting to foresight.<br />
            Fewer tools. More clarity.<br />
            No more fires.
          </h1>

          {/* Tags below heading — outlined pills */}
          <div className="bh-hero-tags">
            {["UX Strategy", "0→1 Product Design", "Enterprise SaaS", "B2B Operations", "Systems Design"].map(t => (
              <span key={t} className="bh-tag">{t}</span>
            ))}
          </div>

          {/* Attribution line */}
          <div className="bh-hero-meta">
            <span>Lead UX Designer</span>
            <span className="bh-sep">|</span>
            <span>UX Research</span>
            <span className="bh-sep">|</span>
            <span>Interaction Design</span>
            <span className="bh-sep">|</span>
            <span>2024</span>
          </div>
        </div>

        {/* Ghost watermark */}
        <div className="bh-ghost-text">OPS</div>

        {/* Dashboard mockup */}
        <div className="bh-hero-mockup-wrap">
          <MiniDash />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bh-stats-section">
        <R>
          <div className="bh-stats-row">
            {[
              { num: 3, suf: "", label: "Core modules\ndesigned end-to-end" },
              { num: 8, suf: "+", label: "Stakeholder interviews\nacross ops teams" },
              { num: 62, suf: "%", label: "Reduction in\nincident triage time" },
              { num: 30, suf: "+", label: "User flows\ndocumented" },
            ].map(({ num, suf, label }) => (
              <div key={label} className="bh-stat">
                <div className="bh-stat-num"><CountUp to={num} suffix={suf} /></div>
                <div className="bh-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </R>
      </section>

      {/* ── DIVIDER LINE ── */}
      <div className="bh-rule" />

      {/* ── CONTEXT ── */}
      <section className="bh-section" id="problem">
        <div className="bh-ghost-num">01</div>
        <R><div className="bh-section-label">Context &amp; Problem</div></R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Operations teams<br /><em>are always one step behind.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">
            Application volumes surged while ops team sizes stayed flat. A reactive culture built on outdated tooling, fragmented communication, and no early-warning capability meant incidents were discovered after the damage was done.
          </p>
        </R>

        {/* 3 problems — editorial layout */}
        <div className="bh-problem-grid">
          {[
            {
              num: "01",
              title: "Reactive by Default",
              body: "Teams discovered incidents after escalation. Average time from anomaly onset to detection: 47 minutes. The dashboard was a rearview mirror, not a windshield.",
              icon: "🔥",
            },
            {
              num: "02",
              title: "Tool Fragmentation",
              body: "Slack, PagerDuty, Grafana, Jira, email — five tools, none connected. Every context switch costs 3–8 minutes. The average triage involved 5+ app switches.",
              icon: "🧩",
            },
            {
              num: "03",
              title: "Escalation Blindspots",
              body: "34% of P1 incidents had detectable signals 45+ minutes earlier. Pattern recognition was manual and lived in individuals — it left when they did.",
              icon: "📡",
            },
          ].map((p, i) => (
            <R key={p.num} delay={i * 80}>
              <div className="bh-prob-card">
                <div className="bh-prob-num">{p.num}</div>
                <div className="bh-prob-icon">{p.icon}</div>
                <h3 className="bh-prob-title">{p.title}</h3>
                <p className="bh-prob-body">{p.body}</p>
              </div>
            </R>
          ))}
        </div>

        {/* Quote */}
        <R>
          <div className="bh-quote">
            <div className="bh-quote-mark">"</div>
            <blockquote className="bh-quote-text">
              We're always one incident behind. By the time our dashboard flags something, the customer has already called.
            </blockquote>
            <cite className="bh-quote-cite">Alex Mitchell · Operations Manager · Primary Persona</cite>
          </div>
        </R>
      </section>

      <div className="bh-rule" />

      {/* ── PERSONA ── */}
      <section className="bh-section bh-section--dark">
        <div className="bh-ghost-num" style={{ color: "rgba(255,255,255,0.03)" }}>02</div>
        <R><div className="bh-section-label bh-section-label--inv">Who We Designed For</div></R>
        <R delay={60}>
          <h2 className="bh-section-h2 bh-section-h2--inv">
            Alex Mitchell,<br /><em>Operations Manager.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead bh-section-lead--inv">
            Age 34, 10 years in enterprise tech, managing a distributed team of 20 across three time zones. These five pain points shaped every design decision.
          </p>
        </R>

        <div className="bh-persona-grid">
          <R>
            <div className="bh-persona-col">
              <div className="bh-persona-col-label">Pain Points</div>
              {[
                "No real-time unified view of operational health",
                "Manual correlation between 5+ monitoring tools",
                "Unclear escalation paths causing duplicate effort",
                "No early warning system for capacity saturation",
                "Zero visibility into team workload distribution",
              ].map((p, i) => (
                <div key={i} className="bh-persona-item bh-persona-item--pain">
                  <span className="bh-persona-mark-x">✕</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </R>
          <R delay={80}>
            <div className="bh-persona-col">
              <div className="bh-persona-col-label">Goals</div>
              {[
                "Reduce mean time to resolution below 20 minutes",
                "Detect anomalies before they reach customers",
                "Single source of truth for all operational data",
                "Streamlined escalation and handoff workflows",
                "Data-backed resource allocation decisions",
              ].map((p, i) => (
                <div key={i} className="bh-persona-item bh-persona-item--goal">
                  <span className="bh-persona-mark-a">→</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </R>
        </div>
      </section>

      {/* ── RESEARCH ── */}
      <section className="bh-section" id="research">
        <div className="bh-ghost-num">03</div>
        <R><div className="bh-section-label">Research &amp; Discovery</div></R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Five methods,<br /><em>one clear signal.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">
            Multi-method research grounding every design decision in qualitative insight and quantitative validation — across discovery, synthesis, and validation phases.
          </p>
        </R>

        {/* Research table */}
        <R>
          <div className="bh-table-wrap">
            <table className="bh-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>What We Learned</th>
                  <th>Design Impact</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Stakeholder Interviews · 8 ops managers", "Teams want signal, not noise. Alert volume overwhelms without priority context. Directors want dashboards that decide, not report.", "Priority-ranked incident feed replacing undifferentiated alert stream."],
                  ["Workflow Shadowing · live incidents", "Context switching between 5+ tools per triage adds ~18 min per cycle. Most context loss happens at handoff, not during resolution.", "Unified incident workspace with inline comms — no Slack tab required."],
                  ["Competitive Analysis · PagerDuty, OpsGenie, Datadog", "Competitors excel at alerting; weak on narrative. Teams can't see the story behind the numbers — only the numbers.", "Timeline-based anomaly tracking as core navigation paradigm."],
                  ["Survey · n=42 ops professionals", "78% cite 'lack of context' as primary cause of escalation failures. Who, what, when — instantly. Not after three clicks.", "Contextual incident cards with full history inline. Context surfaced, not recalled."],
                  ["Historical Data Analysis · 6 months logs", "34% of P1 incidents had detectable signals 45+ minutes earlier. Pattern recognition was manual and inconsistent.", "Anomaly signature framework as foundation for predictive alerting roadmap."],
                ].map(([m, l, d], i) => (
                  <tr key={i}>
                    <td><strong>{m.split(" · ")[0]}</strong><br /><span className="bh-table-sub">{m.split(" · ")[1]}</span></td>
                    <td>{l}</td>
                    <td>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </R>

        {/* Findings — numbered editorial blocks */}
        <div className="bh-findings">
          <R>
            <div className="bh-findings-label">Key Findings</div>
          </R>
          {[
            { n: "01", t: "Signal/noise ratio is the core problem", b: "Teams weren't starved of data — they were drowning in it. Undifferentiated alert streams trained managers to ignore dashboards. The platform's primary job is curation, not collection." },
            { n: "02", t: "Context collapse under pressure", b: "Under high-stress conditions, ops teams lose the ability to recall system state. Context must be surfaced at the point of action — not stored somewhere for later retrieval." },
            { n: "03", t: "Communication is where incidents escalate", b: "Most P2→P1 escalations happened at handoff. Communication failure, not technical failure. Bringing comms into the incident surface was the highest-impact design decision." },
            { n: "04", t: "Trust is earned through accuracy", b: "Teams had learned to ignore dashboards that had cried wolf. Every false positive erodes adoption. The priority classification needed to be correct before it could be displayed." },
            { n: "05", t: "Peak cognitive load at the worst moment", b: "Peak alert volume coincides with lowest team capacity. Design for 2am, not 10am. Clear hierarchy, one-click actions, escape routes everywhere." },
          ].map((f, i) => (
            <R key={f.n} delay={i * 60}>
              <div className="bh-finding">
                <div className="bh-finding-num">{f.n}</div>
                <div className="bh-finding-body">
                  <h3 className="bh-finding-title">{f.t}</h3>
                  <p className="bh-finding-text">{f.b}</p>
                </div>
              </div>
            </R>
          ))}
        </div>
      </section>

      <div className="bh-rule" />

      {/* ── STRATEGY ── */}
      <section className="bh-section" id="strategy">
        <div className="bh-ghost-num">04</div>
        <R><div className="bh-section-label">Design Strategy</div></R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Kano-led build<br /><em>sequencing.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">Applied the Kano Model to prioritise across three build phases — ensuring immediate value delivery without overbuilding an MVP that needed trust first.</p>
        </R>

        <div className="bh-kano">
          {[
            {
              phase: "Must-Haves", sub: "MVP — Avoid dissatisfaction",
              items: ["Real-time incident feed", "Priority signal classification (P1/P2/P3)", "Incident assignment & acknowledgment", "Basic timeline view", "Status communication templates"],
              dark: true,
            },
            {
              phase: "Performance", sub: "Phase 2 — Linear satisfaction gains",
              items: ["Anomaly timeline with context", "Team workload visibility", "Escalation path visualiser", "Analytics & reporting module", "Cross-incident correlation"],
              dark: false,
            },
            {
              phase: "Delighters", sub: "Phase 3 — Exponential word-of-mouth",
              items: ["Predictive anomaly detection", "Automated runbook suggestions", "Capacity planning module", "AI-assisted root cause analysis", "Custom alert signature builder"],
              dark: false,
              gold: true,
            },
          ].map((col, i) => (
            <R key={col.phase} delay={i * 80}>
              <div className={`bh-kano-col ${col.dark ? "bh-kano-col--dark" : col.gold ? "bh-kano-col--gold" : "bh-kano-col--light"}`}>
                <div className="bh-kano-phase">{col.phase}</div>
                <div className="bh-kano-sub">{col.sub}</div>
                <div className="bh-kano-items">
                  {col.items.map(item => <div key={item} className="bh-kano-item">{item}</div>)}
                </div>
              </div>
            </R>
          ))}
        </div>

        {/* Principles */}
        <div style={{ marginTop: 96 }}>
          <R>
            <div className="bh-principles-label">Four Design Principles</div>
          </R>
          <div className="bh-principles">
            {[
              { n: "01", t: "Signal Over Noise", b: "The value of an operations platform is what it hides, not what it shows. Every alert must earn its place by being actionable. Curation is a design act." },
              { n: "02", t: "Context at First Glance", b: "An ops manager under pressure cannot reconstruct context. Who escalated this, when, and what system is affected — before a single click. Surface, don't store." },
              { n: "03", t: "Trust Through Accuracy", b: "A dashboard that alerts incorrectly is worse than none. Precision is a trust mechanism. Volume is a liability. We spent two sprints on classification before visual design." },
              { n: "04", t: "Design for Degraded States", b: "The platform must perform best when its users are performing worst. Clear hierarchy, one-click actions, and escape routes for every dead end. Design for 2am." },
            ].map((p, i) => (
              <R key={p.n} delay={i * 60}>
                <div className="bh-principle">
                  <div className="bh-principle-n">{p.n}</div>
                  <div>
                    <h3 className="bh-principle-t">{p.t}</h3>
                    <p className="bh-principle-b">{p.b}</p>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      <div className="bh-rule" />

      {/* ── MODULES ── */}
      <section className="bh-section" id="modules">
        <div className="bh-ghost-num">05</div>
        <R><div className="bh-section-label">Module Design</div></R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Three modules,<br /><em>one system.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">Each module solves a distinct operational problem. Together they form a unified command centre replacing the fragmented five-tool stack.</p>
        </R>

        {/* Tab selector */}
        <R>
          <div className="bh-tabs">
            {MODULES.map(m => (
              <button key={m.id} className={`bh-tab ${tab === m.id ? "bh-tab--on" : ""}`} onClick={() => setTab(m.id)}>
                <span className="bh-tab-tag">{m.tag}</span> {m.id.charAt(0).toUpperCase() + m.id.slice(1)}
              </button>
            ))}
          </div>
        </R>

        {mod && (
          <div className="bh-mod-grid" key={tab} style={{ animation: "bh-fadein 0.3s ease" }}>
            <div className="bh-mod-left">
              <div className="bh-mod-sub">{mod.sub}</div>
              <h3 className="bh-mod-title">{mod.title}</h3>
              <p className="bh-mod-body">{mod.body}</p>
              <ul className="bh-mod-points">
                {mod.points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="bh-mod-right">
              {/* Screen mockup */}
              <div className="bh-mod-screen">
                <div className="bh-mod-screen-bar">
                  <span className="bh-dot r" /><span className="bh-dot y" /><span className="bh-dot g" />
                  <span className="bh-mod-screen-title">{mod.sub}</span>
                </div>
                <div className="bh-mod-screen-body">
                  <div className="bh-mod-screen-header" />
                  <div className="bh-mod-kpis">
                    {["#ef4444","#f59e0b","#10b981","#6366f1"].map((c, i) => (
                      <div key={i} className="bh-mod-kpi">
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: c, marginBottom: 5 }} />
                        <div className="bh-mod-kpi-val" />
                        <div className="bh-mod-kpi-lbl" />
                      </div>
                    ))}
                  </div>
                  <div className="bh-mod-rows">
                    {[90, 72, 55, 80].map((w, i) => (
                      <div key={i} className="bh-mod-row">
                        <div className="bh-mod-row-dot" style={{ background: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#10b981" }} />
                        <div className="bh-mod-row-bar" style={{ width: `${w}%` }} />
                        <div className="bh-mod-row-action" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── OUTCOMES ── */}
      <section className="bh-section bh-section--dark" id="outcomes">
        <div className="bh-ghost-num" style={{ color: "rgba(255,255,255,0.03)" }}>06</div>
        <R><div className="bh-section-label bh-section-label--inv">Outcomes</div></R>
        <R delay={60}>
          <h2 className="bh-section-h2 bh-section-h2--inv">
            From reactive<br /><em>to proactive.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead bh-section-lead--inv">
            The platform shipped to a pilot cohort of 12 operations teams. Early signals validated both the design direction and the core insight — that context, not data volume, is the lever for operational excellence.
          </p>
        </R>

        <div className="bh-outcomes">
          {[
            { n: "62%", l: "Reduction in P1 incident triage time" },
            { n: "1×", l: "Single source of truth replacing five-tool stack" },
            { n: "3×", l: "Increase in proactive vs reactive detection" },
            { n: "↑ High", l: "Data trust scores vs pre-launch baseline" },
          ].map(({ n, l }, i) => (
            <R key={i} delay={i * 80}>
              <div className="bh-outcome">
                <div className="bh-outcome-num">{n}</div>
                <div className="bh-outcome-label">{l}</div>
              </div>
            </R>
          ))}
        </div>

        {/* Before / After */}
        <R>
          <div className="bh-ba-grid">
            <div className="bh-ba-col bh-ba-col--before">
              <div className="bh-ba-label">Before</div>
              <h3 className="bh-ba-title">The firefighting culture</h3>
              <p className="bh-ba-body">Reactive to every alert. Fatigue eroding trust in the tools meant to help. Escalations driven by gut feel. Every P1 a crisis. Five tools, zero unified view.</p>
            </div>
            <div className="bh-ba-col bh-ba-col--after">
              <div className="bh-ba-label">After</div>
              <h3 className="bh-ba-title">The intelligence culture</h3>
              <p className="bh-ba-body">Prioritised signal, surfaced context, one workspace for the full incident lifecycle. Less time orienting, more time resolving. Anomalies caught before customers feel them.</p>
            </div>
          </div>
        </R>
      </section>

      {/* ── REFLECTIONS ── */}
      <section className="bh-section" id="reflections">
        <div className="bh-ghost-num">07</div>
        <R><div className="bh-section-label">Reflections</div></R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            What I learned<br /><em>building this.</em>
          </h2>
        </R>

        <div className="bh-reflections">
          {[
            {
              n: "01",
              t: "Cognitive load research was the unlock",
              b: "Understanding how acute stress degrades working memory and pattern recognition changed the entire information architecture. The insight came from behavioural psychology, not product design. Domain-crossing is underrated.",
            },
            {
              n: "02",
              t: "Trust is a design material, not a feature",
              b: "We spent two sprints on the alert accuracy model before designing the visual layer. The priority classification needed to be correct before it could be displayed. Reliability is a design decision.",
            },
            {
              n: "03",
              t: "Shadowing over interviewing",
              b: "Two live incident observations taught more than weeks of interviews. People's described workflows and actual workflows diverged significantly under pressure. Design for the state you've watched people inhabit.",
            },
          ].map((r, i) => (
            <R key={r.n} delay={i * 80}>
              <div className="bh-reflection">
                <div className="bh-reflection-n">{r.n}</div>
                <div>
                  <h3 className="bh-reflection-t">{r.t}</h3>
                  <p className="bh-reflection-b">{r.b}</p>
                </div>
              </div>
            </R>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bh-footer">
        <div className="bh-footer-ghost">END</div>
        <div className="bh-footer-inner">
          <div className="bh-footer-label">2024 · Product Design · Enterprise SaaS</div>
          <h2 className="bh-footer-h">Thank you for reading through.</h2>
          <button className="bh-footer-back" onClick={() => navigate("/?section=work")}>← Back to all work</button>
        </div>
      </footer>
    </div>
  );
}
