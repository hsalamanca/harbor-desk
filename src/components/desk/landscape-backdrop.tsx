"use client";

import { useEffect, useState } from "react";
import {
  HOURLY_LANDSCAPES,
  preloadLandscape,
  sceneForHour,
  type LandscapeScene,
} from "@/lib/landscapes";

function hourFromLocation(): number | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("hour");
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return ((Math.floor(n) % 24) + 24) % 24;
}

export function LandscapeBackdrop() {
  const [scene, setScene] = useState<LandscapeScene>(() =>
    sceneForHour(hourFromLocation() ?? new Date().getHours())
  );
  const [prev, setPrev] = useState<LandscapeScene | null>(null);
  const [fading, setFading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Warm the full hourly set so hour flips stay smooth.
    HOURLY_LANDSCAPES.forEach((s) => preloadLandscape(s.src));
  }, []);

  useEffect(() => {
    const tick = () => {
      const forced = hourFromLocation();
      const next = sceneForHour(forced ?? new Date().getHours());
      setScene((current) => {
        if (current.id === next.id) return current;
        setPrev(current);
        setFading(true);
        window.setTimeout(() => {
          setPrev(null);
          setFading(false);
        }, 1200);
        return next;
      });
    };

    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

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
        <img
          src={scene.src}
          alt=""
          className="sr-only"
          onLoad={() => setReady(true)}
        />
        <div className="landscape-wash" style={{ background: scene.wash }} />
      </div>
      <div className="landscape-vignette" />
      <p className="landscape-caption">{scene.label}</p>
    </div>
  );
}
