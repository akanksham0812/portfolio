const BASE_URL = import.meta.env.BASE_URL || "/";

export const withBase = (path) => {
  if (!path || /^https?:\/\//.test(path) || path.startsWith("data:")) {
    return path;
  }
  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
};

export const resolveImage = (image) => {
  if (typeof image === "string") {
    return { primary: withBase(image), fallback: null };
  }

  if (!image || typeof image !== "object") {
    return { primary: "", fallback: null };
  }

  const local = withBase(image.local || "");
  const remote = image.remote || "";
  const primary = local || remote;
  const fallback = image.remote && image.remote !== primary ? image.remote : null;

  return { primary, fallback };
};
