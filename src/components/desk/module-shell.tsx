"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronDown, ChevronUp, Maximize2, X } from "lucide-react";
import { MODULE_LABELS, SIZE_PRESETS, type DeskModule } from "@/lib/types";
import { NowModuleView } from "@/components/modules/now-module";
import { ShortcutsModuleView } from "@/components/modules/shortcuts-module";
import { HeadlinesModuleView } from "@/components/modules/headlines-module";
import { ScratchpadModuleView } from "@/components/modules/scratchpad-module";
import { FocusModuleView } from "@/components/modules/focus-module";
import { WeatherModuleView } from "@/components/modules/weather-module";
import { CalendarModuleView } from "@/components/modules/calendar-module";
import { FoldersModuleView } from "@/components/modules/folders-module";
import { QuoteModuleView } from "@/components/modules/quote-module";
import { isProSuiteModule } from "@/lib/pro-suite";

export type DeskLayoutMode = "canvas" | "stack";

export function ModuleShell({
  module,
  arrangeMode,
  layout,
  index,
  stackIndex,
  stackCount,
  storageError,
  onBringToFront,
  onMove,
  onReorder,
  onCycleSize,
  onRemove,
  onPatch,
  onDragActive,
}: {
  module: DeskModule;
  arrangeMode: boolean;
  layout: DeskLayoutMode;
  index: number;
  stackIndex: number;
  stackCount: number;
  storageError: boolean;
  onBringToFront: () => void;
  onMove: (x: number, y: number, free: boolean) => void;
  onReorder: (direction: -1 | 1) => void;
  onCycleSize: () => void;
  onRemove: () => void;
  onPatch: (patch: Partial<DeskModule>) => void;
  onDragActive: (active: boolean) => void;
}) {
  const size = SIZE_PRESETS[module.type][module.size];
  const stacked = layout === "stack";
  const drag = useRef<{
    ox: number;
    oy: number;
    sx: number;
    sy: number;
    free: boolean;
  } | null>(null);
  const [lifting, setLifting] = useState(false);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (stacked) return;
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
    if (!drag.current || stacked) return;
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

  const style: CSSProperties = stacked
    ? {
        ["--stack-min-h" as string]: `${Math.min(size.h, 280)}px`,
        animationDelay: `${60 + index * 70}ms`,
      }
    : {
        left: module.x,
        top: module.y,
        width: size.w,
        height: size.h,
        zIndex: module.z,
        animationDelay: `${80 + index * 90}ms`,
      };

  return (
    <article
      className={`module-plane flex flex-col ${
        stacked ? "module-stacked" : "absolute"
      } ${module.type === "now" ? "module-now" : ""} ${
        module.type === "weather" ? "module-weather" : ""
      } ${lifting ? "module-lifting" : ""}`}
      style={style}
    >
      <div
        className={`flex items-center justify-between gap-2 px-4 pt-4 sm:px-5 ${
          arrangeMode && !stacked
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-default"
        }`}
        onPointerDown={arrangeMode && !stacked ? onPointerDown : undefined}
        onPointerMove={arrangeMode && !stacked ? onPointerMove : undefined}
        onPointerUp={arrangeMode && !stacked ? endDrag : undefined}
        onPointerCancel={arrangeMode && !stacked ? endDrag : undefined}
      >
        <h2 className="module-label">
          {MODULE_LABELS[module.type]}
          {isProSuiteModule(module.type) && (
            <span className="ml-2 font-sans text-[9px] tracking-[0.14em] text-[var(--harbor-teal-deep)]/80">
              Suite
            </span>
          )}
        </h2>
        {arrangeMode && (
          <div className="flex items-center gap-1" data-no-drag>
            {stacked && (
              <>
                <button
                  type="button"
                  aria-label="Move module up"
                  disabled={stackIndex <= 0}
                  onClick={() => onReorder(-1)}
                  className="touch-target flex items-center justify-center rounded-md text-[var(--harbor-ink-muted)] hover:bg-[var(--harbor-wash)] hover:text-[var(--harbor-ink)] disabled:opacity-30"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Move module down"
                  disabled={stackIndex >= stackCount - 1}
                  onClick={() => onReorder(1)}
                  className="touch-target flex items-center justify-center rounded-md text-[var(--harbor-ink-muted)] hover:bg-[var(--harbor-wash)] hover:text-[var(--harbor-ink)] disabled:opacity-30"
                >
                  <ChevronDown className="size-4" />
                </button>
              </>
            )}
            <button
              type="button"
              aria-label="Cycle size"
              onClick={onCycleSize}
              className="touch-target flex items-center justify-center rounded-md text-[var(--harbor-ink-muted)] hover:bg-[var(--harbor-wash)] hover:text-[var(--harbor-ink)]"
            >
              <Maximize2 className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Remove module"
              onClick={onRemove}
              className="touch-target flex items-center justify-center rounded-md text-[var(--harbor-ink-muted)] hover:bg-[var(--harbor-wash)] hover:text-red-600"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
      </div>
      <div
        className={`min-h-0 flex-1 overflow-auto px-4 pb-4 pt-2 sm:px-5 sm:pb-5 ${
          stacked ? "module-stacked-body" : ""
        }`}
      >
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
        {module.type === "weather" && (
          <WeatherModuleView
            module={module}
            arrangeMode={arrangeMode}
            onChangePlace={(place) => onPatch({ place })}
          />
        )}
        {module.type === "calendar" && <CalendarModuleView />}
        {module.type === "folders" && (
          <FoldersModuleView
            module={module}
            arrangeMode={arrangeMode}
            onChangeFolders={(folders) => onPatch({ folders })}
          />
        )}
        {module.type === "quote" && <QuoteModuleView />}
      </div>
      {arrangeMode && !stacked && (
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
