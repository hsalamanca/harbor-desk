"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  formatClock,
  formatDate,
  greetingForHour,
} from "@/lib/greetings";
import type { NowModule } from "@/lib/types";

export function NowModuleView({
  module,
  arrangeMode,
  onChangeName,
}: {
  module: NowModule;
  arrangeMode: boolean;
  onChangeName: (name: string) => void;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col justify-end px-0.5 pb-1">
      <p className="font-display text-[3.35rem] leading-none tracking-[-0.03em] text-[var(--harbor-ink)] tabular-nums sm:text-[3.75rem]">
        {formatClock(now)}
      </p>
      <p className="mt-3 text-[0.95rem] font-medium tracking-[-0.01em] text-[var(--harbor-ink-muted)]">
        {formatDate(now)}
      </p>
      {arrangeMode ? (
        <Input
          value={module.name}
          onChange={(e) => onChangeName(e.target.value)}
          aria-label="Greeting name"
          className="mt-4 h-9 border-0 bg-[var(--harbor-wash)] text-sm text-[var(--harbor-ink)] shadow-none focus-visible:ring-[var(--harbor-teal)]"
          placeholder="Your name"
        />
      ) : (
        <p className="mt-4 text-[1.05rem] tracking-[-0.01em] text-[var(--harbor-ink)]">
          {greetingForHour(now.getHours(), module.name)}
        </p>
      )}
    </div>
  );
}
