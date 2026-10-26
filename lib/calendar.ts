// Training calendar + weekly streaks (pure). Days are local calendar dates (YYYY-MM-DD) in the user's tz;
// weeks run Monday→Sunday and are identified by their Monday's date key. All week arithmetic is done on
// date keys (UTC date math on y-m-d), so DST and midnight never shift a workout into the wrong week.
import { localDateKey } from "./tz";

export type CalDay = { count: number; volume: number; level: 1 | 2 | 3 };
export type TrainingCalendar = {
  days: Record<string, CalDay>;
  today: string;
  thisWeek: number;
  currentStreak: number;
  longestStreak: number;
  activeWeeks: number;
};

const ymd = (k: string) => { const [y, m, d] = k.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const key = (t: number) => new Date(t).toISOString().slice(0, 10);
/** Monday (date key) of the week containing date key k. */
export function weekOf(k: string) { const t = ymd(k); return key(t - ((new Date(t).getUTCDay() + 6) % 7) * 864e5); }
export function shiftDays(k: string, n: number) { return key(ymd(k) + n * 864e5); }
/** Monday-first grid for a month ("YYYY-MM"): leading/trailing nulls pad to whole weeks. */
export function monthGrid(month: string): (string | null)[] {
  const [y, m] = month.split("-").map(Number);
  const first = Date.UTC(y, m - 1, 1), n = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (new Date(first).getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 0; d < n; d++) cells.push(key(first + d * 864e5));
  while (cells.length % 7) cells.push(null);
  return cells;
}
export function shiftMonth(month: string, n: number) {
  const [y, m] = month.split("-").map(Number); const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Streaks over a set of week keys (Mondays). Current streak stays alive through the current week until it ends
 *  (training last week but not yet this week still counts), like Hevy. */
export function weekStreaks(weeks: Set<string>, thisMonday: string) {
  let longest = 0, run = 0, prev = "";
  for (const w of [...weeks].sort()) { run = prev && shiftDays(prev, 7) === w ? run + 1 : 1; longest = Math.max(longest, run); prev = w; }
  let cur = 0, w = weeks.has(thisMonday) ? thisMonday : shiftDays(thisMonday, -7);
  while (weeks.has(w)) { cur++; w = shiftDays(w, -7); }
  return { current: cur, longest };
}

/** Intensity 1–3 by day volume relative to the user's own distribution (terciles of training days; count if no volume). */
export function buildCalendar(ws: { startedAt: Date; volume: number }[], tz: string, now = new Date()): TrainingCalendar {
  const acc: Record<string, { count: number; volume: number }> = {};
  for (const w of ws) { const k = localDateKey(w.startedAt, tz); const a = (acc[k] ??= { count: 0, volume: 0 }); a.count++; a.volume += w.volume || 0; }
  const score = (d: { count: number; volume: number }) => d.volume > 0 ? d.volume : d.count * 1e-6;
  const sorted = Object.values(acc).map(score).sort((a, b) => a - b);
  const q = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0;
  const [t1, t2] = [q(1 / 3), q(2 / 3)];
  const days: Record<string, CalDay> = {};
  for (const [k, d] of Object.entries(acc)) { const s = score(d); days[k] = { ...d, volume: Math.round(d.volume), level: sorted.length < 3 ? 2 : s >= t2 ? 3 : s >= t1 ? 2 : 1 }; }
  const today = localDateKey(now, tz), mon = weekOf(today);
  const weeks = new Set(Object.keys(days).map(weekOf));
  const { current, longest } = weekStreaks(weeks, mon);
  let thisWeek = 0; for (let i = 0; i < 7; i++) thisWeek += days[shiftDays(mon, i)]?.count ?? 0;
  return { days, today, thisWeek, currentStreak: current, longestStreak: longest, activeWeeks: weeks.size };
}
