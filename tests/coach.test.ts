import { test } from "node:test";
import assert from "node:assert/strict";
import { suggestNext, isStalled, increment } from "../lib/coach";
import { summarizeWeek, mondayOf, pct } from "../lib/weekly";
import type { WorkoutSet } from "../lib/db/schema";
const S = (w: number, ...reps: number[]): WorkoutSet[] => reps.map((r) => ({ type: "normal", weight: w, reps: r, done: true }));
const day = (d: number) => new Date(Date.UTC(2026, 9, d, 6));
test("double progression adds weight once every set hits the top", () => {
  const r = suggestNext("Squat (Barbell)", [{ date: day(1), sets: S(100, 10, 10, 10) }], { repMax: 10 });
  assert.equal(r.action, "increase_weight"); assert.equal(r.weightKg, 102.5); assert.equal(r.reps, 6);
});
test("otherwise keep weight and add a rep", () => {
  const r = suggestNext("Squat (Barbell)", [{ date: day(1), sets: S(100, 10, 9, 8) }], { repMax: 10 });
  assert.equal(r.action, "add_reps"); assert.equal(r.weightKg, 100); assert.equal(r.reps, 9);
});
test("small lifts use a smaller jump; lb uses 5 lb", () => {
  assert.equal(increment("Bicep Curl (Dumbbell)", "kg"), 1.25);
  const r = suggestNext("Bicep Curl (Dumbbell)", [{ date: day(1), sets: S(10, 12, 12) }]);
  assert.equal(r.weightKg, 11.25);
  assert.ok(Math.abs(increment("Bench Press", "lb") - 2.268) < 0.01);
});
test("stall detection and deload", () => {
  const ss = [S(100, 8), S(100, 8), S(100, 7), S(100, 8)].map((sets, i) => ({ date: day(i + 1), sets }));
  assert.equal(isStalled(ss), true);
  const r = suggestNext("Bench Press (Barbell)", ss);
  assert.equal(r.action, "deload"); assert.equal(r.weightKg, 90);
  assert.equal(isStalled([S(100, 8), S(100, 9)].map((sets, i) => ({ date: day(i), sets }))), false);
});
test("weekly summary maths", () => {
  const mon = mondayOf(day(14)); // Wed 14 Oct 2026 → Mon 12 Oct (IST)
  assert.equal(mon.toISOString(), "2026-10-11T18:30:00.000Z");
  const W = (id: string, d: number, w: number) => ({ id, name: "W", startedAt: day(d), endedAt: new Date(+day(d) + 3600e3), exercises: [{ exerciseId: "bi_bench", name: "Bench Press (Barbell)", sets: S(w, 5, 5) }] });
  const all = [W("a", 6, 100), W("b", 13, 105), W("c", 15, 100)];
  const s = summarizeWeek(all, mon, () => "Chest", new Date(Date.UTC(2026, 10, 1)));
  assert.equal(s.sessions, 2); assert.equal(s.sets, 4); assert.equal(s.volumeKg, 2050); assert.equal(s.minutes, 120);
  assert.equal(s.previous.volumeKg, 1000); assert.equal(s.change.volume, 105);
  assert.ok(s.prs > 0); assert.equal(s.bestLift?.weightKg, 105);
  assert.equal(s.mostTrained[0].name, "Chest"); assert.ok(s.neglected.includes("Quads"));
  assert.match(s.recap, /Last week: 2 sessions, 2,050 kg/);
  assert.equal(pct(5, 0), null);
});
