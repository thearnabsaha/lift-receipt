"use client";
import { useEffect, useRef } from "react";
import { syncIdleAction } from "@/app/actions";
import { PUSH_FLAG } from "@/lib/push-client";
import { readIdleHours } from "@/lib/prefs";
import { ACTIVE_KEY } from "@/components/idle-prompt";

/** Mirrors the local active workout's timing to the server so the idle push can fire while the app is closed. */
export function IdleSync() {
  const last = useRef<string>("");
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    const run = () => {
      if (localStorage.getItem(PUSH_FLAG) !== "1") return;
      let d: { startedAt?: string; lastActivityAt?: string } | null = null;
      try { d = JSON.parse(localStorage.getItem(ACTIVE_KEY) || "null"); } catch {}
      const hours = readIdleHours();
      const active = !!d?.startedAt;
      // bucket activity to 2 min so logging sets doesn't spam the server
      const la = active ? Math.floor(+new Date(d!.lastActivityAt ?? d!.startedAt!) / 120_000) : 0;
      const key = active ? `${d!.startedAt}|${la}|${hours}` : `off|${hours}`;
      if (key === last.current) return;
      const first = last.current === "";
      last.current = key;
      if (first && !active) { syncIdleAction({ active: false, hours }).catch(() => {}); return; }
      syncIdleAction({ active, startedAt: d?.startedAt ?? null, lastActivityAt: d?.lastActivityAt ?? d?.startedAt ?? null, hours }).catch(() => { last.current = ""; });
    };
    const kick = () => { if (t) clearTimeout(t); t = setTimeout(run, 800); };
    run();
    const iv = setInterval(run, 20_000);
    const vis = () => { if (document.visibilityState === "hidden") run(); else kick(); };
    window.addEventListener("lr-draft", kick); window.addEventListener("storage", kick); window.addEventListener("lr-pref-change", kick);
    document.addEventListener("visibilitychange", vis);
    return () => { clearInterval(iv); if (t) clearTimeout(t); window.removeEventListener("lr-draft", kick); window.removeEventListener("storage", kick); window.removeEventListener("lr-pref-change", kick); document.removeEventListener("visibilitychange", vis); };
  }, []);
  return null;
}
