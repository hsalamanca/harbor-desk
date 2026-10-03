"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Cloud, CloudRain, CloudSun, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WeatherModule } from "@/lib/types";

type WeatherPayload = {
  place: string;
  tempF: number;
  condition: string;
  icon: string;
  windMph: number;
  humidity: number;
};

function WeatherIcon({ icon }: { icon: string }) {
  const cls = "size-8 text-[var(--harbor-teal-deep)]";
  if (icon === "sun") return <Sun className={cls} />;
  if (icon === "rain") return <CloudRain className={cls} />;
  if (icon === "cloud-sun") return <CloudSun className={cls} />;
  if (icon === "moon" || icon === "dusk") return <Moon className={cls} />;
  return <Cloud className={cls} />;
}

export function WeatherModuleView({
  module,
  onChangePlace,
}: {
  module: WeatherModule;
  arrangeMode: boolean;
  onChangePlace: (place: string) => void;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<WeatherPayload | null>(null);
  const [draftPlace, setDraftPlace] = useState(module.place || "Harbor City");
  const requestId = useRef(0);
  const hasDataRef = useRef(false);
  const committedPlace = useRef(module.place || "Harbor City");
  const inputFocused = useRef(false);

  // Sync draft from outside (import / reset) only when not mid-edit.
  useEffect(() => {
    if (inputFocused.current) return;
    if (module.place !== committedPlace.current) {
      committedPlace.current = module.place || "Harbor City";
      setDraftPlace(committedPlace.current);
    }
  }, [module.place]);

  const load = useCallback(async (place: string) => {
    const id = ++requestId.current;
    // Soft refresh keeps the location input mounted so edits aren't wiped.
    if (hasDataRef.current) setRefreshing(true);
    else setStatus("loading");
    try {
      const res = await fetch(
        `/api/weather?place=${encodeURIComponent(place || "Harbor City")}`
      );
      if (!res.ok) throw new Error("fail");
      const payload = (await res.json()) as WeatherPayload;
      if (id !== requestId.current) return;
      setData(payload);
      hasDataRef.current = true;
      setStatus("ready");
    } catch {
      if (id !== requestId.current) return;
      if (!hasDataRef.current) setStatus("error");
    } finally {
      if (id === requestId.current) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(module.place || "Harbor City");
  }, [load, module.place]);

  const commitPlace = () => {
    const next = draftPlace.trim() || "Harbor City";
    if (next !== draftPlace) setDraftPlace(next);
    if (next === committedPlace.current) return;
    committedPlace.current = next;
    onChangePlace(next);
  };

  if (status === "loading" && !data) {
    return (
      <div className="space-y-3" aria-busy>
        <div className="harbor-shimmer h-8 w-20 rounded-xl" />
        <div className="harbor-shimmer h-3 w-2/3 rounded-full" />
        <div className="harbor-shimmer h-3 w-1/2 rounded-full" />
      </div>
    );
  }

  if (status === "error" && !data) {
    return (
      <div className="flex h-full flex-col justify-center gap-3">
        <p className="text-sm text-[var(--harbor-ink-muted)]">
          Weather couldn’t load.
        </p>
        <Button
          size="sm"
          onClick={() => void load(draftPlace)}
          className="w-fit bg-[var(--harbor-teal)] text-white hover:bg-[var(--harbor-teal-deep)]"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-4xl tracking-tight text-[var(--harbor-ink)] tabular-nums">
            {data!.tempF}°
            {refreshing && (
              <span className="ml-2 align-middle text-[10px] font-sans font-medium tracking-wide text-[var(--harbor-ink-muted)]">
                updating
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-[var(--harbor-ink)]">{data!.condition}</p>
        </div>
        <WeatherIcon icon={data!.icon} />
      </div>
      <div className="mt-3 space-y-1">
        <Input
          value={draftPlace}
          onChange={(e) => setDraftPlace(e.target.value)}
          onFocus={() => {
            inputFocused.current = true;
          }}
          onBlur={() => {
            inputFocused.current = false;
            commitPlace();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          aria-label="Weather location"
          className="h-8 border-0 bg-white/55 text-sm text-[var(--harbor-ink)] shadow-none focus-visible:ring-[var(--harbor-teal)]"
          placeholder="City, ST"
        />
        <p className="text-[11px] text-[var(--harbor-ink-muted)]">
          wind {data!.windMph} mph · {data!.humidity}% humidity
        </p>
      </div>
    </div>
  );
}
