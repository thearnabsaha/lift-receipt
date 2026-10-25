// Pure helpers for the deferred-delete queue (undo window + offline).
export const UNDO_MS = 5000;
export type PendingDelete = { id: string; at: number };
/** Add once; a repeated delete keeps the original timestamp (no duplicates). */
export function mergeDelete(q: PendingDelete[], id: string, now: number): PendingDelete[] {
  return q.some((d) => d.id === id) ? q : [...q, { id, at: now }];
}
/** Items whose undo window has passed. */
export function dueDeletes(q: PendingDelete[], now: number) {
  return { due: q.filter((d) => now - d.at >= UNDO_MS), waiting: q.filter((d) => now - d.at < UNDO_MS) };
}
export const hideDeleted = <T extends { id: string }>(list: T[], q: PendingDelete[]) => { const s = new Set(q.map((d) => d.id)); return list.filter((w) => !s.has(w.id)); };
