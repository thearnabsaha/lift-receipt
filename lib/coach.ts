// Rule-based coaching maths (pure; shared by MCP + tests). All weights in kg.
import type { WorkoutSet } from "./db/schema";
import { e1rm, round, KG_PER_LB } from "./calc";

export type Session = { date: Date; sets: WorkoutSet[] };
export type Suggestion = {
  action: "increase_weight" | "add_reps" | "deload" | "start";
  weightKg: number | null; reps: number; sets: number;
  reason: string; stalled: boolean; lastWeightKg: number | null; lastReps: number[];
};

const working = (s: WorkoutSet[]) => s.filter((x) => x.done && x.type !== "warmup" && (x.reps ?? 0) > 0);
const SMALL = /curl|raise|fly|kickback|extension|pushdown|calf|shrug|face pull|wrist|lateral|rear delt/i;

/** Smallest sensible jump: 2.5 kg / 5 lb for compound lifts, half that for small isolation lifts. */
export function increment(name: string, unit: "kg" | "lb") {
  const small = SMALL.test(name);
  return unit === "kg" ? (small ? 1.25 : 2.5) : (small ? 2.5 : 5) * KG_PER_LB;
}
const snap = (kg: number, unit: "kg" | "lb") =>
  unit === "kg" ? round(Math.round(kg / 1.25) * 1.25, 2) : round(Math.round(kg / KG_PER_LB / 2.5) * 2.5 * KG_PER_LB, 3);

/** Best e1RM per session; stalled when the last `n` sessions never beat the best before them. */
export function isStalled(sessions: Session[], n = 3) {
  const best = sessions.map((s) => Math.max(0, ...working(s.sets).map((x) => e1rm(x.weight, x.reps) || (x.reps ?? 0))));
  if (best.length < n + 1) return false;
  const before = Math.max(...best.slice(0, -n));
  return Math.max(...best.slice(-n)) <= before + 1e-9;
}

/**
 * Double progression. `sessions` oldest→newest. Rep target defaults to 8–12.
 * All working sets at the top weight reached `repMax` → add weight, drop to `repMin`.
 * Otherwise keep the weight and add a rep. Stalled 3+ sessions → deload ~10%.
 */
export function suggestNext(name: string, sessions: Session[], opts: { unit?: "kg" | "lb"; repMin?: number; repMax?: number } = {}): Suggestion {
  const unit = opts.unit ?? "kg", repMax = opts.repMax ?? 12, repMin = Math.min(opts.repMin ?? Math.max(1, repMax - 4), repMax);
  const last = [...sessions].reverse().find((s) => working(s.sets).length);
  if (!last) return { action: "start", weightKg: null, reps: repMin, sets: 3, reason: `No logged sets yet. Start light for ${repMin}–${repMax} reps.`, stalled: false, lastWeightKg: null, lastReps: [] };
  const ws = working(last.sets);
  const top = Math.max(...ws.map((s) => s.weight ?? 0));
  const atTop = ws.filter((s) => (s.weight ?? 0) === top);
  const reps = atTop.map((s) => s.reps ?? 0);
  const base = { sets: atTop.length, lastWeightKg: top || null, lastReps: reps };
  if (isStalled(sessions)) {
    const w = top ? snap(top * 0.9, unit) : null;
    return { ...base, action: "deload", weightKg: w, reps: repMin, stalled: true, reason: `No progress in the last 3 sessions. Deload ~10% for a week, then build back up.` };
  }
  if (top > 0 && reps.every((r) => r >= repMax)) {
    const w = snap(top + increment(name, unit), unit);
    return { ...base, action: "increase_weight", weightKg: w, reps: repMin, stalled: false, reason: `Hit ${atTop.length}×${repMax}+ at this weight. Add weight and restart at ${repMin} reps.` };
  }
  const next = Math.min(repMax, Math.min(...reps) + 1);
  return { ...base, action: "add_reps", weightKg: top || null, reps: next, stalled: false, reason: top ? `Same weight; aim for ${next} reps on every set (top of range is ${repMax}).` : `Bodyweight: add a rep per set.` };
}
