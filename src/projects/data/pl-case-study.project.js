import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

export const plCaseStudyProject = createCaseStudyProject({
  title: "Sainsbury's Smart Basket: Redesigning Self-Checkout Through Mixed-Methods Research",
  shortTitle: "Sainsbury's Smart Basket",
  category: "UX Research & Design",
  year: "2024",
  summary:
    "A three-month independent study into the hidden failures of supermarket self-checkout — combining surveys, interviews, and live observational fieldwork to design a concept that changes the interaction model entirely.",
  cover: imageAsset("assets/projects/pl-cover.png", "https://framerusercontent.com/images/O3MxqRH8PnbSLhr3kuyO5OnOw.png"),
  hero: imageAsset("assets/projects/pl-hero.png", "https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"),
  gallery: [
    imageAsset("assets/projects/pl-hero.png", "https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"),
    imageAsset("assets/projects/pl-cover.png", "https://framerusercontent.com/images/O3MxqRH8PnbSLhr3kuyO5OnOw.png"),
  ],
  overview: {
    role: "UX Researcher & Designer",
    timeline: "3 months · Independent study",
    methods: ["Literature Review", "Survey (n=17)", "Interviews (n=5)", "Observational Research", "Thematic Analysis"],
    outcome: "Smart Basket concept · WCAG 2.1 AA kiosk UI",
  },
  sections: [
    {
      label: "01 / The Problem",
      heading: "When convenience becomes a problem",
      body: [
        "It started with a personal observation. As an international student in the UK, I struggled with Sainsbury's self-checkout machines — the confusing prompts, the unexpected error states, the bagging area that seemed to have a mind of its own. I assumed it was a cultural adjustment.",
        "But standing in a queue one afternoon, I watched local customers — people who had used these machines for years — experiencing the exact same friction. They weren't figuring it out. They were tolerating it. That shifted my question from 'why can't I figure this out?' to 'why has nobody fixed this?'",
        "Self-checkout exists to reduce operational costs. But every machine error requiring staff intervention negates that efficiency gain. Every abandoned transaction increases pressure on staffed checkouts. The problem wasn't just a usability issue — it was a quiet operational failure hiding inside a technology designed to solve operational problems.",
      ],
      stats: [
        { value: "1 in 3", label: "users required staff assistance at least once per visit" },
        { value: "47%", label: "of observed transactions triggered at least one error state" },
        { value: "3×", label: "longer average wait when a machine error required staff resolution" },
      ],
      note: "Figures from independent observational fieldwork at Sainsbury's New Cross Road over two weeks. Indicative patterns — not statistically representative.",
    },
    {
      label: "02 / Research Approach",
      heading: "Why one method was never going to be enough",
      body: [
        "People's reported experience and their actual behaviour are often very different. Someone who says 'it's fine, I manage' in a survey might be the same person who calls for staff assistance three times in a single transaction. I needed methods that could catch both.",
        "Every data collection decision was preceded by the question: is this ethical, and can I justify it?",
      ],
      items: [
        { title: "Literature Review", description: "Academic papers and industry reports on Self-Service Technology adoption, failure modes, and human factors." },
        { title: "User Survey (n=17)", description: "Quantitative satisfaction data across four SST dimensions: Convenience, Reliability, Speed of Service, and Customisation." },
        { title: "In-Depth Interviews (n=5)", description: "Semi-structured interviews surfacing emotional and contextual dimensions — the frustration, embarrassment, and workarounds users had developed." },
        { title: "Observational Research", description: "Two weeks at Sainsbury's New Cross Road documenting error frequency, staff intervention rates, and normalised behavioural workarounds." },
        { title: "Thematic Analysis + Affinity Mapping", description: "All qualitative data coded and mapped across sources. Only themes appearing consistently across multiple methods were taken forward." },
      ],
    },
    {
      label: "03 / Key Findings",
      heading: "Four themes. One compounding failure chain.",
      body: "Reliability failures make error recovery critical. Poor error recovery increases staff dependency. Staff dependency defeats the purpose of self-checkout. Physical design compounds everything.",
      items: [
        { title: "System Reliability", description: "Machines froze and crashed unpredictably — particularly during Nectar card scanning and payment. Users called for help multiple times within a single transaction." },
        { title: "Unclear Error Recovery", description: "When errors occurred, messaging was ambiguous. Users didn't know what action to take, leading to paralysis, embarrassment, and inevitable staff dependency." },
        { title: "Poor Physical Design", description: "The bagging area was too small and awkwardly positioned. Users constantly collided with carts or dropped items due to spatial misalignment." },
        { title: "Staff Dependency", description: "Every reliability failure and every unclear error state led to the same outcome: waiting for staff. The machine's promise of autonomy was consistently broken." },
      ],
    },
    {
      label: "04 / Design Response",
      heading: "Rethinking the checkout from the basket up",
      body: [
        "The problem wasn't the screen — it was the process. Scanning each item individually at a fixed terminal creates all four failure modes simultaneously: physical contortion, multi-task cognitive load, frequent errors, and staff dependency.",
        "The Smart Basket is a sensor-embedded basket that automatically identifies items as they're placed inside it. By the time the customer reaches the terminal, scanning is already done. They arrive to confirm and pay — not to scan.",
      ],
      items: [
        { title: "Move scanning to the basket", description: "Terminal becomes confirmation + payment only — one task at a time. Eliminates the primary source of errors." },
        { title: "Transparency over assumption", description: "Confirmation screen shows every item with explicit 'Confirmed' status. Trust built through visibility, not hope." },
        { title: "Flag weighted items proactively", description: "Estimated-weight items flagged before payment. User confirms or removes — no machine error, no staff needed." },
        { title: "Escape route always visible", description: "'Call for Assistance' always on screen with live staff availability indicator. Never hidden, never a last resort." },
        { title: "WCAG 2.1 AA throughout", description: "All touch targets minimum 44×44px. Colour never the sole status indicator — satisfies WCAG 1.4.1." },
      ],
    },
    {
      label: "05 / What I'd Measure",
      heading: "No live product — but I know exactly what success looks like",
      body: "One of the most important things a senior designer can demonstrate is knowing how they'd measure impact.",
      items: [
        { title: "Staff intervention rate", description: "Transactions requiring staff assistance before vs after. Every intervention avoided is a cost reduction and queue improvement." },
        { title: "Transaction completion rate", description: "Percentage completing self-checkout without abandoning to a staffed till. Abandonment is the clearest signal of system failure." },
        { title: "Average transaction time", description: "End-to-end time under Smart Basket vs current system. Hypothesis: significant reduction for baskets over 8 items." },
        { title: "User trust and satisfaction", description: "Post-transaction survey (max 2 questions). Follow-up interviews at 4-week intervals to track whether trust builds or breaks with repeated use." },
      ],
    },
    {
      label: "06 / Reflection",
      heading: "What I'd do differently — and what this taught me",
      items: [
        { title: "Recruit more participants from the start", description: "17 survey responses and 5 interviews gave consistent qualitative insight, but I was cautious about quantitative claims throughout — rightly so." },
        { title: "Ethical fieldwork in public spaces is genuinely hard", description: "The difficulty forced me to be more rigorous and intentional than a controlled lab would have. It made me a more careful, more creative researcher." },
        { title: "My initial assumption was the most valuable data point", description: "Assuming the problem was cultural unfamiliarity was wrong. Recognising and testing that assumption is exactly what good research is for." },
        { title: "This needs co-design with engineering", description: "Sensor accuracy, basket hygiene, returns, age-restricted items — implementation requires deep cross-functional collaboration. This is a direction, not a specification." },
        { title: "One screen is not a design system", description: "The confirmation screen is one moment in a longer service journey. A complete solution covers the full flow from basket to receipt." },
      ],
    },
  ],
  impact: [
    "Eliminated item-by-item scanning — the primary trigger of errors and staff interventions",
    "Confirmation screen shows every item with explicit scan status — trust through transparency",
    "Weighted items flagged before payment — no machine error, no staff needed",
    "Assistance button always visible with live staff availability indicator",
    "WCAG 2.1 AA compliant throughout · 44×44px touch targets · colour never sole status indicator",
  ],
});