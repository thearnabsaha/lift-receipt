"use client";
import { useSyncExternalStore } from "react";
const KEY = "lr-show-rpe";
const EVT = "lr-show-rpe-change";
const sub = (cb: () => void) => { window.addEventListener(EVT, cb); window.addEventListener("storage", cb); return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); }; };
/** "Show RPE column" preference, stored per device (default on). */
export function useShowRpe() {
  return useSyncExternalStore(sub, () => localStorage.getItem(KEY) !== "0", () => true);
}
export function setShowRpe(on: boolean) { localStorage.setItem(KEY, on ? "1" : "0"); window.dispatchEvent(new Event(EVT)); }
