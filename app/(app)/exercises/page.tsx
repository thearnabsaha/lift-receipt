import { requireUser } from "@/lib/auth";
import { exerciseLite } from "@/lib/services";
import { PageHeader } from "@/components/app-shell";
import { ExerciseList } from "./list";

export const metadata = { title: "Exercises" };
export default async function ExercisesPage() {
  const u = await requireUser();
  const list = await exerciseLite(u.id);
  return <div className="mx-auto max-w-3xl"><PageHeader label={`${list.length} exercises`} title="Exercises" /><ExerciseList list={list} /></div>;
}
