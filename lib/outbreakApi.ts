import type {
  OutbreakCluster,
  OutbreakListSummary,
  PublicOutbreakReport,
  SubmitOutbreakInput,
} from "@/types/outbreak";
import { readStorage, writeStorage } from "@/lib/storage";

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
  const cached = getOutbreakCache(lat, lon);
  if (cached) {
    return {
      reports: cached.reports,
      clusters: cached.clusters,
      summaries: cached.summaries,
      fromCache: true,
    };
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    radiusKm: String(radiusKm),
    days: String(days),
  });

  const res = await fetch(`/api/outbreaks?${params}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Could not load outbreak data");

  setOutbreakCache({
    lat,
    lon,
    reports: body.reports,
    clusters: body.clusters,
    summaries: body.summaries,
  });

  return {
    reports: body.reports,
    clusters: body.clusters,
    summaries: body.summaries,
    fromCache: false,
  };
}

export async function submitOutbreakReport(
  input: SubmitOutbreakInput
): Promise<{ report: PublicOutbreakReport; clusters: OutbreakCluster[] }> {
  const res = await fetch("/api/outbreaks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Could not submit report");
  return { report: body.report, clusters: body.clusters ?? [] };
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
