"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cleanSteps, DEMO_CREDIT, loadDemoIndex, type Demo } from "@/lib/demos";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

/** Start/end frames crossfading as a pseudo-animation. Tap to pause. Static (both labelled) with reduced motion. */
export function DemoFrames({ demo, name }: { demo: Demo; name: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || demo.frames.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % demo.frames.length), 1400);
    return () => clearInterval(t);
  }, [paused, demo.frames.length]);
  return (
    <figure className="m-0">
      <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play demo" : "Pause demo"}
        className="relative block aspect-square w-full overflow-hidden rounded-xl border bg-white shadow-[0_1px_3px_#0000001a] dark:bg-black" data-testid="demo-frames">
        {demo.frames.map((f, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={f} src={f} alt={`${name}: ${k === 0 ? "start" : "end"} position`} width={480} height={480} loading="lazy" decoding="async" draggable={false}
            className="absolute inset-0 size-full object-contain p-3 transition-opacity duration-500 ease-in-out select-none dark:invert motion-reduce:transition-none"
            style={{ opacity: k === i ? 1 : 0 }} />
        ))}
        <span className="absolute left-2 top-2 rounded-full border bg-background/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
          {i === 0 ? "Start" : "End"}{paused ? " · Paused" : ""}
        </span>
        <span className="absolute bottom-2 right-2 flex gap-1" aria-hidden>
          {demo.frames.map((f, k) => <span key={f} className={`size-1.5 rounded-full ${k === i ? "bg-foreground" : "bg-foreground/25"}`} />)}
        </span>
      </button>
      <figcaption className="mt-1.5 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Drawing: <a href={DEMO_CREDIT.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">{DEMO_CREDIT.name}</a> · <a href={DEMO_CREDIT.licenseUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">{DEMO_CREDIT.license}</a>
      </figcaption>
    </figure>
  );
}

/** Muscles + numbered steps, receipt style. */
export function DemoDetails({ demo }: { demo: Demo }) {
  const steps = cleanSteps(demo.steps);
  return (
    <div className="space-y-4">
      {(demo.primary.length > 0 || demo.secondary.length > 0) && (
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {demo.primary.length > 0 && <><span className="mono-label pt-0.5 text-[10px]">Primary</span><span>{demo.primary.join(", ")}</span></>}
          {demo.secondary.length > 0 && <><span className="mono-label pt-0.5 text-[10px]">Secondary</span><span className="text-muted-foreground">{demo.secondary.join(", ")}</span></>}
        </div>
      )}
      {steps.length > 0 && (<>
        <div className="tear" />
        <ol className="space-y-2.5 text-sm">
          {steps.map((s, k) => (
            <li key={k} className="grid grid-cols-[1.75rem_1fr] gap-1">
              <span className="font-mono text-xs leading-5 text-muted-foreground tabular-nums">{String(k + 1).padStart(2, "0")}</span><span className="leading-5">{s}</span>
            </li>
          ))}
        </ol>
      </>)}
    </div>
  );
}

export function DemoBlock({ demo, name }: { demo: Demo; name: string }) {
  return <div className="grid gap-5 sm:grid-cols-[minmax(0,280px)_1fr]"><DemoFrames demo={demo} name={name} /><DemoDetails demo={demo} /></div>;
}

/** Bottom sheet for the workout screen: tap an exercise name to see how to do it. Loads the demo index lazily. */
export function ExerciseDemoSheet({ open, onOpenChange, exerciseId, name, instructions }: { open: boolean; onOpenChange: (o: boolean) => void; exerciseId: string; name: string; instructions?: string | null }) {
  const [state, setState] = useState<{ id: string; demo: Demo | null } | "loading" | "error">("loading");
  useEffect(() => {
    if (!open) return;
    let live = true;
    loadDemoIndex().then((ix) => { if (live) setState({ id: exerciseId, demo: ix[exerciseId] ?? null }); }).catch(() => { if (live) setState("error"); });
    return () => { live = false; };
  }, [open, exerciseId]);
  const demo = typeof state === "object" && state.id === exerciseId ? state.demo : undefined;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[88dvh] max-w-xl gap-0 overflow-y-auto overscroll-contain rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]" data-testid="demo-sheet">
        <SheetHeader className="pr-12">
          <p className="mono-label">How to</p>
          <SheetTitle className="text-xl font-semibold tracking-tight">{name}</SheetTitle>
          <SheetDescription className="sr-only">Exercise demo and instructions</SheetDescription>
        </SheetHeader>
        <div className="space-y-5 px-4">
          {demo === undefined && state !== "error" && <><Skeleton className="aspect-square w-full rounded-xl" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-full" /></>}
          {demo && <><DemoFrames demo={demo} name={name} /><DemoDetails demo={demo} /></>}
          {(demo === null || state === "error") && (
            <div className="rounded-xl border border-dashed p-5 text-center">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">No demo · {state === "error" ? "offline" : "yet"}</p>
              {instructions ? <p className="mt-2 text-left text-sm">{instructions}</p> : <p className="mt-1 text-sm text-muted-foreground">{state === "error" ? "Demos load when you're online." : "There's no drawing for this exercise."}</p>}
            </div>
          )}
          {demo && instructions && <p className="rounded-xl border p-3 text-sm"><span className="mono-label mb-1 block text-[10px]">Your note</span>{instructions}</p>}
          <Link href={`/exercises/${exerciseId}`} className="flex h-11 items-center justify-center rounded-lg border border-dashed text-sm hover:bg-muted/60">History &amp; charts →</Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
