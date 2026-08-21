import type { Job } from "@/types/job";
import type {
  ComposedResume,
  ComposedSection,
  CvConfiguration,
  ItemOverride,
  ItemSectionId,
  ResolvedItem,
  ResumeBase,
  ResumeItem,
  ResumeLibrary,
  ResumeProfile,
  ResumeSectionId,
} from "@/types/resume";

/**
 * Composition rules for the CV builder.
 *
 * Every function is pure and reads the library without mutating it. A
 * configuration only ever says *which* library blocks to show, in *what order*,
 * with *which truthful wording*, and *what text replaces* the original.
 */

export const DEFAULT_SECTION_LABELS: Record<ResumeSectionId, string> = {
  summary: "Summary",
  education: "Education",
  experience: "Experience",
  volunteer: "Volunteer Experience",
  projects: "Projects",
  skills: "Technical Skills",
  additional: "Additional Information",
};

export const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [
  "summary",
  "education",
  "experience",
  "volunteer",
  "projects",
  "skills",
  "additional",
];

export const ITEM_SECTIONS: ItemSectionId[] = [
  "education",
  "experience",
  "volunteer",
  "projects",
  "additional",
];

export function isItemSection(id: ResumeSectionId): id is ItemSectionId {
  return (ITEM_SECTIONS as ResumeSectionId[]).includes(id);
}

/** Section heading for a configuration — families rename sections. */
export function sectionLabel(
  section: ResumeSectionId,
  base: ResumeBase | null,
): string {
  return base?.sectionLabels?.[section] ?? DEFAULT_SECTION_LABELS[section];
}

// ---------------------------------------------------------------------------
// Library lookups
// ---------------------------------------------------------------------------

export function findBase(library: ResumeLibrary, id: string): ResumeBase | null {
  return library.bases.find((base) => base.id === id) ?? null;
}

/** The family a configuration uses, falling back to the first one defined. */
export function baseFor(library: ResumeLibrary, config: CvConfiguration): ResumeBase {
  return findBase(library, config.baseResumeId) ?? library.bases[0];
}

/**
 * Which CV family suits a job.
 *
 * Track decides it: retail/customer-service work needs the retail CV, graduate
 * data roles need the data CV. The user can always override the choice in the
 * builder — this is only the starting point.
 */
export function suggestBaseResumeId(library: ResumeLibrary, job: Job): string {
  const match = library.bases.find((base) => base.track === job.track);
  return (match ?? library.bases[0]).id;
}

/** The bullet wording a configuration has chosen for an item. */
export function bulletsFor(item: ResumeItem, setId: string | undefined): string[] {
  const set = item.bulletSets.find((candidate) => candidate.id === setId);
  return (set ?? item.bulletSets[0])?.bullets ?? [];
}

// ---------------------------------------------------------------------------
// Creating and repairing configurations
// ---------------------------------------------------------------------------

/**
 * A configuration seeded from a family.
 *
 * Every library item lands in `order`; the ones the family does not use start in
 * `excluded`. Nothing is ever unavailable — an item left off a family's default
 * CV is one checkbox away, because a missing item is a tailoring decision, not
 * an invalid one.
 */
export function createConfiguration(
  library: ResumeLibrary,
  base: ResumeBase,
  { id, name, jobId = null }: { id: string; name: string; jobId?: string | null },
): CvConfiguration {
  const now = new Date().toISOString();

  return {
    id,
    name,
    baseResumeId: base.id,
    jobId,
    ...selectionFromBase(library, base),
    summary: "",
    overrides: {},
    notes: "",
    createdAt: now,
    updatedAt: now,
    savedAt: null,
  };
}

/** The ordering/inclusion/wording half of a configuration, from a family. */
function selectionFromBase(library: ResumeLibrary, base: ResumeBase) {
  const sections = ITEM_SECTIONS.reduce(
    (acc, section) => {
      const all = library.items[section].map((item) => item.id);
      const chosen = base.defaults[section].filter((itemId) => all.includes(itemId));
      const rest = all.filter((itemId) => !chosen.includes(itemId));
      acc[section] = { order: [...chosen, ...rest], excluded: rest };
      return acc;
    },
    {} as CvConfiguration["sections"],
  );

  const allGroups = library.skillGroups.map((group) => group.id);
  const chosenGroups = base.skillGroupIds.filter((groupId) => allGroups.includes(groupId));
  const restGroups = allGroups.filter((groupId) => !chosenGroups.includes(groupId));

  return {
    sectionOrder: [...base.sectionOrder],
    excludedSections: DEFAULT_SECTION_ORDER.filter(
      (section) => !base.sectionOrder.includes(section),
    ),
    sections,
    skillOrder: [...chosenGroups, ...restGroups],
    excludedSkillGroups: restGroups,
    bulletChoice: { ...(base.bulletChoice ?? {}) },
  };
}

