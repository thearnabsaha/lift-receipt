// Fortis service worker: offline app shell + static asset cache.
const VERSION = "lr-v23";
// Exercise demo drawings: own cache, survives app updates, capped (oldest evicted). Never precached.
const DEMOS = "lr-demos-v1"; const DEMOS_MAX = 80;
const SHELL = ["/offline", "/workout", "/workout/active", "/dashboard", "/history", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/apple-touch-icon.png", "/icon.svg", "/sounds/click.wav", "/sounds/chime.wav"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => Promise.allSettled(SHELL.map((u) => c.add(new Request(u, { credentials: "include" }))))).then(() => { if (!self.registration.active) return self.skipWaiting(); }));
});
// updates wait until the page asks (via the "New version available" prompt)
self.addEventListener("message", (e) => { if (e.data === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k !== DEMOS).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  // exercise demos: cache-first in a bounded cache; index.json is stale-while-revalidate
  if (url.pathname.startsWith("/demos/")) {
    if (url.pathname === "/demos/index.json") {
      e.respondWith(caches.open(DEMOS).then(async (c) => { const hit = await c.match(req); const net = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit || Response.error()); return hit || net; }));
      return;
    }
    e.respondWith(caches.open(DEMOS).then(async (c) => { const hit = await c.match(req); if (hit) return hit; const res = await fetch(req); if (res.ok) { await c.put(req, res.clone()); const ks = (await c.keys()).filter((k) => !k.url.endsWith("/index.json")); for (const k of ks.slice(0, Math.max(0, ks.length - DEMOS_MAX))) await c.delete(k); } return res; }));
    return;
  }
  // immutable build assets: cache-first
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || /\.(png|svg|woff2?|ico|wav)$/.test(url.pathname)) {
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

// Web Push: only ever the idle-workout reminder (and the Settings test).
self.addEventListener("push", (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Fortis", {
    body: d.body || "", tag: d.tag || "fortis", renotify: false, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", data: { url: d.url || "/workout" },
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const target = new URL((e.notification.data && e.notification.data.url) || "/workout", self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) if (new URL(c.url).origin === self.location.origin && "focus" in c) return c.focus().then((w) => (w && "navigate" in w ? w.navigate(target) : w));
    return self.clients.openWindow(target);
  }));
});
