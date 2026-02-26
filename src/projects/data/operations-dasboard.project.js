import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

export const operationsDasboardProject = createCaseStudyProject({
  title: "From Firefighting to Foresight with an Operations Intelligence Hub",
  shortTitle: "Operations Intelligence Hub",
  category: "Product Design",
  year: "2024",
  summary:
    "A complete redesign of operation workflows that transforms real-time incident response into proactive, data-driven decision-making.",
  cover: imageAsset("assets/projects/ops-cover.jpg", "https://framerusercontent.com/images/9mlMP0RPbGpi8L0VDqfSD9W6ve4.jpg"),
  hero: imageAsset("assets/projects/ops-hero.png", "https://framerusercontent.com/images/WuHozxnyRSOE6LWB1s6Jfe5zz4.png"),
  gallery: [
    imageAsset("assets/projects/ops-hero.png", "https://framerusercontent.com/images/WuHozxnyRSOE6LWB1s6Jfe5zz4.png"),
    imageAsset("assets/projects/ops-board.png", "https://framerusercontent.com/images/DCbc4g6QHc84Yf53f8QzL0jIyg.png"),
    imageAsset("assets/projects/ops-cover.jpg", "https://framerusercontent.com/images/9mlMP0RPbGpi8L0VDqfSD9W6ve4.jpg"),
  ],
  challenge:
    "The existing system was highly reactive, with teams spending significant time resolving issues after they occurred. This led to delayed response times, fragmented communication across departments, and an inability to identify operational bottlenecks before escalation.",
  solution:
    "I designed a modular command-center experience with priority signal cards, timeline-based anomaly tracking, and quick filters for region, line, and severity.",
  impact: ["62% faster incident triage", "Single source of truth for ops reviews", "Higher trust in data quality"],
});
