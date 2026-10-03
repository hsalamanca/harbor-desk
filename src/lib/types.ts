export type ModuleType =
  | "now"
  | "shortcuts"
  | "headlines"
  | "scratchpad"
  | "focus";

export type SizePreset = "compact" | "comfortable" | "wide";

export interface ShortcutItem {
  id: string;
  label: string;
  url: string;
}

export interface FocusItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ModuleBase {
  id: string;
  type: ModuleType;
  x: number;
  y: number;
  z: number;
  size: SizePreset;
}

export interface NowModule extends ModuleBase {
  type: "now";
  name: string;
}

export interface ShortcutsModule extends ModuleBase {
  type: "shortcuts";
  items: ShortcutItem[];
}

export interface HeadlinesModule extends ModuleBase {
  type: "headlines";
}

export interface ScratchpadModule extends ModuleBase {
  type: "scratchpad";
  text: string;
}

export interface FocusModule extends ModuleBase {
  type: "focus";
  items: FocusItem[];
}

export type DeskModule =
  | NowModule
  | ShortcutsModule
  | HeadlinesModule
  | ScratchpadModule
  | FocusModule;

export interface DeskState {
  version: 2;
  arrangeMode: boolean;
  landscapePreset: string;
  modules: DeskModule[];
  nextZ: number;
}

export interface HeadlineItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export const MODULE_LABELS: Record<ModuleType, string> = {
  now: "Now",
  shortcuts: "Shortcuts",
  headlines: "Headlines",
  scratchpad: "Scratchpad",
  focus: "Focus",
};

export const GRID = 24;

/** Pixel size presets per module type (width × height). */
export const SIZE_PRESETS: Record<
  ModuleType,
  Record<SizePreset, { w: number; h: number }>
> = {
  now: {
    compact: { w: 336, h: 192 },
    comfortable: { w: 432, h: 216 },
    wide: { w: 432, h: 216 },
  },
  shortcuts: {
    compact: { w: 264, h: 200 },
    comfortable: { w: 360, h: 200 },
    wide: { w: 456, h: 200 },
  },
  headlines: {
    compact: { w: 312, h: 420 },
    comfortable: { w: 360, h: 720 },
    wide: { w: 360, h: 720 },
  },
  scratchpad: {
    compact: { w: 336, h: 200 },
    comfortable: { w: 408, h: 280 },
    wide: { w: 408, h: 280 },
  },
  focus: {
    compact: { w: 408, h: 200 },
    comfortable: { w: 408, h: 280 },
    wide: { w: 408, h: 280 },
  },
};

export const SIZE_CYCLE: Record<ModuleType, SizePreset[]> = {
  now: ["compact", "comfortable"],
  shortcuts: ["compact", "comfortable", "wide"],
  headlines: ["compact", "comfortable"],
  scratchpad: ["compact", "comfortable"],
  focus: ["compact", "comfortable"],
};
