import { bestOf, emptyBest, setPRs, type ExerciseBest } from "@/lib/calc";
import type { WorkoutExercise } from "@/lib/db/schema";
type W = { id: string; startedAt: Date; exercises: WorkoutExercise[] };
/** Best-so-far per exercise across workouts. */
export function bestsFrom(prior: Pick<W, "exercises">[]) {
  const best = new Map<string, ExerciseBest>();
  for (const p of prior) for (const e of p.exercises) best.set(e.exerciseId, bestOf(e.sets, best.get(e.exerciseId)));
  return best;
}
/** PR badges for `w` against every *other* workout in `all` that started before it (deleted ones simply aren't in `all`). */
export function prsAgainst(all: W[], w: W) {
  const best = bestsFrom(all.filter((p) => p.id !== w.id && +p.startedAt < +w.startedAt));
  return w.exercises.map((e) => setPRs(e.sets, best.get(e.exerciseId) ?? emptyBest()));
}
export const prCount = (r: ReturnType<typeof prsAgainst>) => r.reduce((a, m) => a + Object.keys(m).length, 0);
