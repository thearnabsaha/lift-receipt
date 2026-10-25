"use client";
import { useEffect, useRef } from "react";
import { Clock, Dumbbell, Share, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { e1rm, toDisplay, workoutVolume, countsForStats } from "@/lib/calc";
import type { WorkoutExercise } from "@/lib/db/schema";
import { playFinish } from "@/lib/sound";

export type FinishSummary = { id: string; name: string; startedAt: string; endedAt: string; unit: "kg" | "lb"; exercises: WorkoutExercise[]; count: number | null; prs: number | null; offline?: boolean };

export const ordinal = (n: number) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
export const shortDur = (ms: number) => { const m = Math.max(1, Math.round(ms / 60000)); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; };
const fmtNum = (n: number) => (Math.round(n * 10) / 10).toLocaleString(undefined, { maximumFractionDigits: 1 });

export function bestSet(e: WorkoutExercise) {
  const sets = e.sets.filter(countsForStats);
  let b = sets[0] ?? null;
  for (const s of sets) if (e1rm(s.weight, s.reps) > e1rm(b!.weight, b!.reps) || (b!.weight == null && (s.reps ?? 0) > (b!.reps ?? 0))) b = s;
  return b;
}

function Stars() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const color = getComputedStyle(document.body).color || "#888";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const size = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; };
    size(); addEventListener("resize", size);
    const N = reduce ? 40 : 70;
    const ps = Array.from({ length: N }, () => ({ x: Math.random(), y: reduce ? Math.random() : Math.random() * 1.3 - 0.6, r: 4 + Math.random() * 9, v: 0.0008 + Math.random() * 0.0018, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.04, a: 0.25 + Math.random() * 0.75, tw: Math.random() * 6 }));
    const star = (x: number, y: number, r: number, rot: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * 0.45 : r; const t = rot + (i * Math.PI) / 5; ctx.lineTo(x + Math.sin(t) * rr, y - Math.cos(t) * rr); }
      ctx.closePath(); ctx.fill();
    };
    let raf = 0; const start = performance.now();
    const draw = (t: number) => {
      ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = color;
      const fade = reduce ? 1 : Math.max(0, Math.min(1, 1 - (t - start - 7000) / 3000)); // fall for ~7s then fade out
      for (const p of ps) {
        if (!reduce) { p.y += p.v; p.rot += p.vr; if (p.y > 1.05 && t - start < 6000) { p.y = -0.05; p.x = Math.random(); } }
        ctx.globalAlpha = p.a * fade * (0.6 + 0.4 * Math.sin(t / 300 + p.tw));
        star(p.x * c.width, p.y * c.height, p.r * dpr, p.rot);
      }
      if (!reduce && fade > 0) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" />;
}

export function FinishScreen({ s, onClose }: { s: FinishSummary; onClose: () => void }) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    playFinish(); toast.dismiss();
    document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; };
  }, []);
  const exs = s.exercises.filter((e) => e.sets.some(countsForStats) || e.sets.some((x) => x.done));
  const vol = toDisplay(workoutVolume(s.exercises), s.unit) ?? 0;
  const d0 = new Date(s.startedAt);
  const dateStr = `${d0.toLocaleDateString("en-GB", { weekday: "long" })}, ${d0.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
  const fmtSet = (x: ReturnType<typeof bestSet>) => !x ? "—" : x.weight != null && x.weight > 0 ? `${fmtNum(toDisplay(x.weight, s.unit) ?? 0)} ${s.unit} × ${x.reps ?? 0}` : `${x.reps ?? 0} reps`;
  const text = () => [`${s.name} — ${dateStr}`, `${shortDur(+new Date(s.endedAt) - +new Date(s.startedAt))} · ${fmtNum(vol)} ${s.unit} · ${s.prs ?? 0} PRs`, "", ...exs.map((e) => `${e.sets.filter((x) => x.done).length} × ${e.name}: ${fmtSet(bestSet(e))}`), "", "Lift Receipt"].join("\n");

  const share = async () => {
    try {
      const { toBlob } = await import("html-to-image");
      const bg = getComputedStyle(document.body).backgroundColor;
      const blob = card.current ? await toBlob(card.current, { pixelRatio: 3, backgroundColor: bg }) : null;
      const file = blob ? new File([blob], "lift-receipt.png", { type: "image/png" }) : null;
      if (file && navigator.canShare?.({ files: [file] })) return await navigator.share({ files: [file], title: s.name, text: text() });
      if (navigator.share) return await navigator.share({ title: s.name, text: text() });
      if (blob) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "lift-receipt.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
      await navigator.clipboard?.writeText(text()); toast.success("Summary copied" + (blob ? " · image downloaded" : ""));
    } catch (e) { if ((e as Error)?.name !== "AbortError") { try { await navigator.clipboard.writeText(text()); toast.success("Summary copied"); } catch { toast.error("Could not share"); } } }
  };

  return (
    <div role="dialog" aria-modal aria-label="Workout complete" data-testid="finish-screen" className="fixed inset-0 z-[100] overflow-y-auto bg-background text-foreground">
      <Stars />
      <div className="relative mx-auto flex min-h-full max-w-md flex-col px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-11 items-center justify-center rounded-full border bg-card/80 backdrop-blur active:translate-y-px"><X className="size-5" /></button>
          <button type="button" onClick={share} aria-label="Share" className="flex size-11 items-center justify-center rounded-full border bg-card/80 backdrop-blur active:translate-y-px"><Share className="size-5" /></button>
        </div>
        <div className="mt-6 flex items-end justify-center gap-2 text-amber-400" aria-hidden>
          <svg viewBox="0 0 24 24" className="size-9 fill-current"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.2 5.8 20.9l1.6-7L2 9.2l7.1-.6z" /></svg>
          <svg viewBox="0 0 24 24" className="mb-3 size-14 fill-current"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.2 5.8 20.9l1.6-7L2 9.2l7.1-.6z" /></svg>
          <svg viewBox="0 0 24 24" className="size-9 fill-current"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.2 5.8 20.9l1.6-7L2 9.2l7.1-.6z" /></svg>
        </div>
        <h1 className="mt-3 text-center text-3xl font-semibold tracking-tight">Great Job!</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{s.count ? `That's your ${ordinal(s.count)} workout!` : s.offline ? "Saved offline. It'll sync when you're back online." : "Workout logged."}</p>

        <div ref={card} className="receipt relative mt-12 rounded-2xl border bg-card px-5 py-5 shadow-[0_1px_3px_#0000001a]">
          <p className="mono-label text-[10px]">Receipt · Lift Receipt</p>
          <p className="mt-1 text-lg font-semibold">{s.name}</p>
          <p className="text-sm text-muted-foreground">{dateStr}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 border-y border-dashed py-2.5 font-mono text-sm tabular-nums">
            <span className="flex items-center gap-1.5"><Clock className="size-4" />{shortDur(+new Date(s.endedAt) - +new Date(s.startedAt))}</span>
            <span className="flex items-center gap-1.5"><Dumbbell className="size-4" />{fmtNum(vol)} {s.unit}</span>
            <span className="flex items-center gap-1.5"><Trophy className="size-4" />{s.prs ?? 0} PR{s.prs === 1 ? "" : "s"}</span>
          </div>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 text-sm">
            <span className="mono-label text-[10px]">Exercise</span><span className="mono-label text-[10px]">Best set</span>
            {exs.map((e, i) => (
              <div key={i} className="contents">
                <span className="truncate text-muted-foreground">{e.sets.filter((x) => x.done).length} × {e.name}</span>
                <span className="font-mono tabular-nums">{fmtSet(bestSet(e))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
