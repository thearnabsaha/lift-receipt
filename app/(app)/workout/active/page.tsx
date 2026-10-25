import { requireUser } from "@/lib/auth";
import { exerciseLite, lastPerformance } from "@/lib/services";
import { ActiveWorkout } from "./active";

export const metadata = { title: "Active workout" };

export default async function ActivePage() {
  const u = await requireUser();
  const [exercises, prev] = await Promise.all([exerciseLite(u.id), lastPerformance(u.id)]);
  return <ActiveWorkout exercises={exercises} prev={prev} />;
}
