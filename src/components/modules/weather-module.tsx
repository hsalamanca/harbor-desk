"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Moon,
  Sun,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WeatherModule } from "@/lib/types";
import { DEFAULT_WEATHER_PLACE } from "@/lib/weather/place";

type HourlySlot = {
  hourLabel: string;
  tempF: number;
  icon: string;
};

type WeatherPayload = {
  place: string;
  tempF: number;
  feelsLikeF?: number;
  condition: string;
  icon: string;
  windMph: number;
  humidity: number;
  isDay?: boolean;
  feel?: string;
  hourly?: HourlySlot[];
  source?: string;
};

type WeatherErrorPayload = {
  error: true;
  message: string;
  code?: string;
};

function WeatherIcon({
  icon,
  className = "size-7",
}: {
  icon: string;
  className?: string;
}) {
  if (icon === "sun") return <Sun className={className} strokeWidth={1.6} />;
  if (icon === "rain") return <CloudRain className={className} strokeWidth={1.6} />;
  if (icon === "cloud-sun")
    return <CloudSun className={className} strokeWidth={1.6} />;
  if (icon === "moon" || icon === "dusk")
    return <Moon className={className} strokeWidth={1.6} />;
  return <Cloud className={className} strokeWidth={1.6} />;
}

function atmosphereClass(icon: string, isDay?: boolean): string {
  if (icon === "rain") return "weather-atm-rain";
  if (icon === "sun") return "weather-atm-sun";
  if (icon === "moon" || icon === "dusk" || isDay === false)
    return "weather-atm-night";
  if (icon === "cloud-sun") return "weather-atm-partly";
  return "weather-atm-cloud";
}

