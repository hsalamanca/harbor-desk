"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { relativeTime } from "@/lib/greetings";
import type { HeadlineItem } from "@/lib/types";

type Status = "loading" | "ready" | "error";

export function HeadlinesModuleView({
  storageError,
}: {
  storageError?: boolean;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [items, setItems] = useState<HeadlineItem[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/headlines");
      if (!res.ok) throw new Error("fail");
      const data = (await res.json()) as { items: HeadlineItem[] };
      setItems(data.items.slice(0, 6));
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
      <ul className="space-y-4" aria-busy aria-label="Loading headlines">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="space-y-2">
            <div className="harbor-shimmer h-3.5 w-[94%] rounded-full" />
            <div className="harbor-shimmer h-2.5 w-2/5 rounded-full" />
          </li>
        ))}
      </ul>
    );
  }

  if (status === "error" || storageError) {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-3 py-4">
        <p className="text-sm leading-relaxed text-[var(--harbor-ink-muted)]">
          {storageError
            ? "Storage is unavailable. Layout won’t persist, but you can still browse."
            : "Headlines couldn’t load."}
        </p>
        {!storageError && (
          <Button
            size="sm"
            onClick={() => void load()}
            className="bg-[var(--harbor-teal)] text-white hover:bg-[var(--harbor-teal-deep)]"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="py-6 text-sm text-[var(--harbor-ink-muted)]">
        No headlines right now.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-black/5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="-mx-1 block rounded-xl px-1 py-3 transition-colors hover:bg-white/45"
          >
            <span className="line-clamp-2 text-[0.92rem] leading-snug tracking-[-0.01em] text-[var(--harbor-ink)]">
              {item.title}
            </span>
            <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[var(--harbor-ink-muted)]">
              <span className="font-medium">{item.source}</span>
              <span aria-hidden>·</span>
              <span>{relativeTime(item.publishedAt)}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
