"use client";

import type { ReactNode } from "react";
import {
  Clock3,
  Link2,
  ListTodo,
  Newspaper,
  StickyNote,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MODULE_LABELS, type ModuleType } from "@/lib/types";

const OPTIONS: Array<{
  type: ModuleType;
  blurb: string;
  icon: ReactNode;
}> = [
  {
    type: "now",
    blurb: "Local time, date, and a greeting by hour.",
    icon: <Clock3 className="size-5" />,
  },
  {
    type: "shortcuts",
    blurb: "Icon tiles for the sites you open constantly.",
    icon: <Link2 className="size-5" />,
  },
  {
    type: "headlines",
    blurb: "A short mock news list with sources and times.",
    icon: <Newspaper className="size-5" />,
  },
  {
    type: "scratchpad",
    blurb: "Plain notes that stay on this desk.",
    icon: <StickyNote className="size-5" />,
  },
  {
    type: "focus",
    blurb: "A tiny checklist of 3–5 personal tasks.",
    icon: <ListTodo className="size-5" />,
  },
];

export function AddModuleDialog({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (type: ModuleType) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 bg-[var(--harbor-surface)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[var(--harbor-ink)]">
            Add module
          </DialogTitle>
          <DialogDescription className="text-[var(--harbor-ink-muted)]">
            Drop something useful onto the desk.
          </DialogDescription>
        </DialogHeader>
        <ul className="mt-2 grid gap-2">
          {OPTIONS.map((opt) => (
            <li key={opt.type}>
              <button
                type="button"
                onClick={() => {
                  onPick(opt.type);
                  onOpenChange(false);
                }}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[var(--harbor-wash)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--harbor-teal)]"
              >
                <span className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-[var(--harbor-wash)] text-[var(--harbor-teal-deep)]">
                  {opt.icon}
                </span>
                <span>
                  <span className="block text-sm font-medium text-[var(--harbor-ink)]">
                    {MODULE_LABELS[opt.type]}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--harbor-ink-muted)]">
                    {opt.blurb}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
