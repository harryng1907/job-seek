import type { ResumeBase } from "@/types/resume";

/**
 * Part-time / income CV family — retail, customer service, sales assistant,
 * campus and hospitality roles.
 *
 * Drawn from the same master library as the data family, but with different
 * selections, ordering and emphasis: the Arc @UNSW roles lead as *experience*
 * (which is how the retail CV presents them), technical projects are off, and
 * working rights plus availability are on, because part-time employers ask.
 */
export const retailResume: ResumeBase = {
  id: "retail",
  name: "Retail / Part-time CV",
  track: "part-time",
  description:
    "Customer-facing CV for retail, customer service, sales assistant and campus roles.",
  headline: "Retail Sales Assistant",
  contactFields: ["phone", "email", "location"],

  summary:
    "Customer-focused Retail Sales Assistant with 1+ years of experience in fast-paced retail and customer service environments. Skilled in store operations, product recommendations, visual merchandising, and maintaining efficient customer service. Confident supporting customers with styling, sizing, and sales assistance in busy retail settings.",

  summaryVariants: [
    {
      id: "retail-standard",
      label: "Retail sales assistant",
      source: "Retail CV",
      text: "Customer-focused Retail Sales Assistant with 1+ years of experience in fast-paced retail and customer service environments. Skilled in store operations, product recommendations, visual merchandising, and maintaining efficient customer service. Confident supporting customers with styling, sizing, and sales assistance in busy retail settings.",
    },
  ],

  // No projects section — the retail CV does not carry one.
  sectionOrder: [
    "summary",
    "skills",
    "volunteer",
    "experience",
    "education",
    "additional",
  ],
  sectionLabels: {
    // The retail CV lists the Arc roles under "Experience".
    volunteer: "Experience",
    experience: "Other Experience",
    skills: "Skills",
    additional: "Additional Information",
  },

  defaults: {
    education: ["edu-unsw-bds"],
    experience: ["exp-fpt-creative-assistant"],
    volunteer: ["vol-arc-checkpoint", "vol-arc-foodhub", "vol-svis-marketing"],
    projects: [],
    additional: ["add-languages", "add-work-rights", "add-availability"],
  },

  skillGroupIds: ["skl-retail-hard", "skl-retail-soft"],

  bulletChoice: {
    "edu-unsw-bds": "minimal",
    "vol-arc-checkpoint": "default",
    "vol-arc-foodhub": "default",
    "vol-svis-marketing": "retail",
    "exp-fpt-creative-assistant": "retail",
    "add-languages": "fluent",
  },
};
