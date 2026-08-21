"use client";

import { TABS, type TabId } from "@/lib/jobs";

export function Tabs({
  active,
  counts,
  onChange,
}: {
  active: TabId;
  counts: Record<TabId, number>;
  onChange: (tab: TabId) => void;
}) {
  return (
    <nav
      className="border-line -mx-4 flex gap-1 overflow-x-auto border-b px-4 sm:mx-0 sm:px-0"
      aria-label="Pipeline stages"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex items-center gap-2 px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
              isActive ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-px text-[11px] tabular-nums ${
                isActive ? "bg-surface-2 text-muted" : "text-faint"
              }`}
            >
              {counts[tab.id]}
            </span>
            {isActive ? (
              <span className="bg-accent absolute inset-x-2 -bottom-px h-px" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
