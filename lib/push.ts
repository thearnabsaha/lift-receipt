// Web Push + idle-workout watch. No "server-only" import: this is also loaded by workflow steps.
import webpush from "web-push";
import { randomUUID } from "crypto";
import { and, eq, isNull, lt, lte, or, sql } from "drizzle-orm";
import { db, schema } from "./db";
import { idleDueAt, idlePushMessage } from "./idle";

const { pushSubscription, idleWatch } = schema;
export const vapidPublicKey = () => process.env.VAPID_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
let configured = false;
function configure() {
  if (configured) return true;
  const pub = vapidPublicKey(), priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:fortis@example.com", pub, priv);
  return (configured = true);
}
export const pushConfigured = () => !!(vapidPublicKey() && process.env.VAPID_PRIVATE_KEY);

export type SubInput = { endpoint: string; keys: { p256dh: string; auth: string } };
export async function saveSubscription(userId: string, s: SubInput, ua?: string | null) {
  if (!/^https:\/\//.test(s.endpoint) || !s.keys?.p256dh || !s.keys?.auth) throw new Error("Invalid subscription");
  await db.insert(pushSubscription).values({ id: randomUUID(), userId, endpoint: s.endpoint, p256dh: s.keys.p256dh, auth: s.keys.auth, userAgent: ua?.slice(0, 200) ?? null })
    .onConflictDoUpdate({ target: pushSubscription.endpoint, set: { userId, p256dh: s.keys.p256dh, auth: s.keys.auth } });
}
export async function removeSubscription(userId: string, endpoint: string) {
  await db.delete(pushSubscription).where(and(eq(pushSubscription.userId, userId), eq(pushSubscription.endpoint, endpoint)));
}
export async function subscriptionCount(userId: string) {
  const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(pushSubscription).where(eq(pushSubscription.userId, userId));
  return r?.n ?? 0;
}

/** Send to every device of the user. Drops subscriptions the push service says are gone. */
export async function sendToUser(userId: string, payload: { title: string; body: string; url: string; tag?: string }, onlyEndpoint?: string) {
  if (!configure()) throw new Error("Push is not configured on the server (VAPID keys missing)");
  const subs = await db.select().from(pushSubscription).where(onlyEndpoint ? and(eq(pushSubscription.userId, userId), eq(pushSubscription.endpoint, onlyEndpoint)) : eq(pushSubscription.userId, userId));
  let sent = 0, gone = 0; const errors: string[] = [];
  await Promise.all(subs.map(async (s) => {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 6 * 3600, urgency: "normal", topic: payload.tag }); sent++; }
    catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) { gone++; await db.delete(pushSubscription).where(eq(pushSubscription.id, s.id)); }
      else errors.push(`${code ?? ""} ${(e as Error).message}`.trim());
    }
  }));
  return { devices: subs.length, sent, gone, errors };
}

// ---------- idle watch ----------
export type IdleSync = { active: boolean; startedAt?: string | null; lastActivityAt?: string | null; hours: number };
/** Store the device's draft state. Returns whether a scheduler run must be (re)started. */
export async function syncIdle(userId: string, s: IdleSync) {
  const now = new Date();
  const hours = Math.max(0, Math.min(24, Math.round(s.hours)));
  const active = s.active && hours > 0 && !!s.startedAt;
  const startedAt = s.startedAt ? new Date(s.startedAt) : null;
  const lastAct = active ? new Date(Math.max(+new Date(s.lastActivityAt ?? s.startedAt!), +startedAt!)) : null;
  const dueAt = active ? idleDueAt({ startedAt: startedAt!.toISOString(), lastActivityAt: lastAct!.toISOString() }, hours) : null;
  const [row] = await db.insert(idleWatch).values({ userId, active, startedAt, lastActivityAt: lastAct, hours, dueAt, updatedAt: now })
    .onConflictDoUpdate({ target: idleWatch.userId, set: { active, startedAt, lastActivityAt: lastAct, hours, dueAt, updatedAt: now } })
    .returning();
  const live = row.runUntil && +row.runUntil > +now - 10 * 60_000;
  return { needsRun: active && !live && (!row.notifiedAt || !lastAct || +row.notifiedAt < +lastAct), dueAt };
}
export async function markRun(userId: string, runId: string, until: Date) {
  await db.update(idleWatch).set({ runId, runUntil: until }).where(eq(idleWatch.userId, userId));
}

/** One scheduler tick: notify if due (exactly once per idle period), else say when to wake. */
export async function checkIdle(userId: string, now = new Date()): Promise<{ done: true; sent?: number; reason: string } | { done: false; wakeAt: string }> {
  const [w] = await db.select().from(idleWatch).where(eq(idleWatch.userId, userId));
  const stop = async (reason: string, extra: { sent?: number } = {}) => { await db.update(idleWatch).set({ runUntil: null }).where(eq(idleWatch.userId, userId)); return { done: true as const, reason, ...extra }; };
  if (!w || !w.active || !w.dueAt || !w.startedAt) return stop("inactive");
  if (w.notifiedAt && w.lastActivityAt && +w.notifiedAt >= +w.lastActivityAt) return stop("already notified");
  if (+w.dueAt > +now) { await db.update(idleWatch).set({ runUntil: w.dueAt }).where(eq(idleWatch.userId, userId)); return { done: false, wakeAt: w.dueAt.toISOString() }; }
  if (+now - +w.dueAt > 24 * 3_600_000) return stop("stale"); // don't nag about a workout abandoned days ago
  // claim atomically so overlapping runs / the cron can't double-send
  const claimed = await db.update(idleWatch).set({ notifiedAt: now, runUntil: null })
    .where(and(eq(idleWatch.userId, userId), eq(idleWatch.active, true), lte(idleWatch.dueAt, now), or(isNull(idleWatch.notifiedAt), lt(idleWatch.notifiedAt, w.lastActivityAt ?? w.startedAt))))
    .returning({ u: idleWatch.userId });
  if (!claimed.length) return stop("claimed elsewhere");
  const r = await sendToUser(userId, idlePushMessage(w.startedAt, +now));
  return { done: true, sent: r.sent, reason: "sent" };
}

/** Daily cron backup: anything due in the last day that no run handled. */
export async function sweepIdle(now = new Date()) {
  const due = await db.select({ userId: idleWatch.userId }).from(idleWatch)
    .where(and(eq(idleWatch.active, true), lte(idleWatch.dueAt, now), sql`${idleWatch.dueAt} > ${new Date(+now - 24 * 3_600_000).toISOString()}`, or(isNull(idleWatch.notifiedAt), lt(idleWatch.notifiedAt, idleWatch.lastActivityAt))));
  let sent = 0;
  for (const d of due) { try { const r = await checkIdle(d.userId, now); if (r.done && r.sent) sent += r.sent; } catch { /* next */ } }
  return { checked: due.length, sent };
}
