"use client";
import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthGrid, shiftMonth, type TrainingCalendar } from "@/lib/calendar";

const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const monthLabel = (m: string) => new Date(`${m}-01T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const dayLabel = (k: string) => new Date(`${k}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const DOT = { 1: "size-1 opacity-50", 2: "size-1.5 opacity-75", 3: "size-2" } as const;

export function StreakStrip({ cal }: { cal: TrainingCalendar }) {
  const cells: [string, number, string][] = [["This week", cal.thisWeek, cal.thisWeek === 1 ? "workout" : "workouts"], ["Streak", cal.currentStreak, cal.currentStreak === 1 ? "week" : "weeks"], ["Best", cal.longestStreak, cal.longestStreak === 1 ? "week" : "weeks"]];
  return (
    <div className="grid grid-cols-3 divide-x rounded-xl border bg-card" data-testid="streaks">
      {cells.map(([l, n, u]) => (
        <div key={l} className="px-3 py-2.5">
          <p className="mono-label text-[10px]">{l}</p>
          <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums leading-tight">{n}<span className="ml-1 text-xs font-normal text-muted-foreground">{u}</span></p>
        </div>
      ))}
    </div>
  );
}

export function HistoryCalendar({ cal, cards, initialDay }: { cal: TrainingCalendar; cards: Record<string, ReactNode[]>; initialDay?: string }) {
  const thisMonth = cal.today.slice(0, 7);
  const first = Object.keys(cal.days).sort()[0]?.slice(0, 7) ?? thisMonth;
  const [day, setDay] = useState(initialDay && /^\d{4}-\d{2}-\d{2}$/.test(initialDay) ? initialDay : cal.today);
  const [month, setMonth] = useState(day.slice(0, 7) > thisMonth ? thisMonth : day.slice(0, 7));
  const canPrev = month > first, canNext = month < thisMonth;
  const go = (n: number) => { if (n < 0 ? canPrev : canNext) setMonth((m) => shiftMonth(m, n)); };
  const pick = (k: string) => { setDay(k); const u = new URL(location.href); u.searchParams.set("day", k); history.replaceState(history.state, "", u); };
  const touch = useRef<{ x: number; y: number } | null>(null);
  const grid = monthGrid(month);
  let monthCount = 0; for (const k of grid) if (k) monthCount += cal.days[k]?.count ?? 0;
  const list = cards[day] ?? [];
  return (
    <div className="space-y-4" data-testid="calendar">
      <StreakStrip cal={cal} />
      <div className="rounded-xl border bg-card p-3 shadow-[0_1px_3px_#0000001a]">
        <div className="mb-2 flex items-center">
          <button type="button" onClick={() => go(-1)} disabled={!canPrev} aria-label="Previous month" className="grid size-11 place-items-center rounded-full disabled:opacity-25 active:bg-muted"><ChevronLeft className="size-5" /></button>
          <div className="flex-1 text-center">
            <p className="font-semibold" aria-live="polite">{monthLabel(month)}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{monthCount} {monthCount === 1 ? "workout" : "workouts"}</p>
          </div>
          <button type="button" onClick={() => go(1)} disabled={!canNext} aria-label="Next month" className="grid size-11 place-items-center rounded-full disabled:opacity-25 active:bg-muted"><ChevronRight className="size-5" /></button>
        </div>
        <div className="grid touch-pan-y grid-cols-7 gap-y-1 text-center select-none"
          onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={(e) => { const s = touch.current; touch.current = null; if (!s) return; const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y; if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) go(dx < 0 ? 1 : -1); }}>
          {DOW.map((d, i) => <span key={i} className="pb-1 font-mono text-[10px] text-muted-foreground">{d}</span>)}
          {grid.map((k, i) => {
            if (!k) return <span key={i} />;
            const d = cal.days[k], sel = k === day, today = k === cal.today, future = k > cal.today;
            return (
              <button key={k} type="button" disabled={future} onClick={() => pick(k)} data-day={k} data-level={d?.level ?? 0}
                aria-label={`${dayLabel(k)}${d ? `, ${d.count} ${d.count === 1 ? "workout" : "workouts"}` : ""}`} aria-pressed={sel}
                className={`relative mx-auto flex h-11 w-11 flex-col items-center justify-center rounded-full font-mono text-sm tabular-nums transition-colors disabled:opacity-30
                  ${sel ? "bg-primary text-primary-foreground" : today ? "ring-1 ring-foreground ring-inset" : "active:bg-muted"} ${d ? "font-semibold" : "text-muted-foreground"}`}>
                {Number(k.slice(8))}
                <span className={`absolute bottom-1.5 rounded-full ${sel ? "bg-primary-foreground" : "bg-foreground"} ${d ? DOT[d.level] : "size-1 opacity-0"}`} aria-hidden />
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-end gap-1.5 font-mono text-[10px] text-muted-foreground" aria-hidden>
          Less {([1, 2, 3] as const).map((l) => <span key={l} className={`rounded-full bg-foreground ${DOT[l]}`} />)} More volume
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <p className="mono-label">{day === cal.today ? "Today" : dayLabel(day)}</p>
          {day !== cal.today && <button type="button" className="font-mono text-[11px] text-muted-foreground underline-offset-2 hover:underline" onClick={() => { pick(cal.today); setMonth(thisMonth); }}>Today</button>}
        </div>
        {list.length ? <div className="space-y-3">{list}</div>
          : <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">Rest day.</p>}
      </div>
    </div>
  );
}
