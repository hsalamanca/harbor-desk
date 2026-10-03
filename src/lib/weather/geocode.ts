import {
  expandUsRegion,
  formatResolvedPlace,
  parsePlace,
  type ParsedPlace,
} from "@/lib/weather/place";

export type GeocodedPlace = {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  countryCode?: string;
  timezone?: string;
};

type OpenMeteoGeocodeResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
};

type OpenMeteoGeocodeResponse = {
  results?: OpenMeteoGeocodeResult[];
};

export class PlaceNotFoundError extends Error {
  constructor(place: string) {
    super(`Couldn\u2019t find \u201c${place}\u201d. Try City, ST \u2014 e.g. Houston, TX.`);
    this.name = "PlaceNotFoundError";
  }
}

function scoreResult(result: OpenMeteoGeocodeResult, parsed: ParsedPlace): number {
  let score = result.population ?? 0;
  const wantedRegion = expandUsRegion(parsed.region)?.toLowerCase();
  if (wantedRegion && result.admin1?.toLowerCase() === wantedRegion) {
    score += 5_000_000;
  }
  if (parsed.region && result.country_code === "US") {
    score += 1_000_000;
  }
  if (result.name.toLowerCase() === parsed.city.toLowerCase()) {
    score += 500_000;
  }
  return score;
}

export function pickGeocodeResult(
  results: OpenMeteoGeocodeResult[],
  parsed: ParsedPlace
): OpenMeteoGeocodeResult | null {
  if (!results.length) return null;
  const ranked = [...results].sort(
    (a, b) => scoreResult(b, parsed) - scoreResult(a, parsed)
  );
  const best = ranked[0];
  if (parsed.region) {
    const wanted = expandUsRegion(parsed.region)?.toLowerCase();
    if (
      wanted &&
      best.admin1 &&
      best.admin1.toLowerCase() !== wanted &&
      ranked.some((r) => r.admin1?.toLowerCase() === wanted)
    ) {
      return ranked.find((r) => r.admin1?.toLowerCase() === wanted) ?? best;
    }
  }
  return best;
}

export async function geocodePlace(
  placeInput: string,
  fetchImpl: typeof fetch = fetch
): Promise<GeocodedPlace> {
  const parsed = parsePlace(placeInput);
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", parsed.city);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const res = await fetchImpl(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`Geocoding failed (${res.status})`);
  }

  const body = (await res.json()) as OpenMeteoGeocodeResponse;
  const pick = pickGeocodeResult(body.results ?? [], parsed);
  if (!pick) {
    throw new PlaceNotFoundError(parsed.raw);
  }

  if (parsed.region) {
    const wanted = expandUsRegion(parsed.region)?.toLowerCase();
    if (
      wanted &&
      pick.admin1 &&
      pick.admin1.toLowerCase() !== wanted &&
      !(body.results ?? []).some((r) => r.admin1?.toLowerCase() === wanted)
    ) {
      throw new PlaceNotFoundError(parsed.raw);
    }
  }

  return {
    name: pick.name,
    displayName: formatResolvedPlace(pick.name, pick.admin1, pick.country_code),
    latitude: pick.latitude,
    longitude: pick.longitude,
    admin1: pick.admin1,
    countryCode: pick.country_code,
    timezone: pick.timezone,
  };
}
