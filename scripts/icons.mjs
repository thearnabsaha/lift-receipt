import sharp from "sharp";
import { writeFileSync } from "node:fs";
const mark = (fg, bg) => `<path d="M18 12h28v38l-3.5-3-3.5 3-3.5-3-3.5 3-3.5-3-3.5 3-3.5-3-3.5 3z" fill="${fg}"/>
<rect x="22" y="22" width="20" height="3" rx="1.5" fill="${bg}"/><rect x="21" y="18" width="3" height="11" rx="1" fill="${bg}"/><rect x="40" y="18" width="3" height="11" rx="1" fill="${bg}"/>
<rect x="22" y="34" width="20" height="2" rx="1" fill="${bg}" opacity=".35"/><rect x="22" y="39" width="13" height="2" rx="1" fill="${bg}" opacity=".35"/>`;
const any = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0a0a0a"/>${mark("#fafafa", "#0a0a0a")}</svg>`;
// maskable: full-bleed bg, mark scaled into 80% safe zone
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0a0a0a"/><g transform="translate(9.6 9.6) scale(.7)">${mark("#fafafa", "#0a0a0a")}</g></svg>`;
const full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0a0a0a"/><g transform="translate(4 4) scale(.875)">${mark("#fafafa", "#0a0a0a")}</g></svg>`;
writeFileSync("public/icon.svg", any);
const out = [["icon-192.png", any, 192], ["icon-512.png", any, 512], ["maskable-192.png", maskable, 192], ["maskable-512.png", maskable, 512], ["apple-touch-icon.png", full, 180], ["shortcut-96.png", any, 96]];
for (const [f, s, n] of out) await sharp(Buffer.from(s)).resize(n, n).png().toFile("public/icons/" + f);
await sharp(Buffer.from(any)).resize(32, 32).png().toFile("app/icon.png");
console.log("ok");
