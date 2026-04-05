import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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

const Spline = lazy(() => import("@splinetool/react-spline"));
const UlioUsecasePage = lazy(() => import("./projects/template/ulioUsecase").then(m => ({ default: m.UlioUsecasePage })));
const SainsburyUsecasePage = lazy(() => import("./projects/template/sainsburyUsecase").then(m => ({ default: m.SainsburyUsecasePage })));
const BusRouteUsecasePage = lazy(() => import("./projects/template/busrouteUsecase").then(m => ({ default: m.BusRouteUsecasePage })));
const OpsUsecasePage = lazy(() => import("./projects/template/opsUsecase").then(m => ({ default: m.OpsUsecasePage })));
const BusrouteBHPage = lazy(() => import("./projects/template/busrouteBH").then(m => ({ default: m.BusrouteBHPage })));

function MobileBlock() {
  return (
    <div className="mobile-block">
      <div className="mobile-block-inner">
        <p className="mobile-block-title">Hey!</p>
        <p className="mobile-block-body">
          I designed this for desktop so every detail lands right. Grab a laptop. It'll be worth the switch.
        </p>
        <div className="mobile-block-tag">Desktop only</div>
      </div>
      <div className="cat-scene">
        <div className="cat-walker">
          <svg width="76" height="58" viewBox="0 0 76 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tail */}
            <path d="M13,35 C5,28 7,17 13,14 C17,10 21,16 18,21" stroke="#d0d0d0" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Body */}
            <ellipse cx="36" cy="35" rx="19" ry="11" fill="#d0d0d0"/>
            {/* Head */}
            <circle cx="52" cy="26" r="12" fill="#d0d0d0"/>
            {/* Ears */}
            <polygon points="44,18 48,9 52,18" fill="#d0d0d0"/>
            <polygon points="53,18 57,9 61,18" fill="#d0d0d0"/>
            <polygon points="45,18 48,11 51,18" fill="rgba(240,108,0,0.45)"/>
            <polygon points="54,18 57,11 60,18" fill="rgba(240,108,0,0.45)"/>
            {/* Eyes */}
            <ellipse cx="48" cy="25" rx="1.9" ry="2.3" fill="#111"/>
            <ellipse cx="56" cy="25" rx="1.9" ry="2.3" fill="#111"/>
            <circle cx="49" cy="24" r="0.65" fill="#fff"/>
            <circle cx="57" cy="24" r="0.65" fill="#fff"/>
            {/* Nose */}
            <polygon points="51,29 52,31 53,29" fill="#F06C00"/>
            {/* Mouth */}
            <path d="M50,31 Q52,33 54,31" stroke="#888" strokeWidth="0.9" strokeLinecap="round"/>
            {/* Whiskers */}
            <line x1="39" y1="27" x2="46" y2="28" stroke="#aaa" strokeWidth="0.8"/>
            <line x1="39" y1="30" x2="46" y2="29" stroke="#aaa" strokeWidth="0.8"/>
            <line x1="65" y1="27" x2="58" y2="28" stroke="#aaa" strokeWidth="0.8"/>
            <line x1="65" y1="30" x2="58" y2="29" stroke="#aaa" strokeWidth="0.8"/>
            {/* Front legs */}
            <g className="cat-leg-a" style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
              <rect x="45" y="44" width="5" height="11" rx="2.5" fill="#d0d0d0"/>
            </g>
            <g className="cat-leg-b" style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
              <rect x="52" y="44" width="5" height="11" rx="2.5" fill="#d0d0d0"/>
            </g>
            {/* Back legs */}
            <g className="cat-leg-b" style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
              <rect x="25" y="44" width="5" height="11" rx="2.5" fill="#d0d0d0"/>
            </g>
            <g className="cat-leg-a" style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
              <rect x="32" y="44" width="5" height="11" rx="2.5" fill="#d0d0d0"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

const filters = ["All", "Product Design", "UX Research & Design", "UX Case Study"];
const HERO_IMAGE_SCALE = 0.7;
const RESUME_PDF_PATH = withBase("assets/resume/Akanksha_Mahangare_CV.pdf");
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
          Akanksha Mahangare
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
          <div className="about-ani-wrap">
            <img src="/assets/resume/1%20ani.svg" alt="" className="about-ani-img about-ani-1" />
            <img src="/assets/resume/2%20ani.svg" alt="" className="about-ani-img about-ani-2" />
            <img src="/assets/resume/3%20ani.svg" alt="" className="about-ani-img about-ani-3" />
            <img src="/assets/resume/4%20ani.svg" alt="" className="about-ani-img about-ani-4" />
          </div>
          <div>
            <p>{aboutContent.intro}</p>
            <p>{aboutContent.details}</p>
            <div className="about-actions">
              <Link className="primary-action" to="/resume">
                About Me
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
            <Suspense fallback={null}>
              <Spline
                className="contact-spline"
                scene="https://prod.spline.design/ChcZUJkocrFOVMgi/scene.splinecode"
              />
            </Suspense>
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
    const project = getProjectBySlug(slug);
    if (project) {
      document.title = `${project.shortTitle} – Akanksha Mahangare`;
    }
    return () => {
      document.title = "Akanksha Mahangare – UX Designer & Researcher";
    };
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
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = currentIndex >= 0 && currentIndex < projects.length - 1
    ? projects[currentIndex + 1]
    : null;

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
    return <Suspense fallback={null}><UlioUsecasePage project={project} /></Suspense>;
  }

  if (project.template === "sainsbury-usecase") {
    return <Suspense fallback={null}><SainsburyUsecasePage project={project} /></Suspense>;
  }

  if (project.template === "busroute-usecase") {
    return <Suspense fallback={null}><BusRouteUsecasePage project={project} /></Suspense>;
  }

  if (project.template === "busroute-bh") {
    return <Suspense fallback={null}><BusrouteBHPage project={project} /></Suspense>;
  }

  if (project.template === "ops-usecase") {
    return <Suspense fallback={null}><OpsUsecasePage project={project} /></Suspense>;
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

const ABT_TIMELINE = [
  { year: "2025–26", title: "Associate UI/UX Designer - Globestar Edutech", desc: "UX audits, competitive research, 15+ usability improvements. Shipped 5 end-to-end design solutions across EdTech and SaaS - 3 enterprise dashboards, 5 mobile apps. Designed Knowledge Hub & Knowledge Buzz from concept to high-fidelity." },
  { year: "2024–25", title: "Quality Analyst - Sigma AI, London", desc: "QA on linguistic data and AI training datasets for large LLMs. Boosted model performance by 20%, managed 3+ simultaneous AI training projects - proof that a UX brain is useful even when the 'user' is a machine." },
  { year: "2024", title: "UX Designer - Interns Lab, Remote", desc: "Usability studies and interviews that lifted user satisfaction 30%. Designed wireframes and prototypes that cut delivery time by 40%. Applied accessibility guidelines to key user flows - because inclusive design isn't optional." },
  { year: "2023–25", title: "UX Designer - Freelance, Remote", desc: "End-to-end design across 5 major projects in diverse industries. Research, wireframes, prototypes, usability testing - the full loop. Increased usability by up to 40% for clients who trusted a freelancer with their product. Bold of them. Worth it." },
  { year: "2022–23", title: "MSc User Experience Engineering - Goldsmiths' University of London", desc: "Where the obsession became official. Specialised in UX engineering, research methods, inclusive design, and information architecture. Also learned that London is beautiful and cold and very good at both." },
  { year: "2021", title: "UI/UX Developer - SporTech Innovation", desc: "Responsive interfaces that lifted user engagement by 30%. A/B testing and usability studies that increased conversion 35%. First real taste of shipping design that actually goes live - scary, then addictive." },
  { year: "Origin", title: "The Japanese refrigerator moment", desc: "Saw a product so well-designed it felt alive. Fell into a rabbit hole of product design I've never climbed out of. Have not stopped redesigning things in my head since." },
];

const ABT_TOOLS = ["Figma", "Adobe XD", "Framer", "Axure", "InVision", "Miro / FigJam", "Maze", "Claude", "Hotjar", "Optimal Workshop", "Notion", "Confluence", "Webflow", "Vibe coding"];

const ABT_POL_PHOTOS = [
  { src: "/assets/resume/port/IMG_8846.JPG" },
  { src: "/assets/resume/port/IMG_7881.JPG" },
  { src: "/assets/resume/port/IMG_7887.JPG" },
  { src: "/assets/resume/port/IMG_6320.jpg" },
  { src: "/assets/resume/port/IMG_6800.jpg" },
  { src: "/assets/resume/port/IMG_7651.jpg" },
  { src: "/assets/resume/port/IMG_6809.jpg" },
  { src: "/assets/resume/port/IMG_6817.jpg" },
  { src: "/assets/resume/port/IMG_4542.jpg" },
  { src: "/assets/resume/port/IMG_1679.jpg" },
  { src: "/assets/resume/port/IMG_8011.jpg" },
  { src: "/assets/resume/port/IMG_6844.jpg" },
];

const ABT_BOOKS = [
  { title: "Mrityunjay",               author: "Shivaji Sawant",          genre: "Marathi Classic",       bg: "#1a1228", color: "#e8c49a", w: 27, h: 138, summary: "A towering Marathi epic retelling the Mahabharata through Karna's eyes - the warrior the world called a villain, but who was just born on the wrong side of fate. Heavy, beautiful, unforgettable." },
  { title: "Grahan",                   author: "Narayan Dharap",           genre: "Marathi Thriller",      bg: "#2a1a0a", color: "#f0c878", w: 26, h: 132, summary: "A gripping Marathi thriller by the master of suspense. Dharap builds tension the way a good chai brews - slowly, deliberately, and then suddenly it's too hot to put down." },
  { title: "Chetkin",                  author: "Narayan Dharap",           genre: "Marathi Thriller",      bg: "#0e2a1a", color: "#80d8a0", w: 26, h: 128, summary: "Another psychological thriller from Narayan Dharap, exploring the unsettling corners of the human mind. Proof that Marathi crime fiction deserves a much bigger global audience." },
  { title: "The Crash",                author: "Freida McFadden",          genre: "Thriller",              bg: "#1e1010", color: "#f4b89a", w: 25, h: 124, summary: "A twisty psychological thriller where nothing is what it seems - and the person you trust most might be the one you should fear. McFadden's signature: you will not see the ending coming." },
  { title: "The Sanctuary",            author: "Andrew Hunter Murray",     genre: "Thriller",              bg: "#0b3050", color: "#a8d8f0", w: 27, h: 140, summary: "A near-future thriller set in a crumbling Britain where a mysterious island retreat holds dark secrets. Atmospheric, tense, and the kind of book that makes you look up the author immediately after." },
  { title: "The Woman Who Lied",       author: "Claire Douglas",           genre: "Psychological Thriller",bg: "#163320", color: "#8fd6b4", w: 25, h: 128, summary: "A crime writer whose fictional murders start mirroring real life. Meta, unsettling, and the kind of book that makes you double-lock your door at night - just in case." },
  { title: "Never Lie",                author: "Freida McFadden",          genre: "Thriller",              bg: "#111111", color: "#e8e0d0", w: 24, h: 120, summary: "Tapes from a missing therapist. A newlywed who can't stop listening. Secrets buried for decades. McFadden at her most addictive - you'll finish this in one sitting and feel slightly unwell." },
  { title: "Murder at Church Lodge",   author: "Greg Mosse",               genre: "Crime",                 bg: "#4a1010", color: "#f5c6a0", w: 26, h: 133, summary: "A classic whodunit set in an English country house. Cosy crime at its finest - ideal for reading with a blanket and something warm." },
  { title: "Talking with Serial Killers", author: "Christopher Berry-Dee",genre: "True Crime",            bg: "#7a0000", color: "#ffe0cc", w: 25, h: 128, summary: "Firsthand interviews with some of the world's most notorious killers. Deeply unsettling, compulsively readable, and genuinely raises the question: why are we all so fascinated by this?" },
  { title: "Agatha Christie",          author: "Agatha Christie",          genre: "Classic Mystery",       bg: "#2e2318", color: "#e8d5b0", w: 23, h: 115, summary: "The OG of crime fiction. Whether it's Poirot or Miss Marple, Christie invented the rules everyone else still follows." },
  { title: "The Rules of Everything",  author: "Richard Templar",          genre: "Self-help",             bg: "#c8b888", color: "#2a2010", w: 27, h: 136, summary: "Sharp, witty rules for navigating life, work, and people. Less self-helpy than the title suggests - more like that blunt friend who tells you exactly what you need to hear." },
  { title: "Trial & Retribution",      author: "Lynda La Plante",          genre: "Crime Drama",           bg: "#1a2e48", color: "#c8dff0", w: 24, h: 122, summary: "La Plante's gritty detective series at its best - a brutal murder, a complex investigation, and the kind of procedural storytelling that makes you feel like you're in the incident room." },
  { title: "A Careless Husband",       author: "Paolo Sedazzari",          genre: "Literary Fiction",      bg: "#2e1e08", color: "#f5d9a8", w: 25, h: 130, summary: "A quiet, uncomfortable look at marriage, betrayal, and the small cruelties we commit against the people closest to us. The kind of book that stays with you longer than you'd like." },
  { title: "Franz Kafka",              author: "Franz Kafka",              genre: "Classic / Absurdist",   bg: "#181818", color: "#c0c0c0", w: 21, h: 110, summary: "You wake up one day as a giant insect. Your family is horrified. Bureaucracy is inescapable. Everything is vaguely someone's fault but no one's fault. Peak Kafka. Somehow still relatable." },
  { title: "The Long Game",            author: "Elena Armas",              genre: "Romance",               bg: "#1e5544", color: "#a8f0d8", w: 27, h: 138, summary: "Enemies-to-lovers slow burn between two people who are terrible at admitting they like each other. Sandwiched between serial killers and Kafka on this shelf, which honestly makes it more charming." },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".abt-reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("abt-reveal-visible"); observer.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function ResumePage() {
  const [activeBook, setActiveBook] = useState(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const detailRef = useRef(null);
  useReveal();

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightboxSrc(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleBookClick(i) {
    if (activeBook === i) { setActiveBook(null); return; }
    setActiveBook(i);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  }

  const book = activeBook !== null ? ABT_BOOKS[activeBook] : null;

  return (
    <section className="resume-page">
      <div className="abt-inner">

        {/* HERO */}
        <div className="abt-hero-layout abt-reveal">
          <div className="abt-hero-text">
            <span className="abt-hero-tag">UX Designer · MSc Goldsmiths' University of London · Pune</span>
            <h1 className="abt-hero-name">Hi, I'm Akanksha.</h1>
            <p className="abt-hero-sub">I make things make sense.</p>
            <p className="abt-body">MSc in User Experience Engineering from Goldsmiths' University of London. My mission: design things people don't hate. High bar, I know.</p>
            <p className="abt-body">I've helped teams boost user satisfaction by 30% and cut delivery cycles by 40% - all while keeping Figma files organised and cross-functional collaboration drama-free. I also vibe-code now, so I'm basically a designer who can break things in two languages.</p>
            <div className="abt-origin-block">
              <p>It started with a Japanese refrigerator. I saw it, couldn't stop thinking about how something so ordinary could be so considered, and promptly fell into a rabbit hole of product design I've never climbed out of.</p>
              <span>- how it actually started</span>
            </div>
          </div>
          <div className="abt-hero-photo-col">
            <div className="abt-hero-photo">
              <img src="/assets/resume/port/FullSizeRender.jpg" alt="Akanksha Mahangare" />
            </div>
          </div>
        </div>

        <div className="abt-divider" />

        {/* PHILOSOPHY */}
        <div className="abt-reveal">
          <span className="abt-label">Design philosophy</span>
          <div className="abt-philosophy">
            <p>"Design isn't decoration. It's the difference between someone getting it on the first click - or rage-quitting forever. I'd rather be the reason they stayed."</p>
            <span>- Akanksha, bluntly</span>
          </div>
        </div>

        <div className="abt-divider" />

        {/* TIMELINE */}
        <div className="abt-reveal">
          <span className="abt-label">Career so far</span>
          <div className="abt-timeline">
            {ABT_TIMELINE.map((item, i) => (
              <div key={item.year} className="abt-tl-item abt-reveal" style={{ "--abt-delay": `${i * 0.1}s` }}>
                <div className="abt-tl-year">{item.year}</div>
                <div className="abt-tl-content">
                  <div className="abt-tl-title">{item.title}</div>
                  <div className="abt-tl-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="abt-divider" />

        {/* TOOLS */}
        <div className="abt-reveal">
          <span className="abt-label">Tools of the trade</span>
          <div className="abt-tools">
            {ABT_TOOLS.map((t) => <span key={t} className="abt-tool">{t}</span>)}
          </div>
        </div>

        <div className="abt-divider" />

        {/* PHOTOS */}
        <div className="abt-reveal">
          <span className="abt-label">My digital photo diary</span>
          <div className="abt-photo-grid">
            {ABT_POL_PHOTOS.map((p, i) => (
              <div key={i} className="abt-photo-tile" onClick={() => setLightboxSrc(p.src)}>
                <img src={p.src} alt="" />
              </div>
            ))}
          </div>
        </div>

        <div className="abt-divider" />

        {/* BOOKSHELF */}
        <div className="abt-reveal">
          <span className="abt-label">Currently on my shelf</span>

          {book && (
            <div className="abt-book-detail" ref={detailRef}>
              <button className="abt-detail-close" onClick={() => setActiveBook(null)}>close ✕</button>
              <p className="abt-detail-genre">{book.genre}</p>
              <p className="abt-detail-title">{book.title}</p>
              <p className="abt-detail-author">{book.author}</p>
              <p className="abt-detail-summary">{book.summary}</p>
            </div>
          )}

          <div className="abt-shelf-unit">
            <div className="abt-shelf-row">
              {ABT_BOOKS.map((b, i) => (
                <div
                  key={i}
                  className={`abt-book${activeBook === i ? " abt-book-active" : ""}`}
                  style={{ width: b.w, height: b.h, background: b.bg }}
                  onClick={() => handleBookClick(i)}
                >
                  <div className="abt-book-top" />
                  <div className="abt-book-highlight" />
                  <span className="abt-book-spine" style={{ color: b.color }}>
                    <span className="abt-spine-title">{b.title}</span>
                    <span className="abt-spine-author">{b.author.split(" ").pop()}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="abt-shelf-plank" />
            <p className="abt-shelf-footer">click any book · crime, marathi classics & one romance · zero regrets</p>
          </div>
        </div>

        <div className="abt-divider" />

        {/* FUN FACT */}
        <div className="abt-reveal">
          <div className="abt-fun-fact">
            <p className="abt-fun-fact-text"><strong>One fun fact:</strong> If you've ever struggled with a confusing checkout flow at 11pm, there's a decent chance I've quietly judged it and mentally fixed it too.</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="resume-actions abt-reveal" style={{ marginTop: "2.5rem" }}>
          <a href={RESUME_PDF_PATH} download>Download Resume PDF</a>
          <a href={CONTACT_MAILTO}>Contact</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
          <Link to="/?section=work">View Work</Link>
        </div>

      </div>

      {lightboxSrc && (
        <div className="abt-lightbox" onClick={() => setLightboxSrc(null)}>
          <button className="abt-lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <img src={lightboxSrc} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="site">
      <ScrollToTop />
      <TopNav />
      <main>
        <MobileBlock />
        <div className="desktop-only">
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
        </div>
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
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
