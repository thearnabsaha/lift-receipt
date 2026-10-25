"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronUp, Link2, MoreHorizontal, Plus, StickyNote, Timer, Trash2, Unlink, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ExercisePicker, type ExerciseLite } from "@/components/exercise-picker";
import { useSettings } from "@/components/settings-context";
import { saveRoutineAction, saveWorkoutAction } from "@/app/actions";
import { queueWorkout } from "@/lib/offline";
import { formatDuration, toDisplay, toKg } from "@/lib/calc";
import type { SetType, WorkoutExercise } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { uid, toEditorExercises, type ESet, type EditorState, type PrevMap } from "@/lib/editor";
export { toEditorExercises, type EditorState, type PrevMap };

type Mode = "live" | "edit" | "routine";

const nowMs = () => Date.now();
export const ACTIVE_KEY = "lr-active-workout";
const blankSet = (): ESet => ({ type: "normal", weight: "", reps: "", rpe: "", done: false });
const TYPE_LABEL: Record<SetType, string> = { warmup: "W", normal: "", drop: "D", failure: "F" };
const TYPE_ORDER: SetType[] = ["normal", "warmup", "drop", "failure"];

function toPayloadExercises(st: EditorState, onlyDone: boolean): WorkoutExercise[] {
  const n = (v: string) => (v.trim() === "" ? null : Number(v));
  return st.exercises.map((e) => ({
    exerciseId: e.exerciseId, name: e.name, notes: e.notes || undefined, supersetId: e.supersetId, restSec: e.restSec,
    sets: e.sets.filter((s) => !onlyDone || s.done).map((s) => ({ type: s.type, weight: toKg(n(s.weight), st.unit), reps: n(s.reps) == null ? null : Math.round(n(s.reps)!), rpe: n(s.rpe), done: onlyDone ? true : s.done })),
  })).filter((e) => !onlyDone || e.sets.length);
}

function useWakeLock(on: boolean) {
  useEffect(() => {
    if (!on || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    const req = async () => { try { lock = await navigator.wakeLock.request("screen"); } catch {} };
    req();
    const vis = () => { if (document.visibilityState === "visible") req(); };
    document.addEventListener("visibilitychange", vis);
    return () => { document.removeEventListener("visibilitychange", vis); lock?.release().catch(() => {}); };
  }, [on]);
}

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.15; o.start(); o.stop(ctx.currentTime + 0.25);
    navigator.vibrate?.([200, 100, 200]);
  } catch {}
}

