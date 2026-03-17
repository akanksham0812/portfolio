import "./bh-ops.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
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

function CountUp({ to, prefix = "", suffix = "" }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / 1400, 1);
          setValue(Math.round((1 - Math.pow(1 - progress, 3)) * to));

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

function AutoImageFrame({ src, alt, className = "", children }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <div className={`bh-image-frame ${className}`}>
        <img src={src} alt={alt} loading="lazy" className="bh-image-frame-img" onError={() => setFailed(true)} />
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}

const SECTION_LINKS = [
  { id: "problem", label: "Problem" },
  { id: "persona", label: "Persona" },
  { id: "research", label: "Research" },
  { id: "strategy", label: "Strategy" },
  { id: "modules", label: "Modules" },
  { id: "challenges", label: "Challenges" },
  { id: "outcomes", label: "Outcomes" },
  { id: "reflections", label: "Learnings" },
];

const HERO_TAGS = [
  "UX Case Study",
  "Admissions Platform",
  "EdTech SaaS",
  "Systems Design",
  "Research Led",
];

const HERO_META = ["Senior UX Designer", "UX Research", "Product Strategy", "2025"];

const STATS = [
  { value: 6, label: "Core modules\ndesigned end-to-end" },
  { value: 8, suffix: "+", label: "Stakeholder interviews\nacross admissions teams" },
  { value: 40, suffix: "+", label: "University admins\nsurveyed in Kano study" },
  { value: 3, suffix: "+", label: "Partner institutions\nin pilot validation" },
];

const PROBLEM_CARDS = [
  {
    num: "01",
    stat: "12%",
    title: "Application Inflation",
    body:
      "Application volumes surged 12% year-over-year while admissions team sizes stayed flat. Review windows shrank to roughly 8 minutes per application as workload rose without new capacity.",
  },
  {
    num: "02",
    stat: "5 tools",
    title: "Tool Fragmentation",
    body:
      "Slate, Salesforce, Zoom, Excel, and email all supported pieces of the journey, but none gave teams a unified view of pipeline health or student engagement.",
  },
  {
    num: "03",
    stat: "2025",
    title: "The Enrollment Cliff",
    body:
      "Declining high-school graduate cohorts and tighter international restrictions intensified competition for every applicant, raising the cost of slow or fragmented operations.",
  },
];

const PERSONA = {
  name: "Sarah Chen",
  summary:
    "Age 38, Admissions Director at a mid-sized state university, 12 years in higher ed, managing a team of 15. Her five core pain points shaped every module I designed.",
  painPoints: [
    "No single pipeline visibility view",
    "Manual outreach to 12,000+ applicants",
    "No connection between aid offers and yield",
    "Events tracked in spreadsheets after Zoom sessions",
    "Zero early warning on enrollment targets",
  ],
  goals: [
    "Meet enrollment targets despite demographic decline",
    "Reduce time-to-decision and improve yield rates",
    "Create better visibility into the recruitment pipeline",
    "Reduce repetitive, manual administrative work",
    "Diversify the student body after the affirmative action ruling",
  ],
};

const RESEARCH_ROWS = [
  {
    method: "Stakeholder Interviews",
    sample: "8 admissions directors",
    learned:
      "Decision bottlenecks occur at application review and yield stages. Directors want dashboards, not reports.",
    impact: "Designed Home as an action-oriented command center rather than a passive data display.",
  },
  {
    method: "Competitive Analysis",
    sample: "Slate, Salesforce EDU, EAB Navigate",
    learned:
      "Competitors optimize for data capture, not decision support. Communication tooling was weak across the category.",
    impact: "Prioritized Communication as a differentiator and treated campaign management as a core module.",
  },
  {
    method: "UX Audit",
    sample: "Existing admissions flows",
    learned:
      "Counselors abandoned bulk communication tasks mid-flow because of multi-step friction. Average task completion was 62%.",
    impact: "Reduced campaign creation to three guided steps and introduced smarter audience segmentation.",
  },
  {
    method: "Kano Model Survey",
    sample: "University admins, n=40",
    learned:
      "Analytics and bulk communication were classified as Performance features. AI matching and predictive yield were clear Delighters.",
    impact: "Sequenced the MVP around must-haves and reserved AI-heavy ideas for the roadmap.",
  },
  {
    method: "Market Data Analysis",
    sample: "2025 industry reports",
    learned:
      "60% of students expect same-day responses, 67% of counselors lack essential tools, and 62% of students cite cost as a top stressor.",
    impact: "Validated a multi-sided platform direction and sharpened communication and scholarship priorities.",
  },
];

const FINDINGS = [
  {
    num: "01",
    title: "Visibility before action",
    body:
      "Directors needed to understand pipeline health at a glance before taking any action. Every metric needed to become a decision, not a data point.",
  },
  {
    num: "02",
    title: "Communication is a bottleneck, not a feature",
    body:
      "Bulk communication was the highest-friction workflow in every admissions office we studied. Turning it into a guided system became the defining opportunity.",
  },
  {
    num: "03",
    title: "Analytics only matter if they surface decisions",
    body:
      "Raw counts were easy to access elsewhere. The platform had to answer which program was under target, which segment needed outreach, and what to do next.",
  },
  {
    num: "04",
    title: "Community builds yield",
    body:
      "Universities with stronger event and community engagement showed measurably higher enrollment intent. The platform needed to facilitate that engagement, not just track it.",
  },
  {
    num: "05",
    title: "Trust is the admission price",
    body:
      "No university would expose student data to a new system without strong verification, transparent permissions, and visible compliance safeguards.",
  },
];

const KANO_GROUPS = [
  {
    phase: "Must-Haves",
    sub: "MVP - Avoid dissatisfaction first",
    dark: true,
    items: [
      "University profile creation",
      "Receive and review applications",
      "Send decisions: Accept, Reject, or Defer",
      "Message students directly",
      "Basic event creation",
    ],
  },
  {
    phase: "Performance",
    sub: "Phase 2 - Create linear satisfaction gains",
    items: [
      "Analytics dashboard with funnel visibility",
      "Bulk communication and campaigns",
      "Application filtering and search",
      "Scholarship management",
      "Q&A management system",
    ],
  },
  {
    phase: "Delighters",
    sub: "Phase 3 - Create exponential word-of-mouth",
    gold: true,
    items: [
      "AI-powered applicant matching",
      "Predictive yield modelling",
      "Automated nurture campaigns",
      "CRM and SIS integration",
      "Virtual event platform",
    ],
  },
];

