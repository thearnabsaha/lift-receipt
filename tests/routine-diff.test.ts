import { test } from "node:test";
import assert from "node:assert/strict";
import { diffRoutine, applyValuesOnly, applyEverything, summarize } from "../lib/routine-diff";
import type { WorkoutExercise } from "../lib/db/schema";
const s = (weight: number | null, reps: number | null, type: "normal" | "warmup" = "normal") => ({ type, weight, reps, rpe: null, done: false });
const ex = (id: string, sets: WorkoutExercise["sets"]): WorkoutExercise => ({ exerciseId: id, name: id, sets } as WorkoutExercise);
const tpl = [ex("bench", [s(20, 10), s(20, 10)]), ex("push", [s(40, 12)])];
test("no change", () => { assert.equal(diffRoutine(tpl, structuredClone(tpl)).changed, false); });
test("detects values, sets, exercises, order", () => {
  const act = [ex("push", [s(40, 12)]), ex("bench", [s(22.5, 10), s(20, 8), s(20, 8)]), ex("fly", [s(10, 15)])];
  const d = diffRoutine(tpl, act);
  assert.deepEqual({ ...d }, { added: 1, removed: 0, reordered: true, setsAdded: 1, setsRemoved: 0, weights: 1, reps: 1, types: 0, changed: true });
  assert.ok(summarize(d).includes("+1 exercise"));
});
test("replace counts as +1/-1", () => { const d = diffRoutine(tpl, [ex("bench", tpl[0].sets), ex("dip", [s(0, 12)])]); assert.equal(d.added, 1); assert.equal(d.removed, 1); });
test("values only keeps structure", () => {
  const act = [ex("bench", [s(25, 8)]), ex("fly", [s(10, 15)])];
  const r = applyValuesOnly(tpl, act);
  assert.deepEqual(r.map((e) => e.exerciseId), ["bench", "push"]);
  assert.deepEqual(r[0].sets.map((x) => [x.weight, x.reps]), [[25, 8], [20, 10]]);
  assert.deepEqual(r[1].sets[0].weight, 40);
});
test("everything resets done", () => { assert.equal(applyEverything([ex("a", [{ ...s(1, 1), done: true }])])[0].sets[0].done, false); });
