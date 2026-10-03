export function greetingForHour(hour: number, name: string): string {
  const who = name.trim() || "there";
  if (hour < 5) return `Still up, ${who}`;
  if (hour < 12) return `Good morning, ${who}`;
  if (hour < 17) return `Good afternoon, ${who}`;
  if (hour < 21) return `Good evening, ${who}`;
  return `Winding down, ${who}`;
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function relativeTime(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
