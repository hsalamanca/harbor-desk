import { NextResponse } from "next/server";
import {
  DEFAULT_WEATHER_PLACE,
  fetchWeatherForPlace,
  PlaceNotFoundError,
  type WeatherErrorBody,
} from "@/lib/weather/fetch-weather";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get("place")?.trim() || DEFAULT_WEATHER_PLACE;

  try {
    const payload = await fetchWeatherForPlace(place);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    if (err instanceof PlaceNotFoundError) {
      const body: WeatherErrorBody = {
        error: true,
        code: "not_found",
        message: err.message,
        place,
      };
      return NextResponse.json(body, { status: 404 });
    }

    console.error("[weather]", err);
    const body: WeatherErrorBody = {
      error: true,
      code: "upstream",
      message: "Weather service is unavailable. Try again in a moment.",
      place,
    };
    return NextResponse.json(body, { status: 502 });
  }
}
