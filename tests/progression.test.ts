import { test } from "node:test";
import assert from "node:assert/strict";
import { suggest, normalizeConfig, defaultIncrement, describeConfig, sessionsFor, planRoutine, applyPlan, nextTime } from "../lib/progression";
import { toKg, toDisplay } from "../lib/calc";
import type { WorkoutSet, WorkoutExercise } from "../lib/db/schema";

const S = (w: number | null, ...reps: number[]): WorkoutSet[] => reps.map((r) => ({ type: "normal", weight: w, reps: r, done: true }));
const D = { mode: "double", repMin: 8, repMax: 12, increment: 2.5, unit: "kg" } as const;
const L = { mode: "linear", reps: 5, increment: 2.5, unit: "kg", deloadAfter: 2, deloadPct: 10 } as const;
const kg = { unit: "kg" as const, equipment: "Barbell" };

test("off / missing / garbage config → no suggestion (old data loads)", () => {
  assert.equal(suggest(undefined, [{ sets: S(60, 12) }], kg), null);
  assert.equal(suggest({ mode: "off" }, [{ sets: S(60, 12) }], kg), null);
  assert.equal(normalizeConfig("nope"), null);
  assert.equal(describeConfig(undefined), "Off");
});
test("double: all sets at top → +increment, reps reset to bottom", () => {
  const r = suggest(D, [{ sets: S(60, 12, 12, 12) }], kg)!;
  assert.equal(r.outcome, "increase"); assert.equal(r.weightKg, 62.5); assert.deepEqual(r.reps, [8, 8, 8]);
  assert.equal(r.label, "Progress: +2.5 kg → 62.5 × 8");
});
test("double: partial → hold weight, +1 rep only on short sets", () => {
  const r = suggest(D, [{ sets: S(60, 12, 11, 9) }], kg)!;
  assert.equal(r.outcome, "hold"); assert.equal(r.weightKg, 60); assert.deepEqual(r.reps, [12, 12, 10]);
  assert.equal(r.label, "Hold: hit 3×12 to add weight");
});
test("double: above top counts as hit; below bottom clamps to bottom", () => {
  assert.equal(suggest(D, [{ sets: S(60, 15, 13, 12) }], kg)!.outcome, "increase");
  assert.deepEqual(suggest(D, [{ sets: S(60, 5, 4) }], kg)!.reps, [8, 8]);
});
test("rep range edge cases: min>max swapped, min==max behaves like straight sets", () => {
  const c = normalizeConfig({ mode: "double", repMin: 12, repMax: 8 })!; assert.equal(c.repMin, 8); assert.equal(c.repMax, 12);
  const r = suggest({ ...D, repMin: 5, repMax: 5 }, [{ sets: S(100, 5, 5) }], kg)!;
  assert.equal(r.outcome, "increase"); assert.deepEqual(r.reps, [5, 5]);
});
test("warm-ups, drop/failure sets and undone sets are ignored", () => {
  const sets: WorkoutSet[] = [{ type: "warmup", weight: 20, reps: 5, done: true }, ...S(60, 12, 12),
    { type: "drop", weight: 40, reps: 6, done: true }, { type: "failure", weight: 60, reps: 3, done: true }, { type: "normal", weight: 60, reps: 4, done: false }];
  assert.equal(suggest(D, [{ sets }], kg)!.outcome, "increase");
});
test("only warm-ups / skipped sets → skip that session, use the one before", () => {
  const warm: WorkoutSet[] = [{ type: "warmup", weight: 20, reps: 10, done: true }];
  const skipped: WorkoutSet[] = [{ type: "normal", weight: 60, reps: 12, done: false }];
  const r = suggest(D, [{ sets: warm }, { sets: skipped }, { sets: S(55, 12, 12) }], kg)!;
  assert.equal(r.weightKg, 57.5);
});
test("empty history = first session", () => {
  const r = suggest(D, [], { ...kg, setCount: 3 })!;
  assert.equal(r.outcome, "first"); assert.equal(r.weightKg, null); assert.deepEqual(r.reps, [8, 8, 8]);
  assert.equal(suggest(L, [{ sets: [{ type: "warmup", weight: 20, reps: 5, done: true }] }], kg)!.outcome, "first");
});
test("linear: hit → +increment; miss → hold; 2 misses → deload 10%", () => {
  assert.equal(suggest(L, [{ sets: S(100, 5, 5, 5) }], kg)!.weightKg, 102.5);
  const h = suggest(L, [{ sets: S(100, 5, 5, 4) }, { sets: S(97.5, 5, 5, 5) }], kg)!;
  assert.equal(h.outcome, "hold"); assert.equal(h.weightKg, 100); assert.equal(h.misses, 1);
  const d = suggest(L, [{ sets: S(100, 5, 4, 4) }, { sets: S(100, 5, 5, 3) }, { sets: S(97.5, 5, 5, 5) }], kg)!;
  assert.equal(d.outcome, "deload"); assert.equal(d.weightKg, 90); assert.equal(d.label, "Deload −10% → 90 × 5");
});
test("linear: misses reset after a weight change (post-deload) and deloadAfter 0 disables", () => {
  const r = suggest(L, [{ sets: S(90, 4) }, { sets: S(100, 4) }, { sets: S(100, 4) }], kg)!;
  assert.equal(r.outcome, "hold"); assert.equal(r.misses, 1);
  assert.equal(suggest({ ...L, deloadAfter: 0 }, [{ sets: S(100, 4) }, { sets: S(100, 4) }, { sets: S(100, 4) }], kg)!.outcome, "hold");
});
test("deload rounds to increment and always goes down", () => {
  const r = suggest({ ...L, deloadPct: 5, increment: 5 }, [{ sets: S(40, 3) }, { sets: S(40, 3) }], kg)!; // 38 → round 40 → forced 35
  assert.equal(r.weightKg, 35);
  const r2 = suggest({ ...L, deloadPct: 15 }, [{ sets: S(62.5, 3) }, { sets: S(62.5, 3) }], kg)!; // 53.1 → 52.5
  assert.equal(r2.weightKg, 52.5);
});
test("RPE 10 blocks increases (optional)", () => {
  const sets = S(60, 12, 12).map((s, i) => ({ ...s, rpe: i ? 10 : 8 }));
  assert.equal(suggest(D, [{ sets }], kg)!.outcome, "blocked");
  assert.equal(suggest(D, [{ sets }], { ...kg, respectRpe: false })!.outcome, "increase");
});
test("lb user: maths in lb, stored kg round-trips without float noise", () => {
  const w = toKg(135, "lb")!;
  const r = suggest({ ...D, increment: 5, unit: "lb" }, [{ sets: S(w, 12, 12, 12) }], { unit: "lb", equipment: "Barbell" })!;
  assert.equal(toDisplay(r.weightKg, "lb"), 140); assert.equal(r.label, "Progress: +5 lb → 140 × 8");
  assert.equal(r.weightKg, toKg(140, "lb"));
});
test("unit mismatch: kg increment shown to lb user falls back to the lb equipment default", () => {
  const r = suggest(D, [{ sets: S(toKg(100, "lb"), 12, 12) }], { unit: "lb", equipment: "Dumbbell" })!;
  assert.equal(toDisplay(r.weightKg, "lb"), 105);
});
test("rounding: odd values snap to a loadable grid, no 62.4999", () => {
  const r = suggest({ ...D, increment: 1.1 }, [{ sets: S(60.3, 12) }], kg)!;
  assert.equal(r.weightKg, 61.5);
  const l = suggest({ ...D, increment: 2.5, unit: "lb" }, [{ sets: S(toKg(47.3, "lb"), 12) }], { unit: "lb" })!;
  assert.equal(toDisplay(l.weightKg, "lb"), 50);
});
test("equipment default increments", () => {
  assert.equal(defaultIncrement("Barbell", "kg"), 2.5); assert.equal(defaultIncrement("Barbell", "lb"), 5);
  assert.equal(defaultIncrement("Dumbbell", "kg"), 2); assert.equal(defaultIncrement("Dumbbell", "lb"), 5);
  assert.equal(defaultIncrement("Machine", "kg"), 2.5); assert.equal(defaultIncrement("Cable", "kg"), 2.5);
  assert.equal(normalizeConfig({ mode: "double" }, "Dumbbell", "kg")!.increment, 2);
});
test("bodyweight: reps-only progression", () => {
  const r = suggest(D, [{ sets: S(null, 12, 12) }], { unit: "kg", equipment: "Bodyweight" })!;
  assert.equal(r.outcome, "hold"); assert.equal(r.weightKg, null);
  assert.deepEqual(suggest(D, [{ sets: S(null, 10, 9) }], kg)!.reps, [11, 10]);
});
test("set count follows the routine template", () => {
  assert.deepEqual(suggest(D, [{ sets: S(60, 12, 12) }], { ...kg, setCount: 4 })!.reps, [8, 8, 8, 8]);
});
test("describeConfig", () => {
  assert.equal(describeConfig(D), "Double 8–12 · +2.5 kg");
  assert.equal(describeConfig(L), "Linear 5 reps · +2.5 kg · −10% after 2 misses");
});

