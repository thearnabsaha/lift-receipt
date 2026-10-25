import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { exerciseLite, getRoutine, getSettings, lastPerformance } from "@/lib/services";
import { WorkoutEditor } from "@/components/workout-editor";
import { toEditorExercises } from "@/lib/editor";

export const metadata = { title: "Edit routine" };

export default async function EditRoutine({ params }: PageProps<"/routines/[id]">) {
  const { id } = await params;
  const u = await requireUser();
  const [r, exercises, prev, s] = await Promise.all([getRoutine(u.id, id), exerciseLite(u.id), lastPerformance(u.id), getSettings(u.id)]);
  if (!r) notFound();
  const unit = s.unit as "kg" | "lb";
  return <WorkoutEditor mode="routine" exercises={exercises} prev={prev}
    initial={{ id: r.id, name: r.name, notes: r.notes ?? "", folder: r.folder ?? "", routineId: null, startedAt: new Date().toISOString(), endedAt: null, unit, exercises: toEditorExercises(r.exercises, unit, false) }} />;
}
