"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { downloadPreset, parseDeskPreset } from "@/lib/presets";
import { createDefaultDesk } from "@/lib/default-desk";
import type { DeskState } from "@/lib/types";

export function PresetsDialog({
  open,
  onOpenChange,
  state,
  onImport,
  onReset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: DeskState;
  onImport: (desk: DeskState) => void;
  onReset: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 bg-[var(--harbor-surface)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[var(--harbor-ink)]">
            Desk presets
          </DialogTitle>
          <DialogDescription className="text-[var(--harbor-ink-muted)]">
            Export your layout, import a saved desk, or restore the composed
            default.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-2">
          <Button
            onClick={() => {
              downloadPreset(state);
              onOpenChange(false);
            }}
            className="justify-start bg-[var(--harbor-teal)] text-white hover:bg-[var(--harbor-teal-deep)]"
          >
            Export layout JSON
          </Button>
          <Button
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            className="desk-chrome justify-start border-0 text-[var(--harbor-ink)]"
          >
            Import layout JSON
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onReset();
              onOpenChange(false);
            }}
            className="justify-start border-0 bg-white/50 text-[var(--harbor-ink)] hover:bg-white/70"
          >
            Restore composed default
          </Button>
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              const text = await file.text();
              const desk = parseDeskPreset(text);
              onImport(desk);
              setError(null);
              onOpenChange(false);
            } catch {
              setError("Couldn’t read that preset file.");
            }
          }}
        />

        <p className="mt-2 text-[11px] text-[var(--harbor-ink-muted)]">
          Default includes {createDefaultDesk().modules.length} modules and
          Harbor Suite pieces — fully unlocked.
        </p>
      </DialogContent>
    </Dialog>
  );
}
