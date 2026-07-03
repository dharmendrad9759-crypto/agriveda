import { NextRequest, NextResponse } from "next/server";
import type { OutbreakListSummary, PublicOutbreakReport, SubmitOutbreakInput } from "@/types/outbreak";
import { addOutbreakReport, listOutbreakReports } from "@/services/OutbreakRepository";
import { detectOutbreakCluster } from "@/lib/outbreakCluster";
import { anonymizeCoords, haversineKm } from "@/lib/geo";
import { getThreatDetail, threatDetailPath } from "@/lib/pest-disease-catalog";
import type { ThreatType } from "@/types/pest-disease-ui";

function toPublicReport(
  r: ReturnType<typeof listOutbreakReports>[0],
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

function buildSummaries(
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

export async function GET(request: NextRequest) {
  const lat = parseFloat(request.nextUrl.searchParams.get("lat") ?? "");
  const lon = parseFloat(request.nextUrl.searchParams.get("lon") ?? "");
  const radiusKm = parseFloat(request.nextUrl.searchParams.get("radiusKm") ?? "10");
  const days = parseInt(request.nextUrl.searchParams.get("days") ?? "14", 10);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const all = listOutbreakReports();

  const nearby = all.filter((r) => {
    if (new Date(r.reportDate).getTime() < cutoff) return false;
    return haversineKm(lat, lon, r.latitude, r.longitude) <= radiusKm;
  });

  const publicReports = nearby
    .map((r) => toPublicReport(r, lat, lon))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  const clusters = detectOutbreakCluster(all).filter((c) =>
    haversineKm(lat, lon, c.centerLat, c.centerLon) <= radiusKm + c.radiusKm
  );

  return NextResponse.json({
    reports: publicReports,
    clusters,
    summaries: buildSummaries(publicReports),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmitOutbreakInput;

    if (
      !body.farmerId ||
      !body.cropId ||
      !body.threatType ||
      !body.pestOrDiseaseId ||
      body.latitude == null ||
      body.longitude == null ||
      !body.severity
    ) {
      return NextResponse.json({ error: "Invalid outbreak report" }, { status: 400 });
    }

    const report = addOutbreakReport(body);
    const all = listOutbreakReports();
    const clusters = detectOutbreakCluster(all);
    const publicReport = toPublicReport(report);

    return NextResponse.json({ report: publicReport, clusters });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
