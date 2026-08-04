import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { requireSession } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import {
  createExpertQuery,
  expertQueriesBackendReady,
  listExpertQueriesForDevice,
  type AiDiagnosisPayload,
  type ExpertQueryRow,
  type ExpertQuerySource,
} from "@/lib/expertQueries";

function publicQuery(row: ExpertQueryRow | null) {
  if (!row) return null;
  return {
    id: row.id,
    cropName: row.crop_name,
    cropSlug: row.crop_slug,
    queryText: row.query_text,
    photoUrl: row.photo_url,
    aiDiagnosis: row.ai_diagnosis,
    source: row.source,
    status: row.status,
    expertReply: row.expert_reply,
    expertName: row.expert_name,
    answeredAt: row.answered_at,
    createdAt: row.created_at,
  };
}

/** Farmer inbox — session required (no client-supplied deviceId IDOR). */
export async function GET(request: NextRequest) {
  if (!expertQueriesBackendReady()) {
    return NextResponse.json({ error: "Expert inbox not configured" }, { status: 503 });
  }

  const auth = requireSession(request);
  if ("error" in auth) return auth.error;
  const deviceId = auth.session.deviceId;

  const limited = await rateLimit(`expert-q-get:${deviceId}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const rows = await listExpertQueriesForDevice(deviceId);
  return NextResponse.json({ queries: rows.map(publicQuery) });
}

/** Create expert ticket — session required; phone/device from session only. */
export async function POST(request: NextRequest) {
  if (!expertQueriesBackendReady()) {
    return NextResponse.json(
      {
        error:
          "Expert panel server ready नहीं — Supabase + expert_queries टेबल सेट करें",
      },
      { status: 503 }
    );
  }

  const auth = requireSession(request);
  if ("error" in auth) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const deviceId = auth.session.deviceId;
  const ip = clientIp(request);
  const limited = await rateLimit(`expert-q-post:${deviceId}:${ip}`, 12, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `बहुत सारे सवाल — ${limited.retryAfterSec} सेकंड बाद कोशिश करें` },
      { status: 429 }
    );
  }

  const queryText = String(body.queryText ?? "").trim();
  const cropName = String(body.cropName ?? "").trim();
  if (queryText.length < 8) {
    return NextResponse.json({ error: "सवाल थोड़ा विस्तार से लिखें" }, { status: 400 });
  }
  if (!cropName) {
    return NextResponse.json({ error: "फसल ज़रूरी है" }, { status: 400 });
  }

  const client = createSupabaseServiceClient();
  let farmerId: string | null = null;
  if (hasSupabaseServiceRole() && client) {
    farmerId = await ensureFarmerRecord(deviceId, client, {
      phone: auth.session.phone,
      name: String(body.farmerName ?? "").trim() || undefined,
    });
  }

  const source: ExpertQuerySource =
    body.source === "ai-doctor" ? "ai-doctor" : "ask-query";

  const aiDiagnosis =
    body.aiDiagnosis && typeof body.aiDiagnosis === "object"
      ? (body.aiDiagnosis as AiDiagnosisPayload)
      : null;

  const created = await createExpertQuery(
    {
      farmerId,
      deviceId,
      farmerName: String(body.farmerName ?? "").trim() || undefined,
      farmerPhone: auth.session.phone,
      farmerVillage: String(body.farmerVillage ?? "").trim() || undefined,
      farmerDistrict: String(body.farmerDistrict ?? "").trim() || undefined,
      farmerState: String(body.farmerState ?? "").trim() || undefined,
      cropSlug: String(body.cropSlug ?? "").trim() || undefined,
      cropName,
      queryText,
      photoDataUrl: typeof body.photoDataUrl === "string" ? body.photoDataUrl : null,
      aiDiagnosis,
      source,
    },
    client
  );

  if (!created.row) {
    return NextResponse.json(
      {
        error: created.error || "सवाल सेव नहीं हो सका — बाद में कोशिश करें",
        configured: hasSupabaseServiceRole(),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, query: publicQuery(created.row) }, { status: 201 });
}
