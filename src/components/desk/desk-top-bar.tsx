"use client";

import { ImageIcon, LayoutTemplate, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeskTopBar({
  arrangeMode,
  onToggleArrange,
  onAdd,
  showAdd,
  onOpenLandscapes,
  onOpenPresets,
  stacked = false,
}: {
  arrangeMode: boolean;
  onToggleArrange: () => void;
  onAdd: () => void;
  showAdd: boolean;
  onOpenLandscapes: () => void;
  onOpenPresets: () => void;
  stacked?: boolean;
}) {
  return (
    <header
      className={`pointer-events-none z-50 flex items-center justify-between gap-2 ${
        stacked
          ? "desk-top-bar-stacked sticky top-0 w-full px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
          : "absolute inset-x-0 top-0 px-5 py-4 sm:px-8"
      }`}
    >
      <div className="pointer-events-auto min-w-0">
        <p
          className={`brand-mark font-display tracking-tight ${
            stacked ? "text-lg" : "text-xl sm:text-2xl"
          }`}
        >
          Harbor Desk
        </p>
      </div>
      <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={onOpenLandscapes}
          className="desk-chrome-quiet min-h-10 gap-1.5 border-0 px-2.5 hover:bg-white/15 sm:min-h-8"
        >
          <ImageIcon className="size-4 sm:size-3.5" />
          <span className={stacked ? "text-xs" : "hidden sm:inline"}>
            Scenes
          </span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={onOpenPresets}
          className="desk-chrome-quiet min-h-10 gap-1.5 border-0 px-2.5 hover:bg-white/15 sm:min-h-8"
        >
          <LayoutTemplate className="size-4 sm:size-3.5" />
          <span className={stacked ? "text-xs" : "hidden sm:inline"}>
            Presets
          </span>
        </Button>
        {showAdd && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onAdd}
            className="desk-chrome min-h-10 gap-1.5 border-0 px-2.5 text-[var(--harbor-ink)] hover:bg-[var(--harbor-surface-solid)] sm:min-h-8"
          >
            <Plus className="size-4 sm:size-3.5" />
            <span className={stacked ? "text-xs" : undefined}>
              {stacked ? "Add" : "Add module"}
            </span>
          </Button>
        )}
        <Button
          size="sm"
          variant={arrangeMode ? "default" : "secondary"}
          onClick={onToggleArrange}
          className={
            arrangeMode
              ? "min-h-10 border-0 bg-[var(--harbor-teal)] px-2.5 text-white shadow-lg shadow-black/20 hover:bg-[var(--harbor-teal-deep)] sm:min-h-8"
              : "desk-chrome-quiet min-h-10 border-0 px-2.5 hover:bg-white/15 sm:min-h-8"
          }
        >
          <span className={stacked ? "text-xs" : undefined}>Arrange</span>
        </Button>
      </div>
    </header>
  );
}
