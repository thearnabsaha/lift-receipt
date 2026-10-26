import { test } from "node:test";
import assert from "node:assert/strict";
import { prTimeline } from "../lib/prs";
const s = (weight: number | null, reps: number, type: "normal" | "warmup" = "normal") => ({ type, weight, reps, done: true });
const W = (id: string, d: string, sets: ReturnType<typeof s>[], ex = "bench") => ({ id, name: id, startedAt: new Date(d), exercises: [{ exerciseId: ex, name: ex, sets }] });
test("timeline: baseline not a PR, kinds, previous best, newest first", () => {
  const { events, current } = prTimeline([
    W("w2", "2026-10-03", [s(105, 5), s(100, 8)]),
    W("w1", "2026-10-01", [s(60, 10, "warmup"), s(100, 5)]),
    W("w3", "2026-10-05", [s(100, 5)]),
    W("p1", "2026-10-01", [s(null, 10)], "pullup"), W("p2", "2026-10-02", [s(null, 12)], "pullup"),
  ]);
  const w2 = events.filter((e) => e.workoutId === "w2");
  assert.deepEqual(w2.map((e) => e.kind).sort(), ["e1rm", "volume", "weight"]);
  assert.equal(w2.find((e) => e.kind === "weight")!.previous, 100);
  assert.equal(w2.find((e) => e.kind === "volume")!.value, 800);
  assert.equal(events.some((e) => e.workoutId === "w1" || e.workoutId === "w3"), false);
  assert.equal(events[0].workoutId, "w2");
  const pu = events.find((e) => e.exerciseId === "pullup")!;
  assert.equal(pu.kind, "reps"); assert.equal(pu.value, 12); assert.equal(pu.previous, 10);
  const b = current.find((c) => c.exerciseId === "bench")!;
  assert.equal(b.maxWeight, 105); assert.deepEqual(b.bestVolumeSet, { weight: 100, reps: 8 }); assert.equal(b.prCount, 3);
});
