"use client";

import { useEffect, useState } from "react";
import {
  ALL_LANDSCAPES,
  preloadLandscape,
  sceneById,
  sceneForHour,
  type LandscapeScene,
} from "@/lib/landscapes";
import type { LandscapeMode } from "@/lib/types";

function hourFromLocation(): number | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("hour");
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return ((Math.floor(n) % 24) + 24) % 24;
}

export function LandscapeBackdrop({
  mode = "auto",
  sceneId = null,
}: {
  mode?: LandscapeMode;
  sceneId?: string | null;
}) {
  const resolve = (): LandscapeScene => {
    if (mode === "manual") {
      return sceneById(sceneId) ?? sceneForHour(new Date().getHours());
    }
    return sceneForHour(hourFromLocation() ?? new Date().getHours());
  };

  const [scene, setScene] = useState<LandscapeScene>(resolve);
  const [prev, setPrev] = useState<LandscapeScene | null>(null);
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ALL_LANDSCAPES.forEach((s) => preloadLandscape(s.src));
  }, []);

  useEffect(() => {
    const apply = (next: LandscapeScene) => {
      setScene((current) => {
        if (current.id === next.id) return current;
        setPrev(current);
        setFading(true);
        setReady(false);
        window.setTimeout(() => {
          setPrev(null);
          setFading(false);
        }, 1200);
        return next;
      });
    };

    apply(resolve());

    if (mode === "manual") return;

    const id = window.setInterval(() => {
      apply(sceneForHour(hourFromLocation() ?? new Date().getHours()));
    }, 30_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sceneId]);

  return (
    <div className="landscape-root" aria-hidden>
      {prev && (
        <div
          className={`landscape-layer ${fading ? "landscape-layer-out" : ""}`}
          style={{ backgroundImage: `url(${prev.src})` }}
        >
          <div className="landscape-wash" style={{ background: prev.wash }} />
        </div>
      )}
      <div
        className={`landscape-layer landscape-layer-current ${
          ready ? "is-ready" : ""
        }`}
        style={{ backgroundImage: `url(${scene.src})` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={scene.src}
          alt=""
          className="sr-only"
          onLoad={() => setReady(true)}
        />
        <div className="landscape-wash" style={{ background: scene.wash }} />
      </div>
      <div className="landscape-vignette" />
      <p className="landscape-caption">
        {scene.label}
        {mode === "manual" ? " · pinned" : ""}
        {scene.pack === "premium" ? " · suite" : ""}
      </p>
    </div>
  );
}
