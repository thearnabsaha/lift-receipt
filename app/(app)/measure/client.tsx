"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteMeasurementAction, logMeasurementAction } from "@/app/actions";
import { round, toDisplay, toKg } from "@/lib/calc";

type Row = { id: string; kind: string; value: number; date: string };
const label = (k: string) => k.replace("_", " ").replace(/^./, (c) => c.toUpperCase());
// bodyweight stored kg; bodyfat %; tape in cm
const unitFor = (k: string, u: "kg" | "lb") => (k === "bodyweight" ? u : k === "bodyfat" ? "%" : "cm");

export function MeasureClient({ rows, kinds, unit }: { rows: Row[]; kinds: string[]; unit: "kg" | "lb" }) {
  const router = useRouter();
  const [kind, setKind] = useState("bodyweight");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const show = (k: string, v: number) => (k === "bodyweight" ? toDisplay(v, unit)! : v);
  const series = rows.filter((r) => r.kind === kind).map((r) => ({ date: r.date.slice(0, 10), value: round(show(kind, r.value), 1) })).reverse();
  const latest = new Map<string, Row>(); for (const r of rows) if (!latest.has(r.kind)) latest.set(r.kind, r);
  return (
    <div>
      <form className="flex flex-wrap gap-2 rounded-xl border bg-card p-3" onSubmit={async (e) => {
        e.preventDefault(); const v = Number(value); if (!v) return;
        await logMeasurementAction({ kind, value: kind === "bodyweight" ? toKg(v, unit)! : v, date: new Date(date + "T12:00:00").toISOString() });
        setValue(""); toast.success("Logged"); router.refresh();
      }}>
        <Select value={kind} onValueChange={setKind}><SelectTrigger className="h-10 w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{kinds.map((k) => <SelectItem key={k} value={k}>{label(k)}</SelectItem>)}</SelectContent></Select>
        <div className="relative w-28"><Input inputMode="decimal" className="h-10 pr-9" placeholder="Value" value={value} onChange={(e) => setValue(e.target.value.replace(",", "."))} /><span className="mono-label absolute right-2 top-1/2 -translate-y-1/2">{unitFor(kind, unit)}</span></div>
        <Input type="date" className="h-10 w-40" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button className="h-10">Log</Button>
      </form>
      <section className="mt-6 rounded-xl border bg-card p-4">
        <p className="mono-label mb-3">{label(kind)} trend</p>
        {series.length < 2 ? <p className="py-10 text-center text-sm text-muted-foreground">Log at least two entries to see a chart.</p> : (
          <ChartContainer config={{ value: { label: `${label(kind)} (${unitFor(kind, unit)})`, color: "var(--chart-1)" } }} className="h-52 w-full">
            <LineChart data={series}><CartesianGrid vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis width={40} tickLine={false} axisLine={false} fontSize={11} domain={["auto", "auto"]} /><ChartTooltip content={<ChartTooltipContent />} />
              <Line dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={{ r: 3 }} /></LineChart>
          </ChartContainer>
        )}
      </section>
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
        {kinds.map((k) => { const r = latest.get(k); return (
          <button key={k} onClick={() => setKind(k)} className={`bg-card p-3 text-left hover:bg-muted/50 ${k === kind ? "ring-2 ring-inset ring-primary" : ""}`}>
            <p className="mono-label">{label(k)}</p><p className="font-mono font-semibold tabular-nums">{r ? `${round(show(k, r.value), 1)} ${unitFor(k, unit)}` : "—"}</p>
          </button>); })}
      </div>
      <section className="mt-6">
        <p className="mono-label mb-2">Log · {label(kind)}</p>
        {rows.filter((r) => r.kind === kind).map((r) => (
          <div key={r.id} className="flex items-center border-b py-2 text-sm">
            <span className="flex-1">{new Date(r.date).toLocaleDateString()}</span>
            <span className="font-mono tabular-nums">{round(show(kind, r.value), 1)} {unitFor(kind, unit)}</span>
            <Button variant="ghost" size="icon" className="ml-2 size-7" aria-label="Delete" onClick={async () => { await deleteMeasurementAction(r.id); router.refresh(); }}><Trash2 className="size-3.5" /></Button>
          </div>
        ))}
      </section>
    </div>
  );
}
