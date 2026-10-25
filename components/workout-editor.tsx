"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronUp, Link2, MoreHorizontal, Plus, StickyNote, Trash2, Unlink, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ExercisePicker, type ExerciseLite } from "@/components/exercise-picker";
import { saveRoutineAction, saveWorkoutAction } from "@/app/actions";
import { queueWorkout } from "@/lib/offline";
import { formatDuration, toDisplay, toKg } from "@/lib/calc";
import type { SetType, WorkoutExercise } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { usePref, useIdleHours } from "@/lib/prefs";
import { IdleDialog } from "@/components/idle-prompt";
import { idleEndTime, idleMs, isIdle, IDLE_FINISH_FLAG } from "@/lib/idle";
import { playSetDone, unlockAudio } from "@/lib/sound";
import { SwipeRow } from "@/components/swipe-row";
import { FinishScreen, type FinishSummary } from "@/components/finish-screen";
import { applyEverything, applyValuesOnly, diffRoutine, summarize, type RoutineDiff } from "@/lib/routine-diff";
import { queueRoutineUpdate } from "@/lib/offline";
import { Replace } from "lucide-react";
import { uid, toEditorExercises, setFieldWithAutofill, nextSet, reflowAuto, type ESet, type EditorState, type PrevMap } from "@/lib/editor";
export { toEditorExercises, type EditorState, type PrevMap };

type Mode = "live" | "edit" | "routine";

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
    // iOS 16.4+ standalone supports this; the lock is dropped whenever the page is hidden, so re-acquire on return.
    const req = async () => { if (lock && !lock.released) return; try { lock = await navigator.wakeLock.request("screen"); } catch { lock = null; } };
    req();
    const vis = () => { if (document.visibilityState === "visible") req(); };
    document.addEventListener("visibilitychange", vis);
    return () => { document.removeEventListener("visibilitychange", vis); lock?.release().catch(() => {}); };
  }, [on]);
}



