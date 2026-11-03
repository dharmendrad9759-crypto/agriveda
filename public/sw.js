/* Agriveda offline pack. Pages are never cached — a saved shell hid the whole app. */
const CACHE = "agriveda-offline-v5";
const PRECACHE = [
  "/offline/emergency.json",
  "/manifest.webmanifest",
  "/images/crops/_placeholder.svg",
  "/icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  // Activate even if a precache file fails. A rejected install left phones
  // on the old worker, which kept serving the blank saved page.
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => undefined)))
      )
      .catch(() => undefined)
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
        await self.clients.claim();
        const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        await Promise.all(
          clients.map(async (client) => {
            try {
              if (typeof client.navigate !== "function") return;
              const url = new URL(client.url);
              url.searchParams.set("av", "5");
              await client.navigate(url.href);
            } catch {
              /* next cold start still loads from the network */
            }
          })
        );
      } catch {
        /* activation must succeed so the old blank cache is dropped */
      }
    })()
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
  const html = `<!doctype html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agriveda - कमज़ोर इंटरनेट</title><style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#061a12;color:#ecfdf5;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:20px;text-align:center}.card{max-width:360px;padding:32px 24px;background:rgba(12,36,27,0.85);border:1px solid rgba(16,185,129,0.25);border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,0.5)}.icon{font-size:36px;margin-bottom:12px}h1{font-size:20px;font-weight:900;margin:0 0 8px;color:#34d399}p{font-size:13px;line-height:1.5;color:#a7f3d0;margin:0 0 20px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;width:100%;border:0;border-radius:14px;background:#059669;color:#fff;font-weight:800;font-size:14px;cursor:pointer;transition:background 0.2s}.btn:active{transform:scale(0.98)}</style></head><body><div class="card"><div class="icon">🌱</div><h1>इंटरनेट कनेक्शन धीमा है</h1><p>कमज़ोर नेटवर्क के कारण पेज लोड होने में समय लग रहा है। आपका खेत व फसल डेटा सुरक्षित है।</p><button class="btn" onclick="location.reload()">पेज फिर से लोड करें</button></div></body></html>`;
  return new Response(html, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isApi(url)) {
    event.respondWith(
      networkWithTimeout(req, 18000).catch(
        () =>
          new Response(JSON.stringify({ offline: true }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          })
      )
    );
    return;
  }

  const isRsc = req.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
  const isDocument = req.mode === "navigate" && !isRsc;

  // Never answer a page from cache. The saved copy was a blank shell:
  // bottom nav stayed, every screen above it was empty.
  // Do not pass RequestInit with a navigate Request — that throws in the WebView.
  if (isRsc) {
    event.respondWith(fetch(req).catch(() => new Response("", { status: 504 })));
    return;
  }
  if (isDocument) {
    event.respondWith(
      fetch(url.href, {
        cache: "reload",
        credentials: "same-origin",
        headers: { Accept: "text/html" },
      }).catch(() => slowPage())
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) {
          event.waitUntil(
            networkWithTimeout(req, 12000)
              .then((res) => remember(cache, req, res))
              .catch(() => {})
          );
          return cached;
        }
        try {
          const res = await networkWithTimeout(req, 30000);
          remember(cache, req, res);
          return res;
        } catch {
          return new Response("", { status: 504 });
        }
      })
    );
  }
});

async function warmPages() {
  /* Page HTML is not stored. A cached shell is what blanked the phone. */
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "WARM_PAGES" && Array.isArray(event.data.urls)) {
    event.waitUntil(warmPages(event.data.urls));
    return;
  }
  if (event.data?.type === "CACHE_MANDI") {
    const body = JSON.stringify(event.data.payload ?? {});
    caches.open(CACHE).then((c) =>
      c.put("/offline/mandi-cache.json", new Response(body, { headers: { "Content-Type": "application/json" } }))
    );
  }
});
