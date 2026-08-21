"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ClipboardCopy,
  Copy,
  Download,
  FilePlus2,
  Layers,
  RotateCcw,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import { CvItemBlock } from "@/components/cv/CvItemBlock";
import { CvPreview } from "@/components/cv/CvPreview";
import { DragList, ReorderHandle } from "@/components/cv/DragList";
import { JobSuggestions } from "@/components/cv/JobSuggestions";
import { collectConflicts, resumeLibrary } from "@/data/resumes";
import { formatDateTime } from "@/lib/format";
import { TRACK_META } from "@/lib/job-meta";
import {
  baseFor,
  composeResume,
  isItemSection,
  resumeToPlainText,
  sectionLabel,
  toggle,
} from "@/lib/resume";
import { useCvConfigurations, useResumeProfile } from "@/lib/use-cv-configurations";
import type { TrackedJob } from "@/types/application";
import type {
  CvConfiguration,
  ItemOverride,
  ItemSectionId,
  ResumeProfile,
  ResumeSectionId,
} from "@/types/resume";

/**
 * The CV builder.
 *
 * Left column edits a *configuration* — which library blocks are included, in
 * what order, with which truthful wording and which hand edits. Right column
 * composes that against the master library and renders it. The library is
 * read-only here, so no amount of tailoring can damage the source content.
 */
