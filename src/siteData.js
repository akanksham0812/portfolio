const image = (local, remote) => ({ local, remote });

export const heroObjects = [
  {
    id: "vinyl",
    src: image("assets/hero/vinyl.png", "https://framerusercontent.com/images/eFNe9L9f8LwSxJ2OMsI6gD6jkw.png"),
    alt: "Nirvana vinyl record",
    x: 22,
    y: 20,
    w: 190,
    depth: 20,
    rotate: -8,
  },
  {
    id: "polaroid",
    src: image("assets/hero/polaroid.png", "https://framerusercontent.com/images/JOVaEpLLcxR6dL6fWp9iQVkBfQ.png"),
    alt: "Polaroid camera",
    x: 46,
    y: 19,
    w: 235,
    depth: 24,
    rotate: -2,
  },
  {
    id: "palette",
    src: image("assets/hero/palette.png", "https://framerusercontent.com/images/mPP6UFt4fMylWVYotLaQ0zjY.png"),
    alt: "Watercolor palette",
    x: 71,
    y: 21,
    w: 174,
    depth: 26,
    rotate: 13,
  },
  {
    id: "cap",
    src: image("assets/hero/cap.png", "https://framerusercontent.com/images/ruhOSYB5AJ4uQfN6v6QWf0wZ0.png"),
    alt: "Blue cap",
    x: 19,
    y: 53,
    w: 220,
    depth: 30,
    rotate: -14,
  },
  {
    id: "ball",
    src: image("assets/hero/ball.png", "https://framerusercontent.com/images/1Q1iVQFpfez0m84feM8LeOdT8.png"),
    alt: "Basketball hand",
    x: 20,
    y: 82,
    w: 188,
    depth: 28,
    rotate: -9,
  },
  {
    id: "sign",
    src: image("assets/hero/sign.png", "https://framerusercontent.com/images/NHjyY0Q43f2viA2hS8QM7OTYfTk.png"),
    alt: "Smile you are on camera sign",
    x: 44,
    y: 84,
    w: 236,
    depth: 24,
    rotate: -8,
  },
  {
    id: "disc",
    src: image("assets/hero/disc.png", "https://framerusercontent.com/images/ZrVutbg63j9wq4rdzthvqcS7X4.png"),
    alt: "Blue Nike disc",
    x: 82,
    y: 46,
    w: 156,
    depth: 20,
    rotate: 8,
  },
  {
    id: "cassette",
    src: image("assets/hero/cassette.png", "https://framerusercontent.com/images/ezS0icmwbFr4M37BMAJYMCfZx8.png"),
    alt: "Cassette tape",
    x: 81,
    y: 65,
    w: 186,
    depth: 26,
    rotate: 16,
  },
];

export const brandNames = [
  "PHILIPS",
  "Electrolux",
  "MARS",
  "verizon",
  "P&G",
  "PEPSICO",
  "MERCK",
  "DURACELL",
];

export const aboutContent = {
  image: image("assets/about/profile.jpg", "https://framerusercontent.com/images/2dGq2Dc8iLPprcwKMo8TRfce7A.jpg"),
  intro:
    "I am Akanksha Mahangere, a creative designer crafting web and product experiences with bold visual direction and practical product thinking.",
  details:
    "My work sits at the intersection of interface design, storytelling, and business clarity. I design fast, iterate with intent, and focus on details that improve how people actually use products.",
};

export const resumeBlocks = [
  {
    title: "Experience",
    items: [
      "Freelance Designer - Product, Web, and Brand Interfaces",
      "UI/UX Collaborations with startup and growth teams",
      "Concept to launch workflows using Figma, Framer, and React",
    ],
  },
  {
    title: "Core Skills",
    items: [
      "UI/UX Design",
      "Design Systems",
      "Web Design",
      "Product Storytelling",
      "Interaction Design",
    ],
  },
  {
    title: "Tools",
    items: ["Figma", "Framer", "Adobe Suite", "React", "Notion"],
  },
];
