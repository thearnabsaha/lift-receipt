// Pure CSV importers: Fortis/Strong, Hevy, FitNotes. No DB access, so they're unit-tested.
import Papa from "papaparse";
import { lbToKg } from "./calc";
import type { SetType, WorkoutExercise, WorkoutSet } from "./db/schema";

export type ImportFormat = "strong" | "fortis" | "hevy" | "fitnotes";
export type ImportedWorkout = { name: string; notes: string | null; startedAt: string; endedAt: string | null; exercises: WorkoutExercise[] };
export type ParseResult = { format: ImportFormat; workouts: ImportedWorkout[]; skippedSets: number };

const norm = (h: string) => h.trim().toLowerCase();
export function detectFormat(headers: string[]): ImportFormat | null {
  const h = new Set(headers.map(norm));
  if (h.has("exercise_title") && h.has("set_index")) return "hevy";
  if (h.has("exercise") && h.has("category") && h.has("date")) return "fitnotes";
  if (h.has("exercise name") && h.has("set order")) return h.has("set type") || h.has("weight (kg)") && h.has("superset") ? "fortis" : "strong";
  return null;
}

const MONTHS: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
/** Parse a date/time written in the device's local time (or ISO with zone). Returns null if unreadable. */
export function parseLocalDate(s: string | undefined, defaultHour = 12): Date | null {
  if (!s) return null;
  const t = s.trim();
  if (/\d{4}-\d{2}-\d{2}T.*(Z|[+-]\d{2}:?\d{2})$/.test(t)) { const d = new Date(t); return isNaN(+d) ? null : d; }
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(t);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : defaultHour, m[5] ? +m[5] : 0, m[6] ? +m[6] : 0);
  // Hevy: "26 Oct 2026, 18:30"
  m = /^(\d{1,2}) ([A-Za-z]{3})[a-z]* (\d{4}),? (\d{1,2}):(\d{2})$/.exec(t);
  if (m && MONTHS[m[2].toLowerCase()] != null) return new Date(+m[3], MONTHS[m[2].toLowerCase()], +m[1], +m[4], +m[5]);
  const d = new Date(t); return isNaN(+d) ? null : d;
}

const num = (v: string | undefined) => { if (v == null || v.trim() === "") return null; const n = Number(v.replace(",", ".")); return Number.isFinite(n) ? n : null; };
const r2 = (n: number) => Math.round(n * 100) / 100;
const kg = (v: number | null, lb: boolean) => (v == null ? null : (lb ? lbToKg(v) : r2(v)));
function setType(raw: string | undefined): SetType {
  const t = (raw ?? "").trim().toLowerCase();
  if (t === "w" || t.startsWith("warm")) return "warmup";
  if (t === "d" || t.startsWith("drop")) return "drop";
  if (t === "f" || t.startsWith("fail")) return "failure";
  return "normal";
}

type Acc = { name: string; notes: string; start: Date; end: Date | null; ex: Map<string, WorkoutExercise> };
function finish(map: Map<string, Acc>): ImportedWorkout[] {
  return [...map.values()].sort((a, b) => +a.start - +b.start).map((w) => ({
    name: w.name || "Workout", notes: w.notes || null, startedAt: w.start.toISOString(), endedAt: w.end ? w.end.toISOString() : null,
    exercises: [...w.ex.values()].filter((e) => e.sets.length),
  })).filter((w) => w.exercises.length);
}
function push(w: Acc, key: string, name: string, set: WorkoutSet, extra: Partial<WorkoutExercise> = {}) {
  const e = w.ex.get(key) ?? { exerciseId: "", name: name.trim(), sets: [], ...extra };
  e.sets.push(set); w.ex.set(key, e);
}
const isEmpty = (s: WorkoutSet) => s.weight == null && s.reps == null;