const ex = (id: string, sets: WorkoutSet[], progression?: any): WorkoutExercise => ({ exerciseId: id, name: id, sets, progression });
const wk = (rid: string | null, d: number, exs: WorkoutExercise[], ended = true) => ({ routineId: rid, startedAt: new Date(2026, 9, d), endedAt: ended ? new Date(2026, 9, d) : null, exercises: exs });
test("history: same routine + slot first, then any workout; unfinished ignored", () => {
  const ws = [wk("r1", 3, [ex("sq", S(70, 12)), ex("sq", S(40, 12))]), wk("r2", 4, [ex("sq", S(99, 1))]), wk("r1", 5, [ex("sq", S(80, 1))], false)];
  assert.equal(sessionsFor(ws, "r1", "sq", 1)[0].sets[0].weight, 40);
  assert.equal(sessionsFor(ws, "r1", "sq", 0)[0].sets[0].weight, 70);
  assert.equal(sessionsFor(ws, "r9", "sq", 0)[0].sets[0].weight, 99);
});
test("planRoutine + applyPlan fill normal sets only and leave warm-ups", () => {
  const tmpl = [ex("sq", [{ type: "warmup", weight: 20, reps: 10, done: false }, ...S(60, 8, 8).map((s) => ({ ...s, done: false }))], D), ex("x", S(10, 10))];
  const plans = planRoutine({ id: "r1", exercises: tmpl }, [wk("r1", 1, [ex("sq", S(60, 12, 12))])], { unit: "kg" });
  assert.equal(plans.length, 1);
  const out = applyPlan(tmpl, plans);
  assert.equal(out[0].sets[0].weight, 20); assert.equal(out[0].sets[1].weight, 62.5); assert.equal(out[0].sets[2].reps, 8);
  assert.equal(out[1], tmpl[1]);
});
test("nextTime uses the session just finished", () => {
  assert.equal(nextTime(D, S(60, 12, 12), [], kg)!.weightKg, 62.5);
  assert.equal(nextTime(D, [], [], kg), null);
});

