"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeskTopBar({
  arrangeMode,
  onToggleArrange,
  onAdd,
  showAdd,
}: {
  arrangeMode: boolean;
  onToggleArrange: () => void;
  onAdd: () => void;
  showAdd: boolean;
}) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8">
      <div className="pointer-events-auto">
        <p className="brand-mark font-display text-xl tracking-tight sm:text-2xl">
          Harbor Desk
        </p>
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        {showAdd && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onAdd}
            className="desk-chrome gap-1.5 border-0 text-[var(--harbor-ink)] hover:bg-[var(--harbor-surface-solid)]"
          >
            <Plus className="size-3.5" />
            Add module
          </Button>
        )}
        <Button
          size="sm"
          variant={arrangeMode ? "default" : "secondary"}
          onClick={onToggleArrange}
          className={
            arrangeMode
              ? "border-0 bg-[var(--harbor-teal)] text-white shadow-lg shadow-black/20 hover:bg-[var(--harbor-teal-deep)]"
              : "desk-chrome-quiet border-0 hover:bg-white/15"
          }
        >
          Arrange
        </Button>
      </div>
    </header>
  );
}
