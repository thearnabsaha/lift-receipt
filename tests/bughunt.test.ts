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

import { undoDelete, reflowAuto, nextSet } from "../lib/editor";
import { toKg, toDisplay, lbToKg } from "../lib/calc";
import { classifyStatus } from "../lib/sync-status";
test("undo delete restores exact pre-delete sets and auto flags", () => {
  const before = linkPrefilled([b({ weight: "20", reps: "10" }), b({ weight: "20", reps: "10" }), b({ weight: "20", reps: "10" })]);
  before[1].weight = "25"; before[1].auto = { weight: false, reps: true }; before[2].weight = "25"; before[2].auto = { weight: true, reps: true };
  const after = reflowAuto([before[0], before[2]], 1);
  assert.equal(after[1].weight, "20");
  const r = undoDelete(after, before, 1);
  assert.deepEqual(r, before);
});
test("undo keeps sets marked done / added after the delete", () => {
  const before = [b({ weight: "20" }), b({ weight: "30" }), b({ weight: "40" })];
  const after = [b({ weight: "20" }), b({ weight: "40", done: true }), b({ weight: "50" })];
  const r = undoDelete(after, before, 1);
  assert.deepEqual(r.map((s) => [s.weight, s.done]), [["20", false], ["30", false], ["40", true], ["50", false]]);
});
test("add set after warm-up/drop is a normal set", () => {
  assert.equal(nextSet([b({ type: "warmup", weight: "10" })]).type, "normal");
  assert.equal(nextSet([], { type: "drop", weight: "10", reps: "5" }).type, "normal");
});
test("kg -> lb -> kg round-trips", () => {
  for (const kg of [22.5, 20, 2.5, 1.25, 102.5, 60, 37.5, 0.5, 142.5, 7.5]) assert.equal(toKg(toDisplay(kg, "lb"), "lb"), kg, String(kg));
  for (let lb = 5; lb <= 500; lb += 2.5) assert.equal(toDisplay(lbToKg(lb), "lb"), lb, String(lb));
  assert.equal(toKg(22.5, "kg"), 22.5);
});
test("sync status classification", () => {
  assert.equal(classifyStatus(null), "retry"); assert.equal(classifyStatus(200), "sent");
  assert.equal(classifyStatus(500), "retry"); assert.equal(classifyStatus(401), "retry");
  assert.equal(classifyStatus(400), "rejected"); assert.equal(classifyStatus(422), "rejected");
});

import { planRestore, type Backup } from "../lib/backup";
test("restore: workouts in later chunks still link to their routine", () => {
  const b: Backup = { app: "fortis", version: 1, exportedAt: "", exercises: [], favorites: [], measurements: [], settings: null,
    routines: [{ id: "r-old", name: "Leg day", folder: null, notes: null, exercises: [] }],
    workouts: [{ id: "w", name: "Leg day", notes: null, routineId: "r-old", startedAt: "2026-01-01T10:00:00Z", endedAt: null, exercises: [] }] };
  const p = planRestore(b, { exercises: [], favorites: [], routineNames: ["Leg day"], routineIds: [{ id: "r-new", name: "Leg day" }], workoutStarts: [], measurements: [], hasSettings: true }, () => "x");
  assert.equal(p.workouts[0].routineId, "r-new");
  assert.equal(p.routines.length, 0);
});
