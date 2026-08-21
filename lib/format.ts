/**
 * Formatting helpers.
 *
 * Every formatter pins locale and time zone so the server render and the client
 * render produce byte-identical output — otherwise React reports a hydration
 * mismatch the first time a date crosses midnight in one zone and not the other.
 */

const LOCALE = "en-AU";
const TIME_ZONE = "Australia/Sydney";

/** "21 Aug" */
export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** "21 Aug 2026" */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** "21 Aug 2026, 8:15 am" */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** Calendar date in Sydney as "YYYY-MM-DD". */
export function toISODate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  // en-CA formats as YYYY-MM-DD, which is exactly the shape we store.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);
}

/** Whole days from `from` to `to`. Negative when `to` is in the past. */
export function daysBetween(from: string, to: string): number {
  const start = Date.parse(`${from.slice(0, 10)}T00:00:00Z`);
  const end = Date.parse(`${to.slice(0, 10)}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

export type DeadlineTone = "overdue" | "urgent" | "soon" | "normal" | "none";

export interface DeadlineInfo {
  label: string;
  tone: DeadlineTone;
  daysLeft: number | null;
}

/** Human deadline text plus an urgency tone for styling. */
export function describeDeadline(
  deadline: string | null,
  deadlineNote: string | undefined,
  today: string,
): DeadlineInfo {
  if (!deadline) {
    return { label: deadlineNote ?? "No deadline listed", tone: "none", daysLeft: null };
  }

  const daysLeft = daysBetween(today, deadline);

  if (daysLeft < 0) {
    return { label: `Closed ${formatDay(deadline)}`, tone: "overdue", daysLeft };
  }
  if (daysLeft === 0) {
    return { label: "Closes today", tone: "urgent", daysLeft };
  }
  if (daysLeft === 1) {
    return { label: "Closes tomorrow", tone: "urgent", daysLeft };
  }
  if (daysLeft <= 7) {
    return { label: `${daysLeft} days left`, tone: "urgent", daysLeft };
  }
  if (daysLeft <= 14) {
    return { label: `${formatDay(deadline)} · ${daysLeft} days`, tone: "soon", daysLeft };
  }
  return { label: formatDay(deadline), tone: "normal", daysLeft };
}

/** Salary, or a clean fallback when the posting does not disclose one. */
export function formatSalary(salary: string | null): string {
  return salary ?? "Salary not disclosed";
}
