import { NextResponse } from "next/server";

/** Mock weather feed — calm harbor conditions by hour. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const place = searchParams.get("place")?.trim() || "Harbor City";

  await new Promise((r) => setTimeout(r, 350));

  const hour = new Date().getHours();
  const conditions = [
    { label: "Clear and cool", icon: "moon", temp: 52 },
    { label: "Harbor mist", icon: "cloud", temp: 55 },
    { label: "Soft rain", icon: "rain", temp: 58 },
    { label: "Bright and crisp", icon: "sun", temp: 64 },
    { label: "Partly cloudy", icon: "cloud-sun", temp: 61 },
    { label: "Blue hour calm", icon: "dusk", temp: 57 },
  ];
  const pick = conditions[Math.floor(hour / 4) % conditions.length];

  return NextResponse.json({
    place,
    tempF: pick.temp + ((hour % 3) - 1),
    condition: pick.label,
    icon: pick.icon,
    windMph: 6 + (hour % 5),
    humidity: 58 + (hour % 12),
    updatedAt: new Date().toISOString(),
  });
}
