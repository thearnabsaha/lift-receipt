// Automatic progression (pure; shared by the app, MCP and tests).
// Config lives on the routine exercise JSON (`WorkoutExercise.progression`), so no DB migration.
// Weights are kg internally; increments are stored in the unit they were set in and maths happens in the
// user's display unit, then converted back with the round-tripping lb→kg fix (no 62.4999 noise).
import type { WorkoutExercise, WorkoutSet } from "./db/schema";
import { round, toDisplay, toKg } from "./calc";

export type ProgressionMode = "off" | "double" | "linear";
export type ProgressionConfig = {
  mode: ProgressionMode;
  /** double progression rep range */ repMin?: number; repMax?: number;
  /** linear: target reps on every working set */ reps?: number;
  /** weight added on success, in `unit` */ increment?: number; unit?: "kg" | "lb";
  /** linear: deload after this many consecutive misses at the same weight (0 = never) */ deloadAfter?: number;
  /** linear: deload size in % */ deloadPct?: number;
};
export type Unit = "kg" | "lb";

export const DEFAULTS = { repMin: 8, repMax: 12, reps: 5, deloadAfter: 2, deloadPct: 10 } as const;

/** Sensible jump per equipment, in the user's unit. */
export function defaultIncrement(equipment: string | null | undefined, unit: Unit): number {
  const e = (equipment ?? "").toLowerCase();
  if (e.includes("dumbbell")) return unit === "kg" ? 2 : 5;
  if (e.includes("kettlebell")) return unit === "kg" ? 4 : 10;
  return unit === "kg" ? 2.5 : 5; // barbell, EZ/trap bar, smith, machine, cable, weighted bodyweight
}

/** Normalises (clamps, fills defaults). Returns null when off / missing / garbage, so old routines just work. */
export function normalizeConfig(c: unknown, equipment?: string | null, unit: Unit = "kg"): Required<ProgressionConfig> | null {
  if (!c || typeof c !== "object") return null;
  const x = c as ProgressionConfig;
  if (x.mode !== "double" && x.mode !== "linear") return null;
  const int = (v: unknown, d: number, lo: number, hi: number) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n >= lo ? Math.min(hi, n) : d; };
  let repMin = int(x.repMin, DEFAULTS.repMin, 1, 50), repMax = int(x.repMax, DEFAULTS.repMax, 1, 50);
  if (repMin > repMax) [repMin, repMax] = [repMax, repMin];
  const u: Unit = x.unit === "lb" ? "lb" : x.unit === "kg" ? "kg" : unit;
  const inc = Number(x.increment);
  return {
    mode: x.mode, repMin, repMax, reps: int(x.reps, DEFAULTS.reps, 1, 50),
    increment: Number.isFinite(inc) && inc > 0 && inc <= 50 ? round(inc, 3) : defaultIncrement(equipment, u), unit: u,
    deloadAfter: int(x.deloadAfter, DEFAULTS.deloadAfter, 0, 10), deloadPct: Math.min(50, Math.max(1, Number(x.deloadPct) || DEFAULTS.deloadPct)),
  };
}

/** Increment expressed in the display unit (a 2.5 kg setting shown to a lb user becomes the lb default). */
function incIn(cfg: Required<ProgressionConfig>, unit: Unit, equipment?: string | null) {
  return cfg.unit === unit ? cfg.increment : defaultIncrement(equipment, unit);
}
/** Round to a loadable step in the display unit: 0.25 kg / 0.5 lb (kills float noise). */
const snap = (v: number, unit: Unit) => { const g = unit === "kg" ? 0.25 : 0.5; return round(Math.round(v / g + 1e-9) * g, 2); };

/** Working sets that count: normal, completed, with reps. Warm-up, drop and failure sets are ignored. */
export const workingSets = (sets: WorkoutSet[]) => sets.filter((s) => s.type === "normal" && s.done && (s.reps ?? 0) > 0);

export type Outcome = "first" | "increase" | "hold" | "deload" | "blocked";
export type Suggestion = {
  outcome: Outcome;
  /** kg; null = bodyweight / unknown */ weightKg: number | null;
  /** target reps per working set (template order) */ reps: number[];
  lastWeightKg: number | null; lastReps: number[];
  /** consecutive misses at the current weight including the last session (linear) */ misses: number;
  /** short chip text, e.g. "Progress: +2.5 kg → 62.5 × 8" */ label: string;
  /** one plain-English sentence */ reason: string;
};

const fmt = (n: number) => String(round(n, 2));
const shortReps = (r: number[]) => (r.length && r.every((x) => x === r[0]) ? `${r[0]}` : r.join("/"));