function strongLike(rows: Record<string, string>[], fortis: boolean): ParseResult {
  const map = new Map<string, Acc>(); let skipped = 0;
  for (const r of rows) {
    const date = r["Date"], ename = r["Exercise Name"]; if (!date || !ename) continue;
    const start = parseLocalDate(date); if (!start) continue;
    const key = date + "|" + (r["Workout Name"] ?? "");
    let durMin = 0; const d = r["Duration (min)"] ?? r["Duration"] ?? "";
    if (/^\d+$/.test(d)) durMin = +d; else { const h = /(\d+)\s*h/.exec(d), m = /(\d+)\s*m/.exec(d), s = /^(\d+)s$/.exec(d); durMin = (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0) + (s ? Math.round(+s[1] / 60) : 0); }
    const w = map.get(key) ?? { name: r["Workout Name"] ?? "", notes: r["Workout Notes"] ?? "", start, end: durMin ? new Date(+start + durMin * 60000) : new Date(+start + 3600000), ex: new Map() };
    map.set(key, w);
    const lbCol = r["Weight (lb)"] ?? r["Weight (lbs)"];
    const weight = lbCol != null && lbCol !== "" ? kg(num(lbCol), true) : kg(num(r["Weight (kg)"] ?? r["Weight"]), false);
    const reps = num(r["Reps"]);
    const so = r["Set Order"] ?? "";
    const set: WorkoutSet = { type: fortis ? setType(r["Set Type"]) : setType(/^\d+$/.test(so) ? "" : so), weight: weight === 0 ? null : weight, reps: !reps ? null : Math.round(reps), rpe: ((n) => (n != null && n >= 1 && n <= 10 ? n : null))(num(r["RPE"])), done: true };
    if (isEmpty(set)) { skipped++; continue; }
    push(w, ename + "|" + (r["Superset"] ?? ""), ename, set, { notes: r["Notes"] || undefined, supersetId: r["Superset"] || null });
  }
  return { format: fortis ? "fortis" : "strong", workouts: finish(map), skippedSets: skipped };
}

function hevy(rows: Record<string, string>[]): ParseResult {
  const map = new Map<string, Acc>(); let skipped = 0;
  for (const r of rows) {
    const start = parseLocalDate(r["start_time"]); const ename = r["exercise_title"]; if (!start || !ename) continue;
    const key = r["start_time"] + "|" + (r["title"] ?? "");
    const w = map.get(key) ?? { name: r["title"] ?? "", notes: r["description"] ?? "", start, end: parseLocalDate(r["end_time"]), ex: new Map() };
    map.set(key, w);
    const lb = r["weight_lbs"] != null && r["weight_kg"] == null;
    const weight = kg(num(lb ? r["weight_lbs"] : r["weight_kg"]), lb);
    const reps = num(r["reps"]); const rpe = num(r["rpe"]);
    const set: WorkoutSet = { type: setType(r["set_type"]), weight: weight === 0 ? null : weight, reps: !reps ? null : Math.round(reps), rpe: rpe && rpe >= 1 && rpe <= 10 ? rpe : null, done: true };
    if (isEmpty(set)) { skipped++; continue; }
    const ss = r["superset_id"] && r["superset_id"] !== "" ? `hevy-${r["superset_id"]}` : null;
    push(w, ename + "|" + (ss ?? ""), ename, set, { notes: r["exercise_notes"] || undefined, supersetId: ss });
  }
  return { format: "hevy", workouts: finish(map), skippedSets: skipped };
}

function fitnotes(rows: Record<string, string>[], headers: string[]): ParseResult {
  const map = new Map<string, Acc>(); let skipped = 0;
  const wCol = headers.find((h) => /^weight/i.test(h)) ?? "Weight";
  const lb = /lb/i.test(wCol) || rows.some((r) => /lb/i.test(r["Weight Unit"] ?? ""));
  for (const r of rows) {
    const day = r["Date"]?.trim(); const ename = r["Exercise"]; if (!day || !ename) continue;
    const start = parseLocalDate(day, 12); if (!start) continue;
    const w = map.get(day) ?? { name: "", notes: "", start, end: new Date(+start + 3600000), ex: new Map() };
    map.set(day, w);
    const weight = kg(num(r[wCol]), lb); const reps = num(r["Reps"]);
    const set: WorkoutSet = { type: "normal", weight: weight === 0 ? null : weight, reps: reps == null || reps === 0 ? null : Math.round(reps), done: true };
    if (isEmpty(set)) { skipped++; continue; }
    push(w, ename, ename, set);
  }
  const out = finish(map);
  for (const w of out) w.name = "FitNotes workout";
  // name by the categories trained that day, e.g. "Chest + Triceps"
  const cats = new Map<string, Set<string>>();
  for (const r of rows) { const d = r["Date"]?.trim(); if (!d) continue; const s = cats.get(d) ?? new Set(); if (r["Category"]) s.add(r["Category"].trim()); cats.set(d, s); }
  const days = [...map.keys()].sort((a, b) => +map.get(a)!.start - +map.get(b)!.start).filter((d) => [...map.get(d)!.ex.values()].some((e) => e.sets.length));
  out.forEach((w, i) => { const c = [...(cats.get(days[i]) ?? [])]; if (c.length) w.name = c.slice(0, 3).join(" + "); });
  return { format: "fitnotes", workouts: out, skippedSets: skipped };
}

