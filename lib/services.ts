import { cache } from "react";
import "server-only";
import { and, asc, desc, eq, gte, ilike, isNull, lte, or, sql } from "drizzle-orm";
import { createHash, randomBytes, randomUUID } from "crypto";
import { z } from "zod";
import { db, schema } from "./db";
import type { WorkoutExercise } from "./db/schema";
import { prsAgainst } from "./prs";
import { bestOf, e1rm, round, workoutSetCount, workoutVolume, countsForStats, setVolume } from "./calc";

const { exercise, routine, workout, measurement, settings, apiKey } = schema;
const id = () => randomUUID();

// ---------- zod shapes (shared by UI actions + MCP) ----------
export const setSchema = z.object({
  type: z.enum(["warmup", "normal", "drop", "failure"]).default("normal"),
  weight: z.number().nullable().default(null),
  reps: z.number().int().nullable().default(null),
  rpe: z.number().min(1).max(10).nullable().optional(),
  done: z.boolean().default(true),
});
export const workoutExerciseSchema = z.object({
  exerciseId: z.string(),
  name: z.string().default(""),
  notes: z.string().optional(),
  supersetId: z.string().nullable().optional(),
  restSec: z.number().int().nullable().optional(),
  sets: z.array(setSchema).default([]),
});
export const workoutInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(120),
  notes: z.string().nullable().optional(),
  routineId: z.string().nullable().optional(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().nullable().optional(),
  exercises: z.array(workoutExerciseSchema),
});
export type WorkoutInput = z.infer<typeof workoutInputSchema>;
export const routineInputSchema = z.object({
  name: z.string().min(1).max(120),
  folder: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  exercises: z.array(workoutExerciseSchema),
});

// ---------- settings ----------
/** Deduped per request: the app layout and the page both need it. */
export const getSettings = cache(async (userId: string) => {
  const [s] = await db.select().from(settings).where(eq(settings.userId, userId));
  return s ?? { userId, unit: "kg", restSec: 120, autoRest: true };
});
export async function updateSettings(userId: string, patch: Partial<{ unit: string; restSec: number; autoRest: boolean }>) {
  const cur = await getSettings(userId);
  const next = { ...cur, ...patch, userId };
  await db.insert(settings).values(next).onConflictDoUpdate({ target: settings.userId, set: { unit: next.unit, restSec: next.restSec, autoRest: next.autoRest } });
  return next;
}

// ---------- exercises ----------
const visible = (userId: string) => or(isNull(exercise.userId), eq(exercise.userId, userId));

export async function listExercises(userId: string, f: { q?: string; muscle?: string; equipment?: string } = {}) {
  const conds = [visible(userId)];
  if (f.q) conds.push(ilike(exercise.name, `%${f.q}%`));
  if (f.muscle) conds.push(eq(exercise.muscle, f.muscle));
  if (f.equipment) conds.push(eq(exercise.equipment, f.equipment));
  return db.select().from(exercise).where(and(...conds)).orderBy(asc(exercise.name));
}
export async function getExercise(userId: string, exerciseId: string) {
  const [e] = await db.select().from(exercise).where(and(eq(exercise.id, exerciseId), visible(userId)));
  return e ?? null;
}
export async function createExercise(userId: string, d: { name: string; muscle: string; equipment: string; instructions?: string | null }) {
  const row = { id: id(), userId, name: d.name.trim(), muscle: d.muscle, equipment: d.equipment, instructions: d.instructions ?? null };
  await db.insert(exercise).values(row);
  return row;
}
export async function deleteExercise(userId: string, exerciseId: string) {
  await db.delete(exercise).where(and(eq(exercise.id, exerciseId), eq(exercise.userId, userId)));
}
/** Resolve by id, or by (case-insensitive) name; optionally create a custom exercise. */
export async function resolveExercise(userId: string, ref: { exerciseId?: string; name?: string }, create = true) {
  if (ref.exerciseId) {
    const e = await getExercise(userId, ref.exerciseId);
    if (e) return e;
  }
  if (ref.name) {
    const [e] = await db.select().from(exercise).where(and(visible(userId), ilike(exercise.name, ref.name.trim()))).limit(1);
    if (e) return e;
    const [fuzzy] = await db.select().from(exercise).where(and(visible(userId), ilike(exercise.name, `${ref.name.trim()}%`))).orderBy(asc(sql`length(${exercise.name})`)).limit(1);
    if (fuzzy) return fuzzy;
    if (create) return createExercise(userId, { name: ref.name, muscle: "Other", equipment: "Other" });
  }
  throw new Error(`Exercise not found: ${ref.exerciseId ?? ref.name}`);
}

