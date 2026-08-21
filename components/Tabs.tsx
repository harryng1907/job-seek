"use client";

import { FileUser } from "lucide-react";
import { TABS, type TabId, type ViewId } from "@/lib/jobs";

export function Tabs({
  active,
  counts,
  onChange,
}: {
  active: ViewId;
  counts: Record<TabId, number>;
  onChange: (view: ViewId) => void;
}) {
  return (
    <nav
      className="border-line -mx-4 flex gap-1 overflow-x-auto border-b px-4 sm:mx-0 sm:px-0"
      aria-label="Views"
    >
      {TABS.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          count={counts[tab.id]}
          isActive={tab.id === active}
          onClick={() => onChange(tab.id)}
        />
      ))}

      {/* The CV builder is a tool rather than a pipeline stage — set apart. */}
      <span className="bg-line mx-2 my-2 w-px shrink-0" aria-hidden />
      <TabButton
        label="CV Builder"
        icon={<FileUser className="h-3.5 w-3.5" />}
        isActive={active === "cv-builder"}
        onClick={() => onChange("cv-builder")}
      />
    </nav>
  );
}

function TabButton({
  label,
  count,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  count?: number;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex items-center gap-2 px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
        isActive ? "text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {icon}
      {label}
      {count !== undefined ? (
        <span
          className={`rounded-full px-1.5 py-px text-[11px] tabular-nums ${
            isActive ? "bg-surface-2 text-muted" : "text-faint"
          }`}
        >
          {count}
        </span>
      ) : null}
      {isActive ? <span className="bg-accent absolute inset-x-2 -bottom-px h-px" /> : null}
    </button>
  );
}
