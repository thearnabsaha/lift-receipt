import { requireUser } from "@/lib/auth";
import { getSettings, prHistory, userTz } from "@/lib/services";
import { PageHeader } from "@/components/app-shell";
import { RecordsClient, type Ev, type Cur } from "./client";

export const metadata = { title: "Records" };
export default async function RecordsPage() {
  const u = await requireUser();
  const [{ events, current, baselines }, s, tz] = await Promise.all([prHistory(u.id), getSettings(u.id), userTz(u.id)]);
  const day = (d: Date | null) => (d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: tz }) : "");
  const ev: Ev[] = events.map((e) => ({ id: `${e.workoutId}:${e.exerciseId}:${e.kind}`, workoutId: e.workoutId, workoutName: e.workoutName, date: day(e.date), ts: +e.date, exerciseId: e.exerciseId, exercise: e.exercise, kind: e.kind, value: e.value, previous: e.previous, weight: e.set.weight, reps: e.set.reps, baseline: false }));
  const cur: Cur[] = current.map((c) => ({ exerciseId: c.exerciseId, exercise: c.exercise, maxWeight: c.maxWeight, maxWeightDate: day(c.maxWeightDate), bestE1rm: c.bestE1rm, bestVolume: c.bestVolume, bestVolumeSet: c.bestVolumeSet, maxReps: c.maxReps, prCount: c.prCount, lastPR: day(c.lastPR) }));
  const base: Ev[] = baselines.flatMap((b) => (Object.entries(b.values) as [Ev["kind"], { value: number; set: { weight: number | null; reps: number | null } }][]).map(([kind, v]) => ({ id: `${b.workoutId}:${b.exerciseId}:${kind}:base`, workoutId: b.workoutId, workoutName: b.workoutName, date: day(b.date), ts: +b.date, exerciseId: b.exerciseId, exercise: b.exercise, kind, value: v.value, previous: 0, weight: v.set.weight, reps: v.set.reps, baseline: true })));
  const n = events.length, m = current.length;
  const subtitle = !m ? "No exercises logged yet." : n ? `${n} PR${n === 1 ? "" : "s"} across ${m} exercise${m === 1 ? "" : "s"}.` : `${m} exercise${m === 1 ? "" : "s"} tracked · 0 PRs beaten so far.`;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader label="Profile" title="Records" subtitle={subtitle} />
      <RecordsClient events={ev} baselines={base} current={cur} unit={s.unit as "kg" | "lb"} />
    </div>
  );
}
