"use client";
import { useEffect } from "react";
/** Fades the server-rendered boot splash once React has hydrated (min 600ms on screen). */
export function BootSplashDismiss() {
  useEffect(() => {
    const el = document.getElementById("lr-boot");
    if (!el || !el.classList.contains("lr-show")) return;
    const at = (window as unknown as { __lrBootAt?: number }).__lrBootAt ?? Date.now();
    const t = setTimeout(() => { el.classList.add("lr-hide"); setTimeout(() => el.classList.remove("lr-show"), 400); }, Math.max(0, 600 - (Date.now() - at)));
    return () => clearTimeout(t);
  }, []);
  return null;
}
