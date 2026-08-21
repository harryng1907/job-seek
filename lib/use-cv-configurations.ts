"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { seedCvConfigurations } from "@/data/cv-configurations";
import { resumeLibrary } from "@/data/resumes";
import {
  applyBase,
  createConfiguration,
  findBase,
  reconcile,
  resetConfiguration,
  suggestBaseResumeId,
} from "@/lib/resume";
import type { Job } from "@/types/job";
import type { CvConfiguration, CvConfigurationMap, ResumeProfile } from "@/types/resume";

/**
 * Job-specific CV versions and the user's contact details, stored exactly like
 * application state: small external stores over localStorage, seeded from data
 * files and completely separate from the résumé library.
 *
 * Edits autosave. "Save version" is an explicit checkpoint on top of that, not
 * the only thing standing between the user and losing work.
 */

const STORAGE_KEY = "job-seek.cv-configurations.v1";
const PROFILE_KEY = "job-seek.cv-profile.v1";

function readKey<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeKey(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private-mode failures are non-fatal.
  }
}

// ---------------------------------------------------------------------------
// Configurations
// ---------------------------------------------------------------------------

let snapshot: CvConfigurationMap | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Stored state is authoritative once it exists: the first write persists the
 * whole map, so re-merging the seed here would resurrect versions the user has
 * deleted. The cost is that seed versions added in code later only reach users
 * with no stored state — the right trade for user-owned data.
 */
function getSnapshot(): CvConfigurationMap {
  snapshot ??= readKey<CvConfigurationMap>(STORAGE_KEY) ?? seedCvConfigurations;
  return snapshot;
}

function getServerSnapshot(): CvConfigurationMap {
  return seedCvConfigurations;
}

function update(updater: (prev: CvConfigurationMap) => CvConfigurationMap): void {
  snapshot = updater(getSnapshot());
  writeKey(STORAGE_KEY, snapshot);
  listeners.forEach((listener) => listener());
}

function newId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}

export function useCvConfigurations() {
  const configs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /** Oldest first, so the master versions stay at the top of the picker. */
  const list = useMemo(
    () =>
      Object.values(configs)
        .map((config) => reconcile(config, resumeLibrary))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [configs],
  );

  const patch = useCallback((id: string, changes: Partial<CvConfiguration>) => {
    update((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: { ...current, ...changes, updatedAt: new Date().toISOString() },
      };
    });
  }, []);

  const create = useCallback((name: string, baseId: string, jobId: string | null = null) => {
    const id = newId("cfg");
    const base = findBase(resumeLibrary, baseId) ?? resumeLibrary.bases[0];
    update((prev) => ({
      ...prev,
      [id]: createConfiguration(resumeLibrary, base, { id, name, jobId }),
    }));
    return id;
  }, []);

  /** Switch families, keeping the user's own writing. */
  const changeBase = useCallback((id: string, baseId: string) => {
    update((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return { ...prev, [id]: applyBase(resumeLibrary, current, baseId) };
    });
  }, []);

  const duplicate = useCallback((id: string) => {
    const source = getSnapshot()[id];
    if (!source) return null;

    const copyId = newId("cfg");
    const now = new Date().toISOString();
    update((prev) => ({
      ...prev,
      [copyId]: {
        ...structuredClone(source),
        id: copyId,
        name: `${source.name} (copy)`,
        createdAt: now,
        updatedAt: now,
        savedAt: null,
      },
    }));
    return copyId;
  }, []);

  const reset = useCallback((id: string) => {
    update((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return { ...prev, [id]: resetConfiguration(current, resumeLibrary) };
    });
  }, []);

  const remove = useCallback((id: string) => {
    update((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  /** Explicit checkpoint from the Save version button. */
  const stamp = useCallback((id: string) => {
    const now = new Date().toISOString();
    update((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return { ...prev, [id]: { ...current, savedAt: now, updatedAt: now } };
    });
  }, []);

  /**
   * Find (or start) the CV version for a job — what "Tailor CV for this job"
   * calls.
   *
   * The base résumé is chosen from the job's track: a retail role starts from
   * the retail CV, a data role from the data CV. A new version copies the
   * matching master version when one exists, so the user begins from their real
   * CV rather than a blank slate — and can change the family afterwards.
   */
  const ensureForJob = useCallback((job: Job, name: string) => {
    const existing = Object.values(getSnapshot()).find(
      (config) => config.jobId === job.id,
    );
    if (existing) return existing.id;

    const baseId = suggestBaseResumeId(resumeLibrary, job);
    const base = findBase(resumeLibrary, baseId) ?? resumeLibrary.bases[0];
    const id = newId("cfg");
    const now = new Date().toISOString();

    update((prev) => {
      const master = Object.values(prev).find(
        (config) => config.jobId === null && config.baseResumeId === baseId,
      );
      const seeded = master
        ? { ...structuredClone(master), summary: "", notes: "" }
        : createConfiguration(resumeLibrary, base, { id, name, jobId: job.id });

      return {
        ...prev,
        [id]: {
          ...seeded,
          id,
          name,
          baseResumeId: baseId,
          jobId: job.id,
          createdAt: now,
          updatedAt: now,
          savedAt: null,
        },
      };
    });
    return id;
  }, []);

  return {
    configs,
    list,
    patch,
    create,
    changeBase,
    duplicate,
    reset,
    remove,
    stamp,
    ensureForJob,
  };
}

// ---------------------------------------------------------------------------
// Contact details
// ---------------------------------------------------------------------------

/**
 * The user's real contact details.
 *
 * Kept in localStorage rather than in a data file, because this repo is headed
 * for GitHub and a phone number, email and home suburb should not go with it.
 */
let profileSnapshot: ResumeProfile | null = null;
const profileListeners = new Set<() => void>();

function subscribeProfile(listener: () => void): () => void {
  profileListeners.add(listener);
  return () => profileListeners.delete(listener);
}

function getProfileSnapshot(): ResumeProfile {
  profileSnapshot ??= readKey<ResumeProfile>(PROFILE_KEY) ?? resumeLibrary.profile;
  return profileSnapshot;
}

function getProfileServerSnapshot(): ResumeProfile {
  return resumeLibrary.profile;
}

export function useResumeProfile() {
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getProfileServerSnapshot,
  );

  const patchProfile = useCallback((changes: Partial<ResumeProfile>) => {
    profileSnapshot = { ...getProfileSnapshot(), ...changes };
    writeKey(PROFILE_KEY, profileSnapshot);
    profileListeners.forEach((listener) => listener());
  }, []);

  return { profile, patchProfile };
}
