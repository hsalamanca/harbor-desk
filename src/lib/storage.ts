import { createDefaultDesk } from "@/lib/default-desk";
import { LANDSCAPE_PRESET } from "@/lib/landscapes";
import type { DeskState } from "@/lib/types";

export const STORAGE_KEY = "harbor-desk-v3";
const LEGACY_KEY = "harbor-desk-v2";

export function loadDeskState(): DeskState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DeskState> & {
      version?: number;
      modules?: DeskState["modules"];
    };
    if (!Array.isArray(parsed.modules)) return null;
    const migrated: DeskState = {
      version: 3,
      arrangeMode: !!parsed.arrangeMode,
      landscapePreset: parsed.landscapePreset ?? LANDSCAPE_PRESET,
      landscapeMode: parsed.landscapeMode ?? "auto",
      landscapeSceneId: parsed.landscapeSceneId ?? null,
      modules: parsed.modules,
      nextZ: parsed.nextZ ?? parsed.modules.length + 1,
    };
    return migrated;
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
    version: 3,
    arrangeMode: false,
    landscapePreset: LANDSCAPE_PRESET,
    landscapeMode: "auto",
    landscapeSceneId: null,
    modules: [],
    nextZ: 1,
  };
}

export { createDefaultDesk };
