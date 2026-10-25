"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";

export function HistoryCalendar({ workouts }: { workouts: { id: string; name: string; date: string }[] }) {
  const [day, setDay] = useState<Date | undefined>(new Date());
  const dates = useMemo(() => workouts.map((w) => new Date(w.date)), [workouts]);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const onDay = day ? workouts.filter((w) => sameDay(new Date(w.date), day)) : [];
  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr]">
      <div className="rounded-xl border bg-card p-2">
        <Calendar mode="single" selected={day} onSelect={setDay} modifiers={{ trained: dates }}
          modifiersClassNames={{ trained: "[&>button]:bg-success/20 [&>button]:font-semibold" }} />
      </div>
      <div>
        <p className="mono-label mb-2">{day?.toDateString() ?? "Pick a day"}</p>
        {onDay.length ? onDay.map((w) => (
          <Link key={w.id} href={`/history/${w.id}`} className="mb-2 flex items-center rounded-xl border px-3 py-2.5 hover:bg-muted/60">
            <span className="flex-1 font-medium">{w.name}</span><span className="text-sm">→</span>
          </Link>
        )) : <p className="text-sm text-muted-foreground">Rest day.</p>}
      </div>
    </div>
  );
}
