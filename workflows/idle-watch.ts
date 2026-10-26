import { sleep } from "workflow";

/** Durable timer: sleeps until the idle push is due, re-checks (activity may have moved it), sends once, exits. */
export async function idleWatchWorkflow(userId: string) {
  "use workflow";
  for (let i = 0; i < 20; i++) {
    const r = await idleTick(userId);
    if (r.done) return r;
    await sleep(new Date(r.wakeAt));
  }
  return { done: true, reason: "max ticks" };
}

async function idleTick(userId: string) {
  "use step";
  const { checkIdle } = await import("@/lib/push");
  return checkIdle(userId);
}