async function normalizeExercises(userId: string, exs: WorkoutExercise[]) {
  const out: WorkoutExercise[] = [];
  for (const e of exs) {
    const ex = await resolveExercise(userId, { exerciseId: e.exerciseId, name: e.name }, true);
    out.push({ ...e, exerciseId: ex.id, name: ex.name });
  }
  return out;
}

// ---------- routines ----------
export async function listRoutines(userId: string) {
  return db.select().from(routine).where(eq(routine.userId, userId)).orderBy(asc(routine.folder), asc(routine.name));
}
export async function getRoutine(userId: string, routineId: string) {
  const [r] = await db.select().from(routine).where(and(eq(routine.id, routineId), eq(routine.userId, userId)));
  return r ?? null;
}
export async function createRoutine(userId: string, input: z.input<typeof routineInputSchema>) {
  const d = routineInputSchema.parse(input);
  const row = { id: id(), userId, name: d.name, folder: d.folder ?? null, notes: d.notes ?? null, exercises: await normalizeExercises(userId, d.exercises as WorkoutExercise[]) };
  await db.insert(routine).values(row);
  return row;
}
export async function updateRoutine(userId: string, routineId: string, input: z.input<typeof routineInputSchema>) {
  const d = routineInputSchema.parse(input);
  await db.update(routine).set({ name: d.name, folder: d.folder ?? null, notes: d.notes ?? null, exercises: await normalizeExercises(userId, d.exercises as WorkoutExercise[]), updatedAt: new Date() })
    .where(and(eq(routine.id, routineId), eq(routine.userId, userId)));
  return getRoutine(userId, routineId);
}
export async function deleteRoutine(userId: string, routineId: string) {
  await db.delete(routine).where(and(eq(routine.id, routineId), eq(routine.userId, userId)));
}

// ---------- workouts ----------
export async function listWorkouts(userId: string, f: { from?: Date; to?: Date; limit?: number } = {}) {
  const conds = [eq(workout.userId, userId)];
  if (f.from) conds.push(gte(workout.startedAt, f.from));
  if (f.to) conds.push(lte(workout.startedAt, f.to));
  return db.select().from(workout).where(and(...conds)).orderBy(desc(workout.startedAt)).limit(f.limit ?? 500);
}
export async function getWorkout(userId: string, workoutId: string) {
  const [w] = await db.select().from(workout).where(and(eq(workout.id, workoutId), eq(workout.userId, userId)));
  return w ?? null;
}
/** Create or replace a workout (idempotent on id, used by offline sync). */
export async function saveWorkout(userId: string, input: z.input<typeof workoutInputSchema>) {
  const d = workoutInputSchema.parse(input);
  const exs = await normalizeExercises(userId, d.exercises as WorkoutExercise[]);
  const row = { id: d.id ?? id(), userId, name: d.name, notes: d.notes ?? null, routineId: d.routineId ?? null, startedAt: d.startedAt, endedAt: d.endedAt ?? null, exercises: exs };
  if (d.id) {
    const existing = await db.select({ userId: workout.userId }).from(workout).where(eq(workout.id, d.id));
    if (existing[0] && existing[0].userId !== userId) throw new Error("Not found");
  }
  await db.insert(workout).values(row).onConflictDoUpdate({
    target: workout.id,
    set: { name: row.name, notes: row.notes, routineId: row.routineId, startedAt: row.startedAt, endedAt: row.endedAt, exercises: row.exercises },
  });
  return row;
}
export async function deleteWorkout(userId: string, workoutId: string) {
  const r = await db.delete(workout).where(and(eq(workout.id, workoutId), eq(workout.userId, userId))).returning({ id: workout.id });
  return r.length > 0;
}
export async function addSet(userId: string, workoutId: string, ref: { exerciseId?: string; name?: string }, set: z.input<typeof setSchema>) {
  const w = await getWorkout(userId, workoutId);
  if (!w) throw new Error("Workout not found");
  const ex = await resolveExercise(userId, ref, true);
  const exs = [...w.exercises];
  let we = exs.find((e) => e.exerciseId === ex.id);
  if (!we) { we = { exerciseId: ex.id, name: ex.name, sets: [] }; exs.push(we); }
  we.sets.push(setSchema.parse(set));
  await db.update(workout).set({ exercises: exs }).where(eq(workout.id, workoutId));
  return { ...w, exercises: exs };
}
export async function finishWorkout(userId: string, workoutId: string, endedAt = new Date()) {
  await db.update(workout).set({ endedAt }).where(and(eq(workout.id, workoutId), eq(workout.userId, userId)));
  return getWorkout(userId, workoutId);
}

