"use client";

import { useMemo, useState } from "react";
import { Inbox, RotateCcw } from "lucide-react";
import { Filters } from "@/components/Filters";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import { JobDetail } from "@/components/JobDetail";
import { SummaryCards } from "@/components/SummaryCards";
import { Tabs } from "@/components/Tabs";
import { mergeJobsWithState } from "@/lib/application-state";
import { toISODate } from "@/lib/format";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filterJobs,
  filterOptions,
  jobsForTab,
  sortForTab,
  summarise,
  tabCounts,
  type JobFilters,
  type TabId,
} from "@/lib/jobs";
import { useApplicationState } from "@/lib/use-application-state";
import type { ApplicationStateMap } from "@/types/application";
import type { JobBoard } from "@/types/job";

const TAB_EMPTY_MESSAGE: Record<TabId, string> = {
  today: "Nothing needs action today.",
  "to-apply": "No roles waiting to be applied for.",
  applied: "No applications submitted yet.",
  assessment: "No assessments in progress.",
  interview: "No interviews scheduled.",
  archive: "Nothing archived yet.",
};

export function Dashboard({
  board,
  seedState,
}: {
  board: JobBoard;
  seedState: ApplicationStateMap;
}) {
  const { states, setStatus, patchState, toggleDocument, setAnswer, resetAll } =
    useApplicationState(seedState);

  const [tab, setTab] = useState<TabId>("today");
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /**
   * "Today" is the date of the last pipeline refresh rather than the browser
   * clock: it keeps server and client markup identical, and for a daily job
   * search it is the same thing.
   */
  const today = useMemo(() => toISODate(board.lastUpdated), [board.lastUpdated]);

  const jobs = useMemo(
    () => mergeJobsWithState(board.jobs, states),
    [board.jobs, states],
  );

  const counts = useMemo(() => summarise(jobs, today), [jobs, today]);
  const perTab = useMemo(() => tabCounts(jobs, today), [jobs, today]);
  const options = useMemo(() => filterOptions(jobs), [jobs]);

  const visible = useMemo(
    () => sortForTab(filterJobs(jobsForTab(jobs, tab, today), filters), tab),
    [jobs, tab, today, filters],
  );

  const selected = jobs.find((job) => job.id === selectedId) ?? null;
  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="min-h-full">
      <Header
        search={filters.search}
        onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        lastUpdated={board.lastUpdated}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((open) => !open)}
        activeFilterCount={activeFilterCount}
      />

      <main className="mx-auto max-w-[1400px] space-y-5 px-4 py-5 sm:px-6 sm:py-6">
        <SummaryCards counts={counts} activeTab={tab} onSelect={setTab} />

        {filtersOpen ? (
          <Filters
            filters={filters}
            options={options}
            onChange={setFilters}
            onClear={() =>
              setFilters((prev) => ({ ...EMPTY_FILTERS, search: prev.search }))
            }
          />
        ) : null}

        <div className="space-y-4">
          <Tabs active={tab} counts={perTab} onChange={setTab} />

          {visible.length ? (
            <div className="grid gap-2.5 2xl:grid-cols-2">
              {visible.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  today={today}
                  onOpen={() => setSelectedId(job.id)}
                  onStatusChange={(status) => setStatus(job.id, status, today)}
                />
              ))}
            </div>
          ) : (
            <div className="border-line bg-surface flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
              <Inbox className="text-faint h-5 w-5" />
              <p className="text-muted text-sm">
                {filters.search || activeFilterCount
                  ? "No jobs match the current search and filters."
                  : TAB_EMPTY_MESSAGE[tab]}
              </p>
              {filters.search || activeFilterCount ? (
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="text-faint hover:text-ink text-xs transition-colors"
                >
                  Clear search and filters
                </button>
              ) : null}
            </div>
          )}
        </div>

        <footer className="border-line text-faint flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-[11px]">
          <p>
            Job data is refreshed by the pipeline; statuses, drafts and notes are yours
            and are stored in this browser.
          </p>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Discard all locally saved statuses, drafts and notes, and go back to the seed data?",
                )
              ) {
                resetAll();
              }
            }}
            className="hover:text-muted inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset local application state
          </button>
        </footer>
      </main>

      {selected ? (
        <JobDetail
          job={selected}
          today={today}
          onClose={() => setSelectedId(null)}
          onStatusChange={(status) => setStatus(selected.id, status, today)}
          onPatch={(patch) => patchState(selected.id, patch)}
          onToggleDocument={(document) => toggleDocument(selected.id, document)}
          onAnswer={(index, value) => setAnswer(selected.id, index, value)}
        />
      ) : null}
    </div>
  );
}
