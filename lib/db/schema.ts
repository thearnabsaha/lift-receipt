import {
  pgTable, text, timestamp, boolean, integer, real, jsonb, index, uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------- Better Auth ----------
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- App ----------
export type SetType = "warmup" | "normal" | "drop" | "failure";
export type WorkoutSet = {
  type: SetType;
  weight: number | null; // always kg
  reps: number | null;
  rpe?: number | null;
  done: boolean;
};
export type WorkoutExercise = {
  exerciseId: string;
  name: string;
  notes?: string;
  supersetId?: string | null;
  restSec?: number | null;
  sets: WorkoutSet[];
  /** optional auto-progression (routine templates; copied into workouts harmlessly) */
  progression?: import("../progression").ProgressionConfig;
};

export const exercise = pgTable(
  "exercise",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }), // null = built-in
    name: text("name").notNull(),
    muscle: text("muscle").notNull(),
    equipment: text("equipment").notNull(),
    instructions: text("instructions"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("exercise_user_idx").on(t.userId)],
);

export const routine = pgTable(
  "routine",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    folder: text("folder"),
    notes: text("notes"),
    exercises: jsonb("exercises").$type<WorkoutExercise[]>().notNull().default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("routine_user_idx").on(t.userId)],
);

export const workout = pgTable(
  "workout",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    notes: text("notes"),
    routineId: text("routine_id"),
    startedAt: timestamp("started_at").notNull(),
    endedAt: timestamp("ended_at"),
    exercises: jsonb("exercises").$type<WorkoutExercise[]>().notNull().default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("workout_user_started_idx").on(t.userId, t.startedAt)],
);

export const measurement = pgTable(
  "measurement",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(), // bodyweight | bodyfat | waist | chest | arms | thighs | ...
    value: real("value").notNull(), // kg for bodyweight, cm for lengths, % for bodyfat
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("measurement_user_idx").on(t.userId, t.kind, t.date)],
);

export const settings = pgTable("settings", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  unit: text("unit").notNull().default("kg"),
  restSec: integer("rest_sec").notNull().default(120),
  autoRest: boolean("auto_rest").notNull().default(true),
  /** IANA zone auto-detected from the user's device on their last app visit. */
  timezone: text("timezone"),
  /** Manual IANA override set in Settings (null = auto). */
  timezoneOverride: text("timezone_override"),
});

export const apiKey = pgTable(
  "api_key",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    prefix: text("prefix").notNull(),
    hash: text("hash").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    lastUsedAt: timestamp("last_used_at"),
    revokedAt: timestamp("revoked_at"),
  },
  (t) => [uniqueIndex("api_key_hash_idx").on(t.hash)],
);

export const favoriteExercise = pgTable(
  "favorite_exercise",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("favorite_user_ex_idx").on(t.userId, t.exerciseId)],
);

/** Public read-only share link for a routine. Revoking sets revokedAt. */
export const routineShare = pgTable(
  "routine_share",
  {
    token: text("token").primaryKey(),
    routineId: text("routine_id").notNull().references(() => routine.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    revokedAt: timestamp("revoked_at"),
  },
  (t) => [index("routine_share_routine_idx").on(t.routineId)],
);

/** Web Push subscriptions (one per device/browser). */
export const pushSubscription = pgTable(
  "push_subscription",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("push_sub_endpoint_idx").on(t.endpoint), index("push_sub_user_idx").on(t.userId)],
);

/** Server mirror of the in-progress workout (the draft itself lives on the device) for the idle push. */
export const idleWatch = pgTable("idle_watch", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  active: boolean("active").notNull().default(false),
  startedAt: timestamp("started_at"),
  lastActivityAt: timestamp("last_activity_at"),
  hours: integer("hours").notNull().default(3),
  dueAt: timestamp("due_at"),
  notifiedAt: timestamp("notified_at"),
  runId: text("run_id"),
  /** when the scheduled run will next wake; a stale value means we need a new run */
  runUntil: timestamp("run_until"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
