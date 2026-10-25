import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listRoutines } from "@/lib/services";
import { PageHeader, EmptyState } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { InstallPrompt } from "@/components/pwa";
import { StartWorkout, ResumeBanner, StartRoutineButton, RoutineMenu } from "./start";

export const metadata = { title: "Workout" };

export default async function WorkoutPage() {
  const u = await requireUser();
  const routines = await listRoutines(u.id);
  const folders = new Map<string, typeof routines>();
  for (const r of routines) { const k = r.folder || "My routines"; folders.set(k, [...(folders.get(k) ?? []), r]); }
  return (
    <div className="mx-auto max-w-3xl">
      <InstallPrompt />
      <ResumeBanner />
      <PageHeader label="Start" title="Start workout" subtitle="Empty session, or pick up a routine." />
      <StartWorkout />
      <div className="mt-10 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Routines</h2>
        <Button asChild variant="outline" size="sm"><Link href="/routines/new"><Plus className="size-4" />Routine</Link></Button>
      </div>
      {!routines.length && <EmptyState line="No routines yet. Save your go-to sessions as templates."><Button asChild size="sm"><Link href="/routines/new">Create routine</Link></Button></EmptyState>}
      {[...folders.entries()].map(([folder, list]) => (
        <section key={folder} className="mb-6">
          <p className="mono-label mb-2">{folder} · {list.length}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((r) => (
              <div key={r.id} className="rounded-xl border bg-card p-4 shadow-[0_1px_3px_#0000001a] transition hover:-translate-y-0.5">
                <div className="flex items-start gap-2">
                  <Link href={`/routines/${r.id}`} className="min-w-0 flex-1"><p className="truncate font-semibold">{r.name}</p></Link>
                  <RoutineMenu id={r.id} />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.exercises.map((e) => `${e.sets.length} × ${e.name}`).join(", ") || "No exercises"}</p>
                <StartRoutineButton routine={{ id: r.id, name: r.name, folder: r.folder, notes: r.notes, exercises: r.exercises }} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
