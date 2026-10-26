"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { syncTimezoneAction } from "@/app/actions";

/** Keeps the server in the device's current IANA zone: `tz` cookie on every load/focus, and the settings row when it changes. */
export function TzSync({ stored }: { stored: string | null }) {
  const router = useRouter();
  useEffect(() => {
    const sync = () => {
      let tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return; }
      if (!tz) return;
      const prev = document.cookie.match(/(?:^|; )tz=([^;]*)/)?.[1];
      document.cookie = `tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
      if (tz !== stored) syncTimezoneAction(tz).catch(() => {});
      if (prev !== undefined && decodeURIComponent(prev) !== tz) router.refresh();
      else if (prev === undefined && tz !== stored) router.refresh();
    };
    sync();
    const onVis = () => { if (document.visibilityState === "visible") sync(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [stored, router]);
  return null;
}
