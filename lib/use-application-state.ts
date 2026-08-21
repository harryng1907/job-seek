"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  createApplicationState,
  hydrateStateMap,
  loadStateMap,
  saveStateMap,
  withPatch,
  withStatus,
} from "@/lib/application-state";
import type {
  ApplicationState,
  ApplicationStateMap,
  ApplicationStatus,
} from "@/types/application";

/**
 * The user's manual application state, held in a tiny external store.
 *
 * localStorage genuinely *is* an external system, so `useSyncExternalStore` is
 * the right primitive: React renders the seed on the server, hydrates against
 * it, then immediately re-reads the stored snapshot on the client. No
 * setState-in-effect, and no hydration mismatch.
 *
 * Swapping localStorage for Supabase means changing `loadStateMap` /
 * `saveStateMap` and pushing remote updates through `update()`.
 */

let seed: ApplicationStateMap = {};
let snapshot: ApplicationStateMap | null = null;
const listeners = new Set<() => void>();

/** Register the server-rendered seed. Ignored once real state has been read. */
function primeSeed(next: ApplicationStateMap): void {
  if (snapshot === null) seed = next;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ApplicationStateMap {
  snapshot ??= hydrateStateMap(seed, loadStateMap());
  return snapshot;
}

function getServerSnapshot(): ApplicationStateMap {
  return seed;
}

function update(updater: (prev: ApplicationStateMap) => ApplicationStateMap): void {
  snapshot = updater(getSnapshot());
  saveStateMap(snapshot);
  listeners.forEach((listener) => listener());
}

/** Read-or-create, so jobs added by a later pipeline run just work. */
function ensure(map: ApplicationStateMap, jobId: string): ApplicationState {
  return map[jobId] ?? createApplicationState(jobId);
}

export function useApplicationState(seedState: ApplicationStateMap) {
  primeSeed(seedState);
  const states = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setStatus = useCallback(
    (jobId: string, status: ApplicationStatus, today: string) => {
      update((prev) => ({
        ...prev,
        [jobId]: withStatus(ensure(prev, jobId), status, today),
      }));
    },
    [],
  );

  const patchState = useCallback((jobId: string, patch: Partial<ApplicationState>) => {
    update((prev) => ({ ...prev, [jobId]: withPatch(ensure(prev, jobId), patch) }));
  }, []);

  const toggleDocument = useCallback((jobId: string, document: string) => {
    update((prev) => {
      const current = ensure(prev, jobId);
      return {
        ...prev,
        [jobId]: withPatch(current, {
          documents: { ...current.documents, [document]: !current.documents[document] },
        }),
      };
    });
  }, []);

  const setAnswer = useCallback((jobId: string, index: number, value: string) => {
    update((prev) => {
      const current = ensure(prev, jobId);
      return {
        ...prev,
        [jobId]: withPatch(current, { answers: { ...current.answers, [index]: value } }),
      };
    });
  }, []);

  /** Discard local changes and go back to the seed. */
  const resetAll = useCallback(() => {
    update(() => seed);
  }, []);

  return { states, setStatus, patchState, toggleDocument, setAnswer, resetAll };
}
