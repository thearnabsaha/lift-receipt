"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ACTIVE_KEY, toEditorExercises, type EditorState } from "@/components/workout-editor";
import { useSettings } from "@/components/settings-context";
import { deleteRoutineAction } from "@/app/actions";
import type { WorkoutExercise } from "@/lib/db/schema";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Morning Workout" : h < 17 ? "Afternoon Workout" : "Evening Workout";
}

function useStart() {
  const router = useRouter(); const { unit } = useSettings();
  return (r?: { id: string; name: string; folder?: string | null; notes: string | null; exercises: WorkoutExercise[] }) => {
    if (localStorage.getItem(ACTIVE_KEY) && !confirm("A workout is already in progress. Discard it and start a new one?")) return;
    const st: EditorState = { name: r?.name ?? greeting(), notes: r?.notes ?? "", routineId: r?.id ?? null, folder: "", template: r ? { name: r.name, folder: r.folder ?? null, notes: r.notes, exercises: r.exercises } : undefined, startedAt: new Date().toISOString(), endedAt: null, unit, exercises: r ? toEditorExercises(r.exercises, unit, false) : [] };
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(st));
    router.push("/workout/active");
  };
}

export function StartWorkout() {
  const start = useStart();
  const router = useRouter();
  useEffect(() => {
    // PWA shortcut: /workout?start=1
    if (new URLSearchParams(location.search).get("start") === "1") {
      history.replaceState(null, "", "/workout");
      if (localStorage.getItem(ACTIVE_KEY)) router.push("/workout/active"); else start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="receipt rounded-xl border px-5 py-7 shadow-[0_1px_3px_#0000001a]">
      <p className="mono-label">Quick start · {new Date().toLocaleDateString(undefined, { weekday: "long" })}</p>
      <p className="mt-1 text-sm text-muted-foreground">Add exercises as you go. The timer starts now.</p>
      <Button className="mt-4 h-11 w-full active:translate-y-px" onClick={() => start()}><Play className="size-4" />Start an empty workout</Button>
    </div>
  );
}

export function StartRoutineButton({ routine }: { routine: { id: string; name: string; folder?: string | null; notes: string | null; exercises: WorkoutExercise[] } }) {
  const start = useStart();
  return <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => start(routine)}><Play className="size-4" />Start routine</Button>;
}

export function RoutineMenu({ id }: { id: string }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="size-7" aria-label="Routine options"><MoreHorizontal className="size-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild><Link href={`/routines/${id}`}><Pencil className="size-4" />Edit</Link></DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={async () => { if (!confirm("Delete routine?")) return; await deleteRoutineAction(id); toast.success("Routine deleted"); router.refresh(); }}><Trash2 className="size-4" />Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ResumeBanner() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem(ACTIVE_KEY);
    const t = setTimeout(() => { if (raw) try { setName((JSON.parse(raw) as EditorState).name); } catch {} }, 0);
    return () => clearTimeout(t);
  }, []);
  if (!name) return null;
  return (
    <Link href="/workout/active" className="mb-4 flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 px-4 py-3">
      <span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" /><span className="relative inline-flex size-2.5 rounded-full bg-success" /></span>
      <span className="flex-1 text-sm"><span className="font-medium">{name}</span> in progress</span>
      <span className="text-sm">Resume →</span>
    </Link>
  );
}
