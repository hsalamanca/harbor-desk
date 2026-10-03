"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ALL_LANDSCAPES,
  HOURLY_LANDSCAPES,
  PREMIUM_LANDSCAPES,
} from "@/lib/landscapes";
import type { LandscapeMode } from "@/lib/types";

export function LandscapePicker({
  open,
  onOpenChange,
  mode,
  sceneId,
  onSelectAuto,
  onSelectScene,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: LandscapeMode;
  sceneId: string | null;
  onSelectAuto: () => void;
  onSelectScene: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden border-0 bg-[var(--harbor-surface)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[var(--harbor-ink)]">
            Landscapes
          </DialogTitle>
          <DialogDescription className="text-[var(--harbor-ink-muted)]">
            Follow the hour, or pin a scene from the scenic pack.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              onSelectAuto();
              onOpenChange(false);
            }}
            className={
              mode === "auto"
                ? "bg-[var(--harbor-teal)] text-white hover:bg-[var(--harbor-teal-deep)]"
                : "desk-chrome border-0 text-[var(--harbor-ink)]"
            }
          >
            Hourly auto
          </Button>
          <p className="self-center text-xs text-[var(--harbor-ink-muted)]">
            {ALL_LANDSCAPES.length} scenes · {PREMIUM_LANDSCAPES.length} premium
          </p>
        </div>

        <div className="mt-3 max-h-[50vh] space-y-4 overflow-auto pr-1">
          <SceneGroup
            title="Hourly"
            scenes={HOURLY_LANDSCAPES}
            activeId={mode === "manual" ? sceneId : null}
            onPick={(id) => {
              onSelectScene(id);
              onOpenChange(false);
            }}
          />
          <SceneGroup
            title="Premium pack"
            scenes={PREMIUM_LANDSCAPES}
            activeId={mode === "manual" ? sceneId : null}
            onPick={(id) => {
              onSelectScene(id);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SceneGroup({
  title,
  scenes,
  activeId,
  onPick,
}: {
  title: string;
  scenes: typeof HOURLY_LANDSCAPES;
  activeId: string | null;
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--harbor-ink-muted)]">
        {title}
      </p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {scenes.map((scene) => {
          const active = activeId === scene.id;
          return (
            <li key={scene.id}>
              <button
                type="button"
                onClick={() => onPick(scene.id)}
                className={`group w-full overflow-hidden rounded-xl text-left ring-offset-2 transition ${
                  active
                    ? "ring-2 ring-[var(--harbor-teal)]"
                    : "hover:ring-1 hover:ring-white/60"
                }`}
              >
                <span
                  className="block aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${scene.src})` }}
                />
                <span className="block truncate bg-white/70 px-2 py-1.5 text-[11px] text-[var(--harbor-ink)] backdrop-blur">
                  {scene.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