const PRINCIPLES = [
  {
    num: "01",
    title: "Action Over Information",
    body:
      "Every data point connects to a workflow. Metrics are entry points, not decoration, and the interface always offers a next step.",
  },
  {
    num: "02",
    title: "Trust by Default",
    body:
      "FERPA and GDPR compliance shape every access pattern. Permissions, audit trails, and verification are designed as primary UX concerns.",
  },
  {
    num: "03",
    title: "Progressive Complexity",
    body:
      "Admissions officers get a clean, task-oriented view. Directors unlock deeper analytics and automation only when they need them.",
  },
  {
    num: "04",
    title: "Reduce Load at Peak Stress",
    body:
      "Application season is maximum stress. Clear hierarchy, standardised comparison views, and one-click actions cut cognitive load when timing matters most.",
  },
];

const MODULES = [
  {
    id: "home",
    tag: "01",
    label: "Home",
    sub: "Home - The Command Centre",
    title: "Home - The Command Centre",
    body:
      "Admissions directors were spending the first 15 minutes of each day orienting themselves across email, Slate, and spreadsheets. The Home screen eliminates that orientation tax entirely.",
    points: [
      "KPI bar above the fold with page views, unique viewers, RSVPs, and interested students before any scrolling.",
      "Quick Actions surface the two most frequent tasks so staff can skip sub-module navigation.",
      "A newspaper front-page hierarchy reduced time-to-first-action by roughly 40% in usability testing.",
      "Upcoming Events operates as both a work queue and a real-time performance readout.",
    ],
  },
  {
    id: "analytics",
    tag: "02",
    label: "Analytics",
    sub: "Analytics - From Data to Decisions",
    title: "Analytics - From Data to Decisions",
    body:
      "Analytics was the most complex module to design because the failure mode was obvious: dashboards get built, then ignored. The challenge was not adding more data. It was adding clearer decisions.",
    points: [
      "The conversion funnel links each stage to a pre-filtered campaign audience so every metric has an exit ramp into action.",
      "Milestone alerts turn passive reporting into proactive moments that prompt outreach or celebration.",
      "Demographics stay intentionally lightweight so any admissions officer can act without needing an analyst.",
      "The Top Pages table focuses on the three signals that actually drive content decisions: views, time, and bounce.",
    ],
  },
  {
    id: "management",
    tag: "03",
    label: "Management",
    sub: "Management - Institutional Identity",
    title: "Management - Institutional Identity",
    body:
      "This module balances two very different needs: how a university presents itself to prospective students and how it maintains the academic catalogue that drives application decisions.",
    points: [
      "Tabbed profile architecture mirrors how students research universities as distinct decision factors instead of a single monolith.",
      "Key metrics use structured fact pairs that support fast comparison and align with familiar evaluation patterns.",
      "Transparent earning-potential ranges address financial anxiety and increase trust with cost-sensitive students.",
      "AI-assisted programme creation reduces onboarding effort for institutions that are already stretched thin.",
    ],
  },
  {
    id: "communication",
    tag: "04",
    label: "Communication",
    sub: "Communication - Closing the Engagement Gap",
    title: "Communication - Closing the Engagement Gap",
    body:
      "Students increasingly expect same-day responses, while many admissions offices still operate on 24-hour cycles. This module closes that gap through workflow design, not extra headcount.",
    points: [
      "Dual-metric event cards separate discovery problems from conversion problems by pairing views with RSVPs.",
      "Channel tags make performance differences across email and WhatsApp visible and easy to benchmark.",
      "Campaign cards map directly to sent, opened, and clicked so teams can learn without another analytics tool.",
      "Published and Draft statuses act as workflow gates that protect students from premature or incomplete communications.",
    ],
  },
  {
    id: "community",
    tag: "05",
    label: "Community",
    sub: "Community - Building Yield Through Belonging",
    title: "Community - Building Yield Through Belonging",
    body:
      "Research showed a consistent relationship between community engagement and enrollment intent. Students who interacted with university content were measurably more likely to picture themselves there.",
    points: [
      "A four-audience tab structure reflects how admissions teams actually work across content, people, universities, and events.",
      "Rich post creation gives teams enough publishing flexibility without requiring a separate CMS.",
      "Lightweight reactions provide engagement signal without overcommitting the product to heavy moderation tooling.",
    ],
  },
  {
    id: "settings",
    tag: "06",
    label: "Settings",
    sub: "Settings - Trust Infrastructure",
    title: "Settings - Trust Infrastructure",
    body:
      "Settings is where trust is built or broken. Universities need to understand verification, permissions, and security posture before they will trust a new platform with student data.",
    points: [
      "Verification status is handled as a persistent platform state, not a tiny badge hidden in the corner.",
      "Field-level edit controls make changes to sensitive account information deliberate instead of accidental.",
      "KYC steps sit directly inside Settings to reduce the distance between needing trust and achieving trust.",
      "Two-factor authentication is treated as a primary action because security posture is both a UX and compliance decision.",
    ],
  },
];

