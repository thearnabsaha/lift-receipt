// Time-zone helpers (pure, Intl-only, DST-safe). Shared by server, client, MCP and tests.
export const FALLBACK_TZ = "Asia/Kolkata";

export function isValidTz(tz: unknown): tz is string {
  if (typeof tz !== "string" || !tz || tz.length > 64) return false;
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }); return true; } catch { return false; }
}

/** Legacy fixed offset (minutes east of UTC) → an IANA-ish zone. Only whole-hour offsets map to Etc/GMT; others fall back. */
export function offsetToTz(min: number): string {
  if (min === 330) return "Asia/Kolkata";
  if (min === 0) return "UTC";
  if (min % 60 === 0 && Math.abs(min) <= 14 * 60) { const h = -min / 60; return `Etc/GMT${h > 0 ? "+" : ""}${h}`; }
  return FALLBACK_TZ;
}

/** Final default: WEEK_TZ (IANA) or legacy WEEK_TZ_OFFSET_MIN env, else Asia/Kolkata. */
export function defaultTz(): string {
  const e = typeof process !== "undefined" ? process.env : {} as Record<string, string | undefined>;
  if (isValidTz(e.WEEK_TZ)) return e.WEEK_TZ!;
  if (e.WEEK_TZ_OFFSET_MIN && !isNaN(Number(e.WEEK_TZ_OFFSET_MIN))) return offsetToTz(Number(e.WEEK_TZ_OFFSET_MIN));
  return FALLBACK_TZ;
}

const fmts = new Map<string, Intl.DateTimeFormat>();
function parts(d: Date, tz: string) {
  let f = fmts.get(tz);
  if (!f) { f = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }); fmts.set(tz, f); }
  const o: Record<string, number> = {};
  for (const p of f.formatToParts(d)) if (p.type !== "literal") o[p.type] = Number(p.value);
  return { y: o.year, m: o.month, d: o.day, h: o.hour === 24 ? 0 : o.hour, mi: o.minute, s: o.second };
}
/** Minutes east of UTC for `tz` at instant `d`. */
export function tzOffsetMin(d: Date, tz: string) {
  const p = parts(d, tz);
  return Math.round((Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(+d / 1000) * 1000) / 60000);
}
/** UTC instant of local wall-clock midnight y-m-d in tz (handles DST). */
export function zonedMidnight(y: number, m: number, d: number, tz: string) {
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - tzOffsetMin(new Date(guess), tz) * 60000;
  t = guess - tzOffsetMin(new Date(t), tz) * 60000; // second pass for DST transitions
  return new Date(t);
}
/** Local calendar date (YYYY-MM-DD) of instant d in tz. */
export function localDateKey(d: Date, tz: string) {
  const p = parts(d, tz); return `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}
export function startOfDay(d: Date, tz: string) { const p = parts(d, tz); return zonedMidnight(p.y, p.m, p.d, tz); }
/** Monday 00:00 local time (in tz) of the week containing d, as a UTC instant. */
export function mondayOfTz(d: Date, tz: string) {
  const p = parts(d, tz);
  const dow = (new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay() + 6) % 7;
  const c = new Date(Date.UTC(p.y, p.m - 1, p.d - dow));
  return zonedMidnight(c.getUTCFullYear(), c.getUTCMonth() + 1, c.getUTCDate(), tz);
}
/** Monday after the one given (calendar week later; may be 167/169 h across DST). */
export function addWeeks(monday: Date, n: number, tz: string) {
  const p = parts(monday, tz);
  const c = new Date(Date.UTC(p.y, p.m - 1, p.d + 7 * n));
  return zonedMidnight(c.getUTCFullYear(), c.getUTCMonth() + 1, c.getUTCDate(), tz);
}
