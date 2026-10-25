"use client";
import { readPref, readVolume } from "@/lib/prefs";
// Synthesized sounds (Web Audio, no files). iOS needs the AudioContext created/resumed inside a user gesture:
// unlockAudio() is wired to the first pointerdown/touchend/keydown. Note: iOS mutes Web Audio when the ring/silent switch is on.
let ctx: AudioContext | null = null;
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch { return null; }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}
export function unlockAudio() {
  const c = ac(); if (!c) return;
  try { const b = c.createBuffer(1, 1, 22050); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch {}
}
function tone(freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + start; const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * readVolume()), t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
}
const buzz = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch {} };
/** Short "tick" when a set is checked off. */
export function playSetDone() {
  if (!readPref("soundSet")) return;
  tone(1320, 0, 0.07, "triangle", 0.35); tone(1760, 0.045, 0.09, "sine", 0.25); buzz(15);
}
/** Rising receipt-printer chime when a workout is finished. */
export function playFinish() {
  if (!readPref("soundFinish")) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.5, "sine", 0.3));
  tone(2093, 0.44, 0.6, "triangle", 0.08); buzz([20, 60, 20, 60, 40]);
}
/** Rest timer over (always plays; it's an alert). */
export function playRestEnd() {
  tone(880, 0, 0.22, "square", 0.12); tone(880, 0.32, 0.22, "square", 0.12); tone(1175, 0.64, 0.35, "square", 0.12); buzz([200, 100, 200]);
}
