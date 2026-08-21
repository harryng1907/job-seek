import type { Job } from "@/types/job";

/**
 * Application state — owned by the user, never by the pipeline.
 *
 * This is the half of the model that must survive a job-data refresh. It is
 * keyed by `Job["id"]` and persisted locally (localStorage today, a user row in
 * Supabase later). The daily job-search process may add, update or drop
 * postings freely; it must never write into this file's shapes.
 */

/** The manual pipeline the user moves a job through. */
export type ApplicationStatus =
  | "new"
  | "to-apply"
  | "tailoring"
  | "applied"
  | "assessment"
  | "interview"
  | "offer"
  | "rejected"
  | "archived";

/** One transition, appended whenever the status changes. */
export interface StatusEvent {
  status: ApplicationStatus;
  /** ISO date, e.g. "2026-08-14". */
  date: string;
  note?: string;
}

/** The user's own answer to an application question, by question index. */
export type QuestionAnswers = Record<number, string>;

export interface ApplicationState {
  jobId: string;
  status: ApplicationStatus;

  /**
   * Set when the application is stalled on something external — e.g. an
   * English test result. Rendered as a prominent WAITING flag, independent of
   * status so the job still sits in the right pipeline column.
   */
  waitingOn?: string | null;

  /** ISO date the user applied, if they have. */
  appliedOn?: string | null;

  // --- User-authored prep -------------------------------------------------
  // Each of these overrides the pipeline's suggestion when non-empty. Empty
  // string means "not written yet, show the suggestion".
  tailoredSummary: string;
  cvTweaks: string;
  coverLetter: string;
  interviewPrep: string;
  answers: QuestionAnswers;
  /** Checklist state for required documents, keyed by the document label. */
  documents: Record<string, boolean>;
  notes: string;

  history: StatusEvent[];
  /** ISO timestamp of the last manual edit. */
  updatedAt: string;
}

/** A posting joined to the user's state — what every component renders. */
export interface TrackedJob extends Job {
  state: ApplicationState;
}

/** Persisted store: application state for every job the user has touched. */
export type ApplicationStateMap = Record<string, ApplicationState>;