export function CvBuilder({
  jobs,
  activeConfigId,
  onSelectConfig,
}: {
  jobs: TrackedJob[];
  activeConfigId: string | null;
  onSelectConfig: (id: string) => void;
}) {
  const { list, patch, create, changeBase, duplicate, reset, remove, stamp } =
    useCvConfigurations();
  const { profile, patchProfile } = useResumeProfile();
  const [flash, setFlash] = useState<"saved" | "copied" | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const config = list.find((item) => item.id === activeConfigId) ?? list[0] ?? null;
  const base = config ? baseFor(resumeLibrary, config) : null;
  const linkedJob = config?.jobId
    ? (jobs.find((job) => job.id === config.jobId) ?? null)
    : null;

  const composed = useMemo(
    () => (config ? composeResume(resumeLibrary, config, profile) : null),
    [config, profile],
  );

  const conflicts = useMemo(() => collectConflicts(), []);

  if (!config || !composed || !base) {
    return (
      <div className="border-line bg-surface flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <p className="text-muted text-sm">No CV versions yet.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {resumeLibrary.bases.map((family) => (
            <button
              key={family.id}
              type="button"
              onClick={() => onSelectConfig(create(`Master — ${family.name}`, family.id))}
              className="border-line bg-surface-2 text-ink hover:border-line-strong inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              Start a {family.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- configuration writes ------------------------------------------------

  const write = (changes: Partial<CvConfiguration>) => patch(config.id, changes);

  const setSectionConfig = (section: ItemSectionId, order: string[], excluded: string[]) =>
    write({ sections: { ...config.sections, [section]: { order, excluded } } });

  const setOverride = (itemId: string, override: ItemOverride | null) => {
    const overrides = { ...config.overrides };
    if (override === null) delete overrides[itemId];
    else overrides[itemId] = override;
    write({ overrides });
  };

  const setBulletChoice = (itemId: string, setId: string) =>
    write({ bulletChoice: { ...config.bulletChoice, [itemId]: setId } });

  const flashFor = (kind: "saved" | "copied") => {
    setFlash(kind);
    window.setTimeout(() => setFlash(null), 1600);
  };

  const copyAsText = async () => {
    try {
      await navigator.clipboard.writeText(resumeToPlainText(composed));
      flashFor("copied");
    } catch {
      // Clipboard blocked — preview text is still selectable.
    }
  };

  const orderedItems = (section: ItemSectionId) => {
    const byId = new Map(resumeLibrary.items[section].map((item) => [item.id, item]));
    return config.sections[section].order
      .map((id) => byId.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  };

  const includedCount = (section: ResumeSectionId) => {
    if (section === "summary") return null;
    if (section === "skills") {
      return `${config.skillOrder.length - config.excludedSkillGroups.length}/${config.skillOrder.length}`;
    }
    if (!isItemSection(section)) return null;
    const { order, excluded } = config.sections[section];
    return `${order.length - excluded.length}/${order.length}`;
  };

  const profileIncomplete = profile.name === resumeLibrary.profile.name;

  return (
    <div className="space-y-4">
      {/* --- Version toolbar ------------------------------------------- */}
      <div className="border-line bg-surface space-y-3 rounded-xl border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={config.id}
            onChange={(event) => onSelectConfig(event.target.value)}
            aria-label="CV version"
            className="border-line bg-surface-2 text-ink focus:border-line-strong w-full min-w-0 cursor-pointer rounded-lg border px-2.5 py-2 text-sm outline-none sm:w-auto sm:max-w-[220px]"
          >
            {list.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={config.name}
            onChange={(event) => write({ name: event.target.value })}
            aria-label="Version name"
            placeholder="Version name"
            className="border-line bg-canvas text-ink placeholder:text-faint focus:border-line-strong min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          />

          <select
            value={config.jobId ?? ""}
            onChange={(event) => write({ jobId: event.target.value || null })}
            aria-label="Linked job"
            className="border-line bg-surface-2 text-muted focus:border-line-strong w-full min-w-0 cursor-pointer rounded-lg border px-2.5 py-2 text-sm outline-none sm:w-auto sm:max-w-[260px]"
          >
            <option value="">Not linked to a job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.company} — {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* Base CV family — auto-chosen from the job's track, always overridable. */}
        <div className="border-line flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-faint flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase">
            <Layers className="h-3 w-3" />
            Base CV
          </span>
          {resumeLibrary.bases.map((family) => {
            const isActive = family.id === config.baseResumeId;
            return (
              <button
                key={family.id}
                type="button"
                onClick={() => {
                  if (isActive) return;
                  if (
                    window.confirm(
                      `Switch this version to the ${family.name}?\n\nSelections, ordering and wording are re-seeded from that family. Your tailored summary, hand-edited bullets and notes are kept.`,
                    )
                  ) {
                    changeBase(config.id, family.id);
                  }
                }}
                title={family.description}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "border-accent/40 bg-accent/10 text-ink"
                    : "border-line bg-surface-2 text-muted hover:text-ink hover:border-line-strong"
                }`}
              >
                {isActive ? <Check className="h-3 w-3" /> : null}
                {family.name}
                <span
                  className={`rounded-full border px-1.5 text-[10px] ${TRACK_META[family.track].className}`}
                >
                  {TRACK_META[family.track].label}
                </span>
              </button>
            );
          })}
          <span className="text-faint text-[11px]">
            {linkedJob
              ? `Suggested from the ${TRACK_META[linkedJob.track].label.toLowerCase()} track — change it whenever you like.`
              : "Not linked to a job, so nothing is suggested."}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ToolbarButton
            icon={
              flash === "saved" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )
            }
            label={flash === "saved" ? "Saved" : "Save version"}
            onClick={() => {
              stamp(config.id);
              flashFor("saved");
            }}
            primary
          />
          <ToolbarButton
            icon={<Copy className="h-3.5 w-3.5" />}
            label="Duplicate version"
            onClick={() => {
              const id = duplicate(config.id);
              if (id) onSelectConfig(id);
            }}
          />
          <ToolbarButton
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            label="Reset"
            onClick={() => {
              if (
                window.confirm(
                  `Reset "${config.name}" back to the ${base.name} defaults? Every override, exclusion and reorder in this version is discarded. Your source library is not affected.`,
                )
              ) {
                reset(config.id);
              }
            }}
          />
          <ToolbarButton
            icon={
              flash === "copied" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <ClipboardCopy className="h-3.5 w-3.5" />
              )
            }
            label={flash === "copied" ? "Copied" : "Copy as text"}
            onClick={copyAsText}
          />
          <ToolbarButton
            icon={<Download className="h-3.5 w-3.5" />}
            label="Export later"
            disabled
            title="PDF export is not built yet — use Copy as text for now"
          />
          {list.length > 1 ? (
            <ToolbarButton
              icon={<Trash2 className="h-3.5 w-3.5" />}
              label="Delete"
              onClick={() => {
                if (window.confirm(`Delete the "${config.name}" version?`)) {
                  const next = list.find((item) => item.id !== config.id);
                  remove(config.id);
                  if (next) onSelectConfig(next.id);
                }
              }}
            />
          ) : null}

          <span className="text-faint ml-auto text-[11px]">
            Autosaved ·{" "}
            {config.savedAt
              ? `last checkpoint ${formatDateTime(config.savedAt)}`
              : "no checkpoint yet"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        {/* --- Editor -------------------------------------------------- */}
        <div className="min-w-0 space-y-4">
          {linkedJob ? (
            <JobSuggestions
              job={linkedJob}
              onUseSummary={(summary) => write({ summary })}
            />
          ) : null}

          <ContactPanel
            profile={profile}
            placeholderName={resumeLibrary.profile.name}
            incomplete={profileIncomplete}
            open={showProfile}
            onToggle={() => setShowProfile((value) => !value)}
            onChange={patchProfile}
          />

          {conflicts.length ? (
            <details className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-4">
              <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                {conflicts.length} unresolved conflict
                {conflicts.length === 1 ? "" : "s"} between your CV versions
              </summary>
              <div className="mt-3 space-y-3">
                {conflicts.map((entry) => (
                  <div key={entry.id}>
                    <p className="text-ink text-xs font-medium">{entry.title}</p>
                    <ul className="mt-1 space-y-1">
                      {entry.conflicts.map((conflict, i) => (
                        <li key={i} className="text-xs leading-relaxed text-amber-200/80">
                          {conflict}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ) : null}

          <Panel title="Sections" hint="Include, exclude and reorder">
            <DragList
              items={config.sectionOrder.map((id) => ({
                id,
                label: sectionLabel(id, base),
              }))}
              getId={(section) => section.id}
              onReorder={(ids) => write({ sectionOrder: ids as ResumeSectionId[] })}
              className="space-y-1.5"
            >
              {(section, controls) => {
                const included = !config.excludedSections.includes(section.id);
                return (
                  <div
                    className={`border-line flex items-center gap-2 rounded-lg border p-2 ${
                      included ? "bg-surface-2/60" : "bg-surface/40 opacity-60"
                    }`}
                  >
                    <ReorderHandle controls={controls} />
                    <input
                      type="checkbox"
                      checked={included}
                      onChange={() =>
                        write({
                          excludedSections: toggle(config.excludedSections, section.id),
                        })
                      }
                      aria-label={`Include ${section.label}`}
                      className="accent-accent h-3.5 w-3.5"
                    />
                    <span
                      className={`flex-1 text-sm ${included ? "text-ink" : "text-muted"}`}
                    >
                      {section.label}
                    </span>
                    <span className="text-faint text-[11px] tabular-nums">
                      {includedCount(section.id)}
                    </span>
                  </div>
                );
              }}
            </DragList>
          </Panel>

          {config.sectionOrder
            .filter((id) => !config.excludedSections.includes(id))
            .map((sectionId) => {
              const label = sectionLabel(sectionId, base);

              if (sectionId === "summary") {
                return (
                  <Panel
                    key={sectionId}
                    title={label}
                    hint={`Blank uses the ${base.name} summary`}
                    action={
                      config.summary ? (
                        <button
                          type="button"
                          onClick={() => write({ summary: "" })}
                          className="text-faint hover:text-ink inline-flex items-center gap-1.5 text-xs transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Reset to base
                        </button>
                      ) : null
                    }
                  >
                    {base.summaryVariants.length > 1 ? (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        <span className="text-faint text-[11px]">Truthful variants:</span>
                        {base.summaryVariants.map((variant) => (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => write({ summary: variant.text })}
                            title={variant.source}
                            className="border-line bg-surface-2 text-muted hover:text-ink hover:border-line-strong rounded-lg border px-2 py-1 text-[11px] transition-colors"
                          >
                            {variant.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <textarea
                      value={config.summary}
                      rows={5}
                      placeholder={base.summary}
                      onChange={(event) => write({ summary: event.target.value })}
                      className="border-line bg-canvas text-ink placeholder:text-faint focus:border-line-strong w-full resize-y rounded-lg border p-3 text-sm leading-relaxed transition-colors outline-none"
                    />
                  </Panel>
                );
              }

              if (sectionId === "skills") {
                const groupsById = new Map(
                  resumeLibrary.skillGroups.map((group) => [group.id, group]),
                );
                const groups = config.skillOrder
                  .map((id) => groupsById.get(id))
                  .filter((group): group is NonNullable<typeof group> => Boolean(group));

                return (
                  <Panel key={sectionId} title={label} hint="Order matters">
                    <DragList
                      items={groups}
                      getId={(group) => group.id}
                      onReorder={(ids) => write({ skillOrder: ids })}
                      className="space-y-1.5"
                    >
                      {(group, controls) => {
                        const included = !config.excludedSkillGroups.includes(group.id);
                        return (
                          <div
                            className={`border-line flex items-start gap-2 rounded-lg border p-2.5 ${
                              included ? "bg-surface-2/60" : "bg-surface/40 opacity-60"
                            }`}
                          >
                            <ReorderHandle controls={controls} />
                            <input
                              type="checkbox"
                              checked={included}
                              onChange={() =>
                                write({
                                  excludedSkillGroups: toggle(
                                    config.excludedSkillGroups,
                                    group.id,
                                  ),
                                })
                              }
                              aria-label={`Include ${group.label}`}
                              className="accent-accent mt-0.5 h-3.5 w-3.5"
                            />
                            <div className="min-w-0">
                              <p
                                className={`text-sm ${included ? "text-ink" : "text-muted"}`}
                              >
                                {group.label}
                              </p>
                              <p className="text-faint text-xs">
                                {group.skills.join(", ")}
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    </DragList>
                  </Panel>
                );
              }

              if (!isItemSection(sectionId)) return null;
              const section = sectionId;
              const { excluded, order } = config.sections[section];

              return (
                <Panel
                  key={section}
                  title={label}
                  hint={`${order.length - excluded.length} of ${order.length} included`}
                >
                  <DragList
                    items={orderedItems(section)}
                    getId={(item) => item.id}
                    onReorder={(ids) => setSectionConfig(section, ids, excluded)}
                  >
                    {(item, controls) => (
                      <CvItemBlock
                        item={item}
                        override={config.overrides[item.id]}
                        bulletSetId={config.bulletChoice[item.id]}
                        included={!excluded.includes(item.id)}
                        controls={controls}
                        onToggleInclude={() =>
                          setSectionConfig(section, order, toggle(excluded, item.id))
                        }
                        onOverride={(override) => setOverride(item.id, override)}
                        onBulletSetChange={(setId) => setBulletChoice(item.id, setId)}
                      />
                    )}
                  </DragList>
                </Panel>
              );
            })}

          <Panel title="Version notes" hint="Not printed on the CV">
            <textarea
              value={config.notes}
              rows={3}
              placeholder="Why this version looks the way it does…"
              onChange={(event) => write({ notes: event.target.value })}
              className="border-line bg-canvas text-ink placeholder:text-faint focus:border-line-strong w-full resize-y rounded-lg border p-3 text-sm leading-relaxed transition-colors outline-none"
            />
          </Panel>
        </div>

        {/* --- Live preview -------------------------------------------- */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-faint text-[11px] font-medium tracking-wide uppercase">
              Live preview · {base.name}
            </p>
            <p className="text-faint text-[11px]">
              {composed.sections.length} section
              {composed.sections.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-1">
            <CvPreview resume={composed} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Contact details.
 *
 * Stored in localStorage, never in the repo — the placeholder values ship with
 * the code so a public GitHub copy carries no personal information.
 */
function ContactPanel({
  profile,
  placeholderName,
  incomplete,
  open,
  onToggle,
  onChange,
}: {
  profile: ResumeProfile;
  placeholderName: string;
  incomplete: boolean;
  open: boolean;
  onToggle: () => void;
  onChange: (changes: Partial<ResumeProfile>) => void;
}) {
  return (
    <section
      className={`rounded-xl border p-4 ${
        incomplete ? "border-accent/30 bg-accent/[0.04]" : "border-line bg-surface"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-ink flex items-center gap-2 text-sm font-medium">
          <UserRound className="h-3.5 w-3.5" />
          Contact details
        </span>
        <span className="text-faint text-[11px]">
          {incomplete ? `Still "${placeholderName}" — click to fill in` : "Saved locally"}
        </span>
      </button>

      {open ? (
        <div className="mt-3 space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <ProfileField
              label="Name"
              value={profile.name}
              onChange={(name) => onChange({ name })}
            />
            <ProfileField
              label="Email"
              value={profile.email}
              onChange={(email) => onChange({ email })}
            />
            <ProfileField
              label="Phone"
              value={profile.phone}
              onChange={(phone) => onChange({ phone })}
            />
            <ProfileField
              label="Location"
              value={profile.location}
              onChange={(location) => onChange({ location })}
            />
          </div>
          {profile.links.map((link, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)]">
              <ProfileField
                label="Link label"
                value={link.label}
                onChange={(label) =>
                  onChange({
                    links: profile.links.map((current, i) =>
                      i === index ? { ...current, label } : current,
                    ),
                  })
                }
              />
              <ProfileField
                label="URL"
                value={link.url}
                onChange={(url) =>
                  onChange({
                    links: profile.links.map((current, i) =>
                      i === index ? { ...current, url } : current,
                    ),
                  })
                }
              />
            </div>
          ))}
          <p className="text-faint text-[11px]">
            Stored in this browser only (localStorage), never written to the repo — so a
            public GitHub copy carries no personal contact information.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function ProfileField({
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

function Panel({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line bg-surface rounded-xl border p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-ink text-sm font-medium">{title}</h3>
        {action ?? (hint ? <span className="text-faint text-[11px]">{hint}</span> : null)}
      </div>
      {children}
    </section>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
  title,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? "border-accent/30 bg-accent/10 text-ink hover:bg-accent/15"
          : "border-line bg-surface-2 text-muted hover:text-ink hover:border-line-strong"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
