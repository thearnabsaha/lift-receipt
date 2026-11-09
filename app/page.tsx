import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight, Bot, CalendarDays, Download, Flame, Globe, Headphones, LineChart, ListChecks,
  PlayCircle, Plus, Share, Smartphone, SquarePlus, TrendingUp, Trophy, WifiOff,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { Logo, LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: { absolute: "Fortis · The gym log that prints every lift like a receipt" },
  description:
    "Free workout tracker for iPhone and the web. Log sets offline, follow routines, get automatic progression, PRs and estimated 1RM, form videos for every exercise, and let your AI assistant log workouts for you.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: "/", siteName: "Fortis",
    title: "Fortis · Every lift, itemised.",
    description: "Free gym log: offline set logging, routines, auto progression, PRs, form videos, AI assistant (MCP).",
  },
  twitter: { card: "summary_large_image", creator: "@TheArnabSaha", title: "Fortis · Every lift, itemised." },
};

const RECEIPT: [string, string, boolean][] = [
  ["Bench Press", "100 kg × 5", true],
  ["Incline DB Press", "34 kg × 8", false],
  ["Overhead Press", "60 kg × 6", true],
  ["Lateral Raise", "12 kg × 15", false],
  ["Triceps Pushdown", "40 kg × 12", false],
];

const FEATURES = [
  { icon: ListChecks, t: "Log every set", d: "Weight, reps, RPE, warm-up and drop sets, supersets. Last time's numbers sit right next to this time's." },
  { icon: WifiOff, t: "Works offline", d: "No signal in the basement gym? Keep logging. Everything syncs when you're back online." },
  { icon: TrendingUp, t: "Auto progression", d: "Pick double or linear progression and Fortis suggests your next weight and reps for you." },
  { icon: Trophy, t: "PRs & estimated 1RM", d: "Heaviest weight, best estimated 1RM, rep and volume records, flagged the moment you set them." },
  { icon: CalendarDays, t: "Calendar & streak", d: "See every session on a monthly calendar and keep your weekly streak alive." },
  { icon: PlayCircle, t: "Demos & form videos", d: "Step-by-step drawings plus 2–3 short form videos per exercise, opening full screen." },
  { icon: LineChart, t: "Progress charts", d: "Estimated 1RM, top weight and volume per exercise over time, plus bodyweight and measurements." },
  { icon: Download, t: "Backup & export", d: "Full backup and CSV export any time. Import your history from Strong, Hevy or FitNotes." },
  { icon: Bot, t: "Talk to your AI", d: "Built-in MCP server, so an assistant like Grok Bot can log workouts and read your progress." },
];

const FAQ: [string, string][] = [
  ["Is it really free?", "Yes. No ads, no paywall, no premium tier. Sign up and every feature is yours."],
  ["Is there an App Store app?", "Fortis is a web app you install from Safari. Add it to your Home Screen and it opens full screen like any other app, with its own icon."],
  ["Does it work without internet?", "Yes. Sets you log offline are saved on your phone and sync automatically when you reconnect."],
  ["Will it stop my music?", "No. Fortis never pauses YouTube Music, Spotify or anything else playing in the background."],
  ["What about time zones?", "Fortis follows your phone's time zone, so dates and streaks stay right when you travel or move."],
  ["Can I bring my old workouts?", "Yes. Import a CSV export from Strong, Hevy or FitNotes, and export your own data whenever you like."],
  ["How does the AI part work?", "Fortis has an MCP server. Connect it to an assistant like Grok Bot and ask it to log a session, find your PRs or plan your next workout."],
];

function Cta({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <Button asChild className="h-12 rounded-xl px-6 text-base hover:bg-primary/85">
        <Link href="/sign-up">Start logging free <ArrowRight className="size-4" /></Link>
      </Button>
      <Button asChild variant="outline" className="h-12 rounded-xl px-6 text-base">
        <Link href="/sign-in">I have an account</Link>
      </Button>
    </div>
  );
}

function SectionHead({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="mono-label">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground text-pretty">{sub}</p>}
    </div>
  );
}

