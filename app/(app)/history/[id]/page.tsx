import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Trophy } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getSettings, getWorkout, workoutPRs } from "@/lib/services";
import { e1rm, toDisplay, workoutSetCount, workoutVolume, round } from "@/lib/calc";
import { Button } from "@/components/ui/button";
import { DeleteWorkout } from "./delete";

export const metadata = { title: "Workout" };

const PR_LABEL = { weight: "Weight", e1rm: "1RM", volume: "Volume", reps: "Reps" } as const;

export default async function WorkoutDetail({ params }: PageProps<"/history/[id]">) {
  const { id } = await params;
  const u = await requireUser();
  const [w, s] = await Promise.all([getWorkout(u.id, id), getSettings(u.id)]);
  if (!w) notFound();
  const unit = s.unit as "kg" | "lb";
  const prs = await workoutPRs(u.id, w);
  const prCount = prs.reduce((a, p) => a + Object.keys(p).length, 0);
  const dur = w.endedAt ? Math.round((+w.endedAt - +w.startedAt) / 60000) : null;
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground">← History</Link>
        <div className="ml-auto flex gap-2">
          <Button asChild variant="outline" size="sm"><Link href={`/history/${w.id}/edit`}><Pencil className="size-4" />Edit</Link></Button>
          <DeleteWorkout id={w.id} />
        </div>
      </div>
      <article className="receipt rounded-xl border px-5 py-8 shadow-[0_1px_3px_#0000001a] sm:px-8">
        <p className="mono-label text-center">Lift Receipt · No. {w.id.slice(0, 8).toUpperCase()}</p>
        <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight">{w.name}</h1>
        <p className="mono-label mt-1 text-center">{w.startedAt.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
        {w.notes && <p className="mt-3 text-center text-sm text-muted-foreground">{w.notes}</p>}
        <div className="tear my-5" />
        <div className="space-y-5">
          {w.exercises.map((e, i) => (
            <div key={i}>
              <div className="flex items-baseline gap-2">
                <Link href={`/exercises/${e.exerciseId}`} className="flex-1 font-semibold hover:underline">{e.name}</Link>
                {e.supersetId && <span className="mono-label text-chart-1">Superset</span>}
              </div>
              {e.notes && <p className="text-xs text-muted-foreground">{e.notes}</p>}
              <div className="mt-1 space-y-0.5 font-mono text-sm">
                {e.sets.map((st, si) => (
                  <div key={si} className="flex items-center gap-2">
                    <span className="w-6 text-muted-foreground">{st.type === "warmup" ? "W" : st.type === "drop" ? "D" : st.type === "failure" ? "F" : si + 1}</span>
                    <span className="flex-1 tabular-nums">{st.weight != null ? `${toDisplay(st.weight, unit)} ${unit}` : "BW"} × {st.reps ?? "-"}{st.rpe ? ` @${st.rpe}` : ""}</span>
                    {prs[i][si]?.map((k) => <span key={k} className="inline-flex items-center gap-0.5 rounded-full bg-amber-400/15 px-1.5 text-[10px] uppercase text-amber-600 dark:text-amber-400"><Trophy className="size-2.5" />{PR_LABEL[k]}</span>)}
                    <span className="w-16 text-right text-xs text-muted-foreground tabular-nums">{st.weight && st.reps ? `${round(toDisplay(e1rm(st.weight, st.reps), unit)!, 0)}` : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="tear my-5" />
        <div className="space-y-1 font-mono text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">DURATION</span><span>{dur != null ? `${dur} min` : "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">SETS</span><span>{workoutSetCount(w.exercises)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">PRS</span><span>{prCount}</span></div>
          <div className="flex justify-between text-base font-semibold"><span>TOTAL VOLUME</span><span>{Math.round(toDisplay(workoutVolume(w.exercises), unit)!).toLocaleString()} {unit}</span></div>
        </div>
        <div aria-hidden className="mx-auto mt-6 h-10 w-48 bg-[repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_4px,currentColor_4px_5px,transparent_5px_8px)] opacity-80" />
        <p className="mono-label mt-2 text-center">Thank you for lifting</p>
      </article>
    </div>
  );
}
