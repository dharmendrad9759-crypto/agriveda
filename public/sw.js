/* This worker only removes itself.
   A previous worker intercepted page loads and left the nav up with an empty screen.
   Phones that already installed that worker pick up this file and drop it. */
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        await Promise.all(
          clients.map(async (client) => {
            try {
              if (typeof client.navigate !== "function") return;
              const url = new URL(client.url);
              if (url.searchParams.get("av") === "off") return;
              url.searchParams.set("av", "off");
              await client.navigate(url.href);
            } catch {
              /* the worker no longer answers requests, so the next open is a normal load */
            }
          })
        );
      } catch {
        /* still try to unregister so the blank interceptor cannot stay */
        try {
          await self.registration.unregister();
        } catch {
          /* ignore */
        }
      }
    })()
  );
});
