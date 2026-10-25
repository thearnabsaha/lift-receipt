"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatIdle, idleMs, isIdle, IDLE_FINISH_FLAG } from "@/lib/idle";
import { readIdleHours, useIdleHours } from "@/lib/prefs";

export const ACTIVE_KEY = "lr-active-workout";
type Draft = { name: string; startedAt: string; lastActivityAt?: string | null };
const readDraft = (): Draft | null => { try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) ?? "null"); } catch { return null; } };

/** Presentational idle prompt shared by the editor and the app-wide guard. */
export function IdleDialog({ open, idle, name, onFinish, onResume, onDiscard }: { open: boolean; idle: number; name: string; onFinish: () => void; onResume: () => void; onDiscard: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) { setConfirm(false); onResume(); } }}>
      <AlertDialogContent data-testid="idle-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>{confirm ? "Discard workout?" : `Your workout has been idle for ${formatIdle(idle)}`}</AlertDialogTitle>
          <AlertDialogDescription>{confirm ? "All sets in this session will be lost. This can't be undone." : `“${name}” is still running. Finishing now ends it at your last activity, so the duration isn't inflated. Only ticked sets are saved.`}</AlertDialogDescription>
        </AlertDialogHeader>
        {confirm ? (
          <AlertDialogFooter className="grid gap-2 sm:flex">
            <Button className="h-11" variant="destructive" onClick={() => { setConfirm(false); onDiscard(); }}>Yes, discard</Button>
            <Button className="h-11" variant="ghost" onClick={() => setConfirm(false)}>Back</Button>
          </AlertDialogFooter>
        ) : (
          <div className="grid gap-2">
            <Button className="h-11 bg-success text-white hover:bg-success/80" onClick={onFinish}>Finish now</Button>
            <Button className="h-11" variant="outline" onClick={onResume}>Resume</Button>
            <Button className="h-11" variant="ghost" onClick={() => setConfirm(true)}><span className="text-destructive">Discard</span></Button>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Polls the local draft (on open, visibility change and every 30s). */
function useDraft() {
  const [d, setD] = useState<Draft | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    const tick = () => { setD(readDraft()); setNow(Date.now()); };
    const t0 = setTimeout(tick, 0); const t = setInterval(tick, 30_000);
    const vis = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", vis); window.addEventListener("lr-draft", tick); window.addEventListener("storage", tick);
    return () => { clearTimeout(t0); clearInterval(t); document.removeEventListener("visibilitychange", vis); window.removeEventListener("lr-draft", tick); window.removeEventListener("storage", tick); };
  }, []);
  return { d, now, refresh: () => { setD(readDraft()); setNow(Date.now()); } };
}
const touch = () => { const d = readDraft(); if (d) localStorage.setItem(ACTIVE_KEY, JSON.stringify({ ...d, lastActivityAt: new Date().toISOString() })); };
const discard = () => { localStorage.removeItem(ACTIVE_KEY); localStorage.removeItem(IDLE_FINISH_FLAG); window.dispatchEvent(new Event("lr-draft")); };

/** App-wide: prompts on any screen except the live editor (which has its own prompt). */
export function IdleGuard() {
  const path = usePathname(); const router = useRouter();
  const hours = useIdleHours();
  const { d, now, refresh } = useDraft();
  if (!d || path.startsWith("/workout/active")) return null;
  const open = isIdle(d, hours, now);
  return <IdleDialog open={open} idle={idleMs(d, now)} name={d.name}
    onFinish={() => { localStorage.setItem(IDLE_FINISH_FLAG, "1"); router.push("/workout/active"); }}
    onResume={() => { touch(); refresh(); router.push("/workout/active"); }}
    onDiscard={() => { discard(); refresh(); router.refresh(); }} />;
}

/** Banner on dashboard / history / workout: resume or discard an ongoing workout. */
export function ActiveWorkoutBanner() {
  const { d, now, refresh } = useDraft();
  const [ask, setAsk] = useState(false);
  if (!d) return null;
  const idle = isIdle(d, readIdleHours() || 3, now);
  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 px-4 py-2.5" data-testid="active-banner">
      <span className="relative flex size-2.5 shrink-0">{!idle && <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />}<span className="relative inline-flex size-2.5 rounded-full bg-success" /></span>
      <span className="min-w-0 flex-1 truncate text-sm"><span className="font-medium">{d.name}</span> {idle ? `idle ${formatIdle(idleMs(d, now))}` : "in progress"}</span>
      {ask ? (
        <><Button size="sm" variant="destructive" className="h-9" onClick={() => { discard(); refresh(); setAsk(false); }}>Discard</Button><Button size="sm" variant="ghost" className="h-9" onClick={() => setAsk(false)}>Keep</Button></>
      ) : (
        <><Button size="sm" variant="ghost" className="h-9 text-muted-foreground" onClick={() => setAsk(true)}>Discard</Button><Button size="sm" asChild className="h-9"><Link href="/workout/active">Resume</Link></Button></>
      )}
    </div>
  );
}
