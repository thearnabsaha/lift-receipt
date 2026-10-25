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
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
    const flush = () => flushQueue().then((n) => { if (n) toast.success(`Synced ${n} offline workout${n > 1 ? "s" : ""}`); });
    flush();
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
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
