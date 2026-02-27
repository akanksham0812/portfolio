import { useEffect, useMemo, useRef, useState } from "react";
import { HashRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { aboutContent, brandNames, heroObjects, resumeBlocks } from "./siteData";
import {
  getProjectBySlug,
  getProjectPassword,
  isProjectPasswordProtected,
  projectRoutes,
  projects,
} from "./projects/runtime";
import SafeImage from "./components/SafeImage";
import { withBase } from "./utils/assetPaths";
import { UlioUsecasePage } from "./projects/template/ulioUsecase";
import { SainsburyUsecasePage } from "./projects/template/sainsburyUsecase";

const filters = ["All", "Product Design", "UX Case Study"];
const HERO_IMAGE_SCALE = 0.7;
const RESUME_PDF_PATH = withBase("assets/resume/Akanksha-Mahangere-Resume.pdf");
const CONTACT_EMAIL = "akanksha.ux8@gmail.com";
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
const LINKEDIN_URL = "https://www.linkedin.com/in/akankshamahangare/";
const CONTACT_TICKER_ITEMS = [
  "I annotate before I animate",
  "Less guesswork, more user clarity",
  "I turn feedback into flow",
  "Design that survives handoff",
];
const CONTACT_BALL_RADII = [22, 24, 22, 34, 22, 24, 22];
const PROJECT_UNLOCK_PREFIX = "unlocked-project:";

const getProjectUnlockState = (slug) => {
  if (!isProjectPasswordProtected(slug)) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(`${PROJECT_UNLOCK_PREFIX}${slug}`) === "1";
  } catch {
    return false;
  }
};

const saveProjectUnlockState = (slug) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(`${PROJECT_UNLOCK_PREFIX}${slug}`, "1");
  } catch {
    // Ignore storage failures and keep the in-memory unlock.
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, progress) => start + (end - start) * progress;

