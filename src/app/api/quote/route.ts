import { NextResponse } from "next/server";
import quotes from "@/data/quotes.json";

export async function GET() {
  await new Promise((r) => setTimeout(r, 280));
  const day = Math.floor(Date.now() / 86_400_000);
  const item = quotes[day % quotes.length];
  return NextResponse.json(item);
}
