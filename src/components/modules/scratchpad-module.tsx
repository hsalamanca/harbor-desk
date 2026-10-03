"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import type { ScratchpadModule } from "@/lib/types";

export function ScratchpadModuleView({
  module,
  onChangeText,
}: {
  module: ScratchpadModule;
  onChangeText: (text: string) => void;
}) {
  const [draft, setDraft] = useState(module.text);

  useEffect(() => {
    setDraft(module.text);
  }, [module.text]);

  return (
    <Textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== module.text) onChangeText(draft);
      }}
      placeholder="Jot something for later…"
      className="h-full min-h-[120px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-[var(--harbor-ink)] shadow-none placeholder:text-[var(--harbor-ink-muted)] focus-visible:ring-0"
    />
  );
}
