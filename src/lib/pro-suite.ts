import type { ModuleType } from "@/lib/types";

/**
 * Light structure for a future paid Pro tier.
 * Everything listed here is fully unlocked today (solo / free use).
 */
export const PRO_SUITE = {
  unlocked: true as const,
  label: "Harbor Suite",
  modules: ["weather", "calendar", "folders", "quote"] as const satisfies readonly ModuleType[],
  features: [
    "premium-landscapes",
    "manual-scene-picker",
    "desk-presets",
    "export-import",
  ] as const,
};

export type ProSuiteModule = (typeof PRO_SUITE.modules)[number];

export function isProSuiteModule(type: ModuleType): boolean {
  return (PRO_SUITE.modules as readonly string[]).includes(type);
}
