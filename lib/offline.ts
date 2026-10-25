"use client";
import { get, set } from "idb-keyval";
import { saveRoutineAction } from "@/app/actions";
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
    window.dispatchEvent(new Event("lr-queue"));
  } finally { flushing = false; }
  return sent;
}
