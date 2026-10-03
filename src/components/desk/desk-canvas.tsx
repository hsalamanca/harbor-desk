"use client";

import { useState } from "react";
import { AddModuleDialog } from "@/components/desk/add-module-dialog";
import { DeskTopBar } from "@/components/desk/desk-top-bar";
import { EmptyDesk } from "@/components/desk/empty-desk";
import { LandscapeBackdrop } from "@/components/desk/landscape-backdrop";
import { ModuleShell } from "@/components/desk/module-shell";
import { SoftGrid } from "@/components/desk/soft-grid";
import { useDeskState } from "@/hooks/use-desk-state";
import type { DeskModule, ModuleType } from "@/lib/types";

export function DeskCanvas() {
  const {
    state,
    hydrated,
    storageError,
    setArrangeMode,
    addModule,
    removeModule,
    bringToFront,
    moveModule,
    cycleSize,
    patchModule,
  } = useDeskState();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  if (!hydrated || !state) {
    return (
      <div className="harbor-root relative min-h-dvh overflow-hidden">
        <LandscapeBackdrop />
        <div className="desk-loading" aria-label="Loading desk">
          <div className="desk-loading-card space-y-3">
            <div className="harbor-shimmer h-3 w-24 rounded-full" />
            <div className="harbor-shimmer h-8 w-48 rounded-xl" />
            <div className="harbor-shimmer h-3 w-full rounded-full" />
            <div className="harbor-shimmer h-3 w-4/5 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const openPicker = () => {
    if (!state.arrangeMode) setArrangeMode(true);
    setPickerOpen(true);
  };

  const handlePick = (type: ModuleType) => {
    addModule(type, window.innerWidth, window.innerHeight);
  };

  return (
    <div className="harbor-root relative min-h-dvh overflow-hidden">
      <LandscapeBackdrop />
      <SoftGrid visible={state.arrangeMode || dragging} />

      <DeskTopBar
        arrangeMode={state.arrangeMode}
        onToggleArrange={() => setArrangeMode(!state.arrangeMode)}
        onAdd={openPicker}
        showAdd={state.arrangeMode}
      />

      {storageError && (
        <div className="absolute left-1/2 top-16 z-50 -translate-x-1/2 rounded-full desk-chrome px-3 py-1.5 text-xs text-[var(--harbor-ink-muted)]">
          Storage unavailable — changes won’t persist this session.
        </div>
      )}

      {state.modules.length === 0 ? (
        <EmptyDesk onAdd={openPicker} />
      ) : (
        <div className="relative min-h-dvh w-full">
          {state.modules
            .slice()
            .sort((a, b) => a.z - b.z)
            .map((module, index) => (
              <ModuleShell
                key={module.id}
                module={module}
                arrangeMode={state.arrangeMode}
                index={index}
                storageError={storageError}
                onBringToFront={() => bringToFront(module.id)}
                onMove={(x, y, free) => moveModule(module.id, x, y, free)}
                onCycleSize={() => cycleSize(module.id)}
                onRemove={() => removeModule(module.id)}
                onPatch={(patch) =>
                  patchModule(module.id, patch as Partial<DeskModule>)
                }
                onDragActive={setDragging}
              />
            ))}
        </div>
      )}

      <AddModuleDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={handlePick}
      />
    </div>
  );
}
