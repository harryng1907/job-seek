"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { ReorderHandle, type ReorderControls } from "@/components/cv/DragList";
import { bulletsFor, isItemEdited, resolveItem } from "@/lib/resume";
import type { ItemOverride, ResumeItem } from "@/types/resume";

/**
 * One selectable CV block.
 *
 * The library item is passed in untouched. Choosing a different *wording* picks
 * one of the item's truthful bullet sets; typing in a field writes an override.
 * "Reset to original" simply deletes the override, so the library wording is
 * always one click away.
 */
export function CvItemBlock({
  item,
  override,
  bulletSetId,
  included,
  controls,
  onToggleInclude,
  onOverride,
  onBulletSetChange,
}: {
  item: ResumeItem;
  override?: ItemOverride;
  bulletSetId?: string;
  included: boolean;
  controls: ReorderControls;
  onToggleInclude: () => void;
  /** `null` clears every edit for this block. */
  onOverride: (override: ItemOverride | null) => void;
  onBulletSetChange: (setId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const resolved = resolveItem(item, override, bulletSetId);
  const edited = isItemEdited(item, override, bulletSetId);
  const activeSet =
    item.bulletSets.find((set) => set.id === bulletSetId) ?? item.bulletSets[0];

  const setField = (field: keyof ItemOverride, value: string) =>
    onOverride({ ...override, [field]: value });

  const setBullets = (bullets: string[]) => onOverride({ ...override, bullets });

  return (
    <div
      className={`rounded-xl border transition-colors ${
        included
          ? "border-line bg-surface"
          : "border-line/60 bg-surface/40 text-faint opacity-60"
      }`}
    >
      <div className="flex items-start gap-2 p-3">
        <ReorderHandle controls={controls} />

        <input
          type="checkbox"
          checked={included}
          onChange={onToggleInclude}
          aria-label={`Include ${resolved.title}`}
          className="accent-accent mt-1 h-3.5 w-3.5 shrink-0"
        />

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="flex items-center gap-1.5">
            <span
              className={`truncate text-sm font-medium ${
                included ? "text-ink" : "text-muted"
              }`}
            >
              {resolved.title}
            </span>
            {edited ? (
              <span className="border-accent/30 bg-accent/10 text-accent shrink-0 rounded-full border px-1.5 text-[10px]">
                edited
              </span>
            ) : null}
            {item.conflicts?.length ? (
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-400" />
            ) : null}
          </span>
          <span className="text-faint mt-0.5 block truncate text-xs">
            {[resolved.organisation, resolved.dates].filter(Boolean).join(" · ") ||
              `${resolved.bullets.length} bullet${resolved.bullets.length === 1 ? "" : "s"}`}
          </span>
        </button>

        <span className="text-faint mt-0.5 shrink-0">
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </div>

      {open ? (
        <div className="border-line space-y-3 border-t p-3">
          {item.conflicts?.length ? (
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] p-2.5">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-amber-200">
                <AlertTriangle className="h-3 w-3" />
                Source CVs disagree
              </p>
              <ul className="mt-1.5 space-y-1">
                {item.conflicts.map((conflict, i) => (
                  <li key={i} className="text-xs leading-relaxed text-amber-200/80">
                    {conflict}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {item.sourceNote ? (
            <p className="text-faint flex gap-1.5 text-[11px] leading-relaxed">
              <Info className="mt-0.5 h-3 w-3 shrink-0" />
              {item.sourceNote}
            </p>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <Field
              label="Title"
              value={resolved.title}
              onChange={(value) => setField("title", value)}
            />
            <Field
              label="Organisation"
              value={resolved.organisation}
              onChange={(value) => setField("organisation", value)}
            />
          </div>
          <Field
            label="Dates"
            value={resolved.dates}
            onChange={(value) => setField("dates", value)}
          />

          {/* Alternate truthful wordings from the user's own CV versions. */}
          {item.bulletSets.length > 1 ? (
            <label className="block">
              <span className="text-faint mb-1.5 block text-[11px] font-medium tracking-wide uppercase">
                Wording
              </span>
              <select
                value={activeSet?.id ?? ""}
                onChange={(event) => onBulletSetChange(event.target.value)}
                disabled={Boolean(override?.bullets)}
                className="border-line bg-canvas text-ink focus:border-line-strong w-full cursor-pointer rounded-lg border px-2.5 py-1.5 text-sm outline-none disabled:opacity-50"
              >
                {item.bulletSets.map((set) => (
                  <option key={set.id} value={set.id}>
                    {set.label}
                    {set.source ? ` — ${set.source}` : ""}
                  </option>
                ))}
              </select>
              {override?.bullets ? (
                <span className="text-faint mt-1 block text-[11px]">
                  Bullets have been hand-edited. Reset to original to switch wording
                  again.
                </span>
              ) : null}
            </label>
          ) : null}

          <div>
            <p className="text-faint mb-1.5 text-[11px] font-medium tracking-wide uppercase">
              Bullet points
            </p>
            <div className="space-y-2">
              {resolved.bullets.map((bullet, index) => (
                <div key={index} className="flex items-start gap-2">
                  <textarea
                    value={bullet}
                    rows={2}
                    onChange={(event) =>
                      setBullets(
                        resolved.bullets.map((current, i) =>
                          i === index ? event.target.value : current,
                        ),
                      )
                    }
                    className="border-line bg-canvas text-ink focus:border-line-strong w-full resize-y rounded-lg border p-2 text-sm leading-relaxed transition-colors outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setBullets(resolved.bullets.filter((_, i) => i !== index))
                    }
                    aria-label="Delete bullet"
                    className="text-faint mt-1.5 transition-colors hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {resolved.bullets.length === 0 ? (
                <p className="text-faint text-xs">
                  No bullets in this wording — the block prints as a heading only.
                </p>
              ) : null}
            </div>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBullets([...resolved.bullets, ""])}
                className="text-muted hover:text-ink inline-flex items-center gap-1.5 text-xs transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add bullet
              </button>
              <button
                type="button"
                onClick={() => onOverride(null)}
                disabled={!edited}
                className="text-faint hover:text-ink inline-flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40 disabled:hover:text-current"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to original
              </button>
              <span className="text-faint ml-auto text-[11px]">
                {bulletsFor(item, activeSet?.id).length} in library wording
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-faint mb-1.5 block text-[11px] font-medium tracking-wide uppercase">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-line bg-canvas text-ink focus:border-line-strong w-full rounded-lg border px-2.5 py-1.5 text-sm transition-colors outline-none"
      />
    </label>
  );
}
