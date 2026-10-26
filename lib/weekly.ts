// Weekly summary maths (pure; shared by UI, MCP and tests). Weights in kg.
import type { WorkoutExercise } from "./db/schema";
import { KG_PER_LB, e1rm, round, workoutSetCount, workoutVolume, countsForStats } from "./calc";
import { prCount, prsAgainst } from "./prs";
import { muscleBalance } from "./muscles";

export type WW = { id: string; name: string; startedAt: Date; endedAt: Date | null; exercises: WorkoutExercise[] };
import { addWeeks, defaultTz, mondayOfTz, offsetToTz } from "./tz";

/** Monday 00:00 local of the week containing `d`, as a UTC instant. `tz` is an IANA zone (or legacy fixed minutes east of UTC). */
export function mondayOf(d: Date, tz: string | number = defaultTz()) {
  if (typeof tz === "number") { // legacy fixed offset
    const local = new Date(+d + tz * 60000);
    const day = (local.getUTCDay() + 6) % 7;
    local.setUTCHours(0, 0, 0, 0); local.setUTCDate(local.getUTCDate() - day);
    return new Date(+local - tz * 60000);
  }
  return mondayOfTz(d, tz);
}
export { offsetToTz };

export function weekTotals(ws: WW[]) {
  return {
    sessions: ws.length,
    volumeKg: Math.round(ws.reduce((a, w) => a + workoutVolume(w.exercises), 0)),
    sets: ws.reduce((a, w) => a + workoutSetCount(w.exercises), 0),
    minutes: Math.round(ws.reduce((a, w) => a + (w.endedAt ? Math.max(0, +w.endedAt - +w.startedAt) / 60000 : 0), 0)),
  };
}
/** % change, null when there is no baseline. */
export const pct = (cur: number, prev: number) => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null);

export function summarizeWeek(all: WW[], start: Date, muscleOf: (id: string) => string | undefined, now = new Date(), opts: { tz?: string; unit?: "kg" | "lb" } = {}) {
  const tz = opts.tz ?? defaultTz(); const unit = opts.unit ?? "kg";
  const end = addWeeks(start, 1, tz), prevStart = addWeeks(start, -1, tz);
  const inR = (a: Date, b: Date) => all.filter((w) => +w.startedAt >= +a && +w.startedAt < +b);
  const week = inR(start, end), prev = inR(prevStart, start);
  const t = weekTotals(week), p = weekTotals(prev);
  const prs = week.reduce((a, w) => a + prCount(prsAgainst(all, w)), 0);
  let best: { exercise: string; weightKg: number; reps: number; e1rmKg: number } | null = null;
  for (const w of week) for (const e of w.exercises) for (const s of e.sets.filter(countsForStats)) {
    const v = e1rm(s.weight, s.reps);
    if (v > (best?.e1rmKg ?? 0)) best = { exercise: e.name, weightKg: s.weight ?? 0, reps: s.reps ?? 0, e1rmKg: round(v, 1) };
  }
  const muscles = muscleBalance(week, muscleOf);
  const trained = muscles.filter((m) => m.sets > 0);
  const most = trained.slice(0, 3).map((m) => ({ name: m.name, sets: m.sets }));
  const neglected = muscles.filter((m) => m.sets === 0).map((m) => m.name);
  const change = { sessions: pct(t.sessions, p.sessions), volume: pct(t.volumeKg, p.volumeKg), sets: pct(t.sets, p.sets), minutes: pct(t.minutes, p.minutes) };
  const s = {
    weekStart: start.toISOString(), weekEnd: end.toISOString(), timezone: tz, unit, inProgress: +now < +end,
    ...t, prs, bestLift: best, previous: p, change, mostTrained: most, neglected,
  };
  return { ...s, recap: recap(s, unit) };
}

export function recap(s: { sessions: number; volumeKg: number; prs: number; inProgress: boolean; change: { volume: number | null }; mostTrained: { name: string }[]; neglected: string[]; bestLift: { exercise: string } | null }, unit: "kg" | "lb" = "kg") {
  const when = s.inProgress ? "So far this week" : "Last week";
  if (!s.sessions) return `${when}: no workouts logged${s.inProgress ? " yet" : ""}.`;
  const parts = [`${when}: ${s.sessions} session${s.sessions > 1 ? "s" : ""}, ${Math.round(unit === "lb" ? s.volumeKg / KG_PER_LB : s.volumeKg).toLocaleString("en")} ${unit} lifted`];
  if (s.change.volume != null) parts.push(`${s.change.volume >= 0 ? "up" : "down"} ${Math.abs(s.change.volume)}% on volume`);
  let out = parts.join(", ") + ".";
  if (s.prs) out += ` ${s.prs} new PR${s.prs > 1 ? "s" : ""}${s.bestLift ? `, best lift ${s.bestLift.exercise}` : ""}.`;
  if (s.mostTrained.length) out += ` Most work: ${s.mostTrained.map((m) => m.name).join(", ")}.`;
  const big = s.neglected.filter((n) => ["Chest", "Lats / Upper back", "Shoulders", "Quads", "Hamstrings", "Glutes"].includes(n));
  if (big.length) out += ` Not trained: ${big.join(", ")}.`;
  return out;
}
