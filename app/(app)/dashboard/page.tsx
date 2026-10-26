import { ActiveWorkoutBanner } from "@/components/idle-prompt";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSettings, getStats, listWorkouts, personalRecords, progressSummary, userTz } from "@/lib/services";
import { PageHeader, StatStrip } from "@/components/app-shell";
import { toDisplay } from "@/lib/calc";
import { WeeklyChart } from "./weekly-chart-lazy";
import { WorkoutCard } from "../history/workout-card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Profile" };

export default async function Dashboard() {
  const u = await requireUser();
  const [stats, weeks, s, recent, prs, tz] = await Promise.all([getStats(u.id), progressSummary(u.id, 12), getSettings(u.id), listWorkouts(u.id, { limit: 3 }), personalRecords(u.id), userTz(u.id)]);
  const unit = s.unit as "kg" | "lb";
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader label="Profile" title={u.name || "Athlete"} subtitle={u.email} action={<Button asChild size="sm"><Link href="/workout">Start workout</Link></Button>} />
      <ActiveWorkoutBanner />
      <StatStrip items={[
        { label: "Workouts", value: stats.totalWorkouts },
        { label: "This week", value: stats.workoutsThisWeek },
        { label: "Week streak", value: stats.weekStreak },
        { label: "Volume", value: Math.round(toDisplay(stats.totalVolumeKg, unit)!).toLocaleString(), suffix: unit },
      ]} />
      <section className="mt-8 rounded-xl border bg-card p-4">
        <p className="mono-label mb-3">Workouts per week · last 12</p>
        <WeeklyChart data={weeks.map((w) => ({ week: w.week.slice(5), workouts: w.workouts, volume: Math.round(toDisplay(w.volumeKg, unit)!) }))} />
      </section>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-semibold">Recent</h2><Link href="/history" className="text-sm text-muted-foreground hover:text-foreground">All →</Link></div>
          {recent.length ? <div className="space-y-3">{recent.map((w) => <WorkoutCard key={w.id} w={w} unit={unit} tz={tz} />)}</div> : <p className="text-sm text-muted-foreground">No workouts yet.</p>}
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold">Top lifts</h2>
          <div className="rounded-xl border bg-card">
            {prs.slice(0, 8).map((p) => (
              <Link key={p.exerciseId} href={`/exercises/${p.exerciseId}`} className="flex items-center gap-2 border-b px-4 py-2.5 last:border-0 hover:bg-muted/50">
                <span className="flex-1 truncate text-sm">{p.name}</span>
                <span className="font-mono text-sm tabular-nums">{toDisplay(p.maxWeight, unit)} {unit}</span>
                <span className="w-20 text-right font-mono text-xs text-muted-foreground">1RM {Math.round(toDisplay(p.bestE1rm, unit)!)}</span>
              </Link>
            ))}
            {!prs.length && <p className="p-4 text-sm text-muted-foreground">Finish a workout to see records.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
