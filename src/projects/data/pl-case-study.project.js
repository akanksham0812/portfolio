import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

export const plCaseStudyProject = createCaseStudyProject({
  title: "Sainsbury's Smart Basket: Redesigning Self-Checkout Through Mixed-Methods Research",
  shortTitle: "Sainsbury's Smart Basket",
  category: "UX Research & Design",
  year: "2023",
  summary:
    "A three-month independent study into the hidden failures of supermarket self-checkout, combining surveys, interviews, and live observational fieldwork to design a concept that changes the interaction model entirely.",
  cover: imageAsset("assets/projects/pl-cover.png", "https://framerusercontent.com/images/O3MxqRH8PnbSLhr3kuyO5OnOw.png"),
  hero: imageAsset("assets/projects/pl-hero.png", "https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"),
  gallery: [
    imageAsset("assets/projects/pl-hero.png", "https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"),
    imageAsset("assets/projects/pl-cover.png", "https://framerusercontent.com/images/O3MxqRH8PnbSLhr3kuyO5OnOw.png"),
  ],
  overview: {
    role: "UX Researcher & Designer",
    timeline: "3 months · Independent study",
    methods: ["Literature Review", "Survey (n=17)", "Interviews (n=5)", "Observational Research", "Thematic Analysis"],
    outcome: "Smart Basket concept · WCAG 2.1 AA kiosk UI",
  },
  sections: [
    {
      label: "01 / The Problem",
      heading: "When convenience becomes a problem",
      body: [
        "It started with a personal observation. As an international student in the UK, I struggled with Sainsbury's self-checkout machines: the confusing prompts, the unexpected error states, the bagging area that seemed to have a mind of its own. I assumed it was a cultural adjustment.",
        "But standing in a queue one afternoon, I watched local customers (people who had used these machines for years) experiencing the exact same friction. They weren't figuring it out. They were tolerating it. That shifted my question from 'why can't I figure this out?' to 'why has nobody fixed this?'",
        "Self-checkout exists to reduce operational costs. But every machine error requiring staff intervention negates that efficiency gain. Every abandoned transaction increases pressure on staffed checkouts. The problem wasn't just a usability issue. It was a quiet operational failure hiding inside a technology designed to solve operational problems.",
      ],
      stats: [
        { value: "1 in 3", label: "users required staff assistance at least once per visit" },
        { value: "47%", label: "of observed transactions triggered at least one error state" },
        { value: "3×", label: "longer average wait when a machine error required staff resolution" },
      ],
      note: "Figures from independent observational fieldwork at Sainsbury's New Cross Road over two weeks. Indicative patterns, not statistically representative.",
    },
  ],
  impact: [],
});

