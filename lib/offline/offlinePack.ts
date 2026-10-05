import { readStorage } from "@/lib/storage";

const MANDI_HISTORY_KEY = "agriveda-mandi-history";

export async function syncMandiHistoryToServiceWorker(reg?: ServiceWorkerRegistration): Promise<void> {
  if (typeof window === "undefined") return;
  const history = readStorage(MANDI_HISTORY_KEY, null as unknown);
  const registration = reg ?? (await navigator.serviceWorker?.ready?.catch(() => null));
  registration?.active?.postMessage({ type: "CACHE_MANDI", payload: history });
}

const MY_CROPS_KEY = "agriveda-my-crops";
const WARM_AT_KEY = "agriveda-offline-warm-at";
const WARM_EVERY_MS = 24 * 60 * 60 * 1000;
const WARM_TABS = ["growth", "pests", "diseases", "fertilizer", "mistakes"] as const;

/** Saves the farmer's own crop pages for offline use — at most once a day, skipped on slow/data-saver connections. */
export async function warmMyCropPages(reg?: ServiceWorkerRegistration): Promise<void> {
  if (typeof window === "undefined" || !navigator.onLine) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return;

  const last = Number(readStorage(WARM_AT_KEY, 0 as number)) || 0;
  if (Date.now() - last < WARM_EVERY_MS) return;

  const crops = readStorage(MY_CROPS_KEY, [] as { slug?: string; custom?: boolean }[]);
  const slugs = (Array.isArray(crops) ? crops : [])
    .filter((c) => c?.slug && !c.custom)
    .map((c) => c.slug as string)
    .slice(0, 4);

  const urls = ["/", "/crop-problems"];
  for (const slug of slugs) {
    urls.push(`/crops/${slug}`);
    for (const tab of WARM_TABS) urls.push(`/crops/${slug}/care/${tab}`);
  }

  const registration = reg ?? (await navigator.serviceWorker?.ready?.catch(() => null));
  if (!registration?.active) return;
  registration.active.postMessage({ type: "WARM_PAGES", urls });
  try {
    localStorage.setItem(WARM_AT_KEY, String(Date.now()));
  } catch {
    /* storage full */
  }
}

export async function fetchEmergencyOffline(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch("/offline/emergency.json", { cache: "force-cache" });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function fetchCachedMandiOffline(): Promise<unknown> {
  try {
    const res = await fetch("/offline/mandi-cache.json", { cache: "force-cache" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
