import { useEffect, useMemo, useState } from "react";
import { HashRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { aboutContent, brandNames, heroObjects, projects, resumeBlocks } from "./siteData";

const filters = ["All", "Product Design", "UX Case Study"];
const HERO_IMAGE_SCALE = 0.78;
const BASE_URL = import.meta.env.BASE_URL || "/";
const withBase = (path) => {
  if (!path || /^https?:\/\//.test(path) || path.startsWith("data:")) {
    return path;
  }
  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
};
const RESUME_PDF_PATH = withBase("assets/resume/Akanksha-Mahangere-Resume.pdf");

const resolveImage = (image) => {
  if (typeof image === "string") {
    return { primary: withBase(image), fallback: null };
  }

  if (!image || typeof image !== "object") {
    return { primary: "", fallback: null };
  }

  const local = withBase(image.local || "");
  const remote = image.remote || "";
  const primary = local || remote;
  const fallback = image.remote && image.remote !== primary ? image.remote : null;

  return { primary, fallback };
};

function SafeImage({ image, alt, className, style, loading = "lazy" }) {
  const { primary, fallback } = useMemo(() => resolveImage(image), [image]);
  const [src, setSrc] = useState(primary);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setSrc(primary);
    setFallbackUsed(false);
    setHasFailed(false);
  }, [primary, fallback]);

  const handleError = () => {
    if (!fallbackUsed && fallback) {
      setSrc(fallback);
      setFallbackUsed(true);
      return;
    }

    setHasFailed(true);
  };

  if (!src || hasFailed) {
    return <div className={`img-fallback ${className || ""}`.trim()} style={style} aria-label={alt} role="img" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      onError={handleError}
    />
  );
}

function TopNav() {
  const navigate = useNavigate();

  const goTo = (section) => {
    navigate(`/?section=${section}`);
  };

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <button className="brand-button" onClick={() => navigate("/")}>
          AKANKSHA MAHANGERE
        </button>
        <nav className="top-links" aria-label="Main navigation">
          <button onClick={() => goTo("work")}>Work</button>
          <button onClick={() => goTo("about")}>About</button>
          <button onClick={() => navigate("/resume")}>Resume</button>
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  const location = useLocation();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const section = new URLSearchParams(location.search).get("section");
    if (!section) {
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.search]);

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const handleCanvasMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y });
  };

  const handleCanvasLeave = () => setMouse({ x: 0, y: 0 });

  return (
    <>
      <section className="hero" onMouseMove={handleCanvasMove} onMouseLeave={handleCanvasLeave}>
        {heroObjects.map((item, index) => {
          const tx = mouse.x * item.depth;
          const ty = mouse.y * item.depth;
          const rotation = item.rotate + mouse.x * 3;

          return (
            <SafeImage
              key={item.id}
              image={item.src}
              className={`hero-object hero-object-${item.id}`}
              alt={item.alt}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${Math.round(item.w * HERO_IMAGE_SCALE)}px`,
                transform: `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) rotate(${rotation}deg)`,
                animationDelay: `${index * 0.13}s`,
              }}
            />
          );
        })}

        <div className="hero-title-wrap">
          <p className="hero-left-lines">
            UI/UX DESIGN
            <br />
            WEB DESIGN
            <br />
            GRAPHIC DESIGN
          </p>
          <h1>
            <span>Creative</span>
            <span>Designer</span>
          </h1>
          <p className="hero-right-lines">
            TURNING IDEAS INTO POWERFUL
            <br />
            VISUALS &amp; INTUITIVE DIGITAL
            <br />
            EXPERIENCES
          </p>
        </div>

        <div className="brand-strip" aria-label="Client logos">
          <div className="brand-track">
            {[...brandNames, ...brandNames].map((name, index) => (
              <span key={`${name}-${index}`}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-top">
          <p>Selected Work</p>
          <h2>Case Studies</h2>
        </div>

        <div className="filter-row">
          {filters.map((filter) => (
            <button
              className={filter === activeFilter ? "is-active" : ""}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="section-top">
          <p>About</p>
          <h2>Design with intent.</h2>
        </div>
        <div className="about-grid">
          <SafeImage image={aboutContent.image} alt="Akanksha Mahangere portrait" />
          <div>
            <p>{aboutContent.intro}</p>
            <p>{aboutContent.details}</p>
            <div className="about-actions">
              <Link to="/resume">View Resume</Link>
              <a href={RESUME_PDF_PATH} download>
                Download PDF
              </a>
              <a href="mailto:hello@itsbd.design">Say Hello</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project }) {
  const [transformStyle, setTransformStyle] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 12;
    const rotateX = (0.5 - y) * 10;
    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const onLeave = () => setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  return (
    <Link
      to={`/${project.slug}`}
      className="project-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform: transformStyle }}
    >
      <div className="project-image-wrap">
        <SafeImage image={project.cover} alt={project.shortTitle} />
      </div>
      <div className="project-info">
        <p>
          {project.category} · {project.year}
        </p>
        <h3>{project.title}</h3>
        <div className="project-cta">
          <span>Open case study</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}

function CaseStudyPage({ slug }) {
  const navigate = useNavigate();
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const nextProject = projects.find((entry) => entry.slug !== slug);

  return (
    <article className="case-page">
      <button className="back-pill" onClick={() => navigate("/?section=work")}>
        Back to Work
      </button>
      <p className="case-meta">
        {project.category} · {project.year}
      </p>
      <h1>{project.title}</h1>
      <p className="case-summary">{project.summary}</p>

      <div className="case-main-image">
        <SafeImage image={project.hero} alt={project.shortTitle} />
      </div>

      <div className="case-columns">
        <section>
          <h2>Challenge</h2>
          <p>{project.challenge}</p>
        </section>
        <section>
          <h2>Solution</h2>
          <p>{project.solution}</p>
        </section>
      </div>

      <section className="impact-section">
        <h2>Outcome</h2>
        <div className="impact-grid">
          {project.impact.map((metric) => (
            <article key={metric}>{metric}</article>
          ))}
        </div>
      </section>

      <section className="gallery-grid">
        {project.gallery.map((image, index) => (
          <SafeImage
            key={`${project.slug}-gallery-${index}`}
            image={image}
            alt={`${project.shortTitle} visual ${index + 1}`}
          />
        ))}
      </section>

      {nextProject ? (
        <Link className="next-case-link" to={`/${nextProject.slug}`}>
          Next Case Study: {nextProject.shortTitle}
        </Link>
      ) : null}
    </article>
  );
}

function ResumePage() {
  return (
    <section className="resume-page">
      <p className="resume-kicker">Resume</p>
      <h1>Akanksha Mahangere</h1>
      <p className="resume-summary">
        Creative designer focused on product interfaces, brand-aligned visual systems, and conversion-ready web
        experiences.
      </p>

      <div className="resume-grid">
        {resumeBlocks.map((block) => (
          <article key={block.title}>
            <h2>{block.title}</h2>
            <ul>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="resume-actions">
        <a href={RESUME_PDF_PATH} download>
          Download Resume PDF
        </a>
        <a href="mailto:hello@itsbd.design">Contact</a>
        <Link to="/?section=work">View Work</Link>
      </div>
    </section>
  );
}

function Layout() {
  return (
    <div className="site">
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/operations-dasboard" element={<CaseStudyPage slug="operations-dasboard" />} />
          <Route path="/operations-dashboard" element={<CaseStudyPage slug="operations-dasboard" />} />
          <Route path="/pl-case-study" element={<CaseStudyPage slug="pl-case-study" />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">Designed and developed in React.</footer>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}

export default App;
