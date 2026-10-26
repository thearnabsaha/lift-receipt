import { test } from "node:test";
import assert from "node:assert/strict";
import { dueDeletes, hideDeleted, mergeDelete, UNDO_MS } from "../lib/delete-queue";
import { prCount, prsAgainst } from "../lib/prs";
import type { WorkoutExercise } from "../lib/db/schema";
const ex = (w: number, r: number): WorkoutExercise[] => [{ exerciseId: "bench", name: "Bench", sets: [{ type: "normal", weight: w, reps: r, rpe: null, done: true }] }];
const W = (id: string, day: number, w: number, r: number) => ({ id, startedAt: new Date(Date.UTC(2026, 9, day)), exercises: ex(w, r) });
test("delete queue dedupes and respects the undo window", () => {
  let q = mergeDelete([], "a", 1000); q = mergeDelete(q, "a", 3000); q = mergeDelete(q, "b", 2000);
  assert.equal(q.length, 2); assert.equal(q[0].at, 1000);
  const { due, waiting } = dueDeletes(q, 1000 + UNDO_MS);
  assert.deepEqual(due.map((d) => d.id), ["a"]); assert.deepEqual(waiting.map((d) => d.id), ["b"]);
  assert.deepEqual(hideDeleted([{ id: "a" }, { id: "c" }], q).map((x) => x.id), ["c"]);
});
test("deleting an earlier heavier workout turns a later one into a PR", () => {
  const z = W("z", 0, 80, 5), a = W("a", 1, 100, 5), b = W("b", 8, 90, 5);
  assert.equal(prCount(prsAgainst([z, a, b], b)), 0);
  assert.ok(prCount(prsAgainst([z, b], b)) > 0); // after deleting "a"
  // the workout itself and later ones never count as "prior"
  assert.ok(prCount(prsAgainst([z, a, b, W("c", 9, 200, 5)], a)) > 0);
  // a first-ever session is a baseline, never a PR
  assert.equal(prCount(prsAgainst([b], b)), 0);
});
