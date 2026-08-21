/**
 * Résumé types.
 *
 * Three layers, each protected from the one above:
 *
 * 1. `ResumeLibrary` — the master source library. Every genuine experience,
 *    project, skill and qualification, extracted from the user's real CVs.
 *    Read-only in the app.
 * 2. `ResumeBase` — a *family* (Data/Graduate, Retail/Part-time). A family does
 *    not own content; it selects and orders items from the library and supplies
 *    a default summary. Adding a family costs a few lines of data.
 * 3. `CvConfiguration` — one job-specific version. References a family via
 *    `baseResumeId`, a job via `jobId`, and stores selections, ordering,
 *    per-item overrides and notes.
 *
 * An item missing from a family is *not* invalid — it is present in every
 * configuration, merely unchecked, so it can always be switched back on.
 */

import type { JobTrack } from "@/types/job";

export type ResumeSectionId =
  | "summary"
  | "education"
  | "experience"
  | "volunteer"
  | "projects"
  | "skills"
  | "additional";

/** Sections built from repeatable blocks (everything except summary + skills). */
export type ItemSectionId = "education" | "experience" | "volunteer" | "projects" | "additional";

/**
 * One truthful wording of an item's bullets.
 *
 * The same role is described differently across the user's CVs — a retail CV
 * emphasises customers served, a data CV emphasises modelling. Both are true, so
 * both are kept and a configuration picks one.
 */
export interface BulletSet {
  id: string;
  label: string;
  bullets: string[];
  /** Which source CV this wording came from. */
  source?: string;
}

export interface ResumeItem {
  id: string;
  title: string;
  organisation: string;
  dates: string;
  location?: string;
  /** At least one. The first is the default wording. */
  bulletSets: BulletSet[];
  tags?: string[];
  /** Non-conflicting context, e.g. an alternate title used on another version. */
  sourceNote?: string;
  /**
   * Details that genuinely disagree between source CVs. Surfaced in the editor
   * rather than resolved silently — only the user knows which is right.
   */
  conflicts?: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
  tags?: string[];
  conflicts?: string[];
}

/** Contact details. Kept out of the repo — see `data/resumes/library.ts`. */
export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: { label: string; url: string }[];
}

export type ContactField = "email" | "phone" | "location" | "links";

/** An alternate, equally truthful summary. */
export interface SummaryVariant {
  id: string;
  label: string;
  text: string;
  source?: string;
}

/** A CV family: which library items it selects, and how it presents them. */
export interface ResumeBase {
  id: string;
  name: string;
  /** Which job track this family is written for. */
  track: JobTrack;
  description: string;
  /** Sub-title under the name, e.g. "Retail Sales Assistant". */
  headline: string;
  /** Which contact details this family prints. */
  contactFields: ContactField[];

  summary: string;
  summaryVariants: SummaryVariant[];

  sectionOrder: ResumeSectionId[];
  /** Per-family section names, e.g. Retail lists volunteer work as "Experience". */
  sectionLabels?: Partial<Record<ResumeSectionId, string>>;
  /** Library item ids this family includes, in order. Others start unchecked. */
  defaults: Record<ItemSectionId, string[]>;
  skillGroupIds: string[];
  /** Default bullet wording per item for this family. */
  bulletChoice?: Record<string, string>;
}

export interface ResumeLibrary {
  profile: ResumeProfile;
  items: Record<ItemSectionId, ResumeItem[]>;
  skillGroups: SkillGroup[];
  bases: ResumeBase[];
}

// ---------------------------------------------------------------------------
// Job-specific overlay
// ---------------------------------------------------------------------------

/** Per-item edits. Any field left undefined falls back to the library item. */
export interface ItemOverride {
  title?: string;
  organisation?: string;
  dates?: string;
  /** Full replacement list once bullets have been edited by hand. */
  bullets?: string[];
}

/**
 * Display state for one item-bearing section.
 *
 * `order` holds every library item id — excluded ones included — so unchecking
 * and re-checking a block puts it back where it was.
 */
export interface SectionConfig {
  order: string[];
  excluded: string[];
}

export interface CvConfiguration {
  id: string;
  name: string;
  /** Which family this version started from. Changeable at any time. */
  baseResumeId: string;
  /** Links this version to a job on the board. `null` = general-purpose CV. */
  jobId: string | null;

  sectionOrder: ResumeSectionId[];
  excludedSections: ResumeSectionId[];
  sections: Record<ItemSectionId, SectionConfig>;

  skillOrder: string[];
  excludedSkillGroups: string[];

  /** Tailored summary. Empty string means "use the family's summary". */
  summary: string;
  /** Chosen bullet wording per item id. */
  bulletChoice: Record<string, string>;
  overrides: Record<string, ItemOverride>;
  notes: string;

  createdAt: string;
  updatedAt: string;
  /** Set by the Save version button — the last explicit checkpoint. */
  savedAt: string | null;
}

export type CvConfigurationMap = Record<string, CvConfiguration>;

// ---------------------------------------------------------------------------
// Composed output (what the preview renders)
// ---------------------------------------------------------------------------

/** A library item with its bullet choice and overrides applied. */
export interface ResolvedItem {
  id: string;
  title: string;
  organisation: string;
  dates: string;
  location?: string;
  bullets: string[];
}

export interface ComposedSection {
  id: ResumeSectionId;
  label: string;
  text?: string;
  items?: ResolvedItem[];
  skillGroups?: SkillGroup[];
}

export interface ComposedResume {
  profile: ResumeProfile;
  headline: string;
  contactFields: ContactField[];
  sections: ComposedSection[];
}
