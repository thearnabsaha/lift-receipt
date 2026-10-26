import { toDisplay } from "@/lib/calc";
import type { SetType, WorkoutExercise } from "@/lib/db/schema";

export const uid = () => Math.random().toString(36).slice(2, 10);
export type ESet = { type: SetType; weight: string; reps: string; rpe: string; done: boolean; auto?: { weight?: boolean; reps?: boolean } };
export type EEx = { key: string; exerciseId: string; name: string; notes: string; showNotes: boolean; supersetId: string | null; restSec: number | null; sets: ESet[] };
export type RoutineTemplate = { name: string; folder: string | null; notes: string | null; exercises: WorkoutExercise[] };
export type EditorState = { template?: RoutineTemplate; id?: string; name: string; notes: string; routineId: string | null; folder: string; startedAt: string; endedAt: string | null; lastActivityAt?: string | null; draftId?: string; unit: "kg" | "lb"; exercises: EEx[] };
export type PrevMap = Record<string, { weight: number | null; reps: number | null; type: SetType }[]>;

export function toEditorExercises(exs: WorkoutExercise[], unit: "kg" | "lb", keepDone: boolean): EEx[] {
  return exs.map((e) => ({
    key: uid(), exerciseId: e.exerciseId, name: e.name, notes: e.notes ?? "", showNotes: !!e.notes, supersetId: e.supersetId ?? null, restSec: e.restSec ?? null,
    sets: linkPrefilled(e.sets.map((s) => ({ type: s.type, weight: s.weight == null ? "" : String(toDisplay(s.weight, unit)), reps: s.reps == null ? "" : String(s.reps), rpe: s.rpe == null ? "" : String(s.rpe), done: keepDone ? s.done : false })), !keepDone),
  }));
}

/**
 * Pre-filled sets (from a routine / last workout) whose value repeats the set above count as
 * auto-filled, so editing the first one carries down. Differing values (e.g. a pyramid) stay put.
 */
export function linkPrefilled(sets: ESet[], enable = true): ESet[] {
  if (!enable) return sets;
  return sets.map((s, i) => {
    const p = sets[i - 1];
    const link = (f: FillField) => !!p && s[f] !== "" && s[f] === p[f];
    return { ...s, auto: { weight: link("weight"), reps: link("reps") } };
  });
}


/* ---------- autofill-forward logic (pure) ---------- */
export type FillField = "weight" | "reps";

/** True when a set's field may be overwritten by forward autofill. */
const fillable = (s: ESet, f: FillField) => !s.done && (s[f].trim() === "" || !!s.auto?.[f]);

/**
 * User typed `value` into sets[si][field]. Marks that field as manual and copies the value
 * forward into later sets whose field is empty or auto-filled, stopping at the first set
 * holding a manually entered value. Completed sets are skipped (never changed).
 */
export function setFieldWithAutofill(sets: ESet[], si: number, field: FillField, value: string): ESet[] {
  const out = sets.map((s) => ({ ...s, auto: { ...s.auto } }));
  const cur = out[si];
  if (!cur) return out;
  cur[field] = value;
  cur.auto![field] = false;
  for (let i = si + 1; i < out.length; i++) {
    const s = out[i];
    if (s.done) continue;
    if (!fillable(s, field)) break;
    s[field] = value;
    s.auto![field] = value.trim() !== "";
  }
  return out;
}

/** New set copying the previous set (values linked as auto-filled). Falls back to the "previous" column. */
export function nextSet(sets: ESet[], prevRow?: { weight: string; reps: string; type: SetType } | null): ESet {
  const last = sets.at(-1);
  if (last) return { type: last.type, weight: last.weight, reps: last.reps, rpe: last.rpe, done: false, auto: { weight: last.weight !== "", reps: last.reps !== "" } };
  if (prevRow) return { type: prevRow.type, weight: prevRow.weight, reps: prevRow.reps, rpe: "", done: false, auto: { weight: prevRow.weight !== "", reps: prevRow.reps !== "" } };
  return { type: "normal", weight: "", reps: "", rpe: "", done: false };
}

/** After a set is removed at `from`, re-link auto-filled values to the set now before them. */
export function reflowAuto(sets: ESet[], from: number): ESet[] {
  const out = sets.map((s) => ({ ...s, auto: { ...s.auto } }));
  for (const f of ["weight", "reps"] as FillField[]) {
    for (let i = Math.max(1, from); i < out.length; i++) {
      const s = out[i]; if (s.done) continue;
      if (!s.auto?.[f]) break;
      s[f] = out[i - 1][f]; s.auto![f] = s[f].trim() !== "";
    }
  }
  return out;
}
