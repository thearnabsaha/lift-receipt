import { test } from "node:test";
import assert from "node:assert/strict";
import demos from "../lib/data/demos.json" with { type: "json" };
import { MUSCLE_PLAIN, plainMuscle, plainMuscles } from "../lib/demos";

test("every Everkinetic muscle string has a plain-English name", () => {
  const all = new Set<string>();
  for (const d of Object.values(demos as Record<string, { primary: string[]; secondary: string[] }>)) [...d.primary, ...d.secondary].forEach((m) => all.add(m));
  const missing = [...all].filter((m) => !(m in MUSCLE_PLAIN));
  assert.deepEqual(missing, []);
});
test("mapping + fallback", () => {
  assert.equal(plainMuscle("Pectoralis major"), "Chest");
  assert.equal(plainMuscle("Latissimus dorsi"), "Lats");
  assert.equal(plainMuscle("teres major"), "Teres Major");
  assert.deepEqual(plainMuscles(["Deltoid", "Deltoid"]), ["Shoulders"]);
});
