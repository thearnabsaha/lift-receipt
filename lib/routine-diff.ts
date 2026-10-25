import type { WorkoutExercise } from "@/lib/db/schema";
// Compare a routine template with what was actually done (both in kg).
export type RoutineDiff = { added: number; removed: number; reordered: boolean; setsAdded: number; setsRemoved: number; weights: number; reps: number; types: number; changed: boolean };
const same = (a: number | null | undefined, b: number | null | undefined) => (a ?? null) === (b ?? null) || (a != null && b != null && Math.abs(a - b) < 0.01);

export function diffRoutine(tpl: WorkoutExercise[], act: WorkoutExercise[]): RoutineDiff {
  const tIds = tpl.map((e) => e.exerciseId), aIds = act.map((e) => e.exerciseId);
  const count = (arr: string[]) => arr.reduce((m, id) => m.set(id, (m.get(id) ?? 0) + 1), new Map<string, number>());
  const tc = count(tIds), ac = count(aIds);
  let added = 0, removed = 0;
  for (const [id, n] of ac) added += Math.max(0, n - (tc.get(id) ?? 0));
  for (const [id, n] of tc) removed += Math.max(0, n - (ac.get(id) ?? 0));
  const common = aIds.filter((id) => tc.has(id)); const commonT = tIds.filter((id) => ac.has(id));
  const reordered = common.join("|") !== commonT.join("|");
  let setsAdded = 0, setsRemoved = 0, weights = 0, reps = 0, types = 0;
  for (const [a, t] of pairs(tpl, act)) {
    setsAdded += Math.max(0, a.sets.length - t.sets.length); setsRemoved += Math.max(0, t.sets.length - a.sets.length);
    for (let i = 0; i < Math.min(a.sets.length, t.sets.length); i++) {
      if (!same(a.sets[i].weight, t.sets[i].weight)) weights++;
      if (!same(a.sets[i].reps, t.sets[i].reps)) reps++;
      if (a.sets[i].type !== t.sets[i].type) types++;
    }
  }
  return { added, removed, reordered, setsAdded, setsRemoved, weights, reps, types, changed: !!(added || removed || reordered || setsAdded || setsRemoved || weights || reps || types) };
}

/** Pairs actual exercises with template exercises by exerciseId (n-th occurrence matches n-th occurrence). */
function pairs(tpl: WorkoutExercise[], act: WorkoutExercise[]): [WorkoutExercise, WorkoutExercise][] {
  const used = new Set<number>(); const out: [WorkoutExercise, WorkoutExercise][] = [];
  for (const a of act) { const i = tpl.findIndex((t, j) => !used.has(j) && t.exerciseId === a.exerciseId); if (i >= 0) { used.add(i); out.push([a, tpl[i]]); } }
  return out;
}

/** "Save values only": keep the template's exercises/sets, copy weight/reps from matching exercise+set index. */
export function applyValuesOnly(tpl: WorkoutExercise[], act: WorkoutExercise[]): WorkoutExercise[] {
  const out = structuredClone(tpl); const used = new Set<number>();
  for (const t of out) {
    const i = act.findIndex((a, j) => !used.has(j) && a.exerciseId === t.exerciseId); if (i < 0) continue; used.add(i);
    t.sets.forEach((s, k) => { const a = act[i].sets[k]; if (a) { s.weight = a.weight; s.reps = a.reps; } });
  }
  return out;
}

/** "Save everything": the routine becomes this workout (structure + values), sets reset to not done. */
export const applyEverything = (act: WorkoutExercise[]): WorkoutExercise[] => act.map((e) => ({ ...e, sets: e.sets.map((s) => ({ ...s, done: false })) }));

export function summarize(d: RoutineDiff): string[] {
  const p = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const out: string[] = [];
  if (d.added) out.push(`+${p(d.added, "exercise")}`);
  if (d.removed) out.push(`−${p(d.removed, "exercise")}`);
  if (d.reordered) out.push("exercises reordered");
  if (d.setsAdded) out.push(`+${p(d.setsAdded, "set")}`);
  if (d.setsRemoved) out.push(`−${p(d.setsRemoved, "set")}`);
  if (d.weights) out.push(`${p(d.weights, "weight")} changed`);
  if (d.reps) out.push(`${d.reps} rep value${d.reps === 1 ? "" : "s"} changed`);
  if (d.types) out.push(`${p(d.types, "set type")} changed`);
  return out;
}
