import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clearWeatherCache,
  fetchWeatherForPlace,
  PlaceNotFoundError,
} from "@/lib/weather/fetch-weather";

describe("fetchWeatherForPlace (live Open-Meteo)", () => {
  it("resolves Houston, TX to Texas coords and real conditions", async () => {
    clearWeatherCache();
    const weather = await fetchWeatherForPlace("Houston, TX");
    assert.equal(weather.source, "open-meteo");
    assert.match(weather.place, /Houston,\s*TX/i);
    assert.ok(weather.latitude > 29 && weather.latitude < 31);
    assert.ok(weather.longitude > -96 && weather.longitude < -94);
    assert.ok(Number.isFinite(weather.tempF));
    assert.ok(Number.isFinite(weather.feelsLikeF));
    assert.ok(weather.condition.length > 0);
    assert.ok(weather.feel.length > 0);
    assert.ok(weather.humidity >= 0 && weather.humidity <= 100);
    assert.ok(Array.isArray(weather.hourly));
    assert.ok(weather.hourly.length >= 3);
    assert.ok(weather.hourly[0].hourLabel.length > 0);
  });

  it("resolves city-only Seattle", async () => {
    clearWeatherCache();
    const weather = await fetchWeatherForPlace("Seattle");
    assert.match(weather.place, /Seattle/i);
    assert.ok(weather.latitude > 47 && weather.latitude < 48.5);
    assert.equal(weather.source, "open-meteo");
  });

  it("resolves Austin, TX", async () => {
    clearWeatherCache();
    const weather = await fetchWeatherForPlace("Austin, TX");
    assert.match(weather.place, /Austin,\s*TX/i);
    assert.ok(weather.latitude > 30 && weather.latitude < 31);
  });

  it("fails clearly for unknown places", async () => {
    clearWeatherCache();
    await assert.rejects(
      () => fetchWeatherForPlace("Zzqxnotacity999, ZZ"),
      (err: unknown) => err instanceof PlaceNotFoundError
    );
  });
});
