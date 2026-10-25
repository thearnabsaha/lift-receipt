import { getSession } from "@/lib/auth";
import * as svc from "@/lib/services";

const esc = (v: unknown) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export async function GET() {
  const s = await getSession();
  if (!s) return new Response("unauthorized", { status: 401 });
  const list = await svc.listWorkouts(s.user.id, { limit: 100000 });
  const rows = [["Date", "Workout Name", "Duration (min)", "Exercise Name", "Set Order", "Set Type", "Weight (kg)", "Reps", "RPE", "Notes", "Workout Notes", "Superset"]];
  for (const w of list.reverse()) {
    const dur = w.endedAt ? Math.round((+w.endedAt - +w.startedAt) / 60000) : "";
    for (const e of w.exercises) e.sets.forEach((st, i) => rows.push([w.startedAt.toISOString(), w.name, String(dur), e.name, String(i + 1), st.type, String(st.weight ?? ""), String(st.reps ?? ""), String(st.rpe ?? ""), e.notes ?? "", w.notes ?? "", e.supersetId ?? ""]));
  }
  return new Response(rows.map((r) => r.map(esc).join(",")).join("\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="lift-receipt-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
