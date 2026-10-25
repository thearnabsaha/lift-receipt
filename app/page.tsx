import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, Calendar, LineChart, ListChecks, Timer, Trophy, WifiOff } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const FEATURES = [
  { icon: ListChecks, t: "Log every set", d: "Weight, reps, RPE, warm-ups, drop sets, supersets. The previous column fills itself." },
  { icon: Timer, t: "Rest timer", d: "Starts when you tick a set. Per-exercise overrides, vibrate + beep when done." },
  { icon: Trophy, t: "PRs, automatically", d: "Max weight, estimated 1RM, best volume and rep records on every receipt." },
  { icon: LineChart, t: "Progress charts", d: "Per-exercise e1RM, top weight and volume over time. Bodyweight too." },
  { icon: Calendar, t: "History & routines", d: "Calendar view, editable logs, folders of routines you can start in one tap." },
  { icon: WifiOff, t: "Works offline", d: "Installable PWA. Log in a basement gym; it syncs when you're back online." },
  { icon: Bot, t: "MCP for Grok Bot", d: "Connect your AI assistant to log workouts and read your progress by chat." },
];

export default async function Landing() {
  if (await getSession()) redirect("/workout");
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4">
        <Logo />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm"><Link href="/sign-in">Sign in</Link></Button>
          <Button asChild size="sm"><Link href="/sign-up">Get started</Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5">
        <section className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
          <div>
            <p className="mono-label">Workout tracker · Gym log</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Every lift,<br />itemised.</h1>
            <p className="mt-4 max-w-md text-muted-foreground">Fortis is a fast, no-nonsense gym log. Track sets, beat PRs and see your progress — on your phone, offline, or through your AI assistant.</p>
            <div className="mt-6 flex gap-3">
              <Button asChild size="lg" className="active:translate-y-px"><Link href="/sign-up">Start logging — free</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/sign-in">I have an account</Link></Button>
            </div>
          </div>
          <div className="receipt mx-auto w-full max-w-sm rounded-xl border px-6 py-8 font-mono text-sm shadow-[0_1px_3px_#0000001a]">
            <p className="mono-label text-center">Fortis · No. 000142</p>
            <p className="mt-2 text-center font-sans text-xl font-semibold">Push Day</p>
            <p className="mono-label text-center">Tue · 07:12 · 58 min</p>
            <div className="tear my-4" />
            {[["Bench Press (Barbell)", "100 kg × 5", true], ["Incline Bench (Dumbbell)", "34 kg × 8", false], ["Overhead Press", "60 kg × 6", true], ["Triceps Pushdown", "40 kg × 12", false]].map(([n, s, pr]) => (
              <div key={n as string} className="flex justify-between gap-2 py-0.5"><span className="truncate">3 × {n}</span><span className="shrink-0">{s}{pr ? " ★" : ""}</span></div>
            ))}
            <div className="tear my-4" />
            <div className="flex justify-between font-semibold"><span>TOTAL VOLUME</span><span>8,420 kg</span></div>
            <div className="flex justify-between text-muted-foreground"><span>PRS</span><span>2</span></div>
          </div>
        </section>
        <section className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: I, t, d }) => (
            <div key={t} className="bg-card p-5"><I className="size-5" /><p className="mt-3 font-semibold">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </section>
        <footer className="py-10 text-center"><p className="mono-label">Free forever · Your data, exportable as CSV</p></footer>
      </main>
    </div>
  );
}
