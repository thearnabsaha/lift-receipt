// Generates opaque apple-touch-icon + iOS splash screens (apple-touch-startup-image). Run: node scripts/gen-ios-assets.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const svg = readFileSync("public/icon.svg", "utf8");
export const SIZES = [[428, 926, 3], [430, 932, 3], [393, 852, 3], [390, 844, 3], [375, 812, 3], [414, 896, 2], [375, 667, 2]];
const THEMES = { light: { bg: "#fbfaf8", fg: "#0a0a0a", mute: "#8a8a85" }, dark: { bg: "#070707", fg: "#fafafa", mute: "#737373" } };
const b = await chromium.launch();
const p = await b.newPage();
// opaque 180x180 icon: full-bleed square, no transparency (iOS applies its own mask)
await p.setViewportSize({ width: 180, height: 180 });
await p.setContent(`<body style="margin:0;background:#0a0a0a">${svg.replace('rx="14"', 'rx="0"').replace("<svg ", '<svg width="180" height="180" ')}</body>`);
await p.screenshot({ path: "public/icons/apple-touch-icon.png", omitBackground: false });
for (const [w, h, d] of SIZES) for (const [name, t] of Object.entries(THEMES)) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: d });
  const pg = await ctx.newPage();
  await pg.setContent(`<body style="margin:0;height:100vh;background:${t.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Geist Mono',monospace">
    <div style="width:96px;height:96px">${svg.replace("<svg ", '<svg width="96" height="96" ')}</div>
    <div style="margin-top:20px;color:${t.fg};font-size:20px;font-weight:600;letter-spacing:.02em">Lift Receipt</div>
    <div style="margin-top:6px;color:${t.mute};font-size:10px;letter-spacing:.2em;text-transform:uppercase">Workout log · printed</div></body>`);
  await pg.screenshot({ path: `public/splash/${w}x${h}@${d}-${name}.png` });
  await ctx.close();
}
await b.close();
