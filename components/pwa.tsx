"use client";
import { useEffect, useState } from "react";
import { Download, Share, X, CloudOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { flushQueue, queueSize } from "@/lib/offline";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      let reloading = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => { if (reloading) return; reloading = true; window.location.reload(); });
      const prompt = (w: ServiceWorker) => toast("New version available", { duration: Infinity, id: "sw-update", action: { label: "Reload", onClick: () => w.postMessage("SKIP_WAITING") } });
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then((reg) => {
        if (reg.waiting && navigator.serviceWorker.controller) prompt(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const w = reg.installing;
          w?.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) prompt(w); });
        });
        // iOS standalone rarely reloads; check for updates when the app comes back to the foreground
        document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") reg.update().catch(() => {}); });
      }).catch(() => {});
    }
    // iOS: audio can only start inside a user gesture; unlock the shared AudioContext on the first touch
    const unlock = () => import("@/lib/sound").then((m) => m.unlockAudio());
    for (const ev of ["pointerdown", "touchend", "keydown"]) document.addEventListener(ev, unlock, { once: true, passive: true });
    // keep the iOS keyboard from covering the focused input (e.g. the active set row)
    const reveal = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || !/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      const vv = window.visualViewport; const r = el.getBoundingClientRect();
      const bottom = vv ? vv.height + vv.offsetTop : window.innerHeight;
      if (r.bottom > bottom - 16 || r.top < 80) el.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    const onFocus = () => setTimeout(reveal, 300);
    document.addEventListener("focusin", onFocus);
    window.visualViewport?.addEventListener("resize", reveal);
    const flush = () => flushQueue().then((n) => { if (n) toast.success(`Synced ${n} offline workout${n > 1 ? "s" : ""}`); });
    flush();
    window.addEventListener("online", flush);
    return () => { window.removeEventListener("online", flush); document.removeEventListener("focusin", onFocus); window.visualViewport?.removeEventListener("resize", reveal); };
  }, []);
  return null;
}

export function OfflineBadge() {
  const [offline, setOffline] = useState(false);
  const [queued, setQueued] = useState(0);
  useEffect(() => {
    const up = () => { setOffline(!navigator.onLine); queueSize().then(setQueued); };
    up();
    window.addEventListener("online", up); window.addEventListener("offline", up); window.addEventListener("lr-queue", up);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", up); window.removeEventListener("lr-queue", up); };
  }, []);
  if (!offline && !queued) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      <CloudOff className="size-3" /> {offline ? "Offline" : ""}{queued ? ` · ${queued} queued` : ""}
    </span>
  );
}

export function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone;
    if (standalone || localStorage.getItem("lr-install-dismissed")) return;
    const onBip = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); setHidden(false); };
    window.addEventListener("beforeinstallprompt", onBip);
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isIos) t = setTimeout(() => { setIos(true); setHidden(false); }, 0);
    return () => { window.removeEventListener("beforeinstallprompt", onBip); if (t) clearTimeout(t); };
  }, []);
  if (hidden) return null;
  const dismiss = () => { localStorage.setItem("lr-install-dismissed", "1"); setHidden(true); };
  return (
    <div className="receipt mx-auto mb-4 flex w-full items-center gap-3 rounded-xl border px-4 py-4 shadow-[0_1px_3px_#0000001a]">
      <Download className="size-5 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Install Lift Receipt</p>
        <p className="text-xs text-muted-foreground">
          {ios ? <>Tap <Share className="inline size-3" /> Share, then &ldquo;Add to Home Screen&rdquo;.</> : "Full screen, works offline, one tap from your home screen."}
        </p>
      </div>
      {evt && (
        <Button size="sm" onClick={async () => { await evt.prompt(); await evt.userChoice; setEvt(null); setHidden(true); }}>Install</Button>
      )}
      <Button size="icon" variant="ghost" aria-label="Dismiss" onClick={dismiss}><X className="size-4" /></Button>
    </div>
  );
}
