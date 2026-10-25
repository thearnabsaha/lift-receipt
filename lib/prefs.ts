"use client";
import { useSyncExternalStore } from "react";
// Per-device preferences in localStorage (no DB migration needed).
const EVT = "lr-pref-change";
const sub = (cb: () => void) => { window.addEventListener(EVT, cb); window.addEventListener("storage", cb); return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); }; };
export const PREFS = {
  showRpe: { key: "lr-show-rpe", def: false }, // off unless the user explicitly turned it on ("1")
  soundSet: { key: "lr-sound-set", def: true },
  soundFinish: { key: "lr-sound-finish", def: true },
  soundSilent: { key: "lr-sound-silent", def: false }, // stronger iOS session only while a sound plays; may pause music
} as const;
export type PrefName = keyof typeof PREFS;
export function readPref(n: PrefName): boolean {
  if (typeof window === "undefined") return PREFS[n].def;
  const v = localStorage.getItem(PREFS[n].key);
  return v === null ? PREFS[n].def : v === "1";
}
export function usePref(n: PrefName) { return useSyncExternalStore(sub, () => readPref(n), () => PREFS[n].def); }
export function setPref(n: PrefName, on: boolean) { localStorage.setItem(PREFS[n].key, on ? "1" : "0"); window.dispatchEvent(new Event(EVT)); }
const VOL = "lr-sound-volume";
export function readVolume() { if (typeof window === "undefined") return 0.7; const v = Number(localStorage.getItem(VOL)); return localStorage.getItem(VOL) === null || isNaN(v) ? 0.7 : Math.min(1, Math.max(0, v)); }
export function useVolume() { return useSyncExternalStore(sub, readVolume, () => 0.7); }
export function setVolume(v: number) { localStorage.setItem(VOL, String(v)); window.dispatchEvent(new Event(EVT)); }
import { IDLE_DEFAULT_H, IDLE_PREF_KEY, parseIdleHours } from "@/lib/idle";
export function readIdleHours() { return typeof window === "undefined" ? IDLE_DEFAULT_H : parseIdleHours(localStorage.getItem(IDLE_PREF_KEY)); }
export function useIdleHours() { return useSyncExternalStore(sub, readIdleHours, () => IDLE_DEFAULT_H); }
export function setIdleHours(h: number) { localStorage.setItem(IDLE_PREF_KEY, String(h)); window.dispatchEvent(new Event(EVT)); }
