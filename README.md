# Fortis

A Strong-style workout tracker — mobile-first, installable PWA, with an MCP server so AI assistants (Grok Bot, Claude, Cursor…) can log workouts and read your progress.

Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Drizzle + Neon Postgres · Better Auth · mcp-handler

## Features
- **Workout logging** — weight / reps / RPE, set types (warm-up, normal, drop, failure), tick-to-complete, "Previous" column, add/remove/reorder exercises, supersets, notes, live timer, screen wake-lock.
- **Rest timer** — auto-starts on set completion (configurable default + per-exercise override), ±15s, beep + vibrate.
- **Exercise library** — 171 built-ins + custom exercises, search, muscle / equipment filters.
- **Routines** — templates in folders; start in one tap.
- **History** — list (grouped by month) and calendar views; receipt-style detail with PR badges; edit or delete.
- **Progress** — per-exercise charts (best e1RM, max weight, volume), rep records; dashboard with weekly chart and streak.
- **Measurements** — bodyweight, body fat, tape measurements with charts.
- **Tools** — plate calculator and 1RM calculator (Epley) with % table.
- **Settings** — kg/lb, rest timer, theme (light/dark/auto), CSV export, CSV import (Fortis or Strong export), API keys.
- **PWA** — manifest with maskable icons + shortcuts, service worker (offline shell, cached static assets), offline workout queue in IndexedDB that syncs when back online, install prompt (Android/desktop + iOS hint).

## Local setup
```bash
cp .env.example .env.local   # fill in values
npm install
npx drizzle-kit migrate      # create tables
npx tsx scripts/seed.ts      # seed built-in exercises
npm run dev
```

## MCP server
Endpoint: `https://<your-domain>/api/mcp` — Streamable HTTP, auth with `Authorization: Bearer <api key>`.

1. Sign in → **Settings → MCP / API keys** → *Create key*. Copy it (shown once).
2. In **Grok Bot**: add a custom MCP connector → URL `https://<your-domain>/api/mcp` → header `Authorization: Bearer lr_…`.
3. Other clients, e.g. Cursor / Claude Desktop `mcp.json`:
```json
{ "mcpServers": { "fortis": { "url": "https://<your-domain>/api/mcp", "headers": { "Authorization": "Bearer lr_..." } } } }
```

Tools: `list_exercises`, `create_exercise`, `list_routines`, `get_routine`, `create_routine`, `update_routine`, `delete_routine`, `start_workout`, `log_workout`, `add_set`, `finish_workout`, `list_workouts`, `get_workout`, `delete_workout`, `get_exercise_history`, `get_personal_records`, `get_progress_summary`, `log_measurement`, `list_measurements`, `get_stats`.
All weight tools accept a `unit` (`kg`/`lb`); data is stored in kg.

Smoke test: `MCP_URL=https://<domain>/api/mcp MCP_KEY=lr_... node scripts/mcp-smoke.mjs`

## Deploy (Vercel)
Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (production origin) and deploy.

## Credits & licences

- Muscle diagram geometry: [MuscleMap](https://github.com/melihcolpan/MuscleMap) (MIT) via [openGym](https://github.com/DuarteSantos8/openGym) (openGym itself is AGPL-3.0; the reused path data is MIT-licensed artwork per openGym's NOTICE). See [NOTICE.md](NOTICE.md). No openGym/Gym visual exercise media is used.
- Source code: https://github.com/thearnabsaha/lift-receipt
