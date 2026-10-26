"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { pushStatusAction, subscribePushAction, testPushAction, unsubscribePushAction } from "@/app/actions";
import { PUSH_FLAG, isStandalone, pushSupported, urlB64ToUint8 } from "@/lib/push-client";

type RowT = (p: { title: string; desc?: string; children: React.ReactNode }) => React.ReactNode;

export function NotificationsSection({ Row, idleHours }: { Row: RowT; idleHours: number }) {
  const [state, setState] = useState<"loading" | "unsupported" | "needs-install" | "denied" | "off" | "on">("loading");
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!pushSupported()) { setState(/iPhone|iPad/.test(navigator.userAgent) && !isStandalone() ? "needs-install" : "unsupported"); return; }
      if (Notification.permission === "denied") { setState("denied"); return; }
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) { setEndpoint(sub.endpoint); localStorage.setItem(PUSH_FLAG, "1"); setState("on"); }
      else { localStorage.removeItem(PUSH_FLAG); setState("off"); }
    })().catch(() => setState("unsupported"));
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission(); // must be in the tap handler (iOS)
      if (perm !== "granted") { setState(perm === "denied" ? "denied" : "off"); return; }
      const st = await pushStatusAction();
      if (!st.configured || !st.publicKey) { toast.error("Push isn't configured on the server yet."); return; }
      const reg = (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register("/sw.js"));
      await navigator.serviceWorker.ready;
      const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8(st.publicKey) }));
      const j = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      await subscribePushAction(j, navigator.userAgent);
      localStorage.setItem(PUSH_FLAG, "1"); window.dispatchEvent(new Event("lr-draft"));
      setEndpoint(sub.endpoint); setState("on"); toast.success("Idle-workout notifications on");
    } catch (e) { toast.error((e as Error).message || "Couldn't enable notifications"); }
    finally { setBusy(false); }
  }
  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration(); const sub = await reg?.pushManager.getSubscription();
      if (sub) { await unsubscribePushAction(sub.endpoint).catch(() => {}); await sub.unsubscribe(); }
      localStorage.removeItem(PUSH_FLAG); setEndpoint(null); setState("off");
    } finally { setBusy(false); }
  }
  async function test() {
    setBusy(true);
    try { const r = await testPushAction(endpoint ?? undefined); r.sent ? toast.success("Test sent — check your notifications") : toast.error(r.errors[0] ?? "No device received it — try Enable again"); }
    catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }

  const desc = {
    loading: "Checking…",
    unsupported: "This browser doesn't support Web Push.",
    "needs-install": "On iPhone, add Fortis to your Home Screen (Share → Add to Home Screen, iOS 16.4+) and open it from there to enable.",
    denied: "Blocked. Allow notifications for Fortis in system Settings, then come back.",
    off: "Get one notification when a workout has had no activity for a while.",
    on: "On for this device. One notification per idle workout — nothing else.",
  }[state];

  return (
    <section id="notifications"><p className="mono-label mb-2">Notifications</p>
      <div className="rounded-xl border bg-card">
        <Row title="Idle workout reminder" desc={desc}>
          {state === "on" ? <Button variant="outline" size="sm" disabled={busy} onClick={disable}><BellOff className="size-4" />Turn off</Button>
            : <Button size="sm" disabled={busy || state !== "off"} onClick={enable}><Bell className="size-4" />Enable</Button>}
        </Row>
        <Row title="Threshold" desc={idleHours > 0 ? `Notify after ${idleHours}h with no activity — change it under “Idle workout prompt” above.` : "Idle prompt is Off above, so no reminder will be sent."}>
          <span className="font-mono text-sm tabular-nums">{idleHours > 0 ? `${idleHours}h` : "Off"}</span>
        </Row>
        <Row title="Send a test" desc="Checks this device end to end.">
          <Button variant="outline" size="sm" disabled={busy || state !== "on"} onClick={test}><Send className="size-4" />Test</Button>
        </Row>
      </div>
    </section>
  );
}
