"use client";
import dynamic from "next/dynamic";

export type SimpleLineProps = { data: Record<string, string | number>[]; dataKey: string; label: string; className: string };
// recharts (~100 kB gzip with its deps) loads after the page paints instead of in the route's critical bundle.
// The sized wrapper keeps the layout fixed while it loads (ResponsiveContainer can't measure on the server anyway).
const Inner = dynamic(() => import("./line-chart").then((m) => m.SimpleLineChart), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-md bg-muted" />,
});
export function SimpleLineChart({ className, ...p }: SimpleLineProps) {
  return <div className={className}><Inner {...p} className="h-full w-full" /></div>;
}