/** PR badges for a workout compared with everything before it. */
export async function workoutPRs(userId: string, w: { id: string; startedAt: Date; exercises: WorkoutExercise[] }) {
  const prior = await db.select().from(workout).where(and(eq(workout.userId, userId), sql`${workout.startedAt} < ${w.startedAt.toISOString()}`));
  return prsAgainst(prior, w);
}

export function summarizeWorkout(w: typeof workout.$inferSelect) {
  return {
    id: w.id, name: w.name, startedAt: w.startedAt, endedAt: w.endedAt,
    durationMin: w.endedAt ? Math.round((+w.endedAt - +w.startedAt) / 60000) : null,
    exercises: w.exercises.map((e) => ({ name: e.name, sets: e.sets.filter(countsForStats).length })),
    volumeKg: round(workoutVolume(w.exercises), 1), sets: workoutSetCount(w.exercises),
  };
}

// ---------- analytics ----------
export async function exerciseHistory(userId: string, exerciseId: string) {
  const all = await db.select().from(workout).where(and(eq(workout.userId, userId), sql`${workout.exercises} @> ${JSON.stringify([{ exerciseId }])}::jsonb`)).orderBy(asc(workout.startedAt));
  return all.map((w) => {
    const sets = w.exercises.filter((e) => e.exerciseId === exerciseId).flatMap((e) => e.sets);
    const b = bestOf(sets);
    return {
      workoutId: w.id, workoutName: w.name, date: w.startedAt, sets,
      maxWeight: b.maxWeight, bestE1rm: round(b.bestE1rm, 1),
      volume: round(sets.filter(countsForStats).reduce((a, s) => a + setVolume(s), 0), 1), maxReps: b.maxReps,
    };
  });
}

export async function personalRecords(userId: string, exerciseId?: string) {
  const all = await db.select().from(workout).where(eq(workout.userId, userId)).orderBy(asc(workout.startedAt));
  const recs = new Map<string, { exerciseId: string; name: string; maxWeight: number; maxWeightDate?: Date; bestE1rm: number; bestE1rmDate?: Date; bestSetVolume: number; maxReps: number; repMaxes: Record<number, number> }>();
  for (const w of all) for (const e of w.exercises) {
    if (exerciseId && e.exerciseId !== exerciseId) continue;
    const r = recs.get(e.exerciseId) ?? { exerciseId: e.exerciseId, name: e.name, maxWeight: 0, bestE1rm: 0, bestSetVolume: 0, maxReps: 0, repMaxes: {} };
    for (const s of e.sets.filter(countsForStats)) {
      const wt = s.weight ?? 0, reps = s.reps ?? 0;
      if (wt > r.maxWeight) { r.maxWeight = wt; r.maxWeightDate = w.startedAt; }
      const est = e1rm(wt, reps);
      if (est > r.bestE1rm) { r.bestE1rm = round(est, 1); r.bestE1rmDate = w.startedAt; }
      r.bestSetVolume = Math.max(r.bestSetVolume, wt * reps);
      r.maxReps = Math.max(r.maxReps, reps);
      if (reps >= 1 && reps <= 12) r.repMaxes[reps] = Math.max(r.repMaxes[reps] ?? 0, wt);
    }
    recs.set(e.exerciseId, r);
  }
  return [...recs.values()].sort((a, b) => b.bestE1rm - a.bestE1rm);
}

const weekStart = (d: Date) => { const x = new Date(d); const day = (x.getUTCDay() + 6) % 7; x.setUTCHours(0, 0, 0, 0); x.setUTCDate(x.getUTCDate() - day); return x; };

export async function progressSummary(userId: string, weeks = 12) {
  const from = weekStart(new Date(Date.now() - (weeks - 1) * 7 * 864e5));
  const all = await listWorkouts(userId, { from, limit: 2000 });
  const buckets = new Map<string, { week: string; workouts: number; volumeKg: number; sets: number; durationMin: number }>();
  for (let i = 0; i < weeks; i++) { const k = new Date(+from + i * 7 * 864e5).toISOString().slice(0, 10); buckets.set(k, { week: k, workouts: 0, volumeKg: 0, sets: 0, durationMin: 0 }); }
  for (const w of all) {
    const b = buckets.get(weekStart(w.startedAt).toISOString().slice(0, 10)); if (!b) continue;
    b.workouts++; b.volumeKg = round(b.volumeKg + workoutVolume(w.exercises), 1); b.sets += workoutSetCount(w.exercises);
    if (w.endedAt) b.durationMin += Math.round((+w.endedAt - +w.startedAt) / 60000);
  }
  return [...buckets.values()];
}

export async function workoutCount(userId: string) {
  const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(workout).where(eq(workout.userId, userId));
  return Number(r?.n ?? 0);
}

