import type { ResumeItem, ResumeProfile, SkillGroup } from "@/types/resume";

/**
 * The master source library.
 *
 * Every entry below was extracted from the user's own CV PDFs. Nothing here is
 * invented or strengthened: where two versions describe the same role with
 * different but equally truthful wording, both wordings are kept as separate
 * bullet sets.
 *
 * Where versions genuinely disagreed on a fact, the user has confirmed which is
 * correct and only that version is kept — inflated or incorrect dates,
 * organisations, durations and metrics are not preserved. The superseded
 * wording is recorded in `sourceNote` as an audit trail, never as a live
 * option. `conflicts` stays in the model for future imports.
 *
 * Source versions referenced below:
 *   "Data CV"        — z5524696 / Suncorp (FULL) / Resume — the data-track CVs
 *   "AI project CV"  — the version leading with the AI-assisted application
 *   "Mixed CV"       — other(old)/mixed, which carries the FPT placement + Arc roles
 *   "Retail CV"      — Resumes CV/retail, the retail sales assistant version
 */

/**
 * Contact details are deliberately placeholders.
 *
 * This file is destined for a public GitHub repo once the automation lands, so
 * the real phone number, email and address live in the browser instead: fill
 * them in under "Contact details" in the CV Builder and they are stored in
 * localStorage only (`job-seek.cv-profile.v1`), never in git.
 */
export const placeholderProfile: ResumeProfile = {
  name: "Your Name",
  email: "your.email@example.com",
  phone: "+61 4XX XXX XXX",
  location: "Sydney, NSW",
  links: [{ label: "LinkedIn", url: "linkedin.com/in/your-handle" }],
};

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

