import "./bh-ops.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SafeImage from "../../components/SafeImage";

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

const HERO_META = ["Associate UX Designer", "UX Research", "Product Strategy", "2025"];

const COLLAB = [
  { role: "Product", detail: "Roadmap + prioritisation" },
  { role: "Engineering", detail: "Feasibility gates" },
  { role: "Data", detail: "Analytics spec + KPI framework" },
  { role: "University Partners", detail: "Pilot validation" },
];

const STATS = [
  { value: 5, label: "Core modules\ndesigned end-to-end" },
  { value: 8, suffix: "+", label: "Stakeholder interviews\nacross admissions teams" },
  { value: 40, suffix: "+", label: "University admins\nsurveyed in Kano study" },
  { value: 3, suffix: "+", label: "Partner institutions\nin pilot validation" },
];

const PROBLEM_CARDS = [
  {
    num: "01",
    stat: "12%",
    title: "Application Inflation",
    body: "Volumes up 12% YoY. Team size flat. 8 minutes per application.",
  },
  {
    num: "02",
    stat: "5 tools",
    title: "Tool Fragmentation",
    body: "Slate, Salesforce, Zoom, Excel, email. No unified pipeline view.",
  },
  {
    num: "03",
    stat: "2025",
    title: "The Enrollment Cliff",
    body: "Shrinking graduate cohorts. Every lost applicant costs more.",
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
    sample: "n=8 admissions directors",
    icon: "🎤",
    learned: "Directors want dashboards, not reports. Bottlenecks hit at review and yield.",
    impact: "Home became an action-first command centre, not a passive display.",
  },
  {
    method: "Competitive Analysis",
    sample: "Slate, Salesforce, EAB Navigate",
    icon: "🔍",
    learned: "Competitors optimise for data capture, not decision support.",
    impact: "Made Communication a core differentiator, not an afterthought.",
  },
  {
    method: "UX Audit",
    sample: "Existing admissions flows",
    icon: "🧪",
    learned: "Bulk flows had too many steps. Average task completion: 62%.",
    impact: "Campaign creation reduced to 3 guided steps with smarter segmentation.",
  },
  {
    method: "Kano Model Survey",
    sample: "n=40 university admins",
    icon: "📊",
    learned: "Analytics = Performance feature. AI matching = clear Delighter.",
    impact: "MVP sequenced around must-haves. AI reserved for phase 3.",
  },
  {
    method: "Market Data Analysis",
    sample: "2025 industry reports",
    icon: "📈",
    learned: "60% of students expect same-day replies. 67% of counselors lack essential tools.",
    impact: "Validated multi-sided platform direction and sharpened communication priorities.",
  },
];

const FINDINGS = [
  {
    num: "01",
    title: "Visibility before action",
    body: "Every metric must point to a decision, not just a number.",
  },
  {
    num: "02",
    title: "Communication is a bottleneck",
    body: "Bulk outreach was the highest-friction workflow across every office studied.",
  },
  {
    num: "03",
    title: "Analytics must surface decisions",
    body: "Which programme is under target? Which segment needs outreach? What next?",
  },
  {
    num: "04",
    title: "Community builds yield",
    body: "Engagement with university content measurably increased enrollment intent.",
  },
  {
    num: "05",
    title: "Trust is the admission price",
    body: "No institution shares student data without visible compliance and verification.",
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
    body: "Every metric is an entry point into a workflow, never decoration.",
  },
  {
    num: "02",
    title: "Trust by Default",
    body: "FERPA and GDPR compliance are primary UX concerns, not afterthoughts.",
  },
  {
    num: "03",
    title: "Progressive Complexity",
    body: "Officers see tasks. Directors unlock analytics. Same system, different entry points.",
  },
  {
    num: "04",
    title: "Reduce Load at Peak Stress",
    body: "Application season is maximum pressure. One-click actions cut cognitive load.",
  },
];

