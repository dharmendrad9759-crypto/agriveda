import type {
  OutbreakCluster,
  OutbreakListSummary,
  PublicOutbreakReport,
  SubmitOutbreakInput,
} from "@/types/outbreak";
import { readStorage, writeStorage } from "@/lib/storage";
import { fetchOutbreakReportsSince } from "@/lib/supabaseOutbreak";
import { buildOutbreakRadarPayload } from "@/lib/outbreakPublic";
import { isSupabaseConfigured } from "@/lib/supabase";
import { queueOutbreakReport, trySyncPendingOutbreaks } from "@/lib/outbreakSync";
import { getDeviceId } from "@/lib/deviceId";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { insertOutbreakReportToSupabase } from "@/lib/supabaseOutbreak";
import { toPublicOutbreakReport } from "@/lib/outbreakPublic";
import { detectOutbreakCluster } from "@/lib/outbreakCluster";

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
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  await trySyncPendingOutbreaks();

  const all = await fetchOutbreakReportsSince(days);
  const payload = buildOutbreakRadarPayload(all, lat, lon, radiusKm, days);

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

  const deviceId = getDeviceId();
  const farmerId = input.farmerId || (await ensureFarmerRecord(deviceId));

  if (!navigator.onLine) {
    queueOutbreakReport({ ...input, farmerId: farmerId ?? input.farmerId });
    throw new Error("Offline — report saved and will sync when online.");
  }

  const saved = await insertOutbreakReportToSupabase({
    farmerId: farmerId ?? null,
    cropId: input.cropId,
    threatType: input.threatType,
    pestOrDiseaseId: input.pestOrDiseaseId,
    photoUrl: input.photoUrl,
    latitude: input.latitude,
    longitude: input.longitude,
    severity: input.severity,
  });

  if (!saved) {
    queueOutbreakReport({ ...input, farmerId: farmerId ?? input.farmerId });
    throw new Error("Could not submit report — queued for retry.");
  }

  const all = await fetchOutbreakReportsSince(14);
  const clusters = detectOutbreakCluster(all);

  return {
    report: toPublicOutbreakReport(saved),
    clusters,
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
