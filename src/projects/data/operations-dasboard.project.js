import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

const universityOpsAssets = {
  cover: imageAsset("assets/projects/ops-cover.jpg", ""),
  hero: imageAsset("assets/projects/ulio-usecase/vendor-management-system-shot-61.png", ""),
  galleryOverview: imageAsset("assets/projects/ulio-usecase/vendor-management-system-section.png", ""),
  galleryMobile: imageAsset("assets/projects/ulio-usecase/modile_index1.png", ""),
};

export const operationsDasboardProject = createCaseStudyProject({
  title: "Designing for Scale: A University Operations Platform",
  shortTitle: "Ulio University Dashboard",
  category: "UX Case Study",
  year: "2025",
  summary:
    "Designing a multi-module university admissions platform for teams navigating record application volume, fragmented tooling, and enrollment pressure.",
  cover: universityOpsAssets.cover,
  hero: universityOpsAssets.hero,
  gallery: [
    universityOpsAssets.galleryOverview,
    universityOpsAssets.hero,
    universityOpsAssets.galleryMobile,
  ],
  challenge:
    "Admissions teams were juggling record application volume across Slate, Salesforce, Zoom, spreadsheets, and email without a unified operational view or early warning on enrollment performance.",
  solution:
    "I designed a six-module command center spanning home, analytics, management, communication, community, and trust settings to connect insight directly to action.",
  impact: ["~40% faster time-to-first-action", "3x faster campaign creation", "Lower drop-off between verification and launch"],
});