import { startFromRoutine, dismissProgression, nextTimeList, toPayloadExercises, toEditorExercises } from "../lib/editor";
import { diffRoutine } from "../lib/routine-diff";
test("start: pre-fill linked as auto, template = suggestion (no false 'Update routine?'), dismiss restores", () => {
  const tmpl = [ex("sq", S(60, 8, 8, 8).map((s) => ({ ...s, done: false })), D)];
  const plans = planRoutine({ id: "r1", exercises: tmpl }, [wk("r1", 1, [ex("sq", S(60, 12, 12, 12))])], { unit: "kg" });
  const { exercises, template } = startFromRoutine(tmpl, plans, "kg");
  assert.deepEqual(exercises[0].sets.map((s) => [s.weight, s.reps]), [["62.5", "8"], ["62.5", "8"], ["62.5", "8"]]);
  assert.equal(exercises[0].sets[1].auto?.weight, true);
  assert.equal(exercises[0].prog?.label, "Progress: +2.5 kg → 62.5 × 8");
  const st: any = { unit: "kg", exercises, template: { name: "R", folder: null, notes: null, exercises: template } };
  assert.equal(diffRoutine(st.template.exercises, toPayloadExercises(st, false)).changed, false);
  st.exercises[0].sets[0].done = true;
  dismissProgression(st, 0);
  assert.deepEqual(st.exercises[0].sets.map((s: any) => s.weight), ["62.5", "60", "60"]); // done set kept
  assert.equal(st.template.exercises[0].sets[1].weight, 60);
  assert.equal(st.exercises[0].prog.dismissed, true);
  assert.equal(toPayloadExercises(st, false)[0].progression?.mode, "double");
});
test("start without plans = plain routine; nextTimeList", () => {
  const tmpl = [ex("sq", S(60, 8).map((s) => ({ ...s, done: false })))];
  assert.equal(startFromRoutine(tmpl, undefined, "kg").exercises[0].prog, undefined);
  const st: any = { unit: "kg", exercises: toEditorExercises([ex("sq", S(60, 12, 12), D)], "kg", false) };
  assert.deepEqual(nextTimeList(st, [ex("sq", S(60, 12, 12))]), [{ name: "sq", label: "Progress: +2.5 kg → 62.5 × 8" }]);
});
