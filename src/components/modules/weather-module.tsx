"use client";

import { useCallback, useEffect, useState } from "react";
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
  arrangeMode,
  onChangePlace,
}: {
  module: WeatherModule;
  arrangeMode: boolean;
  onChangePlace: (place: string) => void;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<WeatherPayload | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch(
        `/api/weather?place=${encodeURIComponent(module.place || "Harbor City")}`
      );
      if (!res.ok) throw new Error("fail");
      setData((await res.json()) as WeatherPayload);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [module.place]);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading") {
    return (
      <div className="space-y-3" aria-busy>
        <div className="harbor-shimmer h-8 w-20 rounded-xl" />
        <div className="harbor-shimmer h-3 w-2/3 rounded-full" />
        <div className="harbor-shimmer h-3 w-1/2 rounded-full" />
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="flex h-full flex-col justify-center gap-3">
        <p className="text-sm text-[var(--harbor-ink-muted)]">
          Weather couldn’t load.
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
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-4xl tracking-tight text-[var(--harbor-ink)] tabular-nums">
            {data.tempF}°
          </p>
          <p className="mt-1 text-sm text-[var(--harbor-ink)]">{data.condition}</p>
        </div>
        <WeatherIcon icon={data.icon} />
      </div>
      {arrangeMode ? (
        <Input
          value={module.place}
          onChange={(e) => onChangePlace(e.target.value)}
          aria-label="Weather place"
          className="mt-3 h-8 border-0 bg-white/50 text-sm shadow-none"
          placeholder="Place"
        />
      ) : (
        <p className="mt-3 text-xs text-[var(--harbor-ink-muted)]">
          {data.place} · wind {data.windMph} mph · {data.humidity}% humidity
        </p>
      )}
    </div>
  );
}
