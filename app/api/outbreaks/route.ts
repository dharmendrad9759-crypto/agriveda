import { NextRequest, NextResponse } from "next/server";
import type { SubmitOutbreakInput } from "@/types/outbreak";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import {
  fetchOutbreakReportsSince,
  insertOutbreakReportToSupabase,
} from "@/lib/supabaseOutbreak";
import { buildOutbreakRadarPayload, toPublicOutbreakReport } from "@/lib/outbreakPublic";
import { detectOutbreakCluster } from "@/lib/outbreakCluster";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const lat = parseFloat(request.nextUrl.searchParams.get("lat") ?? "");
  const lon = parseFloat(request.nextUrl.searchParams.get("lon") ?? "");
  const radiusKm = parseFloat(request.nextUrl.searchParams.get("radiusKm") ?? "10");
  const days = parseInt(request.nextUrl.searchParams.get("days") ?? "14", 10);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  const all = await fetchOutbreakReportsSince(days, createSupabaseServerClient());
  const payload = buildOutbreakRadarPayload(all, lat, lon, radiusKm, days);

  return NextResponse.json(payload);
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as SubmitOutbreakInput & { deviceId?: string };

    if (
      !body.cropId ||
      !body.threatType ||
      !body.pestOrDiseaseId ||
      body.latitude == null ||
      body.longitude == null ||
      !body.severity
    ) {
      return NextResponse.json({ error: "Invalid outbreak report" }, { status: 400 });
    }

    const client = createSupabaseServerClient();
    let farmerId: string | null = body.farmerId ?? null;
    if (!farmerId && body.deviceId) {
      farmerId = (await ensureFarmerRecord(body.deviceId, client)) ?? null;
    }

    const report = await insertOutbreakReportToSupabase(
      {
        farmerId: farmerId ?? null,
        cropId: body.cropId,
        threatType: body.threatType,
        pestOrDiseaseId: body.pestOrDiseaseId,
        photoUrl: body.photoUrl,
        latitude: body.latitude,
        longitude: body.longitude,
        severity: body.severity,
      },
      client
    );

    if (!report) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    const all = await fetchOutbreakReportsSince(14, client);
    const clusters = detectOutbreakCluster(all);

    return NextResponse.json({
      report: toPublicOutbreakReport(report),
      clusters,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
