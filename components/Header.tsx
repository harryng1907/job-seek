"use client";

import { useEffect, useRef } from "react";
import { RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { formatDateTime } from "@/lib/format";

export function Header({
  search,
  onSearchChange,
  lastUpdated,
  filtersOpen,
  onToggleFilters,
  activeFilterCount,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  lastUpdated: string;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses search, Escape clears it — standard for dashboards of this kind.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="border-line bg-canvas/85 sticky top-0 z-30 border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="border-line bg-surface-2 flex h-7 w-7 items-center justify-center rounded-lg border">
              <Search className="text-accent h-3.5 w-3.5" />
            </div>
            <h1 className="text-ink text-lg leading-none font-semibold tracking-tight">
              Job Seek
            </h1>
          </div>
          <p className="text-muted mt-2 text-sm">Personal job application pipeline</p>
          <p className="text-faint mt-1 flex items-center gap-1.5 text-[11px]">
            <RefreshCw className="h-3 w-3" />
            Last updated {formatDateTime(lastUpdated)}
          </p>
        </div>

        <div className="flex w-full items-center gap-2 lg:w-auto">
          <div className="relative flex-1 lg:w-80 lg:flex-none">
            <Search className="text-faint pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search company or title"
              aria-label="Search jobs by company or title"
              className="border-line bg-surface text-ink placeholder:text-faint focus:border-line-strong w-full rounded-lg border py-2 pr-9 pl-9 text-sm transition-colors outline-none"
            />
            {search ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="text-faint hover:text-ink absolute top-1/2 right-2.5 -translate-y-1/2 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="border-line text-faint absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] lg:block">
                /
              </kbd>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleFilters}
            aria-expanded={filtersOpen}
            className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              filtersOpen || activeFilterCount > 0
                ? "border-line-strong bg-surface-2 text-ink"
                : "border-line bg-surface text-muted hover:text-ink"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 ? (
              <span className="bg-accent/20 text-accent rounded-full px-1.5 text-[11px] font-medium tabular-nums">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
