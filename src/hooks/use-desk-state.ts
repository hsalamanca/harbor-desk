"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { findFreeSlot, snapToGrid } from "@/lib/grid";
import {
  createDefaultDesk,
  loadDeskState,
  saveDeskState,
} from "@/lib/storage";
import type {
  DeskModule,
  DeskState,
  LandscapeMode,
  ModuleType,
  SizePreset,
} from "@/lib/types";
import { SIZE_CYCLE, SIZE_PRESETS } from "@/lib/types";

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createModule(
  type: ModuleType,
  x: number,
  y: number,
  z: number
): DeskModule {
  const base = { id: uid(), x, y, z, size: "comfortable" as SizePreset };
  switch (type) {
    case "now":
      return { ...base, type, name: "Hugo" };
    case "shortcuts":
      return {
        ...base,
        type,
        size: "wide",
        items: [
          { id: uid(), label: "GitHub", url: "https://github.com" },
          { id: uid(), label: "Cursor", url: "https://cursor.com" },
          { id: uid(), label: "Docs", url: "https://nextjs.org/docs" },
        ],
      };
    case "headlines":
      return { ...base, type };
    case "scratchpad":
      return { ...base, type, text: "" };
    case "focus":
      return {
        ...base,
        type,
        size: "compact",
        items: [
          { id: uid(), text: "Clear the desk", done: false },
          { id: uid(), text: "Ship something small", done: false },
        ],
      };
    case "weather":
      return { ...base, type, place: "Houston, TX" };
    case "calendar":
      return { ...base, type };
    case "folders":
      return {
        ...base,
        type,
        folders: [
          {
            id: uid(),
            name: "Work",
            links: [
              { id: uid(), label: "Linear", url: "https://linear.app" },
            ],
          },
        ],
      };
    case "quote":
      return { ...base, type, size: "compact" };
  }
}

export function useDeskState() {
  const [state, setState] = useState<DeskState | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    const loaded = loadDeskState();
    setState(loaded ?? createDefaultDesk());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !state) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    const result = saveDeskState(state);
    setStorageError(!result.ok);
  }, [state, hydrated]);

  const update = useCallback((fn: (prev: DeskState) => DeskState) => {
    setState((prev) => (prev ? fn(prev) : prev));
  }, []);

  const replaceDesk = useCallback((next: DeskState) => {
    skipSave.current = false;
    setState(next);
  }, []);

  const setArrangeMode = useCallback(
    (arrangeMode: boolean) => {
      update((prev) => ({ ...prev, arrangeMode }));
    },
    [update]
  );

  const setLandscapeMode = useCallback(
    (landscapeMode: LandscapeMode, landscapeSceneId?: string | null) => {
      update((prev) => ({
        ...prev,
        landscapeMode,
        landscapeSceneId:
          landscapeMode === "manual"
            ? landscapeSceneId ?? prev.landscapeSceneId
            : null,
      }));
    },
    [update]
  );

  const setLandscapeSceneId = useCallback(
    (landscapeSceneId: string) => {
      update((prev) => ({
        ...prev,
        landscapeMode: "manual",
        landscapeSceneId,
      }));
    },
    [update]
  );

  const addModule = useCallback(
    (type: ModuleType, viewportW: number, viewportH: number) => {
      update((prev) => {
        const size = SIZE_PRESETS[type].comfortable;
        const occupied = prev.modules.map((m) => {
          const s = SIZE_PRESETS[m.type][m.size];
          return { x: m.x, y: m.y, w: s.w, h: s.h };
        });
        const slot = findFreeSlot(
          occupied,
          size.w,
          size.h,
          viewportW,
          viewportH
        );
        const module = createModule(type, slot.x, slot.y, prev.nextZ);
        return {
          ...prev,
          nextZ: prev.nextZ + 1,
          modules: [...prev.modules, module],
        };
      });
    },
    [update]
  );

  const removeModule = useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        modules: prev.modules.filter((m) => m.id !== id),
      }));
    },
    [update]
  );

  const bringToFront = useCallback(
    (id: string) => {
      update((prev) => {
        const z = prev.nextZ;
        return {
          ...prev,
          nextZ: z + 1,
          modules: prev.modules.map((m) =>
            m.id === id ? { ...m, z } : m
          ),
        };
      });
    },
    [update]
  );

  const moveModule = useCallback(
    (id: string, x: number, y: number, free: boolean) => {
      update((prev) => ({
        ...prev,
        modules: prev.modules.map((m) =>
          m.id === id
            ? {
                ...m,
                x: Math.max(0, snapToGrid(x, free)),
                y: Math.max(0, snapToGrid(y, free)),
              }
            : m
        ),
      }));
    },
    [update]
  );

  const cycleSize = useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        modules: prev.modules.map((m) => {
          if (m.id !== id) return m;
          const cycle = SIZE_CYCLE[m.type];
          if (cycle.length <= 1) return m;
          const idx = cycle.indexOf(m.size);
          const next = cycle[(idx + 1) % cycle.length];
          return { ...m, size: next };
        }),
      }));
    },
    [update]
  );

  const patchModule = useCallback(
    <T extends DeskModule>(id: string, patch: Partial<T>) => {
      update((prev) => ({
        ...prev,
        modules: prev.modules.map((m) =>
          m.id === id ? ({ ...m, ...patch } as DeskModule) : m
        ),
      }));
    },
    [update]
  );

  const resetToDefault = useCallback(() => {
    replaceDesk(createDefaultDesk());
  }, [replaceDesk]);

  return {
    state,
    hydrated,
    storageError,
    setArrangeMode,
    setLandscapeMode,
    setLandscapeSceneId,
    addModule,
    removeModule,
    bringToFront,
    moveModule,
    cycleSize,
    patchModule,
    replaceDesk,
    resetToDefault,
  };
}
