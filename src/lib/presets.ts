import type { DeskState } from "@/lib/types";

export type DeskPresetFile = {
  kind: "harbor-desk-preset";
  version: 1;
  exportedAt: string;
  name?: string;
  desk: DeskState;
};

export function exportDeskPreset(state: DeskState, name?: string): DeskPresetFile {
  return {
    kind: "harbor-desk-preset",
    version: 1,
    exportedAt: new Date().toISOString(),
    name,
    desk: {
      ...state,
      arrangeMode: false,
    },
  };
}

export function parseDeskPreset(raw: string): DeskState {
  const parsed = JSON.parse(raw) as DeskPresetFile | DeskState;
  if (
    parsed &&
    typeof parsed === "object" &&
    "kind" in parsed &&
    parsed.kind === "harbor-desk-preset" &&
    parsed.desk
  ) {
    return normalizeImportedDesk(parsed.desk);
  }
  return normalizeImportedDesk(parsed as DeskState);
}

function normalizeImportedDesk(desk: DeskState): DeskState {
  if (!desk || !Array.isArray(desk.modules)) {
    throw new Error("Invalid desk preset");
  }
  return {
    version: 3,
    arrangeMode: false,
    landscapePreset: desk.landscapePreset ?? "hourly-v1+premium",
    landscapeMode: desk.landscapeMode ?? "auto",
    landscapeSceneId: desk.landscapeSceneId ?? null,
    modules: desk.modules,
    nextZ: desk.nextZ ?? desk.modules.length + 1,
  };
}

export function downloadPreset(state: DeskState, filename = "harbor-desk-preset.json") {
  const payload = exportDeskPreset(state);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
