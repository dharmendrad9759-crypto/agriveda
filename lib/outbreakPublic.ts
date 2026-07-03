import type { OutbreakReport } from "@/types/outbreak";
import type { PublicOutbreakReport, OutbreakListSummary, OutbreakCluster } from "@/types/outbreak";
import { anonymizeCoords, haversineKm } from "@/lib/geo";
import { detectOutbreakCluster } from "@/lib/outbreakCluster";
import { getThreatDetail, threatDetailPath } from "@/lib/pest-disease-catalog";
import type { ThreatType } from "@/types/pest-disease-ui";

export function toPublicOutbreakReport(
  r: OutbreakReport,
  viewerLat?: number,
  viewerLon?: number
): PublicOutbreakReport {
  const threatType = r.threatType as ThreatType;
  const detail = getThreatDetail(r.cropId, threatType, r.pestOrDiseaseId);
  const anon = anonymizeCoords(r.latitude, r.longitude, r.id);

  return {
    id: r.id,
    cropId: r.cropId,
    cropName: detail?.cropName ?? r.cropId,
    threatType: r.threatType,
    pestOrDiseaseId: r.pestOrDiseaseId,
    threatName: detail?.name ?? r.pestOrDiseaseId,
    threatCategory: detail?.category ?? "other",
    latitude: anon.lat,
    longitude: anon.lon,
    severity: r.severity,
    reportDate: r.reportDate,
    verified: r.verified,
    advisoryUrl: threatDetailPath(r.cropId, threatType, r.pestOrDiseaseId),
    distanceKm:
      viewerLat != null && viewerLon != null
        ? Math.round(haversineKm(viewerLat, viewerLon, anon.lat, anon.lon) * 10) / 10
        : undefined,
  };
}

export function buildOutbreakSummaries(
  reports: PublicOutbreakReport[]
): OutbreakListSummary[] {
  const groups = new Map<string, PublicOutbreakReport[]>();

  for (const r of reports) {
    const key = `${r.cropId}:${r.threatType}:${r.pestOrDiseaseId}`;
    const list = groups.get(key) ?? [];
    list.push(r);
    groups.set(key, list);
  }

  return [...groups.values()]
    .map((items) => {
      const first = items[0];
      const nearest = Math.min(...items.map((i) => i.distanceKm ?? 999));
      const lastReportDate = items
        .map((i) => i.reportDate)
        .sort()
        .reverse()[0];
      return {
        threatName: first.threatName,
        cropName: first.cropName,
        threatType: first.threatType,
        cropId: first.cropId,
        pestOrDiseaseId: first.pestOrDiseaseId,
        reportCount: items.length,
        nearestDistanceKm: nearest,
        lastReportDate,
        advisoryUrl: first.advisoryUrl,
      };
    })
    .sort((a, b) => a.nearestDistanceKm - b.nearestDistanceKm);
}

export function filterNearbyOutbreaks(
  reports: OutbreakReport[],
  lat: number,
  lon: number,
  radiusKm: number,
  days: number
): OutbreakReport[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return reports.filter((r) => {
    if (new Date(r.reportDate).getTime() < cutoff) return false;
    return haversineKm(lat, lon, r.latitude, r.longitude) <= radiusKm;
  });
}

export function buildOutbreakRadarPayload(
  allReports: OutbreakReport[],
  lat: number,
  lon: number,
  radiusKm: number,
  days: number
): {
  reports: PublicOutbreakReport[];
  clusters: OutbreakCluster[];
  summaries: OutbreakListSummary[];
} {
  const nearby = filterNearbyOutbreaks(allReports, lat, lon, radiusKm, days);
  const publicReports = nearby
    .map((r) => toPublicOutbreakReport(r, lat, lon))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  const clusters = detectOutbreakCluster(allReports).filter((c) =>
    haversineKm(lat, lon, c.centerLat, c.centerLon) <= radiusKm + c.radiusKm
  );

  return {
    reports: publicReports,
    clusters,
    summaries: buildOutbreakSummaries(publicReports),
  };
}
