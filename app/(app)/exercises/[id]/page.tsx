import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { favoriteIds, exerciseHistory, getExercise, getSettings, personalRecords, userTz } from "@/lib/services";
import { toDisplay, round } from "@/lib/calc";
import { StatStrip } from "@/components/app-shell";
import { ExerciseCharts } from "./charts";
import { DeleteExercise } from "./delete";
import { FavoriteToggle } from "@/components/favorite-star";
import { DemoBlock } from "@/components/exercise-demo";
import { FormVideos } from "@/components/form-videos";
import demos from "@/lib/data/demos.json";
import type { DemoIndex } from "@/lib/demos";

export const metadata = { title: "Exercise" };

export default async function ExercisePage({ params }: PageProps<"/exercises/[id]">) {
  const { id } = await params;
  const u = await requireUser();
  const ex = await getExercise(u.id, id);
  if (!ex) notFound();
  const [hist, [rec], s, favs] = await Promise.all([exerciseHistory(u.id, id), personalRecords(u.id, id), getSettings(u.id), favoriteIds(u.id)]);
  const tz = await userTz(u.id);
  const unit = s.unit as "kg" | "lb";
  const d = (v: number) => toDisplay(v, unit)!;
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/exercises" className="text-sm text-muted-foreground hover:text-foreground">← Exercises</Link>
      <div className="mt-3 mb-6 flex items-start gap-2">
        <div className="flex-1"><p className="mono-label">{ex.muscle} · {ex.equipment}</p><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{ex.name}</h1></div>
        <FavoriteToggle id={ex.id} initial={favs.includes(ex.id)} />
        {ex.userId && <DeleteExercise id={ex.id} />}
      </div>
      {(demos as DemoIndex)[ex.id] && (
        <section className="mb-8" data-testid="exercise-demo">
          <p className="mono-label mb-3">How to</p>
          <DemoBlock demo={(demos as DemoIndex)[ex.id]} name={ex.name} />
        </section>
      )}
      <div className="mb-8 empty:hidden"><FormVideos exerciseId={ex.id} name={ex.name} custom={!!ex.userId} /></div>
      {ex.instructions && <p className="mb-6 text-sm text-muted-foreground">{ex.instructions}</p>}
      <StatStrip items={[
        { label: "Max weight", value: rec ? d(rec.maxWeight) : "—", suffix: unit },
        { label: "Best e1RM", value: rec ? round(d(rec.bestE1rm), 1) : "—", suffix: unit },
        { label: "Best set vol", value: rec ? Math.round(d(rec.bestSetVolume)) : "—", suffix: unit },
        { label: "Sessions", value: hist.length },
      ]} />
      <ExerciseCharts unit={unit} data={hist.map((h) => ({ date: h.date.toISOString().slice(0, 10), e1rm: round(d(h.bestE1rm), 1), max: d(h.maxWeight), volume: Math.round(d(h.volume)) }))} />
      {rec && Object.keys(rec.repMaxes).length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">Rep records</h2>
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-6">
            {Object.entries(rec.repMaxes).map(([r, w]) => <div key={r} className="bg-card p-3 text-center"><p className="mono-label">{r} RM</p><p className="font-mono font-semibold tabular-nums">{d(w)}</p></div>)}
          </div>
        </section>
      )}
      <section className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">History</h2>
        {[...hist].reverse().map((h) => (
          <Link key={h.workoutId} href={`/history/${h.workoutId}`} className="mb-2 block rounded-xl border bg-card px-4 py-3 hover:bg-muted/40">
            <div className="flex justify-between"><span className="font-medium">{h.workoutName}</span><span className="mono-label">{h.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: tz })}</span></div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{h.sets.map((x) => `${x.weight != null ? d(x.weight) : "BW"}×${x.reps ?? "-"}`).join("  ")}</p>
          </Link>
        ))}
        {!hist.length && <p className="text-sm text-muted-foreground">Not performed yet.</p>}
      </section>
    </div>
  );
}