export async function getStats(userId: string) {
  const all = await listWorkouts(userId, { limit: 5000 });
  const totalVolume = all.reduce((a, w) => a + workoutVolume(w.exercises), 0);
  const totalSets = all.reduce((a, w) => a + workoutSetCount(w.exercises), 0);
  const totalMin = all.reduce((a, w) => a + (w.endedAt ? (+w.endedAt - +w.startedAt) / 60000 : 0), 0);
  const freq = new Map<string, { name: string; count: number }>();
  for (const w of all) for (const e of w.exercises) { const f = freq.get(e.exerciseId) ?? { name: e.name, count: 0 }; f.count++; freq.set(e.exerciseId, f); }
  // weekly streak: consecutive weeks (ending this or last week) with >= 1 workout
  const weeksSet = new Set(all.map((w) => weekStart(w.startedAt).getTime()));
  let streak = 0; let cur = weekStart(new Date()).getTime();
  if (!weeksSet.has(cur)) cur -= 7 * 864e5;
  while (weeksSet.has(cur)) { streak++; cur -= 7 * 864e5; }
  const thisWeek = all.filter((w) => weekStart(w.startedAt).getTime() === weekStart(new Date()).getTime()).length;
  return {
    totalWorkouts: all.length, totalVolumeKg: Math.round(totalVolume), totalSets, totalHours: round(totalMin / 60, 1),
    weekStreak: streak, workoutsThisWeek: thisWeek, lastWorkout: all[0] ? { id: all[0].id, name: all[0].name, date: all[0].startedAt } : null,
    topExercises: [...freq.values()].sort((a, b) => b.count - a.count).slice(0, 5),
  };
}

// ---------- measurements ----------
export const MEASUREMENT_KINDS = ["bodyweight", "bodyfat", "neck", "shoulders", "chest", "waist", "hips", "left_arm", "right_arm", "left_thigh", "right_thigh", "calves"] as const;
export async function logMeasurement(userId: string, d: { kind: string; value: number; date?: Date }) {
  const row = { id: id(), userId, kind: d.kind, value: d.value, date: d.date ?? new Date() };
  await db.insert(measurement).values(row);
  return row;
}
export async function listMeasurements(userId: string, kind?: string) {
  const conds = [eq(measurement.userId, userId)];
  if (kind) conds.push(eq(measurement.kind, kind));
  return db.select().from(measurement).where(and(...conds)).orderBy(desc(measurement.date));
}
export async function deleteMeasurement(userId: string, mid: string) {
  await db.delete(measurement).where(and(eq(measurement.id, mid), eq(measurement.userId, userId)));
}

// ---------- API keys ----------
const hashKey = (raw: string) => createHash("sha256").update(raw).digest("hex");
export async function createApiKey(userId: string, name: string) {
  const raw = "lr_" + randomBytes(24).toString("base64url");
  const row = { id: id(), userId, name: name || "Grok Bot", prefix: raw.slice(0, 8), hash: hashKey(raw) };
  await db.insert(apiKey).values(row);
  return { ...row, key: raw };
}
export async function listApiKeys(userId: string) {
  return db.select({ id: apiKey.id, name: apiKey.name, prefix: apiKey.prefix, createdAt: apiKey.createdAt, lastUsedAt: apiKey.lastUsedAt, revokedAt: apiKey.revokedAt })
    .from(apiKey).where(eq(apiKey.userId, userId)).orderBy(desc(apiKey.createdAt));
}
export async function revokeApiKey(userId: string, keyId: string) {
  await db.update(apiKey).set({ revokedAt: new Date() }).where(and(eq(apiKey.id, keyId), eq(apiKey.userId, userId)));
}
export async function verifyApiKey(raw: string) {
  const [k] = await db.select().from(apiKey).where(and(eq(apiKey.hash, hashKey(raw)), isNull(apiKey.revokedAt)));
  if (!k) return null;
  await db.update(apiKey).set({ lastUsedAt: new Date() }).where(eq(apiKey.id, k.id));
  return k.userId;
}

/** Most recent completed sets per exercise ("Previous" column). */
export async function lastPerformance(userId: string) {
  const recent = await listWorkouts(userId, { limit: 150 });
  const map: Record<string, { weight: number | null; reps: number | null; type: WorkoutExercise["sets"][number]["type"] }[]> = {};
  for (const w of recent) for (const e of w.exercises) {
    if (map[e.exerciseId]) continue;
    const sets = e.sets.filter((s) => s.done).map((s) => ({ weight: s.weight, reps: s.reps, type: s.type }));
    if (sets.length) map[e.exerciseId] = sets;
  }
  return map;
}

export async function exerciseLite(userId: string) {
  return (await listExercises(userId)).map((e) => ({ id: e.id, name: e.name, muscle: e.muscle, equipment: e.equipment, userId: e.userId }));
}
