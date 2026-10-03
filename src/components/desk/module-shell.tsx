"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Maximize2, X } from "lucide-react";
import { MODULE_LABELS, SIZE_PRESETS, type DeskModule } from "@/lib/types";
import { NowModuleView } from "@/components/modules/now-module";
import { ShortcutsModuleView } from "@/components/modules/shortcuts-module";
import { HeadlinesModuleView } from "@/components/modules/headlines-module";
import { ScratchpadModuleView } from "@/components/modules/scratchpad-module";
import { FocusModuleView } from "@/components/modules/focus-module";

export function ModuleShell({
  module,
  arrangeMode,
  index,
  storageError,
  onBringToFront,
  onMove,
  onCycleSize,
  onRemove,
  onPatch,
  onDragActive,
}: {
  module: DeskModule;
  arrangeMode: boolean;
  index: number;
  storageError: boolean;
  onBringToFront: () => void;
  onMove: (x: number, y: number, free: boolean) => void;
  onCycleSize: () => void;
  onRemove: () => void;
  onPatch: (patch: Partial<DeskModule>) => void;
  onDragActive: (active: boolean) => void;
}) {
  const size = SIZE_PRESETS[module.type][module.size];
  const drag = useRef<{
    ox: number;
    oy: number;
    sx: number;
    sy: number;
    free: boolean;
  } | null>(null);
  const [lifting, setLifting] = useState(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      ox: e.clientX,
      oy: e.clientY,
      sx: module.x,
      sy: module.y,
      free: e.altKey,
    };
    setLifting(true);
    onDragActive(true);
    onBringToFront();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.ox;
    const dy = e.clientY - drag.current.oy;
    onMove(
      drag.current.sx + dx,
      drag.current.sy + dy,
      drag.current.free || e.altKey
    );
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setLifting(false);
    onDragActive(false);
  };

  return (
    <article
      className={`module-plane absolute flex flex-col ${
        module.type === "now" ? "module-now" : ""
      } ${lifting ? "module-lifting" : ""}`}
      style={{
        left: module.x,
        top: module.y,
        width: size.w,
        height: size.h,
        zIndex: module.z,
        animationDelay: `${80 + index * 90}ms`,
      }}
    >
      <div
        className={`flex items-center justify-between gap-2 px-5 pt-4 ${
          arrangeMode ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
        onPointerDown={arrangeMode ? onPointerDown : undefined}
        onPointerMove={arrangeMode ? onPointerMove : undefined}
        onPointerUp={arrangeMode ? endDrag : undefined}
        onPointerCancel={arrangeMode ? endDrag : undefined}
      >
        <h2 className="module-label">{MODULE_LABELS[module.type]}</h2>
        {arrangeMode && (
          <div className="flex items-center gap-1" data-no-drag>
            <button
              type="button"
              aria-label="Cycle size"
              onClick={onCycleSize}
              className="flex size-6 items-center justify-center rounded-md text-[var(--harbor-ink-muted)] hover:bg-[var(--harbor-wash)] hover:text-[var(--harbor-ink)]"
            >
              <Maximize2 className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Remove module"
              onClick={onRemove}
              className="flex size-6 items-center justify-center rounded-md text-[var(--harbor-ink-muted)] hover:bg-[var(--harbor-wash)] hover:text-red-600"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-5 pb-5 pt-2">
        {module.type === "now" && (
          <NowModuleView
            module={module}
            arrangeMode={arrangeMode}
            onChangeName={(name) => onPatch({ name })}
          />
        )}
        {module.type === "shortcuts" && (
          <ShortcutsModuleView
            module={module}
            arrangeMode={arrangeMode}
            onChangeItems={(items) => onPatch({ items })}
          />
        )}
        {module.type === "headlines" && (
          <HeadlinesModuleView storageError={storageError} />
        )}
        {module.type === "scratchpad" && (
          <ScratchpadModuleView
            module={module}
            onChangeText={(text) => onPatch({ text })}
          />
        )}
        {module.type === "focus" && (
          <FocusModuleView
            module={module}
            arrangeMode={arrangeMode}
            onChangeItems={(items) => onPatch({ items })}
          />
        )}
      </div>
      {arrangeMode && (
        <button
          type="button"
          aria-label="Resize module"
          data-no-drag
          onClick={onCycleSize}
          className="absolute bottom-2 right-2 size-3 cursor-nwse-resize rounded-sm border border-white/50 bg-white/60"
        />
      )}
    </article>
  );
}
