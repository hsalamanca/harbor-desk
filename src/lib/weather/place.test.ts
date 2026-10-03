import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_WEATHER_PLACE,
  expandUsRegion,
  formatResolvedPlace,
  parsePlace,
} from "@/lib/weather/place";
import { conditionFromWmo } from "@/lib/weather/conditions";
import { pickGeocodeResult } from "@/lib/weather/geocode";

describe("parsePlace", () => {
  it("parses City, ST", () => {
    assert.deepEqual(parsePlace("Houston, TX"), {
      city: "Houston",
      region: "TX",
      raw: "Houston, TX",
    });
  });

  it("normalizes full state names", () => {
    assert.deepEqual(parsePlace("houston, texas"), {
      city: "houston",
      region: "TX",
      raw: "houston, TX",
    });
  });

  it("accepts city-only", () => {
    assert.deepEqual(parsePlace("Austin"), {
      city: "Austin",
      raw: "Austin",
    });
  });

  it("defaults empty to Houston preference", () => {
    assert.equal(parsePlace("").raw, DEFAULT_WEATHER_PLACE);
  });
});

describe("formatResolvedPlace", () => {
  it("uses US state abbreviations", () => {
    assert.equal(formatResolvedPlace("Houston", "Texas", "US"), "Houston, TX");
  });
});

describe("expandUsRegion", () => {
  it("expands TX", () => {
    assert.equal(expandUsRegion("TX"), "Texas");
  });
});

describe("conditionFromWmo", () => {
  it("maps clear day/night", () => {
    assert.equal(conditionFromWmo(0, true).icon, "sun");
    assert.equal(conditionFromWmo(0, false).icon, "moon");
  });

  it("maps rain", () => {
    assert.equal(conditionFromWmo(61, true).condition, "Rain");
  });
});

describe("pickGeocodeResult", () => {
  const results = [
    {
      id: 1,
      name: "Houston",
      latitude: 29.76,
      longitude: -95.36,
      country_code: "US",
      admin1: "Texas",
      population: 2_000_000,
    },
    {
      id: 2,
      name: "Houston",
      latitude: 33.4,
      longitude: -84.13,
      country_code: "US",
      admin1: "Georgia",
      population: 14_000,
    },
  ];

  it("prefers Texas when TX is requested", () => {
    const pick = pickGeocodeResult(results, parsePlace("Houston, TX"));
    assert.equal(pick?.admin1, "Texas");
  });

  it("prefers Georgia when GA is requested", () => {
    const pick = pickGeocodeResult(results, parsePlace("Houston, GA"));
    assert.equal(pick?.admin1, "Georgia");
  });
});