export function WorkoutEditor({ mode, initial, exercises, prev }: { mode: Mode; initial: EditorState; exercises: ExerciseLite[]; prev: PrevMap }) {
  const router = useRouter();
  const [st, setSt] = useState<EditorState>(() => (mode === "live" && !initial.draftId ? { ...initial, draftId: crypto.randomUUID(), lastActivityAt: initial.lastActivityAt ?? new Date().toISOString() } : initial));
  const endRef = useRef<string | null>(null); // set when finishing from the idle prompt
  const [idleBusy, setIdleBusy] = useState(false);
  const idleHours = useIdleHours();
  const [now, setNow] = useState(() => Date.now());
  const [saving, setSaving] = useState(false);
  const live = mode === "live";
  const showRpe = usePref("showRpe");
  const [replaceIdx, setReplaceIdx] = useState<number | null>(null);
  const [routinePrompt, setRoutinePrompt] = useState<RoutineDiff | null>(null);
  const [finish, setFinish] = useState<FinishSummary | null>(null);
  const unit = st.unit;
  useWakeLock(live);

  // persist live workout
  useEffect(() => { if (live) localStorage.setItem(ACTIVE_KEY, JSON.stringify(st)); }, [st, live]);
  useEffect(() => {
    if (!live) return;
    const tick = () => setNow(Date.now());
    const t = setInterval(tick, 500);
    const vis = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", vis);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", vis); };
  }, [live]);

  const upd = useCallback((fn: (s: EditorState) => void) => setSt((p) => { const n = structuredClone(p); fn(n); if (mode === "live") n.lastActivityAt = new Date().toISOString(); return n; }), [mode]);

  const addExercises = (list: ExerciseLite[], superset: boolean) => upd((s) => {
    const sid = superset ? uid() : null;
    for (const e of list) {
      const p = prev[e.id];
      s.exercises.push({ key: uid(), exerciseId: e.id, name: e.name, notes: "", showNotes: false, supersetId: sid, restSec: null,
        sets: p?.length ? p.map((x) => ({ ...blankSet(), type: x.type })) : [blankSet(), blankSet(), blankSet()] });
    }
  });

  const deleteSet = (ei: number, si: number) => {
    const key = st.exercises[ei]?.key; const removed = st.exercises[ei]?.sets[si]; if (!removed) return;
    upd((s) => { const e = s.exercises[ei]; e.sets.splice(si, 1); e.sets = reflowAuto(e.sets, si); });
    toast("Set deleted", { duration: 5000, action: { label: "Undo", onClick: () => upd((s) => { const e = s.exercises.find((x) => x.key === key); if (e) e.sets.splice(Math.min(si, e.sets.length), 0, removed); }) } });
  };
  const replaceExercise = (list: ExerciseLite[], keep: boolean) => {
    const e = list[0]; const ei = replaceIdx; if (!e || ei == null) return;
    upd((s) => { const x = s.exercises[ei]; if (!x) return; x.exerciseId = e.id; x.name = e.name;
      if (!keep) x.sets = x.sets.map((t) => ({ ...t, weight: "", reps: "", rpe: "", done: false, auto: {} })); });
    toast.success(`Replaced with ${e.name}`);
  };

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
    if (willBeDone && mode !== "routine") { unlockAudio(); playSetDone(); }
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
    if (live && st.routineId && st.template) {
      const d = diffRoutine(st.template.exercises, toPayloadExercises(st, false));
      if (d.changed) { setRoutinePrompt(d); return; }
    }
    return commit(null);
  };

  /** Update the source routine ("all" | "values"), then log the workout and show the finish screen. */
  const commit = async (choice: "all" | "values" | null) => {
    setRoutinePrompt(null);
    if (choice && st.routineId && st.template) {
      const actual = toPayloadExercises(st, false);
      const upd = { id: st.routineId, name: st.template.name, folder: st.template.folder, notes: st.template.notes,
        exercises: choice === "all" ? applyEverything(actual) : applyValuesOnly(st.template.exercises, actual) };
      try { if (!navigator.onLine) throw new Error("offline"); const { id, ...rest } = upd; await saveRoutineAction(id, rest); toast.success("Routine updated"); }
      catch { await queueRoutineUpdate(upd); toast("Routine update queued. Syncs when online."); }
    }
    const exs = toPayloadExercises(st, live);
    const id = st.id ?? st.draftId ?? crypto.randomUUID(); // stable per draft: no duplicate rows / queue entries
    const payload = { id, name: st.name || "Workout", notes: st.notes || null, routineId: st.routineId, startedAt: new Date(st.startedAt).toISOString(), endedAt: live ? (endRef.current ?? new Date().toISOString()) : st.endedAt, exercises: exs };
    setSaving(true);
    try {
      if (!navigator.onLine) throw new Error("offline");
      const res = await saveWorkoutAction(payload);
      if (live) {
        localStorage.removeItem(ACTIVE_KEY);
        if (res.count) localStorage.setItem("lr-workout-count", String(res.count));
        setFinish({ id, name: payload.name, startedAt: payload.startedAt, endedAt: payload.endedAt!, unit: st.unit, exercises: exs, count: res.count, prs: res.prs });
        return;
      }
      toast.success("Workout updated");
      router.push(`/history/${id}`); router.refresh();
    } catch {
      if (live) {
        await queueWorkout(id, payload);
        localStorage.removeItem(ACTIVE_KEY);
        const c = Number(localStorage.getItem("lr-workout-count")) || 0;
        if (c) localStorage.setItem("lr-workout-count", String(c + 1));
        setFinish({ id, name: payload.name, startedAt: payload.startedAt, endedAt: payload.endedAt!, unit: st.unit, exercises: exs, count: c ? c + 1 : null, prs: null, offline: true });
      } else toast.error("Could not save");
    } finally { setSaving(false); endRef.current = null; setIdleBusy(false); }
  };

  const finishIdle = () => {
    if (!toPayloadExercises(st, true).length) { toast.error("No completed sets. Resume or discard."); return; }
    endRef.current = idleEndTime(st); setIdleBusy(true); void save();
  };
  // the app-wide prompt asked us to finish on arrival
  const flagDone = useRef(false);
  useEffect(() => {
    if (!live || flagDone.current || localStorage.getItem(IDLE_FINISH_FLAG) !== "1") return;
    flagDone.current = true; localStorage.removeItem(IDLE_FINISH_FLAG);
    const t = setTimeout(finishIdle, 0); return () => clearTimeout(t);
  });

  const cancel = () => { localStorage.removeItem(ACTIVE_KEY); router.push("/workout"); };
  const idleOpen = live && !finish && !routinePrompt && !idleBusy && !saving && isIdle(st, idleHours, now);
  const cols = cn("grid items-center gap-1.5 text-center", showRpe ? "grid-cols-[2rem_1fr_4.2rem_3.6rem_2.8rem_2.25rem] sm:grid-cols-[2.25rem_1fr_5rem_4.5rem_3.5rem_2.5rem]" : "grid-cols-[2rem_1fr_4.6rem_4rem_2.25rem] sm:grid-cols-[2.25rem_1fr_5.5rem_5rem_2.5rem]");
  const elapsed = now - new Date(st.startedAt).getTime();
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
              <AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="h-11 px-4 text-destructive">Discard workout</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Discard workout?</AlertDialogTitle><AlertDialogDescription>All sets in this session will be lost.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Keep going</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={cancel}>Discard</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button size="sm" className="h-11 px-5 bg-success text-white hover:bg-success/80" disabled={saving} onClick={save}>{live ? "Finish" : "Save"}</Button>
        </div>
      </div>

      <Input value={st.name} onChange={(e) => upd((s) => { s.name = e.target.value; })} placeholder={mode === "routine" ? "Routine name" : "Workout name"}
        className="mb-2 h-auto border-0 bg-transparent px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 md:text-3xl dark:bg-transparent" />
      {mode === "routine" && <Input value={st.folder} onChange={(e) => upd((s) => { s.folder = e.target.value; })} placeholder="Folder (optional)" className="mb-2 h-11 max-w-xs" />}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-11" aria-label="Exercise options"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => upd((s) => { s.exercises[ei].showNotes = true; })}><StickyNote className="size-4" />Add note</DropdownMenuItem>
                      {ei < st.exercises.length - 1 && (
                        inSS ? <DropdownMenuItem onClick={() => upd((s) => { s.exercises[ei].supersetId = null; })}><Unlink className="size-4" />Remove from superset</DropdownMenuItem>
                          : <DropdownMenuItem onClick={() => upd((s) => { const id = s.exercises[ei + 1].supersetId ?? uid(); s.exercises[ei].supersetId = id; s.exercises[ei + 1].supersetId = id; })}><Link2 className="size-4" />Superset with next</DropdownMenuItem>
                      )}
                      {ei === st.exercises.length - 1 && inSS && <DropdownMenuItem onClick={() => upd((s) => { s.exercises[ei].supersetId = null; })}><Unlink className="size-4" />Remove from superset</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled={ei === 0} onClick={() => upd((s) => { const [x] = s.exercises.splice(ei, 1); s.exercises.splice(ei - 1, 0, x); })}><ChevronUp className="size-4" />Move up</DropdownMenuItem>
                      <DropdownMenuItem disabled={ei === st.exercises.length - 1} onClick={() => upd((s) => { const [x] = s.exercises.splice(ei, 1); s.exercises.splice(ei + 1, 0, x); })}><ChevronDown className="size-4" />Move down</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setTimeout(() => setReplaceIdx(ei), 0)}><Replace className="size-4" />Replace exercise</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => upd((s) => { s.exercises.splice(ei, 1); })}><Trash2 className="size-4" />Remove exercise</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {ex.showNotes && <Textarea value={ex.notes} onChange={(e) => upd((s) => { s.exercises[ei].notes = e.target.value; })} placeholder="Exercise note" rows={1} className="mb-2 min-h-11 resize-none text-sm" />}
                <div className="space-y-1">
                <div className={cn(cols, "h-6")}>
                  <span className="mono-label text-[10px]">Set</span><span className="mono-label text-[10px]">Previous</span>
                  <span className="mono-label text-[10px]">{unit}</span><span className="mono-label text-[10px]">Reps</span>{showRpe && <Popover><PopoverTrigger asChild><button type="button" className="mono-label inline-flex items-center justify-center gap-0.5 text-[10px]" aria-label="What is RPE?">RPE<Info className="size-3" /></button></PopoverTrigger><PopoverContent className="w-60 text-xs"><p className="font-semibold">Rate of perceived exertion, 1–10.</p><p className="mt-1 text-muted-foreground">10 = no reps left, 8 = ~2 reps left. Optional. Hide it in Settings.</p></PopoverContent></Popover>}
                  <span className="flex justify-center">{mode === "routine" ? "" : <Check className="size-3.5 text-muted-foreground" />}</span>
                </div>
                  {ex.sets.map((s, si) => {
                    const pv = p?.[si];
                    const num = ex.sets.slice(0, si + 1).filter((x) => x.type !== "warmup").length;
                    return (
                      <SwipeRow key={`${ex.key}-${si}-${ex.sets.length}`} onDelete={() => deleteSet(ei, si)} className={cn(cols, s.done && "bg-success/10")}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className={cn("h-11 rounded-md font-mono text-sm font-semibold", s.type === "warmup" && "text-amber-500", s.type === "drop" && "text-chart-1", s.type === "failure" && "text-destructive")}>
                              {TYPE_LABEL[s.type] || num}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {TYPE_ORDER.map((t) => <DropdownMenuItem key={t} onClick={() => upd((x) => { x.exercises[ei].sets[si].type = t; })}>{t === "normal" ? "Normal set" : t === "warmup" ? "Warm-up" : t === "drop" ? "Drop set" : "Failure"}</DropdownMenuItem>)}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => deleteSet(ei, si)}><X className="size-4" />Delete set</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <button type="button" className="h-11 truncate rounded-md font-mono text-xs text-muted-foreground" title="Tap to copy"
                          onClick={() => pv && upd((x) => { const t = x.exercises[ei].sets[si]; t.weight = pv.weight == null ? "" : String(toDisplay(pv.weight, unit)); t.reps = pv.reps == null ? "" : String(pv.reps); t.auto = {}; })}>
                          {pv ? `${pv.weight != null ? toDisplay(pv.weight, unit) : "BW"} × ${pv.reps ?? "-"}` : "—"}
                        </button>
                        <Input inputMode="decimal" enterKeyHint="next" aria-label="Weight" className="h-11 px-1 text-center tabular-nums" placeholder={pv?.weight != null ? String(toDisplay(pv.weight, unit)) : ""} value={s.weight} onChange={(e) => { const v = e.target.value.replace(",", "."); upd((x) => { x.exercises[ei].sets = setFieldWithAutofill(x.exercises[ei].sets, si, "weight", v); }); }} />
                        <Input inputMode="numeric" enterKeyHint="next" aria-label="Reps" className="h-11 px-1 text-center tabular-nums" placeholder={pv?.reps != null ? String(pv.reps) : ""} value={s.reps} onChange={(e) => { const v = e.target.value; upd((x) => { x.exercises[ei].sets = setFieldWithAutofill(x.exercises[ei].sets, si, "reps", v); }); }} />
                        {showRpe && <Input inputMode="decimal" enterKeyHint="done" aria-label="RPE" className="h-11 px-1 text-center tabular-nums" value={s.rpe} onChange={(e) => upd((x) => { x.exercises[ei].sets[si].rpe = e.target.value; })} />}
                        {mode === "routine" ? <button type="button" aria-label="Delete set" className="flex h-11 items-center justify-center text-muted-foreground" onClick={() => deleteSet(ei, si)}><X className="size-4" /></button> : (
                          <button type="button" aria-label="Complete set" onClick={() => toggleDone(ei, si)}
                            className={cn("flex h-11 items-center justify-center rounded-md border transition-colors active:translate-y-px", s.done ? "border-success bg-success text-white" : "bg-muted")}>
                            <Check className="size-4" />
                          </button>
                        )}
                      </SwipeRow>
                    );
                  })}
                </div>
                <Button variant="ghost" size="sm" className="mt-2 h-11 w-full border border-dashed" onClick={() => upd((s) => { const e = s.exercises[ei]; const pv = prev[e.exerciseId]?.[e.sets.length]; e.sets.push(nextSet(e.sets, pv ? { type: pv.type, weight: pv.weight == null ? "" : String(toDisplay(pv.weight, s.unit)), reps: pv.reps == null ? "" : String(pv.reps) } : null)); })}>
                  <Plus className="size-4" />Add set
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <ExercisePicker exercises={exercises} open={replaceIdx != null} onOpenChange={(o) => { if (!o) setReplaceIdx(null); }} replace={replaceIdx != null ? st.exercises[replaceIdx]?.name ?? "" : undefined} onPick={(l, _s, keep) => replaceExercise(l, keep)} />
      <AlertDialog open={!!routinePrompt} onOpenChange={(o) => { if (!o) setRoutinePrompt(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You changed this workout. Update routine?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div><p className="mono-label text-[10px]">Changes vs “{st.template?.name}”</p>
                <ul className="mt-1 font-mono text-xs">{routinePrompt && summarize(routinePrompt).map((l) => <li key={l}>· {l}</li>)}</ul>
                <p className="mt-2 text-xs">Your workout is logged either way.</p></div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2">
            <Button className="h-11" disabled={saving} onClick={() => commit("all")}>Save everything</Button>
            <Button className="h-11" variant="outline" disabled={saving} onClick={() => commit("values")}>Save values only</Button>
            <Button className="h-11" variant="ghost" disabled={saving} onClick={() => commit(null)}>Don&apos;t save</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {live && <IdleDialog open={idleOpen} idle={idleMs(st, now)} name={st.name} onFinish={finishIdle} onResume={() => upd(() => {})} onDiscard={cancel} />}
      {finish && <FinishScreen s={finish} onClose={() => { router.push(finish.offline ? "/workout" : `/history/${finish.id}`); router.refresh(); }} />}
      <ExercisePicker exercises={exercises} onPick={addExercises} trigger={<Button variant="outline" className="mt-4 h-11 w-full"><Plus className="size-4" />Add exercises</Button>} />

    </div>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso); const off = d.getTimezoneOffset();
  return new Date(+d - off * 60000).toISOString().slice(0, 16);
}
