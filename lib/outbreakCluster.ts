import type { OutbreakCluster, OutbreakReport } from "@/types/outbreak";
import { getThreatDetail, threatDetailPath } from "@/lib/pest-disease-catalog";
import { haversineKm } from "@/lib/geo";
import type { ThreatType } from "@/types/pest-disease-ui";

export const OUTBREAK_CLUSTER_DEFAULTS = {
  radiusKm: 5,
  timeWindowHours: 72,
  minReports: 3,
} as const;

function threatKey(r: Pick<OutbreakReport, "cropId" | "threatType" | "pestOrDiseaseId">): string {
  return `${r.cropId}:${r.threatType}:${r.pestOrDiseaseId}`;
}

function isWithinTimeWindow(reportDate: string, windowHours: number, now: Date): boolean {
  const ms = now.getTime() - new Date(reportDate).getTime();
  return ms >= 0 && ms <= windowHours * 60 * 60 * 1000;
}

/**
 * Detect pest/disease outbreak clusters from crowdsourced reports.
 * Groups by same crop + threat; flags when minReports fall within radiusKm + timeWindowHours.
 */
export function detectOutbreakCluster(
  reports: OutbreakReport[],
  radiusKm: number = OUTBREAK_CLUSTER_DEFAULTS.radiusKm,
  timeWindowHours: number = OUTBREAK_CLUSTER_DEFAULTS.timeWindowHours,
  minReports: number = OUTBREAK_CLUSTER_DEFAULTS.minReports,
  now: Date = new Date()
): OutbreakCluster[] {
  const recent = reports.filter((r) => isWithinTimeWindow(r.reportDate, timeWindowHours, now));
  const clusters: OutbreakCluster[] = [];
  const used = new Set<string>();

  const byThreat = new Map<string, OutbreakReport[]>();
  for (const r of recent) {
    const key = threatKey(r);
    const list = byThreat.get(key) ?? [];
    list.push(r);
    byThreat.set(key, list);
  }

  for (const [, group] of byThreat) {
    if (group.length < minReports) continue;

    for (let i = 0; i < group.length; i++) {
      const anchor = group[i];
      const clusterId = `${threatKey(anchor)}-${anchor.id}`;
      if (used.has(clusterId)) continue;

      const members = group.filter(
        (r) =>
          haversineKm(anchor.latitude, anchor.longitude, r.latitude, r.longitude) <= radiusKm
      );

      if (members.length < minReports) continue;

      members.forEach((m) => used.add(`${threatKey(m)}-${m.id}`));

      const centerLat =
        members.reduce((s, m) => s + m.latitude, 0) / members.length;
      const centerLon =
        members.reduce((s, m) => s + m.longitude, 0) / members.length;

      const threatType = anchor.threatType as ThreatType;
      const detail = getThreatDetail(anchor.cropId, threatType, anchor.pestOrDiseaseId);
      const lastReportDate = members
        .map((m) => m.reportDate)
        .sort()
        .reverse()[0];

      clusters.push({
        cropId: anchor.cropId,
        cropName: detail?.cropName ?? anchor.cropId,
        threatType: anchor.threatType,
        pestOrDiseaseId: anchor.pestOrDiseaseId,
        threatName: detail?.name ?? anchor.pestOrDiseaseId,
        centerLat,
        centerLon,
        reportCount: members.length,
        radiusKm,
        lastReportDate,
        advisoryUrl: threatDetailPath(anchor.cropId, threatType, anchor.pestOrDiseaseId),
        reportIds: members.map((m) => m.id),
      });
    }
  }

  return clusters.sort((a, b) => b.reportCount - a.reportCount);
}
