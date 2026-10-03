import { GRID } from "@/lib/types";

export function snapToGrid(value: number, free = false): number {
  if (free) return value;
  return Math.round(value / GRID) * GRID;
}

export function findFreeSlot(
  occupied: Array<{ x: number; y: number; w: number; h: number }>,
  w: number,
  h: number,
  viewportW: number,
  viewportH: number
): { x: number; y: number } {
  const centerX = Math.max(GRID, Math.round((viewportW - w) / 2 / GRID) * GRID);
  const centerY = Math.max(GRID * 3, Math.round((viewportH - h) / 2 / GRID) * GRID);

  const candidates: Array<{ x: number; y: number }> = [{ x: centerX, y: centerY }];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 12; col++) {
      candidates.push({
        x: GRID + col * GRID * 4,
        y: GRID * 3 + row * GRID * 3,
      });
    }
  }

  for (const c of candidates) {
    const overlaps = occupied.some(
      (o) =>
        c.x < o.x + o.w &&
        c.x + w > o.x &&
        c.y < o.y + o.h &&
        c.y + h > o.y
    );
    if (!overlaps) return c;
  }
  return { x: centerX + GRID * 2, y: centerY + GRID * 2 };
}
