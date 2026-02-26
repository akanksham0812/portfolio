import { useNavigate } from "react-router-dom";
import SafeImage from "../../components/SafeImage";

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
            <span className="ulio-hero-pill-index">{data.hero?.index}</span>
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
          <div className="ulio-section-header">
            <span>{project.shortTitle?.toUpperCase() || "ULIO"}</span>
            <span>{data.about?.label}</span>
            <span>{data.about?.index}</span>
          </div>
          <p className="ulio-about-body">{data.about?.body}</p>
          <div className="ulio-about-tags">
            {(data.about?.tags || []).map((tag, index) => (
              <span key={tag} className={`ulio-chip ulio-chip--about ulio-chip--${index + 1}`}>{tag}</span>
            ))}
          </div>
        </section>

        <section className="ulio-brand-cards">
          <div className="ulio-brand-card ulio-brand-card--red">
            <h2>Ulio</h2>
            <span className="ulio-brand-underline" />
            <div className="ulio-brand-tags">
              {(data.brandCards?.leftTags || []).map((tag, index) => (
                <span key={tag} className={`ulio-chip ulio-chip--brand ulio-chip--brand-${index + 1}`}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="ulio-brand-card ulio-brand-card--dark">
            <div className="ulio-brand-grid">
              <div className="ulio-brand-dot is-red">U</div>
              <div className="ulio-brand-dot is-blue">U</div>
              <div className="ulio-brand-dot is-teal">U</div>
              <div className="ulio-brand-dot is-purple">U</div>
            </div>
            <h2>Ulio</h2>
            <span className="ulio-brand-underline" />
          </div>
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
          <div className="ulio-section-header">
            <span>{data.painPoints?.label}</span>
            <span>{data.painPoints?.title}</span>
            <span>{data.painPoints?.index}</span>
          </div>
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

        <section className="ulio-typography">
          <div className="ulio-section-header">
            <span>{project.shortTitle?.toUpperCase() || "ULIO"}</span>
            <span>{data.typography?.label}</span>
            <span>{data.typography?.index}</span>
          </div>
          <div className="ulio-typography-grid">
            <div className="ulio-typography-hero">Aa</div>
            <div className="ulio-typography-copy">
              <p>“{data.typography?.quote}”</p>
              <h3>{data.typography?.font}</h3>
              <span>{(data.typography?.weights || []).join(" · ")}</span>
            </div>
          </div>
          <div className="ulio-palette">
            {(data.palette || []).map((color) => (
              <div key={color.hex} className="ulio-swatch">
                <div className="ulio-swatch-inner" style={{ background: color.hex }} />
                <span>{color.hex}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`ulio-ui ${data.uiShowcase?.mockup ? "" : "is-single"}`.trim()}>
          <div className="ulio-ui-copy">
            <h2>{data.uiShowcase?.headline}</h2>
            <h3>{data.uiShowcase?.subheadline}</h3>
          </div>
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