const CHALLENGES = [
  {
    num: "01",
    challengeTitle: "Two Different Mental Models in One Interface",
    challengeBody:
      "Admissions officers need fast task completion. Directors need strategic visibility. A single interface had to support both without compromising either.",
    solutionTitle: "Progressive Disclosure as Architecture",
    solutionBody:
      "Primary navigation exposes core workflows with minimal clicks, while deeper analytics and configuration live behind intentional moves. Officers and directors share one system but begin from different entry points.",
  },
  {
    num: "02",
    challengeTitle: "Making Analytics Actionable, Not Decorative",
    challengeBody:
      "Early concepts were data-rich but decision-poor. In testing, most directors reviewed the screen, nodded, and left without taking meaningful action.",
    solutionTitle: "Every Metric Gets an Exit Ramp",
    solutionBody:
      "Every key metric now links into a workflow: filtered audiences, milestone follow-ups, or campaign creation. Data that did not point to an action was removed from version one.",
  },
  {
    num: "03",
    challengeTitle: "Trust and Verification as UX, Not Engineering",
    challengeBody:
      "Verification was initially treated as a back-office concern. Research showed that friction during verification directly reduced profile completion and delayed institutional launch.",
    solutionTitle: "Verification as Onboarding, Not Gatekeeping",
    solutionBody:
      "I reframed KYC as a guided experience with progress, contextual help, and country-specific accreditation fields. Post-verification checklists keep momentum going after approval.",
  },
  {
    num: "04",
    challengeTitle: "Communication Module Scope Creep",
    challengeBody:
      "Events, campaigns, session booking, broadcasts, and direct messages all wanted the same space in the navigation, even though they supported different jobs to be done.",
    solutionTitle: "Separate Jobs, Separate Surfaces",
    solutionBody:
      "Engagement creation stayed in Communication, while real-time conversation moved into a dedicated Messages space. Distinct mental models became distinct navigation decisions.",
  },
];

const OUTCOMES = [
  { value: "~40%", label: "Reduction in time-to-first-action on the Home screen" },
  { value: "3x", label: "Faster campaign creation versus manual email outreach" },
  { value: "8 -> 5m", label: "Projected application review time reduction through filtering" },
  { value: "<10%", label: "Drop-off between approved and live university profiles" },
];

const SCALE_ROWS = [
  {
    challenge: "Designing for multiple user roles with conflicting needs",
    scale:
      "Large platforms routinely balance the needs of power users and casual users, operators and administrators, or buyers and sellers in the same environment.",
  },
  {
    challenge: "Making complex data actionable without overwhelming non-technical users",
    scale:
      "The same translation challenge shows up in analytics-heavy products where decision support matters more than raw reporting.",
  },
  {
    challenge: "Designing across a three-sided marketplace with cross-role dependencies",
    scale:
      "Platform businesses depend on understanding how actions in one role surface as experiences in another. Ulio demanded that same systems thinking.",
  },
  {
    challenge: "Treating KYC and compliance as UX, not just engineering",
    scale:
      "Trust, safety, identity verification, and regulatory compliance are core product experiences in any mature platform ecosystem.",
  },
  {
    challenge: "Feature sequencing under real resource constraints",
    scale:
      "The Kano-led roadmap used here translates directly into quarterly planning, phased rollouts, and MVP decisions at larger product organisations.",
  },
];

const REFLECTIONS = [
  {
    num: "01",
    title: "Run Kano earlier in the process",
    body:
      "The Kano survey arrived after I had already committed to some analytics directions. Running it earlier would have exposed the gap between what directors asked for and what they actually needed.",
  },
  {
    num: "02",
    title: "Design cross-role flows from day one",
    body:
      "The university dashboard initially evolved too separately from student and counselor experiences. Mapping those interactions earlier would have surfaced integration tensions sooner and more cheaply.",
  },
  {
    num: "03",
    title: "Anchor the work in jobs, not features, from kickoff",
    body:
      "Communication became difficult because every stakeholder requested legitimate features. A jobs-to-be-done framing at kickoff would have contained scope earlier.",
  },
  {
    num: "04",
    title: "Invest more in migration and onboarding",
    body:
      "The best interface still fails if teams never move from their incumbent stack. In hindsight, the migration experience from Slate or Salesforce deserved more design attention.",
  },
];

const PREVIEW_NAV_ITEMS = ["Home", "Analytics", "Management", "Communication", "Community", "Settings"];

function PreviewWindow({ active, title, subtitle, actionLabel, tabs = [], children }) {
  return (
    <div className="bh-preview-window">
      <div className="bh-preview-window-bar">
        <span className="bh-dot r" />
        <span className="bh-dot y" />
        <span className="bh-dot g" />
        <span className="bh-preview-window-url">ulio.internal / {active.toLowerCase()}</span>
      </div>
      <div className="bh-preview-window-body">
        <aside className="bh-preview-sidebar">
          <div className="bh-preview-logo">U</div>
          {PREVIEW_NAV_ITEMS.map((item) => (
            <div key={item} className={`bh-preview-nav ${item === active ? "is-active" : ""}`}>
              <span>{item}</span>
            </div>
          ))}
        </aside>

        <div className="bh-preview-main">
          <div className="bh-preview-topbar">
            <div>
              <div className="bh-preview-title">{title}</div>
              <div className="bh-preview-subtitle">{subtitle}</div>
            </div>
            {actionLabel ? <div className="bh-preview-action">{actionLabel}</div> : null}
          </div>

          {tabs.length ? (
            <div className="bh-preview-tabs">
              {tabs.map((tab, index) => (
                <span key={tab} className={`bh-preview-tab ${index === 0 ? "is-active" : ""}`}>
                  {tab}
                </span>
              ))}
            </div>
          ) : null}

          <div className="bh-preview-stack">{children}</div>
        </div>
      </div>
    </div>
  );
}

