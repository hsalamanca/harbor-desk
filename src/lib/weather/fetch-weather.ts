import { conditionFromWmo } from "@/lib/weather/conditions";
import { geocodePlace, PlaceNotFoundError } from "@/lib/weather/geocode";
import { DEFAULT_WEATHER_PLACE, parsePlace } from "@/lib/weather/place";

export type WeatherPayload = {
  place: string;
  tempF: number;
  condition: string;
  icon: string;
  windMph: number;
  humidity: number;
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
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    is_day?: number;
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
    "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day"
  );
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

  const payload: WeatherPayload = {
    place: geo.displayName,
    tempF: Math.round(current.temperature_2m),
    condition,
    icon,
    windMph: Math.round(current.wind_speed_10m ?? 0),
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    latitude: geo.latitude,
    longitude: geo.longitude,
    source: "open-meteo",
    updatedAt: new Date().toISOString(),
  };

  cache.set(key, { at: Date.now(), payload });
  return payload;
}
