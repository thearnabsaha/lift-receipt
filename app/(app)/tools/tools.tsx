"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/components/settings-context";
import { e1rm, plates, round } from "@/lib/calc";

const PLATES = { kg: [25, 20, 15, 10, 5, 2.5, 1.25], lb: [45, 35, 25, 10, 5, 2.5] };
const PCT = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

export function Tools() {
  const { unit } = useSettings();
  const [target, setTarget] = useState(unit === "kg" ? "100" : "225");
  const [bar, setBar] = useState(unit === "kg" ? "20" : "45");
  const [w, setW] = useState(unit === "kg" ? "80" : "185");
  const [r, setR] = useState("5");
  const res = plates(Number(target) || 0, Number(bar) || 0, PLATES[unit]);
  const max = e1rm(Number(w) || 0, Number(r) || 0);
  const maxP = PLATES[unit][0];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="receipt rounded-xl border px-5 py-7">
        <p className="mono-label">Plate calculator</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1"><Label>Target ({unit})</Label><Input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} /></div>
          <div className="space-y-1"><Label>Bar ({unit})</Label><Input inputMode="decimal" value={bar} onChange={(e) => setBar(e.target.value)} /></div>
        </div>
        <div className="my-6 flex h-28 items-center justify-center gap-0.5" aria-label="Barbell diagram">
          <div className="h-2 w-10 rounded-l bg-muted-foreground/50" />
          {res.plates.map((p, i) => <div key={i} className="flex w-4 items-center justify-center rounded-sm bg-foreground text-[8px] text-background [writing-mode:vertical-rl]" style={{ height: `${40 + (p / maxP) * 60}%` }}>{p}</div>)}
          <div className="h-2 flex-1 max-w-24 bg-muted-foreground/50" />
        </div>
        <p className="mono-label">Per side</p>
        <p className="font-mono text-lg font-semibold">{res.plates.length ? res.plates.join(" + ") : "Just the bar"}</p>
        {res.remainder !== 0 && <p className="mt-1 text-sm text-destructive">Can&apos;t make exactly — {res.remainder > 0 ? `${res.remainder} ${unit} short` : "below bar weight"}</p>}
      </section>
      <section className="receipt rounded-xl border px-5 py-7">
        <p className="mono-label">1RM calculator · Epley</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1"><Label>Weight ({unit})</Label><Input inputMode="decimal" value={w} onChange={(e) => setW(e.target.value)} /></div>
          <div className="space-y-1"><Label>Reps</Label><Input inputMode="numeric" value={r} onChange={(e) => setR(e.target.value)} /></div>
        </div>
        <p className="mono-label mt-6">Estimated 1RM</p>
        <p className="text-4xl font-semibold tabular-nums">{round(max, 1)} <span className="text-base text-muted-foreground">{unit}</span></p>
        <div className="tear my-4" />
        <div className="grid grid-cols-2 gap-x-6 font-mono text-sm">
          {PCT.map((p) => <div key={p} className="flex justify-between py-0.5"><span className="text-muted-foreground">{p}%</span><span className="tabular-nums">{round((max * p) / 100, 1)}</span></div>)}
        </div>
      </section>
    </div>
  );
}
