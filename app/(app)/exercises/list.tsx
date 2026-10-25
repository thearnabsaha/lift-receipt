"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateExerciseDialog, ExerciseFilters, useExerciseFilter, type ExerciseLite } from "@/components/exercise-picker";

export function ExerciseList({ list }: { list: ExerciseLite[] }) {
  const router = useRouter();
  const { filtered, props } = useExerciseFilter(list);
  const groups = new Map<string, ExerciseLite[]>();
  for (const e of filtered) { const k = e.name[0].toUpperCase(); groups.set(k, [...(groups.get(k) ?? []), e]); }
  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1"><ExerciseFilters {...props} /></div>
        <CreateExerciseDialog defaultName={props.q} onCreated={() => router.refresh()} trigger={<Button className="h-10"><Plus className="size-4" />New</Button>} />
      </div>
      {[...groups.entries()].map(([k, es]) => (
        <section key={k} className="mb-4">
          <p className="mono-label mb-1 px-1">{k}</p>
          <div className="overflow-hidden rounded-xl border bg-card">
            {es.map((e) => (
              <Link key={e.id} href={`/exercises/${e.id}`} className="flex items-center gap-3 border-b px-4 py-2.5 last:border-0 hover:bg-muted/50">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs">{e.name[0]}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{e.name}</span><span className="block text-xs text-muted-foreground">{e.muscle} · {e.equipment}{e.userId ? " · custom" : ""}</span></span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {!filtered.length && <p className="py-10 text-center text-sm text-muted-foreground">No matches. Create it as a custom exercise.</p>}
    </div>
  );
}