/** The hero receipt: lines "print" in one by one (CSS only; static under prefers-reduced-motion). */
function PrintingReceipt() {
  let i = 0;
  const d = () => ({ animationDelay: `${300 + i++ * 180}ms` });
  return (
    <div className="receipt w-full rounded-2xl border p-5 font-mono text-[12.5px] shadow-[0_1px_3px_#0000001a] sm:p-6">
      <div className="lp-line flex items-center justify-between" style={d()}>
        <span className="mono-label">Fortis · No. 000142</span>
        <span className="mono-label">58 min</span>
      </div>
      <p className="lp-line mt-3 font-sans text-2xl font-semibold tracking-tight" style={d()}>Push Day</p>
      <p className="lp-line mono-label mt-1" style={d()}>Tue 07:12 · 5 exercises · 15 sets</p>
      <div className="lp-line tear my-4" style={d()} />
      <div className="lp-line mono-label mb-1.5 flex justify-between" style={d()}><span>Item</span><span>Best set</span></div>
      {RECEIPT.map(([n, s, pr]) => (
        <div key={n} className="lp-line flex justify-between gap-3 py-1" style={d()}>
          <span className="truncate">3 × {n}</span>
          <span className="shrink-0 tabular-nums">{s}{pr && <span className="ml-1.5 rounded bg-success/15 px-1 py-px text-[10px] font-semibold text-success">PR</span>}</span>
        </div>
      ))}
      <div className="lp-line tear my-4" style={d()} />
      <div className="lp-line flex justify-between text-muted-foreground" style={d()}><span>Est. 1RM · Bench</span><span className="tabular-nums">116.7 kg</span></div>
      <div className="lp-line flex justify-between text-muted-foreground" style={d()}><span>Personal records</span><span className="tabular-nums">2</span></div>
      <div className="lp-line mt-2 flex items-baseline justify-between text-base font-semibold" style={d()}>
        <span>TOTAL VOLUME</span><span className="tabular-nums">8,420 <span className="text-xs font-normal text-muted-foreground">kg</span></span>
      </div>
    </div>
  );
}

/** HTML/CSS phone frame showing a Fortis-style active workout screen (illustrative). */
function PhoneMock() {
  const rows: [string, string, string, boolean][] = [
    ["W", "60 × 8", "60", true], ["1", "97.5 × 5", "100", true], ["2", "97.5 × 5", "100", true], ["3", "97.5 × 5", "100", false],
  ];
  return (
    <div className="relative mx-auto w-[260px] shrink-0 rounded-[2.6rem] border-[7px] border-foreground/90 bg-background p-3 pt-8 shadow-[0_30px_60px_-20px_#00000040] dark:border-white/15">
      <div className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-foreground/90 dark:bg-white/15" />
      <div className="flex items-center justify-between px-1">
        <span className="mono-label text-[9px]">Active · 24:18</span>
        <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">Finish</span>
      </div>
      <p className="mt-2 px-1 text-lg font-semibold tracking-tight">Push Day</p>
      <div className="mt-2 rounded-xl border bg-card p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold">Bench Press</p>
          <PlayCircle className="size-4 text-muted-foreground" />
        </div>
        <p className="mt-1 rounded-md bg-success/10 px-1.5 py-1 font-mono text-[9px] text-success">NEXT · 100 kg × 5 (+2.5)</p>
        <div className="mt-2 grid grid-cols-[18px_1fr_34px_18px] gap-x-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          <span>Set</span><span>Previous</span><span>kg×r</span><span />
        </div>
        {rows.map(([s, p, w, done]) => (
          <div key={s} className={`mt-1 grid grid-cols-[18px_1fr_34px_18px] items-center gap-x-2 rounded-md px-0 py-1 font-mono text-[11px] ${done ? "bg-success/10" : ""}`}>
            <span className={s === "W" ? "text-amber-500" : ""}>{s}</span>
            <span className="text-muted-foreground">{p}</span>
            <span className="tabular-nums">{s === "W" ? "60×8" : `${w}×5`}</span>
            <span className={`grid size-4 place-items-center rounded text-[9px] ${done ? "bg-success text-white" : "border"}`}>{done ? "✓" : ""}</span>
          </div>
        ))}
        <p className="mt-2 rounded-md border border-dashed py-1 text-center text-[10px] text-muted-foreground">+ Add set</p>
      </div>
      <div className="mt-2 rounded-xl border bg-card p-2.5">
        <p className="text-[13px] font-semibold">Overhead Press</p>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">3 sets · double 6–10</p>
      </div>
      <div className="mt-3 flex justify-around border-t pt-2 text-muted-foreground">
        {[ListChecks, CalendarDays, Trophy, LineChart].map((I, k) => <I key={k} className={`size-4 ${k === 0 ? "text-foreground" : ""}`} />)}
      </div>
    </div>
  );
}

function StreakCalendar() {
  // Illustrative month: which days have a logged session.
  const done = new Set([2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25]);
  const today = 26;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[0_1px_3px_#0000001a]">
      <div className="flex items-center justify-between">
        <p className="font-semibold">November</p>
        <span className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider">
          <Flame className="size-3.5 text-amber-500" /> 4-week streak
        </span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center font-mono text-[10px] uppercase text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((x, k) => <span key={k}>{x}</span>)}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 30 }, (_, k) => k + 1).map((n) => (
          <span key={n} className={`grid h-9 place-items-center rounded-lg text-xs tabular-nums ${done.has(n) ? "bg-primary font-semibold text-primary-foreground" : n === today ? "border-2 border-foreground" : "text-muted-foreground"}`}>{n}</span>
        ))}
      </div>
    </div>
  );
}

