/* Agriveda offline pack — crop assets, emergency data, stale page shell */
const CACHE = "agriveda-offline-v2";
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
    )
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

function networkWithTimeout(req, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(req.clone(), { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

function remember(cache, req, res) {
  if (res && res.ok) cache.put(req, res.clone());
}

function slowPage() {
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agriveda</title><body style="margin:0;font-family:system-ui,sans-serif;background:#f2faf5;color:#0B3D28;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;text-align:center"><div><p style="font-size:28px;margin:0">🌱</p><h1 style="font-size:22px;margin:12px 0 8px">नेट धीमा है</h1><p style="font-size:16px;line-height:1.4">एक बार ऐप खुल जाए तो अगली बार फोन पर से खुल जाएगी। थोड़ी देर बाद फिर खोलें।</p><button onclick="location.reload()" style="margin-top:16px;min-height:48px;padding:0 20px;border:0;border-radius:999px;background:#006432;color:#fff;font-weight:700;font-size:16px">फिर खोलें</button></div></body>`;
  return new Response(html, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isApi(url)) {
    event.respondWith(
      networkWithTimeout(req, 12000).catch(
        () =>
          new Response(JSON.stringify({ offline: true }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          })
      )
    );
    return;
  }

  const isPage =
    req.mode === "navigate" ||
    req.headers.get("RSC") === "1" ||
    url.searchParams.has("_rsc") ||
    (req.headers.get("accept") || "").includes("text/html");

  if (isStaticAsset(url) || isPage) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) {
          event.waitUntil(
            networkWithTimeout(req, 8000)
              .then((res) => remember(cache, req, res))
              .catch(() => {})
          );
          return cached;
        }
        try {
          const res = await networkWithTimeout(req, isPage ? 12000 : 20000);
          remember(cache, req, res);
          return res;
        } catch {
          if (isPage && req.mode === "navigate") return slowPage();
          return new Response("", { status: 504 });
        }
      })
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
