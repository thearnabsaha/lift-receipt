import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { BUILTIN_EXERCISES, builtinId } from "../lib/data/exercises";

async function main() {
  const { db, schema } = await import("../lib/db");
  const rows = BUILTIN_EXERCISES.map(([name, muscle, equipment]) => ({ id: builtinId(name), name, muscle, equipment, userId: null }));
  await db.insert(schema.exercise).values(rows).onConflictDoNothing();
  console.log(`Seeded ${rows.length} built-in exercises`);
}
main().catch((e) => { console.error(e); process.exit(1); });
