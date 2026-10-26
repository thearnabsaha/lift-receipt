import type { WorkoutExercise, WorkoutSet } from "./db/schema";

export const KG_PER_LB = 0.45359237;
export const toDisplay = (kg: number | null | undefined, unit: "kg" | "lb") =>
  kg == null ? null : unit === "kg" ? round(kg, 2) : round(kg / KG_PER_LB, 1);
export const toKg = (v: number | null | undefined, unit: "kg" | "lb") =>
  v == null || !Number.isFinite(v) ? null : unit === "kg" ? round(v, 3) : lbToKg(v);
/**
 * lb → kg that round-trips: picks the coarsest "plate-friendly" kg value (1, 0.5, 0.25, 0.1, 0.05, 0.01 steps)
 * that still displays as the same lb value. So 22.5 kg → 49.6 lb → 22.5 kg (not 22.498).
 */
export function lbToKg(lb: number) {
  const raw = lb * KG_PER_LB, shown = round(lb, 1);
  for (const step of [1, 0.5, 0.25, 0.1, 0.05, 0.01]) {
    const c = round(Math.round(raw / step) * step, 3);
    if (round(c / KG_PER_LB, 1) === shown) return c;
  }
  return round(raw, 3);
}
export const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

/** Epley estimated one-rep max. */
export function e1rm(weight: number | null, reps: number | null) {
  if (!weight || !reps || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export const countsForStats = (s: WorkoutSet) => s.done && s.type !== "warmup";

export function setVolume(s: WorkoutSet) {
  return (s.weight ?? 0) * (s.reps ?? 0);
}

export function workoutVolume(exs: WorkoutExercise[]) {
  return exs.reduce((a, e) => a + e.sets.filter(countsForStats).reduce((b, s) => b + setVolume(s), 0), 0);
}

export function workoutSetCount(exs: WorkoutExercise[]) {
  return exs.reduce((a, e) => a + e.sets.filter(countsForStats).length, 0);
}

export type ExerciseBest = { maxWeight: number; bestE1rm: number; bestSetVolume: number; maxReps: number };
export const emptyBest = (): ExerciseBest => ({ maxWeight: 0, bestE1rm: 0, bestSetVolume: 0, maxReps: 0 });

export function bestOf(sets: WorkoutSet[], base = emptyBest()): ExerciseBest {
  const b = { ...base };
  for (const s of sets.filter(countsForStats)) {
    b.maxWeight = Math.max(b.maxWeight, s.weight ?? 0);
    b.bestE1rm = Math.max(b.bestE1rm, e1rm(s.weight, s.reps));
    b.bestSetVolume = Math.max(b.bestSetVolume, setVolume(s));
    b.maxReps = Math.max(b.maxReps, s.reps ?? 0);
  }
  return b;
}

export type PRKind = "weight" | "e1rm" | "volume" | "reps";
/** Given prior best for an exercise, return PR kinds achieved per set index. */
export function setPRs(sets: WorkoutSet[], prior: ExerciseBest): Record<number, PRKind[]> {
  const out: Record<number, PRKind[]> = {};
  const run = { ...prior };
  sets.forEach((s, i) => {
    if (!countsForStats(s)) return;
    const k: PRKind[] = [];
    const w = s.weight ?? 0, r = s.reps ?? 0, e = e1rm(s.weight, s.reps), v = setVolume(s);
    if (w > 0 && w > run.maxWeight) k.push("weight");
    if (e > 0 && e > run.bestE1rm + 1e-9) k.push("e1rm");
    if (v > 0 && v > run.bestSetVolume) k.push("volume");
    if (w === 0 && r > run.maxReps) k.push("reps");
    run.maxWeight = Math.max(run.maxWeight, w);
    run.bestE1rm = Math.max(run.bestE1rm, e);
    run.bestSetVolume = Math.max(run.bestSetVolume, v);
    run.maxReps = Math.max(run.maxReps, r);
    if (k.length) out[i] = k;
  });
  return out;
}

/** Plates per side for a target load. */
export function plates(target: number, bar: number, available: number[]) {
  let side = (target - bar) / 2;
  const res: number[] = [];
  if (side < 0) return { plates: res, remainder: side * 2 };
  for (const p of [...available].sort((a, b) => b - a)) {
    while (side + 1e-9 >= p) { res.push(p); side -= p; }
  }
  return { plates: res, remainder: round(side * 2, 3) };
}

export function formatDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
}
