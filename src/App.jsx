import { useEffect, useMemo, useState } from "react";
import { HashRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { aboutContent, brandNames, heroObjects, projects, resumeBlocks } from "./siteData";

const filters = ["All", "Product Design", "UX Case Study"];

function TopNav() {
  const navigate = useNavigate();

  const goTo = (section) => {
    navigate(`/?section=${section}`);
  };

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <button className="brand-button" onClick={() => navigate("/")}>
          BHAVYA DHARMANI
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
            <img
              key={item.id}
              className={`hero-object hero-object-${item.id}`}
              src={item.src}
              alt={item.alt}
              loading="lazy"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.w}px`,
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

        <div className="brand-strip">
          {brandNames.map((name) => (
            <span key={name}>{name}</span>
          ))}
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
          <img src={aboutContent.image} alt="Bhavya Dharmani portrait" loading="lazy" />
          <div>
            <p>{aboutContent.intro}</p>
            <p>{aboutContent.details}</p>
            <div className="about-actions">
              <Link to="/resume">View Resume</Link>
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
        <img src={project.cover} alt={project.shortTitle} loading="lazy" />
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
        <img src={project.hero} alt={project.shortTitle} loading="lazy" />
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
        {project.gallery.map((image) => (
          <img key={image} src={image} alt={`${project.shortTitle} visual`} loading="lazy" />
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
      <h1>Bhavya Dharmani</h1>
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