export function parseImportCsv(text: string): ParseResult {
  const res = Papa.parse<Record<string, string>>(text.replace(/^\uFEFF/, "").trim(), { header: true, skipEmptyLines: true, delimiter: "", transformHeader: (h) => h.trim().replace(/^"|"$/g, "") });
  const headers = res.meta.fields ?? [];
  const f = detectFormat(headers);
  if (!f) throw new Error("Unrecognised CSV. Expected a Strong, Hevy, FitNotes or Fortis export.");
  if (f === "hevy") return hevy(res.data);
  if (f === "fitnotes") return fitnotes(res.data, headers);
  return strongLike(res.data, f === "fortis");
}

// ---------- exercise name matching ----------
const ALIASES: [RegExp, string][] = [
  [/\bdumbbells?\b|\bdb\b/g, "dumbbell"], [/\bbarbells?\b|\bbb\b/g, "barbell"], [/\bkettlebells?\b|\bkb\b/g, "kettlebell"],
  [/\bcables?\b/g, "cable"], [/\bmachines?\b/g, "machine"], [/\bflat\b/g, ""], [/\bpull ?ups?\b/g, "pull up"], [/\bchin ?ups?\b/g, "chin up"],
  [/\bpush ?ups?\b/g, "push up"], [/\bsit ?ups?\b/g, "sit up"], [/\brdl\b/g, "romanian deadlift"], [/\bohp\b/g, "overhead press"], [/\bskullcrushers?\b/g, "skullcrusher"],
];
/** Lower-case word bag: "Bench Press (Barbell)" and "Flat Barbell Bench Press" both → "barbell bench press". */
export function normalizeExerciseName(n: string) {
  let s = n.toLowerCase().replace(/[()[\],/_-]+/g, " ").replace(/[^a-z0-9 ]/g, "");
  for (const [re, to] of ALIASES) s = s.replace(re, to);
  const words = s.split(/\s+/).filter(Boolean).map((w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));
  return [...new Set(words)].sort().join(" ");
}
/** Best library match for an imported name, or null (caller creates a custom exercise). */
export function matchExercise<T extends { id: string; name: string }>(name: string, lib: T[], index?: Map<string, T>): T | null {
  const exact = lib.find((e) => e.name.toLowerCase() === name.trim().toLowerCase()); if (exact) return exact;
  const idx = index ?? new Map(lib.map((e) => [normalizeExerciseName(e.name), e]));
  const n = normalizeExerciseName(name); const hit = idx.get(n); if (hit) return hit;
  // token Jaccard ≥ 0.75 (and all of the shorter set's words present)
  const a = new Set(n.split(" ")); let best: T | null = null, score = 0;
  for (const [k, e] of idx) {
    const b = new Set(k.split(" ")); const inter = [...a].filter((x) => b.has(x)).length;
    const j = inter / (a.size + b.size - inter);
    if (j >= 0.75 && inter === Math.min(a.size, b.size) && j > score) { best = e; score = j; }
  }
  return best;
}
/** Key used to skip already-imported workouts: start time to the minute. */
export const workoutDedupeKey = (startedAt: string | Date) => new Date(startedAt).toISOString().slice(0, 16);
