import { readStorage } from "@/lib/storage";

const MANDI_HISTORY_KEY = "agriveda-mandi-history";

export async function syncMandiHistoryToServiceWorker(reg?: ServiceWorkerRegistration): Promise<void> {
  if (typeof window === "undefined") return;
  const history = readStorage(MANDI_HISTORY_KEY, null as unknown);
  const registration = reg ?? (await navigator.serviceWorker?.ready?.catch(() => null));
  registration?.active?.postMessage({ type: "CACHE_MANDI", payload: history });
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