export default async function Landing() {
  if (await getSession()) redirect("/workout");
  return (
    <div className="min-h-dvh overflow-x-clip">
      <header className="sticky top-0 z-40 border-b bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-5">
          <Link href="/" aria-label="Fortis home"><Logo /></Link>
          <nav className="ml-6 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#progression" className="hover:text-foreground">Progression</a>
            <a href="#ai" className="hover:text-foreground">AI</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="h-8"><Link href="/sign-in">Sign in</Link></Button>
            <Button asChild size="sm" className="h-8 px-3"><Link href="/sign-up">Get started</Link></Button>
          </div>
        </div>
      </header>

      <main className="pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        {/* HERO */}
        <section className="relative">
          <div aria-hidden className="lp-grid pointer-events-none absolute inset-0 -z-10" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pb-24">
            <div className="lp-rise">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" /> Free · Offline · Installable
              </span>
              <h1 className="mt-5 text-[2.9rem] font-semibold leading-[1.02] tracking-tighter text-balance sm:text-6xl lg:text-7xl">
                Every lift,<br /><span className="text-muted-foreground">itemised.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground text-pretty">
                Fortis is the fast, no-nonsense gym log. Tap in your sets, get your next weight suggested, and watch every session print like a receipt. On your iPhone, offline, or through your AI.
              </p>
              <Cta className="mt-8" />
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <li>No ads</li><li>No paywall</li><li>Export anytime</li>
              </ul>
            </div>
            <div className="relative mx-auto flex w-full max-w-md items-end justify-center">
              <div className="relative w-full max-w-[360px]">
                <PrintingReceipt />
                <div className="lp-line absolute -bottom-8 left-3 flex items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-[0_8px_24px_-8px_#00000030] sm:-bottom-5 sm:-left-8" style={{ animationDelay: "2700ms" }}>
                  <TrendingUp className="size-4 text-success" />
                  <span className="font-mono text-[11px] uppercase tracking-wider">Next bench · <b className="text-foreground">102.5 kg × 5</b></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FACT STRIP */}
        <section className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-4">
            {[
              ["Price", "Free", "forever"], ["Form videos", "2–3", "per exercise"],
              ["Offline", "Yes", "syncs later"], ["AI", "MCP", "built in"],
            ].map(([l, v, s]) => (
              <div key={l} className="bg-card p-5">
                <p className="mono-label">{l}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{v} <span className="text-sm font-normal text-muted-foreground">{s}</span></p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:py-28">
          <SectionHead label="Features · 01" title="Everything you need between sets. Nothing you don't." sub="Built for the gym floor: big tap targets, instant screens, and your history one swipe away." />
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: I, t, d }) => (
              <div key={t} className="group bg-card p-6 transition-colors hover:bg-muted/50">
                <span className="grid size-10 place-items-center rounded-xl border bg-background transition-transform group-hover:-translate-y-0.5"><I className="size-5" strokeWidth={1.75} /></span>
                <p className="mt-4 font-semibold">{t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS + PHONE */}
        <section className="border-y bg-card/60">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-[1fr_auto]">
            <div>
              <SectionHead label="How it works · 02" title="Three taps from warm-up to receipt." />
              <ol className="mt-10 space-y-4">
                {[
                  ["Pick a routine", "Start from one of your routines or an empty workout. Last session's numbers are already filled in."],
                  ["Tick your sets", "Enter weight and reps, tick the set. Change one set and update every set below it in one go."],
                  ["Finish & print", "Get your receipt: volume, best sets, new PRs and your suggested weights for next time."],
                ].map(([t, d], k) => (
                  <li key={t} className="flex gap-4 rounded-2xl border bg-background p-5">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Step<br /><span className="text-2xl font-semibold tracking-tight text-foreground">0{k + 1}</span></span>
                    <span><span className="block font-semibold">{t}</span><span className="mt-1 block text-sm text-muted-foreground">{d}</span></span>
                  </li>
                ))}
              </ol>
            </div>
            <PhoneMock />
          </div>
        </section>

        {/* PROGRESSION + STREAK */}
        <section id="progression" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:py-28">
          <SectionHead label="Progression · 03" title="Stop guessing what to lift next." sub="Turn on double or linear progression per exercise. When you earn it, Fortis adds the weight. When you don't, it tells you exactly what to aim for." />
          <div className="mt-10 grid items-start gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border bg-card p-5 font-mono text-[13px] shadow-[0_1px_3px_#0000001a] sm:p-6">
              <div className="flex items-center justify-between"><span className="mono-label">Bench Press · Double 8–12</span><span className="mono-label">+2.5 kg</span></div>
              <p className="mono-label mt-5">Last session</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["80 × 12", "80 × 12", "80 × 12"].map((s, k) => <span key={k} className="rounded-lg border bg-success/10 py-2 text-center tabular-nums">{s}</span>)}
              </div>
              <div className="tear my-5" />
              <p className="mono-label">Next session</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {["82.5 × 8", "82.5 × 8", "82.5 × 8"].map((s, k) => <span key={k} className="rounded-lg bg-primary py-2 text-center font-semibold tabular-nums text-primary-foreground">{s}</span>)}
              </div>
              <p className="mt-5 font-sans text-sm text-muted-foreground">All working sets hit 12 reps at 80 kg. Add 2.5 kg and restart at 8 reps.</p>
            </div>
            <div className="grid gap-5">
              <StreakCalendar />
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl border bg-card p-5"><p className="mono-label">Est. 1RM</p><p className="mt-2 text-2xl font-semibold tabular-nums">116.7 <span className="text-sm font-normal text-muted-foreground">kg</span></p><p className="mt-1 text-xs text-success">▲ new record</p></div>
                <div className="rounded-2xl border bg-card p-5"><p className="mono-label">Best volume</p><p className="mt-2 text-2xl font-semibold tabular-nums">3,000 <span className="text-sm font-normal text-muted-foreground">kg</span></p><p className="mt-1 text-xs text-muted-foreground">Bench · single session</p></div>
              </div>
            </div>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Example data for illustration</p>
        </section>

        {/* AI */}
        <section id="ai" className="scroll-mt-20 bg-foreground text-background dark:border-y dark:bg-card dark:text-foreground">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest opacity-60">Ask your AI · 04</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Log a workout by just saying it.</h2>
              <p className="mt-3 opacity-70 text-pretty">Fortis ships with an MCP server. Connect an assistant like Grok Bot and it can log sessions, look up PRs, read your calendar and suggest your next progression, all from a chat.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["log_workout", "add_set", "list_personal_records", "get_training_calendar", "suggest_progression"].map((t) => (
                  <code key={t} className="rounded-full border border-background/20 px-3 dark:border-border py-1 font-mono text-[11px]">{t}</code>
                ))}
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-background/10 px-4 py-3 dark:bg-muted">Log today&apos;s legs: squat 3×5 at 120, RDL 3×8 at 90. Any PRs?</div>
              <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-background/15 px-4 py-3 dark:border-border">
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">fortis · log_workout ✓</p>
                <p className="mt-2">Logged <b>Legs</b>: 6 sets, 3,960 kg total volume. Squat 120 × 5 is a new heaviest set. 🎉 Next time I&apos;d go 122.5 × 5.</p>
              </div>
              <p className="pt-1 font-mono text-[10px] uppercase tracking-widest opacity-50">Example conversation</p>
            </div>
          </div>
        </section>

        {/* INSTALL */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <SectionHead label="Install · 05" title="On your Home Screen in 10 seconds." sub="No App Store needed. Fortis installs from Safari and opens full screen, with its own icon, offline support and notifications." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [Globe, "Open in Safari", "Go to lift-receipt.vercel.app on your iPhone."],
              [Share, "Tap Share", "The square with the arrow, at the bottom of Safari."],
              [SquarePlus, "Add to Home Screen", "Tap Add. Fortis now opens like a native app."],
            ].map(([I, t, d], k) => {
              const Icon = I as typeof Globe;
              return (
                <div key={t as string} className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center justify-between"><Icon className="size-6" strokeWidth={1.75} /><span className="mono-label">0{k + 1}</span></div>
                  <p className="mt-5 font-semibold">{t as string}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Headphones className="size-4" /> Never interrupts your music</span>
            <span className="flex items-center gap-2"><Globe className="size-4" /> Follows your phone&apos;s time zone</span>
            <span className="flex items-center gap-2"><Smartphone className="size-4" /> Made for iPhone, works everywhere</span>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 pb-20 md:pb-28">
          <SectionHead label="FAQ · 06" title="Questions, answered." />
          <div className="mt-8 divide-y rounded-2xl border bg-card">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {q}<Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden className="lp-grid pointer-events-none absolute inset-0" />
            <div className="relative">
              <LogoMark className="mx-auto size-12" />
              <h2 className="mx-auto mt-6 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">Your next PR deserves a receipt.</h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">Free, fast and ready before your first warm-up set.</p>
              <Cta className="mt-8 justify-center" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              Made by <span className="text-foreground">Arnab Saha</span> ·{" "}
              <a href="https://x.com/TheArnabSaha" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">X ↗</a> ·{" "}
              <a href="https://github.com/thearnabsaha" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">GitHub ↗</a>
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
            <Link href="/sign-in" className="hover:text-foreground">Sign in</Link>
            <Link href="/sign-up" className="hover:text-foreground">Create account</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
