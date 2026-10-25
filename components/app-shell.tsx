"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, History, Plus, Dumbbell, Ruler, Calculator, Settings } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { OfflineBadge } from "@/components/pwa";
import { IdleGuard } from "@/components/idle-prompt";
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
  const active = (h: string) => path === h || path.startsWith(h + "/");
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] z-40 border-b bg-background/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-[58px] max-w-5xl items-center gap-4 px-4">
          <Link href="/dashboard"><Logo /></Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {TABS.map((t) => (
              <Link key={t.href} href={t.href} className={cn("rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground", active(t.href) && "bg-muted text-foreground")}>{t.label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <OfflineBadge />
            <Link href="/tools" aria-label="Tools" className={cn("inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted", active("/tools") && "bg-muted")}><Calculator className="size-4" strokeWidth={1.5} /></Link>
            <Link href="/settings" aria-label="Settings" className={cn("inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted", active("/settings") && "bg-muted")}><Settings className="size-4" strokeWidth={1.5} /></Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-6 md:pb-12">{children}</main>
      <IdleGuard />
      <DeletesSync />
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-muted-foreground", active(t.href) && "text-foreground")}>
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
