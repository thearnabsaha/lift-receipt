import { test } from "node:test";
import assert from "node:assert/strict";
import { toPayloadExercises, fillFromPrevious, dropLoneSupersets, setLabel, fromLocalInput, linkPrefilled, type ESet, type EEx } from "../lib/editor";
const b = (o: Partial<ESet> = {}): ESet => ({ type: "normal", weight: "", reps: "", rpe: "", done: false, ...o });
const ex = (sets: ESet[]): EEx => ({ key: "k", exerciseId: "x", name: "X", notes: "", showNotes: false, supersetId: null, restSec: null, sets });
test("payload never contains NaN or out-of-range RPE", () => {
  const p = toPayloadExercises({ unit: "kg", exercises: [ex([b({ weight: ".", reps: "8.", rpe: "0", done: true }), b({ weight: "1.2.3", reps: "-", rpe: "11", done: true }), b({ weight: "20,5", reps: "10", rpe: "8.5", done: true })])] }, true);
  const s = p[0].sets;
  assert.deepEqual(s.map((x) => [x.weight, x.reps, x.rpe]), [[null, 8, null], [null, null, null], [20.5, 10, 8.5]]);
});
test("tap previous propagates to linked sets below", () => {
  const sets = linkPrefilled([b({ weight: "20", reps: "10" }), b({ weight: "20", reps: "10" }), b({ weight: "20", reps: "10" })]);
  const r = fillFromPrevious(sets, 0, "25", "8");
  assert.deepEqual(r.map((s) => s.weight + "x" + s.reps), ["25x8", "25x8", "25x8"]);
});
test("lone superset member is unlinked", () => {
  const r = dropLoneSupersets([{ supersetId: "a" }, { supersetId: null }, { supersetId: "b" }, { supersetId: "b" }]);
  assert.deepEqual(r.map((x) => x.supersetId), [null, null, "b", "b"]);
});
test("set labels skip warm-ups", () => {
  const sets = [{ type: "warmup" as const }, { type: "normal" as const }, { type: "normal" as const }, { type: "drop" as const }];
  assert.deepEqual(sets.map((_, i) => setLabel(sets, i)), ["W", "1", "2", "D"]);
});
test("cleared datetime does not throw", () => {
  assert.equal(fromLocalInput(""), null);
  assert.ok(fromLocalInput("2026-10-27T10:00"));
});
