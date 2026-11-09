"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { SimpleLineProps } from "./line-chart-lazy";

/** Date-keyed single-series line chart used by Measure and exercise detail. */
export function SimpleLineChart({ data, dataKey, label, className }: SimpleLineProps) {
  const config = { [dataKey]: { label, color: "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className={className}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v: string) => v.slice(5)} />
        <YAxis width={40} tickLine={false} axisLine={false} fontSize={11} domain={["auto", "auto"]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey={dataKey} stroke={`var(--color-${dataKey})`} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ChartContainer>
  );
}
