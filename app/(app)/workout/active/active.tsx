"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ACTIVE_KEY, WorkoutEditor, type EditorState, type PrevMap } from "@/components/workout-editor";
import type { ExerciseLite } from "@/components/exercise-picker";
import { Skeleton } from "@/components/ui/skeleton";

export function ActiveWorkout({ exercises, prev }: { exercises: ExerciseLite[]; prev: PrevMap }) {
  const router = useRouter();
  const [st, setSt] = useState<EditorState | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) { router.replace("/workout"); return; }
    const t = setTimeout(() => setSt(JSON.parse(raw)), 0);
    return () => clearTimeout(t);
  }, [router]);
  if (!st) return <div className="mx-auto max-w-2xl space-y-3"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>;
  return <WorkoutEditor mode="live" initial={st} exercises={exercises} prev={prev} />;
}
