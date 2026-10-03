"use client";

import { GRID } from "@/lib/types";

export function SoftGrid({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 transition-opacity duration-200"
      style={{
        opacity: visible ? 1 : 0,
        backgroundImage: `
          linear-gradient(to right, rgba(238, 245, 250, 0.16) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(238, 245, 250, 0.16) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID}px ${GRID}px`,
      }}
    />
  );
}
