"use client";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const METRICS = { e1rm: "Best e1RM", max: "Max weight", volume: "Volume" } as const;
type M = keyof typeof METRICS;

export function ExerciseCharts({ data, unit }: { data: { date: string; e1rm: number; max: number; volume: number }[]; unit: string }) {
  const [m, setM] = useState<M>("e1rm");
  const config = { [m]: { label: `${METRICS[m]} (${unit})`, color: "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <section className="mt-8 rounded-xl border bg-card p-4">
      <div className="mb-3 flex gap-1 rounded-full border p-0.5 text-sm w-fit">
        {(Object.keys(METRICS) as M[]).map((k) => <button key={k} onClick={() => setM(k)} className={`rounded-full px-3 py-1 ${m === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{METRICS[k]}</button>)}
      </div>
      {data.length < 2 ? <p className="py-12 text-center text-sm text-muted-foreground">Log this exercise twice to see a trend.</p> : (
        <ChartContainer config={config} className="h-56 w-full">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v: string) => v.slice(5)} />
            <YAxis width={40} tickLine={false} axisLine={false} fontSize={11} domain={["auto", "auto"]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey={m} stroke={`var(--color-${m})`} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartContainer>
      )}
    </section>
  );
}
