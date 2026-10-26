// Exercise → muscle-region mapping and per-muscle aggregation (pure; shared by UI + MCP).
import type { WorkoutExercise } from "./db/schema";
import { countsForStats, setVolume } from "./calc";

export const REGIONS = [
  "chest", "deltoids", "trapezius", "upper-back", "lower-back", "biceps", "triceps", "forearm",
  "abs", "obliques", "gluteal", "quadriceps", "hamstring", "adductors", "calves",
] as const;
export type Region = (typeof REGIONS)[number];
export const REGION_NAME: Record<Region, string> = {
  chest: "Chest", deltoids: "Shoulders", trapezius: "Traps", "upper-back": "Lats / Upper back", "lower-back": "Lower back",
  biceps: "Biceps", triceps: "Triceps", forearm: "Forearms", abs: "Abs", obliques: "Obliques", gluteal: "Glutes",
  quadriceps: "Quads", hamstring: "Hamstrings", adductors: "Adductors", calves: "Calves",
};
/** Diagram paths that are drawn but never shaded. Extra diagram muscles fold into a region. */
export const PATH_ALIAS: Record<string, Region> = { serratus: "abs", "hip-flexors": "quadriceps", tibialis: "calves" };

type RMap = { primary: Region[]; secondary: Region[] };
const m = (primary: Region[], secondary: Region[] = []): RMap => ({ primary, secondary });

const BY_MUSCLE: Record<string, RMap> = {
  chest: m(["chest"], ["triceps", "deltoids"]),
  back: m(["upper-back"], ["biceps", "trapezius"]),
  shoulders: m(["deltoids"], ["triceps", "trapezius"]),
  biceps: m(["biceps"], ["forearm"]),
  triceps: m(["triceps"]),
  forearms: m(["forearm"]),
  quads: m(["quadriceps"], ["gluteal", "adductors"]),
  hamstrings: m(["hamstring"], ["gluteal", "lower-back"]),
  glutes: m(["gluteal"], ["hamstring"]),
  calves: m(["calves"]),
  core: m(["abs"], ["obliques"]),
  "full body": m(["quadriceps", "gluteal", "deltoids"], ["trapezius", "hamstring", "upper-back", "abs"]),
  cardio: m([]),
  other: m([]),
};
/** Name-based refinements, checked in order before falling back to the muscle field. */
const BY_NAME: [RegExp, RMap][] = [
  [/shrug/i, m(["trapezius"], ["forearm"])],
  [/deadlift|rack pull|good morning/i, m(["lower-back", "hamstring", "gluteal"], ["trapezius", "forearm", "quadriceps"])],
  [/back extension|hyperextension/i, m(["lower-back"], ["gluteal", "hamstring"])],
  [/face pull|reverse fly|pull apart/i, m(["deltoids"], ["trapezius", "upper-back"])],
  [/upright row/i, m(["deltoids", "trapezius"], ["biceps"])],
  [/lateral raise|front raise/i, m(["deltoids"])],
  [/adduction/i, m(["adductors"])],
  [/abduction|kickback \(?cable|cable kickback/i, m(["gluteal"])],
  [/hip thrust|glute bridge|pull through|swing/i, m(["gluteal"], ["hamstring"])],
  [/leg extension|sissy/i, m(["quadriceps"])],
  [/leg curl|nordic|glute ham/i, m(["hamstring"], ["calves"])],
  [/lunge|split squat|step up/i, m(["quadriceps", "gluteal"], ["adductors", "hamstring"])],
  [/russian twist|woodchop|side plank|bicycle|pallof/i, m(["obliques"], ["abs"])],
  [/close grip bench|dip|jm press|diamond/i, m(["triceps"], ["chest", "deltoids"])],
  [/pullover/i, m(["chest", "upper-back"], ["triceps"])],
  [/pull ?up|chin ?up|pulldown|muscle up/i, m(["upper-back"], ["biceps", "forearm"])],
  [/row/i, m(["upper-back"], ["biceps", "trapezius", "deltoids"])],
  [/hammer|reverse curl|wrist|farmer|dead hang/i, m(["forearm"], ["biceps"])],
  [/calf/i, m(["calves"])],
];
export function regionsFor(name: string, muscle: string | null | undefined): RMap {
  if (muscle && muscle.toLowerCase() !== "cardio") for (const [re, r] of BY_NAME) if (re.test(name)) return r;
  return BY_MUSCLE[(muscle ?? "").toLowerCase()] ?? BY_MUSCLE.other;
}

export type MuscleStat = { region: Region; name: string; sets: number; volume: number; lastTrained: string | null; top: { name: string; sets: number }[] };
export const PERIODS = { "7d": 7, "30d": 30, "90d": 90, all: null } as const;
export type Period = keyof typeof PERIODS;

/** Primary muscles get 1 set per working set, secondaries 0.5. Warm-ups and unticked sets excluded. Volume in kg. */
export function muscleBalance(workouts: { startedAt: Date; exercises: WorkoutExercise[] }[], muscleOf: (exerciseId: string) => string | undefined): MuscleStat[] {
  const acc = new Map<Region, { sets: number; volume: number; last: number; ex: Map<string, number> }>();
  for (const r of REGIONS) acc.set(r, { sets: 0, volume: 0, last: 0, ex: new Map() });
  for (const w of workouts) for (const e of w.exercises) {
    const sets = e.sets.filter(countsForStats);
    if (!sets.length) continue;
    const vol = sets.reduce((a, s) => a + setVolume(s), 0);
    const { primary, secondary } = regionsFor(e.name, muscleOf(e.exerciseId));
    for (const [list, f] of [[primary, 1], [secondary, 0.5]] as const) for (const r of list) {
      const a = acc.get(r)!;
      a.sets += sets.length * f; a.volume += vol * f; a.last = Math.max(a.last, w.startedAt.getTime());
      a.ex.set(e.name, (a.ex.get(e.name) ?? 0) + sets.length * f);
    }
  }
  return REGIONS.map((region) => {
    const a = acc.get(region)!;
    return { region, name: REGION_NAME[region], sets: a.sets, volume: Math.round(a.volume), lastTrained: a.last ? new Date(a.last).toISOString() : null,
      top: [...a.ex].sort((x, y) => y[1] - x[1]).slice(0, 3).map(([name, sets]) => ({ name, sets })) };
  }).sort((x, y) => y.sets - x.sets || y.volume - x.volume);
}

/** 0..4 shade step relative to the most-trained muscle. */
export function level(v: number, max: number) { return v <= 0 || max <= 0 ? 0 : Math.max(1, Math.ceil((v / max) * 4)); }
