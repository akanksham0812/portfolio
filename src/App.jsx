const projects = [
  {
    title: "An IT Company Website",
    type: "Web Design",
    color: "sunset",
  },
  {
    title: "Moon Is Around Us",
    type: "Landing Page",
    color: "moon",
  },
  {
    title: "Dental Clinic Dashboard",
    type: "UI / UX Design",
    color: "teal",
  },
  {
    title: "Social App Concept",
    type: "App Design",
    color: "berry",
  },
];

const services = ["Web Design", "UI / UX Design", "Graphics Design", "Product Design"];

const socials = ["Dribbble", "Behance", "Instagram", "LinkedIn"];

function App() {
  return (
    <div className="page">
      <header className="topbar">
        <a className="brand" href="#home">
          itsbd.
        </a>
        <nav className="menu">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero reveal" id="home">
          <p className="tag">BUILDER OF THOUGHTFUL DIGITAL EXPERIENCES</p>
          <h1>
            Cre<span className="outline">ative</span>
            <br />
            Cre<span className="outline">ative</span>
          </h1>
          <p className="hero-copy">
            Hello, I am a freelance visual designer focused on web and product interfaces.
          </p>
          <div className="service-row">
            {services.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="work reveal" id="work">
          <div className="section-head">
            <p>Selected work</p>
            <h2>Featured Projects</h2>
          </div>
          <div className="filters">
            <button className="active">All</button>
            <button>Web</button>
            <button>App</button>
            <button>Branding</button>
          </div>
          <div className="project-grid">
            {projects.map((project, idx) => (
              <article className={`project-card ${project.color} delay-${idx}`} key={project.title}>
                <div className="project-shape" />
                <p>{project.type}</p>
                <h3>{project.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="about reveal" id="about">
          <div className="section-head">
            <p>About me</p>
            <h2>Designer. Thinker. Builder.</h2>
          </div>
          <p>
            I design interfaces that feel clear, emotional, and useful. My process blends visual storytelling
            with product thinking so every detail has a reason.
          </p>
          <p>
            Over the years I have worked across web products, startups, and marketing teams. I care about
            typography, rhythm, and how motion can guide attention.
          </p>
          <div className="socials">
            {socials.map((item) => (
              <a key={item} href="#">
                {item}
              </a>
            ))}
          </div>
        </section>

        <section className="contact reveal" id="contact">
          <p>Need a design partner?</p>
          <h2>Got coffee? Let&apos;s talk.</h2>
          <a className="cta" href="mailto:hello@example.com">
            Contact Me
          </a>
        </section>
      </main>

      <footer>
        <p>Crafted with intention.</p>
      </footer>
    </div>
  );
}

export default App;
