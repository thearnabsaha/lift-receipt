"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import * as svc from "@/lib/services";
import type { WorkoutExercise } from "@/lib/db/schema";

const done = (r: unknown = true) => { revalidatePath("/", "layout"); return r; };

export async function saveWorkoutAction(input: Parameters<typeof svc.saveWorkout>[1]) {
  const u = await requireUser();
  const w = await svc.saveWorkout(u.id, input);
  return done({ id: w.id });
}
export async function deleteWorkoutAction(id: string) {
  const u = await requireUser(); await svc.deleteWorkout(u.id, id); return done();
}
export async function saveRoutineAction(id: string | null, input: { name: string; folder?: string | null; notes?: string | null; exercises: WorkoutExercise[] }) {
  const u = await requireUser();
  const r = id ? await svc.updateRoutine(u.id, id, input) : await svc.createRoutine(u.id, input);
  return done({ id: r?.id });
}
export async function deleteRoutineAction(id: string) {
  const u = await requireUser(); await svc.deleteRoutine(u.id, id); return done();
}
export async function createExerciseAction(d: { name: string; muscle: string; equipment: string; instructions?: string }) {
  const u = await requireUser(); const e = await svc.createExercise(u.id, d); done(); return e;
}
export async function deleteExerciseAction(id: string) {
  const u = await requireUser(); await svc.deleteExercise(u.id, id); return done();
}
export async function updateSettingsAction(p: { unit?: string; restSec?: number; autoRest?: boolean }) {
  const u = await requireUser(); const s = await svc.updateSettings(u.id, p); done(); return s;
}
export async function logMeasurementAction(d: { kind: string; value: number; date?: string }) {
  const u = await requireUser(); await svc.logMeasurement(u.id, { kind: d.kind, value: d.value, date: d.date ? new Date(d.date) : undefined }); return done();
}
export async function deleteMeasurementAction(id: string) {
  const u = await requireUser(); await svc.deleteMeasurement(u.id, id); return done();
}
export async function createApiKeyAction(name: string) {
  const u = await requireUser(); const k = await svc.createApiKey(u.id, name); done(); return { key: k.key };
}
export async function revokeApiKeyAction(id: string) {
  const u = await requireUser(); await svc.revokeApiKey(u.id, id); return done();
}
export async function importWorkoutsAction(list: Parameters<typeof svc.saveWorkout>[1][]) {
  const u = await requireUser();
  let n = 0;
  for (const w of list) { await svc.saveWorkout(u.id, w); n++; }
  done();
  return { imported: n };
}
