import { requireUser } from "@/lib/auth";
import { exerciseLite, getSettings, lastPerformance } from "@/lib/services";
import { WorkoutEditor } from "@/components/workout-editor";

export const metadata = { title: "New routine" };

export default async function NewRoutine() {
  const u = await requireUser();
  const [exercises, prev, s] = await Promise.all([exerciseLite(u.id), lastPerformance(u.id), getSettings(u.id)]);
  return <WorkoutEditor mode="routine" exercises={exercises} prev={prev}
    initial={{ name: "", notes: "", folder: "", routineId: null, startedAt: new Date().toISOString(), endedAt: null, unit: s.unit as "kg" | "lb", exercises: [] }} />;
}
