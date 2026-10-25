import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import * as svc from "@/lib/services";
import { round } from "@/lib/calc";

export const maxDuration = 60;

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
const conv = (v: number | null | undefined, unit: "kg" | "lb") => (v == null ? null : unit === "kg" ? v : round(v * 0.45359237, 3));
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
