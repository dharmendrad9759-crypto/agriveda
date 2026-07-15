import { NextRequest, NextResponse } from "next/server";
import type { SubmitOutbreakInput } from "@/types/outbreak";
import {
  createSupabaseServiceClient,
  hasSupabaseServiceRole,
} from "@/lib/supabase";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import {
  fetchOutbreakReportsSince,
  insertOutbreakReportToSupabase,
} from "@/lib/supabaseOutbreak";
import { buildOutbreakRadarPayload, toPublicOutbreakReport } from "@/lib/outbreakPublic";
import { detectOutbreakCluster } from "@/lib/outbreakCluster";
import { requireSession } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const lat = parseFloat(request.nextUrl.searchParams.get("lat") ?? "");
  const lon = parseFloat(request.nextUrl.searchParams.get("lon") ?? "");
  const radiusKm = Math.min(
    50,
    Math.max(1, parseFloat(request.nextUrl.searchParams.get("radiusKm") ?? "10"))
  );
  const days = Math.min(
    30,
    Math.max(1, parseInt(request.nextUrl.searchParams.get("days") ?? "14", 10))
  );

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  const ip = clientIp(request);
  const limited = rateLimit(`outbreak-get:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const client = createSupabaseServiceClient();
  const all = await fetchOutbreakReportsSince(days, client);
  const payload = buildOutbreakRadarPayload(all, lat, lon, radiusKm, days);

  return NextResponse.json(payload);
}

export async function POST(request: NextRequest) {
  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const auth = requireSession(request);
  if ("error" in auth) return auth.error;

  const limited = rateLimit(`outbreak-post:${auth.session.deviceId}`, 10, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Outbreak report limit — 1 घंटे में ज़्यादा रिपोर्ट न भेजें" },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as SubmitOutbreakInput;

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

    if (
      typeof body.photoUrl === "string" &&
      body.photoUrl.length > 400_000
    ) {
      return NextResponse.json({ error: "Photo too large" }, { status: 400 });
    }

    const client = createSupabaseServiceClient();
    if (!client) {
      return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });
    }

    // Never trust body.farmerId
    const farmerId = await ensureFarmerRecord(auth.session.deviceId, client, {
      phone: auth.session.phone,
    });

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
