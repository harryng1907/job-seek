import { jobBoard } from "@/data/jobs";
import { seedApplicationState } from "@/data/application-state";
import { isClosed } from "@/lib/application-state";
import { daysBetween, toISODate } from "@/lib/format";
import { PRIORITY_ORDER, isIneligible } from "@/lib/job-meta";
import type { ApplicationStateMap, ApplicationStatus, TrackedJob } from "@/types/application";
import type { JobBoard } from "@/types/job";

/**
 * Data access + the selectors the dashboard renders from.
 *
 * `getJobBoard()` is the single swap point for the future automation: point it
 * at a JSON file, a GitHub raw URL, an API route or Supabase and nothing else
 * in the app changes. It is async today for exactly that reason.
 */
export async function getJobBoard(): Promise<JobBoard> {
  return jobBoard;
}

/** Seed user state. Replaced by localStorage as soon as the client hydrates. */
export async function getSeedApplicationState(): Promise<ApplicationStateMap> {
  return seedApplicationState;
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export type TabId =
  | "today"
  | "to-apply"
  | "applied"
  | "assessment"
  | "interview"
  | "archive";

export const TABS: { id: TabId; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "to-apply", label: "To Apply" },
  { id: "applied", label: "Applied" },
  { id: "assessment", label: "Assessment" },
  { id: "interview", label: "Interview" },
  { id: "archive", label: "Archive" },
];

/** Which manual statuses each tab collects. `today` is computed separately. */
const TAB_STATUSES: Record<Exclude<TabId, "today">, ApplicationStatus[]> = {
  "to-apply": ["new", "to-apply", "tailoring"],
  applied: ["applied"],
  assessment: ["assessment"],
  interview: ["interview"],
  archive: ["offer", "rejected", "archived"],
};

export function isNewToday(job: TrackedJob, today: string): boolean {
  return toISODate(job.dateDiscovered) === today;
}

/**
 * "Today" is the action list: anything still open that is either un-actioned,
 * newly found, or closing within a week.
 */
export function isForToday(job: TrackedJob, today: string): boolean {
  if (isClosed(job.state.status)) return false;

  const preApplication: ApplicationStatus[] = ["new", "to-apply", "tailoring"];
  if (preApplication.includes(job.state.status)) return true;
  if (isNewToday(job, today)) return true;

  if (job.deadline) {
    const daysLeft = daysBetween(today, job.deadline);
    if (daysLeft >= 0 && daysLeft <= 7) return true;
  }
  return false;
}

export function jobsForTab(jobs: TrackedJob[], tab: TabId, today: string): TrackedJob[] {
  if (tab === "today") return jobs.filter((job) => isForToday(job, today));
  return jobs.filter((job) => TAB_STATUSES[tab].includes(job.state.status));
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

export interface JobFilters {
  search: string;
  companies: string[];
  locations: string[];
  roleTypes: string[];
  minFitScore: number;
  statuses: ApplicationStatus[];
  hideIneligible: boolean;
}

export const EMPTY_FILTERS: JobFilters = {
  search: "",
  companies: [],
  locations: [],
  roleTypes: [],
  minFitScore: 0,
  statuses: [],
  hideIneligible: false,
};

export function countActiveFilters(filters: JobFilters): number {
  return (
    filters.companies.length +
    filters.locations.length +
    filters.roleTypes.length +
    filters.statuses.length +
    (filters.minFitScore > 0 ? 1 : 0) +
    (filters.hideIneligible ? 1 : 0)
  );
}

export function filterJobs(jobs: TrackedJob[], filters: JobFilters): TrackedJob[] {
  const query = filters.search.trim().toLowerCase();

  return jobs.filter((job) => {
    if (query) {
      const haystack = `${job.company} ${job.title}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.companies.length && !filters.companies.includes(job.company)) return false;
    if (filters.locations.length && !filters.locations.includes(job.location)) return false;
    if (filters.roleTypes.length && !filters.roleTypes.includes(job.roleType)) return false;
    if (filters.statuses.length && !filters.statuses.includes(job.state.status)) return false;
    if (job.fitScore < filters.minFitScore) return false;
    if (filters.hideIneligible && isIneligible(job)) return false;
    return true;
  });
}

/** Distinct filter options, derived from the data rather than hard-coded. */
export function filterOptions(jobs: TrackedJob[]) {
  const unique = (values: string[]) => Array.from(new Set(values)).sort();
  return {
    companies: unique(jobs.map((job) => job.company)),
    locations: unique(jobs.map((job) => job.location)),
    roleTypes: unique(jobs.map((job) => job.roleType)),
  };
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

/** Priority first, then fit score — the order the Today list is specified in. */
export function sortByPriorityThenFit(jobs: TrackedJob[]): TrackedJob[] {
  return [...jobs].sort((a, b) => {
    // Ineligible roles always sink, whatever they score.
    const blockedDiff = Number(isIneligible(a)) - Number(isIneligible(b));
    if (blockedDiff !== 0) return blockedDiff;

    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;

    // Soonest deadline breaks the remaining ties; rolling roles go last.
    const aDeadline = a.deadline ?? "9999-12-31";
    const bDeadline = b.deadline ?? "9999-12-31";
    return aDeadline.localeCompare(bDeadline);
  });
}

/** Most recently touched first — the right order for stages already in motion. */
export function sortByRecentActivity(jobs: TrackedJob[]): TrackedJob[] {
  return [...jobs].sort((a, b) => b.state.updatedAt.localeCompare(a.state.updatedAt));
}

export function sortForTab(jobs: TrackedJob[], tab: TabId): TrackedJob[] {
  if (tab === "today" || tab === "to-apply") return sortByPriorityThenFit(jobs);
  return sortByRecentActivity(jobs);
}

// ---------------------------------------------------------------------------
// Summary counts
// ---------------------------------------------------------------------------

export interface SummaryCounts {
  toApply: number;
  new: number;
  tailoring: number;
  applied: number;
  assessment: number;
  interview: number;
  offer: number;
  rejected: number;
  newToday: number;
}

export function summarise(jobs: TrackedJob[], today: string): SummaryCounts {
  const count = (status: ApplicationStatus) =>
    jobs.filter((job) => job.state.status === status).length;

  return {
    toApply: count("new") + count("to-apply") + count("tailoring"),
    new: count("new"),
    tailoring: count("tailoring"),
    applied: count("applied"),
    assessment: count("assessment"),
    interview: count("interview"),
    offer: count("offer"),
    rejected: count("rejected"),
    newToday: jobs.filter((job) => isNewToday(job, today)).length,
  };
}

export function tabCounts(jobs: TrackedJob[], today: string): Record<TabId, number> {
  return TABS.reduce(
    (acc, tab) => {
      acc[tab.id] = jobsForTab(jobs, tab.id, today).length;
      return acc;
    },
    {} as Record<TabId, number>,
  );
}
