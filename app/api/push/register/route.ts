import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/** Register FCM device token for this farmer (native Capacitor). */
export async function POST(request: NextRequest) {
  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;

  const limited = await rateLimit(`push-reg:${auth.session.deviceId}`, 20, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      token?: string;
      lastLat?: number;
      lastLon?: number;
    };
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token || token.length < 20 || token.length > 4096) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const client = createSupabaseServiceClient();
    if (!client) {
      return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });
    }

    const farmerId = await ensureFarmerRecord(auth.session.deviceId, client, {
      phone: auth.session.phone,
      name: auth.session.name,
    });
    if (!farmerId) {
      return NextResponse.json({ error: "Could not resolve farmer" }, { status: 500 });
    }

    const patch: Record<string, unknown> = {
      push_token: token,
      push_updated_at: new Date().toISOString(),
    };
    if (
      typeof body.lastLat === "number" &&
      typeof body.lastLon === "number" &&
      body.lastLat >= -90 &&
      body.lastLat <= 90 &&
      body.lastLon >= -180 &&
      body.lastLon <= 180
    ) {
      patch.last_lat = body.lastLat;
      patch.last_lon = body.lastLon;
    }

    const { error } = await client.from("farmers").update(patch).eq("id", farmerId);
    if (error) {
      console.error("[push/register]", error.message);
      return NextResponse.json(
        { error: "Save failed — run supabase/farmer-cloud-sync.sql", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
