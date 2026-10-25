import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import * as svc from "@/lib/services";

// Used by the offline sync queue (service worker / IndexedDB).
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const w = await svc.saveWorkout(s.user.id, await req.json());
    return NextResponse.json({ id: w.id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
