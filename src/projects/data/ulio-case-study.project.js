import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

const ulioUsecaseAssets = {
  hero: imageAsset("assets/projects/ulio-usecase/modile_index1.png", ""),
  cover: imageAsset("assets/projects/ulio-usecase/modile_index1.png", ""),
  uiMockup: imageAsset("assets/projects/ulio-usecase/vendor-management-system-shot-61.png", ""),
  medal: imageAsset("assets/projects/ulio-usecase/medal.png", ""),
  calendar: imageAsset("assets/projects/ulio-usecase/calendar.png", ""),
  flower: imageAsset("assets/projects/ulio-usecase/flower.png", ""),
};

export const ulioCaseStudyProject = createCaseStudyProject({
  title: "Ulio: Career Mobile App Design",
  shortTitle: "Ulio",
  category: "Product Design",
  year: "2024",
  summary:
    "A mobile-first product case study showcasing brand, research, and UI decisions for Ulio.",
  cover: ulioUsecaseAssets.cover,
  hero: ulioUsecaseAssets.hero,
  usecase: {
    hero: {
      kicker: "Ulio",
      title: "Career Mobile App Design",
      index: "01/11",
      // lines: ["Understand.", "Learn.", "Inspire.", "Outshine."],
    },
    about: {
      label: "About Ulio",
      index: "02/11",
      body:
        "ULIO is an AI-powered personal development platform that transforms how you build habits, achieve goals, and unlock your potential. Combining intelligent coaching, behavioral science, and adaptive learning, ULIO creates a personalized growth journey that evolves with you.",
      tags: ["Analytics", "UX Design", "Concept", "UI Design"],
    },
    brandCards: {
      leftTags: ["AI Counselor", "Resume Builder", "Career Forecast"],
    },
    research: {
      title: "User Research & Analysis",
      primaryTitle: "Primary Users",
      secondaryTitle: "Secondary Users",
      primary: [
        "Students in Grades 8-12 Building Life Skills",
        "Teens Experiencing Academic Stress, Social Pressure, or Identity Exploration",
        "Goal-Oriented Students Seeking Achievement And Personal Growth",
        "Digital-Native Youth Preferring AI-Assisted Personal Development",
      ],
      secondary: [
        "School Counselors And Educators Supporting Students Career Journey",
        "Parents Guiding Teens Through Career Developmental Years",
        "Students Hesitant To Seek Traditional Counseling Or Mentorship",
        "Schools And Youth Organizations Promoting Career Development",
      ],
    },
    painPoints: {
      label: "Mind",
      title: "User Needs & Pain Points",
      index: "05/11",
      leftLabel: "Pain Points",
      rightLabel: "Solutions",
      items: [
        "Overwhelming Academic And Social Pressure With Limited Support Systems",
        "Lack Of Tools That Feel Age-Appropriate - Too Childish Or Too Clinical",
        "Burnout From Trying To Balance Everything Without Sustainable Strategies",
      ],
      solutions: [
        "AI-Powered Goal Framework - Breaks Down Overwhelming Goals Into Achievable Daily Actions",
        "24/7 AI Counselor - On-Demand Support For Motivation, Guidance, And Accountability",
        "Connect With Others On Similar Growth Journeys",
      ],
    },
    typography: {
      label: "Typography & Color",
      index: "06/11",
      quote:
        "Poppins is a geometric sans-serif with clean, friendly proportions inspired by international typographic style. Its balanced structure and excellent readability make it a versatile choice for both display and body text across digital interfaces.",
      font: "Poppins",
      weights: ["Regular", "Medium", "Semibold", "Bold"],
    },
    palette: [
      { hex: "#D93E2E" },
      { hex: "#106CA6" },
      { hex: "#33ACA5" },
      { hex: "#2C109F" },
      { hex: "#FCE8E8" },
      { hex: "#FFFFFF" },
    ],
    uiShowcase: {
      headline: "UNDERSTAND.\nLEARN.\nINSPIRE.\nOUTSHINE.",
      subheadline: "UNDERSTAND.\nLEARN.\nINSPIRE.\nOUTSHINE.",
      mockup: ulioUsecaseAssets.uiMockup,
    },
    footer: {
      preface: "I could tell you more, but then I'd have to redact you. 🤫",
      thanks: "Thank you for\nscrolling through!",
    },
    assets: {
      heroMockup: ulioUsecaseAssets.hero,
      medal: ulioUsecaseAssets.medal,
      calendar: ulioUsecaseAssets.calendar,
      flower: ulioUsecaseAssets.flower,
    },
  },
});
