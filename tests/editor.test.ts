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
