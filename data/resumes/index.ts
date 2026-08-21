import { dataResume } from "@/data/resumes/data-resume";
import {
  libraryItems,
  librarySkillGroups,
  placeholderProfile,
} from "@/data/resumes/library";
import { retailResume } from "@/data/resumes/retail-resume";
import type { ResumeLibrary } from "@/types/resume";

/**
 * The résumé library: one master pool of genuine content, plus the CV families
 * that select from it.
 *
 * Adding a third family (hospitality, tutoring, internships) means adding one
 * file here — no changes to the builder, the store or the preview.
 */
export const resumeLibrary: ResumeLibrary = {
  profile: placeholderProfile,
  items: libraryItems,
  skillGroups: librarySkillGroups,
  bases: [dataResume, retailResume],
};

export { collectConflicts } from "@/data/resumes/library";
