import { bestOf, countsForStats, e1rm, setPRs, setVolume, type ExerciseBest, type PRKind } from "@/lib/calc";
import type { WorkoutExercise } from "@/lib/db/schema";
type W = { id: string; name?: string; startedAt: Date; exercises: WorkoutExercise[] };
/** Best-so-far per exercise across workouts. */
export function bestsFrom(prior: Pick<W, "exercises">[]) {
  const best = new Map<string, ExerciseBest>();
  for (const p of prior) for (const e of p.exercises) best.set(e.exerciseId, bestOf(e.sets, best.get(e.exerciseId)));
  return best;
}
/** PR badges for `w` against every *other* workout in `all` that started before it (deleted ones simply aren't in `all`). */
export function prsAgainst(all: W[], w: W) {
  const best = bestsFrom(all.filter((p) => p.id !== w.id && +p.startedAt < +w.startedAt));
  // No earlier session of this exercise = baseline (first log), never a PR — same rule as prTimeline.
  return w.exercises.map((e) => { const b = best.get(e.exerciseId); return b && (b.maxWeight || b.maxReps) ? setPRs(e.sets, b) : {}; });
}
export const prCount = (r: ReturnType<typeof prsAgainst>) => r.reduce((a, m) => a + Object.keys(m).length, 0);

export type PREvent = {
  workoutId: string; workoutName: string; date: Date; exerciseId: string; exercise: string; kind: PRKind;
  /** kg for weight/e1rm, kg·reps for volume, reps for reps */ value: number; previous: number;
  set: { weight: number | null; reps: number | null };
};
/** First logged session of an exercise: the baseline later PRs are measured against. Not a PR. */
export type Baseline = {
  workoutId: string; workoutName: string; date: Date; exerciseId: string; exercise: string; isBaseline: true;
  values: Partial<Record<PRKind, { value: number; set: { weight: number | null; reps: number | null } }>>;
};
export type CurrentRecord = { exerciseId: string; exercise: string; maxWeight: number; maxWeightDate: Date | null; bestE1rm: number; bestE1rmDate: Date | null; bestVolume: number; bestVolumeSet: { weight: number; reps: number } | null; bestVolumeDate: Date | null; maxReps: number; prCount: number; lastPR: Date | null };

/** Every PR ever set, newest first, plus current records per exercise. First-ever sessions of an exercise set the baseline and aren't PRs. */
export function prTimeline(workouts: W[]): { events: PREvent[]; current: CurrentRecord[]; baselines: Baseline[] } {
  const sorted = [...workouts].sort((a, b) => +a.startedAt - +b.startedAt);
  const best = new Map<string, ExerciseBest>();
  const cur = new Map<string, CurrentRecord>();
  const events: PREvent[] = [];
  const baselines: Baseline[] = [];
  for (const w of sorted) for (const e of w.exercises) {
    const prior = best.get(e.exerciseId);
    const c = cur.get(e.exerciseId) ?? { exerciseId: e.exerciseId, exercise: e.name, maxWeight: 0, maxWeightDate: null, bestE1rm: 0, bestE1rmDate: null, bestVolume: 0, bestVolumeSet: null, bestVolumeDate: null, maxReps: 0, prCount: 0, lastPR: null };
    c.exercise = e.name || c.exercise;
    for (const s of e.sets.filter(countsForStats)) {
      const wt = s.weight ?? 0, r = s.reps ?? 0, est = e1rm(s.weight, s.reps), v = setVolume(s);
      if (wt > c.maxWeight) { c.maxWeight = wt; c.maxWeightDate = w.startedAt; }
      if (est > c.bestE1rm) { c.bestE1rm = est; c.bestE1rmDate = w.startedAt; }
      if (v > c.bestVolume) { c.bestVolume = v; c.bestVolumeSet = { weight: wt, reps: r }; c.bestVolumeDate = w.startedAt; }
      c.maxReps = Math.max(c.maxReps, r);
    }
    if (!prior || !(prior.maxWeight || prior.maxReps)) {
      const values: Baseline["values"] = {};
      const put = (k: PRKind, v: number, st: { weight: number | null; reps: number | null }) => { if (v > 0 && v > (values[k]?.value ?? 0)) values[k] = { value: v, set: st }; };
      for (const st of e.sets.filter(countsForStats)) {
        const set = { weight: st.weight, reps: st.reps }, wt = st.weight ?? 0;
        if (wt > 0) { put("weight", wt, set); put("e1rm", e1rm(st.weight, st.reps), set); put("volume", setVolume(st), set); }
        else put("reps", st.reps ?? 0, set);
      }
      if (Object.keys(values).length) baselines.push({ workoutId: w.id, workoutName: w.name ?? "", date: w.startedAt, exerciseId: e.exerciseId, exercise: c.exercise, isBaseline: true, values });
    } else {
      const hits = setPRs(e.sets, prior);
      const top = new Map<PRKind, PREvent>();
      for (const [i, kinds] of Object.entries(hits)) {
        const s = e.sets[+i];
        for (const k of kinds) {
          const value = k === "weight" ? s.weight ?? 0 : k === "e1rm" ? e1rm(s.weight, s.reps) : k === "volume" ? setVolume(s) : s.reps ?? 0;
          const previous = k === "weight" ? prior.maxWeight : k === "e1rm" ? prior.bestE1rm : k === "volume" ? prior.bestSetVolume : prior.maxReps;
          if (previous <= 0) continue;
          const t = top.get(k);
          if (!t || value > t.value) top.set(k, { workoutId: w.id, workoutName: w.name ?? "", date: w.startedAt, exerciseId: e.exerciseId, exercise: c.exercise, kind: k, value, previous, set: { weight: s.weight, reps: s.reps } });
        }
      }
      for (const ev of top.values()) { events.push(ev); c.prCount++; c.lastPR = w.startedAt; }
    }
    best.set(e.exerciseId, bestOf(e.sets, prior));
    cur.set(e.exerciseId, c);
  }
  events.sort((a, b) => +b.date - +a.date || a.exercise.localeCompare(b.exercise));
  const current = [...cur.values()].filter((c) => c.maxWeight > 0 || c.maxReps > 0).sort((a, b) => +(b.lastPR ?? 0) - +(a.lastPR ?? 0) || b.bestE1rm - a.bestE1rm);
  baselines.sort((a, b) => +b.date - +a.date || a.exercise.localeCompare(b.exercise));
  return { events, current, baselines };
}
