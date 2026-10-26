"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { FavoriteStar, FavoritesProvider, useFavoriteSet } from "@/components/favorite-star";
import { CreateExerciseDialog, ExerciseFilters, useExerciseFilter, type ExerciseLite } from "@/components/exercise-picker";

export function ExerciseList({ list }: { list: ExerciseLite[] }) {
  const router = useRouter();
  const favs = useFavoriteSet(useMemo(() => list.filter((e) => e.fav).map((e) => e.id), [list]));
  const { filtered, props } = useExerciseFilter(list);
  const groups = new Map<string, ExerciseLite[]>();
  const starred = filtered.filter((e) => favs.has(e.id));
  if (starred.length) groups.set("★ Favourites", starred);
  for (const e of filtered) { const k = e.name[0].toUpperCase(); groups.set(k, [...(groups.get(k) ?? []), e]); }
  return (
    <FavoritesProvider value={favs}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1"><ExerciseFilters {...props} /></div>
        <CreateExerciseDialog defaultName={props.q} onCreated={() => router.refresh()} trigger={<Button className="h-10"><Plus className="size-4" />New</Button>} />
      </div>
      {[...groups.entries()].map(([k, es]) => (
        <section key={k} className="mb-4">
          <p className="mono-label mb-1 px-1">{k}</p>
          <div className="overflow-hidden rounded-xl border bg-card">
            {es.map((e) => (
              <div key={e.id} className="flex items-center border-b pr-2 last:border-0 hover:bg-muted/50">
              <Link href={`/exercises/${e.id}`} className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs">{e.name[0]}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{e.name}</span><span className="block text-xs text-muted-foreground">{e.muscle} · {e.equipment}{e.userId ? " · custom" : ""}</span></span>
              </Link>
              <FavoriteStar id={e.id} />
              </div>
            ))}
          </div>
        </section>
      ))}
      {!filtered.length && <p className="py-10 text-center text-sm text-muted-foreground">No matches. Create it as a custom exercise.</p>}
    </FavoritesProvider>
  );
}
