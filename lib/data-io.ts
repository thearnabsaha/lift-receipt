import "server-only";
import { randomUUID } from "crypto";
import { eq, isNull, or } from "drizzle-orm";
import { db, schema } from "./db";
import type { WorkoutExercise } from "./db/schema";
import { matchExercise, normalizeExerciseName, workoutDedupeKey, type ImportedWorkout } from "./importers";
import { BACKUP_VERSION, planRestore, validateBackup, type Backup } from "./backup";

const { exercise, routine, workout, measurement, settings, favoriteExercise } = schema;
const visible = (userId: string) => or(isNull(exercise.userId), eq(exercise.userId, userId));
const libFor = (userId: string) => db.select({ id: exercise.id, name: exercise.name, userId: exercise.userId }).from(exercise).where(visible(userId));
const startKeys = async (userId: string) => new Set((await db.select({ s: workout.startedAt }).from(workout).where(eq(workout.userId, userId))).map((r) => workoutDedupeKey(r.s)));
const doneSets = (w: { exercises: WorkoutExercise[] }) => w.exercises.reduce((a, e) => a + e.sets.length, 0);

// ---------- CSV import (Strong / Hevy / FitNotes / Fortis) ----------
export async function previewImport(userId: string, ws: { startedAt: string; names: string[]; sets: number }[]) {
  const [lib, starts] = await Promise.all([libFor(userId), startKeys(userId)]);
  const idx = new Map(lib.map((e) => [normalizeExerciseName(e.name), e]));
  const names = new Set<string>(); let duplicates = 0, workouts = 0, sets = 0; const seen = new Set<string>();
  for (const w of ws) {
    const k = workoutDedupeKey(w.startedAt);
    if (starts.has(k) || seen.has(k)) { duplicates++; continue; }
    seen.add(k); workouts++; sets += w.sets; w.names.forEach((n) => names.add(n));
  }
  const newExercises = [...names].filter((n) => !matchExercise(n, lib, idx)).sort();
  const matched = [...names].filter((n) => !newExercises.includes(n)).map((n) => ({ from: n, to: matchExercise(n, lib, idx)!.name })).filter((m) => m.from !== m.to);
  return { workouts, sets, duplicates, newExercises, matched };
}

export async function importChunk(userId: string, ws: ImportedWorkout[]) {
  if (ws.length > 50) throw new Error("Chunk too large");
  const [lib, starts] = await Promise.all([libFor(userId), startKeys(userId)]);
  const idx = new Map(lib.map((e) => [normalizeExerciseName(e.name), e]));
  const cache = new Map<string, { id: string; name: string }>();
  const resolve = async (name: string) => {
    const k = name.trim().toLowerCase(); const c = cache.get(k); if (c) return c;
    let e: { id: string; name: string } | null = matchExercise(name, lib, idx);
    if (!e) {
      e = { id: randomUUID(), name: name.trim().slice(0, 120) };
      await db.insert(exercise).values({ id: e.id, userId, name: e.name, muscle: "Other", equipment: "Other", instructions: null });
      const row = { ...e, userId }; lib.push(row); idx.set(normalizeExerciseName(e.name), row);
    }
    cache.set(k, e); return e;
  };
  const rows = []; let skipped = 0, sets = 0;
  for (const w of ws) {
    const key = workoutDedupeKey(w.startedAt);
    if (starts.has(key)) { skipped++; continue; }
    starts.add(key);
    const exs: WorkoutExercise[] = [];
    for (const e of w.exercises) { const m = await resolve(e.name); exs.push({ ...e, exerciseId: m.id, name: m.name, sets: e.sets.map((s) => ({ type: s.type, weight: s.weight ?? null, reps: s.reps ?? null, rpe: s.rpe ?? null, done: true })) }); }
    sets += doneSets({ exercises: exs });
    rows.push({ id: randomUUID(), userId, name: (w.name || "Workout").slice(0, 120), notes: w.notes, routineId: null, startedAt: new Date(w.startedAt), endedAt: w.endedAt ? new Date(w.endedAt) : null, exercises: exs });
  }
  if (rows.length) await db.insert(workout).values(rows);
  return { imported: rows.length, skipped, sets };
}

