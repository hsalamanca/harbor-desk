export type LandscapeScene = {
  id: string;
  src: string;
  label: string;
  pack: "hourly" | "premium";
  /** Soft wash tint over the photo for readability */
  wash: string;
};

const coolWash =
  "linear-gradient(180deg, rgba(16,28,44,0.48) 0%, rgba(16,28,44,0.18) 50%, rgba(12,22,34,0.45) 100%)";
const nightWash =
  "linear-gradient(180deg, rgba(8,14,24,0.55) 0%, rgba(8,14,24,0.28) 45%, rgba(8,14,24,0.5) 100%)";
const dawnWash =
  "linear-gradient(180deg, rgba(32,36,48,0.42) 0%, rgba(40,44,52,0.18) 50%, rgba(28,34,44,0.4) 100%)";

/** 12 hourly scenes — auto rotation (two hours each). */
export const HOURLY_LANDSCAPES: LandscapeScene[] = [
  {
    id: "h-00",
    src: "https://picsum.photos/id/29/1920/1280",
    label: "Night overlook",
    pack: "hourly",
    wash: nightWash,
  },
  {
    id: "h-02",
    src: "https://picsum.photos/id/84/1920/1280",
    label: "Still water night",
    pack: "hourly",
    wash: nightWash,
  },
  {
    id: "h-04",
    src: "https://picsum.photos/id/96/1920/1280",
    label: "Pre-dawn hush",
    pack: "hourly",
    wash: dawnWash,
  },
  {
    id: "h-06",
    src: "https://picsum.photos/id/1016/1920/1280",
    label: "First ridgeline",
    pack: "hourly",
    wash: dawnWash,
  },
  {
    id: "h-08",
    src: "https://picsum.photos/id/1036/1920/1280",
    label: "Morning mist",
    pack: "hourly",
    wash: coolWash,
  },
  {
    id: "h-10",
    src: "https://picsum.photos/id/1015/1920/1280",
    label: "Coastal morning",
    pack: "hourly",
    wash: coolWash,
  },
  {
    id: "h-12",
    src: "https://picsum.photos/id/1018/1920/1280",
    label: "Open midday",
    pack: "hourly",
    wash: coolWash,
  },
  {
    id: "h-14",
    src: "https://picsum.photos/id/1019/1920/1280",
    label: "Afternoon range",
    pack: "hourly",
    wash: coolWash,
  },
  {
    id: "h-16",
    src: "https://picsum.photos/id/1043/1920/1280",
    label: "Late day paths",
    pack: "hourly",
    wash: dawnWash,
  },
  {
    id: "h-18",
    src: "https://picsum.photos/id/1044/1920/1280",
    label: "Golden ridges",
    pack: "hourly",
    wash: dawnWash,
  },
  {
    id: "h-20",
    src: "https://picsum.photos/id/1050/1920/1280",
    label: "Blue hour shore",
    pack: "hourly",
    wash: coolWash,
  },
  {
    id: "h-22",
    src: "https://picsum.photos/id/110/1920/1280",
    label: "Evening water",
    pack: "hourly",
    wash: nightWash,
  },
];

/** Extra premium scenic pack — available in the manual picker. */
export const PREMIUM_LANDSCAPES: LandscapeScene[] = [
  {
    id: "p-fjord",
    src: "https://picsum.photos/id/122/1920/1280",
    label: "Fjord glass",
    pack: "premium",
    wash: coolWash,
  },
  {
    id: "p-pine",
    src: "https://picsum.photos/id/128/1920/1280",
    label: "Pine edge",
    pack: "premium",
    wash: coolWash,
  },
  {
    id: "p-harbor",
    src: "https://picsum.photos/id/133/1920/1280",
    label: "Harbor steel",
    pack: "premium",
    wash: nightWash,
  },
  {
    id: "p-dune",
    src: "https://picsum.photos/id/142/1920/1280",
    label: "Cool dunes",
    pack: "premium",
    wash: dawnWash,
  },
  {
    id: "p-pass",
    src: "https://picsum.photos/id/146/1920/1280",
    label: "Mountain pass",
    pack: "premium",
    wash: coolWash,
  },
  {
    id: "p-lake",
    src: "https://picsum.photos/id/160/1920/1280",
    label: "Mirror lake",
    pack: "premium",
    wash: coolWash,
  },
  {
    id: "p-cliff",
    src: "https://picsum.photos/id/164/1920/1280",
    label: "Sea cliff",
    pack: "premium",
    wash: coolWash,
  },
  {
    id: "p-mist",
    src: "https://picsum.photos/id/183/1920/1280",
    label: "Valley mist",
    pack: "premium",
    wash: dawnWash,
  },
];

export const ALL_LANDSCAPES: LandscapeScene[] = [
  ...HOURLY_LANDSCAPES,
  ...PREMIUM_LANDSCAPES,
];

export const LANDSCAPE_PRESET = "hourly-v1+premium";

export function sceneForHour(hour: number): LandscapeScene {
  const slot = Math.floor((((hour % 24) + 24) % 24) / 2);
  return HOURLY_LANDSCAPES[slot] ?? HOURLY_LANDSCAPES[0];
}

export function sceneById(id: string | null | undefined): LandscapeScene | null {
  if (!id) return null;
  return ALL_LANDSCAPES.find((s) => s.id === id) ?? null;
}

export function preloadLandscape(src: string) {
  if (typeof window === "undefined") return;
  const img = new Image();
  img.src = src;
}
