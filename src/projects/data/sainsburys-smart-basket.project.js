import { imageAsset } from "../imageAsset.js";
import { createCaseStudyProject } from "../template/caseStudy.template.js";

export const plCaseStudyProject = createCaseStudyProject({
  title: "Sainsbury's Smart Basket: Redesigning Self-Checkout Through Mixed-Methods Research",
  shortTitle: "Sainsbury's Smart Basket",
  category: "UX Research & Design",
  year: "2023",
  summary:
    "Three-month mixed-methods research into the operational failure modes of supermarket self-checkout. Observational fieldwork across 47 transactions, survey (n=17), and semi-structured interviews (n=5) identified three systemic failure patterns. Resulting concept shifts the interaction model from reactive error-handling to proactive guidance, validated against WCAG 2.1 AA and tested with 4 users.",
  cover: imageAsset("assets/projects/1%20sains.jpg", "https://framerusercontent.com/images/O3MxqRH8PnbSLhr3kuyO5OnOw.png"),
  hero: imageAsset("assets/projects/pl-hero.png", "https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"),
  gallery: [
    imageAsset("assets/projects/pl-hero.png", "https://framerusercontent.com/images/X3w8GYe6W5nU7Dc3B7XkSRbww.png"),
    imageAsset("assets/projects/pl-cover.png", "https://framerusercontent.com/images/O3MxqRH8PnbSLhr3kuyO5OnOw.png"),
  ],
  overview: {
    role: "UX Researcher & Designer. Sole researcher. Responsible for research strategy, participant recruitment, fieldwork, synthesis, concept design, and usability testing.",
    timeline: "3 months · Independent study",
    methods: [
      "Literature Review",
      "Observational Fieldwork (n=47 transactions)",
      "Survey (n=17)",
      "Semi-structured Interviews (n=5, saturation reached at 4)",
      "Thematic Analysis",
      "Usability Testing (concept validation, n=4)",
    ],
    outcome:
      "Smart Basket concept validated · WCAG 2.1 AA across all components · 3/4 participants completed full checkout without staff assistance in usability testing",
  },
  sections: [
    {
      label: "01 / Research Approach",
      heading: "Separating perception from behaviour",
      body: [
        "Self-reported frustration is unreliable. People normalise friction they experience repeatedly. A multi-method design was used where each layer challenged the assumptions of the last.",
        "Literature review established the theoretical frame: known failure modes of Self-Service Technology, accessibility requirements for kiosk interfaces, and the operational economics of retail automation. Output was a hypothesis set, not a blank slate.",
        "Survey (n=17): scoped to perceived error frequency and stated workarounds. Directional signal only at this sample size. Primary function was as a recruitment filter for interviews.",
        "Semi-structured interviews (n=5). Thematic saturation reached after the fourth participant. No new failure patterns emerged in the fifth. Protocol focused on specific incident recall over general opinion, to reduce post-hoc rationalisation.",
        "Observational fieldwork across 47 live transactions, the anchor of the study. Error states consistently traced back to two interaction points: the bagging area weight sensor and unlabelled produce.",
      ],
    },
    {
      label: "02 / The Problem",
      heading: "When convenience becomes a quiet operational failure",
      body: [
        "Self-checkout was designed to reduce operational cost. At Sainsbury's New Cross Road, 47 observed transactions showed it failing at that purpose. 1 in 3 required staff intervention, and checkout time was 3x longer whenever it did.",
        "The failure is not user error. Experienced shoppers with years of self-checkout use hit the same friction patterns as first-time users. Error rates are a function of the interaction model, not user capability. That is a product problem, not a training problem.",
        "The research question followed from that framing: not how to help users navigate a broken system, but what a self-checkout interaction model looks like that does not generate these errors in the first place.",
        "Two weeks of live observational fieldwork at Sainsbury's New Cross Road established the baseline. 47 transactions logged across morning, afternoon, and evening slots. The goal was not to find edge cases. It was to characterise what normal use actually produces.",
      ],
      stats: [
        {
          value: "1 in 3",
          label: "transactions required staff assistance, 47 observed across 10 sessions",
        },
        {
          value: "47%",
          label: "of observed transactions triggered at least one error state requiring user action or staff intervention",
        },
        {
          value: "3×",
          label: "longer average transaction time when staff intervention was required vs. uninterrupted checkout",
        },
      ],
      note:
        "Observational fieldwork at Sainsbury's New Cross Road. 10 sessions over 2 weeks, stratified across morning, afternoon, and evening slots. Structured observation sheet. Sample is indicative. Statistical significance requires multi-store, longitudinal data.",
    },
    {
      label: "03 / Key Findings",
      heading: "Three failure patterns, one compounding chain",
      body: [
        "Four research methods, same three failure patterns. Each one compounds the next. Together they explain why 47% of observed transactions hit an error state.",
        "First: the bagging area is a black box. Weight discrepancies produce a generic error with no recovery path. 61% of observed error states originated here.",
        "Second: unlabelled produce creates an unsupported lookup task. The terminal requires exact product name or PLU code, an unreasonable barrier for users with low digital literacy or those operating in a second language.",
        "Third: error resolution is binary. The machine either works or it escalates to staff. No intermediate self-recovery state exists.",
      ],
    },
    {
      label: "04 / Design Response",
      heading: "From reactive errors to proactive guidance",
      body: [
        "Design principle: every error state the current system generates should become a guided interaction in the redesign. The objective is not to reduce errors. It is to ensure users can resolve them without staff.",
        "Three changes to the core interaction model. A bagging area status indicator surfaces real-time weight feedback before an error is triggered, replacing opacity with visible system state. A visual produce finder replaces PLU text lookup with image recognition and category browsing, removing the literacy and knowledge dependency. A tiered recovery flow adds a self-service resolution path for the three highest-frequency error types before escalating to staff.",
        "All components designed to WCAG 2.1 AA. Contrast ratios, touch targets (44x44px minimum), and reading level audited throughout. Kiosk interfaces are disproportionately used by people with visual impairments, motor difficulties, and low digital literacy. Accessibility is not a compliance layer. It is the correct default for this surface.",
      ],
    },
    {
      label: "05 / Validation",
      heading: "Validating with the highest-friction users",
      body: [
        "The design addressed three identified failure patterns. The question was whether it actually worked for the users those patterns affected most, not in principle, but in a real task with a real prototype.",
        "Task: check out a basket including two unlabelled produce items and one item that would trigger a weight discrepancy in the live system. Think-aloud protocol throughout.",
        "3 of 4 participants completed full checkout without staff assistance. The bagging area status indicator eliminated all weight-related errors. No participant triggered a weight error they could not self-resolve.",
        "n=4 is directionally useful, not statistically significant. Production validation requires a larger sample, A/B testing against the live system, and instrumented error-rate tracking.",
      ],
    },
    {
      label: "06 / What It Would Take to Ship",
      heading: "This is where the real design work begins",
      body: [
        "The concept tested well. The harder question is what it would actually take to ship, and that is where the real constraints emerge. Independent research removes one variable that matters in production: organisational friction.",
        "The bagging area status indicator is a hardware dependency. Vendor alignment and a firmware update cycle mean a 6-12 month lead time minimum.",
        "The visual produce finder requires a trained ML model on Sainsbury's product range, maintained as inventory rotates. An ongoing MLOps commitment, not a one-time build.",
        "The tiered recovery flow changes staff operational model. Self-service error resolution needs piloting with store managers before rollout.",
        "Recommended first ship: the bagging area status indicator only. Highest-frequency failure pattern, lowest dependency, and an immediate measurable signal to justify the broader investment.",
      ],
    },
  ],
  impact: [
    {
      value: "47",
      label: "live transactions observed across 10 fieldwork sessions",
    },
    {
      value: "3/4",
      label: "usability test participants completed checkout without staff assistance",
    },
    {
      value: "61%",
      label: "of observed error states attributed to bagging area, the primary design intervention point",
    },
    {
      value: "WCAG 2.1 AA",
      label: "accessibility standard met across all UI components",
    },
  ],
});
