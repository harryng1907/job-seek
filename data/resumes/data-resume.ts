import type { ResumeBase } from "@/types/resume";

/**
 * Graduate / professional CV family — Data Science, AI/ML, Data Engineering,
 * Analytics and Consulting roles.
 *
 * A family selects from the master library; it does not own content. Items left
 * out here (the retail volunteer roles, availability, working rights) are still
 * present in every configuration, just unchecked — switch them on whenever a
 * role calls for them.
 */
export const dataResume: ResumeBase = {
  id: "data",
  name: "Data / Graduate CV",
  track: "graduate",
  description:
    "Technical CV for graduate Data Science, AI/ML, Data Engineering, Analytics and consulting roles.",
  headline: "",
  contactFields: ["phone", "email", "links"],

  summary: [
    "Final-year UNSW Data Science student with hands-on experience in machine learning, Python automation and AI-assisted software development",
    "Built practical systems using Python, PostgreSQL and generative AI, alongside experience in computer vision and predictive modelling",
    "Interested in applying AI to real organisational problems while developing stronger software engineering and delivery skills",
  ].join("\n"),

  summaryVariants: [
    {
      id: "ai-delivery",
      label: "AI & delivery focus",
      source: "Data CV (z5524696 / AI project version)",
      text: [
        "Final-year UNSW Data Science student with hands-on experience in machine learning, Python automation and AI-assisted software development",
        "Built practical systems using Python, PostgreSQL and generative AI, alongside experience in computer vision and predictive modelling",
        "Interested in applying AI to real organisational problems while developing stronger software engineering and delivery skills",
      ].join("\n"),
    },
    {
      id: "analysis-modelling",
      label: "Analysis & modelling focus",
      source: "Data CV (Suncorp full / older data version)",
      text: [
        "Experience in data analysis and machine learning, including YOLO-based object detection",
        "Strong skills in Python, Excel, and SQL for data processing and analysis",
        "Hands-on experience with data cleansing, statistics modelling, and predictive modelling",
        "Ability to interpret model performance using metrics (MAE, R²)",
        "Problem solving skills with experience working on real-world datasets",
      ].join("\n"),
    },
  ],

  sectionOrder: [
    "summary",
    "education",
    "experience",
    "volunteer",
    "projects",
    "skills",
    "additional",
  ],
  sectionLabels: {
    experience: "Relevant Experience",
    volunteer: "Volunteer Experience",
    projects: "Relevant Projects",
    skills: "Technical Skills",
    additional: "Additional Information",
  },

  defaults: {
    education: ["edu-unsw-bds"],
    experience: ["exp-fpt-ai-intern"],
    volunteer: ["vol-svis-marketing"],
    projects: [
      "proj-ai-assisted-delivery",
      "proj-analytics-case-comp",
      "proj-f1-capstone",
    ],
    additional: ["add-soft-skills", "add-languages"],
  },

  skillGroupIds: [
    "skl-languages",
    "skl-ds-analytics",
    "skl-big-data",
    "skl-db-tooling",
    "skl-ai-llm",
    "skl-technical-office",
  ],

  bulletChoice: {
    "edu-unsw-bds": "full",
    "exp-fpt-ai-intern": "default",
    "vol-svis-marketing": "data",
    "proj-ai-assisted-delivery": "full-stack",
    "proj-analytics-case-comp": "consulting",
    "proj-f1-capstone": "default",
    "add-languages": "fluent",
  },
};
