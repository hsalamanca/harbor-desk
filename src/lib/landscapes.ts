export type LandscapeScene = {
  id: string;
  src: string;
  label: string;
  /** Soft wash tint over the photo for readability */
  wash: string;
};

/**
 * 12 curated scenes — each covers two clock hours.
 * Hosted via Picsum (stable Unsplash IDs) so the desk loads without bundling megabytes of JPEGs.
 * Mapping preset: hourly-v1
 */
export const HOURLY_LANDSCAPES: LandscapeScene[] = [
  {
    id: "00",
    src: "https://picsum.photos/id/29/1920/1280",
    label: "Night overlook",
    wash: "linear-gradient(180deg, rgba(8,14,24,0.55) 0%, rgba(8,14,24,0.28) 45%, rgba(8,14,24,0.5) 100%)",
  },
  {
    id: "02",
    src: "https://picsum.photos/id/84/1920/1280",
    label: "Still water night",
    wash: "linear-gradient(180deg, rgba(10,16,28,0.52) 0%, rgba(10,16,28,0.25) 50%, rgba(10,16,28,0.48) 100%)",
  },
  {
    id: "04",
    src: "https://picsum.photos/id/96/1920/1280",
    label: "Pre-dawn hush",
    wash: "linear-gradient(180deg, rgba(18,28,42,0.48) 0%, rgba(18,28,42,0.22) 48%, rgba(18,28,42,0.42) 100%)",
  },
  {
    id: "06",
    src: "https://picsum.photos/id/1016/1920/1280",
    label: "First ridgeline",
    wash: "linear-gradient(180deg, rgba(32,36,48,0.42) 0%, rgba(40,44,52,0.18) 50%, rgba(28,34,44,0.4) 100%)",
  },
  {
    id: "08",
    src: "https://picsum.photos/id/1036/1920/1280",
    label: "Morning mist",
    wash: "linear-gradient(180deg, rgba(36,48,58,0.4) 0%, rgba(36,48,58,0.16) 52%, rgba(30,40,50,0.38) 100%)",
  },
  {
    id: "10",
    src: "https://picsum.photos/id/1015/1920/1280",
    label: "Coastal morning",
    wash: "linear-gradient(180deg, rgba(28,44,58,0.38) 0%, rgba(28,44,58,0.14) 50%, rgba(24,38,52,0.36) 100%)",
  },
  {
    id: "12",
    src: "https://picsum.photos/id/1018/1920/1280",
    label: "Open midday",
    wash: "linear-gradient(180deg, rgba(24,40,52,0.36) 0%, rgba(24,40,52,0.12) 52%, rgba(20,34,46,0.34) 100%)",
  },
  {
    id: "14",
    src: "https://picsum.photos/id/1019/1920/1280",
    label: "Afternoon range",
    wash: "linear-gradient(180deg, rgba(30,42,52,0.38) 0%, rgba(30,42,52,0.14) 50%, rgba(26,38,48,0.36) 100%)",
  },
  {
    id: "16",
    src: "https://picsum.photos/id/1043/1920/1280",
    label: "Late day paths",
    wash: "linear-gradient(180deg, rgba(36,40,48,0.4) 0%, rgba(36,40,48,0.16) 50%, rgba(30,36,44,0.4) 100%)",
  },
  {
    id: "18",
    src: "https://picsum.photos/id/1044/1920/1280",
    label: "Golden ridges",
    wash: "linear-gradient(180deg, rgba(40,36,40,0.42) 0%, rgba(40,36,40,0.16) 50%, rgba(32,34,40,0.42) 100%)",
  },
  {
    id: "20",
    src: "https://picsum.photos/id/1050/1920/1280",
    label: "Blue hour shore",
    wash: "linear-gradient(180deg, rgba(16,28,44,0.5) 0%, rgba(16,28,44,0.22) 48%, rgba(14,24,38,0.48) 100%)",
  },
  {
    id: "22",
    src: "https://picsum.photos/id/110/1920/1280",
    label: "Evening water",
    wash: "linear-gradient(180deg, rgba(12,20,34,0.52) 0%, rgba(12,20,34,0.24) 48%, rgba(10,18,30,0.5) 100%)",
  },
];

export const LANDSCAPE_PRESET = "hourly-v1";

export function sceneForHour(hour: number): LandscapeScene {
  const slot = Math.floor((((hour % 24) + 24) % 24) / 2);
  return HOURLY_LANDSCAPES[slot] ?? HOURLY_LANDSCAPES[0];
}

export function preloadLandscape(src: string) {
  if (typeof window === "undefined") return;
  const img = new Image();
  img.src = src;
}
