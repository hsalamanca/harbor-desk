"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyDesk({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
      <div className="pointer-events-auto empty-prompt max-w-md text-center">
        <p className="font-display text-3xl tracking-tight text-[var(--harbor-ink)] sm:text-4xl">
          Your desk is clear.
        </p>
        <p className="mt-3 text-base leading-relaxed text-[var(--harbor-ink-muted)]">
          Add something you&apos;ll open every day — the landscape stays with
          the hour.
        </p>
        <Button
          onClick={onAdd}
          className="mt-6 gap-2 bg-[var(--harbor-teal)] text-white shadow-[0_10px_28px_rgba(16,28,40,0.28)] hover:bg-[var(--harbor-teal-deep)]"
        >
          <Plus className="size-4" />
          Add module
        </Button>
      </div>
    </div>
  );
}
