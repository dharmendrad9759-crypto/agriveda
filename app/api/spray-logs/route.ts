import { NextRequest, NextResponse } from "next/server";
import type { SprayLog } from "@/types/spray-rotation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import {
  fetchSprayLogsForFarmer,
  insertSprayLogToSupabase,
} from "@/lib/supabaseSprayLogs";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const client = createSupabaseServerClient();

    if (!body?.productId || !body?.sprayDate) {
      return NextResponse.json({ error: "Invalid spray log" }, { status: 400 });
    }

    let farmerId: string | null = (body.farmerId as string | undefined) ?? null;
    if (!farmerId && body.deviceId) {
      farmerId = (await ensureFarmerRecord(body.deviceId, client)) ?? null;
    }
    if (!farmerId) {
      return NextResponse.json({ error: "farmerId or deviceId required" }, { status: 400 });
    }

    const log: SprayLog = {
      id: body.id ?? `local-${crypto.randomUUID()}`,
      farmerId,
      cropId: body.cropId,
      fieldId: body.fieldId ?? "",
      productId: body.productId,
      sprayDate: body.sprayDate,
      doseUsed: body.doseUsed ?? "",
      growthStageAtSpray: body.growthStageAtSpray ?? "",
      pestId: body.pestId,
      diseaseId: body.diseaseId,
      synced: false,
      createdAt: body.createdAt ?? new Date().toISOString(),
    };

    const saved = await insertSprayLogToSupabase(farmerId, log, client);
    if (!saved) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: saved.id, log: saved });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const farmerId = request.nextUrl.searchParams.get("farmerId");
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  const client = createSupabaseServerClient();

    let fid: string | null = farmerId;
    if (!fid && deviceId) {
      fid = (await ensureFarmerRecord(deviceId, client)) ?? null;
    }
    if (!fid) {
      return NextResponse.json({ error: "farmerId or deviceId required" }, { status: 400 });
    }

    const logs = await fetchSprayLogsForFarmer(fid, client);
  return NextResponse.json({ count: logs.length, logs });
}
