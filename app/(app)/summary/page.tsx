import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSettings, getWeeklySummary } from "@/lib/services";
import { PageHeader } from "@/components/app-shell";
import { toDisplay } from "@/lib/calc";

export const metadata = { title: "Weekly summary" };
type S = Awaited<ReturnType<typeof getWeeklySummary>>;

const day = (iso: string, tz: string, off = 0) => new Date(+new Date(iso) + off).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: tz });
function Delta({ v }: { v: number | null }) {
  if (v == null) return <span className="text-muted-foreground">—</span>;
  return <span className={v > 0 ? "text-emerald-600 dark:text-emerald-400" : v < 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}>{v > 0 ? "▲" : v < 0 ? "▼" : "•"} {Math.abs(v)}%</span>;
}

function Week({ s, title, unit }: { s: S; title: string; unit: "kg" | "lb" }) {
  const hrs = s.minutes >= 60 ? `${Math.floor(s.minutes / 60)}h ${s.minutes % 60}m` : `${s.minutes}m`;
  const rows: [string, string, number | null][] = [
    ["Sessions", String(s.sessions), s.change.sessions],
    ["Volume", `${Math.round(toDisplay(s.volumeKg, unit)!).toLocaleString()} ${unit}`, s.change.volume],
    ["Sets", String(s.sets), s.change.sets],
    ["Time", hrs, s.change.minutes],
  ];
  return (
    <article className="receipt rounded-xl border px-5 py-6 shadow-[0_1px_3px_#0000001a]">
      <div className="flex items-baseline justify-between"><p className="mono-label">{title}</p><p className="mono-label">{day(s.weekStart, s.timezone)} – {day(s.weekEnd, s.timezone, -1)}</p></div>
      <p className="mt-3 text-sm leading-relaxed">{s.recap}</p>
      <div className="tear my-4" />
      <table className="w-full font-mono text-sm tabular-nums">
        <thead><tr className="mono-label text-[10px]"><th className="text-left font-normal">Item</th><th className="text-right font-normal">Total</th><th className="w-20 text-right font-normal">vs prev</th></tr></thead>
        <tbody>{rows.map(([k, v, d]) => <tr key={k} className="border-b border-dashed last:border-0"><td className="py-1.5">{k}</td><td className="text-right">{v}</td><td className="text-right text-xs"><Delta v={d} /></td></tr>)}</tbody>
      </table>
      <div className="tear my-4" />
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">PRs</dt><dd className="font-mono">{s.prs}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Best lift</dt><dd className="text-right font-mono">{s.bestLift ? `${s.bestLift.exercise} · ${toDisplay(s.bestLift.weightKg, unit)} ${unit} × ${s.bestLift.reps}` : "—"}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Most trained</dt><dd className="text-right">{s.mostTrained.map((m) => `${m.name} (${m.sets})`).join(", ") || "—"}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Not trained</dt><dd className="text-right text-muted-foreground">{s.sessions ? s.neglected.join(", ") || "None" : "—"}</dd></div>
      </dl>
    </article>
  );
}

export default async function SummaryPage() {
  const u = await requireUser();
  const [last, now, st] = await Promise.all([getWeeklySummary(u.id), getWeeklySummary(u.id, { weekStart: new Date() }), getSettings(u.id)]);
  const unit = st.unit as "kg" | "lb";
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader label="Summary" title="Weekly summary" subtitle={`Mon–Sun weeks in ${now.timezone.replace(/_/g, " ")} time, compared with the week before.`} />
      <div className="grid gap-5 md:grid-cols-2">
        <Week s={now} title="This week · so far" unit={unit} />
        <Week s={last} title="Last week" unit={unit} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">Want a plan for next week? <Link href="/settings#coach" className="underline underline-offset-4">Ask the coach</Link></p>
    </div>
  );
}