// ---------- JSON backup ----------
export async function exportBackup(userId: string): Promise<Backup> {
  const [ex, favs, rs, ws, ms, [st]] = await Promise.all([
    db.select().from(exercise).where(eq(exercise.userId, userId)),
    db.select({ id: favoriteExercise.exerciseId }).from(favoriteExercise).where(eq(favoriteExercise.userId, userId)),
    db.select().from(routine).where(eq(routine.userId, userId)),
    db.select().from(workout).where(eq(workout.userId, userId)).orderBy(workout.startedAt),
    db.select().from(measurement).where(eq(measurement.userId, userId)).orderBy(measurement.date),
    db.select().from(settings).where(eq(settings.userId, userId)),
  ]);
  return {
    app: "fortis", version: BACKUP_VERSION, exportedAt: new Date().toISOString(),
    exercises: ex.map((e) => ({ id: e.id, name: e.name, muscle: e.muscle, equipment: e.equipment, instructions: e.instructions })),
    favorites: favs.map((f) => f.id),
    routines: rs.map((r) => ({ id: r.id, name: r.name, folder: r.folder, notes: r.notes, exercises: r.exercises })),
    workouts: ws.map((w) => ({ id: w.id, name: w.name, notes: w.notes, routineId: w.routineId, startedAt: w.startedAt.toISOString(), endedAt: w.endedAt?.toISOString() ?? null, exercises: w.exercises })),
    measurements: ms.map((m) => ({ kind: m.kind, value: m.value, date: m.date.toISOString() })),
    settings: st ? { unit: st.unit, restSec: st.restSec, autoRest: st.autoRest, timezoneOverride: st.timezoneOverride } : null,
  };
}

async function existing(userId: string) {
  const [lib, favs, rs, ws, ms, st] = await Promise.all([
    libFor(userId),
    db.select({ id: favoriteExercise.exerciseId }).from(favoriteExercise).where(eq(favoriteExercise.userId, userId)),
    db.select({ name: routine.name }).from(routine).where(eq(routine.userId, userId)),
    db.select({ s: workout.startedAt }).from(workout).where(eq(workout.userId, userId)),
    db.select({ kind: measurement.kind, value: measurement.value, date: measurement.date }).from(measurement).where(eq(measurement.userId, userId)),
    db.select({ u: settings.userId }).from(settings).where(eq(settings.userId, userId)),
  ]);
  return { exercises: lib, favorites: favs.map((f) => f.id), routineNames: rs.map((r) => r.name), workoutStarts: ws.map((w) => w.s.toISOString()), measurements: ms.map((m) => ({ ...m, date: m.date.toISOString() })), hasSettings: st.length > 0 };
}

/** Dry run. The client sends workouts without their exercises to keep the request small. */
export async function previewRestore(userId: string, raw: unknown) {
  const b = validateBackup(raw);
  const p = planRestore(b, await existing(userId), randomUUID);
  return { exportedAt: b.exportedAt, workouts: p.workouts.length, routines: p.routines.length, exercises: p.createExercises.length, measurements: p.measurements.length, favorites: p.favorites.length, settings: !!p.settings, skipped: p.skipped };
}

/** Merge one chunk. Safe to call repeatedly: everything already present is skipped. */
export async function restoreChunk(userId: string, raw: unknown) {
  const b = validateBackup(raw);
  if (b.workouts.length > 50) throw new Error("Chunk too large");
  const p = planRestore(b, await existing(userId), randomUUID);
  if (p.createExercises.length) await db.insert(exercise).values(p.createExercises.map((e) => ({ ...e, userId, name: e.name.slice(0, 120) })));
  // names we couldn't map (e.g. a built-in that was renamed): create as custom
  const fix = new Map<string, string>();
  for (const n of p.unresolved) { const id = randomUUID(); await db.insert(exercise).values({ id, userId, name: n.slice(0, 120) || "Exercise", muscle: "Other", equipment: "Other" }); fix.set(n, id); }
  const known = new Set((await libFor(userId)).map((e) => e.id));
  const fx = (l: WorkoutExercise[]) => l.map((e) => (known.has(e.exerciseId) ? e : { ...e, exerciseId: fix.get(e.name) ?? e.exerciseId }));
  if (p.routines.length) await db.insert(routine).values(p.routines.map((r) => ({ ...r, userId, exercises: fx(r.exercises) })));
  if (p.workouts.length) await db.insert(workout).values(p.workouts.map((w) => ({ ...w, userId, startedAt: new Date(w.startedAt), endedAt: w.endedAt ? new Date(w.endedAt) : null, exercises: fx(w.exercises) })));
  if (p.measurements.length) await db.insert(measurement).values(p.measurements.map((m) => ({ id: randomUUID(), userId, kind: m.kind, value: m.value, date: new Date(m.date) })));
  if (p.favorites.length) await db.insert(favoriteExercise).values(p.favorites.map((exerciseId) => ({ userId, exerciseId }))).onConflictDoNothing();
  if (p.settings) await db.insert(settings).values({ userId, unit: p.settings.unit === "lb" ? "lb" : "kg", restSec: p.settings.restSec, autoRest: p.settings.autoRest, timezoneOverride: p.settings.timezoneOverride }).onConflictDoNothing();
  return { workouts: p.workouts.length, routines: p.routines.length, exercises: p.createExercises.length + fix.size, measurements: p.measurements.length };
}
