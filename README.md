# Harbor Desk

A calm browser start page: a freeform soft-grid desk over scenic landscapes, where time, news, notes, focus, weather, agenda, folders, and a daily quote live as movable glass modules. First open ships a composed layout; rearrange anytime — it stays.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Hourly + premium landscapes (hosted scenic photography)
- Live Open-Meteo weather (Houston, TX by default) + mock headlines/calendar/quotes
- Responsive phone stack + desktop freeform soft-grid
- `localStorage` for layout and personal content (no auth, no database)

## Modules

| Module | Purpose |
| --- | --- |
| **Now** | Local time, date, hour-based greeting |
| **Shortcuts** | Clickable site tiles (edit in Arrange mode) |
| **Headlines** | Mock news list with loading / error / retry |
| **Scratchpad** | Personal notes (autosave on blur) |
| **Focus** | Small checklist (add, check off, reorder) |
| **Weather** | Calm local conditions (Harbor Suite) |
| **Calendar** | Today’s agenda (Harbor Suite) |
| **Folders** | Grouped quick links (Harbor Suite) |
| **Quote** | Daily inspiration line (Harbor Suite) |

Harbor Suite modules are fully unlocked (no paywall). A light `pro-suite` marker remains in code for later monetization if desired.

## Landscapes

- **Hourly auto** — twelve scenes rotate by hour-of-day
- **Manual picker** — pin any hourly or premium-pack scene via **Scenes** in the top bar

## Presets

Use **Presets** to export/import desk JSON or restore the composed default layout.

## Run locally

```bash
npm install
npm run dev -- -p 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

Optional: `?hour=20` forces the hourly scene slot while in auto mode.

## Using the desk

1. First visit loads a carefully composed default desk (including Suite modules).
2. **Desktop:** toggle **Arrange** to drag modules (24px soft-grid snap; hold Alt for free placement), cycle sizes, and edit content.
3. **Phone:** the desk becomes a stacked, scrollable column (not a shrunk canvas). In Arrange mode, reorder with up/down, resize, add, and remove — Scenes and Presets stay reachable with large touch targets.
4. Use **Scenes** and **Presets** anytime — chrome stays quiet otherwise.

Layout and content persist in `localStorage` under `harbor-desk-v3`. Safe-area insets are respected on notched phones; landscapes stay full-bleed behind the stack.
