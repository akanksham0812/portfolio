import { operationsDasboardProject } from "./data/operations-dasboard.project.js";
import { plCaseStudyProject } from "./data/pl-case-study.project.js";
import { ulioCaseStudyProject } from "./data/ulio-case-study.project.js";
import { insightsCaseStudyProject } from "./data/insights-case-study.project.js";

export const projectConfigs = [
  {
    slug: "operations-dasboard",
    routeAliases: ["operations-dashboard"],
    template: "case-study",
    access: {
      passwordProtected: true,
      envKey: "VITE_OPS_PROJECT_PASSWORD",
      devFallbackPassword: "qwerty",
    },
    data: operationsDasboardProject,
  },
  {
    slug: "pl-case-study",
    routeAliases: [],
    template: "sainsbury-usecase",
    access: {
      passwordProtected: false,
    },
    data: plCaseStudyProject,
  },
  {
    slug: "ulio-case-study",
    routeAliases: ["ulio"],
    template: "ulio-usecase",
    access: {
      passwordProtected: true,
      envKey: "VITE_OPS_PROJECT_PASSWORD",
      devFallbackPassword: "qwerty",
    },
    data: ulioCaseStudyProject,
  },
  {
    slug: "insights-case-study",
    routeAliases: ["insights"],
    template: "insights-usecase",
    access: {
      passwordProtected: false,
    },
    data: insightsCaseStudyProject,
  },
];
