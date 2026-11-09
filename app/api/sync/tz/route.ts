import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { syncTimezone } from "@/lib/services";

// Silent device-zone sync (route, not a Server Action: no action queue, no page re-render).
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null) as { tz?: unknown } | null;
  if (!b || typeof b.tz !== "string" || b.tz.length > 64) return NextResponse.json({ error: "bad request" }, { status: 400 });
  try { await syncTimezone(s.user.id, b.tz); } catch { return NextResponse.json({ error: "invalid time zone" }, { status: 400 }); }
  return NextResponse.json({ ok: true });
}
