/* Agriveda offline pack — crop assets, emergency data, stale page shell */
const CACHE = "agriveda-offline-v1";
const PRECACHE = [
  "/offline/emergency.json",
  "/manifest.webmanifest",
  "/images/crops/_placeholder.svg",
  "/icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isApi(url) {
  return url.pathname.startsWith("/api/");
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/offline/")
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isApi(url)) {
    event.respondWith(fetch(req).catch(() => new Response(JSON.stringify({ offline: true }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })));
    return;
  }

  if (isStaticAsset(url) || url.pathname.startsWith("/offline/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        });
        return cached || network;
      })
    );
    return;
  }

  // Navigation / pages: network-first, fallback cache
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("/offline/emergency.json"))
        )
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CACHE_MANDI") {
    const body = JSON.stringify(event.data.payload ?? {});
    caches.open(CACHE).then((c) =>
      c.put("/offline/mandi-cache.json", new Response(body, { headers: { "Content-Type": "application/json" } }))
    );
  }
});