/**
 * Switch a configuration to a different family.
 *
 * Selections, ordering and bullet wording are re-seeded from the new family —
 * that is what choosing a different base CV means — but hand-written content
 * (`summary`, `overrides`, `notes`) is preserved, because the user wrote it.
 */
export function applyBase(
  library: ResumeLibrary,
  config: CvConfiguration,
  baseId: string,
): CvConfiguration {
  const base = findBase(library, baseId);
  if (!base) return config;

  return {
    ...config,
    baseResumeId: base.id,
    ...selectionFromBase(library, base),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fold new library content into an existing configuration.
 *
 * The library can gain an item or a skill group at any time; anything the
 * configuration has not seen is appended and included by default. Ids that no
 * longer exist drop out of the order but stay in `overrides`, so restoring a
 * removed item restores its edits too.
 */
export function reconcile(
  config: CvConfiguration,
  library: ResumeLibrary,
): CvConfiguration {
  const sectionOrder = [
    ...config.sectionOrder.filter((id) => DEFAULT_SECTION_ORDER.includes(id)),
    ...DEFAULT_SECTION_ORDER.filter((id) => !config.sectionOrder.includes(id)),
  ];
  const excludedSections = [
    ...config.excludedSections,
    // A section the configuration has never seen starts switched off.
    ...DEFAULT_SECTION_ORDER.filter(
      (id) => !config.sectionOrder.includes(id) && !config.excludedSections.includes(id),
    ),
  ];

  const sections = ITEM_SECTIONS.reduce(
    (acc, section) => {
      const known = library.items[section].map((item) => item.id);
      const current = config.sections[section] ?? { order: [], excluded: [] };
      acc[section] = {
        order: [
          ...current.order.filter((id) => known.includes(id)),
          ...known.filter((id) => !current.order.includes(id)),
        ],
        excluded: current.excluded.filter((id) => known.includes(id)),
      };
      return acc;
    },
    {} as CvConfiguration["sections"],
  );

  const knownGroups = library.skillGroups.map((group) => group.id);
  const skillOrder = [
    ...config.skillOrder.filter((id) => knownGroups.includes(id)),
    ...knownGroups.filter((id) => !config.skillOrder.includes(id)),
  ];

  return { ...config, sectionOrder, excludedSections, sections, skillOrder };
}

/** Reset back to the family defaults, keeping identity and job link. */
export function resetConfiguration(
  config: CvConfiguration,
  library: ResumeLibrary,
): CvConfiguration {
  const base = baseFor(library, config);
  const fresh = createConfiguration(library, base, {
    id: config.id,
    name: config.name,
    jobId: config.jobId,
  });
  return { ...fresh, createdAt: config.createdAt, savedAt: config.savedAt };
}

// ---------------------------------------------------------------------------
// Ordering helpers
// ---------------------------------------------------------------------------

/** Move `id` to the position currently held by `targetId`. */
export function moveTo<T extends string>(order: T[], id: T, targetId: T): T[] {
  const from = order.indexOf(id);
  const to = order.indexOf(targetId);
  if (from === -1 || to === -1 || from === to) return order;

  const next = [...order];
  next.splice(from, 1);
  next.splice(to, 0, id);
  return next;
}

/** Nudge `id` up (-1) or down (+1). Out-of-range moves are ignored. */
export function moveBy<T extends string>(order: T[], id: T, delta: number): T[] {
  const from = order.indexOf(id);
  const to = from + delta;
  if (from === -1 || to < 0 || to >= order.length) return order;

  const next = [...order];
  next.splice(from, 1);
  next.splice(to, 0, id);
  return next;
}

export function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

/** Library item with its chosen wording and any hand edits applied. */
export function resolveItem(
  item: ResumeItem,
  override: ItemOverride | undefined,
  bulletSetId: string | undefined,
): ResolvedItem {
  return {
    id: item.id,
    title: override?.title ?? item.title,
    organisation: override?.organisation ?? item.organisation,
    dates: override?.dates ?? item.dates,
    location: item.location,
    bullets: override?.bullets ?? bulletsFor(item, bulletSetId),
  };
}

/** True when the user has hand-edited this block away from the library wording. */
export function isItemEdited(
  item: ResumeItem,
  override: ItemOverride | undefined,
  bulletSetId: string | undefined,
): boolean {
  if (!override) return false;
  return (
    (override.title !== undefined && override.title !== item.title) ||
    (override.organisation !== undefined && override.organisation !== item.organisation) ||
    (override.dates !== undefined && override.dates !== item.dates) ||
    (override.bullets !== undefined &&
      JSON.stringify(override.bullets) !== JSON.stringify(bulletsFor(item, bulletSetId)))
  );
}

/** Ordered, filtered, resolved items for one section. */
export function sectionItems(
  library: ResumeLibrary,
  config: CvConfiguration,
  section: ItemSectionId,
): ResolvedItem[] {
  const byId = new Map(library.items[section].map((item) => [item.id, item]));
  const { order, excluded } = config.sections[section];

  return order
    .filter((id) => !excluded.includes(id))
    .map((id) => byId.get(id))
    .filter((item): item is ResumeItem => Boolean(item))
    .map((item) => resolveItem(item, config.overrides[item.id], config.bulletChoice[item.id]));
}

/** Everything the preview needs, in display order. */
export function composeResume(
  library: ResumeLibrary,
  rawConfig: CvConfiguration,
  profile: ResumeProfile,
): ComposedResume {
  const config = reconcile(rawConfig, library);
  const base = baseFor(library, config);
  const groupsById = new Map(library.skillGroups.map((group) => [group.id, group]));

  const sections = config.sectionOrder
    .filter((id) => !config.excludedSections.includes(id))
    .map<ComposedSection | null>((id) => {
      const label = sectionLabel(id, base);

      if (id === "summary") {
        const text = config.summary.trim() || base.summary;
        return text ? { id, label, text } : null;
      }

      if (id === "skills") {
        const skillGroups = config.skillOrder
          .filter((groupId) => !config.excludedSkillGroups.includes(groupId))
          .map((groupId) => groupsById.get(groupId))
          .filter((group): group is NonNullable<typeof group> => Boolean(group));
        return skillGroups.length ? { id, label, skillGroups } : null;
      }

      const items = sectionItems(library, config, id);
      return items.length ? { id, label, items } : null;
    })
    .filter((section): section is ComposedSection => section !== null);

  return {
    profile,
    headline: base.headline,
    contactFields: base.contactFields,
    sections,
  };
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** Plain-text CV, good enough to paste into an application form or a doc. */
export function resumeToPlainText(resume: ComposedResume): string {
  const { profile, contactFields } = resume;
  const contact: string[] = [];
  if (contactFields.includes("phone")) contact.push(profile.phone);
  if (contactFields.includes("email")) contact.push(profile.email);
  if (contactFields.includes("location")) contact.push(profile.location);

  const lines: string[] = [profile.name];
  if (resume.headline) lines.push(resume.headline);
  if (contact.length) lines.push(contact.join(" · "));
  if (contactFields.includes("links") && profile.links.length) {
    lines.push(profile.links.map((link) => `${link.label}: ${link.url}`).join(" · "));
  }
  lines.push("");

  for (const section of resume.sections) {
    lines.push(section.label.toUpperCase(), "-".repeat(section.label.length), "");

    if (section.text) lines.push(section.text, "");

    for (const item of section.items ?? []) {
      const heading = [item.title, item.organisation].filter(Boolean).join(" — ");
      lines.push(item.dates ? `${heading}  (${item.dates})` : heading);
      for (const bullet of item.bullets.filter((text) => text.trim())) {
        lines.push(`  • ${bullet}`);
      }
      lines.push("");
    }

    for (const group of section.skillGroups ?? []) {
      lines.push(`${group.label}: ${group.skills.join(", ")}`);
    }
    if (section.skillGroups?.length) lines.push("");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
