import type {
  OutbreakCluster,
  OutbreakListSummary,
  PublicOutbreakReport,
  SubmitOutbreakInput,
} from "@/types/outbreak";
import { readStorage, writeStorage } from "@/lib/storage";
import { buildOutbreakRadarPayload } from "@/lib/outbreakPublic";
import { isSupabaseConfigured } from "@/lib/supabase";
import { queueOutbreakReport, trySyncPendingOutbreaks } from "@/lib/outbreakSync";

const CACHE_KEY = "agriveda-outbreak-cache";
const CACHE_TTL_MS = 30 * 60 * 1000;

interface OutbreakCache {
  fetchedAt: string;
  lat: number;
  lon: number;
  reports: PublicOutbreakReport[];
  clusters: OutbreakCluster[];
  summaries: OutbreakListSummary[];
}

export function getOutbreakCache(lat: number, lon: number): OutbreakCache | null {
  const cached = readStorage<OutbreakCache | null>(CACHE_KEY, null);
  if (!cached) return null;
  const age = Date.now() - new Date(cached.fetchedAt).getTime();
  if (age > CACHE_TTL_MS) return null;
  const moved =
    Math.abs(cached.lat - lat) > 0.05 || Math.abs(cached.lon - lon) > 0.05;
  if (moved) return null;
  return cached;
}

export function setOutbreakCache(data: Omit<OutbreakCache, "fetchedAt">): void {
  writeStorage(CACHE_KEY, {
    ...data,
    fetchedAt: new Date().toISOString(),
  });
}

export async function fetchNearbyOutbreaks(
  lat: number,
  lon: number,
  radiusKm = 10,
  days = 14
): Promise<{
  reports: PublicOutbreakReport[];
  clusters: OutbreakCluster[];
  summaries: OutbreakListSummary[];
  fromCache: boolean;
}> {
  if (!navigator.onLine) {
    const cached = getOutbreakCache(lat, lon);
    if (cached) {
      return {
        reports: cached.reports,
        clusters: cached.clusters,
        summaries: cached.summaries,
        fromCache: true,
      };
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      reports: [],
      clusters: [],
      summaries: [],
      fromCache: false,
    };
  }

  await trySyncPendingOutbreaks();

  const res = await fetch(
    `/api/outbreaks?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&radiusKm=${radiusKm}&days=${days}`,
    { credentials: "include" }
  );

  if (!res.ok) {
    const cached = getOutbreakCache(lat, lon);
    if (cached) {
      return {
        reports: cached.reports,
        clusters: cached.clusters,
        summaries: cached.summaries,
        fromCache: true,
      };
    }
    throw new Error("Outbreak radar load failed");
  }

  const payload = (await res.json()) as {
    reports: PublicOutbreakReport[];
    clusters: OutbreakCluster[];
    summaries: OutbreakListSummary[];
  };

  setOutbreakCache({
    lat,
    lon,
    reports: payload.reports,
    clusters: payload.clusters,
    summaries: payload.summaries,
  });

  return { ...payload, fromCache: false };
}

export async function submitOutbreakReport(
  input: SubmitOutbreakInput
): Promise<{ report: PublicOutbreakReport; clusters: OutbreakCluster[] }> {
  if (!isSupabaseConfigured()) {
    queueOutbreakReport(input);
    throw new Error("Offline — report queued for sync when Supabase is available.");
  }

  if (!navigator.onLine) {
    queueOutbreakReport(input);
    throw new Error("Offline — report saved and will sync when online.");
  }

  const res = await fetch("/api/outbreaks", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cropId: input.cropId,
      threatType: input.threatType,
      pestOrDiseaseId: input.pestOrDiseaseId,
      photoUrl: input.photoUrl,
      latitude: input.latitude,
      longitude: input.longitude,
      severity: input.severity,
    }),
  });

  if (res.status === 401) {
    queueOutbreakReport(input);
    throw new Error("Login required — पहले OTP verify करें");
  }

  if (!res.ok) {
    queueOutbreakReport(input);
    throw new Error("Could not submit report — queued for retry.");
  }

  return (await res.json()) as {
    report: PublicOutbreakReport;
    clusters: OutbreakCluster[];
  };
}

export async function imageUrlToDataUrl(url: string, maxSize = 400): Promise<string | undefined> {
  if (url.startsWith("data:")) return url;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  } catch {
    return undefined;
  }
}