/**
 * Next-session suggestion. `sessions` newest first; each is that exercise's sets in one finished workout.
 * Sessions without a counting working set are skipped. `setCount` = working sets planned next time.
 */
export function suggest(cfgIn: ProgressionConfig | null | undefined, sessions: { sets: WorkoutSet[] }[], o: { unit: Unit; equipment?: string | null; setCount?: number; respectRpe?: boolean }): Suggestion | null {
  const cfg = normalizeConfig(cfgIn, o.equipment, o.unit);
  if (!cfg) return null;
  const unit = o.unit, inc = incIn(cfg, unit, o.equipment), respectRpe = o.respectRpe ?? true;
  const hist = sessions.map((s) => workingSets(s.sets)).filter((w) => w.length);
  const n = Math.max(1, o.setCount ?? hist[0]?.length ?? 3);
  const bottom = cfg.mode === "double" ? cfg.repMin : cfg.reps;
  if (!hist.length) {
    return { outcome: "first", weightKg: null, reps: Array(n).fill(bottom), lastWeightKg: null, lastReps: [], misses: 0,
      label: cfg.mode === "double" ? `First session · aim ${cfg.repMin}–${cfg.repMax} reps` : `First session · aim ${cfg.reps} reps`,
      reason: "No finished session with completed working sets yet. Log this one and the next weight is suggested automatically." };
  }
  const topOf = (w: WorkoutSet[]) => Math.max(...w.map((s) => s.weight ?? 0));
  const ws = hist[0], topKg = topOf(ws), atTop = ws.filter((s) => (s.weight ?? 0) === topKg), lastReps = atTop.map((s) => s.reps ?? 0);
  const topD = toDisplay(topKg, unit) ?? 0, bw = topKg <= 0;
  const rpeMax = respectRpe && atTop.some((s) => (s.rpe ?? 0) >= 10);
  const target = cfg.mode === "double" ? cfg.repMax : cfg.reps;
  const hit = (w: WorkoutSet[]) => { const t = topOf(w); return w.filter((s) => (s.weight ?? 0) === t).every((s) => (s.reps ?? 0) >= target); };
  const base = { lastWeightKg: bw ? null : topKg, lastReps };
  const kg = (d: number) => toKg(d, unit);
  const W = `${fmt(topD)} ${unit}`;

  if (hit(ws)) {
    if (rpeMax) return { ...base, outcome: "blocked", weightKg: bw ? null : topKg, reps: Array(n).fill(target), misses: 0, label: `Hold: last set was RPE 10`, reason: `You hit ${atTop.length}×${target} but at RPE 10. Repeat ${W} until it moves with a rep in reserve.` };
    if (bw) return { ...base, outcome: "hold", weightKg: null, reps: Array(n).fill(target), misses: 0, label: `Top reached: add load or a harder variation`, reason: `Bodyweight: you hit ${atTop.length}×${target}. Add a weight or pick a harder variation.` };
    const next = snap(topD + inc, unit);
    return { ...base, outcome: "increase", weightKg: kg(next), reps: Array(n).fill(bottom), misses: 0,
      label: `Progress: +${fmt(inc)} ${unit} → ${fmt(next)} × ${bottom}`,
      reason: cfg.mode === "double" ? `All working sets hit ${cfg.repMax} reps at ${W}. Add ${fmt(inc)} ${unit} and restart at ${cfg.repMin} reps.` : `All working sets hit ${cfg.reps} reps at ${W}. Add ${fmt(inc)} ${unit}.` };
  }

  if (cfg.mode === "double") {
    // keep the weight; +1 rep on the sets that fell short (sets already at the top stay there)
    const reps = Array.from({ length: n }, (_, i) => { const r = lastReps[i] ?? lastReps.at(-1) ?? cfg.repMin; return Math.min(cfg.repMax, Math.max(cfg.repMin, r + (r >= cfg.repMax ? 0 : 1))); });
    return { ...base, outcome: "hold", weightKg: bw ? null : topKg, reps, misses: 1,
      label: `Hold: hit ${atTop.length}×${cfg.repMax} to add weight`, reason: `Not every set reached ${cfg.repMax} reps${bw ? "" : ` at ${W}`}. Same weight, aim for ${shortReps(reps)} reps.` };
  }

  // linear: count consecutive misses at this weight
  let misses = 0;
  for (const w of hist) { if (topOf(w) !== topKg || hit(w)) break; misses++; }
  if (!bw && cfg.deloadAfter > 0 && misses >= cfg.deloadAfter) {
    let next = snap(Math.round((topD * (1 - cfg.deloadPct / 100)) / inc) * inc, unit);
    if (next >= topD) next = snap(topD - inc, unit);
    next = Math.max(0, next);
    return { ...base, outcome: "deload", weightKg: kg(next), reps: Array(n).fill(cfg.reps), misses,
      label: `Deload −${fmt(cfg.deloadPct)}% → ${fmt(next)} × ${cfg.reps}`, reason: `Missed ${cfg.reps} reps at ${W} ${misses} sessions in a row. Drop ${fmt(cfg.deloadPct)}% and build back up.` };
  }
  return { ...base, outcome: "hold", weightKg: bw ? null : topKg, reps: Array(n).fill(cfg.reps), misses,
    label: `Hold: hit ${n}×${cfg.reps} to add weight`, reason: `Missed ${cfg.reps} reps on a working set${bw ? "" : ` at ${W}`} (${misses} in a row). Same weight again${cfg.deloadAfter ? `; deload after ${cfg.deloadAfter} misses` : ""}.` };
}

