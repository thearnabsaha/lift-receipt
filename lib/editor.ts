import { toDisplay } from "@/lib/calc";
import type { SetType, WorkoutExercise } from "@/lib/db/schema";

export const uid = () => Math.random().toString(36).slice(2, 10);
export type ESet = { type: SetType; weight: string; reps: string; rpe: string; done: boolean };
export type EEx = { key: string; exerciseId: string; name: string; notes: string; showNotes: boolean; supersetId: string | null; restSec: number | null; sets: ESet[] };
export type EditorState = { id?: string; name: string; notes: string; routineId: string | null; folder: string; startedAt: string; endedAt: string | null; unit: "kg" | "lb"; exercises: EEx[] };
export type PrevMap = Record<string, { weight: number | null; reps: number | null; type: SetType }[]>;

export function toEditorExercises(exs: WorkoutExercise[], unit: "kg" | "lb", keepDone: boolean): EEx[] {
  return exs.map((e) => ({
    key: uid(), exerciseId: e.exerciseId, name: e.name, notes: e.notes ?? "", showNotes: !!e.notes, supersetId: e.supersetId ?? null, restSec: e.restSec ?? null,
    sets: e.sets.map((s) => ({ type: s.type, weight: s.weight == null ? "" : String(toDisplay(s.weight, unit)), reps: s.reps == null ? "" : String(s.reps), rpe: s.rpe == null ? "" : String(s.rpe), done: keepDone ? s.done : false })),
  }));
}

