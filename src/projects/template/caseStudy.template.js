export const createCaseStudyProject = (overrides) => ({
  title: "",
  shortTitle: "",
  category: "UX Case Study",
  year: "2024",
  summary: "",
  cover: "",
  hero: "",
  gallery: [],
  // Overview bar — role, timeline, methods, outcome
  overview: {
    role: "",
    timeline: "",
    methods: [],
    outcome: "",
  },
  // Main sections — array of { heading, body } objects
  sections: [],
  // Legacy fields kept for backward compatibility
  challenge: "",
  solution: "",
  impact: [],
  ...overrides,
});