import { conditionFromWmo } from "@/lib/weather/conditions";
import { geocodePlace, PlaceNotFoundError } from "@/lib/weather/geocode";
import { DEFAULT_WEATHER_PLACE, parsePlace } from "@/lib/weather/place";

export type HourlySlot = {
  hourLabel: string;
  tempF: number;
  icon: string;
};

export type WeatherPayload = {
  place: string;
  tempF: number;
  feelsLikeF: number;
  condition: string;
  icon: string;
  windMph: number;
  humidity: number;
  isDay: boolean;
  feel: string;
  hourly: HourlySlot[];
  latitude: number;
  longitude: number;
  source: "open-meteo";
  updatedAt: string;
};

export type WeatherErrorBody = {
  error: true;
  code: "not_found" | "upstream" | "bad_request";
  message: string;
  place: string;
};

type OpenMeteoForecast = {
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    is_day?: number;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    weather_code?: number[];
  };
};

const cache = new Map<string, { at: number; payload: WeatherPayload }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export { PlaceNotFoundError, DEFAULT_WEATHER_PLACE };

export function cacheKeyForPlace(place: string): string {
  return parsePlace(place).raw.toLowerCase();
}

/** Test helper — clears the short-lived in-memory cache. */
export function clearWeatherCache(): void {
  cache.clear();
}

export function feelOfDay(
  tempF: number,
  icon: string,
  isDay: boolean,
  windMph: number
): string {
  if (icon === "rain") return isDay ? "Soft harbor rain" : "Night rain hush";
  if (icon === "moon" || (!isDay && icon !== "rain")) {
    if (tempF < 55) return "Cool blue-hour air";
    return "Quiet evening calm";
  }
  if (icon === "sun" && tempF >= 80) return "Bright and warm";
  if (icon === "sun") return "Clear water light";
  if (icon === "cloud-sun") return "Broken cloud glow";
  if (icon === "cloud" && windMph >= 12) return "Breezy overcast";
  if (icon === "cloud") return "Soft gray water";
  if (tempF < 50) return "Brisk along the pier";
  return "Easy harbor air";
}

function formatHourLabel(isoLocal: string): string {
  // Open-Meteo: "2026-10-03T15:00"
  const hour = Number(isoLocal.slice(11, 13));
  if (!Number.isFinite(hour)) return "—";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const suffix = hour < 12 ? "a" : "p";
  return `${h12}${suffix}`;
}

function buildHourly(
  hourly: NonNullable<OpenMeteoForecast["hourly"]>,
  currentTime?: string,
  isDayFallback = true
): HourlySlot[] {
  const times = hourly.time ?? [];
  const temps = hourly.temperature_2m ?? [];
  const codes = hourly.weather_code ?? [];
  if (!times.length) return [];

  let start = 0;
  if (currentTime) {
    const idx = times.findIndex((t) => t >= currentTime.slice(0, 13));
    if (idx >= 0) start = idx;
  }

  const slots: HourlySlot[] = [];
  for (let i = start; i < times.length && slots.length < 6; i++) {
    const temp = temps[i];
    const code = codes[i];
    if (typeof temp !== "number" || typeof code !== "number") continue;
    const hour = Number(times[i].slice(11, 13));
    const slotIsDay = Number.isFinite(hour) ? hour >= 6 && hour < 19 : isDayFallback;
    const { icon } = conditionFromWmo(code, slotIsDay);
    slots.push({
      hourLabel: formatHourLabel(times[i]),
      tempF: Math.round(temp),
      icon,
    });
  }
  return slots;
}

export async function fetchWeatherForPlace(
  placeInput: string,
  fetchImpl: typeof fetch = fetch
): Promise<WeatherPayload> {
  const parsed = parsePlace(placeInput || DEFAULT_WEATHER_PLACE);
  const key = cacheKeyForPlace(parsed.raw);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.payload;
  }

  const geo = await geocodePlace(parsed.raw, fetchImpl);

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(geo.latitude));
  url.searchParams.set("longitude", String(geo.longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day"
  );
  url.searchParams.set("hourly", "temperature_2m,weather_code");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", geo.timezone || "auto");

  const res = await fetchImpl(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`Forecast failed (${res.status})`);
  }

  const body = (await res.json()) as OpenMeteoForecast;
  const current = body.current;
  if (
    !current ||
    typeof current.temperature_2m !== "number" ||
    typeof current.weather_code !== "number"
  ) {
    throw new Error("Forecast response missing current conditions");
  }

  const isDay = current.is_day !== 0;
  const { condition, icon } = conditionFromWmo(current.weather_code, isDay);
  const tempF = Math.round(current.temperature_2m);
  const feelsLikeF = Math.round(
    typeof current.apparent_temperature === "number"
      ? current.apparent_temperature
      : current.temperature_2m
  );
  const windMph = Math.round(current.wind_speed_10m ?? 0);
  const humidity = Math.round(current.relative_humidity_2m ?? 0);
  const hourly = body.hourly
    ? buildHourly(body.hourly, current.time, isDay)
    : [];

  const payload: WeatherPayload = {
    place: geo.displayName,
    tempF,
    feelsLikeF,
    condition,
    icon,
    windMph,
    humidity,
    isDay,
    feel: feelOfDay(tempF, icon, isDay, windMph),
    hourly,
    latitude: geo.latitude,
    longitude: geo.longitude,
    source: "open-meteo",
    updatedAt: new Date().toISOString(),
  };

  cache.set(key, { at: Date.now(), payload });
  return payload;
}
