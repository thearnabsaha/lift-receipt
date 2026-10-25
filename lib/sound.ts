"use client";
import { readPref, readVolume } from "@/lib/prefs";
// iPhone audio strategy:
// 1) iOS 17+/Safari: navigator.audioSession.type = "playback" lets Web Audio ignore the ring/silent switch.
// 2) Older iOS (no audioSession): play pre-rendered WAVs through HTMLAudioElement, which isn't muted by the switch.
// 3) The AudioContext is resumed on every gesture (capture phase) and right before each sound.
type AS = { audioSession?: { type: string } };
let ctx: AudioContext | null = null;
let els: Record<"click" | "chime", HTMLAudioElement> | null = null;
const hasSession = () => typeof navigator !== "undefined" && !!(navigator as unknown as AS).audioSession;
export function setPlaybackSession() {
  try { const s = (navigator as unknown as AS).audioSession; if (s && s.type !== "playback") s.type = "playback"; } catch {}
}
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch { return null; }
  }
  if (ctx.state !== "running") ctx.resume().catch(() => {});
  return ctx;
}
function audioEls() {
  if (!els && typeof Audio !== "undefined") {
    els = { click: new Audio("/sounds/click.wav"), chime: new Audio("/sounds/chime.wav") };
    for (const e of Object.values(els)) { e.preload = "auto"; e.setAttribute("playsinline", ""); }
  }
  return els;
}
/** Call inside a user gesture: sets the session, resumes the context, plays a silent buffer, primes the <audio> fallback. */
export function unlockAudio() {
  setPlaybackSession();
  const c = ac();
  if (c) try { const b = c.createBuffer(1, 1, 22050); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch {}
  if (elementMode() && !primed) { const e = audioEls(); if (e) { primed = true; for (const a of Object.values(e)) { a.muted = true; a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => { a.muted = false; primed = false; }); } } }
}
let primed = false;
export const audioUnlocked = () => ctx?.state === "running" && (!elementMode() || primed);
function tone(freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + start; const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * readVolume()), t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
}
function viaElement(name: "click" | "chime") {
  const e = audioEls()?.[name]; if (!e) return false;
  try { e.volume = readVolume(); e.currentTime = 0; void e.play().catch(() => {}); return true; } catch { return false; }
}
const isIOS = () => typeof navigator !== "undefined" && (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
/** Older iOS has no audioSession and mutes Web Audio on silent: use <audio> there. */
const elementMode = () => isIOS() && !hasSession();
const buzz = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch {} };
function click() { setPlaybackSession(); if (elementMode() && viaElement("click")) return; tone(1320, 0, 0.07, "triangle", 0.35); tone(1760, 0.045, 0.09, "sine", 0.25); }
function chime() { setPlaybackSession(); if (elementMode() && viaElement("chime")) return; [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.5, "sine", 0.3)); tone(2093, 0.44, 0.6, "triangle", 0.08); }
/** Short "tick" when a set is checked off. Missing setting = on. */
export function playSetDone() { if (!readPref("soundSet")) return; click(); buzz(15); }
/** Rising receipt-printer chime when a workout is finished. */
export function playFinish() { if (!readPref("soundFinish")) return; chime(); buzz([20, 60, 20, 60, 40]); }
/** Settings "Test sound": ignores the on/off switches. */
export function testSound() { unlockAudio(); click(); setTimeout(chime, 350); }