export function WorkoutEditor({ mode, initial, exercises, prev }: { mode: Mode; initial: EditorState; exercises: ExerciseLite[]; prev: PrevMap }) {
  const router = useRouter();
  const settings = useSettings();
  const [st, setSt] = useState<EditorState>(initial);
  const [now, setNow] = useState(() => Date.now());
  const [rest, setRest] = useState<{ end: number; total: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const live = mode === "live";
  const unit = st.unit;
  useWakeLock(live);

  // persist live workout
  useEffect(() => { if (live) localStorage.setItem(ACTIVE_KEY, JSON.stringify(st)); }, [st, live]);
  const restRef = useRef(rest);
  useEffect(() => { restRef.current = rest; }, [rest]);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      const n = Date.now(); setNow(n);
      if (restRef.current && n >= restRef.current.end) { restRef.current = null; beep(); toast("Rest over. Next set."); setRest(null); }
    }, 1000);
    return () => clearInterval(t);
  }, [live]);

  const upd = useCallback((fn: (s: EditorState) => void) => setSt((p) => { const n = structuredClone(p); fn(n); return n; }), []);
  const startRest = useCallback((sec: number) => { if (sec > 0) setRest({ end: nowMs() + sec * 1000, total: sec }); }, []);

  const addExercises = (list: ExerciseLite[], superset: boolean) => upd((s) => {
    const sid = superset ? uid() : null;
    for (const e of list) {
      const p = prev[e.id];
      s.exercises.push({ key: uid(), exerciseId: e.id, name: e.name, notes: "", showNotes: false, supersetId: sid, restSec: null,
        sets: p?.length ? p.map((x) => ({ ...blankSet(), type: x.type })) : [blankSet(), blankSet(), blankSet()] });
    }
  });

  const toggleDone = (ei: number, si: number) => {
    const ex = st.exercises[ei]; const set = ex.sets[si];
    const willBeDone = !set.done;
    upd((s) => {
      const x = s.exercises[ei].sets[si];
      if (willBeDone) {
        const p = prev[ex.exerciseId]?.[si];
        if (!x.weight && p?.weight != null) x.weight = String(toDisplay(p.weight, s.unit));
        if (!x.reps && p?.reps != null) x.reps = String(p.reps);
      }
      x.done = willBeDone;
    });
    if (willBeDone && live && settings.autoRest) {
      // in a superset, rest only after the last exercise of the group
      const grp = ex.supersetId ? st.exercises.filter((e) => e.supersetId === ex.supersetId) : [ex];
      if (grp[grp.length - 1].key === ex.key) startRest(ex.restSec ?? settings.restSec);
    }
  };

  const save = async () => {
    if (mode === "routine") {
      if (!st.name.trim()) return toast.error("Name your routine");
      setSaving(true);
      try {
        const r = await saveRoutineAction(st.id ?? null, { name: st.name, folder: st.folder || null, notes: st.notes || null, exercises: toPayloadExercises(st, false).map((e) => ({ ...e, sets: e.sets.map((x) => ({ ...x, done: false })) })) });
        toast.success("Routine saved"); router.push(`/workout`); router.refresh(); void r;
      } catch { toast.error("Could not save routine"); } finally { setSaving(false); }
      return;
    }
    const exs = toPayloadExercises(st, live);
    if (live && !exs.length) return toast.error("Complete at least one set (tap ✓)");
    const id = st.id ?? crypto.randomUUID();
    const payload = { id, name: st.name || "Workout", notes: st.notes || null, routineId: st.routineId, startedAt: new Date(st.startedAt).toISOString(), endedAt: live ? new Date().toISOString() : st.endedAt, exercises: exs };
    setSaving(true);
    try {
      if (!navigator.onLine) throw new Error("offline");
      await saveWorkoutAction(payload);
      if (live) localStorage.removeItem(ACTIVE_KEY);
      toast.success(live ? "Workout finished. Receipt printed." : "Workout updated");
      router.push(`/history/${id}`); router.refresh();
    } catch {
      if (live) {
        await queueWorkout(id, payload);
        localStorage.removeItem(ACTIVE_KEY);
        toast.success("Saved offline. Will sync when you're back online.");
        router.push("/workout");
      } else toast.error("Could not save");
    } finally { setSaving(false); }
  };

  const cancel = () => { localStorage.removeItem(ACTIVE_KEY); router.push("/workout"); };
  const elapsed = now - new Date(st.startedAt).getTime();
  const restLeft = rest ? Math.max(0, rest.end - now) : 0;
  const doneSets = st.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);
  const volume = st.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done && s.type !== "warmup").reduce((b, s) => b + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0), 0);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        {live && <span className="mono-label flex items-center gap-1"><Clock className="size-3" /> {formatDuration(elapsed)}</span>}
        {mode === "routine" && <span className="mono-label">{st.id ? "Edit routine" : "New routine"}</span>}
        {mode === "edit" && <span className="mono-label">Edit workout</span>}
        <div className="ml-auto flex gap-2">
          {live && (
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="ghost" size="sm">Cancel</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Discard workout?</AlertDialogTitle><AlertDialogDescription>All sets in this session will be lost.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Keep going</AlertDialogCancel><AlertDialogAction onClick={cancel}>Discard</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button size="sm" className="bg-success text-white hover:bg-success/80" disabled={saving} onClick={save}>{live ? "Finish" : "Save"}</Button>
        </div>
      </div>

      <Input value={st.name} onChange={(e) => upd((s) => { s.name = e.target.value; })} placeholder={mode === "routine" ? "Routine name" : "Workout name"}
        className="mb-2 h-auto border-0 bg-transparent px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 md:text-3xl dark:bg-transparent" />
      {mode === "routine" && <Input value={st.folder} onChange={(e) => upd((s) => { s.folder = e.target.value; })} placeholder="Folder (optional)" className="mb-2 h-9 max-w-xs" />}
      {mode === "edit" && (
        <div className="mb-2 grid grid-cols-2 gap-2">
          <label className="text-xs"><span className="mono-label">Start</span>
            <Input type="datetime-local" value={toLocalInput(st.startedAt)} onChange={(e) => upd((s) => { const d = new Date(e.target.value); const dur = s.endedAt ? +new Date(s.endedAt) - +new Date(s.startedAt) : 0; s.startedAt = d.toISOString(); if (s.endedAt) s.endedAt = new Date(+d + dur).toISOString(); })} /></label>
          <label className="text-xs"><span className="mono-label">Duration (min)</span>
            <Input type="number" inputMode="numeric" value={st.endedAt ? Math.round((+new Date(st.endedAt) - +new Date(st.startedAt)) / 60000) : ""} onChange={(e) => upd((s) => { s.endedAt = new Date(+new Date(s.startedAt) + Number(e.target.value || 0) * 60000).toISOString(); })} /></label>
        </div>
      )}
      <Textarea value={st.notes} onChange={(e) => upd((s) => { s.notes = e.target.value; })} placeholder={mode === "routine" ? "Routine notes" : "Workout notes"} className="mb-4 min-h-10 resize-none text-sm" rows={1} />

      {live && (
        <div className="mb-4 grid grid-cols-3 rounded-xl border bg-card px-4 py-3 text-center">
          <div><p className="mono-label">Duration</p><p className="font-semibold tabular-nums">{formatDuration(elapsed)}</p></div>
          <div><p className="mono-label">Volume</p><p className="font-semibold tabular-nums">{Math.round(volume).toLocaleString()}<span className="ml-0.5 text-xs text-muted-foreground">{unit}</span></p></div>
          <div><p className="mono-label">Sets</p><p className="font-semibold tabular-nums">{doneSets}</p></div>
        </div>
      )}

      <div className="space-y-4">
        {st.exercises.map((ex, ei) => {
          const p = prev[ex.exerciseId];
          const inSS = !!ex.supersetId;
          const ssFirst = inSS && st.exercises[ei - 1]?.supersetId !== ex.supersetId;
          const ssLast = inSS && st.exercises[ei + 1]?.supersetId !== ex.supersetId;
          return (
            <div key={ex.key} className={cn(inSS && "border-l-2 border-chart-1 pl-3", inSS && !ssLast && "-mb-2")}>
              {ssFirst && <p className="mono-label mb-1 text-chart-1">Superset</p>}
              <div className="rounded-xl border bg-card p-3 shadow-[0_1px_3px_#0000001a]">
                <div className="mb-2 flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate font-semibold text-chart-1">{ex.name}</p>
                  {ex.restSec != null && <span className="mono-label">{ex.restSec}s rest</span>}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="Exercise options"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => upd((s) => { s.exercises[ei].showNotes = true; })}><StickyNote className="size-4" />Add note</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { const v = prompt("Rest timer for this exercise (seconds). Empty = default", String(ex.restSec ?? settings.restSec)); if (v !== null) upd((s) => { s.exercises[ei].restSec = v.trim() ? Math.max(0, Number(v) || 0) : null; }); }}><Timer className="size-4" />Rest timer</DropdownMenuItem>
                      {ei < st.exercises.length - 1 && (
                        inSS ? <DropdownMenuItem onClick={() => upd((s) => { s.exercises[ei].supersetId = null; })}><Unlink className="size-4" />Remove from superset</DropdownMenuItem>
                          : <DropdownMenuItem onClick={() => upd((s) => { const id = s.exercises[ei + 1].supersetId ?? uid(); s.exercises[ei].supersetId = id; s.exercises[ei + 1].supersetId = id; })}><Link2 className="size-4" />Superset with next</DropdownMenuItem>
                      )}
                      {ei === st.exercises.length - 1 && inSS && <DropdownMenuItem onClick={() => upd((s) => { s.exercises[ei].supersetId = null; })}><Unlink className="size-4" />Remove from superset</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled={ei === 0} onClick={() => upd((s) => { const [x] = s.exercises.splice(ei, 1); s.exercises.splice(ei - 1, 0, x); })}><ChevronUp className="size-4" />Move up</DropdownMenuItem>
                      <DropdownMenuItem disabled={ei === st.exercises.length - 1} onClick={() => upd((s) => { const [x] = s.exercises.splice(ei, 1); s.exercises.splice(ei + 1, 0, x); })}><ChevronDown className="size-4" />Move down</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => upd((s) => { s.exercises.splice(ei, 1); })}><Trash2 className="size-4" />Remove exercise</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {ex.showNotes && <Textarea value={ex.notes} onChange={(e) => upd((s) => { s.exercises[ei].notes = e.target.value; })} placeholder="Exercise note" rows={1} className="mb-2 min-h-9 resize-none text-sm" />}
                <div className="grid grid-cols-[2rem_1fr_4.2rem_3.6rem_2.8rem_2.25rem] items-center gap-1.5 text-center sm:grid-cols-[2.25rem_1fr_5rem_4.5rem_3.5rem_2.5rem]">
                  <span className="mono-label text-[10px]">Set</span><span className="mono-label text-[10px]">Previous</span>
                  <span className="mono-label text-[10px]">{unit}</span><span className="mono-label text-[10px]">Reps</span><span className="mono-label text-[10px]">RPE</span>
                  <span className="flex justify-center">{mode === "routine" ? "" : <Check className="size-3.5 text-muted-foreground" />}</span>
                  {ex.sets.map((s, si) => {
                    const pv = p?.[si];
                    const num = ex.sets.slice(0, si + 1).filter((x) => x.type !== "warmup").length;
                    return (
                      <div key={si} className={cn("contents", s.done && "[&>*]:bg-success/10")}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className={cn("h-9 rounded-md font-mono text-sm font-semibold", s.type === "warmup" && "text-amber-500", s.type === "drop" && "text-chart-1", s.type === "failure" && "text-destructive")}>
                              {TYPE_LABEL[s.type] || num}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {TYPE_ORDER.map((t) => <DropdownMenuItem key={t} onClick={() => upd((x) => { x.exercises[ei].sets[si].type = t; })}>{t === "normal" ? "Normal set" : t === "warmup" ? "Warm-up" : t === "drop" ? "Drop set" : "Failure"}</DropdownMenuItem>)}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => upd((x) => { x.exercises[ei].sets.splice(si, 1); })}><X className="size-4" />Delete set</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <button type="button" className="h-9 truncate rounded-md font-mono text-xs text-muted-foreground" title="Tap to copy"
                          onClick={() => pv && upd((x) => { const t = x.exercises[ei].sets[si]; t.weight = pv.weight == null ? "" : String(toDisplay(pv.weight, unit)); t.reps = pv.reps == null ? "" : String(pv.reps); })}>
                          {pv ? `${pv.weight != null ? toDisplay(pv.weight, unit) : "BW"} × ${pv.reps ?? "-"}` : "—"}
                        </button>
                        <Input inputMode="decimal" aria-label="Weight" className="h-9 px-1 text-center tabular-nums" placeholder={pv?.weight != null ? String(toDisplay(pv.weight, unit)) : ""} value={s.weight} onChange={(e) => upd((x) => { x.exercises[ei].sets[si].weight = e.target.value.replace(",", "."); })} />
                        <Input inputMode="numeric" aria-label="Reps" className="h-9 px-1 text-center tabular-nums" placeholder={pv?.reps != null ? String(pv.reps) : ""} value={s.reps} onChange={(e) => upd((x) => { x.exercises[ei].sets[si].reps = e.target.value; })} />
                        <Input inputMode="decimal" aria-label="RPE" className="h-9 px-1 text-center tabular-nums" value={s.rpe} onChange={(e) => upd((x) => { x.exercises[ei].sets[si].rpe = e.target.value; })} />
                        {mode === "routine" ? <button type="button" aria-label="Delete set" className="flex h-9 items-center justify-center text-muted-foreground" onClick={() => upd((x) => { x.exercises[ei].sets.splice(si, 1); })}><X className="size-4" /></button> : (
                          <button type="button" aria-label="Complete set" onClick={() => toggleDone(ei, si)}
                            className={cn("flex h-9 items-center justify-center rounded-md border transition-colors active:translate-y-px", s.done ? "border-success bg-success text-white" : "bg-muted")}>
                            <Check className="size-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" size="sm" className="mt-2 w-full border border-dashed" onClick={() => upd((s) => { const last = s.exercises[ei].sets.at(-1); s.exercises[ei].sets.push({ ...blankSet(), type: last?.type === "warmup" ? "normal" : last?.type ?? "normal" }); })}>
                  <Plus className="size-4" />Add set
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <ExercisePicker exercises={exercises} onPick={addExercises} trigger={<Button variant="outline" className="mt-4 h-11 w-full"><Plus className="size-4" />Add exercises</Button>} />

      {live && rest && (
        <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 mx-auto w-[calc(100%-2rem)] max-w-md md:bottom-6">
          <div className="overflow-hidden rounded-xl border bg-popover shadow-lg">
            <div className="h-1 bg-chart-1 transition-[width] duration-1000 ease-linear" style={{ width: `${(restLeft / (rest.total * 1000)) * 100}%` }} />
            <div className="flex items-center gap-2 px-3 py-2">
              <Timer className="size-4" /><span className="mono-label">Rest</span>
              <span className="text-xl font-semibold tabular-nums">{formatDuration(restLeft)}</span>
              <div className="ml-auto flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setRest((r) => r && { ...r, end: Math.max(nowMs(), r.end - 15000), total: Math.max(1, r.total - 15) })}>−15</Button>
                <Button size="sm" variant="outline" onClick={() => setRest((r) => r && { end: r.end + 15000, total: r.total + 15 })}>+15</Button>
                <Button size="sm" onClick={() => setRest(null)}>Skip</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {live && !rest && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {[60, 90, 120, 180].map((s) => <Button key={s} size="sm" variant="ghost" className="font-mono text-xs" onClick={() => startRest(s)}><Timer className="size-3" />{s}s</Button>)}
        </div>
      )}
    </div>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso); const off = d.getTimezoneOffset();
  return new Date(+d - off * 60000).toISOString().slice(0, 16);
}
