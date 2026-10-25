import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSettings, listWorkouts } from "@/lib/services";
import { PageHeader, EmptyState } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { HistoryCalendar } from "./calendar";
import { WorkoutCard } from "./workout-card";

export const metadata = { title: "History" };

export default async function HistoryPage({ searchParams }: PageProps<"/history">) {
  const sp = await searchParams;
  const u = await requireUser();
  const [list, s] = await Promise.all([listWorkouts(u.id, { limit: 1000 }), getSettings(u.id)]);
  const view = sp.view === "calendar" ? "calendar" : "list";
  const byMonth = new Map<string, typeof list>();
  for (const w of list) { const k = w.startedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" }); byMonth.set(k, [...(byMonth.get(k) ?? []), w]); }
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader label={`${list.length} workouts`} title="History" action={
        <div className="flex rounded-full border p-0.5 text-sm">
          <Link href="/history" className={`rounded-full px-3 py-1 ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>List</Link>
          <Link href="/history?view=calendar" className={`rounded-full px-3 py-1 ${view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Calendar</Link>
        </div>} />
      {!list.length && <EmptyState line="Nothing logged yet. Your receipts will print here."><Button asChild size="sm"><Link href="/workout">Start a workout</Link></Button></EmptyState>}
      {view === "calendar" ? (
        <HistoryCalendar workouts={list.map((w) => ({ id: w.id, name: w.name, date: w.startedAt.toISOString() }))} />
      ) : [...byMonth.entries()].map(([m, ws]) => (
        <section key={m} className="mb-8">
          <p className="mono-label mb-3">{m} · {ws.length}</p>
          <div className="space-y-3">{ws.map((w) => <WorkoutCard key={w.id} w={w} unit={s.unit as "kg" | "lb"} />)}</div>
        </section>
      ))}
    </div>
  );
}
