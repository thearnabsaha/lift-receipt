import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { syncIdleForUser } from "@/lib/idle-sync-server";

// Background idle-timer mirror. A plain route (not a Server Action) so it never queues ahead of
// real actions like saving a workout, and never re-renders the current page in its response.
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null) as { active?: unknown; startedAt?: unknown; lastActivityAt?: unknown; hours?: unknown } | null;
  if (!b || typeof b.active !== "boolean" || typeof b.hours !== "number" || !Number.isFinite(b.hours)) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  return NextResponse.json(await syncIdleForUser(s.user.id, { active: b.active, startedAt: str(b.startedAt), lastActivityAt: str(b.lastActivityAt), hours: b.hours }));
}
