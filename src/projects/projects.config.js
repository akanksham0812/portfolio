import { operationsDasboardProject } from "./data/designing-for-scale.project.js";
import { plCaseStudyProject } from "./data/sainsburys-smart-basket.project.js";
import { ulioCaseStudyProject } from "./data/career-mobile-app-design.project.js";
import { busrouteCaseStudyProject } from "./data/zing.project.js";

export const projectConfigs = [
  {
    slug: "designing-for-scale",
    routeAliases: ["operations-dasboard", "operations-dashboard"],
    template: "ops-usecase",
    access: {
      passwordProtected: true,
      envKey: "VITE_OPS_PROJECT_PASSWORD",
      devFallbackPassword: "qwerty",
    },
    data: operationsDasboardProject,
  },
  {
    slug: "sainsburys-smart-basket",
    routeAliases: ["pl-case-study"],
    template: "sainsbury-usecase",
    access: {
      passwordProtected: false,
    },
    data: plCaseStudyProject,
  },
  {
    slug: "career-mobile-app-design",
    routeAliases: ["ulio-case-study", "ulio"],
    template: "ulio-usecase",
    access: {
      passwordProtected: true,
      envKey: "VITE_OPS_PROJECT_PASSWORD",
      devFallbackPassword: "qwerty",
    },
    data: ulioCaseStudyProject,
  },
  {
    slug: "zing",
    routeAliases: ["busroute-case-study", "busroute"],
    template: "busroute-bh",
    access: {
      passwordProtected: false,
    },
    data: busrouteCaseStudyProject,
  },
];
