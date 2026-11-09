"use client";
import Link, { useLinkStatus } from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { User, History, Plus, Dumbbell, Ruler, Calculator, Settings, Trophy } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { OfflineBadge } from "@/components/pwa";
import { IdleGuard } from "@/components/idle-prompt";
import { IdleSync } from "@/components/idle-sync";
import { DeletesSync } from "@/components/delete-workout";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Profile", icon: User },
  { href: "/history", label: "History", icon: History },
  { href: "/workout", label: "Workout", icon: Plus },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/measure", label: "Measure", icon: Ruler },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // optimistic tab: highlight the tapped tab immediately, until the route actually changes
  const [tap, setTap] = useState<{ href: string; from: string } | null>(null);
  const cur = tap && tap.from === path ? tap.href : path;
  const active = (h: string) => cur === h || cur.startsWith(h + "/");
  const scroller = useScrollMemory(path);
  // Height-locked shell: the document never scrolls, only <div data-app-scroller>. Header and tab bar are
  // ordinary flex rows (not position:fixed), so iOS 26 Safari's fixed-anchoring bugs (bottom:0 pinned to the
  // top of the floating toolbar, drifting when it collapses) can't move them, and nothing exists below the bar.
  return (
    <div data-app-shell className="flex h-dvh flex-col overflow-hidden">
      <header className="shrink-0 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] z-40 border-b bg-background/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-[58px] max-w-5xl items-center gap-4 px-4">
          <Link href="/dashboard"><Logo /></Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {TABS.map((t) => (
              <Link key={t.href} href={t.href} className={cn("rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground", active(t.href) && "bg-muted text-foreground")}>{t.label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <OfflineBadge />
            <Link prefetch href="/records" aria-label="Records" className={cn("inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted", active("/records") && "bg-muted")}><Trophy className="size-4" strokeWidth={1.5} /></Link>
            <Link prefetch href="/tools" aria-label="Tools" className={cn("inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted", active("/tools") && "bg-muted")}><Calculator className="size-4" strokeWidth={1.5} /></Link>
            <Link prefetch href="/settings" aria-label="Settings" className={cn("inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted", active("/settings") && "bg-muted")}><Settings className="size-4" strokeWidth={1.5} /></Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div ref={scroller} data-app-scroller className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
        <main className="mx-auto w-full max-w-5xl px-4 pb-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-6 md:pb-12">{children}</main>
      </div>
      <IdleGuard /><IdleSync />
      <DeletesSync />
      {/* Opaque bar, last flex row of the h-dvh shell: always flush with the bottom of the visible viewport. */}
      <nav data-testid="tab-bar" className="z-40 shrink-0 border-t bg-background pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[max(0.25rem,calc(env(safe-area-inset-bottom)-0.75rem))] md:hidden">
        <div className="grid grid-cols-5">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} prefetch onClick={() => { if (!active(t.href)) setTap({ href: t.href, from: path }); }} className={cn("relative flex h-14 touch-manipulation select-none flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors duration-75 active:bg-muted/60", active(t.href) && "text-foreground")}>
              <TabPending />
              <t.icon className="size-5" strokeWidth={active(t.href) ? 2 : 1.5} />
              <span className="font-mono text-[9px] uppercase tracking-widest">{t.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({ label, title, subtitle, action }: { label?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {label && <p className="mono-label mb-1">{label}</p>}
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatStrip({ items }: { items: { label: string; value: React.ReactNode; suffix?: string }[] }) {
  return (
    <div className="receipt grid grid-cols-2 gap-y-4 rounded-xl border px-5 py-6 shadow-[0_1px_3px_#0000001a] sm:grid-cols-4">
      {items.map((i) => (
        <div key={i.label}>
          <p className="mono-label">{i.label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{i.value}{i.suffix && <span className="ml-1 text-xs font-normal text-muted-foreground">{i.suffix}</span>}</p>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ line, children }: { line: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed px-6 py-10 text-center">
      <p className="mono-label mb-2">0.00 · 0 items</p>
      <p className="text-sm text-muted-foreground">{line}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/** Thin bar on the tapped tab while its route is still loading. */
function TabPending() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className={cn("absolute inset-x-5 top-0 h-0.5 rounded-full bg-foreground transition-opacity", pending ? "animate-pulse opacity-100 delay-100" : "opacity-0")} />;
}

/** The app scrolls inside one element, so the browser's own scroll restoration (window only) doesn't apply:
 *  new pages start at the top, Back/Forward returns to where you were. */
function useScrollMemory(path: string) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef(new Map<string, number>());
  const back = useRef(false);
  const last = useRef(path);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onScroll = () => { pos.current.set(last.current, el.scrollTop); };
    const onPop = () => { back.current = true; };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("popstate", onPop); };
  }, []);
  // layout effect: re-key before the scroll events from this navigation are dispatched
  useLayoutEffect(() => {
    const el = ref.current; if (!el || last.current === path) return;
    last.current = path;
    const y = back.current ? pos.current.get(path) ?? 0 : 0;
    back.current = false;
    el.scrollTop = y;
    if (!y) return;
    // the page may still be streaming in: keep re-applying until it is tall enough (max ~1.5 s) unless the user scrolls
    let n = 0, raf = 0;
    const stop = () => { cancelAnimationFrame(raf); el.removeEventListener("touchstart", stop); el.removeEventListener("wheel", stop); };
    const tick = () => { if (el.scrollHeight - el.clientHeight >= y) { el.scrollTop = y; if (++n > 6) return stop(); } raf = requestAnimationFrame(tick); };
    el.addEventListener("touchstart", stop, { passive: true }); el.addEventListener("wheel", stop, { passive: true });
    raf = requestAnimationFrame(tick); const t = setTimeout(stop, 1500);
    return () => { stop(); clearTimeout(t); };
  }, [path]);
  return ref;
}
