/**
 * Job data — owned by the automated pipeline.
 *
 * Everything in this file describes a *posting*. It is the shape that the
 * future daily job-search process will produce (JSON file, API, GitHub commit
 * or Supabase table) and it is safe to overwrite wholesale on every refresh.
 *
 * Nothing the user types or decides lives here — that is `types/application.ts`.
 * Keep these types serialisable: plain strings, numbers, booleans and arrays,
 * so a refreshed payload can come straight out of `JSON.parse()`.
 */

/** How urgently the role should be actioned. Scored by the pipeline. */
export type Priority = "apply-asap" | "worth-applying" | "maybe" | "skip";

/** Honest read on how likely an application is to land. */
export type Chance = "strong" | "reasonable" | "reach";

export type EmploymentType =
  | "Graduate Program"
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship";

/** Used by the role-type filter. */
export type RoleType =
  | "Data Science"
  | "Data Engineering"
  | "Analytics"
  | "AI / ML"
  | "BI"
  | "Business Analysis"
  | "Product";

/**
 * Eligibility levels.
 *
 * `level: "blocked"` together with `hardRequirement: true` is the only
 * combination that marks a job *ineligible* — a requirement that cannot be met
 * (citizenship / PR, a hard WAM cut-off). Anything softer (a *preferred* grade,
 * an unconfirmed visa question) is a normal weakness and is shown as a note,
 * never as a blocker.
 */
export type EligibilityLevel = "eligible" | "likely" | "unclear" | "blocked";

export interface Eligibility {
  level: EligibilityLevel;
  /** `true` only when the employer states this as non-negotiable. */
  hardRequirement: boolean;
  /** Short explanation shown on the card and in the detail view. */
  note: string;
}

/** An application form question, with a suggested starting draft. */
export interface ApplicationQuestion {
  question: string;
  /** Pipeline-suggested draft. The user's own answer lives in application state. */
  suggestedDraft: string;
}

export interface Job {
  id: string;

  // --- Identity -----------------------------------------------------------
  company: string;
  title: string;
  location: string;
  employmentType: EmploymentType;
  roleType: RoleType;
  /** `null` renders as "Salary not disclosed". */
  salary: string | null;

  // --- Scoring ------------------------------------------------------------
  priority: Priority;
  /** 0–10. */
  fitScore: number;
  chance: Chance;

  // --- Eligibility --------------------------------------------------------
  visaFit: Eligibility;
  gradeRequirement: Eligibility;

  // --- Dates --------------------------------------------------------------
  /** ISO date, or `null` when the role closes on a rolling basis. */
  deadline: string | null;
  /** Context for the deadline, e.g. "Rolling — closes when filled". */
  deadlineNote?: string;
  /** ISO date the role was found. Drives the "New today" counter. */
  dateDiscovered: string;

  // --- Substance ----------------------------------------------------------
  summary: string;
  whyFit: string[];
  gaps: string[];
  /** What has to be submitted with the application. */
  submit: string[];
  /** Known assessment / interview steps. */
  assessment: string[];
  applicationUrl: string;

  // --- Suggested prep material -------------------------------------------
  // Starting points produced by the pipeline. The user's edits are stored
  // separately so a data refresh can never overwrite their writing.
  cvStrategy: string;
  suggestedTailoredSummary: string;
  suggestedCvBullets: string[];
  coverLetterNeeded: boolean;
  suggestedCoverLetterAngle: string;
  applicationQuestions: ApplicationQuestion[];
  interviewThemes: string[];
  /** Pipeline-side commentary. User notes are separate. */
  sourceNotes?: string;
}

/** One refresh of job data from the pipeline. */
export interface JobBoard {
  /** ISO timestamp written by whatever process last refreshed the data. */
  lastUpdated: string;
  jobs: Job[];
}
