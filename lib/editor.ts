import { toDisplay, toKg } from "@/lib/calc";
import type { SetType, WorkoutExercise } from "@/lib/db/schema";

export const ACTIVE_KEY = "lr-active-workout";
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
  if (last) return { type: "normal", weight: last.weight, reps: last.reps, rpe: last.rpe, done: false, auto: { weight: last.weight !== "", reps: last.reps !== "" } };
  if (prevRow) return { type: "normal", weight: prevRow.weight, reps: prevRow.reps, rpe: "", done: false, auto: { weight: prevRow.weight !== "", reps: prevRow.reps !== "" } };
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

/* ---------- payload / misc helpers (pure) ---------- */
/** Parses a typed number; "", ".", "1.2.3", "-" etc. become null instead of NaN (NaN made the whole save fail). */
export const parseNum = (v: string): number | null => { const t = v.trim().replace(",", "."); if (t === "") return null; const n = Number(t); return Number.isFinite(n) ? n : null; };
/** RPE outside 1–10 is dropped (the server rejects it, which used to lose the whole workout). */
export const parseRpe = (v: string): number | null => { const n = parseNum(v); return n != null && n >= 1 && n <= 10 ? n : null; };

export function toPayloadExercises(st: Pick<EditorState, "exercises" | "unit">, onlyDone: boolean): WorkoutExercise[] {
  return st.exercises.map((e) => ({
    exerciseId: e.exerciseId, name: e.name, notes: e.notes || undefined, supersetId: e.supersetId, restSec: e.restSec,
    sets: e.sets.filter((s) => !onlyDone || s.done).map((s) => {
      const w = parseNum(s.weight), r = parseNum(s.reps);
      return { type: s.type, weight: toKg(w, st.unit), reps: r == null ? null : Math.max(0, Math.round(r)), rpe: parseRpe(s.rpe), done: onlyDone ? true : s.done };
    }),
  })).filter((e) => !onlyDone || e.sets.length);
}

/** Tapping the grey "previous" value: fills like typing, so linked sets below follow. */
export function fillFromPrevious(sets: ESet[], si: number, weight: string, reps: string): ESet[] {
  return setFieldWithAutofill(setFieldWithAutofill(sets, si, "weight", weight), si, "reps", reps);
}

/** A superset group left with a single exercise (after remove / move) is no longer a superset. */
export function dropLoneSupersets<T extends { supersetId: string | null }>(exs: T[]): T[] {
  return exs.map((e, i) => {
    if (!e.supersetId) return e;
    const linked = exs[i - 1]?.supersetId === e.supersetId || exs[i + 1]?.supersetId === e.supersetId;
    return linked ? e : { ...e, supersetId: null };
  });
}

/** Set label as shown in the editor: W/D/F for special sets, otherwise the count of non-warm-up sets so far. */
export function setLabel(sets: { type: SetType }[], si: number): string {
  const t = sets[si]?.type;
  if (t === "warmup") return "W"; if (t === "drop") return "D"; if (t === "failure") return "F";
  return String(sets.slice(0, si + 1).filter((x) => x.type !== "warmup").length);
}

/** datetime-local value → ISO, or null when cleared / invalid (iOS "Clear" sends ""). */
export function fromLocalInput(v: string): string | null { if (!v) return null; const d = new Date(v); return Number.isNaN(+d) ? null : d.toISOString(); }

/**
 * Undo of a set delete. Restores the exact pre-delete sets (values + auto links) for the deleted set and the
 * sets reflowed below it. Sets marked done after the delete keep their done state; sets added after the delete are kept.
 */
export function undoDelete(current: ESet[], snapshot: ESet[], si: number): ESet[] {
  const out = structuredClone(snapshot);
  for (let i = 0; i < si && i < current.length; i++) out[i] = structuredClone(current[i]);
  for (let i = si + 1; i < out.length; i++) { const c = current[i - 1]; if (c?.done && !out[i].done) out[i] = { ...c }; }
  for (let j = snapshot.length - 1; j < current.length; j++) out.push(structuredClone(current[j]));
  return out;
}
