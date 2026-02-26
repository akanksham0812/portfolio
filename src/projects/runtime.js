import { projectConfigs } from "./projects.config.js";

const resolveProjectPassword = (accessConfig) => {
  if (!accessConfig?.passwordProtected) {
    return "";
  }

  const envKey = accessConfig.envKey || "";
  const envPassword = envKey ? (import.meta.env[envKey] || "").trim() : "";

  if (envPassword) {
    return envPassword;
  }

  if (import.meta.env.DEV && accessConfig.devFallbackPassword) {
    return accessConfig.devFallbackPassword;
  }

  return "";
};

const buildRuntimeProject = (config, order) => {
  const accessConfig = config.access || {};
  const password = resolveProjectPassword(accessConfig);

  return {
    ...config.data,
    slug: config.slug,
    order,
    template: config.template || "case-study",
    access: {
      passwordProtected: Boolean(accessConfig.passwordProtected),
      password,
    },
  };
};

export const projects = projectConfigs
  .map((config, index) => buildRuntimeProject(config, index))
  .sort((a, b) => a.order - b.order);

export const projectBySlug = Object.fromEntries(projects.map((project) => [project.slug, project]));

export const projectRoutes = projectConfigs.flatMap((config) => {
  const aliases = config.routeAliases || [];
  const paths = [config.slug, ...aliases];

  return paths.map((path) => ({
    path,
    canonicalSlug: config.slug,
  }));
});

export const getProjectBySlug = (slug) => projectBySlug[slug] || null;

export const isProjectPasswordProtected = (slug) => Boolean(projectBySlug[slug]?.access?.passwordProtected);

export const getProjectPassword = (slug) => projectBySlug[slug]?.access?.password || "";
