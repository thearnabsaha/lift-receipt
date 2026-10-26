import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import * as svc from "@/lib/services";
import { round, toKg } from "@/lib/calc";

export const maxDuration = 60;
const BASE = process.env.BETTER_AUTH_URL || "https://lift-receipt.vercel.app";
const COACH = `You are the user's strength coach, using the Fortis MCP tools. Workflow:
1. get_coaching_context first (unit, trends, balance, routines, body stats). Use the user's unit everywhere.
2. Progression: suggest_progression (optionally per routine) gives rule-based targets (double progression; deload after 3 stalled sessions). Prefer these numbers; adjust only with a stated reason.
3. Weekly reviews: get_weekly_summary (default last full week; pass today's date for this week so far).
4. Balance: aim for ~10-20 working sets per major muscle per week; flag muscles with 0 sets in muscle balance.
5. Never change data without asking. To save a plan use create_routine / update_routine; to log use log_workout.
6. Be brief and concrete: exercise, sets x reps @ weight, one-line reason. No medical advice; suggest rest or a professional for pain.`;

type Ctx = { http?: { authInfo?: { extra?: Record<string, unknown> } } };
const uid = (ctx: unknown) => {
  const u = (ctx as Ctx)?.http?.authInfo?.extra?.userId;
  if (typeof u !== "string") throw new Error("Unauthorized");
  return u;
};
const ok = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] });

const setIn = z.object({
  weight: z.number().nullable().optional().describe("Weight in the user's unit (see `unit`); null/omitted for bodyweight"),
  reps: z.number().int().nullable().optional().describe("Repetitions"),
  rpe: z.number().min(1).max(10).nullable().optional().describe("Optional RPE 1-10"),
  type: z.enum(["warmup", "normal", "drop", "failure"]).optional().describe("Set type, default normal"),
  done: z.boolean().optional().describe("Completed? default true"),
});
const exIn = z.object({
  exercise: z.string().describe("Exercise id (from list_exercises) or exact/approximate name, e.g. 'Bench Press (Barbell)'. Unknown names create a custom exercise."),
  notes: z.string().optional(),
  supersetId: z.string().optional().describe("Exercises sharing the same supersetId form a superset"),
  sets: z.array(setIn).default([]),
});
const unitIn = z.enum(["kg", "lb"]).optional().describe("Unit of weights in this call. Defaults to the user's setting.");

