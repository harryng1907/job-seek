"use client";

import { useMemo, useState } from "react";
import { Inbox, RotateCcw } from "lucide-react";
import { CvBuilder } from "@/components/cv/CvBuilder";
import { Filters } from "@/components/Filters";
import { Header } from "@/components/Header";
import { JobCard } from "@/components/JobCard";
import { JobDetail } from "@/components/JobDetail";
import { SummaryCards } from "@/components/SummaryCards";
import { Tabs } from "@/components/Tabs";
import { TrackFilter } from "@/components/TrackFilter";
import { mergeJobsWithState } from "@/lib/application-state";
import { toISODate } from "@/lib/format";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filterByTrack,
  filterJobs,
  filterOptions,
  isPipelineTab,
  jobsForTab,
  sortForTab,
  summarise,
  tabCounts,
  trackViewCounts,
  type JobFilters,
  type TabId,
  type TrackView,
  type ViewId,
} from "@/lib/jobs";
import { useApplicationState } from "@/lib/use-application-state";
import { useCvConfigurations } from "@/lib/use-cv-configurations";
import type { ApplicationStateMap, TrackedJob } from "@/types/application";
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
  const { ensureForJob } = useCvConfigurations();

  const [view, setView] = useState<ViewId>("today");
  const [trackView, setTrackView] = useState<TrackView>("all");
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeConfigId, setActiveConfigId] = useState<string | null>(null);

  const isCvBuilder = view === "cv-builder";
  /** The pipeline tab the job list should use; the CV builder has none. */
  const tab: TabId = isPipelineTab(view) ? view : "today";

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

  /** The track selector narrows everything below it: counts, tabs and lists. */
  const tracked = useMemo(() => filterByTrack(jobs, trackView), [jobs, trackView]);

  const counts = useMemo(() => summarise(tracked, today), [tracked, today]);
  const perTab = useMemo(() => tabCounts(tracked, today), [tracked, today]);
  const perTrack = useMemo(() => trackViewCounts(jobs), [jobs]);
  const options = useMemo(() => filterOptions(tracked), [tracked]);

  const visible = useMemo(
    () => sortForTab(filterJobs(jobsForTab(tracked, tab, today), filters), tab),
    [tracked, tab, today, filters],
  );

  const selected = jobs.find((job) => job.id === selectedId) ?? null;
  const activeFilterCount = countActiveFilters(filters);

  /**
   * "Tailor CV for this job": open the builder on the version for this job,
   * creating one if needed. The base CV family is chosen from the job's track —
   * a retail role starts from the retail CV — and can be changed in the builder.
   */
  const tailorCvFor = (job: TrackedJob) => {
    setActiveConfigId(ensureForJob(job, `${job.company} — ${job.title}`));
    setSelectedId(null);
    setView("cv-builder");
  };

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
        {!isCvBuilder ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TrackFilter
                active={trackView}
                counts={perTrack}
                onChange={setTrackView}
              />
              <p className="text-faint text-[11px]">
                Graduate and part-time roles are scored on different criteria — the
                numbers are not comparable across tracks.
              </p>
            </div>
            <SummaryCards counts={counts} activeTab={view} onSelect={setView} />
          </>
        ) : null}

        {filtersOpen && !isCvBuilder ? (
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
          <Tabs active={view} counts={perTab} onChange={setView} />

          {isCvBuilder ? (
            <CvBuilder
              jobs={jobs}
              activeConfigId={activeConfigId}
              onSelectConfig={setActiveConfigId}
            />
          ) : visible.length ? (
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
            Job data is refreshed by the pipeline; statuses, drafts, notes and CV versions
            are yours and are stored in this browser.
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
          onTailorCv={() => tailorCvFor(selected)}
        />
      ) : null}
    </div>
  );
}
