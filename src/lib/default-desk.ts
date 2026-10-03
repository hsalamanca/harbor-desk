import type { DeskState } from "@/lib/types";
import { LANDSCAPE_PRESET } from "@/lib/landscapes";

/**
 * Carefully composed first-open layout for a ~1440×900 desk.
 * Left stack anchors the day; right column holds headlines;
 * mid band pairs shortcuts with scratchpad; focus closes the scene.
 */
export function createDefaultDesk(): DeskState {
  return {
    version: 2,
    arrangeMode: false,
    landscapePreset: LANDSCAPE_PRESET,
    nextZ: 6,
    modules: [
      {
        id: "seed-now",
        type: "now",
        x: 64,
        y: 80,
        z: 5,
        size: "comfortable",
        name: "Hugo",
      },
      {
        id: "seed-headlines",
        type: "headlines",
        x: 1020,
        y: 80,
        z: 2,
        size: "comfortable",
      },
      {
        id: "seed-shortcuts",
        type: "shortcuts",
        x: 64,
        y: 336,
        z: 3,
        size: "wide",
        items: [
          { id: "sc-gh", label: "GitHub", url: "https://github.com" },
          { id: "sc-cursor", label: "Cursor", url: "https://cursor.com" },
          { id: "sc-docs", label: "Docs", url: "https://nextjs.org/docs" },
          { id: "sc-mail", label: "Mail", url: "https://mail.google.com" },
        ],
      },
      {
        id: "seed-scratch",
        type: "scratchpad",
        x: 552,
        y: 336,
        z: 4,
        size: "comfortable",
        text: "What needs a clear pass today?",
      },
      {
        id: "seed-focus",
        type: "focus",
        x: 552,
        y: 648,
        z: 1,
        size: "compact",
        items: [
          { id: "t1", text: "Protect the morning block", done: false },
          { id: "t2", text: "Ship one small thing", done: false },
          { id: "t3", text: "Leave the desk calmer", done: false },
        ],
      },
    ],
  };
}
