import { ActiveWorkoutBanner } from "@/components/idle-prompt";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSettings, listWorkouts, muscleLookup } from "@/lib/services";
import { MuscleMap, type MuscleData } from "@/components/muscle-map";
import { muscleBalance, PERIODS, type Period } from "@/lib/muscles";
import { PageHeader, EmptyState } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { HistoryCalendar } from "./calendar";
import { WorkoutCard } from "./workout-card";
import { HistoryList } from "./history-list";

export const metadata = { title: "History" };

export default async function HistoryPage({ searchParams }: PageProps<"/history">) {
  const sp = await searchParams;
  const u = await requireUser();
  const [list, s, lookup] = await Promise.all([listWorkouts(u.id, { limit: 1000 }), getSettings(u.id), muscleLookup(u.id)]);
  const now = Date.now();
  const muscles = Object.fromEntries((Object.keys(PERIODS) as Period[]).map((p) => {
    const days = PERIODS[p]; const ws = days ? list.filter((w) => now - w.startedAt.getTime() <= days * 864e5) : list;
    return [p, { workouts: ws.length, muscles: muscleBalance(ws, (id) => lookup.get(id)) }];
  })) as MuscleData;
  const view = sp.view === "calendar" ? "calendar" : "list";
  const byMonth = new Map<string, typeof list>();
  for (const w of list) { const k = w.startedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" }); byMonth.set(k, [...(byMonth.get(k) ?? []), w]); }
  return (
    <div className="mx-auto max-w-3xl">
      <ActiveWorkoutBanner />
      <PageHeader label={`${list.length} workouts`} title="History" action={
        <div className="flex rounded-full border p-0.5 text-sm">
          <Link href="/history" className={`rounded-full px-3 py-1 ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>List</Link>
          <Link href="/history?view=calendar" className={`rounded-full px-3 py-1 ${view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Calendar</Link>
        </div>} />
      {!list.length && <EmptyState line="Nothing logged yet. Your receipts will print here."><Button asChild size="sm"><Link href="/workout">Start a workout</Link></Button></EmptyState>}
      {list.length > 0 && <MuscleMap data={muscles} unit={s.unit as "kg" | "lb"} />}
      {view === "calendar" ? (
        <HistoryCalendar workouts={list.map((w) => ({ id: w.id, name: w.name, date: w.startedAt.toISOString() }))} />
      ) : <HistoryList rows={[...byMonth.entries()].flatMap(([m, ws]) => ws.map((w) => ({ id: w.id, name: w.name, date: w.startedAt.toISOString(), month: m, card: <WorkoutCard w={w} unit={s.unit as "kg" | "lb"} /> })))} />}
    </div>
  );
}
