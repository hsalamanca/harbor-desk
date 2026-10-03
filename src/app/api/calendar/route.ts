import { NextResponse } from "next/server";

function atHour(base: Date, h: number, m = 0) {
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

/** Mock agenda for today — personal, not a full calendar product. */
export async function GET() {
  await new Promise((r) => setTimeout(r, 400));
  const now = new Date();

  const events = [
    {
      id: "e1",
      title: "Deep work block",
      start: atHour(now, 9, 0),
      end: atHour(now, 11, 0),
      place: "Desk",
    },
    {
      id: "e2",
      title: "Walk the waterfront",
      start: atHour(now, 12, 30),
      end: atHour(now, 13, 15),
      place: "Pier path",
    },
    {
      id: "e3",
      title: "Design review",
      start: atHour(now, 15, 0),
      end: atHour(now, 15, 45),
      place: "Video",
    },
    {
      id: "e4",
      title: "Shutdown ritual",
      start: atHour(now, 17, 30),
      end: atHour(now, 18, 0),
      place: "Desk",
    },
  ];

  return NextResponse.json({ date: now.toISOString().slice(0, 10), events });
}
