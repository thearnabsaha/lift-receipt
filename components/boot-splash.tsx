// Server-rendered boot splash: painted from the first HTML byte (inline CSS), shown only on
// standalone (home-screen) launches and the first load of a session. Hidden by BootSplashDismiss
// after hydration (min 600ms); a CSS fallback fades it anyway after 4s so it can never block the app.
const CSS = `
#lr-boot{position:fixed;inset:0;z-index:2147483647;display:none;flex-direction:column;align-items:center;justify-content:center;
padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
background:#fbfaf8;color:#0a0a0a;font-family:var(--font-geist-mono),ui-monospace,monospace;transition:opacity .35s ease;
animation:lr-boot-failsafe .35s ease 4s forwards}
#lr-boot.lr-dark{background:#070707;color:#fafafa}
#lr-boot.lr-show{display:flex}
#lr-boot.lr-hide{opacity:0;pointer-events:none}
#lr-boot .lr-icon{width:84px;height:84px;border-radius:20px;background:currentColor;display:flex;align-items:center;justify-content:center;overflow:hidden}
#lr-boot .lr-icon svg{width:84px;height:84px;animation:lr-pop .7s cubic-bezier(.2,.7,.2,1) both}
#lr-boot .lr-icon svg g{fill:#fbfaf8}
#lr-boot.lr-dark .lr-icon svg g{fill:#070707}
#lr-boot .lr-word{margin-top:22px;font-size:13px;font-weight:600;letter-spacing:.32em}
#lr-boot .lr-sub{margin-top:8px;font-size:9px;letter-spacing:.25em;opacity:.5}
@keyframes lr-pop{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes lr-boot-failsafe{to{opacity:0;visibility:hidden}}
@media (prefers-reduced-motion:reduce){#lr-boot .lr-icon svg{animation:none}#lr-boot{transition:none}}`;
const SCRIPT = `(function(){try{var d=document,b=d.getElementById("lr-boot");if(!b)return;
var sa=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone;
var first=!sessionStorage.getItem("lr-booted");sessionStorage.setItem("lr-booted","1");
if(!sa&&!first)return;var t=localStorage.getItem("theme")||"system";
var dark=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);
if(dark)b.className="lr-dark";b.className+=" lr-show";window.__lrBootAt=Date.now();}catch(e){}})();`;

export function BootSplash() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div id="lr-boot" aria-hidden suppressHydrationWarning>
        <div className="lr-icon">
          <svg viewBox="0 0 64 64"><g transform="rotate(-40 32 32)"><rect x="10" y="30" width="44" height="4" rx="2" /><rect x="16" y="18" width="8" height="28" rx="3" /><rect x="40" y="18" width="8" height="28" rx="3" /><rect x="10" y="24" width="4" height="16" rx="1.5" /><rect x="50" y="24" width="4" height="16" rx="1.5" /></g></svg>
        </div>
        <div className="lr-word">LIFT RECEIPT</div>
        <div className="lr-sub">WORKOUT LOG · PRINTED</div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </>
  );
}
