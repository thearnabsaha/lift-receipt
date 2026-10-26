"use client";
import { useEffect, useRef } from "react";
import { Check, Clock, Dumbbell, Share, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { e1rm, toDisplay, workoutVolume, countsForStats } from "@/lib/calc";
import type { WorkoutExercise } from "@/lib/db/schema";
import { playFinish } from "@/lib/sound";

export type FinishSummary = { id: string; name: string; startedAt: string; endedAt: string; unit: "kg" | "lb"; exercises: WorkoutExercise[]; count: number | null; prs: number | null; prEx?: string[]; offline?: boolean; next?: { name: string; label: string }[] };

export const ordinal = (n: number) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
export const shortDur = (ms: number) => { const m = Math.max(1, Math.round(ms / 60000)); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; };
const fmtNum = (n: number) => (Math.round(n * 10) / 10).toLocaleString(undefined, { maximumFractionDigits: 1 });

export function bestSet(e: WorkoutExercise) {
  const sets = e.sets.filter(countsForStats);
  let b = sets[0] ?? null;
  for (const s of sets) if (e1rm(s.weight, s.reps) > e1rm(b!.weight, b!.reps) || (b!.weight == null && (s.reps ?? 0) > (b!.reps ?? 0))) b = s;
  return b;
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
  const text = () => [`${s.name} — ${dateStr}`, `${shortDur(+new Date(s.endedAt) - +new Date(s.startedAt))} · ${fmtNum(vol)} ${s.unit} · ${s.prs ?? 0} PRs`, "", ...exs.map((e) => `${e.sets.filter((x) => x.done).length} × ${e.name}: ${fmtSet(bestSet(e))}`), "", "Fortis"].join("\n");

  const share = async () => {
    try {
      const { toBlob } = await import("html-to-image");
      const bg = getComputedStyle(document.body).backgroundColor;
      const blob = card.current ? await toBlob(card.current, { pixelRatio: 3, backgroundColor: bg }) : null;
      const file = blob ? new File([blob], "fortis.png", { type: "image/png" }) : null;
      if (file && navigator.canShare?.({ files: [file] })) return await navigator.share({ files: [file], title: s.name, text: text() });
      if (navigator.share) return await navigator.share({ title: s.name, text: text() });
      if (blob) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "fortis.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
      await navigator.clipboard?.writeText(text()); toast.success("Summary copied" + (blob ? " · image downloaded" : ""));
    } catch (e) { if ((e as Error)?.name !== "AbortError") { try { await navigator.clipboard.writeText(text()); toast.success("Summary copied"); } catch { toast.error("Could not share"); } } }
  };

  const dur = shortDur(+new Date(s.endedAt) - +new Date(s.startedAt));
  const sets = exs.reduce((a, e) => a + e.sets.filter((x) => x.done).length, 0);
  const pr = new Set(s.prEx ?? []);
  const iconBtn = "flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:translate-y-px";
  return (
    <div role="dialog" aria-modal aria-label="Workout complete" data-testid="finish-screen" className="fixed inset-0 z-[100] overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full max-w-md flex-col px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(0.5rem+env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onClose} aria-label="Close" className={iconBtn}><X className="size-5" /></button>
          <button type="button" onClick={share} aria-label="Share" className={iconBtn}><Share className="size-[18px]" /></button>
        </div>

        <div className="flex flex-1 flex-col justify-center py-4">
          <div className="lr-rise text-center">
            <span aria-hidden className="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Check className="size-6" strokeWidth={2.5} /></span>
            <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-tight">Great Job!</h1>
            <p className="mt-1.5 text-[15px] text-muted-foreground">{s.count ? `That's your ${ordinal(s.count)} workout!` : s.offline ? "Saved offline. It'll sync when you're back online." : "Workout logged."}</p>
          </div>

          <div className="lr-print mt-7 drop-shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:drop-shadow-none">
            <div ref={card} className="receipt rounded-sm px-6 pb-6 pt-7">
              <div className="flex items-baseline justify-between gap-3">
                <p className="mono-label text-[10px]">Fortis</p>
                <p className="mono-label text-[10px]">{d0.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <p className="mt-3 truncate text-xl font-semibold tracking-tight">{s.name}</p>
              <p className="text-sm text-muted-foreground">{dateStr}</p>

              <div className="mt-5 grid grid-cols-3 border-y border-dashed py-3.5 text-center">
                {[{ I: Clock, v: dur, l: "Time" }, { I: Dumbbell, v: `${fmtNum(vol)} ${s.unit}`, l: "Volume" }, { I: Trophy, v: String(s.prs ?? 0), l: s.prs === 1 ? "PR" : "PRs" }].map(({ I, v, l }) => (
                  <div key={l} className="flex flex-col items-center gap-1">
                    <span className="flex items-center gap-1.5 font-mono text-[15px] tabular-nums"><I className="size-3.5 shrink-0 text-muted-foreground" />{v}</span>
                    <span className="mono-label text-[9px]">{l}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between"><span className="mono-label text-[10px]">Exercise</span><span className="mono-label text-[10px]">Best set</span></div>
              <ul className="mt-2 space-y-2 text-sm">
                {exs.map((e, i) => (
                  <li key={i} className="flex items-baseline gap-3">
                    <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{e.sets.filter((x) => x.done).length}×</span>
                    <span className="min-w-0 flex-1 truncate">{e.name}</span>
                    {pr.has(e.exerciseId) && <span className="shrink-0 rounded-full border border-amber-500/40 px-1.5 py-px font-mono text-[9px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400" aria-label="Personal record">PR</span>}
                    <span className="shrink-0 text-right font-mono tabular-nums">{fmtSet(bestSet(e))}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex justify-between border-t border-dashed pt-3.5 font-mono text-sm tabular-nums">
                <span className="mono-label self-center text-[10px]">Total</span>
                <span>{exs.length} exercises · {sets} sets</span>
              </div>
              {!!s.next?.length && (
                <div className="mt-4 border-t border-dashed pt-3.5" data-testid="next-time">
                  <p className="mono-label text-[10px]">Next time</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {s.next.map((n, i) => (
                      <li key={i} className="flex items-baseline gap-3"><span className="min-w-0 flex-1 truncate">{n.name}</span><span className="shrink-0 text-right font-mono text-xs tabular-nums">{n.label.replace(/^Progress: /, "")}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <div aria-hidden className="mx-auto mt-5 h-7 w-3/4 opacity-70 [background:repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_4px,currentColor_4px_5px,transparent_5px_8px,currentColor_8px_11px,transparent_11px_13px)]" />
              <p className="mono-label mt-2 text-center text-[9px]">Thank you · come again</p>
            </div>
          </div>
        </div>

        <div className="lr-rise grid grid-cols-[auto_1fr] gap-3 [animation-delay:200ms]">
          <button type="button" onClick={share} className="h-12 rounded-xl border px-5 text-sm font-medium active:translate-y-px"><span className="flex items-center gap-2"><Share className="size-4" />Share</span></button>
          <button type="button" onClick={onClose} className="h-12 rounded-xl bg-foreground text-sm font-semibold text-background active:translate-y-px">Done</button>
        </div>
      </div>
    </div>
  );
}
