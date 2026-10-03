# Harbor Desk

A calm browser start page: a freeform soft-grid desk over an hourly landscape, where time, shortcuts, headlines, notes, and focus tasks live as movable glass modules. First open ships a composed layout; rearrange anytime — it stays.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Hourly landscapes via hosted scenic photography
- Mock headlines JSON via `/api/headlines`
- `localStorage` for layout and personal content (no auth, no database)

## Modules

| Module | Purpose |
| --- | --- |
| **Now** | Local time, date, hour-based greeting |
| **Shortcuts** | Clickable site tiles (edit in Arrange mode) |
| **Headlines** | Mock news list with loading / error / retry |
| **Scratchpad** | Personal notes (autosave on blur) |
| **Focus** | Small checklist (add, check off, reorder) |

## Landscapes

Twelve curated landscape scenes rotate by hour-of-day (two hours each). Soft washes keep modules readable; the scene crossfades when the hour slot changes. The mapping preset is stored with the desk (`hourly-v1`).

## Run locally

```bash
npm install
npm run dev -- -p 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Using the desk

1. First visit loads a carefully composed default desk.
2. Toggle **Arrange** to drag modules (24px soft-grid snap; hold Alt for free placement), cycle sizes, and edit shortcuts / greeting name.
3. Leave Arrange mode for everyday browsing — chrome stays quiet.

Layout and content persist in `localStorage` under `harbor-desk-v2`.
