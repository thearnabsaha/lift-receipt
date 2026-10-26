import { test } from "node:test";
import assert from "node:assert/strict";
import { setFieldWithAutofill as f, nextSet, type ESet } from "../lib/editor";
const b = (o: Partial<ESet> = {}): ESet => ({ type: "normal", weight: "", reps: "", rpe: "", done: false, ...o });
test("propagates to empty later sets", () => {
  const r = f([b(), b(), b()], 0, "weight", "20");
  assert.deepEqual(r.map((s) => s.weight), ["20", "20", "20"]);
  assert.deepEqual(r.map((s) => !!s.auto?.weight), [false, true, true]);
});
test("re-edit updates auto ones, stops at manual", () => {
  let r = f([b(), b(), b(), b()], 0, "weight", "20");
  r = f(r, 2, "weight", "25");
  r = f(r, 0, "weight", "22");
  assert.deepEqual(r.map((s) => s.weight), ["22", "22", "25", "25"]);
});
test("skips done sets, keeps template values, independent fields", () => {
  const r = f([b(), b({ done: true, weight: "10" }), b({ reps: "8" }), b({ weight: "30" }), b()], 0, "weight", "20");
  assert.deepEqual(r.map((s) => s.weight), ["20", "10", "20", "30", ""]);
  assert.equal(r[2].reps, "8");
});
test("nextSet copies previous", () => {
  const s = nextSet([b({ weight: "20", reps: "10", rpe: "8", type: "drop" })]);
  assert.deepEqual([s.weight, s.reps, s.rpe, s.type, s.done, s.auto?.weight], ["20", "10", "8", "drop", false, true]);
  assert.equal(nextSet([]).weight, "");
});

import { reflowAuto } from "../lib/editor";
test("reflowAuto re-links auto values after delete", () => {
  const sets = [
    { type: "normal" as const, weight: "20", reps: "10", rpe: "", done: false },
    { type: "normal" as const, weight: "30", reps: "10", rpe: "", done: false, auto: { weight: true, reps: true } },
    { type: "normal" as const, weight: "50", reps: "8", rpe: "", done: false, auto: { weight: false, reps: false } },
  ];
  // simulate deleting a manual 30kg set at index 1 that the auto set copied
  const r = reflowAuto(sets, 1);
  assert.equal(r[1].weight, "20"); assert.equal(r[2].weight, "50");
});

import { linkPrefilled, toEditorExercises } from "../lib/editor";
test("routine-prefilled equal sets follow set 1 (weight & reps)", () => {
  const sets = linkPrefilled([b({ weight: "50", reps: "10" }), b({ weight: "50", reps: "10" }), b({ weight: "50", reps: "10" })]);
  let r = f(sets, 0, "weight", "60"); r = f(r, 0, "reps", "8");
  assert.deepEqual(r.map((s) => s.weight + "x" + s.reps), ["60x8", "60x8", "60x8"]);
});
test("pyramid template values are not clobbered", () => {
  const r = f(linkPrefilled([b({ weight: "20" }), b({ weight: "25" }), b({ weight: "25" })]), 0, "weight", "22");
  assert.deepEqual(r.map((s) => s.weight), ["22", "25", "25"]);
});
test("done middle set skipped, later prefilled set still follows", () => {
  let r = linkPrefilled([b({ weight: "50" }), b({ weight: "50" }), b({ weight: "50" })]);
  r[1].done = true; r = f(r, 0, "weight", "55");
  assert.deepEqual(r.map((s) => s.weight), ["55", "50", "55"]);
});
test("auto flags survive JSON draft round-trip", () => {
  const r = JSON.parse(JSON.stringify(f(linkPrefilled([b({ weight: "50" }), b({ weight: "50" })]), 0, "weight", "40")));
  assert.deepEqual(f(r, 0, "weight", "45").map((s: ESet) => s.weight), ["45", "45"]);
});
test("toEditorExercises links for routine start, not for history edit", () => {
  const ex = [{ exerciseId: "x", name: "X", sets: [{ type: "normal", weight: 50, reps: 10, rpe: null, done: true }, { type: "normal", weight: 50, reps: 10, rpe: null, done: true }] }] as never;
  assert.equal(toEditorExercises(ex, "kg", false)[0].sets[1].auto?.weight, true);
  assert.equal(toEditorExercises(ex, "kg", true)[0].sets[1].auto?.weight, undefined);
});
test("typed value in later set stays manual", () => {
  let r = f(linkPrefilled([b({ weight: "50" }), b({ weight: "50" }), b({ weight: "50" })]), 2, "weight", "70");
  r = f(r, 0, "weight", "60");
  assert.deepEqual(r.map((s) => s.weight), ["60", "60", "70"]);
});