const education: ResumeItem[] = [
  {
    id: "edu-unsw-bds",
    title: "Bachelor of Data Science & Decisions",
    organisation: "UNSW Sydney (University of New South Wales)",
    dates: "February 2024 – December 2026 (expected)",
    location: "Kensington, NSW",
    tags: ["education", "unsw"],
    sourceNote:
      "Confirmed canonical: February 2024 – December 2026 (expected). An older retail CV showed Feb 2023 and one data CV showed 'Present'; both are superseded.",
    bulletSets: [
      {
        id: "full",
        label: "Full — major, scholarship, coursework",
        source: "Data CV",
        bullets: [
          "Major in Computational Data Science",
          "Scholarship: International Student Award",
          "Relevant coursework: Machine Learning, Algorithm Design and Analysis, Data Science and Decisions in Practice, Database Systems, Big Data Management",
        ],
      },
      {
        id: "minimal",
        label: "Minimal — degree line only",
        source: "Retail CV",
        bullets: [],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

const experience: ResumeItem[] = [
  {
    id: "exp-fpt-ai-intern",
    title: "AI Intern — Computer Vision",
    organisation: "FPT Telecom",
    dates: "December 2025 – February 2026",
    location: "Vietnam",
    tags: ["ai", "ml", "computer-vision", "python"],
    bulletSets: [
      {
        id: "default",
        label: "Standard wording",
        source: "Data CV (all versions)",
        bullets: [
          "Labelled and processed ~1,800 images to build multi-class object detection dataset",
          "Trained YOLO-based model using Python, achieving ~94% mAP@0.5 on validation set",
          "Analysed model performance using precision-recall and F1-confidence curves",
          "Identified class imbalance issues affecting performance (lower accuracy in underrepresented classes)",
          "Improved data quality and model outputs to support more accurate real world object detection",
          "Tuned confidence thresholds (~0.32 optimal) to balance precision and recall",
        ],
      },
      {
        id: "short",
        label: "Short — three bullets",
        source: "Condensed from the same wording",
        bullets: [
          "Labelled and processed ~1,800 images to build multi-class object detection dataset",
          "Trained YOLO-based model using Python, achieving ~94% mAP@0.5 on validation set",
          "Tuned confidence thresholds (~0.32 optimal) to balance precision and recall",
        ],
      },
    ],
  },
  {
    id: "exp-fpt-creative-assistant",
    title: "Creative Assistant / Marketing Placement",
    organisation: "FPT Telecom",
    dates: "June 2022 – August 2022",
    location: "Vietnam",
    tags: ["marketing", "design", "adobe", "retail"],
    sourceNote:
      "Confirmed canonical entity and dates: FPT Telecom, Jun–Aug 2022. The retail CV's 'Marketing Internship — FPT Corporation, June 2023 – August 2024' described the same work with a different organisation, a longer duration and a '250+ ads' figure; that version is superseded and is not kept as an option.",
    bulletSets: [
      {
        id: "default",
        label: "Standard wording",
        source: "Mixed CV",
        bullets: [
          "Created short promotional ads and visual content for marketing campaigns",
          "Utilised Adobe Suite (Photoshop, Illustrator, Premiere Pro) to produce design assets",
        ],
      },
      {
        id: "retail",
        label: "Customer-facing wording",
        source: "Retail CV wording, corrected to the real entity and dates",
        bullets: [
          "Created short promotional ads and visual content for marketing campaigns, supporting brand visibility and customer engagement",
          "Produced promotional assets aligned with brand standards using Adobe Photoshop, Illustrator and Premiere Pro",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Volunteer / community
// ---------------------------------------------------------------------------

const volunteer: ResumeItem[] = [
  {
    id: "vol-arc-checkpoint",
    title: "Volunteer — Checkpoint, Arc @UNSW",
    organisation: "Arc @UNSW",
    dates: "May 2026 – Present",
    location: "Kensington, NSW",
    tags: ["retail", "customer-service", "campus"],
    sourceNote:
      "Confirmed canonical: ongoing (May 2026 – Present), and the conservative 300+ students/day figure over the 500+ used on one version. Raise the figure only if you can defend it.",
    bulletSets: [
      {
        id: "default",
        label: "Standard wording",
        source: "Mixed CV (conservative figure)",
        bullets: [
          "Delivered friendly customer service to 300+ students daily while assisting with product selection and recommendations",
          "Enhanced the student experience by delivering approachable, customer-focused wellbeing support and fostering a welcoming campus environment",
          "Replenished stock, organised displays, tagged products, and maintained visual presentation standards",
          "Supported inventory flow and daily operational tasks in a busy retail environment",
        ],
      },
      {
        id: "short",
        label: "Short — two bullets",
        source: "Condensed from the same wording",
        bullets: [
          "Delivered friendly customer service to 300+ students daily while assisting with product selection and recommendations",
          "Replenished stock, organised displays, tagged products, and maintained visual presentation standards",
        ],
      },
    ],
  },
  {
    id: "vol-arc-foodhub",
    title: "Volunteer — Food Hub, Arc @UNSW",
    organisation: "Arc @UNSW",
    dates: "September 2025 – Present",
    location: "Kensington, NSW",
    tags: ["retail", "customer-service", "campus"],
    sourceNote:
      "Confirmed canonical: 500+ customers per shift. The 1000+ figure on one retail version is superseded — 500+ is the number to stand behind.",
    bulletSets: [
      {
        id: "default",
        label: "Standard wording",
        source: "Mixed CV (defensible figure)",
        bullets: [
          "Assisted 500+ customers per shift with product recommendations and responsive customer service in a fast-paced retail environment",
          "Collaborated with volunteer team of 30 people to set up, run, and pack down distribution hub",
          "Maintained store cleanliness, product presentation, and stock organisation during busy trading periods",
          "Completed 70+ service hours for official AHEGS recognition",
        ],
      },
      {
        id: "short",
        label: "Short — two bullets",
        source: "Condensed from the same wording",
        bullets: [
          "Assisted 500+ customers per shift with product recommendations and responsive customer service in a fast-paced retail environment",
          "Completed 70+ service hours for official AHEGS recognition",
        ],
      },
    ],
  },
  {
    id: "vol-svis-marketing",
    title: "Marketing Subcommittee",
    organisation: "Society of Vietnamese International Students at UNSW",
    dates: "March 2025 – Present",
    location: "Kensington, NSW",
    tags: ["marketing", "communication", "teamwork"],
    bulletSets: [
      {
        id: "data",
        label: "Data-CV wording — design and collaboration",
        source: "Data CV",
        bullets: [
          "Designed and edited promotional posters for events and campaigns",
          "Collaborated with marketing team to plan event rollouts and social media materials",
          "Developed creative communication strategies to boost student engagement",
        ],
      },
      {
        id: "retail",
        label: "Retail-CV wording — reach and growth metrics",
        source: "Retail CV",
        bullets: [
          "Managed Facebook & Instagram content strategy, achieving +300% reach and +160% follower growth",
          "Coordinated merchandise design and promotional campaigns, supporting customer engagement and product sales during student events",
          "Collaborate with a 5-member team to deliver campaigns on schedule, strengthening engagement outcomes",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

const projects: ResumeItem[] = [
  {
    id: "proj-ai-assisted-delivery",
    title: "AI-Assisted Software Delivery",
    organisation: "Independent Solo Full-Stack Project",
    dates: "March 2026 – Present",
    tags: ["ai", "llm", "automation", "postgresql", "software"],
    sourceNote:
      'Also titled "Independent AI-Assisted Application Project" on one version, with the organisation given as "Independent Project".',
    bulletSets: [
      {
        id: "full-stack",
        label: "Full-stack / delivery wording",
        source: "Data CV (Suncorp full)",
        bullets: [
          "Constructed an end-to-end, full-stack application (PostgreSQL backend, Godot frontend, Analytics Dashboard) using AI-assisted software delivery workflows to drastically reduce development time",
          "Leveraged generative AI to write, refactor, and document Python automation scripts, demonstrating ability to review, test, and improve AI-generated code prior to deployment",
          "Engineered Python-based automation pipelines to parse and validate thousands of legacy JSON files, automating complex migration of unstructured data into a strictly relational PostgreSQL database",
          "Applied structured problem-solving to design a robust database architecture isolated live production data from unreleased features, ensuring high maintainability and data governance",
        ],
      },
      {
        id: "independent",
        label: "Plainer independent-project wording",
        source: "AI project CV",
        bullets: [
          "Developed an end-to-end application using Godot, PostgreSQL and Python automation, supported by AI-assisted development workflows",
          "Leveraged generative AI to write, refactor and document Python automation scripts, reviewing, testing and improving AI-generated code before integration",
          "Engineered Python automation pipelines to parse and validate thousands of JSON files, automating the migration of semi-structured data into a relational PostgreSQL database",
          "Designed a database architecture separating live data from unreleased features, improving maintainability and reducing risk of unintended data changes",
        ],
      },
    ],
  },
  {
    id: "proj-analytics-case-comp",
    title: "Business Analytics Case Competition | 1st Place Winner",
    organisation: "UNSW DataSoc × Accenture",
    dates: "July 2026 – August 2026",
    tags: ["analytics", "consulting", "people-analytics", "python"],
    bulletSets: [
      {
        id: "consulting",
        label: "Consulting wording — drivers and evidence",
        source: "Data CV (z5524696)",
        bullets: [
          "Built an end-to-end People Analytics solution for a 12,000-employee enterprise simulated across 4 relational datasets (13k+ employees, 1.4k exits, 5 survey waves)",
          "Executed the Double Diamond consulting framework: cleaned and merged multi-system legacy HR data in Python, resolving 18% survey non-response bias through rigorous hypothesis testing (p = 0.824)",
          "Developed a multivariate logistic regression model to identify key attrition drivers, finding evidence of structural pay compression among 1st-Year HiPos and Level 3 employees (7.3% compa-ratio deficit)",
          'Pitched a data-backed "Progression & Equity" pilot to an Accenture judge panel, winning 1st place for analytical rigor and commercial viability',
        ],
      },
      {
        id: "technical",
        label: "Technical wording — hotspots and modelling",
        source: "Mixed CV / Suncorp full",
        bullets: [
          "Developed an end-to-end People Analytics solution for a 12,000-employee enterprise simulated across 4 relational datasets (13k+ employees, 1.4k exits, 5 survey waves)",
          "Executed the Double Diamond consulting framework: cleaned and merged multi-system legacy HR data in Python, resolving 18% survey non-response bias through rigorous hypothesis testing (p = 0.824)",
          "Engineered a multivariate logistic regression model isolating key regrettable attrition hotspots, uncovering 1st-Year HiPos and Level 3 employees suffered from structural pay compression (7.3% compa-ratio deficit)",
          'Pitched a data-backed "Progression & Equity" pilot to an Accenture judge panel, winning 1st place for analytical rigor and commercial viability',
        ],
      },
    ],
  },
  {
    id: "proj-f1-capstone",
    title: "F1 Performance Analytics & Modelling (DATA3001 Capstone)",
    organisation: "UNSW",
    dates: "September 2025 – December 2025",
    tags: ["ml", "analytics", "python", "modelling"],
    bulletSets: [
      {
        id: "default",
        label: "Standard wording",
        source: "Data CV (all versions)",
        bullets: [
          "Cleansed and processed telemetry dataset, handling missing values and removing outliers (IQR method)",
          "Built statistics and machine learning models (OLS, Random Forest, XGBoost) to predict lap performance",
          "Identified key performance drivers (e.g. speed, braking, positioning) and translated findings into actionable insights for lap time optimisation",
          "Evaluated models using cross-validation, MAE, and R², and applied SHAP to interpret key performance drivers",
          "Developed optimisation framework (COBYLA) to simulate optimal driver actions and minimise lap time in team environment",
          "Interpreted data analysis results and supported communication of insights within project team",
        ],
      },
      {
        id: "short",
        label: "Short — four bullets",
        source: "Condensed from the same wording",
        bullets: [
          "Cleansed and processed telemetry dataset, handling missing values and removing outliers (IQR method)",
          "Built statistics and machine learning models (OLS, Random Forest, XGBoost) to predict lap performance",
          "Evaluated models using cross-validation, MAE, and R², and applied SHAP to interpret key performance drivers",
          "Devised optimisation framework (COBYLA) to simulate optimal driver actions and minimise lap time in team environment",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Additional information
// ---------------------------------------------------------------------------

const additional: ResumeItem[] = [
  {
    id: "add-work-rights",
    title: "Working rights",
    organisation: "",
    dates: "",
    tags: ["visa"],
    bulletSets: [
      {
        id: "default",
        label: "Standard wording",
        source: "Data CV / Retail CV",
        bullets: [
          "Student Visa (Subclass 500), 48 hours per fortnight work restriction",
        ],
      },
    ],
  },
  {
    id: "add-availability",
    title: "Availability",
    organisation: "",
    dates: "",
    tags: ["availability", "retail"],
    bulletSets: [
      {
        id: "default",
        label: "Standard wording",
        source: "Retail CV",
        bullets: [
          "Full availability including weekends, late-night trading, and public holidays",
        ],
      },
    ],
  },
  {
    id: "add-languages",
    title: "Languages",
    organisation: "",
    dates: "",
    tags: ["languages"],
    sourceNote:
      "Confirmed canonical: 'English (Fluent)'. The '8.0 IELTS' wording on two versions relies on a result that has since expired and is not kept as an option.",
    bulletSets: [
      {
        id: "fluent",
        label: "Standard wording",
        source: "Data CV (z5524696) / Retail CV",
        bullets: ["Vietnamese (Native), English (Fluent)"],
      },
    ],
  },
  {
    id: "add-soft-skills",
    title: "Soft skills",
    organisation: "",
    dates: "",
    tags: ["soft-skills"],
    bulletSets: [
      {
        id: "default",
        label: "Standard wording",
        source: "Data CV",
        bullets: [
          "Communication, Team collaboration, Time management, Attention to detail, Problem-solving skills",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Skill groups
// ---------------------------------------------------------------------------

const skillGroups: SkillGroup[] = [
  {
    id: "skl-languages",
    label: "Languages",
    tags: ["data"],
    skills: ["Python (Proficient)", "SQL (PostgreSQL, SQLite, SparkSQL)", "Bash/Shell", "C"],
  },
  {
    id: "skl-ds-analytics",
    label: "Data Science & Analytics",
    tags: ["data"],
    skills: ["Pandas", "NumPy", "Scikit-Learn", "Statsmodels", "SciPy", "Matplotlib", "Seaborn"],
  },
  {
    id: "skl-big-data",
    label: "Big Data & Distributed Systems",
    tags: ["data"],
    skills: ["Apache Spark (PySpark)", "Hadoop", "MapReduce (mrjob)", "HDFS"],
  },
  {
    id: "skl-db-tooling",
    label: "Databases & Tooling",
    tags: ["data"],
    skills: ["PostgreSQL (psycopg2)", "Git/GitHub", "Jupyter Notebooks"],
  },
  {
    id: "skl-ai-llm",
    label: "AI & LLM Orchestration",
    tags: ["data", "ai"],
    skills: [
      "LangChain",
      "LLM API Integration",
      "AI-Assisted Software Delivery",
      "YOLO / Computer Vision",
    ],
  },
  {
    id: "skl-technical-office",
    label: "Technical",
    tags: ["data", "retail"],
    skills: [
      "Maple",
      "Microsoft Office Suite (Word, PowerPoint and Excel)",
      "Canva",
      "Adobe Suite",
    ],
  },
  {
    id: "skl-retail-hard",
    label: "Hard Skills (Tools & Tech)",
    tags: ["retail"],
    skills: [
      "Cash handling systems",
      "Stock replenishment & inventory support",
      "Customer engagement & upselling",
      "Online channel retail platforms (Shopify, Amazon)",
      "Microsoft Office (Excel, Word, PowerPoint)",
      "Visual merchandising & store presentation",
      "Sales & KPI tracking",
    ],
  },
  {
    id: "skl-retail-soft",
    label: "Soft Skills (Work Style)",
    tags: ["retail"],
    skills: [
      "Luxury customer service mindset",
      "Relationship building",
      "Communication",
      "Team collaboration",
      "Time management",
      "Attention to detail",
      "Problem-solving skills",
    ],
  },
  {
    id: "skl-soft-general",
    label: "Soft skills",
    tags: ["data", "retail"],
    skills: [
      "Communication",
      "Team collaboration",
      "Time management",
      "Attention to detail",
      "Problem-solving skills",
    ],
  },
  {
    id: "skl-spoken",
    label: "Languages spoken",
    tags: ["data", "retail"],
    skills: ["Vietnamese (Native)", "English (Fluent)"],
  },
];

export const libraryItems = { education, experience, volunteer, projects, additional };
export const librarySkillGroups = skillGroups;

/** Every conflict in the library, for the builder's warning panel. */
export function collectConflicts(): { id: string; title: string; conflicts: string[] }[] {
  const all = [...education, ...experience, ...volunteer, ...projects, ...additional];
  const fromItems = all
    .filter((item) => item.conflicts?.length)
    .map((item) => ({ id: item.id, title: item.title, conflicts: item.conflicts ?? [] }));
  const fromSkills = skillGroups
    .filter((group) => group.conflicts?.length)
    .map((group) => ({
      id: group.id,
      title: group.label,
      conflicts: group.conflicts ?? [],
    }));
  return [...fromItems, ...fromSkills];
}
