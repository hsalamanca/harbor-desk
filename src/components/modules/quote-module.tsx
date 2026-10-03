"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type QuotePayload = { id: string; text: string; author: string };

export function QuoteModuleView() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [quote, setQuote] = useState<QuotePayload | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/quote");
      if (!res.ok) throw new Error("fail");
      setQuote((await res.json()) as QuotePayload);
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
      <div className="space-y-3" aria-busy>
        <div className="harbor-shimmer h-3.5 w-full rounded-full" />
        <div className="harbor-shimmer h-3.5 w-5/6 rounded-full" />
        <div className="harbor-shimmer h-3 w-1/3 rounded-full" />
      </div>
    );
  }

  if (status === "error" || !quote) {
    return (
      <div className="flex h-full flex-col justify-center gap-3">
        <p className="text-sm text-[var(--harbor-ink-muted)]">
          Quote couldn’t load.
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
    <figure className="flex h-full flex-col justify-center">
      <blockquote className="font-display text-[1.15rem] leading-snug tracking-[-0.02em] text-[var(--harbor-ink)]">
        “{quote.text}”
      </blockquote>
      <figcaption className="mt-3 text-xs text-[var(--harbor-ink-muted)]">
        — {quote.author}
      </figcaption>
    </figure>
  );
}
