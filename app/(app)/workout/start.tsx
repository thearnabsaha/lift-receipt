"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Copy, Link2Off, MoreHorizontal, Pencil, Play, Share2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ACTIVE_KEY, type EditorState } from "@/components/workout-editor";
import { startFromRoutine } from "@/lib/editor";
import type { Plan } from "@/lib/progression";
import { useSettings } from "@/components/settings-context";
import { deleteRoutineAction, shareRoutineAction, unshareRoutineAction } from "@/app/actions";
import type { WorkoutExercise } from "@/lib/db/schema";

// Device-local weekday; empty on the server so a UTC server never mismatches the client near midnight.
const noop = () => () => {};
const useWeekday = () => useSyncExternalStore(noop, () => new Date().toLocaleDateString(undefined, { weekday: "long" }), () => "");

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Morning Workout" : h < 17 ? "Afternoon Workout" : "Evening Workout";
}

type R = { id: string; name: string; folder?: string | null; notes: string | null; exercises: WorkoutExercise[] };
function useStart() {
  const router = useRouter(); const { unit } = useSettings();
  return (r?: R, plans?: Plan[], planUnit?: string) => {
    if (localStorage.getItem(ACTIVE_KEY) && !confirm("A workout is already in progress. Discard it and start a new one?")) return;
    // plans were computed server-side in the user's unit; ignore them if the unit was just changed on this device
    const s0 = r ? startFromRoutine(r.exercises, planUnit === unit ? plans : undefined, unit) : null;
    const st: EditorState = { name: r?.name ?? greeting(), notes: r?.notes ?? "", routineId: r?.id ?? null, folder: "", template: r && s0 ? { name: r.name, folder: r.folder ?? null, notes: r.notes, exercises: s0.template } : undefined, startedAt: new Date().toISOString(), endedAt: null, unit, exercises: s0?.exercises ?? [] };
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(st));
    router.push("/workout/active");
  };
}

/** Deep links (Home Screen web clips, iOS Shortcuts, manifest shortcuts): /workout?start=1, /workout?routine=<id>, /workout?routine=last */
export function StartWorkout({ routines = [], lastRoutineId = null, plans = {}, planUnit }: { routines?: R[]; lastRoutineId?: string | null; plans?: Record<string, Plan[]>; planUnit?: string }) {
  const start = useStart();
  const weekday = useWeekday();
  const router = useRouter();
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const rid = q.get("routine"), go = q.get("start") === "1";
    if (!go && !rid) return;
    history.replaceState(null, "", "/workout");
    if (localStorage.getItem(ACTIVE_KEY)) { if (rid) toast("A workout is already in progress"); router.push("/workout/active"); return; }
    if (!rid) return start();
    const r = routines.find((x) => x.id === (rid === "last" ? lastRoutineId : rid));
    if (r) start(r, plans[r.id], planUnit);
    else toast.error(rid === "last" ? "No routine used yet. Pick one below." : "That routine no longer exists. Pick one below.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="receipt rounded-xl border px-5 py-7 shadow-[0_1px_3px_#0000001a]">
      <p className="mono-label">Quick start{weekday && ` · ${weekday}`}</p>
      <p className="mt-1 text-sm text-muted-foreground">Add exercises as you go. The timer starts now.</p>
      <Button className="mt-4 h-11 w-full active:translate-y-px" onClick={() => start()}><Play className="size-4" />Start an empty workout</Button>
    </div>
  );
}

export function StartRoutineButton({ routine, plans, planUnit }: { routine: R; plans?: Plan[]; planUnit?: string }) {
  const start = useStart();
  return <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => start(routine, plans, planUnit)}><Play className="size-4" />Start routine</Button>;
}

export function RoutineMenu({ id, name, shared = false }: { id: string; name?: string; shared?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false); const [url, setUrl] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const openShare = async () => {
    setOpen(true); setUrl(null);
    try { const { token } = await shareRoutineAction(id); setUrl(`${location.origin}/share/r/${token}`); }
    catch { toast.error("Could not create share link"); setOpen(false); }
  };
  const copy = async () => { if (!url) return; try { await navigator.clipboard.writeText(url); toast.success("Link copied"); } catch { toast.error("Copy failed"); } };
  const nativeShare = async () => {
    if (!url) return;
    if (navigator.share) { try { await navigator.share({ title: name ? `${name} · Fortis routine` : "Fortis routine", url }); } catch { /* cancelled */ } }
    else copy();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="size-7" aria-label="Routine options"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild><Link href={`/routines/${id}`}><Pencil className="size-4" />Edit</Link></DropdownMenuItem>
          <DropdownMenuItem onClick={openShare}><Share2 className="size-4" />{shared ? "Share link" : "Share"}</DropdownMenuItem>
          {shared && <DropdownMenuItem onClick={async () => { await unshareRoutineAction(id); toast.success("Sharing stopped"); router.refresh(); }}><Link2Off className="size-4" />Stop sharing</DropdownMenuItem>}
          <DropdownMenuItem variant="destructive" onClick={async () => { if (!confirm("Delete routine?")) return; await deleteRoutineAction(id); toast.success("Routine deleted"); router.refresh(); }}><Trash2 className="size-4" />Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) router.refresh(); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <p className="mono-label">Share routine</p>
            <DialogTitle>{name ?? "Routine"}</DialogTitle>
            <DialogDescription>Anyone with the link can view this template and import a copy. Your workout history stays private.</DialogDescription>
          </DialogHeader>
          <Input readOnly value={url ?? "Creating link…"} onFocus={(e) => e.currentTarget.select()} className="font-mono text-base sm:text-sm" aria-label="Share link" />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled={!url} onClick={copy}><Copy className="size-4" />Copy link</Button>
            <Button disabled={!url} onClick={nativeShare}><Share2 className="size-4" />Share</Button>
          </div>
          <Button variant="ghost" className="text-destructive" disabled={!url || busy} onClick={async () => { setBusy(true); try { await unshareRoutineAction(id); toast.success("Sharing stopped. The old link no longer works."); setOpen(false); router.refresh(); } finally { setBusy(false); } }}><Link2Off className="size-4" />Stop sharing</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
