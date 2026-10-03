import { createDefaultDesk } from "@/lib/default-desk";
import { LANDSCAPE_PRESET } from "@/lib/landscapes";
import type { DeskState } from "@/lib/types";

export const STORAGE_KEY = "harbor-desk-v2";

export function loadDeskState(): DeskState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeskState;
    if (parsed?.version !== 2 || !Array.isArray(parsed.modules)) return null;
    if (!parsed.landscapePreset) parsed.landscapePreset = LANDSCAPE_PRESET;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDeskState(state: DeskState): { ok: boolean; error?: string } {
  if (typeof window === "undefined") {
    return { ok: false, error: "unavailable" };
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export function createEmptyDesk(): DeskState {
  return {
    version: 2,
    arrangeMode: false,
    landscapePreset: LANDSCAPE_PRESET,
    modules: [],
    nextZ: 1,
  };
}

export { createDefaultDesk };
