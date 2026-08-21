"use client";

import {
  Banknote,
  Briefcase,
  CalendarClock,
  ExternalLink,
  GraduationCap,
  MapPin,
  Minus,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkle,
  TimerReset,
} from "lucide-react";
import { Badge, MetaChip, PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { FitScore } from "@/components/ui/FitScore";
import { QuickStatusActions } from "@/components/StatusControls";
import { describeDeadline, formatDay, formatSalary } from "@/lib/format";
import { ELIGIBILITY_META, blockerReason, isIneligible } from "@/lib/job-meta";
import { isNewToday } from "@/lib/jobs";
import type { ApplicationStatus, TrackedJob } from "@/types/application";

const DEADLINE_TONE: Record<string, string> = {
  overdue: "text-rose-300",
  urgent: "text-orange-300",
  soon: "text-amber-300/90",
  normal: "text-muted",
  none: "text-faint",
};

export function JobCard({
  job,
  today,
  onOpen,
  onStatusChange,
}: {
  job: TrackedJob;
  today: string;
  onOpen: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
}) {
  const blocked = isIneligible(job);
  const blocker = blockerReason(job);
  const deadline = describeDeadline(job.deadline, job.deadlineNote, today);
  const urgent = job.priority === "apply-asap" && !blocked;

  // The whole card is the click target; interactive children stop propagation.
  const stop = (event: React.MouseEvent) => event.stopPropagation();

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      aria-label={`${job.company} — ${job.title}`}
      className={`group bg-surface hover:border-line-strong hover:bg-surface-2/70 min-w-0 cursor-pointer rounded-xl border p-4 transition-colors ${
        blocked
          ? "border-line border-l-2 border-l-rose-500/50 opacity-75 hover:opacity-100"
          : urgent
            ? "border-line border-l-2 border-l-orange-400/70"
            : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={job.state.status} />
            <PriorityBadge priority={job.priority} />
            {job.state.waitingOn ? (
              <Badge
                className="border-amber-500/30 bg-amber-500/10 text-amber-300"
                title={job.state.waitingOn}
              >
                <TimerReset className="h-3 w-3" />
                Waiting
              </Badge>
            ) : null}
            {blocked ? (
              <Badge
                className="border-rose-500/30 bg-rose-500/10 text-rose-300"
                title={blocker ?? undefined}
              >
                <ShieldAlert className="h-3 w-3" />
                Ineligible
              </Badge>
            ) : null}
            {isNewToday(job, today) ? (
              <Badge className="border-sky-500/25 bg-sky-500/10 text-sky-300">
                <Sparkle className="h-3 w-3" />
                New today
              </Badge>
            ) : null}
          </div>

          <h3 className="mt-2.5 truncate text-[15px] font-medium">
            <span className="text-ink">{job.company}</span>
            <span className="text-faint mx-1.5">·</span>
            <span className="text-muted group-hover:text-ink transition-colors">
              {job.title}
            </span>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <MetaChip icon={<MapPin className="h-3 w-3 shrink-0" />}>
              {job.location}
            </MetaChip>
            <MetaChip icon={<Briefcase className="h-3 w-3 shrink-0" />}>
              {job.employmentType}
            </MetaChip>
            <MetaChip
              icon={<Banknote className="h-3 w-3 shrink-0" />}
              className={job.salary ? "text-muted" : "text-faint italic"}
            >
              {formatSalary(job.salary)}
            </MetaChip>
            <MetaChip
              icon={<CalendarClock className="h-3 w-3 shrink-0" />}
              className={DEADLINE_TONE[deadline.tone]}
            >
              {deadline.label}
            </MetaChip>
            <MetaChip
              icon={<Sparkle className="h-3 w-3 shrink-0" />}
              className="text-faint"
              title="Date discovered"
            >
              Found {formatDay(job.dateDiscovered)}
            </MetaChip>
          </div>
        </div>

        <FitScore score={job.fitScore} chance={job.chance} />
      </div>

      {/* Eligibility — hard blockers read differently from soft preferences. */}
      <div className="border-line mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t pt-3">
        <MetaChip
          icon={
            job.visaFit.level === "blocked" ? (
              <ShieldAlert className="h-3 w-3 shrink-0" />
            ) : (
              <ShieldCheck className="h-3 w-3 shrink-0" />
            )
          }
          className={ELIGIBILITY_META[job.visaFit.level].className}
          title={job.visaFit.note}
        >
          Visa: {ELIGIBILITY_META[job.visaFit.level].label}
          {job.visaFit.hardRequirement && job.visaFit.level === "blocked"
            ? " (hard requirement)"
            : ""}
        </MetaChip>
        <MetaChip
          icon={<GraduationCap className="h-3 w-3 shrink-0" />}
          className={ELIGIBILITY_META[job.gradeRequirement.level].className}
          title={job.gradeRequirement.note}
        >
          Grades: {ELIGIBILITY_META[job.gradeRequirement.level].label}
          {!job.gradeRequirement.hardRequirement &&
          job.gradeRequirement.level !== "eligible"
            ? " (preferred)"
            : ""}
        </MetaChip>
      </div>

      {/* The most important content stays visible without opening the job. */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <ul className="space-y-1">
          {job.whyFit.slice(0, 2).map((reason, i) => (
            <li key={i} className="text-muted flex gap-2 text-xs leading-relaxed">
              <Plus className="mt-[3px] h-3 w-3 shrink-0 text-emerald-400/70" />
              <span className="line-clamp-2">{reason}</span>
            </li>
          ))}
        </ul>
        <ul className="space-y-1">
          {job.gaps.slice(0, 2).map((gap, i) => (
            <li key={i} className="text-faint flex gap-2 text-xs leading-relaxed">
              <Minus className="mt-[3px] h-3 w-3 shrink-0 text-amber-400/60" />
              <span className="line-clamp-2">{gap}</span>
            </li>
          ))}
        </ul>
      </div>

      {job.state.waitingOn ? (
        <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-1.5 text-xs text-amber-200/90">
          Waiting on: {job.state.waitingOn}
        </p>
      ) : null}

      {blocked && blocker ? (
        <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-2.5 py-1.5 text-xs text-rose-200/90">
          {blocker}
        </p>
      ) : null}

      <div
        className="mt-3.5 flex flex-wrap items-center justify-between gap-2"
        onClick={stop}
      >
        <QuickStatusActions status={job.state.status} onChange={onStatusChange} />
        <div className="flex items-center gap-3">
          {job.state.notes ? (
            <span className="text-faint hidden max-w-[220px] truncate text-[11px] lg:block">
              {job.state.notes}
            </span>
          ) : null}
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted hover:text-ink inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            Apply
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
