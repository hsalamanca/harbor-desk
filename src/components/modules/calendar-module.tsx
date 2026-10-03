"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/lib/types";

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  return `${s.toLocaleTimeString([], opts)} – ${e.toLocaleTimeString([], opts)}`;
}

export function CalendarModuleView() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [dateLabel, setDateLabel] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/calendar");
      if (!res.ok) throw new Error("fail");
      const data = (await res.json()) as {
        date: string;
        events: CalendarEvent[];
      };
      setEvents(data.events);
      setDateLabel(
        new Date(data.date + "T12:00:00").toLocaleDateString([], {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      );
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading") {
    return (
      <ul className="space-y-3" aria-busy>
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="space-y-2">
            <div className="harbor-shimmer h-3 w-1/3 rounded-full" />
            <div className="harbor-shimmer h-3.5 w-4/5 rounded-full" />
          </li>
        ))}
      </ul>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-full flex-col justify-center gap-3">
        <p className="text-sm text-[var(--harbor-ink-muted)]">
          Agenda couldn’t load.
        </p>
        <Button
          size="sm"
          onClick={() => void load()}
          className="w-fit bg-[var(--harbor-teal)] text-white hover:bg-[var(--harbor-teal-deep)]"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <p className="mb-3 text-xs font-medium text-[var(--harbor-ink-muted)]">
        {dateLabel}
      </p>
      <ul className="min-h-0 flex-1 space-y-2 overflow-auto">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="rounded-xl bg-white/40 px-3 py-2.5 transition-colors hover:bg-white/55"
          >
            <p className="text-[11px] tabular-nums text-[var(--harbor-teal-deep)]">
              {formatRange(ev.start, ev.end)}
            </p>
            <p className="mt-0.5 text-sm tracking-[-0.01em] text-[var(--harbor-ink)]">
              {ev.title}
            </p>
            {ev.place && (
              <p className="mt-0.5 text-[11px] text-[var(--harbor-ink-muted)]">
                {ev.place}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
