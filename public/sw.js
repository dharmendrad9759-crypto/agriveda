/* Takes control, stops answering requests, then removes itself.
   The previous worker kept the nav and served an empty page. */
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch {
        /* cache wipe is best-effort */
      }
      try {
        const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        await Promise.all(
          clients.map(async (client) => {
            try {
              if (typeof client.navigate !== "function") return;
              const url = new URL(client.url);
              if (url.searchParams.get("sw") === "0") return;
              url.searchParams.set("sw", "0");
              await client.navigate(url.href);
            } catch {
              /* next open is a normal network load once this worker is gone */
            }
          })
        );
      } catch {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch {
        /* ignore */
      }
    })()
  );
});
