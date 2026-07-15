import { NextRequest, NextResponse } from "next/server";
import type { SprayLog } from "@/types/spray-rotation";
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import {
  fetchSprayLogsForFarmer,
  insertSprayLogToSupabase,
} from "@/lib/supabaseSprayLogs";
import { requireSession } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  if (!hasSupabaseServiceRole()) {
    return NextResponse.json(
      { error: "Supabase service role not configured" },
      { status: 503 }
    );
  }

  const auth = requireSession(request);
  if ("error" in auth) return auth.error;

  const limited = rateLimit(`spray-post:${auth.session.deviceId}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const client = createSupabaseServiceClient();
    if (!client) {
      return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });
    }

    if (!body?.productId || !body?.sprayDate) {
      return NextResponse.json({ error: "Invalid spray log" }, { status: 400 });
    }

    // farmerId ALWAYS from session device — never trust body.farmerId
    const farmerId = await ensureFarmerRecord(auth.session.deviceId, client, {
      phone: auth.session.phone,
    });
    if (!farmerId) {
      return NextResponse.json({ error: "Could not resolve farmer" }, { status: 500 });
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
  if (!hasSupabaseServiceRole()) {
    return NextResponse.json(
      { error: "Supabase service role not configured" },
      { status: 503 }
    );
  }

  const auth = requireSession(request);
  if ("error" in auth) return auth.error;

  void clientIp(request); // keep import used for future IP logging

  const client = createSupabaseServiceClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });
  }

  const farmerId = await ensureFarmerRecord(auth.session.deviceId, client, {
    phone: auth.session.phone,
  });
  if (!farmerId) {
    return NextResponse.json({ error: "Could not resolve farmer" }, { status: 500 });
  }

  const logs = await fetchSprayLogsForFarmer(farmerId, client);
  return NextResponse.json({ count: logs.length, logs, farmerId });
}