function InteractiveBallField() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const stateRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return undefined;
    }

    const state = {
      width: 0,
      height: 0,
      balls: [],
      cueIndex: 3,
      pointer: {
        active: false,
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
      },
    };
    stateRef.current = state;

    const initializeBalls = () => {
      const spacing = 11;
      const totalWidth =
        CONTACT_BALL_RADII.reduce((sum, radius) => sum + radius * 2, 0) + spacing * (CONTACT_BALL_RADII.length - 1);
      const startX = (state.width - totalWidth) / 2;
      const baseline = state.height - 42;

      let cursor = startX;
      state.balls = CONTACT_BALL_RADII.map((radius, index) => {
        cursor += radius;
        const ball = {
          x: cursor,
          y: baseline - (index === state.cueIndex ? 34 : 0),
          vx: 0,
          vy: 0,
          r: radius,
        };
        cursor += radius + spacing;
        return ball;
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      state.width = width;
      state.height = height;
      initializeBalls();
    };

    const drawBall = (ball, isCue) => {
      const gradient = ctx.createRadialGradient(
        ball.x - ball.r * 0.35,
        ball.y - ball.r * 0.35,
        ball.r * 0.2,
        ball.x,
        ball.y,
        ball.r,
      );
      gradient.addColorStop(0, isCue ? "#ffb54e" : "#ff9430");
      gradient.addColorStop(1, isCue ? "#d9501d" : "#e65620");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#311306";
      ctx.lineWidth = Math.max(1.3, ball.r * 0.08);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r * 0.98, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = Math.max(1, ball.r * 0.06);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r * 0.96, Math.PI * 0.17, Math.PI * 1.83);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r * 0.96, Math.PI * 1.17, Math.PI * 0.83, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ball.x - ball.r * 0.48, ball.y, ball.r * 0.8, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ball.x + ball.r * 0.48, ball.y, ball.r * 0.8, Math.PI * 0.65, Math.PI * 1.35);
      ctx.stroke();

      if (isCue) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
        ctx.beginPath();
        ctx.arc(ball.x - ball.r * 0.28, ball.y - ball.r * 0.36, ball.r * 0.17, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const getPoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onPointerDown = (event) => {
      const point = getPoint(event);
      const cueBall = state.balls[state.cueIndex];

      if (!cueBall) {
        return;
      }

      const dx = point.x - cueBall.x;
      const dy = point.y - cueBall.y;

      if (Math.hypot(dx, dy) > cueBall.r + 16) {
        return;
      }

      state.pointer.active = true;
      state.pointer.x = point.x;
      state.pointer.y = point.y;
      state.pointer.lastX = point.x;
      state.pointer.lastY = point.y;
      setIsDragging(true);
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!state.pointer.active) {
        return;
      }

      const point = getPoint(event);
      state.pointer.x = point.x;
      state.pointer.y = point.y;
    };

    const releasePointer = () => {
      state.pointer.active = false;
      setIsDragging(false);
    };

    const physicsStep = () => {
      const gravity = 0.22;
      const damping = 0.993;
      const wallBounce = 0.86;
      const floor = state.height - 2;
      const cueBall = state.balls[state.cueIndex];

      if (cueBall && state.pointer.active) {
        const clampedX = clamp(state.pointer.x, cueBall.r, state.width - cueBall.r);
        const clampedY = clamp(state.pointer.y, cueBall.r, state.height - cueBall.r);
        cueBall.vx = (clampedX - state.pointer.lastX) * 0.44;
        cueBall.vy = (clampedY - state.pointer.lastY) * 0.44;
        cueBall.x = clampedX;
        cueBall.y = clampedY;
        state.pointer.lastX = clampedX;
        state.pointer.lastY = clampedY;
      }

      for (let index = 0; index < state.balls.length; index += 1) {
        const ball = state.balls[index];
        const isDraggedCue = state.pointer.active && index === state.cueIndex;

        if (isDraggedCue) {
          continue;
        }

        ball.vy += gravity;
        ball.vx *= damping;
        ball.vy *= damping;
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.r < 0) {
          ball.x = ball.r;
          ball.vx *= -wallBounce;
        } else if (ball.x + ball.r > state.width) {
          ball.x = state.width - ball.r;
          ball.vx *= -wallBounce;
        }

        if (ball.y - ball.r < 0) {
          ball.y = ball.r;
          ball.vy *= -wallBounce;
        } else if (ball.y + ball.r > floor) {
          ball.y = floor - ball.r;
          ball.vy *= -wallBounce;
          ball.vx *= 0.985;
        }
      }

      for (let i = 0; i < state.balls.length; i += 1) {
        for (let j = i + 1; j < state.balls.length; j += 1) {
          const a = state.balls[i];
          const b = state.balls[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          let distance = Math.hypot(dx, dy);
          const minDistance = a.r + b.r;

          if (distance >= minDistance) {
            continue;
          }

          if (distance === 0) {
            distance = 0.0001;
          }

          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;

          let moveA = 0.5;
          let moveB = 0.5;

          if (state.pointer.active && i === state.cueIndex) {
            moveA = 0;
            moveB = 1;
          } else if (state.pointer.active && j === state.cueIndex) {
            moveA = 1;
            moveB = 0;
          }

          a.x -= nx * overlap * moveA;
          a.y -= ny * overlap * moveA;
          b.x += nx * overlap * moveB;
          b.y += ny * overlap * moveB;

          const relativeVX = b.vx - a.vx;
          const relativeVY = b.vy - a.vy;
          const velocityAlongNormal = relativeVX * nx + relativeVY * ny;

          if (velocityAlongNormal > 0) {
            continue;
          }

          const restitution = 0.88;
          let inverseMassA = 1 / (a.r * a.r);
          let inverseMassB = 1 / (b.r * b.r);

          if (state.pointer.active && i === state.cueIndex) {
            inverseMassA = 0;
          }
          if (state.pointer.active && j === state.cueIndex) {
            inverseMassB = 0;
          }

          const denominator = inverseMassA + inverseMassB || 1;
          const impulse = (-(1 + restitution) * velocityAlongNormal) / denominator;
          const impulseX = impulse * nx;
          const impulseY = impulse * ny;

          a.vx -= impulseX * inverseMassA;
          a.vy -= impulseY * inverseMassA;
          b.vx += impulseX * inverseMassB;
          b.vy += impulseY * inverseMassB;
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, state.width, state.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, state.height - 2);
      ctx.lineTo(state.width, state.height - 2);
      ctx.stroke();

      state.balls.forEach((ball, index) => {
        drawBall(ball, index === state.cueIndex);
      });
    };

    const tick = () => {
      physicsStep();
      render();
      frameRef.current = window.requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", releasePointer);
    canvas.addEventListener("pointercancel", releasePointer);
    canvas.addEventListener("pointerleave", releasePointer);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", releasePointer);
      canvas.removeEventListener("pointercancel", releasePointer);
      canvas.removeEventListener("pointerleave", releasePointer);
    };
  }, []);

  return (
    <div className="contact-ball-field">
      <canvas
        ref={canvasRef}
        className={`contact-ball-canvas${isDragging ? " is-dragging" : ""}`}
        aria-label="Interactive contact ball field"
      />
      <p className="contact-ball-hint">Drag the center ball to nudge the lineup.</p>
    </div>
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
          AKANKSHA MAHANGARE
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
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));

  useEffect(() => {
    const section = new URLSearchParams(location.search).get("section");
    if (!section) {
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.search]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncViewportWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", syncViewportWidth);
    return () => window.removeEventListener("resize", syncViewportWidth);
  }, []);

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);
  const heroLayout = useMemo(() => {
    const sizeProgress = clamp((920 - viewportWidth) / 560, 0, 1);
    const scale = HERO_IMAGE_SCALE * lerp(1, 0.52, sizeProgress);

    return {
      scale,
      driftScale: lerp(1, 0.56, sizeProgress),
      parallaxScale: lerp(1, 0.58, sizeProgress),
    };
  }, [viewportWidth]);

  const ringObjects = useMemo(() => {
    const { driftScale, scale } = heroLayout;

    return heroObjects.map((item, index) => ({
      ...item,
      ringX: item.x,
      ringY: item.y,
      width: Math.round(item.w * scale),
      drift: (10 + (index % 3) * 2) * driftScale,
      driftDuration: 9 + index * 0.5,
      driftDelay: -index * 0.7,
    }));
  }, [heroLayout]);

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
        {ringObjects.map((item, index) => {
            const tx = mouse.x * item.depth * heroLayout.parallaxScale * 0.42;
            const ty = mouse.y * item.depth * heroLayout.parallaxScale * 0.42;
            const rotation = item.rotate + mouse.x * 1.8;

            return (
              <div
                key={item.id}
                className={`hero-ring-item hero-ring-item-${item.id}`}
                style={{
                  left: `${item.ringX}%`,
                  top: `${item.ringY}%`,
                  "--drift-size": `${item.drift}px`,
                  "--drift-duration": `${item.driftDuration}s`,
                  "--drift-delay": `${item.driftDelay}s`,
                }}
              >
                <SafeImage
                  image={item.src}
                  className={`hero-object hero-object-${item.id}`}
                  alt={item.alt}
                  style={{
                    width: `${item.width}px`,
                    transform: `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) rotate(${rotation}deg)`,
                    animationDelay: `${index * 0.13}s`,
                  }}
                />
              </div>
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
            <span>Design</span>
            <span>Thinker</span>
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
          <SafeImage image={aboutContent.image} alt="AKANKSHA MAHANGARE portrait" />
          <div>
            <p>{aboutContent.intro}</p>
            <p>{aboutContent.details}</p>
            <div className="about-actions">
              <Link className="primary-action" to="/resume">
                View Resume
              </Link>
              <a className="secondary-action" href={RESUME_PDF_PATH} download>
                Download PDF
              </a>
              <a className="secondary-action" href={CONTACT_MAILTO}>
                Email Me
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-ticker">
          <div className="contact-ticker-track">
            {[...CONTACT_TICKER_ITEMS, ...CONTACT_TICKER_ITEMS].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>

        <div className="contact-panel">
          <p className="contact-kicker">Open for UX and Product Design work</p>
          <h2>My prototypes are smoother than last-minute requirement changes.</h2>
          <p className="contact-copy">
            Send your rough brief. I will turn it into clean user flows, usable UI, and handoff-ready design.
          </p>
          <div className="contact-actions">
            <a href={CONTACT_MAILTO}>Email Akanksha</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
          <div className="contact-ball-field">
            <Spline
              className="contact-spline"
              scene="https://prod.spline.design/ChcZUJkocrFOVMgi/scene.splinecode"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project }) {
  const [transformStyle, setTransformStyle] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const isProtected = isProjectPasswordProtected(project.slug);

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
        <div className="project-overlay">
          <div className="project-tags">
            <span className="project-tag">{project.category}</span>
            <span className="project-tag">{project.year}</span>
            {isProtected ? <span className="project-tag">Protected</span> : null}
          </div>
          <div className="project-info">
            <h3>{project.title}</h3>
            <div className="project-cta">
              <span>{isProtected ? "Enter password" : "Open case study"}</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CaseStudyPage({ slug }) {
  const navigate = useNavigate();
  const project = getProjectBySlug(slug);
  const requiredPassword = getProjectPassword(slug);
  const isProtected = isProjectPasswordProtected(slug);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => getProjectUnlockState(slug));
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    setIsUnlocked(getProjectUnlockState(slug));
    setPasswordInput("");
    setPasswordError("");
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      sectionRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom > 160) setActiveSection(i);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleUnlock = (event) => {
    event.preventDefault();
    if (!isProtected) return;
    if (!requiredPassword) { setPasswordError("Password is not configured for this build yet."); return; }
    if (passwordInput.trim() === requiredPassword) {
      saveProjectUnlockState(slug); setIsUnlocked(true); setPasswordError(""); return;
    }
    setPasswordError("Incorrect password. Try again.");
  };

  if (!project) return <Navigate to="/" replace />;
  const nextProject = projects.find((entry) => entry.slug !== slug);

  if (isProtected && !isUnlocked) {
    return (
      <article className="case-page">
        <button className="back-pill" onClick={() => navigate("/?section=work")}>← Back to Work</button>
        <p className="case-meta">Private Case Study</p>
        <h1>{project.shortTitle}</h1>
        <p className="case-summary">This project is password protected.</p>
        <form className="unlock-form" onSubmit={handleUnlock}>
          <label htmlFor={`unlock-${slug}`}>Password</label>
          <div className="unlock-row">
            <input id={`unlock-${slug}`} type="password" value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)} placeholder="Enter password" autoComplete="off" />
            <button type="submit">Unlock</button>
          </div>
          {passwordError ? <p className="unlock-error">{passwordError}</p> : null}
        </form>
      </article>
    );
  }

  if (project.template === "ulio-usecase") {
    return <UlioUsecasePage project={project} />;
  }

  if (project.template === "sainsbury-usecase") {
    return <SainsburyUsecasePage project={project} />;
  }

  if (project.template === "image-case-study") {
    const images = project.gallery?.length ? project.gallery : project.hero ? [project.hero] : [];

    return (
      <div className="cs-root cs-root--image">
        <article className="case-page cs-page cs-page--image">
          <button className="cs-back" onClick={() => navigate("/?section=work")}>
            <span className="cs-back-arrow">←</span> All Work
          </button>
          <div className="cs-image-stack">
            {images.map((image, index) => (
              <SafeImage
                key={`${project.slug}-story-${index}`}
                image={image}
                alt={`${project.shortTitle} case study visual ${index + 1}`}
                className="case-story-image"
                style={{ animationDelay: `${index * 0.12}s` }}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
        </article>
      </div>
    );
  }

  const hasSections = project.sections?.length > 0;
  const hasOverview = project.overview && (project.overview.role || project.overview.timeline || project.overview.methods?.length > 0);

  return (
    <div className="cs-root">
      {/* Progress bar */}
      <div className="cs-progress" style={{ transform: `scaleX(${scrollProgress})` }} />

      {/* Sticky section nav */}
      {hasSections && (
        <nav className="cs-sticky-nav">
          {project.sections.map((s, i) => (
            <button
              key={i}
              className={`cs-nav-dot ${activeSection === i ? "is-active" : ""}`}
              onClick={() => sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })}
              title={s.heading}
            >
              <span className="cs-nav-dot-line" />
              <span className="cs-nav-dot-label">{s.label || s.heading}</span>
            </button>
          ))}
        </nav>
      )}

      <article className="case-page cs-page">
        {/* Back */}
        <button className="cs-back" onClick={() => navigate("/?section=work")}>
          <span className="cs-back-arrow">←</span> All Work
        </button>

        {/* Hero block */}
        <header className="cs-hero">
          <div className="cs-hero-meta">
            <span className="cs-tag">{project.category}</span>
            <span className="cs-tag">{project.year}</span>
          </div>
          <h1 className="cs-title">{project.title}</h1>
          <p className="cs-summary">{project.summary}</p>

          {hasOverview && (
            <div className="cs-overview">
              {project.overview.role && (
                <div className="cs-overview-item">
                  <span className="cs-overview-label">Role</span>
                  <span className="cs-overview-value">{project.overview.role}</span>
                </div>
              )}
              {project.overview.timeline && (
                <div className="cs-overview-item">
                  <span className="cs-overview-label">Timeline</span>
                  <span className="cs-overview-value">{project.overview.timeline}</span>
                </div>
              )}
              {project.overview.methods?.length > 0 && (
                <div className="cs-overview-item">
                  <span className="cs-overview-label">Methods</span>
                  <span className="cs-overview-value">{project.overview.methods.join(" · ")}</span>
                </div>
              )}
              {project.overview.outcome && (
                <div className="cs-overview-item">
                  <span className="cs-overview-label">Outcome</span>
                  <span className="cs-overview-value">{project.overview.outcome}</span>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Hero image */}
        <div className="cs-hero-image">
          <SafeImage image={project.hero} alt={project.shortTitle} loading="eager" />
        </div>

        {/* Rich sections */}
        {hasSections ? (
          <div className="cs-sections">
            {project.sections.map((section, index) => (
              <section
                key={index}
                className="cs-section"
                ref={(el) => (sectionRefs.current[index] = el)}
              >
                <div className="cs-section-inner">
                  <div className="cs-section-left">
                    {section.label && <p className="cs-section-label">{section.label}</p>}
                    <h2 className="cs-section-heading">{section.heading}</h2>
                  </div>
                  <div className="cs-section-right">
                    {Array.isArray(section.body)
                      ? section.body.map((para, i) => <p key={i} className="cs-body">{para}</p>)
                      : section.body && <p className="cs-body">{section.body}</p>}

                    {section.stats?.length > 0 && (
                      <div className="cs-stats">
                        {section.stats.map((stat, i) => (
                          <div key={i} className="cs-stat">
                            <span className="cs-stat-value">{stat.value}</span>
                            <span className="cs-stat-label">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.items?.length > 0 && (
                      <ul className="cs-items">
                        {section.items.map((item, i) => (
                          <li key={i} className="cs-item">
                            <span className="cs-item-num">{String(i + 1).padStart(2, "0")}</span>
                            <div className="cs-item-body">
                              <strong className="cs-item-title">{item.title}</strong>
                              {item.description && <p className="cs-item-desc">{item.description}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.note && <p className="cs-note">{section.note}</p>}
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="case-columns">
            <section><h2>Challenge</h2><p>{project.challenge}</p></section>
            <section><h2>Solution</h2><p>{project.solution}</p></section>
          </div>
        )}

        {/* Impact */}
        {project.impact?.length > 0 && (
          <section className="cs-impact">
            <p className="cs-section-label">Outcome</p>
            <h2 className="cs-impact-heading">What this delivers</h2>
            <div className="cs-impact-grid">
              {project.impact.map((metric, i) => (
                <div key={i} className="cs-impact-card">
                  <span className="cs-impact-num">{String(i + 1).padStart(2, "0")}</span>
                  <p>{metric}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {project.gallery?.length > 0 && (
          <section className="cs-gallery">
            {project.gallery.map((image, i) => (
              <div key={i} className="cs-gallery-item">
                <SafeImage image={image} alt={`${project.shortTitle} visual ${i + 1}`} />
              </div>
            ))}
          </section>
        )}

        {/* Next project */}
        {nextProject && (
          <div className="cs-next">
            <p className="cs-next-label">Next Case Study</p>
            <Link className="cs-next-link" to={`/${nextProject.slug}`}>
              <span>{nextProject.shortTitle}</span>
              <span className="cs-next-arrow">→</span>
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}

function ResumePage() {
  return (
    <section className="resume-page">
      <p className="resume-kicker">Resume</p>
      <h1>AKANKSHA MAHANGARE</h1>
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
        <a href={CONTACT_MAILTO}>Contact</a>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
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
          {projectRoutes.map((route) => (
            <Route
              key={route.path}
              path={`/${route.path}`}
              element={<CaseStudyPage slug={route.canonicalSlug} />}
            />
          ))}
          <Route path="/resume" element={<ResumePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>Crafted with love and logic.</p>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </footer>
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
