export type ModuleType =
  | "now"
  | "shortcuts"
  | "headlines"
  | "scratchpad"
  | "focus"
  | "weather"
  | "calendar"
  | "folders"
  | "quote";

export type SizePreset = "compact" | "comfortable" | "wide";

export type LandscapeMode = "auto" | "manual";

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

export interface FolderLink {
  id: string;
  label: string;
  url: string;
}

export interface LinkFolder {
  id: string;
  name: string;
  links: FolderLink[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  place?: string;
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

export interface WeatherModule extends ModuleBase {
  type: "weather";
  place: string;
}

export interface CalendarModule extends ModuleBase {
  type: "calendar";
}

export interface FoldersModule extends ModuleBase {
  type: "folders";
  folders: LinkFolder[];
}

export interface QuoteModule extends ModuleBase {
  type: "quote";
}

export type DeskModule =
  | NowModule
  | ShortcutsModule
  | HeadlinesModule
  | ScratchpadModule
  | FocusModule
  | WeatherModule
  | CalendarModule
  | FoldersModule
  | QuoteModule;

export interface DeskState {
  version: 3;
  arrangeMode: boolean;
  landscapePreset: string;
  landscapeMode: LandscapeMode;
  /** Scene id when landscapeMode is manual */
  landscapeSceneId: string | null;
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
  weather: "Weather",
  calendar: "Calendar",
  folders: "Folders",
  quote: "Quote",
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
  weather: {
    compact: { w: 264, h: 200 },
    comfortable: { w: 312, h: 216 },
    wide: { w: 360, h: 216 },
  },
  calendar: {
    compact: { w: 312, h: 240 },
    comfortable: { w: 360, h: 300 },
    wide: { w: 408, h: 300 },
  },
  folders: {
    compact: { w: 312, h: 240 },
    comfortable: { w: 384, h: 280 },
    wide: { w: 456, h: 280 },
  },
  quote: {
    compact: { w: 312, h: 200 },
    comfortable: { w: 408, h: 216 },
    wide: { w: 456, h: 216 },
  },
};

export const SIZE_CYCLE: Record<ModuleType, SizePreset[]> = {
  now: ["compact", "comfortable"],
  shortcuts: ["compact", "comfortable", "wide"],
  headlines: ["compact", "comfortable"],
  scratchpad: ["compact", "comfortable"],
  focus: ["compact", "comfortable"],
  weather: ["compact", "comfortable"],
  calendar: ["compact", "comfortable"],
  folders: ["compact", "comfortable", "wide"],
  quote: ["compact", "comfortable"],
};
