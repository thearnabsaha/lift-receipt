import { test } from "node:test";
import assert from "node:assert/strict";
import { planRestore, validateBackup, type Backup, type Existing } from "../lib/backup";

let n = 0; const newId = () => `new-${++n}`;
const sets = [{ type: "normal" as const, weight: 100, reps: 5, done: true }];
const backup: Backup = {
  app: "fortis", version: 1, exportedAt: "2026-10-26T00:00:00Z",
  exercises: [{ id: "c1", name: "Zercher Squat", muscle: "Legs", equipment: "Barbell", instructions: null }],
  favorites: ["c1", "bi_bench"],
  routines: [{ id: "r1", name: "Legs", folder: null, notes: null, exercises: [{ exerciseId: "c1", name: "Zercher Squat", sets }] }],
  workouts: [
    { id: "w1", name: "Legs", notes: null, routineId: "r1", startedAt: "2026-10-01T12:00:00Z", endedAt: null, exercises: [{ exerciseId: "c1", name: "Zercher Squat", sets }, { exerciseId: "bi_bench", name: "Bench Press (Barbell)", sets }] },
    { id: "w2", name: "Push", notes: null, routineId: null, startedAt: "2026-10-03T12:00:00Z", endedAt: null, exercises: [{ exerciseId: "bi_bench", name: "Bench Press (Barbell)", sets }] },
  ],
  measurements: [{ kind: "bodyweight", value: 80, date: "2026-10-01T08:00:00Z" }],
  settings: { unit: "lb", restSec: 90, autoRest: true, timezoneOverride: null },
};
const builtins = [{ id: "bi_bench", name: "Bench Press (Barbell)", userId: null }];

function apply(state: Existing & { workouts: Backup["workouts"]; routines: Backup["routines"] }, p: ReturnType<typeof planRestore>) {
  state.exercises.push(...p.createExercises.map((e) => ({ id: e.id, name: e.name, userId: "u" })));
  state.routineNames.push(...p.routines.map((r) => r.name)); state.routines.push(...p.routines);
  state.workoutStarts.push(...p.workouts.map((w) => w.startedAt)); state.workouts.push(...p.workouts);
  state.measurements.push(...p.measurements); state.favorites.push(...p.favorites);
  if (p.settings) state.hasSettings = true;
}

test("round trip: restore into a fresh account, then again is a no-op", () => {
  const b = validateBackup(JSON.parse(JSON.stringify(backup)));
  const state = { exercises: [...builtins], favorites: [], routineNames: [], workoutStarts: [], measurements: [], hasSettings: false, workouts: [], routines: [] } as Existing & { workouts: Backup["workouts"]; routines: Backup["routines"] };
  const p1 = planRestore(b, state, newId);
  assert.equal(p1.createExercises.length, 1);
  const newEx = p1.createExercises[0].id;
  assert.notEqual(newEx, "c1");
  assert.equal(p1.workouts.length, 2);
  assert.equal(p1.workouts[0].exercises[0].exerciseId, newEx);
  assert.equal(p1.workouts[0].exercises[1].exerciseId, "bi_bench");
  assert.equal(p1.workouts[0].routineId, p1.routines[0].id);
  assert.notEqual(p1.workouts[0].id, "w1");
  assert.deepEqual(p1.favorites.sort(), ["bi_bench", newEx].sort());
  assert.deepEqual(p1.settings?.unit, "lb");
  assert.deepEqual(p1.unresolved, []);
  apply(state, p1);
  // re-export of the restored state equals the original modulo ids
  assert.deepEqual(state.workouts.map((w) => [w.startedAt, w.exercises.map((e) => e.name)]), b.workouts.map((w) => [w.startedAt, w.exercises.map((e) => e.name)]));
  const p2 = planRestore(b, state, newId);
  assert.equal(p2.createExercises.length + p2.routines.length + p2.workouts.length + p2.measurements.length + p2.favorites.length, 0);
  assert.equal(p2.settings, null);
  assert.deepEqual(p2.skipped, { workouts: 2, routines: 1, measurements: 1, exercises: 1 });
});
test("merge keeps existing data and maps by name", () => {
  const p = planRestore(backup, { exercises: [...builtins, { id: "mine", name: "zercher squat", userId: "u" }], favorites: ["mine"], routineNames: [], workoutStarts: ["2026-10-03T12:00:30Z"], measurements: [], hasSettings: true }, newId);
  assert.equal(p.createExercises.length, 0);
  assert.equal(p.workouts.length, 1);
  assert.equal(p.workouts[0].exercises[0].exerciseId, "mine");
  assert.deepEqual(p.favorites, ["bi_bench"]);
  assert.equal(p.settings, null);
});
test("rejects foreign or future files", () => {
  assert.throws(() => validateBackup({ hello: 1 }));
  assert.throws(() => validateBackup({ ...backup, version: 99 }));
});
