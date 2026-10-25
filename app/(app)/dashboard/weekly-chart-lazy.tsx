"use client";
import dynamic from "next/dynamic";
// recharts is ~100kB: load it after the page paints instead of in the tab's critical bundle
export const WeeklyChart = dynamic(() => import("./weekly-chart").then((m) => m.WeeklyChart), { ssr: false, loading: () => <div className="h-48 w-full animate-pulse rounded-md bg-muted" /> });