const MODULES = [
  {
    id: "home",
    img: "Home page.png",
    tag: "01",
    label: "Home",
    sub: "The Command Centre",
    title: "Home",
    body: "Eliminates the daily 15-minute orientation tax across email, Slate, and spreadsheets.",
    points: [
      "KPI bar above the fold. No scrolling required",
      "Quick Actions for the two most frequent tasks",
      "40% faster time-to-first-action in usability testing",
      "Upcoming Events as a live work queue",
    ],
  },
  {
    id: "analytics",
    img: "Analytics.png",
    tag: "02",
    label: "Analytics",
    sub: "From Data to Decisions",
    title: "Analytics",
    body: "Dashboards get built, then ignored. The challenge was decisions, not more data.",
    points: [
      "Funnel stages link directly to pre-filtered campaign audiences",
      "Milestone alerts prompt outreach at the right moment",
      "Demographics lightweight enough for any officer to act on",
      "Top Pages: views, time, bounce. Nothing else",
    ],
  },
  {
    id: "management",
    img: "Management_Scholarship.png",
    tag: "03",
    label: "Management",
    sub: "Institutional Identity",
    title: "Management",
    body: "How a university presents itself and maintains the catalogue that drives applications.",
    points: [
      "Tabbed profile mirrors how students research universities",
      "Structured fact pairs for fast programme comparison",
      "Earning-potential ranges reduce financial anxiety",
      "AI-assisted programme creation for stretched teams",
    ],
  },
  {
    id: "communication",
    img: "Communication_events.png",
    tag: "04",
    label: "Communication",
    sub: "Closing the Engagement Gap",
    title: "Communication",
    body: "Students expect same-day responses. Most offices still run on 24-hour cycles.",
    points: [
      "Dual-metric event cards: views paired with RSVPs",
      "Channel tags benchmark email vs WhatsApp performance",
      "Campaign cards show sent, opened, clicked at a glance",
      "Draft/Published gates prevent premature sends",
    ],
  },
  {
    id: "community",
    img: "Community.png",
    tag: "05",
    label: "Community",
    sub: "Building Yield Through Belonging",
    title: "Community",
    body: "Students who engage with university content are measurably more likely to enroll.",
    points: [
      "Four-audience tabs: content, people, universities, events",
      "Rich post creation without a separate CMS",
      "Lightweight reactions as engagement signal",
    ],
  },
];

const CHALLENGES = [
  {
    num: "01",
    challengeTitle: "Two mental models, one interface",
    challengeBody: "Officers need fast tasks. Directors need strategic visibility.",
    solutionTitle: "Progressive disclosure as architecture",
    solutionBody: "Core workflows front and centre. Analytics and config behind intentional moves.",
  },
  {
    num: "02",
    challengeTitle: "Analytics were decorative, not actionable",
    challengeBody: "Directors reviewed dashboards, nodded, and left without acting.",
    solutionTitle: "Every metric gets an exit ramp",
    solutionBody: "Each data point links to a filtered audience, milestone, or campaign.",
    rejected: "Direction we killed: a PowerBI-style reporting module. Too passive, too much cognitive load, no path to action.",
  },
  {
    num: "03",
    challengeTitle: "Verification killed launch momentum",
    challengeBody: "KYC friction reduced profile completion and delayed institutional go-live.",
    solutionTitle: "Verification as onboarding, not gatekeeping",
    solutionBody: "Guided KYC with progress, contextual help, and post-approval checklists.",
  },
  {
    num: "04",
    challengeTitle: "Communication module scope creep",
    challengeBody: "Events, campaigns, broadcasts, and DMs all competed for one nav slot.",
    solutionTitle: "Separate jobs, separate surfaces",
    solutionBody: "Engagement creation in Communication. Real-time conversation in Messages.",
  },
];

const OUTCOMES = [
  { value: "~40%", label: "Faster time-to-first-action", sub: "Usability benchmark vs. current admissions tooling" },
  { value: "3×", label: "Campaign creation speed", sub: "vs. manual email outreach. 8 participant sessions" },
  { value: "8→5m", label: "Application review time", sub: "Filtering and bulk decision tooling. Usability test" },
  { value: "<10%", label: "Profile drop-off rate", sub: "Approved → live, confirmed in pilot validation" },
];

