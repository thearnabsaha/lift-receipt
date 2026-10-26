// Idle detection for an in-progress workout draft (pure helpers + tiny storage glue).
export const IDLE_OPTIONS = [0, 2, 3, 4, 6] as const; // hours; 0 = off
export const IDLE_DEFAULT_H = 3;
export const IDLE_PREF_KEY = "lr-idle-hours";
export const IDLE_FINISH_FLAG = "lr-idle-finish"; // set by the global prompt, consumed by the editor

type Draft = { startedAt: string; lastActivityAt?: string | null };

/** Time of the last edit; falls back to start time for drafts created before tracking existed. */
export function lastActivity(d: Draft): number {
  const t = d.lastActivityAt ? Date.parse(d.lastActivityAt) : NaN;
  const s = Date.parse(d.startedAt);
  return Number.isFinite(t) ? Math.max(t, s) : s;
}
export function idleMs(d: Draft, now: number): number { return Math.max(0, now - lastActivity(d)); }
/** True when idle for at least `hours` (0/negative = feature off). */
export function isIdle(d: Draft, hours: number, now: number): boolean {
  return hours > 0 && idleMs(d, now) >= hours * 3_600_000;
}
/** End time to use when finishing an idle workout: the last activity, never before start. */
export function idleEndTime(d: Draft): string { return new Date(lastActivity(d)).toISOString(); }
/** "3 hours", "1 hour", "2.5 hours", "1 day" */
export function formatIdle(ms: number): string {
  const h = ms / 3_600_000;
  if (h >= 24) { const d = Math.floor(h / 24); return `${d} day${d === 1 ? "" : "s"}`; }
  const r = h >= 10 ? Math.floor(h) : Math.floor(h * 2) / 2;
  return `${r} hour${r === 1 ? "" : "s"}`;
}
export function parseIdleHours(v: string | null): number {
  const n = v === null ? IDLE_DEFAULT_H : Number(v);
  return (IDLE_OPTIONS as readonly number[]).includes(n) ? n : IDLE_DEFAULT_H;
}

/** When the idle push is due: last activity + threshold (null when the feature is off). */
export function idleDueAt(d: Draft, hours: number): Date | null {
  return hours > 0 ? new Date(lastActivity(d) + hours * 3_600_000) : null;
}
/** Push text. `startedAt` → "running 3h" / "running 3.5h". */
export function idlePushMessage(startedAt: Date | string, now: number) {
  const h = Math.max(0, now - +new Date(startedAt)) / 3_600_000;
  const r = h >= 10 ? Math.floor(h) : Math.max(0.5, Math.floor(h * 2) / 2);
  return { title: "Still working out?", body: `Your workout has been running ${r}h. Tap to finish or discard.`, url: "/workout", tag: "fortis-idle" };
}