async function unitFor(userId: string, u?: "kg" | "lb") {
  return (u ?? (await svc.getSettings(userId)).unit) as "kg" | "lb";
}
const conv = (v: number | null | undefined, unit: "kg" | "lb") => toKg(v, unit);
async function toExercises(userId: string, exs: z.infer<typeof exIn>[], unit: "kg" | "lb") {
  const out = [];
  for (const e of exs) {
    const ex = await svc.resolveExercise(userId, e.exercise.startsWith("bi_") || /^[0-9a-f-]{36}$/.test(e.exercise) ? { exerciseId: e.exercise } : { name: e.exercise });
    out.push({
      exerciseId: ex.id, name: ex.name, notes: e.notes, supersetId: e.supersetId ?? null,
      sets: e.sets.map((s) => ({ type: s.type ?? "normal", weight: conv(s.weight, unit), reps: s.reps ?? null, rpe: s.rpe ?? null, done: s.done ?? true })),
    });
  }
  return out;
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool("list_exercises", {
      title: "List exercises",
      description: "Search the exercise library (built-in + the user's custom exercises). Filter by name text, muscle group (Chest, Back, Shoulders, Biceps, Triceps, Forearms, Quads, Hamstrings, Glutes, Calves, Core, Full Body, Cardio, Other) or equipment.",
      inputSchema: z.object({ query: z.string().optional(), muscle: z.string().optional(), equipment: z.string().optional(), limit: z.number().int().max(500).optional() }),
    }, async (a, ctx) => {
      const r = await svc.listExercises(uid(ctx), { q: a.query, muscle: a.muscle, equipment: a.equipment });
      return ok(r.slice(0, a.limit ?? 100).map((e) => ({ id: e.id, name: e.name, muscle: e.muscle, equipment: e.equipment, custom: !!e.userId })));
    });

    server.registerTool("create_exercise", {
      title: "Create custom exercise",
      description: "Create a custom exercise in the user's library.",
      inputSchema: z.object({ name: z.string().min(1), muscle: z.string().default("Other"), equipment: z.string().default("Other"), instructions: z.string().optional() }),
    }, async (a, ctx) => ok(await svc.createExercise(uid(ctx), a)));

    server.registerTool("list_routines", {
      title: "List routines", description: "List the user's workout routines (templates) with their exercises.",
      inputSchema: z.object({}),
    }, async (_a, ctx) => ok((await svc.listRoutines(uid(ctx))).map((r) => ({ id: r.id, name: r.name, folder: r.folder, exercises: r.exercises.map((e) => `${e.name} × ${e.sets.length}`) }))));

    server.registerTool("get_routine", {
      title: "Get routine", description: "Get a routine with full exercise and set targets (weights in kg).",
      inputSchema: z.object({ routineId: z.string() }),
    }, async (a, ctx) => ok((await svc.getRoutine(uid(ctx), a.routineId)) ?? { error: "Routine not found" }));

    server.registerTool("create_routine", {
      title: "Create routine", description: "Create a routine/template. Each exercise lists target sets (weight/reps optional).",
      inputSchema: z.object({ name: z.string(), folder: z.string().optional(), notes: z.string().optional(), unit: unitIn, exercises: z.array(exIn) }),
    }, async (a, ctx) => {
      const u = uid(ctx); const unit = await unitFor(u, a.unit);
      return ok(await svc.createRoutine(u, { name: a.name, folder: a.folder, notes: a.notes, exercises: await toExercises(u, a.exercises, unit) }));
    });

    server.registerTool("update_routine", {
      title: "Update routine",
      description: "Edit one of your routines. Only provided fields change. `exercises` REPLACES the whole exercise list (same shape as create_routine). `removeExerciseIds` drops exercises by exercise id from the current list, keeping the rest (order and sets) untouched. Use one or the other.",
      inputSchema: z.object({
        routineId: z.string(), name: z.string().optional(), folder: z.string().nullable().optional(), notes: z.string().nullable().optional(), unit: unitIn,
        exercises: z.array(exIn).optional().describe("Full replacement list"),
        removeExerciseIds: z.array(z.string()).optional().describe("Exercise ids to remove from the existing list"),
      }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      const r = await svc.getRoutine(u, a.routineId);
      if (!r) return { content: [{ type: "text" as const, text: "Routine not found" }], isError: true };
      if (a.exercises && a.removeExerciseIds) return { content: [{ type: "text" as const, text: "Pass either exercises or removeExerciseIds, not both" }], isError: true };
      let exercises = r.exercises;
      if (a.exercises) exercises = await toExercises(u, a.exercises, await unitFor(u, a.unit));
      else if (a.removeExerciseIds) { const rm = new Set(a.removeExerciseIds); exercises = r.exercises.filter((e) => !rm.has(e.exerciseId)); }
      return ok(await svc.updateRoutine(u, r.id, {
        name: a.name ?? r.name, folder: a.folder !== undefined ? a.folder : r.folder, notes: a.notes !== undefined ? a.notes : r.notes, exercises,
      }));
    });

    server.registerTool("delete_routine", {
      title: "Delete routine", description: "Permanently delete one of your routines (past workouts are kept).",
      inputSchema: z.object({ routineId: z.string() }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      const r = await svc.getRoutine(u, a.routineId);
      if (!r) return { content: [{ type: "text" as const, text: "Routine not found" }], isError: true };
      await svc.deleteRoutine(u, r.id);
      return ok({ deleted: true, routineId: r.id, name: r.name });
    });

    server.registerTool("start_workout", {
      title: "Start workout", description: "Start a new in-progress workout (optionally from a routine). Returns workoutId; then use add_set and finish_workout.",
      inputSchema: z.object({ name: z.string().optional(), routineId: z.string().optional(), startedAt: z.string().optional().describe("ISO datetime, default now") }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      const r = a.routineId ? await svc.getRoutine(u, a.routineId) : null;
      const w = await svc.saveWorkout(u, {
        name: a.name ?? r?.name ?? "Workout", routineId: r?.id ?? null, startedAt: a.startedAt ? new Date(a.startedAt) : new Date(), endedAt: null,
        exercises: (r?.exercises ?? []).map((e) => ({ ...e, sets: e.sets.map((s) => ({ ...s, done: false })) })),
      });
      return ok({ workoutId: w.id, name: w.name, startedAt: w.startedAt, exercises: w.exercises.map((e) => e.name) });
    });

    server.registerTool("log_workout", {
      title: "Log full workout", description: "Log a complete (finished) workout in one call with all exercises and sets. Use for recording past sessions.",
      inputSchema: z.object({
        name: z.string().default("Workout"), notes: z.string().optional(), unit: unitIn,
        startedAt: z.string().optional().describe("ISO datetime; default now minus durationMin"),
        durationMin: z.number().optional().describe("Duration in minutes (default 60)"),
        exercises: z.array(exIn).min(1),
      }),
    }, async (a, ctx) => {
      const u = uid(ctx); const unit = await unitFor(u, a.unit);
      const dur = (a.durationMin ?? 60) * 60000;
      const start = a.startedAt ? new Date(a.startedAt) : new Date(Date.now() - dur);
      const w = await svc.saveWorkout(u, { name: a.name, notes: a.notes, startedAt: start, endedAt: new Date(+start + dur), exercises: await toExercises(u, a.exercises, unit) });
      const prs = await svc.workoutPRs(u, w);
      return ok({ ...svc.summarizeWorkout({ ...w, createdAt: new Date() }), personalRecords: w.exercises.flatMap((e, i) => Object.entries(prs[i]).map(([si, k]) => ({ exercise: e.name, set: +si + 1, kinds: k }))) });
    });

    server.registerTool("add_set", {
      title: "Add set", description: "Append a set to an exercise in a workout (adds the exercise if missing).",
      inputSchema: z.object({ workoutId: z.string(), exercise: z.string().describe("Exercise id or name"), unit: unitIn, set: setIn }),
    }, async (a, ctx) => {
      const u = uid(ctx); const unit = await unitFor(u, a.unit);
      const isId = a.exercise.startsWith("bi_") || /^[0-9a-f-]{36}$/.test(a.exercise);
      const w = await svc.addSet(u, a.workoutId, isId ? { exerciseId: a.exercise } : { name: a.exercise }, { type: a.set.type ?? "normal", weight: conv(a.set.weight, unit), reps: a.set.reps ?? null, rpe: a.set.rpe ?? null, done: a.set.done ?? true });
      return ok(svc.summarizeWorkout({ ...w }));
    });

    server.registerTool("finish_workout", {
      title: "Finish workout", description: "Mark an in-progress workout as finished (sets endedAt). Returns summary and PRs.",
      inputSchema: z.object({ workoutId: z.string(), endedAt: z.string().optional() }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      const w = await svc.finishWorkout(u, a.workoutId, a.endedAt ? new Date(a.endedAt) : new Date());
      if (!w) return ok({ error: "Workout not found" });
      const prs = await svc.workoutPRs(u, w);
      return ok({ ...svc.summarizeWorkout(w), personalRecords: w.exercises.flatMap((e, i) => Object.entries(prs[i]).map(([si, k]) => ({ exercise: e.name, set: +si + 1, kinds: k }))) });
    });

    server.registerTool("list_workouts", {
      title: "List workouts", description: "List workouts (newest first) optionally within a date range. Volumes in kg.",
      inputSchema: z.object({ from: z.string().optional().describe("ISO date"), to: z.string().optional().describe("ISO date"), limit: z.number().int().max(200).optional() }),
    }, async (a, ctx) => ok((await svc.listWorkouts(uid(ctx), { from: a.from ? new Date(a.from) : undefined, to: a.to ? new Date(a.to) : undefined, limit: a.limit ?? 30 })).map(svc.summarizeWorkout)));

    server.registerTool("get_workout", {
      title: "Get workout", description: "Full workout detail with every set (weights in kg).",
      inputSchema: z.object({ workoutId: z.string() }),
    }, async (a, ctx) => ok((await svc.getWorkout(uid(ctx), a.workoutId)) ?? { error: "Workout not found" }));

    server.registerTool("delete_workout", {
      title: "Delete workout", description: "Permanently delete a workout.",
      inputSchema: z.object({ workoutId: z.string() }),
    }, async (a, ctx) => ok({ deleted: await svc.deleteWorkout(uid(ctx), a.workoutId) }));

    server.registerTool("get_exercise_history", {
      title: "Exercise history", description: "Per-session history for one exercise: sets, max weight, estimated 1RM (Epley), volume (kg).",
      inputSchema: z.object({ exercise: z.string().describe("Exercise id or name"), limit: z.number().int().optional() }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      const isId = a.exercise.startsWith("bi_") || /^[0-9a-f-]{36}$/.test(a.exercise);
      const ex = await svc.resolveExercise(u, isId ? { exerciseId: a.exercise } : { name: a.exercise }, false);
      const h = await svc.exerciseHistory(u, ex.id);
      return ok({ exercise: ex.name, sessions: h.slice(-(a.limit ?? 20)).reverse() });
    });

    server.registerTool("get_personal_records", {
      title: "Personal records", description: "Personal records per exercise: max weight, best estimated 1RM, best set volume, max reps, rep maxes (kg).",
      inputSchema: z.object({ exercise: z.string().optional().describe("Optional exercise id or name") }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      let exId: string | undefined;
      if (a.exercise) { const isId = a.exercise.startsWith("bi_") || /^[0-9a-f-]{36}$/.test(a.exercise); exId = (await svc.resolveExercise(u, isId ? { exerciseId: a.exercise } : { name: a.exercise }, false)).id; }
      return ok(await svc.personalRecords(u, exId));
    });

    server.registerTool("list_personal_records", {
      title: "PR history", description: "Personal-record events, newest first: date, workout, exercise, kind (weight | e1rm | volume | reps), value and previous best. Weights in kg, volume in kg×reps. A first-ever session of an exercise is its baseline, not a PR: baselines are included as entries with isBaseline: true (kind/value = that session's best, previous = null) and are not counted as PRs. Set includeBaselines=false to omit them.",
      inputSchema: z.object({ exerciseId: z.string().optional().describe("Optional exercise id or name to filter"), limit: z.number().int().min(1).max(500).default(50), includeBaselines: z.boolean().default(true) }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      let exId: string | undefined;
      if (a.exerciseId) exId = (await svc.resolveExercise(u, { exerciseId: a.exerciseId, name: a.exerciseId }, false)).id;
      const { events, baselines } = await svc.prHistory(u);
      const r1 = (n: number) => Math.round(n * 10) / 10;
      const prs = events.map((e) => ({ ...e, value: r1(e.value), previous: r1(e.previous) as number | null, isBaseline: false }));
      const base = a.includeBaselines ? baselines.flatMap((b) => Object.entries(b.values).map(([kind, v]) => ({ workoutId: b.workoutId, workoutName: b.workoutName, date: b.date, exerciseId: b.exerciseId, exercise: b.exercise, kind, value: r1(v!.value), previous: null, set: v!.set, isBaseline: true }))) : [];
      const rows = [...prs, ...base].filter((e) => !exId || e.exerciseId === exId).sort((x, y) => +y.date - +x.date || Number(x.isBaseline) - Number(y.isBaseline));
      return ok({ prCount: prs.filter((e) => !exId || e.exerciseId === exId).length, entries: rows.slice(0, a.limit) });
    });

    server.registerTool("get_progress_summary", {
      title: "Progress summary", description: "Weekly workouts, sets, volume (kg) and duration for the last N weeks.",
      inputSchema: z.object({ weeks: z.number().int().min(1).max(104).default(12) }),
    }, async (a, ctx) => ok(await svc.progressSummary(uid(ctx), a.weeks)));

    server.registerTool("log_measurement", {
      title: "Log bodyweight / measurement", description: "Log bodyweight (value in the given unit kg/lb) or a body measurement: bodyfat (%), or neck, shoulders, chest, waist, hips, left_arm, right_arm, left_thigh, right_thigh, calves (cm).",
      inputSchema: z.object({ kind: z.enum(svc.MEASUREMENT_KINDS).default("bodyweight"), value: z.number().positive(), unit: unitIn, date: z.string().optional() }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      const value = a.kind === "bodyweight" ? conv(a.value, await unitFor(u, a.unit))! : a.value;
      return ok(await svc.logMeasurement(u, { kind: a.kind, value, date: a.date ? new Date(a.date) : undefined }));
    });

    server.registerTool("list_measurements", {
      title: "List measurements", description: "List bodyweight (kg) / measurement entries, newest first.",
      inputSchema: z.object({ kind: z.string().optional() }),
    }, async (a, ctx) => ok((await svc.listMeasurements(uid(ctx), a.kind)).slice(0, 100)));

    server.registerTool("get_stats", {
      title: "Stats", description: "Overall training stats: total workouts, volume (kg), sets, hours, weekly streak, this week's workouts, top exercises, and the user's unit setting.",
      inputSchema: z.object({}),
    }, async (_a, ctx) => { const u = uid(ctx); return ok({ ...(await svc.getStats(u)), unit: (await svc.getSettings(u)).unit }); });

    server.registerTool("get_muscle_balance", {
      title: "Muscle balance", description: "Per-muscle training load over a period (7d/30d/90d/all): working sets (primary muscle = 1, secondary = 0.5, warm-ups excluded), volume in kg, last trained date and top exercises, sorted most to least trained. Same data as the History → Muscles map.",
      inputSchema: z.object({ period: z.enum(["7d", "30d", "90d", "all"]).default("30d") }),
    }, async (a, ctx) => ok(await svc.getMuscleBalance(uid(ctx), a.period)));

    // ---------- favourites ----------
    server.registerTool("set_favorite_exercise", {
      title: "Star / unstar exercise", description: "Mark an exercise as a favourite (favorite: true) or remove it (false). Favourites sort first in the app's exercise picker and library.",
      inputSchema: z.object({ exerciseId: z.string().describe("Exercise id or name"), favorite: z.boolean().default(true) }),
    }, async (a, ctx) => {
      const u = uid(ctx);
      const isId = a.exerciseId.startsWith("bi_") || /^[0-9a-f-]{36}$/.test(a.exerciseId);
      const ex = await svc.resolveExercise(u, isId ? { exerciseId: a.exerciseId } : { name: a.exerciseId }, false);
      return ok({ ...(await svc.setFavorite(u, ex.id, a.favorite)), name: ex.name });
    });
    server.registerTool("list_favorite_exercises", {
      title: "List favourite exercises", description: "The user's starred exercises (id, name, muscle, equipment).",
      inputSchema: z.object({}),
    }, async (_a, ctx) => ok(await svc.listFavorites(uid(ctx))));

    // ---------- sharing ----------
    server.registerTool("share_routine", {
      title: "Share routine", description: "Turn on a public read-only link for one of the user's routines and return it. Anyone with the link can view it (no login) and import a copy into their own Fortis. Reuses the existing link if already shared.",
      inputSchema: z.object({ routineId: z.string() }),
    }, async (a, ctx) => {
      const sh = await svc.shareRoutine(uid(ctx), a.routineId);
      return ok({ url: `${BASE}/share/r/${sh.token}`, token: sh.token, createdAt: sh.createdAt });
    });
    server.registerTool("unshare_routine", {
      title: "Stop sharing routine", description: "Revoke the public link(s) for a routine. Old links stop working immediately; copies others already imported are unaffected.",
      inputSchema: z.object({ routineId: z.string() }),
    }, async (a, ctx) => ok({ revoked: await svc.unshareRoutine(uid(ctx), a.routineId) }));

    // ---------- weekly summary + coach ----------
    server.registerTool("get_weekly_summary", {
      title: "Weekly summary", description: "Summary of one Mon–Sun week (default: last full week; pass any date inside a week, e.g. today, for 'this week so far'): sessions, volume (kg), working sets, minutes, new PRs, best lift (highest e1RM set), previous week and % change, most-trained and untrained muscles, and a plain-English `recap` line. Volume in kg; `recap` uses the user’s unit. Week boundaries use the user’s time zone (Settings override, else device zone from their last app visit, else Asia/Kolkata) unless `timezone` is given.",
      inputSchema: z.object({ weekStart: z.string().optional().describe("ISO date inside the wanted week"), timezone: z.string().optional().describe("IANA zone, e.g. Europe/Berlin; default: the user’s zone"), tzOffsetMinutes: z.number().int().optional().describe("Deprecated: fixed minutes east of UTC (use timezone)") }),
    }, async (a, ctx) => ok(await svc.getWeeklySummary(uid(ctx), { weekStart: a.weekStart ? new Date(a.weekStart) : undefined, timezone: a.timezone, tzOffsetMin: a.tzOffsetMinutes })));

    server.registerTool("get_coaching_context", {
      title: "Coaching context", description: "Compact snapshot for coaching, in one call: unit, last workouts, 6-week volume trend, per-exercise session trend over 6 weeks (best set + e1RM, in the user's unit), 30-day muscle balance, top PRs, routines, latest body measurements, favourites. Call this first before planning or reviewing training.",
      inputSchema: z.object({}),
    }, async (_a, ctx) => ok(await svc.getCoachingContext(uid(ctx))));

    server.registerTool("suggest_progression", {
      title: "Suggest progression", description: "Rule-based next-session targets (double progression). For each exercise in a routine (or the 15 most recent exercises): action increase_weight | add_reps | deload | start, nextWeight (user's unit), nextReps, stall flag and reason. Rep range top defaults to the routine's target reps, else 12; bottom = top − 4. Increment 2.5 kg / 5 lb, half for small isolation lifts.",
      inputSchema: z.object({ routineId: z.string().optional(), repMin: z.number().int().min(1).max(30).optional(), repMax: z.number().int().min(1).max(50).optional() }),
    }, async (a, ctx) => ok(await svc.suggestProgression(uid(ctx), a)));

    server.registerTool("coach_instructions", {
      title: "How to coach with Fortis", description: "Guidance for an AI assistant acting as the user's strength coach with these tools (workflow, rules, tone). Read once per conversation.",
      inputSchema: z.object({}),
    }, async () => ({ content: [{ type: "text" as const, text: COACH }] }));

    server.registerPrompt("plan_my_week", {
      title: "Plan my week", description: "Draft next week's training from my data",
      argsSchema: z.object({ days: z.string().optional().describe("Training days available, e.g. 'Mon, Wed, Fri'") }),
    }, ({ days }) => ({ messages: [{ role: "user" as const, content: { type: "text" as const, text: `${COACH}\n\nTask: plan my next training week${days ? ` on ${days}` : ""}. Call get_coaching_context and suggest_progression (per routine), then give a day-by-day plan with exercises, sets x reps @ weight, and one line on why. Offer to save new routines with create_routine/update_routine, but ask before changing anything.` } }] }));
    server.registerPrompt("review_my_last_week", {
      title: "Review my last week", description: "Recap and feedback on last week",
      argsSchema: z.object({}),
    }, () => ({ messages: [{ role: "user" as const, content: { type: "text" as const, text: `${COACH}\n\nTask: review my last week. Call get_weekly_summary and get_coaching_context, then tell me what went well, what stalled, neglected muscles, and 3 concrete changes for next week.` } }] }));
  },
  { serverInfo: { name: "fortis", version: "1.0.0" } },
);

const authed = withMcpAuth(handler, async (_req, token) => {
  if (!token) return undefined;
  const userId = await svc.verifyApiKey(token);
  if (!userId) return undefined;
  return { token, clientId: userId, scopes: [], extra: { userId } };
}, { required: true });

export { authed as GET, authed as POST, authed as DELETE };
