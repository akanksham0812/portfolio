import { useNavigate } from "react-router-dom";
import SafeImage from "../../components/SafeImage";

export function InsightsUsecasePage({ project }) {
  const navigate = useNavigate();
  const data = project.usecase || {};

  return (
    <div className="ins-root">
      <button
        className="cs-back ins-back"
        onClick={() => navigate("/?section=work")}
        type="button"
      >
        <span className="cs-back-arrow">←</span> All Work
      </button>

      {/* ── HERO ── */}
      <section className="ins-hero">
        {/* Top bar */}
        <div className="ins-hero-topbar">
          <span className="ins-pill">ux research</span>
          <span className="ins-plus">+</span>
          <span className="ins-pill">product design</span>
        </div>

        {/* Title */}
        <div className="ins-title-block">
          <h1 className="ins-title">insights</h1>
          <svg
            className="ins-scribble"
            viewBox="0 0 560 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 30 Q45 10 95 24 Q145 38 195 18 Q245 -2 295 20 Q345 42 395 22 Q435 6 478 24 Q510 36 552 22"
              stroke="#FF6B9D"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Phone mockups */}
        <div className="ins-phones">
          <div className="ins-phone ins-phone--left">
            <SafeImage
              image={data.phones?.[0]}
              alt="Insights app — expert profile"
              loading="eager"
            />
          </div>
          <div className="ins-phone ins-phone--center">
            <SafeImage
              image={data.phones?.[1]}
              alt="Insights app — home screen"
              loading="eager"
            />
          </div>
          <div className="ins-phone ins-phone--right">
            <SafeImage
              image={data.phones?.[2]}
              alt="Insights app — browse categories"
              loading="eager"
            />
          </div>
        </div>

        {/* Decorative floaters */}
        <span className="ins-deco ins-deco--1" aria-hidden="true">💜</span>
        <span className="ins-deco ins-deco--2" aria-hidden="true">✨</span>
        <span className="ins-deco ins-deco--3" aria-hidden="true">📚</span>
        <span className="ins-deco ins-deco--4" aria-hidden="true">🌟</span>
        <span className="ins-deco ins-deco--5" aria-hidden="true">❤️</span>
        <span className="ins-deco ins-deco--6" aria-hidden="true">🔮</span>
      </section>
    </div>
  );
}
