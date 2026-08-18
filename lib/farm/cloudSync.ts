/**
 * Debounced cloud sync for farmer profile + farm data.
 * Local storage remains source of truth on device; cloud mirrors when logged in.
 */
import { readStorage, writeStorage } from "@/lib/storage";
import type { FarmerProfile } from "@/hooks/useFarmerProfile";
import type { FarmData } from "@/lib/farm/types";
import { sanitizeLegacyFarmData } from "@/lib/farm/legacyMock";

const PROFILE_KEY = "agriveda-farmer-profile";
const FARM_KEY = "agriveda-farm-data";
const META_KEY = "agriveda-farm-sync-meta";

type SyncMeta = {
  lastPushAt?: string;
  lastPullAt?: string;
  cloudProfileAt?: string | null;
  cloudFarmAt?: string | null;
};

let timer: ReturnType<typeof setTimeout> | null = null;
let hydratedFromCloud = false;

function readMeta(): SyncMeta {
  return readStorage<SyncMeta>(META_KEY, {});
}

function writeMeta(next: SyncMeta) {
  writeStorage(META_KEY, next);
}

export function queueFarmCloudSync(delayMs = 1200) {
  if (typeof window === "undefined") return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    void pushFarmCloudSync();
  }, delayMs);
}

export async function pushFarmCloudSync(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const profile = readStorage<FarmerProfile | null>(PROFILE_KEY, null);
    const farmRaw = readStorage<Partial<FarmData> | null>(FARM_KEY, null);
    const farm = farmRaw ? sanitizeLegacyFarmData(farmRaw) : null;

    let lastLat: number | undefined;
    let lastLon: number | undefined;
    try {
      const loc = readStorage<{ lat?: number; lon?: number } | null>("agriveda-last-location", null);
      if (typeof loc?.lat === "number" && typeof loc?.lon === "number") {
        lastLat = loc.lat;
        lastLon = loc.lon;
      }
    } catch {
      /* ignore */
    }

    const res = await fetch("/api/farm-sync", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile,
        farm,
        lastLat: lastLat ?? null,
        lastLon: lastLon ?? null,
        clientUpdatedAt: new Date().toISOString(),
      }),
    });
    if (res.status === 401) return false;
    if (!res.ok) return false;
    writeMeta({ ...readMeta(), lastPushAt: new Date().toISOString() });
    return true;
  } catch {
    return false;
  }
}

function isoNewer(a?: string | null, b?: string | null): boolean {
  if (!a) return false;
  if (!b) return true;
  return Date.parse(a) > Date.parse(b);
}

/** Pull cloud → merge into local (cloud wins if newer). Call once after login/hydrate. */
export async function pullFarmCloudSync(): Promise<boolean> {
  if (typeof window === "undefined" || hydratedFromCloud) return false;
  try {
    const res = await fetch("/api/farm-sync", { credentials: "include", cache: "no-store" });
    if (res.status === 401) return false;
    if (!res.ok) return false;
    const json = (await res.json()) as {
      configured?: boolean;
      profile?: FarmerProfile | null;
      farm?: FarmData | null;
      profileUpdatedAt?: string | null;
      farmUpdatedAt?: string | null;
    };
    if (!json.configured) return false;

    const meta = readMeta();
    let changed = false;

    if (json.profile && isoNewer(json.profileUpdatedAt, meta.cloudProfileAt) && isoNewer(json.profileUpdatedAt, meta.lastPushAt)) {
      const local = readStorage<FarmerProfile | null>(PROFILE_KEY, null);
      // Prefer cloud if local empty/incomplete, or cloud newer than last push
      if (!local?.onboardingComplete || isoNewer(json.profileUpdatedAt, meta.lastPushAt)) {
        writeStorage(PROFILE_KEY, { ...local, ...json.profile });
        changed = true;
      }
      meta.cloudProfileAt = json.profileUpdatedAt;
    }

    if (json.farm && isoNewer(json.farmUpdatedAt, meta.cloudFarmAt) && isoNewer(json.farmUpdatedAt, meta.lastPushAt)) {
      const local = readStorage<Partial<FarmData> | null>(FARM_KEY, null);
      const localEmpty = !local?.fields?.length;
      if (localEmpty || isoNewer(json.farmUpdatedAt, meta.lastPushAt)) {
        writeStorage(FARM_KEY, sanitizeLegacyFarmData(json.farm));
        changed = true;
      }
      meta.cloudFarmAt = json.farmUpdatedAt;
    }

    meta.lastPullAt = new Date().toISOString();
    writeMeta(meta);
    hydratedFromCloud = true;

    if (changed) {
      window.dispatchEvent(new Event("agriveda-farm-cloud-hydrated"));
    }
    return true;
  } catch {
    return false;
  }
}
