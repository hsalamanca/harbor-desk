/** Parse freeform place strings like "Houston, TX" or "Austin". */

export type ParsedPlace = {
  city: string;
  region?: string;
  raw: string;
};

const US_STATE_BY_ABBR: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const US_ABBR_BY_STATE = Object.fromEntries(
  Object.entries(US_STATE_BY_ABBR).map(([abbr, name]) => [
    name.toLowerCase(),
    abbr,
  ])
) as Record<string, string>;

export const DEFAULT_WEATHER_PLACE = "Houston, TX";

export function parsePlace(input: string): ParsedPlace {
  const raw = input.trim().replace(/\s+/g, " ");
  if (!raw) {
    return { city: DEFAULT_WEATHER_PLACE.split(",")[0], region: "TX", raw: DEFAULT_WEATHER_PLACE };
  }

  const comma = raw.indexOf(",");
  if (comma === -1) {
    return { city: raw, raw };
  }

  const city = raw.slice(0, comma).trim();
  const regionRaw = raw.slice(comma + 1).trim();
  if (!city) return { city: raw, raw };

  const upper = regionRaw.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper) && US_STATE_BY_ABBR[upper]) {
    return { city, region: upper, raw: `${city}, ${upper}` };
  }

  const asAbbr = US_ABBR_BY_STATE[regionRaw.toLowerCase()];
  if (asAbbr) {
    return { city, region: asAbbr, raw: `${city}, ${asAbbr}` };
  }

  return { city, region: regionRaw || undefined, raw: regionRaw ? `${city}, ${regionRaw}` : city };
}

export function expandUsRegion(region?: string): string | undefined {
  if (!region) return undefined;
  const upper = region.toUpperCase();
  if (US_STATE_BY_ABBR[upper]) return US_STATE_BY_ABBR[upper];
  return region;
}

export function formatResolvedPlace(
  name: string,
  admin1?: string | null,
  countryCode?: string | null
): string {
  if (countryCode === "US" && admin1) {
    const abbr = US_ABBR_BY_STATE[admin1.toLowerCase()];
    if (abbr) return `${name}, ${abbr}`;
  }
  if (admin1) return `${name}, ${admin1}`;
  return name;
}
