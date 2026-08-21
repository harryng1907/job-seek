"use client";

import { TRACK_VIEWS, type TrackView } from "@/lib/jobs";

/**
 * Switches between the two job searches.
 *
 * They are separate searches with separate scoring, so they get a separate
 * control rather than another status tab. "All" shows both, but the cards stay
 * labelled by track because the scores still are not comparable.
 */
export function TrackFilter({
  active,
  counts,
  onChange,
}: {
  active: TrackView;
  counts: Record<TrackView, number>;
  onChange: (track: TrackView) => void;
}) {
  return (
    <div className="border-line bg-surface inline-flex items-center gap-0.5 rounded-lg border p-0.5">
      {TRACK_VIEWS.map((view) => {
        const isActive = view.id === active;
        return (
          <button
            key={view.id}
            type="button"
            onClick={() => onChange(view.id)}
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs whitespace-nowrap transition-colors ${
              isActive
                ? "bg-surface-2 text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {view.label}
            <span
              className={`text-[11px] tabular-nums ${isActive ? "text-muted" : "text-faint"}`}
            >
              {counts[view.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
