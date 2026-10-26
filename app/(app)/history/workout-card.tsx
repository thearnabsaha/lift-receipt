import Link from "next/link";
import { Clock, Dumbbell } from "lucide-react";
import type { workout } from "@/lib/db/schema";
import { countsForStats, e1rm, toDisplay, workoutVolume } from "@/lib/calc";

export function WorkoutCard({ w, unit, tz }: { w: typeof workout.$inferSelect; unit: "kg" | "lb"; tz?: string }) {
  const dur = w.endedAt ? Math.round((+w.endedAt - +w.startedAt) / 60000) : null;
  return (
    <Link href={`/history/${w.id}`} className="block rounded-xl border bg-card p-4 shadow-[0_1px_3px_#0000001a] transition hover:-translate-y-0.5 hover:bg-muted/30">
      <div className="flex items-baseline gap-2 pr-8">
        <p className="flex-1 truncate font-semibold">{w.name}</p>
        <p className="mono-label">{w.startedAt.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", timeZone: tz })}</p>
      </div>
      <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
        {dur != null && <span className="flex items-center gap-1"><Clock className="size-3" />{dur} min</span>}
        <span className="flex items-center gap-1"><Dumbbell className="size-3" />{Math.round(toDisplay(workoutVolume(w.exercises), unit)!).toLocaleString()} {unit}</span>
      </div>
      <div className="tear my-3" />
      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm">
        <span className="mono-label text-[10px]">Exercise</span><span className="mono-label text-right text-[10px]">Best set</span>
        {w.exercises.slice(0, 6).map((e, i) => {
          const sets = e.sets.filter(countsForStats);
          const best = sets.reduce<typeof sets[number] | null>((b, s) => (!b || e1rm(s.weight, s.reps) > e1rm(b.weight, b.reps) ? s : b), null);
          return (
            <div key={i} className="contents">
              <span className="truncate">{sets.length} × {e.name}</span>
              <span className="text-right font-mono tabular-nums">{best ? `${best.weight != null ? toDisplay(best.weight, unit) + " " + unit : "BW"} × ${best.reps ?? "-"}` : "—"}</span>
            </div>
          );
        })}
        {w.exercises.length > 6 && <span className="text-muted-foreground">+{w.exercises.length - 6} more</span>}
      </div>
    </Link>
  );
}
