// Renders the synth sounds to small 22kHz mono WAVs in /public/sounds (HTMLAudioElement fallback for iOS).
import { writeFileSync, mkdirSync } from "fs";
const SR = 22050;
function render(tones, len) {
  const n = Math.round(len * SR), buf = new Float32Array(n);
  for (const [f, st, dur, type, g] of tones) for (let i = Math.round(st * SR); i < Math.min(n, Math.round((st + dur) * SR)); i++) {
    const t = i / SR - st, ph = 2 * Math.PI * f * t;
    const w = type === "triangle" ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : Math.sin(ph);
    const env = Math.min(1, t / 0.008) * Math.exp((-t / dur) * 6);
    buf[i] += w * g * env;
  }
  const out = Buffer.alloc(44 + n * 2);
  out.write("RIFF", 0); out.writeUInt32LE(36 + n * 2, 4); out.write("WAVEfmt ", 8); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22);
  out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write("data", 36); out.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) out.writeInt16LE(Math.max(-1, Math.min(1, buf[i])) * 32767 | 0, 44 + i * 2);
  return out;
}
mkdirSync("public/sounds", { recursive: true });
writeFileSync("public/sounds/click.wav", render([[1320, 0, 0.07, "triangle", 0.45], [1760, 0.045, 0.09, "sine", 0.35]], 0.16));
writeFileSync("public/sounds/chime.wav", render([...[523.25, 659.25, 783.99, 1046.5].map((f, i) => [f, i * 0.11, 0.5, "sine", 0.28]), [2093, 0.44, 0.6, "triangle", 0.08]], 1.1));
