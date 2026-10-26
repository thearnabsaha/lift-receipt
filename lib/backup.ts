// Versioned JSON backup + a pure merge planner (no DB), so restore is unit-tested.
import type { WorkoutExercise } from "./db/schema";

export const BACKUP_VERSION = 1;
export type BExercise = { id: string; name: string; muscle: string; equipment: string; instructions: string | null };
export type BRoutine = { id: string; name: string; folder: string | null; notes: string | null; exercises: WorkoutExercise[] };
export type BWorkout = { id: string; name: string; notes: string | null; routineId: string | null; startedAt: string; endedAt: string | null; exercises: WorkoutExercise[] };
export type BMeasurement = { kind: string; value: number; date: string };
export type BSettings = { unit: string; restSec: number; autoRest: boolean; timezoneOverride: string | null };
export type Backup = {
  app: "fortis"; version: number; exportedAt: string;
  exercises: BExercise[]; favorites: string[]; routines: BRoutine[]; workouts: BWorkout[]; measurements: BMeasurement[]; settings: BSettings | null;
};

export function validateBackup(x: unknown): Backup {
  const b = x as Partial<Backup>;
  if (!b || typeof b !== "object" || b.app !== "fortis" || typeof b.version !== "number") throw new Error("Not a Fortis backup file");
  if (b.version > BACKUP_VERSION) throw new Error(`Backup v${b.version} is newer than this app supports (v${BACKUP_VERSION}). Update Fortis first.`);
  for (const k of ["exercises", "favorites", "routines", "workouts", "measurements"] as const) if (!Array.isArray(b[k])) throw new Error(`Backup is missing "${k}"`);
  return { ...(b as Backup), settings: b.settings ?? null };
}

export type Existing = {
  /** all exercises visible to the user (built-ins + custom) */ exercises: { id: string; name: string; userId: string | null }[];
  favorites: string[]; routineNames: string[]; workoutStarts: string[]; measurements: BMeasurement[]; hasSettings: boolean;
};
const minuteKey = (d: string | Date) => new Date(d).toISOString().slice(0, 16);
const mKey = (m: BMeasurement) => `${m.kind}|${minuteKey(m.date)}|${Math.round(m.value * 100)}`;
const nameKey = (s: string) => s.trim().toLowerCase();

/** What restoring `b` into `ex` would add. Never overwrites; ids are freshly minted with `newId`. */
export function planRestore(b: Backup, ex: Existing, newId: () => string) {
  const byId = new Set(ex.exercises.map((e) => e.id));
  const byName = new Map(ex.exercises.map((e) => [nameKey(e.name), e.id]));
  const map = new Map<string, string>(); // backup exercise id → id in this account
  const createExercises: BExercise[] = [];
  for (const e of b.exercises) {
    const hit = byName.get(nameKey(e.name));
    if (hit) { map.set(e.id, hit); continue; }
    const row = { ...e, id: newId() }; createExercises.push(row); map.set(e.id, row.id); byName.set(nameKey(e.name), row.id);
  }
  const remap = (list: WorkoutExercise[]) => list.map((x) => ({ ...x, exerciseId: map.get(x.exerciseId) ?? (byId.has(x.exerciseId) ? x.exerciseId : byName.get(nameKey(x.name)) ?? x.exerciseId) }));
  const unresolved = new Set<string>();
  const knownAfter = new Set([...byId, ...createExercises.map((e) => e.id)]);
  const routineMap = new Map<string, string>();
  const rNames = new Set(ex.routineNames.map(nameKey));
  const routines: BRoutine[] = [];
  for (const r of b.routines) { if (rNames.has(nameKey(r.name))) continue; rNames.add(nameKey(r.name)); const id = newId(); routineMap.set(r.id, id); routines.push({ ...r, id, exercises: remap(r.exercises) }); }
  const starts = new Set(ex.workoutStarts.map(minuteKey));
  const workouts: BWorkout[] = []; let dupWorkouts = 0;
  for (const w of b.workouts) {
    const k = minuteKey(w.startedAt); if (starts.has(k)) { dupWorkouts++; continue; } starts.add(k);
    const exs = remap(w.exercises); exs.forEach((x) => { if (!knownAfter.has(x.exerciseId)) unresolved.add(x.name); });
    workouts.push({ ...w, id: newId(), routineId: w.routineId ? routineMap.get(w.routineId) ?? null : null, exercises: exs });
  }
  const mk = new Set(ex.measurements.map(mKey));
  const measurements = b.measurements.filter((m) => { const k = mKey(m); if (mk.has(k)) return false; mk.add(k); return true; });
  const favSet = new Set(ex.favorites);
  const favorites = [...new Set(b.favorites.map((f) => map.get(f) ?? f))].filter((f) => knownAfter.has(f) && !favSet.has(f));
  return {
    createExercises, routines, workouts, measurements, favorites,
    settings: !ex.hasSettings && b.settings ? b.settings : null,
    /** names in workouts we couldn't map; the server resolves/creates them by name */ unresolved: [...unresolved],
    skipped: { workouts: dupWorkouts, routines: b.routines.length - routines.length, measurements: b.measurements.length - measurements.length, exercises: b.exercises.length - createExercises.length },
  };
}
export type RestorePlan = ReturnType<typeof planRestore>;
