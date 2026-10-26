"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Trophy, Search, X } from "lucide-react";
import { toDisplay } from "@/lib/calc";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Ev = { id: string; workoutId: string; workoutName: string; date: string; exerciseId: string; exercise: string; kind: "weight" | "e1rm" | "volume" | "reps"; value: number; previous: number; weight: number | null; reps: number | null };
export type Cur = { exerciseId: string; exercise: string; maxWeight: number; maxWeightDate: string; bestE1rm: number; bestVolume: number; bestVolumeSet: { weight: number; reps: number } | null; maxReps: number; prCount: number; lastPR: string };
const KIND = { weight: "Heaviest", e1rm: "Est. 1RM", volume: "Best set volume", reps: "Most reps" } as const;
const PAGE = 50;

export function RecordsClient({ events, current, unit }: { events: Ev[]; current: Cur[]; unit: "kg" | "lb" }) {
  const [q, setQ] = useState("");
  const [ex, setEx] = useState<string | null>(null);
  const [kind, setKind] = useState<Ev["kind"] | "all">("all");
  const [n, setN] = useState(PAGE);
  const w = (kg: number) => { const v = toDisplay(kg, unit)!; return `${Math.round(v * 10) / 10}`; };
  const fmt = (k: Ev["kind"], v: number) => (k === "reps" ? `${v} reps` : k === "volume" ? `${Math.round(toDisplay(v, unit)!).toLocaleString()} ${unit}` : `${w(v)} ${unit}`);
  const ql = q.trim().toLowerCase();
  const cur = useMemo(() => current.filter((c) => (!ex || c.exerciseId === ex) && (!ql || c.exercise.toLowerCase().includes(ql))), [current, ex, ql]);
  const list = useMemo(() => events.filter((e) => (!ex || e.exerciseId === ex) && (kind === "all" || e.kind === kind) && (!ql || e.exercise.toLowerCase().includes(ql) || e.workoutName.toLowerCase().includes(ql))), [events, ex, kind, ql]);
  const exName = ex ? current.find((c) => c.exerciseId === ex)?.exercise : null;

  if (!current.length) return (
    <div className="rounded-xl border bg-card p-8 text-center">
      <Trophy className="mx-auto mb-3 size-6 text-muted-foreground" strokeWidth={1.5} />
      <p className="font-medium">No records yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Log an exercise twice and beating your best shows up here.</p>
    </div>
  );

  return (
    <div>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
        <Input value={q} onChange={(e) => { setQ(e.target.value); setN(PAGE); }} placeholder="Search exercises" className="h-11 pl-9 text-base" enterKeyHint="search" />
      </div>
      {exName && (
        <button onClick={() => setEx(null)} className="mb-3 inline-flex h-9 items-center gap-1.5 rounded-full border bg-muted px-3 text-sm">{exName}<X className="size-3.5" /></button>
      )}

      <p className="mono-label mb-2">Current records</p>
      <div className="-mx-4 mb-6 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {cur.slice(0, 30).map((c) => (
          <button key={c.exerciseId} onClick={() => { setEx(ex === c.exerciseId ? null : c.exerciseId); setN(PAGE); }} className={cn("w-56 shrink-0 snap-start rounded-xl border bg-card p-4 text-left transition-colors active:bg-muted/60", ex === c.exerciseId && "border-foreground")}>
            <p className="truncate font-medium">{c.exercise}</p>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
              {c.maxWeight > 0 ? <>
                <div><dt className="text-muted-foreground">Best</dt><dd className="mt-0.5 font-mono text-sm tabular-nums">{w(c.maxWeight)}</dd></div>
                <div><dt className="text-muted-foreground">e1RM</dt><dd className="mt-0.5 font-mono text-sm tabular-nums">{w(c.bestE1rm)}</dd></div>
                <div><dt className="text-muted-foreground">Vol set</dt><dd className="mt-0.5 font-mono text-sm tabular-nums">{c.bestVolumeSet ? `${w(c.bestVolumeSet.weight)}×${c.bestVolumeSet.reps}` : "–"}</dd></div>
              </> : <div className="col-span-3"><dt className="text-muted-foreground">Most reps</dt><dd className="mt-0.5 font-mono text-sm tabular-nums">{c.maxReps}</dd></div>}
            </dl>
            <p className="mt-3 text-[11px] text-muted-foreground">{c.prCount ? `${c.prCount} PR${c.prCount === 1 ? "" : "s"} · last ${c.lastPR}` : `Baseline · ${c.maxWeightDate || "set"}`} · {unit}</p>
          </button>
        ))}
        {!cur.length && <p className="text-sm text-muted-foreground">No exercise matches.</p>}
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">History</h2>
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {(["all", "weight", "e1rm", "volume", "reps"] as const).map((k) => (
            <button key={k} onClick={() => { setKind(k); setN(PAGE); }} className={cn("h-8 shrink-0 rounded-lg px-2.5 text-xs text-muted-foreground", kind === k && "bg-muted text-foreground")}>{k === "all" ? "All" : k === "e1rm" ? "1RM" : k[0].toUpperCase() + k.slice(1)}</button>
          ))}
        </div>
      </div>
      {list.length ? (
        <ol className="receipt rounded-xl border bg-card">
          {list.slice(0, n).map((e) => (
            <li key={e.id} className="border-b last:border-0">
              <Link href={`/history/${e.workoutId}`} className="flex items-start gap-3 px-4 py-3 active:bg-muted/60">
                <Trophy className="mt-0.5 size-4 shrink-0 text-amber-500" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2"><p className="truncate font-medium">{e.exercise}</p><span className="shrink-0 font-mono text-sm tabular-nums">{fmt(e.kind, e.value)}</span></div>
                  <div className="mt-0.5 flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{KIND[e.kind]} · {e.date}{e.kind !== "weight" && e.weight ? ` · ${w(e.weight)}×${e.reps ?? 0}` : ""}</span>
                    <span className="shrink-0 font-mono tabular-nums">was {fmt(e.kind, e.previous)}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      ) : <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">No PRs match.</p>}
      {list.length > n && <button onClick={() => setN(n + PAGE)} className="mt-3 h-11 w-full rounded-xl border text-sm active:bg-muted/60">Show more ({list.length - n})</button>}
    </div>
  );
}
