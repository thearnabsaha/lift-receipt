import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { exerciseLite, getSettings, getWorkout, lastPerformance } from "@/lib/services";
import { WorkoutEditor } from "@/components/workout-editor";
import { toEditorExercises } from "@/lib/editor";

export const metadata = { title: "Edit workout" };

export default async function EditWorkout({ params }: PageProps<"/history/[id]/edit">) {
  const { id } = await params;
  const u = await requireUser();
  const [w, exercises, prev, s] = await Promise.all([getWorkout(u.id, id), exerciseLite(u.id), lastPerformance(u.id), getSettings(u.id)]);
  if (!w) notFound();
  const unit = s.unit as "kg" | "lb";
  return <WorkoutEditor mode="edit" exercises={exercises} prev={prev}
    initial={{ id: w.id, name: w.name, notes: w.notes ?? "", folder: "", routineId: w.routineId, startedAt: w.startedAt.toISOString(), endedAt: w.endedAt?.toISOString() ?? null, unit, exercises: toEditorExercises(w.exercises, unit, true) }} />;
}
