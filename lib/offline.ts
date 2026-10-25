"use client";
import { get, set } from "idb-keyval";

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
    window.dispatchEvent(new Event("lr-queue"));
  } finally { flushing = false; }
  return sent;
}
