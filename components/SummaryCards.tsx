"use client";

import { STATUS_META } from "@/lib/job-meta";
import type { SummaryCounts, TabId, ViewId } from "@/lib/jobs";

interface CardSpec {
  key: keyof SummaryCounts;
  label: string;
  dot: string;
  tab: TabId;
  hint?: (counts: SummaryCounts) => string | null;
}

const CARDS: CardSpec[] = [
  {
    key: "toApply",
    label: "To Apply",
    dot: STATUS_META["to-apply"].dot,
    tab: "to-apply",
    hint: (c) => {
      const parts: string[] = [];
      if (c.new) parts.push(`${c.new} new`);
      if (c.tailoring) parts.push(`${c.tailoring} tailoring`);
      return parts.length ? parts.join(" · ") : null;
    },
  },
  { key: "applied", label: "Applied", dot: STATUS_META.applied.dot, tab: "applied" },
  {
    key: "assessment",
    label: "Assessment",
    dot: STATUS_META.assessment.dot,
    tab: "assessment",
  },
  {
    key: "interview",
    label: "Interview",
    dot: STATUS_META.interview.dot,
    tab: "interview",
  },
  { key: "offer", label: "Offer", dot: STATUS_META.offer.dot, tab: "archive" },
  { key: "rejected", label: "Rejected", dot: STATUS_META.rejected.dot, tab: "archive" },
  {
    key: "newToday",
    label: "New Today",
    dot: STATUS_META.new.dot,
    tab: "today",
    hint: () => "found by today's run",
  },
];

export function SummaryCards({
  counts,
  activeTab,
  onSelect,
}: {
  counts: SummaryCounts;
  activeTab: ViewId;
  onSelect: (tab: TabId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-7">
      {CARDS.map((card) => {
        const value = counts[card.key];
        const hint = card.hint?.(counts) ?? null;
        const active = activeTab === card.tab;

        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(card.tab)}
            className={`group rounded-xl border p-3.5 text-left transition-colors ${
              active
                ? "border-line-strong bg-surface-2"
                : "border-line bg-surface hover:border-line-strong hover:bg-surface-2"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${card.dot}`} aria-hidden />
              <span className="text-muted truncate text-[11px] font-medium tracking-wide uppercase">
                {card.label}
              </span>
            </div>
            <div className="text-ink mt-2 text-2xl leading-none font-semibold tabular-nums">
              {value}
            </div>
            <div className="text-faint mt-1.5 h-3 truncate text-[11px]">{hint ?? ""}</div>
          </button>
        );
      })}
    </div>
  );
}
