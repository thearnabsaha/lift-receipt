import { requireUser } from "@/lib/auth";
import { getSettings, prHistory, userTz } from "@/lib/services";
import { PageHeader } from "@/components/app-shell";
import { RecordsClient, type Ev, type Cur } from "./client";

export const metadata = { title: "Records" };
export default async function RecordsPage() {
  const u = await requireUser();
  const [{ events, current }, s, tz] = await Promise.all([prHistory(u.id), getSettings(u.id), userTz(u.id)]);
  const day = (d: Date | null) => (d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: tz }) : "");
  const ev: Ev[] = events.map((e) => ({ id: `${e.workoutId}:${e.exerciseId}:${e.kind}`, workoutId: e.workoutId, workoutName: e.workoutName, date: day(e.date), exerciseId: e.exerciseId, exercise: e.exercise, kind: e.kind, value: e.value, previous: e.previous, weight: e.set.weight, reps: e.set.reps }));
  const cur: Cur[] = current.map((c) => ({ exerciseId: c.exerciseId, exercise: c.exercise, maxWeight: c.maxWeight, maxWeightDate: day(c.maxWeightDate), bestE1rm: c.bestE1rm, bestVolume: c.bestVolume, bestVolumeSet: c.bestVolumeSet, maxReps: c.maxReps, prCount: c.prCount, lastPR: day(c.lastPR) }));
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader label="Profile" title="Records" subtitle={`${events.length} PR${events.length === 1 ? "" : "s"} across ${current.length} exercise${current.length === 1 ? "" : "s"}.`} />
      <RecordsClient events={ev} current={cur} unit={s.unit as "kg" | "lb"} />
    </div>
  );
}
