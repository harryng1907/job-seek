"use client";

import { Check, ShieldAlert, X } from "lucide-react";
import { STATUS_META } from "@/lib/job-meta";
import { countActiveFilters, type JobFilters } from "@/lib/jobs";
import type { ApplicationStatus } from "@/types/application";

const ALL_STATUSES = Object.keys(STATUS_META) as ApplicationStatus[];

function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (!options.length) return null;
  return (
    <div>
      <p className="text-faint mb-2 text-[11px] font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs transition-colors ${
                active
                  ? "border-accent/40 bg-accent/10 text-ink"
                  : "border-line bg-surface-2 text-muted hover:text-ink hover:border-line-strong"
              }`}
            >
              {active ? <Check className="h-3 w-3" /> : null}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Filters({
  filters,
  options,
  onChange,
  onClear,
}: {
  filters: JobFilters;
  options: { companies: string[]; locations: string[]; roleTypes: string[] };
  onChange: (filters: JobFilters) => void;
  onClear: () => void;
}) {
  const activeCount = countActiveFilters(filters);

  return (
    <div className="border-line bg-surface animate-fade-in space-y-5 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <p className="text-ink text-sm font-medium">Filters</p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-faint hover:text-ink inline-flex items-center gap-1 text-xs transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all ({activeCount})
          </button>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChipGroup
          label="Company"
          options={options.companies}
          selected={filters.companies}
          onToggle={(value) =>
            onChange({ ...filters, companies: toggle(filters.companies, value) })
          }
        />
        <ChipGroup
          label="Location"
          options={options.locations}
          selected={filters.locations}
          onToggle={(value) =>
            onChange({ ...filters, locations: toggle(filters.locations, value) })
          }
        />
        <ChipGroup
          label="Role type"
          options={options.roleTypes}
          selected={filters.roleTypes}
          onToggle={(value) =>
            onChange({ ...filters, roleTypes: toggle(filters.roleTypes, value) })
          }
        />
        <div>
          <p className="text-faint mb-2 text-[11px] font-medium tracking-wide uppercase">
            Status
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map((status) => {
              const active = filters.statuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    onChange({ ...filters, statuses: toggle(filters.statuses, status) })
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs transition-colors ${
                    active
                      ? `${STATUS_META[status].className} border-current/30`
                      : "border-line bg-surface-2 text-muted hover:text-ink hover:border-line-strong"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${STATUS_META[status].dot}`}
                    aria-hidden
                  />
                  {STATUS_META[status].label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-line grid gap-5 border-t pt-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="min-fit"
              className="text-faint text-[11px] font-medium tracking-wide uppercase"
            >
              Minimum fit score
            </label>
            <span className="text-ink text-xs tabular-nums">
              {filters.minFitScore === 0 ? "Any" : `${filters.minFitScore}+`}
            </span>
          </div>
          <input
            id="min-fit"
            type="range"
            min={0}
            max={10}
            step={1}
            value={filters.minFitScore}
            onChange={(event) =>
              onChange({ ...filters, minFitScore: Number(event.target.value) })
            }
            className="accent-accent w-full"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 self-end">
          <input
            type="checkbox"
            checked={filters.hideIneligible}
            onChange={(event) =>
              onChange({ ...filters, hideIneligible: event.target.checked })
            }
            className="accent-accent mt-0.5 h-3.5 w-3.5"
          />
          <span>
            <span className="text-ink flex items-center gap-1.5 text-sm">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-300" />
              Hide ineligible roles
            </span>
            <span className="text-faint mt-0.5 block text-[11px]">
              Hard citizenship/PR or grade cut-offs only — preferred requirements stay
              visible.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
