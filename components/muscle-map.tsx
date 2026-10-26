"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { level, PATH_ALIAS, REGIONS, type MuscleStat, type Period, type Region } from "@/lib/muscles";

type Body = (typeof import("@/lib/data/body-paths"))["default"];
let CACHE: Body | null = null;
function useBody() {
  const [b, setB] = useState<Body | null>(CACHE);
  useEffect(() => { if (!CACHE) import("@/lib/data/body-paths").then((m) => setB((CACHE = m.default))); }, []);
  return b;
}
const OPACITY = [0.07, 0.28, 0.48, 0.72, 0.95];
const LABEL: Record<Period, string> = { "7d": "7D", "30d": "30D", "90d": "90D", all: "All" };
const isRegion = (s: string): s is Region => (REGIONS as readonly string[]).includes(s);

export type MuscleData = Record<Period, { workouts: number; muscles: MuscleStat[] }>;

export function MuscleMap({ data, unit }: { data: MuscleData; unit: "kg" | "lb" }) {
  const [period, setPeriod] = useState<Period>("30d");
  const [metric, setMetric] = useState<"sets" | "volume">("sets");
  const [sel, setSel] = useState<Region | null>(null);
  const [open, setOpen] = useState(true);
  const body = useBody();
  const d = data[period];
  const val = (m: MuscleStat) => (metric === "sets" ? m.sets : m.volume);
  const ranked = useMemo(() => [...d.muscles].sort((a, b) => val(b) - val(a)), [d, metric]); // eslint-disable-line react-hooks/exhaustive-deps
  const max = Math.max(0, ...d.muscles.map(val));
  const by = Object.fromEntries(d.muscles.map((m) => [m.region, m])) as Record<Region, MuscleStat>;
  const w = (kg: number) => Math.round(unit === "lb" ? kg * 2.20462 : kg).toLocaleString();
  const fmt = (m: MuscleStat) => (metric === "sets" ? `${+m.sets.toFixed(1)} sets` : `${w(m.volume)} ${unit}`);
  const picked = sel ? by[sel] : null;

  const view = (v: "front" | "back") => {
    const g = body![v];
    return (
      <svg viewBox={g.vb} className="h-full w-full" role="group" aria-label={`${v} view`}>
        {Object.entries(g.p).map(([slug, ds]) => {
          const r = isRegion(slug) ? slug : PATH_ALIAS[slug];
          if (!r) return ds.map((p, i) => <path key={slug + i} d={p} className="fill-muted-foreground/15" />);
          const lv = level(val(by[r]), max);
          return ds.map((p, i) => (
            <path key={slug + i} d={p} onClick={() => setSel(sel === r ? null : r)} role="button" aria-label={by[r].name}
              className={`cursor-pointer fill-foreground transition-[fill-opacity] ${sel === r ? "stroke-foreground" : "stroke-background"}`}
              style={{ fillOpacity: OPACITY[lv], strokeWidth: sel === r ? 6 : 2 }}><title>{by[r].name}</title></path>
          ));
        })}
      </svg>
    );
  };

  return (
    <section className="mb-5 rounded-xl border bg-card" data-testid="muscle-map">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span><span className="mono-label block">Muscles</span><span className="text-sm text-muted-foreground">{d.workouts} workouts · {LABEL[period] === "All" ? "all time" : `last ${LABEL[period].toLowerCase()}`}</span></span>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-dashed px-4 pb-4 pt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex rounded-full border p-0.5 text-xs">
              {(Object.keys(LABEL) as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`rounded-full px-2.5 py-1 font-mono ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{LABEL[p]}</button>
              ))}
            </div>
            <div className="flex rounded-full border p-0.5 text-xs">
              {(["sets", "volume"] as const).map((k) => (
                <button key={k} onClick={() => setMetric(k)} className={`rounded-full px-2.5 py-1 capitalize ${metric === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{k}</button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid h-72 grid-cols-2 gap-2">
            {body ? <>{view("front")}{view("back")}</> : <><div className="animate-pulse rounded-lg bg-muted" /><div className="animate-pulse rounded-lg bg-muted" /></>}
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
            Less {OPACITY.map((o, i) => <span key={i} className="size-3 rounded-sm bg-foreground" style={{ opacity: o }} />)} More
          </div>

          {picked && (
            <div className="mt-3 rounded-lg border border-dashed p-3 text-sm">
              <div className="flex items-baseline justify-between"><span className="font-medium">{picked.name}</span><button onClick={() => setSel(null)} className="text-xs text-muted-foreground">Close</button></div>
              <div className="mt-1 grid grid-cols-3 gap-2 font-mono text-xs">
                <span><span className="block text-muted-foreground">SETS</span>{+picked.sets.toFixed(1)}</span>
                <span><span className="block text-muted-foreground">VOLUME</span>{w(picked.volume)} {unit}</span>
                <span><span className="block text-muted-foreground">LAST</span>{picked.lastTrained ? new Date(picked.lastTrained).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—"}</span>
              </div>
              {picked.top.length > 0 ? (
                <ul className="mt-2 space-y-0.5 text-xs">{picked.top.map((t) => <li key={t.name} className="flex justify-between"><span>{t.name}</span><span className="font-mono text-muted-foreground">{+t.sets.toFixed(1)}</span></li>)}</ul>
              ) : <p className="mt-2 text-xs text-muted-foreground">Not trained in this period.</p>}
            </div>
          )}

          <p className="mono-label mt-4 mb-1.5">Most trained → least</p>
          <ul className="space-y-1.5">
            {ranked.map((m) => (
              <li key={m.region}>
                <button onClick={() => setSel(sel === m.region ? null : m.region)} className="grid w-full grid-cols-[6.5rem_1fr_auto] items-center gap-2 text-left text-xs">
                  <span className={sel === m.region ? "font-semibold" : ""}>{m.name}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-foreground" style={{ width: `${max ? (val(m) / max) * 100 : 0}%` }} /></span>
                  <span className="font-mono text-muted-foreground">{val(m) > 0 ? fmt(m) : <span className="rounded border border-dashed px-1">untrained</span>}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-muted-foreground">Warm-ups excluded · secondary muscles count half · diagram: MuscleMap (MIT) via openGym</p>
        </div>
      )}
    </section>
  );
}
