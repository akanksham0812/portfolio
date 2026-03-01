import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

export const insightsCaseStudyProject = createCaseStudyProject({
  title: "Insights: Sex Education Platform",
  shortTitle: "Insights",
  category: "UX Case Study",
  year: "2024",
  summary:
    "A privacy-first sex education platform designed around a single research finding: the barrier to accessing sexual health information isn't technology — it's the fear of being seen accessing it.",
  cover: imageAsset("assets/projects/insights-cover.png", ""),
  hero: imageAsset("assets/projects/insights-hero.png", ""),
  usecase: {
    // Phone mockup images for the hero section
    // phones[0] = left phone (expert profile screen)
    // phones[1] = center phone (home screen)
    // phones[2] = right phone (browse categories screen)
    phones: [
      imageAsset("assets/projects/insights-phone-1.png", ""),
      imageAsset("assets/projects/insights-phone-2.png", ""),
      imageAsset("assets/projects/insights-phone-3.png", ""),
    ],
  },
  overview: {
    role: "UX Researcher & Product Designer",
    timeline: "Mobile app (iOS)",
    methods: [
      "User Interviews",
      "Competitive Analysis",
      "Affinity Mapping",
      "HMW Statements",
      "MoSCoW",
      "Wireframing",
      "Usability Testing",
    ],
    outcome: "High-fidelity prototype",
  },
  sections: [],
  impact: [],
});
