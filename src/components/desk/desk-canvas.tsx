"use client";

import { useMemo, useState } from "react";
import { AddModuleDialog } from "@/components/desk/add-module-dialog";
import { DeskTopBar } from "@/components/desk/desk-top-bar";
import { EmptyDesk } from "@/components/desk/empty-desk";
import { LandscapeBackdrop } from "@/components/desk/landscape-backdrop";
import { LandscapePicker } from "@/components/desk/landscape-picker";
import { ModuleShell } from "@/components/desk/module-shell";
import { PresetsDialog } from "@/components/desk/presets-dialog";
import { SoftGrid } from "@/components/desk/soft-grid";
import { useDeskState } from "@/hooks/use-desk-state";
import { useMobileDesk } from "@/hooks/use-media-query";
import type { DeskModule, ModuleType } from "@/lib/types";

function stackSort(a: DeskModule, b: DeskModule) {
  return a.y - b.y || a.x - b.x || a.z - b.z;
}

export function DeskCanvas() {
  const {
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
    reorderModule,
    cycleSize,
    patchModule,
    replaceDesk,
    resetToDefault,
  } = useDeskState();
  const mobile = useMobileDesk();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [scenesOpen, setScenesOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const stackedModules = useMemo(() => {
    if (!state) return [];
    return state.modules.slice().sort(stackSort);
  }, [state]);

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

  const layout = mobile ? "stack" : "canvas";

  const openPicker = () => {
    if (!state.arrangeMode) setArrangeMode(true);
    setPickerOpen(true);
  };

  const handlePick = (type: ModuleType) => {
    addModule(type, window.innerWidth, window.innerHeight);
  };

  return (
    <div
      className={`harbor-root relative min-h-dvh ${
        mobile ? "harbor-root-mobile overflow-x-hidden" : "overflow-hidden"
      }`}
    >
      <LandscapeBackdrop
        mode={state.landscapeMode}
        sceneId={state.landscapeSceneId}
      />
      {!mobile && <SoftGrid visible={state.arrangeMode || dragging} />}

      {mobile ? (
        <div className="relative z-10 flex min-h-dvh flex-col">
          <DeskTopBar
            stacked
            arrangeMode={state.arrangeMode}
            onToggleArrange={() => setArrangeMode(!state.arrangeMode)}
            onAdd={openPicker}
            showAdd={state.arrangeMode}
            onOpenLandscapes={() => setScenesOpen(true)}
            onOpenPresets={() => setPresetsOpen(true)}
          />

          {storageError && (
            <div className="mx-3 mb-2 rounded-xl desk-chrome px-3 py-2 text-center text-xs text-[var(--harbor-ink-muted)]">
              Storage unavailable — changes won’t persist this session.
            </div>
          )}

          {state.modules.length === 0 ? (
            <EmptyDesk onAdd={openPicker} stacked />
          ) : (
            <div className="desk-stack mx-auto flex w-full max-w-lg flex-col gap-3 px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {stackedModules.map((module, index) => (
                <ModuleShell
                  key={module.id}
                  module={module}
                  arrangeMode={state.arrangeMode}
                  layout="stack"
                  index={index}
                  stackIndex={index}
                  stackCount={stackedModules.length}
                  storageError={storageError}
                  onBringToFront={() => bringToFront(module.id)}
                  onMove={(x, y, free) => moveModule(module.id, x, y, free)}
                  onReorder={(dir) => reorderModule(module.id, dir)}
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
        </div>
      ) : (
        <>
          <DeskTopBar
            arrangeMode={state.arrangeMode}
            onToggleArrange={() => setArrangeMode(!state.arrangeMode)}
            onAdd={openPicker}
            showAdd={state.arrangeMode}
            onOpenLandscapes={() => setScenesOpen(true)}
            onOpenPresets={() => setPresetsOpen(true)}
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
                    layout="canvas"
                    index={index}
                    stackIndex={index}
                    stackCount={state.modules.length}
                    storageError={storageError}
                    onBringToFront={() => bringToFront(module.id)}
                    onMove={(x, y, free) => moveModule(module.id, x, y, free)}
                    onReorder={(dir) => reorderModule(module.id, dir)}
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
        </>
      )}

      <AddModuleDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={handlePick}
      />
      <LandscapePicker
        open={scenesOpen}
        onOpenChange={setScenesOpen}
        mode={state.landscapeMode}
        sceneId={state.landscapeSceneId}
        onSelectAuto={() => setLandscapeMode("auto")}
        onSelectScene={(id) => setLandscapeSceneId(id)}
      />
      <PresetsDialog
        open={presetsOpen}
        onOpenChange={setPresetsOpen}
        state={state}
        onImport={replaceDesk}
        onReset={resetToDefault}
      />

      {/* layout echo for tests / a11y */}
      <span className="sr-only" data-desk-layout={layout}>
        {layout === "stack" ? "Stacked phone desk" : "Freeform desk canvas"}
      </span>
    </div>
  );
}
