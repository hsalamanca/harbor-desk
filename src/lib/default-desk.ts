import type { DeskState } from "@/lib/types";
import { LANDSCAPE_PRESET } from "@/lib/landscapes";

/**
 * Richer composed first-open layout (~1440×900) including Harbor Suite modules.
 */
export function createDefaultDesk(): DeskState {
  return {
    version: 3,
    arrangeMode: false,
    landscapePreset: LANDSCAPE_PRESET,
    landscapeMode: "auto",
    landscapeSceneId: null,
    nextZ: 10,
    modules: [
      {
        id: "seed-now",
        type: "now",
        x: 48,
        y: 72,
        z: 9,
        size: "comfortable",
        name: "Hugo",
      },
      {
        id: "seed-weather",
        type: "weather",
        x: 504,
        y: 72,
        z: 8,
        size: "comfortable",
        place: "Harbor City",
      },
      {
        id: "seed-quote",
        type: "quote",
        x: 840,
        y: 72,
        z: 7,
        size: "compact",
      },
      {
        id: "seed-headlines",
        type: "headlines",
        x: 1104,
        y: 72,
        z: 6,
        size: "compact",
      },
      {
        id: "seed-shortcuts",
        type: "shortcuts",
        x: 48,
        y: 312,
        z: 5,
        size: "wide",
        items: [
          { id: "sc-gh", label: "GitHub", url: "https://github.com" },
          { id: "sc-cursor", label: "Cursor", url: "https://cursor.com" },
          { id: "sc-docs", label: "Docs", url: "https://nextjs.org/docs" },
          { id: "sc-mail", label: "Mail", url: "https://mail.google.com" },
        ],
      },
      {
        id: "seed-folders",
        type: "folders",
        x: 528,
        y: 312,
        z: 4,
        size: "comfortable",
        folders: [
          {
            id: "fd-work",
            name: "Work",
            links: [
              { id: "lw1", label: "Linear", url: "https://linear.app" },
              { id: "lw2", label: "Notion", url: "https://notion.so" },
            ],
          },
          {
            id: "fd-read",
            name: "Read",
            links: [
              { id: "lr1", label: "HN", url: "https://news.ycombinator.com" },
              { id: "lr2", label: "Arc", url: "https://arc.net" },
            ],
          },
        ],
      },
      {
        id: "seed-calendar",
        type: "calendar",
        x: 48,
        y: 552,
        z: 3,
        size: "comfortable",
      },
      {
        id: "seed-focus",
        type: "focus",
        x: 432,
        y: 552,
        z: 2,
        size: "compact",
        items: [
          { id: "t1", text: "Protect the morning block", done: false },
          { id: "t2", text: "Ship one small thing", done: false },
          { id: "t3", text: "Leave the desk calmer", done: false },
        ],
      },
      {
        id: "seed-scratch",
        type: "scratchpad",
        x: 864,
        y: 552,
        z: 1,
        size: "compact",
        text: "What needs a clear pass today?",
      },
    ],
  };
}