const SCALE_ROWS = [
  {
    challenge: "Multiple user roles, conflicting needs",
    scale: "Power users vs. casual users, operators vs. admins. Universal platform tension.",
  },
  {
    challenge: "Complex data without overwhelming non-technical users",
    scale: "Decision support over raw reporting. The same challenge in every analytics product.",
  },
  {
    challenge: "Three-sided marketplace with cross-role dependencies",
    scale: "Actions in one role surface as experiences in another. Systems thinking is non-negotiable.",
  },
  {
    challenge: "KYC and compliance as UX, not just engineering",
    scale: "Trust, identity, and compliance are core product experiences at any mature platform.",
  },
  {
    challenge: "Feature sequencing under real constraints",
    scale: "The Kano roadmap maps directly to quarterly planning and MVP decisions at any org.",
  },
];

const REFLECTIONS = [
  {
    num: "01",
    title: "Run Kano earlier",
    body: "Committing to analytics directions before the Kano survey created avoidable rework.",
  },
  {
    num: "02",
    title: "Design cross-role flows from day one",
    body: "Building the dashboard in isolation from student and counselor flows surfaced tensions late.",
  },
  {
    num: "03",
    title: "Jobs, not features, from kickoff",
    body: "Every stakeholder had legitimate requests. JTBD framing would have contained scope earlier.",
  },
  {
    num: "04",
    title: "Invest in migration, not just design",
    body: "The best interface fails if teams never leave Slate or Salesforce.",
  },
];

const PREVIEW_NAV_ITEMS = ["Home", "Analytics", "Management", "Communication", "Community"];

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
        <div className="bh-hero-float-value">5</div>
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

const MODULE_PREVIEWS = {
  home: HomePreview,
  analytics: AnalyticsPreview,
  management: ManagementPreview,
  communication: CommunicationPreview,
  community: CommunityPreview,
};

const ULIO_BRAND_TAGS = ["AI Counselor", "Resume Builder", "Career Forecast"];
const ULIO_PALETTE = [
  "/assets/projects/ulio-usecase/1 Red Background.svg",
  "/assets/projects/ulio-usecase/2 Blue Background.svg",
  "/assets/projects/ulio-usecase/3 teal Background.svg",
  "/assets/projects/ulio-usecase/4 Dark Blue Background.svg",
  "/assets/projects/ulio-usecase/5 Peach Background.svg",
  "/assets/projects/ulio-usecase/6 white Background.svg",
];