/** One line for the routine editor, e.g. "Double 8–12 · +2.5 kg". */
export function describeConfig(c: ProgressionConfig | null | undefined, equipment?: string | null, unit: Unit = "kg") {
  const x = normalizeConfig(c, equipment, unit);
  if (!x) return "Off";
  const inc = `+${fmt(x.increment)} ${x.unit}`;
  return x.mode === "double" ? `Double ${x.repMin}–${x.repMax} · ${inc}` : `Linear ${x.reps} reps · ${inc}${x.deloadAfter ? ` · −${fmt(x.deloadPct)}% after ${x.deloadAfter} misses` : ""}`;
}

/* ---------- applying to a routine ---------- */
export type HistWorkout = { routineId: string | null; endedAt: Date | string | null; startedAt: Date | string; exercises: WorkoutExercise[] };
export type Plan = { slot: number; exerciseId: string; name: string; suggestion: Suggestion };

/**
 * Sessions for a routine slot, newest first: the n-th occurrence of the exercise in finished workouts of that
 * routine; falls back to any finished workout containing the exercise when the routine has none yet.
 */
export function sessionsFor(workouts: HistWorkout[], routineId: string | null, exerciseId: string, occurrence: number, limit = 8) {
  const done = workouts.filter((w) => w.endedAt).sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));
  const pick = (w: HistWorkout, occ: number) => w.exercises.filter((e) => e.exerciseId === exerciseId)[occ] ?? null;
  const has = (e: WorkoutExercise | null) => !!e && workingSets(e.sets).length > 0;
  const fromRoutine = routineId ? done.filter((w) => w.routineId === routineId).map((w) => pick(w, occurrence)).filter(has) : [];
  const list = fromRoutine.length ? fromRoutine : done.map((w) => pick(w, 0)).filter(has);
  return list.slice(0, limit).map((e) => ({ sets: e!.sets }));
}

/** Suggestions for every progression-enabled exercise in a routine. */
export function planRoutine(r: { id: string | null; exercises: WorkoutExercise[] }, workouts: HistWorkout[], o: { unit: Unit; equipment?: Record<string, string> }): Plan[] {
  const seen = new Map<string, number>(); const out: Plan[] = [];
  r.exercises.forEach((e, slot) => {
    const occ = seen.get(e.exerciseId) ?? 0; seen.set(e.exerciseId, occ + 1);
    if (!normalizeConfig(e.progression)) return;
    const setCount = e.sets.filter((s) => s.type === "normal").length || undefined;
    const s = suggest(e.progression, sessionsFor(workouts, r.id, e.exerciseId, occ), { unit: o.unit, equipment: o.equipment?.[e.exerciseId], setCount });
    if (s) out.push({ slot, exerciseId: e.exerciseId, name: e.name, suggestion: s });
  });
  return out;
}

/** Routine exercises with suggested weight × reps written into their normal sets (warm-ups untouched). */
export function applyPlan(exs: WorkoutExercise[], plans: Plan[]): WorkoutExercise[] {
  return exs.map((e, slot) => {
    const p = plans.find((x) => x.slot === slot && x.exerciseId === e.exerciseId)?.suggestion;
    if (!p || p.outcome === "first") return e;
    let k = 0;
    return { ...e, sets: e.sets.map((s) => {
      if (s.type !== "normal") return s;
      const reps = p.reps[k] ?? p.reps.at(-1) ?? s.reps; k++;
      return { ...s, weight: p.weightKg ?? s.weight, reps };
    }) };
  });
}

/** "Next time" after a finished workout: the new suggestion from this session plus earlier history. */
export function nextTime(cfg: ProgressionConfig | null | undefined, current: WorkoutSet[], earlier: { sets: WorkoutSet[] }[], o: { unit: Unit; equipment?: string | null; setCount?: number }) {
  if (!workingSets(current).length) return null;
  return suggest(cfg, [{ sets: current }, ...earlier], o);
}
