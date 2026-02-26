import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import SafeImage from "../../components/SafeImage";

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
            }, 65);
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


export function UlioUsecasePage({ project }) {
  const navigate = useNavigate();
  const data = project.usecase || {};

  return (
    <div className="ulio-usecase">
      <article className="ulio-usecase-inner">
        <button className="cs-back" onClick={() => navigate("/?section=work")} type="button">
          <span className="cs-back-arrow">←</span> All Work
        </button>

        <section className="ulio-hero">
          <div className="ulio-hero-pill">
            <span className="ulio-hero-pill-brand">
              <span className="ulio-hero-pill-logo">U</span>
              {data.hero?.kicker || project.shortTitle}
            </span>
            <span className="ulio-hero-pill-title">{data.hero?.title}</span>
            {/* <span className="ulio-hero-pill-index">{data.hero?.index}</span> */}
          </div>

          <div className="ulio-hero-grid">
            <div className="ulio-hero-mockup-only">
              <SafeImage image={data.assets?.heroMockup || project.hero} alt="Ulio mobile mockup" loading="eager" />
            </div>
          </div>

          <div className="ulio-hero-icons" aria-hidden="true">
            {data.assets?.medal ? (
              <SafeImage image={data.assets.medal} alt="" className="ulio-hero-icon is-medal" />
            ) : null}
            {data.assets?.calendar ? (
              <SafeImage image={data.assets.calendar} alt="" className="ulio-hero-icon is-calendar" />
            ) : null}
            {data.assets?.flower ? (
              <SafeImage image={data.assets.flower} alt="" className="ulio-hero-icon is-flower" />
            ) : null}
          </div>
        </section>

        <section className="ulio-about">
          <p className="ulio-about-body">{data.about?.body}</p>
          <div className="ulio-about-tags">
            {(data.about?.tags || []).map((tag, index) => (
              <span key={tag} className={`ulio-chip ulio-chip--about ulio-chip--${index + 1}`}>
                <TypedText text={tag} delay={index * 350} />
              </span>
            ))}
          </div>
        </section>

        <section className="ulio-brand-cards-wrap">
        <section className="ulio-brand-cards">
          <div className="ulio-brand-card ulio-brand-card--red">
            {data.brandCards?.whiteLogo && (
              <div className="ulio-brand-logo-center">
                <SafeImage image={data.brandCards.whiteLogo} alt="Ulio" className="ulio-brand-logo-img" />
              </div>
            )}
            <div className="ulio-brand-tags">
              {(data.brandCards?.leftTags || []).map((tag, index) => (
                <span key={tag} className={`ulio-chip ulio-chip--brand ulio-chip--brand-${index + 1}`}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="ulio-brand-card ulio-brand-card--dark">
            <div className="ulio-brand-grid" aria-hidden="true">
              {data.brandCards?.icons?.red && <SafeImage image={data.brandCards.icons.red} alt="" className="ulio-brand-dot is-red" />}
              {data.brandCards?.icons?.blue && <SafeImage image={data.brandCards.icons.blue} alt="" className="ulio-brand-dot is-blue" />}
              {data.brandCards?.icons?.teal && <SafeImage image={data.brandCards.icons.teal} alt="" className="ulio-brand-dot is-teal" />}
              {data.brandCards?.icons?.purple && <SafeImage image={data.brandCards.icons.purple} alt="" className="ulio-brand-dot is-purple" />}
            </div>
            {data.brandCards?.whiteLogo && (
              <div className="ulio-brand-logo-center">
                <SafeImage image={data.brandCards.whiteLogo} alt="Ulio" className="ulio-brand-logo-img" />
              </div>
            )}
          </div>
        </section>
        </section>

        <section className="ulio-research">
          <h2>{data.research?.title}</h2>
          <div className="ulio-research-grid">
            <div className="ulio-research-card">
              <h3>{data.research?.primaryTitle}</h3>
              <ul>
                {(data.research?.primary || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="ulio-research-card">
              <h3>{data.research?.secondaryTitle}</h3>
              <ul>
                {(data.research?.secondary || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="ulio-pain">
          <div className="ulio-pain-grid">
            <div>
              <span className="ulio-badge is-warn">{data.painPoints?.leftLabel}</span>
              <ul className="ulio-pain-list">
                {(data.painPoints?.items || []).map((item) => (
                  <li key={item}><span aria-hidden="true">⚠️</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="ulio-pain-divider" aria-hidden="true" />
            <div>
              <span className="ulio-badge">{data.painPoints?.rightLabel}</span>
              <ul className="ulio-pain-list">
                {(data.painPoints?.solutions || []).map((item) => (
                  <li key={item}><span aria-hidden="true">🎯</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <h2 className="ulio-section-title">{data.typography?.label}</h2>
        <section className="ulio-typography">
          <div className="ulio-typography-grid">
            <div className="ulio-typography-hero">Aa</div>
            <div className="ulio-typography-copy">
              <p>“{data.typography?.quote}”</p>
              <h3>{data.typography?.font}</h3>
              <span>{(data.typography?.weights || []).join(" · ")}</span>
            </div>
          </div>
          <div className="ulio-palette">
            {(data.palette || []).map((color, i) => (
              <div key={i} className="ulio-swatch">
                <SafeImage image={color.image} alt="" className="ulio-swatch-img" />
              </div>
            ))}
          </div>
        </section>

        <section className="ulio-ui is-single">
          {data.uiShowcase?.mockup ? (
            <div className="ulio-ui-mockup">
              <SafeImage image={data.uiShowcase?.mockup} alt="Ulio UI mockups" />
            </div>
          ) : null}
        </section>

        <section className="ulio-footer">
          <p>{data.footer?.preface}</p>
          <h2>{data.footer?.thanks}</h2>
        </section>
      </article>
    </div>
  );
}