function UlioBrandSection() {
  return (
    <section style={{ padding: "0 2.5rem 2.5rem", maxWidth: "1100px", margin: "0 auto" }}>
      <section className="ulio-brand-cards-wrap">
        <section className="ulio-brand-cards">
          <div className="ulio-brand-card ulio-brand-card--red" style={{ background: "#62109F" }}>
            <div className="ulio-brand-logo-center">
              <img src="/assets/projects/ulio-usecase/ulio-white-logo.svg" alt="Ulio" className="ulio-brand-logo-img" />
            </div>
            <div className="ulio-brand-tags">
              {ULIO_BRAND_TAGS.map((tag, i) => (
                <span key={tag} className={`ulio-chip ulio-chip--brand ulio-chip--brand-${i + 1}`}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="ulio-brand-card ulio-brand-card--dark">
            <div className="ulio-brand-grid" aria-hidden="true">
              <img src="/assets/projects/ulio-usecase/red.svg" alt="" className="ulio-brand-dot is-red" />
              <img src="/assets/projects/ulio-usecase/blue.svg" alt="" className="ulio-brand-dot is-blue" />
              <img src="/assets/projects/ulio-usecase/teal.svg" alt="" className="ulio-brand-dot is-teal" />
              <img src="/assets/projects/ulio-usecase/purp.svg" alt="" className="ulio-brand-dot is-purple" />
            </div>
            <div className="ulio-brand-logo-center">
              <img src="/assets/projects/ulio-usecase/ulio-white-logo.svg" alt="Ulio" className="ulio-brand-logo-img" />
            </div>
          </div>
        </section>
      </section>

      <section className="ulio-typography" style={{ marginTop: "2rem" }}>
        <div className="ulio-typography-grid">
          <div className="ulio-typography-hero" style={{ color: "#62109F" }}>Aa</div>
          <div className="ulio-typography-copy">
            <p>"Poppins is a geometric sans-serif with clean, friendly proportions inspired by international typographic style. Its balanced structure and excellent readability make it a versatile choice for both display and body text across digital interfaces."</p>
            <h3>Poppins</h3>
            <span>Regular · Medium · Semibold · Bold</span>
          </div>
        </div>
        <div className="ulio-palette">
          {ULIO_PALETTE.map((src, i) => (
            <div key={i} className="ulio-swatch">
              <img src={src} alt="" className="ulio-swatch-img" />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

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

      <button className="cs-back" onClick={() => navigate("/?section=work")}>
        <span className="cs-back-arrow">←</span> All Work
      </button>

      <section className="bh-hero" onMouseMove={handleHeroMove} onMouseLeave={resetHeroParallax}>
        <div className="bh-hero-inner">
          <div className="bh-ulio-pill">
            <span className="bh-ulio-pill-logo">U</span>
            <span className="bh-ulio-pill-brand">Ulio University</span>
            <span className="bh-ulio-pill-divider" />
            <span className="bh-ulio-pill-title">Operations Platform</span>
          </div>

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
            A command-centre dashboard for university admissions teams. Four live KPIs above the fold, one-click Quick
            Actions, and an Upcoming Events queue. Every signal and next step visible without a spreadsheet.
          </p>
        </div>

        <div className="bh-ghost-text">ULIO</div>

        <div className="bh-hero-mockup-wrap">
          <div className="bh-image-frame bh-hero-image-frame">
            <img
              src="/assets/projects/university-ops/Home page.png"
              alt="Ulio university dashboard home screen"
              className="bh-image-frame-img"
            />
          </div>
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

      <div className="bh-collab-strip">
        <span className="bh-collab-label">Working with</span>
        {COLLAB.map((c) => (
          <div key={c.role} className="bh-collab-chip">
            <span className="bh-collab-role">{c.role}</span>
            <span className="bh-collab-detail">{c.detail}</span>
          </div>
        ))}
      </div>

      <UlioBrandSection />

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
          <p className="bh-section-lead">Volumes up 12% YoY. Teams flat. Tool count rising. Enrollment targets missed anyway.</p>
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

      <section className="bh-section bh-section--light" id="persona">
        <div className="bh-ghost-num">02</div>
        <R>
          <div className="bh-section-label">Who We Designed For</div>
        </R>
        <R delay={60}>
          <h2 className="bh-section-h2">
            One primary user.
            <br />
            <em>Five compounding problems.</em>
          </h2>
        </R>
        <R delay={120}>
          <p className="bh-section-lead">
            Sarah Chen shaped every module. Her five pain points became the product brief.
          </p>
        </R>

        <R delay={160}>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "start" }}>
            {/* Avatar card */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "2rem", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginBottom: "1.2rem" }}>👩‍💼</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1D1D1F", marginBottom: "0.25rem" }}>{PERSONA.name}</div>
              <div style={{ fontSize: "0.82rem", color: "#6E6E80", marginBottom: "1rem", lineHeight: 1.5 }}>Age 38 · Admissions Director · Mid-sized state university · 12 yrs in higher ed · Team of 15</div>
              <p style={{ fontSize: "0.85rem", color: "#444", lineHeight: 1.65 }}>
                Juggling record application volumes across five disconnected tools, with no unified pipeline view and no early warning on enrollment targets.
              </p>
            </div>

            {/* Pain / Goal columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.75rem", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6E6E80", marginBottom: "1.25rem" }}>Pain Points</div>
                {PERSONA.painPoints.map((item) => (
                  <div key={item} style={{ background: "#FFF5F5", borderLeft: "3px solid #e84040", padding: "10px 14px", borderRadius: "0 8px 8px 0", fontSize: "0.83rem", marginBottom: "0.6rem", color: "#333", lineHeight: 1.5 }}>
                    😣 {item}
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.75rem", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6E6E80", marginBottom: "1.25rem" }}>Goals</div>
                {PERSONA.goals.map((item) => (
                  <div key={item} style={{ background: "#F0FFF4", borderLeft: "3px solid #00C853", padding: "10px 14px", borderRadius: "0 8px 8px 0", fontSize: "0.83rem", marginBottom: "0.6rem", color: "#333", lineHeight: 1.5 }}>
                    🎯 {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </R>
      </section>

      <section className="bh-section" id="research">
        <div className="bh-ghost-num">03</div>

        <div className="bh-rmethod">
          <div className="bh-rmethod-header">
            <R><div className="bh-section-label">Research and Discovery</div></R>
            <R delay={60}>
              <h2 className="bh-section-h2">
                Five methods.
                <br />
                <em>One clear signal.</em>
              </h2>
            </R>
            <R delay={120}>
              <p className="bh-section-lead">Five methods. One clear mandate: fix the broken admissions stack.</p>
            </R>
          </div>

          <div className="bh-rf-track">
            {RESEARCH_ROWS.map((row, i) => (
              <R key={row.method} delay={i * 70}>
                <div className="bh-rf-step">
                  <div className="bh-rf-dot">
                    <span className="bh-rf-dot-num">0{i + 1}</span>
                  </div>
                  <div className="bh-rf-step-body">
                    <div className="bh-rf-method">{row.method}</div>
                    <span className="bh-rf-pill">{row.sample}</span>
                  </div>
                </div>
              </R>
            ))}
          </div>

          <R delay={220}>
            <div className="bh-rf-signal">
              <span className="bh-rf-signal-label">Research Signal</span>
              <p className="bh-rf-signal-text">
                "Admissions teams don't lack data. They lack a tool that connects data to the next action. Every dashboard we audited had the same gap: numbers with no exit ramp."
              </p>
            </div>
          </R>
        </div>

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
          <p className="bh-section-lead">Kano sequenced the MVP so v1 delivered real value without overbuilding.</p>
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
          <div className="bh-principles-grid">
            {PRINCIPLES.map((principle, index) => (
              <R key={principle.num} delay={index * 60}>
                <div className="bh-principle">
                  <span className="bh-principle-n">{principle.num}</span>
                  <h3 className="bh-principle-t">{principle.title}</h3>
                  <p className="bh-principle-b">{principle.body}</p>
                </div>
              </R>
            ))}
          </div>
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
          <p className="bh-section-lead">Six modules. One system. Everything the fragmented stack couldn't be.</p>
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
              src={`/assets/projects/university-ops/${encodeURIComponent(activeModule.img)}`}
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

        <div className="bh-chal-list">
          {CHALLENGES.map((item, index) => (
            <R key={item.num} delay={index * 70}>
              <div className="bh-chal-row">
                <div className="bh-chal-row-index">
                  <span className="bh-chal-row-num">{item.num}</span>
                </div>
                <div className="bh-chal-row-problem">
                  <span className="bh-chal-row-kicker">The Challenge</span>
                  <h3 className="bh-chal-row-title">{item.challengeTitle}</h3>
                  <p className="bh-chal-row-body">{item.challengeBody}</p>
                </div>
                <div className="bh-chal-row-divider">
                  <span className="bh-chal-row-arrow">→</span>
                </div>
                <div className="bh-chal-row-solution">
                  <span className="bh-chal-row-sol-kicker">How We Solved It</span>
                  <h4 className="bh-chal-row-sol-title">{item.solutionTitle}</h4>
                  <p className="bh-chal-row-sol-body">{item.solutionBody}</p>
                  {item.rejected ? (
                    <div className="bh-chal-row-killed">{item.rejected}</div>
                  ) : null}
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
          <p className="bh-section-lead bh-section-lead--inv">Measured against usability testing, benchmarked tooling, and pilot feedback from partner institutions.</p>
        </R>

        <div className="bh-outcomes-ks">
          <div className="bh-oks-dots">
            <span className="bh-oks-dot bh-oks-dot--purple" />
            <span className="bh-oks-dot bh-oks-dot--light" />
            <span className="bh-oks-dot bh-oks-dot--dim" />
          </div>
          <div className="bh-oks-intro">
            <p className="bh-oks-heading">Design KPIs &amp; Validation</p>
            <p className="bh-oks-sub">Validated through usability testing, benchmarked against incumbent tooling, confirmed in pilot with university partners.</p>
          </div>
          <div className="bh-oks-grid">
            <div className="bh-oks-cell bh-oks-cell--stat">
              <span className="bh-oks-value">{OUTCOMES[0].value}</span>
              <span className="bh-oks-title">{OUTCOMES[0].label}</span>
              <span className="bh-oks-label">{OUTCOMES[0].sub}</span>
            </div>
            <div className="bh-oks-cell" />
            <div className="bh-oks-cell" />
            <div className="bh-oks-cell" />
            <div className="bh-oks-cell bh-oks-cell--stat">
              <span className="bh-oks-value">{OUTCOMES[1].value}</span>
              <span className="bh-oks-title">{OUTCOMES[1].label}</span>
              <span className="bh-oks-label">{OUTCOMES[1].sub}</span>
            </div>
            <div className="bh-oks-cell" />
            <div className="bh-oks-cell" />
            <div className="bh-oks-cell" />
            <div className="bh-oks-cell bh-oks-cell--stat">
              <span className="bh-oks-value">{OUTCOMES[2].value}</span>
              <span className="bh-oks-title">{OUTCOMES[2].label}</span>
              <span className="bh-oks-label">{OUTCOMES[2].sub}</span>
            </div>
          </div>
        </div>

        <R delay={60}>
          <div className="bh-oks-fourth">
            <span className="bh-oks-fourth-value">{OUTCOMES[3].value}</span>
            <div>
              <div className="bh-oks-fourth-title">{OUTCOMES[3].label}</div>
              <div className="bh-oks-fourth-sub">{OUTCOMES[3].sub}</div>
            </div>
          </div>
        </R>

        <R delay={100}>
          <div className="bh-scale-quote">
            <span className="bh-scale-quote-label">Why this transfers</span>
            <p className="bh-scale-quote-text">
              "Multi-role systems design, actionable analytics, progressive disclosure, and trust infrastructure. These aren't EdTech problems. They are the problems every mature platform faces."
            </p>
          </div>
        </R>
      </section>

      <section className="bh-section bh-section--black" id="reflections">
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
          <p className="bh-section-lead">Four things I would do differently if I started this again.</p>
        </R>

        <div className="bh-refl-strip">
          {REFLECTIONS.map((reflection, index) => (
            <R key={reflection.num} delay={index * 70}>
              <div className="bh-refl-item">
                <div className="bh-refl-item-num">{reflection.num}</div>
                <h3 className="bh-refl-item-title">{reflection.title}</h3>
                <p className="bh-refl-item-body">{reflection.body}</p>
              </div>
            </R>
          ))}
        </div>
      </section>

      <footer className="bh-footer">
        <div className="bh-footer-ghost">ULIO</div>
        <div className="bh-footer-inner">
          <div className="bh-footer-left">
            <div className="bh-footer-label">{caseStudyLabel}</div>
            <h2 className="bh-footer-h">Designing systems that reduce human friction.</h2>
            <div className="bh-footer-tags">
              <span className="bh-footer-tag">Associate UX Designer</span>
              <span className="bh-footer-tag">2025</span>
              <span className="bh-footer-tag">Confidential</span>
            </div>
          </div>
          <div className="bh-footer-right">
            <div className="bh-footer-stats">
              <div className="bh-footer-stat">
                <div className="bh-footer-stat-val">5</div>
                <div className="bh-footer-stat-label">Modules designed</div>
              </div>
              <div className="bh-footer-stat">
                <div className="bh-footer-stat-val">8+</div>
                <div className="bh-footer-stat-label">Stakeholder interviews</div>
              </div>
              <div className="bh-footer-stat">
                <div className="bh-footer-stat-val">40+</div>
                <div className="bh-footer-stat-label">Admins surveyed</div>
              </div>
            </div>
            <button className="bh-footer-back" onClick={() => navigate("/?section=work")}>
              <span>←</span> Back to Work
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
