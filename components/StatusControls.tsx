"use client";

import { ArrowRight, Check } from "lucide-react";
import { STATUS_FLOW, isClosed } from "@/lib/application-state";
import { STATUS_META } from "@/lib/job-meta";
import type { ApplicationStatus } from "@/types/application";

const ALL_STATUSES = Object.keys(STATUS_META) as ApplicationStatus[];

/** The next stage in the manual pipeline, or `null` at the end of it. */
export function nextStatus(status: ApplicationStatus): ApplicationStatus | null {
  const index = STATUS_FLOW.indexOf(status);
  if (index === -1 || index === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[index + 1];
}

/**
 * Compact control for the job card: advance one stage, or jump anywhere via the
 * select. Status is user-owned, so this writes to application state only.
 */
export function QuickStatusActions({
  status,
  onChange,
}: {
  status: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
}) {
  const next = nextStatus(status);

  return (
    <div className="flex items-center gap-1.5">
      {next ? (
        <button
          type="button"
          onClick={() => onChange(next)}
          className="border-line bg-surface-2 text-muted hover:text-ink hover:border-line-strong inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
        >
          {STATUS_META[next].label}
          <ArrowRight className="h-3 w-3" />
        </button>
      ) : null}

      <label className="sr-only" htmlFor={`status-${status}`}>
        Change status
      </label>
      <select
        id={`status-${status}`}
        value={status}
        onChange={(event) => onChange(event.target.value as ApplicationStatus)}
        className="border-line bg-surface-2 text-muted hover:text-ink hover:border-line-strong cursor-pointer rounded-lg border px-2 py-1.5 text-xs transition-colors outline-none"
      >
        {ALL_STATUSES.map((value) => (
          <option key={value} value={value}>
            {STATUS_META[value].label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Full pipeline stepper for the detail view. Stages before the current one are
 * shown as complete; every stage stays clickable so a mistake is one click to
 * undo.
 */
export function StatusStepper({
  status,
  onChange,
}: {
  status: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
}) {
  const closed = isClosed(status);
  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1">
        {STATUS_FLOW.map((stage, index) => {
          const isCurrent = stage === status;
          const isDone = !closed && currentIndex > index;
          const meta = STATUS_META[stage];

          return (
            <div key={stage} className="flex items-center">
              <button
                type="button"
                onClick={() => onChange(stage)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                  isCurrent
                    ? meta.className
                    : isDone
                      ? "border-line bg-surface-2 text-muted"
                      : "border-line/70 bg-transparent text-faint hover:text-muted hover:border-line"
                }`}
              >
                {isDone ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isCurrent ? meta.dot : "bg-line-strong"
                    }`}
                    aria-hidden
                  />
                )}
                {meta.label}
              </button>
              {index < STATUS_FLOW.length - 1 ? (
                <span className="bg-line mx-1 h-px w-2" aria-hidden />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-faint text-[11px]">Outcome:</span>
        {(["rejected", "archived"] as ApplicationStatus[]).map((stage) => {
          const isCurrent = stage === status;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => onChange(stage)}
              className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                isCurrent
                  ? STATUS_META[stage].className
                  : "border-line/70 text-faint hover:text-muted hover:border-line"
              }`}
            >
              {STATUS_META[stage].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
