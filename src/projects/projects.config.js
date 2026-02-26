import { operationsDasboardProject } from "./data/operations-dasboard.project.js";
import { plCaseStudyProject } from "./data/pl-case-study.project.js";

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
    template: "case-study",
    access: {
      passwordProtected: false,
    },
    data: plCaseStudyProject,
  },
];
