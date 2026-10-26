import { test } from "node:test";
import assert from "node:assert/strict";
import { regionsFor, muscleBalance, level } from "../lib/muscles";
test("mapping", () => {
  assert.deepEqual(regionsFor("Leg Extension", "Quads").primary, ["quadriceps"]);
  assert.deepEqual(regionsFor("Shrug (Barbell)", "Back").primary, ["trapezius"]);
  assert.deepEqual(regionsFor("Bench Press (Barbell)", "Chest").secondary, ["triceps", "deltoids"]);
  assert.deepEqual(regionsFor("Mystery", undefined).primary, []);
});
test("balance excludes warmups, halves secondaries", () => {
  const s = (type: "warmup" | "normal") => ({ type, weight: 50, reps: 10, done: true });
  const r = muscleBalance([{ startedAt: new Date(), exercises: [{ exerciseId: "x", name: "Bench Press (Barbell)", sets: [s("warmup"), s("normal"), s("normal")] }] }], () => "Chest");
  const by = Object.fromEntries(r.map((x) => [x.region, x]));
  assert.equal(by.chest.sets, 2); assert.equal(by.chest.volume, 1000); assert.equal(by.triceps.sets, 1); assert.equal(by.calves.sets, 0);
  assert.equal(level(1, 4), 1); assert.equal(level(4, 4), 4); assert.equal(level(0, 4), 0);
});
