import type {
  ApplicationState,
  ApplicationStateMap,
  ApplicationStatus,
  StatusEvent,
  TrackedJob,
} from "@/types/application";
import type { Job } from "@/types/job";

/**
 * The user-owned half of the model.
 *
 * Job data is replaced wholesale on every pipeline refresh; application state
 * is keyed by job id and is only ever written by the user. `mergeJobsWithState`
 * is the join, and it is deliberately one-directional: incoming job data can
 * never clobber a status, a draft or a note.
 *
 * Persistence is localStorage for now. Swapping in Supabase means changing
 * `loadStateMap` / `saveStateMap` only.
 */

export const STORAGE_KEY = "job-seek.application-state.v1";

/** Order of the manual pipeline, used for the stepper and for sorting. */
export const STATUS_FLOW: ApplicationStatus[] = [
  "new",
  "to-apply",
  "tailoring",
  "applied",
  "assessment",
  "interview",
  "offer",
];

/** Statuses that take a job out of the active pipeline. */
export const CLOSED_STATUSES: ApplicationStatus[] = [
  "offer",
  "rejected",
  "archived",
];

export function isClosed(status: ApplicationStatus): boolean {
  return CLOSED_STATUSES.includes(status);
}

/** A blank state for a job the user has not touched yet. */
export function createApplicationState(
  jobId: string,
  overrides: Partial<ApplicationState> = {},
): ApplicationState {
  return {
    jobId,
    status: "new",
    waitingOn: null,
    appliedOn: null,
    tailoredSummary: "",
    cvTweaks: "",
    coverLetter: "",
    interviewPrep: "",
    answers: {},
    documents: {},
    notes: "",
    history: [],
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Join postings to user state.
 *
 * Jobs with no stored state get a fresh `new` record. State whose job has
 * disappeared from the feed is left untouched in the store — if the posting
 * comes back, so does the user's work.
 */
export function mergeJobsWithState(
  jobs: Job[],
  states: ApplicationStateMap,
): TrackedJob[] {
  return jobs.map((job) => ({
    ...job,
    state: states[job.id] ?? createApplicationState(job.id),
  }));
}

/** Move a job to a new status, appending to its history. */
export function withStatus(
  state: ApplicationState,
  status: ApplicationStatus,
  today: string,
  note?: string,
): ApplicationState {
  if (state.status === status) return state;

  const event: StatusEvent = { status, date: today, note };
  return {
    ...state,
    status,
    appliedOn:
      status === "applied" && !state.appliedOn ? today : state.appliedOn,
    // Moving forward clears a "waiting on" flag — it belonged to the old stage.
    waitingOn: isClosed(status) ? null : state.waitingOn,
    history: [...state.history, event],
    updatedAt: new Date().toISOString(),
  };
}

/** Patch any user-authored field. */
export function withPatch(
  state: ApplicationState,
  patch: Partial<ApplicationState>,
): ApplicationState {
  return { ...state, ...patch, updatedAt: new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

/**
 * Read the stored map. Returns `null` when there is nothing saved (or when
 * called on the server) so callers can fall back to the seed.
 */
export function loadStateMap(): ApplicationStateMap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ApplicationStateMap;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    // Corrupt or unavailable storage should never break the dashboard.
    return null;
  }
}

export function saveStateMap(states: ApplicationStateMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {
    // Quota or private-mode failures are non-fatal.
  }
}

/**
 * Merge the seed into stored state.
 *
 * Stored entries always win — the seed only fills in jobs the user has never
 * seen, which is what happens when the pipeline adds a posting.
 */
export function hydrateStateMap(
  seed: ApplicationStateMap,
  stored: ApplicationStateMap | null,
): ApplicationStateMap {
  if (!stored) return seed;
  return { ...seed, ...stored };
}
