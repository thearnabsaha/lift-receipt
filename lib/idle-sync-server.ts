import "server-only";

export type IdleSyncInput = { active: boolean; startedAt?: string | null; lastActivityAt?: string | null; hours: number };

/** Mirror the device's active-workout timing and (re)arm the idle-reminder workflow when due. */
export async function syncIdleForUser(userId: string, s: IdleSyncInput) {
  const p = await import("@/lib/push");
  const r = await p.syncIdle(userId, s);
  if (r.needsRun && r.dueAt) {
    try {
      const { start } = await import("workflow/api"); const { idleWatchWorkflow } = await import("@/workflows/idle-watch");
      const run = await start(idleWatchWorkflow, [userId]);
      await p.markRun(userId, run.runId, r.dueAt);
    } catch (e) { console.error("idle workflow start failed", e); }
  }
  return { ok: true, dueAt: r.dueAt?.toISOString() ?? null };
}
