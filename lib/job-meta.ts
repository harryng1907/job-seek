import type { ApplicationStatus } from "@/types/application";
import type { Chance, EligibilityLevel, Job, Priority } from "@/types/job";

/**
 * Presentation metadata: labels, ordering and Tailwind classes for each enum
 * value. Kept in one place so a badge looks identical wherever it is rendered.
 *
 * Class strings are written in full (never composed at runtime) so Tailwind's
 * scanner can see them.
 */

export interface BadgeStyle {
  label: string;
  className: string;
}

export const STATUS_META: Record<ApplicationStatus, BadgeStyle & { dot: string }> = {
  new: {
    label: "New",
    className: "border-sky-500/25 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
  },
  "to-apply": {
    label: "To Apply",
    className: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
    dot: "bg-indigo-400",
  },
  tailoring: {
    label: "Tailoring",
    className: "border-amber-500/25 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
  },
  applied: {
    label: "Applied",
    className: "border-blue-500/25 bg-blue-500/10 text-blue-300",
    dot: "bg-blue-400",
  },
  assessment: {
    label: "Assessment",
    className: "border-violet-500/25 bg-violet-500/10 text-violet-300",
    dot: "bg-violet-400",
  },
  interview: {
    label: "Interview",
    className: "border-teal-500/25 bg-teal-500/10 text-teal-300",
    dot: "bg-teal-400",
  },
  offer: {
    label: "Offer",
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    className: "border-rose-500/25 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400",
  },
  archived: {
    label: "Archived",
    className: "border-white/10 bg-white/5 text-zinc-400",
    dot: "bg-zinc-500",
  },
};

export const PRIORITY_META: Record<Priority, BadgeStyle> = {
  "apply-asap": {
    label: "Apply ASAP",
    className: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  },
  "worth-applying": {
    label: "Worth Applying",
    className: "border-white/10 bg-white/5 text-zinc-300",
  },
  maybe: {
    label: "Maybe",
    className: "border-white/10 bg-white/5 text-zinc-400",
  },
  skip: {
    label: "Skip",
    className: "border-white/10 bg-transparent text-zinc-500",
  },
};

/** Lower number = more urgent. Drives the Today sort. */
export const PRIORITY_ORDER: Record<Priority, number> = {
  "apply-asap": 0,
  "worth-applying": 1,
  maybe: 2,
  skip: 3,
};

export const CHANCE_META: Record<Chance, BadgeStyle> = {
  strong: { label: "Strong", className: "text-emerald-300" },
  reasonable: { label: "Reasonable", className: "text-zinc-300" },
  reach: { label: "Reach", className: "text-amber-300" },
};

export const ELIGIBILITY_META: Record<EligibilityLevel, BadgeStyle> = {
  eligible: { label: "Eligible", className: "text-emerald-300/90" },
  likely: { label: "Likely OK", className: "text-zinc-300" },
  unclear: { label: "Unconfirmed", className: "text-amber-300" },
  blocked: { label: "Blocked", className: "text-rose-300" },
};

/**
 * A job is ineligible only when a requirement is both unmeetable *and* stated
 * as hard. A *preferred* grade or an unconfirmed visa question is a weakness,
 * not a blocker, and must not be styled as one.
 */
export function isIneligible(job: Job): boolean {
  return (
    (job.visaFit.level === "blocked" && job.visaFit.hardRequirement) ||
    (job.gradeRequirement.level === "blocked" && job.gradeRequirement.hardRequirement)
  );
}

/** Short reason for the ineligible marker. */
export function blockerReason(job: Job): string | null {
  if (job.visaFit.level === "blocked" && job.visaFit.hardRequirement) {
    return job.visaFit.note;
  }
  if (job.gradeRequirement.level === "blocked" && job.gradeRequirement.hardRequirement) {
    return job.gradeRequirement.note;
  }
  return null;
}

/** Colour for the fit-score meter. Restrained on purpose. */
export function fitScoreTone(score: number): { bar: string; text: string } {
  if (score >= 8) return { bar: "bg-emerald-400/80", text: "text-emerald-300" };
  if (score >= 6) return { bar: "bg-zinc-300/70", text: "text-zinc-200" };
  return { bar: "bg-zinc-600", text: "text-zinc-400" };
}