function UniversityHeroPreview({ parallax = { x: 0, y: 0 } }) {
  const heroStats = [
    { label: "Page Views", value: "12,000", note: "vs 10,400 last week" },
    { label: "Unique Viewers", value: "8,426", note: "steady inbound traffic" },
    { label: "Event RSVPs", value: "342", note: "next 7 days" },
    { label: "Interested Students", value: "1,284", note: "up 18% month over month" },
  ];

  const priorityRows = [
    { label: "Virtual Open House", meta: "234 RSVPs", tone: "accent" },
    { label: "Engineering yield dip", meta: "-15% vs target", tone: "gold" },
    { label: "Scholarship deadline push", meta: "Send reminder today", tone: "success" },
  ];

  const boardStyle = {
    transform: `perspective(1800px) rotateX(${parallax.y * -3}deg) rotateY(${parallax.x * 4}deg)`,
  };

  const leftFloatStyle = {
    transform: `translate3d(${parallax.x * -18}px, ${parallax.y * -14}px, 0)`,
  };

  const rightFloatStyle = {
    transform: `translate3d(${parallax.x * 16}px, ${parallax.y * -12}px, 0)`,
  };

  return (
    <div className="bh-hero-stage">
      <div className="bh-hero-float bh-hero-float--left" style={leftFloatStyle}>
        <div className="bh-hero-float-value">~40%</div>
        <div className="bh-hero-float-label">Faster time-to-first-action from the Home screen</div>
      </div>

      <div className="bh-hero-float bh-hero-float--right" style={rightFloatStyle}>
        <div className="bh-hero-float-value">6</div>
        <div className="bh-hero-float-label">Modules connected into one admissions workflow</div>
      </div>

      <div className="bh-hero-board" style={boardStyle}>
        <div className="bh-hero-board-bar">
          <span className="bh-dot r" />
          <span className="bh-dot y" />
          <span className="bh-dot g" />
          <span className="bh-hero-board-url">ulio.internal / home</span>
        </div>

        <div className="bh-hero-board-body">
          <aside className="bh-hero-board-sidebar">
            <div className="bh-hero-board-logo">U</div>
            {["Home", "Applications", "Programs", "Communication", "Analytics", "Settings"].map((item, index) => (
              <div key={item} className={`bh-hero-board-nav ${index === 0 ? "is-active" : ""}`}>
                {item}
              </div>
            ))}
          </aside>

          <div className="bh-hero-board-main">
            <div className="bh-hero-banner">
              <div>
                <div className="bh-hero-banner-kicker">Daily overview</div>
                <h3 className="bh-hero-banner-title">A signal-first dashboard for admissions teams under pressure.</h3>
                <p className="bh-hero-banner-copy">
                  One view of pipeline health, student interest, campaign momentum, and next actions - without the spreadsheet shuffle.
                </p>
              </div>
              <div className="bh-hero-banner-chip">
                <span>Yield momentum</span>
                <strong>+18%</strong>
              </div>
            </div>

            <div className="bh-hero-kpis">
              {heroStats.map((stat) => (
                <div key={stat.label} className="bh-hero-kpi">
                  <div className="bh-hero-kpi-label">{stat.label}</div>
                  <div className="bh-hero-kpi-value">{stat.value}</div>
                  <div className="bh-hero-kpi-note">{stat.note}</div>
                </div>
              ))}
            </div>

            <div className="bh-hero-panels">
              <div className="bh-hero-panel">
                <div className="bh-hero-panel-head">
                  <span>Quick actions</span>
                  <span>Today</span>
                </div>
                <div className="bh-hero-actions">
                  <div className="bh-hero-action-card is-accent">
                    <div className="bh-hero-action-title">Create Events</div>
                    <div className="bh-hero-action-copy">Schedule an info session</div>
                  </div>
                  <div className="bh-hero-action-card is-success">
                    <div className="bh-hero-action-title">Edit Programs</div>
                    <div className="bh-hero-action-copy">Refresh tuition and requirements</div>
                  </div>
                </div>
              </div>

              <div className="bh-hero-panel">
                <div className="bh-hero-panel-head">
                  <span>Upcoming priorities</span>
                  <span>Next 7 days</span>
                </div>
                <div className="bh-hero-priority-list">
                  {priorityRows.map((row) => (
                    <div key={row.label} className="bh-hero-priority-row">
                      <span className={`bh-hero-priority-dot is-${row.tone}`} />
                      <div className="bh-hero-priority-copy">
                        <strong>{row.label}</strong>
                        <span>{row.meta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePreview() {
  const stats = [
    { label: "Page Views", value: "12,000", note: "vs 10,400 last week" },
    { label: "Unique Viewers", value: "8,426", note: "healthy discovery" },
    { label: "Event RSVPs", value: "342", note: "scheduled this week" },
    { label: "Interested", value: "1,284", note: "up 18% month over month" },
  ];

  const actions = [
    { title: "Create Events", copy: "Launch a new virtual session", tone: "accent" },
    { title: "Edit Programs", copy: "Update catalogue and tuition", tone: "success" },
  ];

  const events = [
    { title: "Virtual Open House", meta: "Dec 18 - 234 RSVPs" },
    { title: "Engineering Webinar", meta: "Dec 19 - 128 RSVPs" },
    { title: "Scholarship Q&A", meta: "Dec 20 - 96 RSVPs" },
  ];

  return (
    <PreviewWindow active="Home" title="Home" subtitle="Live pipeline summary for admissions teams" actionLabel="+ Add Event">
      <div className="bh-preview-banner">
        <div>
          <div className="bh-preview-banner-title">Admissions at a glance</div>
          <p className="bh-preview-banner-copy">
            A decision-first summary of traffic, interest, event performance, and the next actions that matter.
          </p>
        </div>
        <div className="bh-preview-banner-chip">
          <span>Newspaper-style hierarchy</span>
          <strong>40% faster</strong>
        </div>
      </div>

      <div className="bh-preview-grid bh-preview-grid--4">
        {stats.map((stat) => (
          <div key={stat.label} className="bh-preview-stat">
            <div className="bh-preview-stat-label">{stat.label}</div>
            <div className="bh-preview-stat-value">{stat.value}</div>
            <div className="bh-preview-stat-note">{stat.note}</div>
          </div>
        ))}
      </div>

      <div className="bh-preview-grid bh-preview-grid--2">
        <div className="bh-preview-card">
          <div className="bh-preview-section-head">Quick Actions</div>
          <div className="bh-preview-grid bh-preview-grid--2 bh-preview-grid--tight">
            {actions.map((action) => (
              <div key={action.title} className={`bh-preview-action-card is-${action.tone}`}>
                <div className="bh-preview-action-title">{action.title}</div>
                <div className="bh-preview-action-copy">{action.copy}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bh-preview-card">
          <div className="bh-preview-row-between">
            <div className="bh-preview-section-head">Upcoming Events</div>
            <span className="bh-preview-chip bh-preview-chip--solid">+ Add</span>
          </div>
          <div className="bh-preview-list">
            {events.map((event) => (
              <div key={event.title} className="bh-preview-list-row">
                <div className="bh-preview-list-main">
                  <strong>{event.title}</strong>
                  <span>{event.meta}</span>
                </div>
                <span className="bh-preview-list-tag">Published</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PreviewWindow>
  );
}

function AnalyticsPreview() {
  const funnel = [
    { label: "Profile Views", value: "12,847", width: "100%", tone: "accent" },
    { label: "Programs Explored", value: "1,200", width: "86%", tone: "blue" },
    { label: "Added to Compare", value: "200", width: "58%", tone: "soft" },
    { label: "Shortlisted", value: "150", width: "32%", tone: "success" },
  ];

  const pages = [
    { page: "University Overview", views: "18,492", time: "2:34", bounce: "32%" },
    { page: "Programs and Majors", views: "12,742", time: "2:11", bounce: "29%" },
    { page: "Scholarships", views: "8,109", time: "1:56", bounce: "24%" },
  ];

  const legend = ["India", "United States", "UK", "Others"];

  return (
    <PreviewWindow active="Analytics" title="Analytics" subtitle="Decision support for recruitment performance" actionLabel="View details">
      <div className="bh-preview-banner bh-preview-banner--warm">
        <div>
          <div className="bh-preview-banner-title">Milestone reached</div>
          <p className="bh-preview-banner-copy">
            150 students shortlisted your programs this month - 35% higher than last month.
          </p>
        </div>
        <div className="bh-preview-banner-chip is-warm">
          <span>Action linked</span>
          <strong>Broadcast now</strong>
        </div>
      </div>

      <div className="bh-preview-grid bh-preview-grid--2">
        <div className="bh-preview-card">
          <div className="bh-preview-section-head">Demographics</div>
          <div className="bh-preview-analytics-split">
            <div
              className="bh-preview-donut"
              style={{
                background:
                  "conic-gradient(#5b21b6 0deg 140deg, #8b5cf6 140deg 230deg, #c9a84c 230deg 290deg, #d9d9df 290deg 360deg)",
              }}
            />
            <div className="bh-preview-legend">
              {legend.map((item) => (
                <div key={item} className="bh-preview-legend-item">
                  <span className="bh-preview-legend-dot" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bh-preview-card">
          <div className="bh-preview-section-head">Conversion Funnel</div>
          <div className="bh-preview-funnel">
            {funnel.map((row) => (
              <div key={row.label} className={`bh-preview-funnel-row is-${row.tone}`}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
                <div className="bh-preview-funnel-bar" style={{ width: row.width }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bh-preview-card">
        <div className="bh-preview-section-head">Top Pages</div>
        <div className="bh-preview-mini-table">
          <div className="bh-preview-mini-table-head">
            <span>Page</span>
            <span>Views</span>
            <span>Avg. Time</span>
            <span>Bounce</span>
          </div>
          {pages.map((page) => (
            <div key={page.page} className="bh-preview-mini-table-row">
              <span>{page.page}</span>
              <span>{page.views}</span>
              <span>{page.time}</span>
              <span>{page.bounce}</span>
            </div>
          ))}
        </div>
      </div>
    </PreviewWindow>
  );
}

function ManagementPreview() {
  const metrics = [
    { label: "Ranking", value: "#1" },
    { label: "Acceptance Rate", value: "4.1%" },
    { label: "Avg. Annual Cost", value: "$58,000" },
    { label: "Graduation Rate", value: "94.9%" },
  ];

  const tabs = ["Profile", "Programs", "Scholarships"];
  const profileTabs = ["Overview", "Admissions", "Financials", "Programs"];

  return (
    <PreviewWindow
      active="Management"
      title="Management"
      subtitle="Profile, programmes, and scholarships"
      actionLabel="+ Add Program"
      tabs={tabs}
    >
      <div className="bh-preview-card bh-preview-card--institution">
        <div className="bh-preview-institution-badge">MIT</div>
        <div>
          <div className="bh-preview-institution-name">Massachusetts Institute of Technology</div>
          <div className="bh-preview-institution-type">Private Non-Profit</div>
        </div>
      </div>

      <div className="bh-preview-tabs bh-preview-tabs--subtle">
        {profileTabs.map((tab, index) => (
          <span key={tab} className={`bh-preview-tab ${index === 0 ? "is-active" : ""}`}>
            {tab}
          </span>
        ))}
      </div>

      <div className="bh-preview-grid bh-preview-grid--2">
        <div className="bh-preview-card">
          <div className="bh-preview-section-head">Key Metrics</div>
          <div className="bh-preview-grid bh-preview-grid--2 bh-preview-grid--tight">
            {metrics.map((metric) => (
              <div key={metric.label} className="bh-preview-metric">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="bh-preview-card">
          <div className="bh-preview-section-head">Quick Tip</div>
          <p className="bh-preview-note">
            Use AI-assisted programme creation to structure data-heavy listings without putting the full burden on stretched admissions teams.
          </p>
          <div className="bh-preview-list bh-preview-list--compact">
            <div className="bh-preview-list-row is-inline">
              <div className="bh-preview-list-main">
                <strong>Overview</strong>
                <span>Identity, mission, rankings, and high-trust facts</span>
              </div>
            </div>
            <div className="bh-preview-list-row is-inline">
              <div className="bh-preview-list-main">
                <strong>Programmes</strong>
                <span>Catalogue structure tied to student decision-making</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PreviewWindow>
  );
}

function CommunicationPreview() {
  const eventCards = [
    {
      title: "Virtual Open House: Ulio University",
      meta: "2:00 PM - 4:00 PM EST - Students and Counselors",
      views: "1,342",
      rsvps: "342",
      state: "Published",
      tone: "success",
    },
    {
      title: "Scholarship Info Session",
      meta: "11:00 AM - 12:00 PM EST - Accepted students",
      views: "824",
      rsvps: "126",
      state: "Draft",
      tone: "warm",
    },
  ];

  return (
    <PreviewWindow
      active="Communication"
      title="Communication"
      subtitle="Events, campaigns, and outreach"
      actionLabel="+ Create New"
      tabs={["My Events", "Campaigns", "Session Booking", "Broadcast"]}
    >
      <div className="bh-preview-stack bh-preview-stack--tight">
        {eventCards.map((card) => (
          <div key={card.title} className="bh-preview-card">
            <div className="bh-preview-event">
              <div className="bh-preview-event-date">
                <span>DEC</span>
                <strong>{card.title.includes("Scholarship") ? "20" : "18"}</strong>
              </div>
              <div className="bh-preview-event-copy">
                <div className="bh-preview-event-title">{card.title}</div>
                <div className="bh-preview-event-meta">{card.meta}</div>
                <div className="bh-preview-event-stats">
                  <span>
                    <strong>{card.views}</strong> Views
                  </span>
                  <span>
                    <strong>{card.rsvps}</strong> RSVPs
                  </span>
                  <span className={`bh-preview-chip is-${card.tone}`}>{card.state}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PreviewWindow>
  );
}

function CommunityPreview() {
  const posts = [
    {
      author: "Megan",
      title: "How to turn setbacks into opportunities for growth",
      copy: "A lighter-weight content system for institutional posts, student stories, and topical nudges across the funnel.",
      tags: ["Masters", "Bachelors"],
      tone: "accent",
    },
    {
      author: "Admissions Team",
      title: "What students ask most before applying",
      copy: "Community content creates belonging before commitment, giving universities a place to show voice and values.",
      tags: ["Events", "Community"],
      tone: "gold",
    },
  ];

  return (
    <PreviewWindow
      active="Community"
      title="Community"
      subtitle="Belonging content for prospective students"
      actionLabel="+ Create Post"
      tabs={["Community", "People", "Universities", "Events"]}
    >
      <div className="bh-preview-stack bh-preview-stack--tight">
        {posts.map((post) => (
          <div key={post.title} className="bh-preview-card">
            <div className="bh-preview-post-head">
              <div className={`bh-preview-avatar is-${post.tone}`}>{post.author.charAt(0)}</div>
              <div>
                <div className="bh-preview-post-author">{post.author}</div>
                <div className="bh-preview-post-time">Just now</div>
              </div>
              <span className="bh-preview-follow">Follow +</span>
            </div>
            <div className="bh-preview-post-title">{post.title}</div>
            <p className="bh-preview-post-copy">{post.copy}</p>
            <div className="bh-preview-post-footer">
              <div className="bh-preview-post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="bh-preview-chip">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="bh-preview-post-engagement">190 views</span>
            </div>
          </div>
        ))}
      </div>
    </PreviewWindow>
  );
}

function SettingsPreview() {
  const fields = [
    { label: "Display Name", value: "David Reynald" },
    { label: "Username", value: "davidreynald" },
    { label: "Email", value: "david@gmail.com" },
    { label: "Phone", value: "+66 966891787" },
  ];

  return (
    <PreviewWindow active="Settings" title="Settings" subtitle="Trust, verification, and account security" actionLabel="Review Security">
      <div className="bh-preview-banner bh-preview-banner--soft">
        <div>
          <div className="bh-preview-banner-title">Verification incomplete</div>
          <p className="bh-preview-banner-copy">
            Complete university verification to unlock the full platform and publish a trusted profile.
          </p>
        </div>
        <div className="bh-preview-banner-chip">
          <span>Trust infrastructure</span>
          <strong>Complete now</strong>
        </div>
      </div>

      <div className="bh-preview-card">
        <div className="bh-preview-section-head">Account</div>
        <div className="bh-preview-grid bh-preview-grid--2 bh-preview-grid--tight">
          {fields.map((field) => (
            <div key={field.label} className="bh-preview-field">
              <span>{field.label}</span>
              <strong>{field.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="bh-preview-card">
        <div className="bh-preview-row-between">
          <div>
            <div className="bh-preview-section-head">Security</div>
            <p className="bh-preview-note">Enable two-factor authentication for stronger account protection.</p>
          </div>
          <span className="bh-preview-chip bh-preview-chip--solid">Enable</span>
        </div>
      </div>
    </PreviewWindow>
  );
}

const MODULE_PREVIEWS = {
  home: HomePreview,
  analytics: AnalyticsPreview,
  management: ManagementPreview,
  communication: CommunicationPreview,
  community: CommunityPreview,
  settings: SettingsPreview,
};

export function OpsUsecasePage({ project }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("home");
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState("problem");
  const [isModuleHovered, setIsModuleHovered] = useState(false);
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });

  const caseStudyTitle = project?.title ?? "Designing for Scale: A University Operations Platform";
  const caseStudyLabel = project?.shortTitle ?? "Ulio University Dashboard";
  const activeModule = MODULES.find((module) => module.id === tab) ?? MODULES[0];
  const ActivePreview = MODULE_PREVIEWS[activeModule.id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const top = root.scrollTop || document.body.scrollTop;
      const total = root.scrollHeight - root.clientHeight;
      setScrollPct(total > 0 ? (top / total) * 100 : 0);

      let current = SECTION_LINKS[0].id;
      let best = Number.POSITIVE_INFINITY;

      SECTION_LINKS.forEach((section) => {
        const element = document.getElementById(section.id);

        if (!element) {
          return;
        }

        const distance = Math.abs(element.getBoundingClientRect().top - 140);

        if (distance < best) {
          best = distance;
          current = section.id;
        }
      });

      setActiveSectionId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isModuleHovered) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTab((previous) => {
        const currentIndex = MODULES.findIndex((module) => module.id === previous);
        const nextIndex = (currentIndex + 1) % MODULES.length;
        return MODULES[nextIndex].id;
      });
    }, 6200);

    return () => window.clearInterval(timerId);
  }, [isModuleHovered]);

  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setHeroParallax({ x: x * 2, y: y * 2 });
  };

  const resetHeroParallax = () => setHeroParallax({ x: 0, y: 0 });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);

    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bh-page">
      <div className="bh-progress" style={{ width: `${scrollPct}%` }} />

      <button className="cs-back bh-back" onClick={() => navigate("/?section=work")}>
        <span className="cs-back-arrow">←</span> All Work
      </button>

      <div className="bh-quicknav">
        {SECTION_LINKS.map((section) => (
          <button
            key={section.id}
            className={`bh-quicknav-item ${activeSectionId === section.id ? "is-active" : ""}`}
            onClick={() => scrollToSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      <section className="bh-hero" onMouseMove={handleHeroMove} onMouseLeave={resetHeroParallax}>
        <div className="bh-hero-inner">
          <div className="bh-hero-category">{caseStudyLabel}</div>

          <h1 className="bh-hero-h1">
            Designing for scale.
            <br />
            A university operations
            <br />
            platform for admissions teams.
          </h1>

          <div className="bh-hero-tags">
            {HERO_TAGS.map((tag) => (
              <span key={tag} className="bh-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="bh-hero-meta">
            {HERO_META.map((item, index) => (
              <div key={item} className="bh-hero-meta-item">
                {index > 0 ? <span className="bh-sep">|</span> : null}
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="bh-hero-summary">
            Designing a multi-module platform for university admissions teams navigating record application volumes,
            staff burnout, and a rapidly changing enrollment market.
          </p>
        </div>

        <div className="bh-ghost-text">ULIO</div>

        <div className="bh-hero-mockup-wrap">
          <AutoImageFrame
            src="/assets/projects/university-ops/hero-showcase.png"
            alt="Ulio university dashboard hero showcase"
            className="bh-hero-image-frame"
          >
            <UniversityHeroPreview parallax={heroParallax} />
          </AutoImageFrame>
        </div>
      </section>

      <section className="bh-stats-section">
        <R>
          <div className="bh-stats-row">
            {STATS.map((stat) => (
              <div key={stat.label} className="bh-stat">
                <div className="bh-stat-num">
                  <CountUp to={stat.value} suffix={stat.suffix ?? ""} />
                </div>
                <div className="bh-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </R>
      </section>

      <div className="bh-rule" />

      <section className="bh-section" id="problem">
        <div className="bh-ghost-num">01</div>
        <R>
          <div className="bh-section-label">Context and Problem</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Higher education
            <br />
            <em>is in crisis.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">
            Application volumes surged 12% year-over-year while admissions staff sizes stayed flat. The result was an
            8-minute review window per application, more missed enrollment targets, and a fragmented tool stack that
            created its own workload.
          </p>
        </R>

        <div className="bh-problem-grid">
          {PROBLEM_CARDS.map((card, index) => (
            <R key={card.num} delay={index * 70}>
              <div className="bh-prob-card">
                <div className="bh-prob-num">{card.num}</div>
                <div className="bh-prob-stat">{card.stat}</div>
                <h3 className="bh-prob-title">{card.title}</h3>
                <p className="bh-prob-body">{card.body}</p>
              </div>
            </R>
          ))}
        </div>

        <R>
          <div className="bh-quote">
            <div className="bh-quote-mark">"</div>
            <blockquote className="bh-quote-text">
              We are drowning in applications but starving for quality connections with students. I need tools that help
              us work smarter, not just faster.
            </blockquote>
            <cite className="bh-quote-cite">Sarah Chen - Admissions Director - Primary Persona</cite>
          </div>
        </R>
      </section>

      <div className="bh-rule" />

      <section className="bh-section bh-section--dark" id="persona">
        <div className="bh-ghost-num bh-ghost-num--inverse">02</div>
        <R>
          <div className="bh-section-label bh-section-label--inv">Who We Designed For</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2 bh-section-h2--inv">
            {PERSONA.name},
            <br />
            <em>Admissions Director.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead bh-section-lead--inv">{PERSONA.summary}</p>
        </R>

        <div className="bh-persona-grid">
          <R>
            <div className="bh-persona-col">
              <div className="bh-persona-col-label">Pain Points</div>
              {PERSONA.painPoints.map((item) => (
                <div key={item} className="bh-persona-item bh-persona-item--pain">
                  <span className="bh-persona-mark-x">x</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </R>

          <R delay={80}>
            <div className="bh-persona-col">
              <div className="bh-persona-col-label">Goals</div>
              {PERSONA.goals.map((item) => (
                <div key={item} className="bh-persona-item bh-persona-item--goal">
                  <span className="bh-persona-mark-a">{"->"}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </R>
        </div>
      </section>

      <section className="bh-section" id="research">
        <div className="bh-ghost-num">03</div>
        <R>
          <div className="bh-section-label">Research and Discovery</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Five methods,
            <br />
            <em>one clear signal.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">
            I led a multi-method research programme grounding every design decision in both qualitative insight and
            quantitative validation across discovery, synthesis, and validation phases.
          </p>
        </R>

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
                {RESEARCH_ROWS.map((row) => (
                  <tr key={row.method}>
                    <td>
                      <strong>{row.method}</strong>
                      <br />
                      <span className="bh-table-sub">{row.sample}</span>
                    </td>
                    <td>{row.learned}</td>
                    <td>{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </R>

        <div className="bh-findings">
          <R>
            <div className="bh-findings-label">Five themes that shaped everything</div>
          </R>
          {FINDINGS.map((finding, index) => (
            <R key={finding.num} delay={index * 60}>
              <div className="bh-finding">
                <div className="bh-finding-num">{finding.num}</div>
                <div className="bh-finding-body">
                  <h3 className="bh-finding-title">{finding.title}</h3>
                  <p className="bh-finding-text">{finding.body}</p>
                </div>
              </div>
            </R>
          ))}
        </div>
      </section>

      <div className="bh-rule" />

      <section className="bh-section" id="strategy">
        <div className="bh-ghost-num">04</div>
        <R>
          <div className="bh-section-label">Design Strategy</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Kano-led build
            <br />
            <em>sequencing.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">
            I used the Kano Model to prioritise the feature set across three build phases so version one delivered real
            value without overbuilding.
          </p>
        </R>

        <div className="bh-kano">
          {KANO_GROUPS.map((group, index) => (
            <R key={group.phase} delay={index * 70}>
              <div
                className={`bh-kano-col ${group.dark ? "bh-kano-col--dark" : group.gold ? "bh-kano-col--gold" : "bh-kano-col--light"}`}
              >
                <div className="bh-kano-phase">{group.phase}</div>
                <div className="bh-kano-sub">{group.sub}</div>
                <div className="bh-kano-items">
                  {group.items.map((item) => (
                    <div key={item} className="bh-kano-item">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </R>
          ))}
        </div>

        <div className="bh-principles-wrap">
          <R>
            <div className="bh-principles-label">Four design principles</div>
          </R>
          {PRINCIPLES.map((principle, index) => (
            <R key={principle.num} delay={index * 60}>
              <div className="bh-principle">
                <div className="bh-principle-n">{principle.num}</div>
                <div>
                  <h3 className="bh-principle-t">{principle.title}</h3>
                  <p className="bh-principle-b">{principle.body}</p>
                </div>
              </div>
            </R>
          ))}
        </div>
      </section>

      <div className="bh-rule" />

      <section className="bh-section" id="modules">
        <div className="bh-ghost-num">05</div>
        <R>
          <div className="bh-section-label">Module Design</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Six modules,
            <br />
            <em>one system.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">
            Each module solves a distinct operational problem. Together they form a unified command center that replaces
            the fragmented admissions stack.
          </p>
        </R>

        <R>
          <div className="bh-tabs">
            {MODULES.map((module) => (
              <button key={module.id} className={`bh-tab ${tab === module.id ? "bh-tab--on" : ""}`} onClick={() => setTab(module.id)}>
                <span className="bh-tab-tag">{module.tag}</span> {module.label}
              </button>
            ))}
          </div>
        </R>

        <div
          className="bh-mod-grid"
          key={activeModule.id}
          onMouseEnter={() => setIsModuleHovered(true)}
          onMouseLeave={() => setIsModuleHovered(false)}
        >
          <R className="bh-mod-left">
            <div className="bh-mod-sub">{activeModule.sub}</div>
            <h3 className="bh-mod-title">{activeModule.title}</h3>
            <p className="bh-mod-body">{activeModule.body}</p>
            <ul className="bh-mod-points">
              {activeModule.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </R>

          <R delay={80} className="bh-mod-right">
            <AutoImageFrame
              src={`/assets/projects/university-ops/module-${activeModule.id}.png`}
              alt={`${activeModule.label} module showcase`}
              className="bh-module-image-frame"
            >
              <ActivePreview />
            </AutoImageFrame>
          </R>
        </div>
      </section>

      <div className="bh-rule" />

      <section className="bh-section" id="challenges">
        <div className="bh-ghost-num">06</div>
        <R>
          <div className="bh-section-label">Design Challenges</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            Four hard
            <br />
            <em>problems solved.</em>
          </h2>
        </R>

        <div className="bh-challenges">
          {CHALLENGES.map((item, index) => (
            <R key={item.num} delay={index * 70}>
              <div className="bh-challenge">
                <div className="bh-challenge-panel">
                  <div className="bh-challenge-label">Challenge {item.num}</div>
                  <h3 className="bh-challenge-title">{item.challengeTitle}</h3>
                  <p className="bh-challenge-body">{item.challengeBody}</p>
                </div>
                <div className="bh-challenge-panel bh-challenge-panel--solution">
                  <div className="bh-challenge-label">Solution</div>
                  <h3 className="bh-challenge-title">{item.solutionTitle}</h3>
                  <p className="bh-challenge-body">{item.solutionBody}</p>
                </div>
              </div>
            </R>
          ))}
        </div>
      </section>

      <section className="bh-section bh-section--dark" id="outcomes">
        <div className="bh-ghost-num bh-ghost-num--inverse">07</div>
        <R>
          <div className="bh-section-label bh-section-label--inv">Outcomes and Impact</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2 bh-section-h2--inv">{caseStudyTitle}</h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead bh-section-lead--inv">
            Projected outcomes were based on usability testing, benchmarking against existing admissions tooling, and
            pilot feedback from university partners during validation.
          </p>
        </R>

        <div className="bh-outcomes">
          {OUTCOMES.map((outcome, index) => (
            <R key={outcome.label} delay={index * 60}>
              <div className="bh-outcome">
                <div className="bh-outcome-num">{outcome.value}</div>
                <div className="bh-outcome-label">{outcome.label}</div>
              </div>
            </R>
          ))}
        </div>

        <div className="bh-scale-wrap">
          <R>
            <div className="bh-scale-label">Why this translates to large-scale products</div>
          </R>
          <R delay={60}>
            <div className="bh-scale-table-wrap">
              <table className="bh-scale-table">
                <thead>
                  <tr>
                    <th>Ulio challenge</th>
                    <th>Analogous at scale</th>
                  </tr>
                </thead>
                <tbody>
                  {SCALE_ROWS.map((row) => (
                    <tr key={row.challenge}>
                      <td>{row.challenge}</td>
                      <td>{row.scale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </R>
        </div>
      </section>

      <section className="bh-section" id="reflections">
        <div className="bh-ghost-num">08</div>
        <R>
          <div className="bh-section-label">Reflections</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            What I would do
            <br />
            <em>differently.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">
            Honest retrospectives are where the strongest design thinking lives. These are the four changes I would make
            if I were starting this program again.
          </p>
        </R>

        <div className="bh-reflections">
          {REFLECTIONS.map((reflection, index) => (
            <R key={reflection.num} delay={index * 60}>
              <div className="bh-reflection">
                <div className="bh-reflection-n">{reflection.num}</div>
                <div>
                  <h3 className="bh-reflection-t">{reflection.title}</h3>
                  <p className="bh-reflection-b">{reflection.body}</p>
                </div>
              </div>
            </R>
          ))}
        </div>
      </section>

      <footer className="bh-footer">
        <div className="bh-footer-ghost">ULIO</div>
        <div className="bh-footer-inner">
          <div className="bh-footer-label">{caseStudyLabel}</div>
          <h2 className="bh-footer-h">Designing systems that reduce human friction.</h2>
          <p className="bh-footer-meta">Senior UX Designer - 2025 - Confidential case study</p>
          <button className="bh-footer-back" onClick={() => navigate("/?section=work")}>
            <span>←</span> Back to Work
          </button>
        </div>
      </footer>
    </div>
  );
}
