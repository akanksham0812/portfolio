import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

export const plCaseStudyProject = createCaseStudyProject({
  title: "Brewing Designs for Every Drop: A Journey Through Product and Brand Innovation",
  shortTitle: "Product and Brand Innovation",
  category: "UX Case Study",
  year: "2024",
  summary:
    "A comprehensive case study showcasing how strategic product thinking and visual storytelling can elevate a brand's digital presence and user engagement.",
  cover: imageAsset("assets/projects/pl-cover.png", "https://framerusercontent.com/images/O3MxqRH8PnbSLhr3kuyO5OnOw.png"),
  hero: imageAsset("assets/projects/pl-hero.png", "https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"),
  gallery: [
    imageAsset("assets/projects/pl-hero.png", "https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"),
    imageAsset("assets/projects/pl-cover.png", "https://framerusercontent.com/images/O3MxqRH8PnbSLhr3kuyO5OnOw.png"),
  ],
  challenge:
    "The challenge was to bridge the gap between product functionality and emotional brand storytelling while maintaining a seamless user journey across digital touchpoints.",
  solution:
    "I restructured navigation around product intent, designed narrative landing modules, and introduced visual systems that bridge packaging language with digital touchpoints.",
  impact: ["Improved product discoverability", "Clearer brand voice across channels", "Frictionless mobile-first journey"],
});
