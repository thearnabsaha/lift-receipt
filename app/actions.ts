"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import * as svc from "@/lib/services";
import type { WorkoutExercise } from "@/lib/db/schema";
import * as io from "@/lib/data-io";
import type { ImportedWorkout } from "@/lib/importers";

const done = (r: unknown = true) => { revalidatePath("/", "layout"); return r; };

export async function saveWorkoutAction(input: Parameters<typeof svc.saveWorkout>[1]) {
  const u = await requireUser();
  const w = await svc.saveWorkout(u.id, input);
  // extra numbers for the finish screen (best effort)
  let count: number | null = null, prs: number | null = null, prEx: string[] = [];
  try {
    count = await svc.workoutCount(u.id);
    const pr = await svc.workoutPRs(u.id, { id: w.id, startedAt: w.startedAt, exercises: w.exercises });
    prs = pr.reduce((a, m) => a + Object.keys(m).length, 0);
    prEx = w.exercises.filter((_, i) => Object.keys(pr[i] ?? {}).length > 0).map((e) => e.exerciseId);
  } catch {}
  return done({ id: w.id, count, prs, prEx }) as { id: string; count: number | null; prs: number | null; prEx: string[] };
}
export async function deleteWorkoutAction(id: string) {
  const u = await requireUser(); await svc.deleteWorkout(u.id, id); return done();
}
export async function saveRoutineAction(id: string | null, input: { name: string; folder?: string | null; notes?: string | null; exercises: WorkoutExercise[] }) {
  const u = await requireUser();
  const r = id ? await svc.updateRoutine(u.id, id, input) : await svc.createRoutine(u.id, input);
  return done({ id: r?.id });
}
export async function deleteRoutineAction(id: string) {
  const u = await requireUser(); await svc.deleteRoutine(u.id, id); return done();
}
export async function createExerciseAction(d: { name: string; muscle: string; equipment: string; instructions?: string }) {
  const u = await requireUser(); const e = await svc.createExercise(u.id, d); done(); return e;
}
export async function deleteExerciseAction(id: string) {
  const u = await requireUser(); await svc.deleteExercise(u.id, id); return done();
}
export async function updateSettingsAction(p: { unit?: string; timezoneOverride?: string | null }) {
  const u = await requireUser(); const s = await svc.updateSettings(u.id, p); done(); return s;
}
/** Called by the client when the device's IANA zone differs from what we stored (no revalidate: cheap + silent). */
export async function syncTimezoneAction(tz: string) {
  const u = await requireUser(); const cur = await svc.getSettings(u.id);
  if (cur.timezone !== tz) await svc.updateSettings(u.id, { timezone: tz });
  return { ok: true };
}
export async function logMeasurementAction(d: { kind: string; value: number; date?: string }) {
  const u = await requireUser(); await svc.logMeasurement(u.id, { kind: d.kind, value: d.value, date: d.date ? new Date(d.date) : undefined }); return done();
}
export async function deleteMeasurementAction(id: string) {
  const u = await requireUser(); await svc.deleteMeasurement(u.id, id); return done();
}
export async function createApiKeyAction(name: string) {
  const u = await requireUser(); const k = await svc.createApiKey(u.id, name); done(); return { key: k.key };
}
export async function revokeApiKeyAction(id: string) {
  const u = await requireUser(); await svc.revokeApiKey(u.id, id); return done();
}
export async function importWorkoutsAction(list: Parameters<typeof svc.saveWorkout>[1][]) {
  const u = await requireUser();
  let n = 0;
  for (const w of list) { await svc.saveWorkout(u.id, w); n++; }
  done();
  return { imported: n };
}
export async function setFavoriteAction(exerciseId: string, fav: boolean) {
  const u = await requireUser(); return svc.setFavorite(u.id, exerciseId, fav);
}
export async function shareRoutineAction(routineId: string) {
  const u = await requireUser(); const s = await svc.shareRoutine(u.id, routineId); done(); return { token: s.token };
}
export async function unshareRoutineAction(routineId: string) {
  const u = await requireUser(); await svc.unshareRoutine(u.id, routineId); return done();
}
export async function importSharedRoutineAction(token: string) {
  const u = await requireUser(); const r = await svc.importSharedRoutine(u.id, token); done(); return { id: r.id, name: r.name };
}

// ---------- import / backup (chunked by the client) ----------
export async function previewImportAction(ws: { startedAt: string; names: string[]; sets: number }[]) {
  const u = await requireUser(); return io.previewImport(u.id, ws);
}
export async function importChunkAction(ws: ImportedWorkout[], last: boolean) {
  const u = await requireUser(); const r = await io.importChunk(u.id, ws); if (last) done(); return r;
}
export async function previewRestoreAction(b: unknown) {
  const u = await requireUser(); return io.previewRestore(u.id, b);
}
export async function restoreChunkAction(b: unknown, last: boolean) {
  const u = await requireUser(); const r = await io.restoreChunk(u.id, b); if (last) done(); return r;
}

// ---------- push / idle ----------
export async function pushStatusAction() {
  const u = await requireUser(); const { pushConfigured, subscriptionCount, vapidPublicKey } = await import("@/lib/push");
  return { configured: pushConfigured(), publicKey: vapidPublicKey(), devices: await subscriptionCount(u.id) };
}
export async function subscribePushAction(sub: { endpoint: string; keys: { p256dh: string; auth: string } }, ua?: string) {
  const u = await requireUser(); const { saveSubscription } = await import("@/lib/push"); await saveSubscription(u.id, sub, ua); return { ok: true };
}
export async function unsubscribePushAction(endpoint: string) {
  const u = await requireUser(); const { removeSubscription } = await import("@/lib/push"); await removeSubscription(u.id, endpoint); return { ok: true };
}
export async function testPushAction(endpoint?: string) {
  const u = await requireUser(); const { sendToUser } = await import("@/lib/push");
  return sendToUser(u.id, { title: "Fortis", body: "Notifications are on. You'll only hear from us when a workout has been idle.", url: "/settings#notifications", tag: "fortis-test" }, endpoint);
}
export async function syncIdleAction(s: { active: boolean; startedAt?: string | null; lastActivityAt?: string | null; hours: number }) {
  const u = await requireUser(); const p = await import("@/lib/push");
  const r = await p.syncIdle(u.id, s);
  if (r.needsRun && r.dueAt) {
    try {
      const { start } = await import("workflow/api"); const { idleWatchWorkflow } = await import("@/workflows/idle-watch");
      const run = await start(idleWatchWorkflow, [u.id]);
      await p.markRun(u.id, run.runId, r.dueAt);
    } catch (e) { console.error("idle workflow start failed", e); }
  }
  return { ok: true, dueAt: r.dueAt?.toISOString() ?? null };
}
