// Lift Receipt service worker: offline app shell + static asset cache.
const VERSION = "lr-v1";
const SHELL = ["/offline", "/workout", "/workout/active", "/icons/icon-192.png", "/icon.svg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => Promise.allSettled(SHELL.map((u) => c.add(new Request(u, { credentials: "include" }))))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  // immutable build assets: cache-first
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || /\.(png|svg|woff2?|ico)$/.test(url.pathname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const c = res.clone(); caches.open(VERSION).then((x) => x.put(req, c)); } return res; })));
    return;
  }
  // pages & RSC: network-first, fallback to cache, then offline page
  if (req.mode === "navigate" || req.headers.get("RSC")) {
    e.respondWith(fetch(req).then((res) => {
      if (res.ok && req.mode === "navigate") { const c = res.clone(); caches.open(VERSION).then((x) => x.put(url.pathname, c)); }
      return res;
    }).catch(async () => (await caches.match(url.pathname)) || (await caches.match(req)) || (req.mode === "navigate" ? caches.match("/offline") : Response.error())));
  }
});
