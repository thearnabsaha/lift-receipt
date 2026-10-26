import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { detectFormat, matchExercise, normalizeExerciseName, parseImportCsv, workoutDedupeKey } from "../lib/importers";
const fx = (n: string) => readFileSync(new URL(`./fixtures/${n}`, import.meta.url), "utf8");

test("strong: detect, group, warm-ups, units, skips timed sets", () => {
  const r = parseImportCsv(fx("strong.csv"));
  assert.equal(r.format, "strong");
  assert.equal(r.workouts.length, 2);
  const push = r.workouts[0];
  assert.equal(push.name, "Push Day");
  assert.equal(push.exercises.length, 1);
  assert.deepEqual(push.exercises[0].sets.map((s) => s.type), ["warmup", "normal", "normal"]);
  assert.equal(push.exercises[0].sets[1].rpe, 8);
  assert.equal((+new Date(push.endedAt!) - +new Date(push.startedAt)) / 60000, 65);
  assert.equal(new Date(push.startedAt).getHours(), 18); // local wall time preserved
  assert.equal(r.skippedSets, 1);
});
test("hevy: detect, set types, supersets, end time, skips cardio", () => {
  const r = parseImportCsv(fx("hevy.csv"));
  assert.equal(r.format, "hevy");
  assert.equal(r.workouts.length, 1);
  const w = r.workouts[0];
  assert.equal(w.exercises.length, 2);
  assert.equal(w.exercises[0].sets[0].type, "warmup");
  assert.equal(w.exercises[0].sets[1].weight, 82.5);
  assert.equal(w.exercises[0].sets[1].rpe, 8.5);
  assert.equal(w.exercises[1].supersetId, "hevy-0");
  assert.equal((+new Date(w.endedAt!) - +new Date(w.startedAt)) / 60000, 70);
  assert.equal(r.skippedSets, 1);
});
test("fitnotes: groups by date, converts lbs, names by category", () => {
  const r = parseImportCsv(fx("fitnotes.csv"));
  assert.equal(r.format, "fitnotes");
  assert.equal(r.workouts.length, 2);
  assert.equal(r.workouts[0].name, "Chest + Triceps");
  assert.equal(r.workouts[0].exercises[0].sets[0].weight, 61.23);
  assert.equal(r.workouts[1].name, "Legs + Cardio");
  assert.equal(r.workouts[1].exercises.length, 1);
  assert.equal(r.skippedSets, 1);
});
test("detectFormat rejects unknown headers", () => {
  assert.equal(detectFormat(["foo", "bar"]), null);
  assert.throws(() => parseImportCsv("a,b\n1,2"));
});
test("exercise matching across apps", () => {
  const lib = [{ id: "1", name: "Bench Press (Barbell)" }, { id: "2", name: "Squat (Barbell)" }, { id: "3", name: "Triceps Pushdown (Cable - Rope)" }, { id: "4", name: "Pull Up" }];
  assert.equal(normalizeExerciseName("Flat Barbell Bench Press"), normalizeExerciseName("Bench Press (Barbell)"));
  assert.equal(matchExercise("Flat Barbell Bench Press", lib)?.id, "1");
  assert.equal(matchExercise("Barbell Squat", lib)?.id, "2");
  assert.equal(matchExercise("Pull-ups", lib)?.id, "4");
  assert.equal(matchExercise("Zercher Carry", lib), null);
});
test("dedupe key is minute precision", () => {
  assert.equal(workoutDedupeKey("2026-10-26T13:00:42.000Z"), workoutDedupeKey("2026-10-26T13:00:01Z"));
});
