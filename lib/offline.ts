"use client";
import { get, set } from "idb-keyval";
import { deleteWorkoutAction, saveRoutineAction } from "@/app/actions";
import { mergeDelete, dueDeletes, UNDO_MS, type PendingDelete } from "@/lib/delete-queue";
import type { WorkoutExercise } from "@/lib/db/schema";

const RKEY = "lr-routine-queue";
export type RoutineUpdate = { id: string; name: string; folder?: string | null; notes?: string | null; exercises: WorkoutExercise[] };
/** Routine template updates made offline; last write per routine wins. */
export async function queueRoutineUpdate(u: RoutineUpdate) {
  const q: RoutineUpdate[] = (await get(RKEY)) ?? [];
  await set(RKEY, [...q.filter((x) => x.id !== u.id), u]);
}
async function flushRoutines() {
  const q: RoutineUpdate[] = (await get(RKEY)) ?? []; if (!q.length) return;
  const left: RoutineUpdate[] = [];
  for (const u of q) { try { const { id, ...rest } = u; await saveRoutineAction(id, rest); } catch { left.push(u); } }
  await set(RKEY, left);
}

const KEY = "lr-sync-queue";
export type Queued = { id: string; payload: unknown; queuedAt: number };

export async function queueWorkout(id: string, payload: unknown) {
  const q: Queued[] = (await get(KEY)) ?? [];
  await set(KEY, [...q.filter((x) => x.id !== id), { id, payload, queuedAt: Date.now() }]);
  window.dispatchEvent(new Event("lr-queue"));
}
export async function queueSize() {
  return ((await get(KEY)) as Queued[] | undefined)?.length ?? 0;
}
let flushing = false;
export async function flushQueue(): Promise<number> {
  if (flushing || !navigator.onLine) return 0;
  flushing = true;
  let sent = 0;
  try {
    const q: Queued[] = (await get(KEY)) ?? [];
    const left: Queued[] = [];
    for (const item of q) {
      try {
        const r = await fetch("/api/workouts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(item.payload) });
        if (r.ok) sent++; else if (r.status >= 500 || r.status === 401) left.push(item);
      } catch { left.push(item); }
    }
    await set(KEY, left);
    await flushRoutines();
    await flushDeletes();
    window.dispatchEvent(new Event("lr-queue"));
  } finally { flushing = false; }
  return sent;
}

/* ---------- deferred / offline workout deletes ---------- */
const DKEY = "lr-delete-queue";
const devt = () => window.dispatchEvent(new Event("lr-deletes"));
export async function pendingDeletes(): Promise<PendingDelete[]> { return (await get(DKEY)) ?? []; }
/** Hide now, really delete after the undo window (or once back online). Also drops an unsynced copy from the save queue. */
export async function scheduleDelete(id: string) {
  await set(DKEY, mergeDelete(await pendingDeletes(), id, Date.now()));
  const q: Queued[] = (await get(KEY)) ?? [];
  if (q.some((x) => x.id === id)) { await set(KEY, q.filter((x) => x.id !== id)); window.dispatchEvent(new Event("lr-queue")); }
  devt();
  setTimeout(() => { void flushDeletes(); }, UNDO_MS + 200);
}
export async function cancelDelete(id: string) { await set(DKEY, (await pendingDeletes()).filter((d) => d.id !== id)); devt(); }
let dflush = false;
export async function flushDeletes(): Promise<number> {
  if (dflush || !navigator.onLine) return 0;
  dflush = true; let n = 0;
  try {
    const all = await pendingDeletes(); const { due } = dueDeletes(all, Date.now());
    const failed = new Set<string>();
    for (const d of due) { try { await deleteWorkoutAction(d.id); n++; } catch { failed.add(d.id); } }
    // re-read: an undo or a new delete may have happened meanwhile
    const doneIds = new Set(due.map((d) => d.id).filter((i) => !failed.has(i)));
    await set(DKEY, (await pendingDeletes()).filter((d) => !doneIds.has(d.id)));
    if (n) devt();
  } finally { dflush = false; }
  return n;
}
