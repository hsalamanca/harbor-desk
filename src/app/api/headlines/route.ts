import { NextResponse } from "next/server";
import headlines from "@/data/headlines.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fail = searchParams.get("fail") === "1";

  // Brief delay so the loading skeleton is visible on first paint.
  await new Promise((r) => setTimeout(r, 450));

  if (fail) {
    return NextResponse.json(
      { error: "Headlines feed unavailable" },
      { status: 503 }
    );
  }

  return NextResponse.json({ items: headlines });
}
