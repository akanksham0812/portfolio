import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

export const busrouteCaseStudyProject = createCaseStudyProject({
  title: "zing: Designing Real-Time Transit for India's Missing Commuter Layer",
  shortTitle: "zing",
  category: "Mobile Design",
  year: "2026",
  summary:
    "A 14-week end-to-end UX project to bring live bus intelligence to India's commuters — the GPS infrastructure already exists across cities like Bengaluru and Mumbai. The consumer-facing product doesn't. This project asks why, and designs what it would take.",
  cover: imageAsset("assets/projects/zing.png", ""),
  hero: imageAsset("assets/projects/zing.png", ""),
  overview: {
    role: "Lead UX Designer",
    timeline: "iOS · Android",
    methods: [
      "Contextual Inquiry",
      "User Interviews",
      "Survey (n=620)",
      "Expert Interviews",
      "Competitive Audit",
      "Journey Mapping",
      "Usability Testing",
    ],
    outcome: "High-fidelity prototype · Civic tech pilot",
  },
  sections: [],
  impact: [],
});
