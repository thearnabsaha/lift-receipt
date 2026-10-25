"use client";
import { readPref, readVolume } from "@/lib/prefs";
// iPhone audio rules (pt17u: opening the app must never pause YouTube Music / Spotify):
// - Nothing audio-related runs on load, on gestures or on visibility change. No unlock, no keep-alive.
// - The AudioContext is created/resumed only when a sound is about to play, and suspended again after.
// - Default: navigator.audioSession.type = "ambient" (spec: "mixable with other types of audio";
//   iOS maps it to the Ambient category, which mixes with other apps but obeys the silent switch).
// - Opt-in "Sounds play even in silent mode": "playback" only for the sound's duration, then back to
//   "ambient". iOS may pause other audio for that moment. <audio> (playback category) is only used then.
type AS = { audioSession?: { type: string } };
let ctx: AudioContext | null = null;
let idle: ReturnType<typeof setTimeout> | null = null;
const session = () => (typeof navigator === "undefined" ? undefined : (navigator as unknown as AS).audioSession);
function setSession(t: "ambient" | "playback") { try { const s = session(); if (s && s.type !== t) s.type = t; } catch {} }
const isIOS = () => typeof navigator !== "undefined" && (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

/** Prepare to play: pick the session type, then create/resume the context. Called only right before a sound. */
function begin(durMs: number) {
  if (typeof window === "undefined") return null;
  const loud = readPref("soundSilent");
  setSession(loud ? "playback" : "ambient");
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch { return null; }
  }
  if (ctx.state !== "running") ctx.resume().catch(() => {});
  // release the audio session once the sound is over so other apps keep/resume their audio
  if (idle) clearTimeout(idle);
  idle = setTimeout(() => { idle = null; ctx?.suspend().catch(() => {}); setSession("ambient"); }, durMs + 300);
  return ctx;
}
function tone(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
  const t = c.currentTime + start; const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain * readVolume()), t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
}
/** Older iOS (no audioSession API) mutes Web Audio on silent; <audio> plays through it but takes the
 *  playback category (pauses music), so it's used only when the user opted in to silent-mode sounds. */
function viaElement(name: "click" | "chime") {
  if (!(readPref("soundSilent") && isIOS() && !session())) return false;
  try { const a = new Audio(`/sounds/${name}.wav`); a.volume = readVolume(); a.setAttribute("playsinline", ""); void a.play().catch(() => {}); return true; } catch { return false; }
}
const buzz = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch {} };
function click() { if (viaElement("click")) return; const c = begin(200); if (!c) return; tone(c, 1320, 0, 0.07, "triangle", 0.35); tone(c, 1760, 0.045, 0.09, "sine", 0.25); }
function chime() { if (viaElement("chime")) return; const c = begin(1100); if (!c) return; [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(c, f, i * 0.11, 0.5, "sine", 0.3)); tone(c, 2093, 0.44, 0.6, "triangle", 0.08); }
/** Short "tick" when a set is checked off. Missing setting = on. */
export function playSetDone() { if (!readPref("soundSet")) return; click(); buzz(15); }
/** Rising receipt-printer chime when a workout is finished. */
export function playFinish() { if (!readPref("soundFinish")) return; chime(); buzz([20, 60, 20, 60, 40]); }
/** Settings "Test sound": ignores the on/off switches. */
export function testSound() { click(); setTimeout(chime, 350); }