function PlaceField({
  value,
  onChange,
  onFocus,
  onBlur,
  onCommitKey,
}: {
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onCommitKey: () => void;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
          onCommitKey();
        }
      }}
      aria-label="Weather location"
      className="weather-place-input h-9 border-0 bg-white/50 text-sm text-[var(--harbor-ink)] shadow-none transition-[background,box-shadow] placeholder:text-[var(--harbor-ink-muted)] focus-visible:bg-white/75 focus-visible:ring-[var(--harbor-teal)]"
      placeholder="City, ST"
    />
  );
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftPlace, setDraftPlace] = useState(
    module.place || DEFAULT_WEATHER_PLACE
  );
  const [tempPulse, setTempPulse] = useState(false);
  const requestId = useRef(0);
  const hasDataRef = useRef(false);
  const committedPlace = useRef(module.place || DEFAULT_WEATHER_PLACE);
  const inputFocused = useRef(false);
  const prevTemp = useRef<number | null>(null);

  useEffect(() => {
    if (inputFocused.current) return;
    if (module.place !== committedPlace.current) {
      committedPlace.current = module.place || DEFAULT_WEATHER_PLACE;
      setDraftPlace(committedPlace.current);
    }
  }, [module.place]);

  const load = useCallback(async (place: string) => {
    const id = ++requestId.current;
    if (hasDataRef.current) setRefreshing(true);
    else setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/weather?place=${encodeURIComponent(place || DEFAULT_WEATHER_PLACE)}`
      );
      const body = (await res.json()) as WeatherPayload | WeatherErrorPayload;
      if (id !== requestId.current) return;
      if (!res.ok || ("error" in body && body.error)) {
        const message =
          "error" in body && body.message
            ? body.message
            : "Weather couldn\u2019t load.";
        setErrorMessage(message);
        if (!hasDataRef.current) setStatus("error");
        else setStatus("ready");
        return;
      }
      const next = body as WeatherPayload;
      if (prevTemp.current !== null && prevTemp.current !== next.tempF) {
        setTempPulse(true);
        window.setTimeout(() => setTempPulse(false), 700);
      }
      prevTemp.current = next.tempF;
      setData(next);
      hasDataRef.current = true;
      setStatus("ready");
    } catch {
      if (id !== requestId.current) return;
      setErrorMessage("Weather couldn\u2019t load.");
      if (!hasDataRef.current) setStatus("error");
    } finally {
      if (id === requestId.current) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(module.place || DEFAULT_WEATHER_PLACE);
  }, [load, module.place]);

  const commitPlace = () => {
    const next = draftPlace.trim() || DEFAULT_WEATHER_PLACE;
    if (next !== draftPlace) setDraftPlace(next);
    if (next === committedPlace.current) return;
    committedPlace.current = next;
    onChangePlace(next);
  };

  if (status === "loading" && !data) {
    return (
      <div className="weather-shell weather-atm-cloud space-y-3 p-1" aria-busy>
        <div className="harbor-shimmer h-12 w-24 rounded-2xl" />
        <div className="harbor-shimmer h-3 w-2/3 rounded-full" />
        <div className="harbor-shimmer h-8 w-full rounded-xl" />
        <div className="flex gap-2">
          <div className="harbor-shimmer h-12 flex-1 rounded-xl" />
          <div className="harbor-shimmer h-12 flex-1 rounded-xl" />
          <div className="harbor-shimmer h-12 flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (status === "error" && !data) {
    return (
      <div className="weather-shell weather-atm-cloud flex h-full flex-col justify-between gap-3 p-1">
        <div className="space-y-2">
          <p className="text-sm text-[var(--harbor-ink-muted)]">
            {errorMessage || "Weather couldn\u2019t load."}
          </p>
          <PlaceField
            value={draftPlace}
            onChange={setDraftPlace}
            onFocus={() => {
              inputFocused.current = true;
            }}
            onBlur={() => {
              inputFocused.current = false;
              commitPlace();
            }}
            onCommitKey={() => undefined}
          />
        </div>
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

  const atm = atmosphereClass(data!.icon, data!.isDay);
  const hourly = data!.hourly?.slice(0, 6) ?? [];
  const feels = data!.feelsLikeF ?? data!.tempF;

  return (
    <div className={`weather-shell ${atm} flex h-full min-h-0 flex-col p-0.5`}>
      <div className="weather-mist" aria-hidden />

      <div className="relative z-[1] flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className={`weather-temp font-display tabular-nums tracking-[-0.04em] text-[var(--harbor-ink)] ${
              tempPulse ? "weather-temp-pulse" : ""
            }`}
          >
            {data!.tempF}
            <span className="weather-temp-degree">\u00b0</span>
          </p>
          <p className="mt-0.5 text-[0.92rem] font-medium tracking-[-0.01em] text-[var(--harbor-ink)]">
            {data!.condition}
          </p>
          <p className="mt-1 text-[11px] tracking-[0.02em] text-[var(--harbor-ink-muted)]">
            {data!.feel || `Feels like ${feels}\u00b0`}
            {refreshing && (
              <span className="ml-2 text-[10px] uppercase tracking-[0.14em]">
                updating
              </span>
            )}
          </p>
        </div>
        <div className={`weather-icon-orb weather-icon-${data!.icon}`} aria-hidden>
          <WeatherIcon icon={data!.icon} className="size-7" />
        </div>
      </div>

      {hourly.length > 0 && (
        <div
          className="weather-hourly relative z-[1] mt-3 flex gap-1.5 overflow-x-auto pb-0.5"
          role="list"
          aria-label="Next hours"
        >
          {hourly.map((slot) => (
            <div key={slot.hourLabel + slot.tempF} className="weather-hour" role="listitem">
              <span className="weather-hour-label">{slot.hourLabel}</span>
              <WeatherIcon
                icon={slot.icon}
                className="size-3.5 text-[var(--harbor-teal-deep)]"
              />
              <span className="weather-hour-temp">{slot.tempF}\u00b0</span>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-[1] mt-auto space-y-2 pt-3">
        <PlaceField
          value={draftPlace}
          onChange={setDraftPlace}
          onFocus={() => {
            inputFocused.current = true;
          }}
          onBlur={() => {
            inputFocused.current = false;
            commitPlace();
          }}
          onCommitKey={() => undefined}
        />
        {errorMessage ? (
          <p className="text-[11px] text-red-700/80" role="alert">
            {errorMessage}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <span className="weather-chip">
              <Wind className="size-3.5 opacity-70" />
              {data!.windMph} mph
            </span>
            <span className="weather-chip">
              <Droplets className="size-3.5 opacity-70" />
              {data!.humidity}%
            </span>
            <span className="weather-chip weather-chip-quiet">
              feels {feels}\u00b0
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
