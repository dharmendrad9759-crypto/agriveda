import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const MAX_JSON = 180_000;

type CloudPayload = {
  profile?: Record<string, unknown> | null;
  farm?: Record<string, unknown> | null;
  lastLat?: number | null;
  lastLon?: number | null;
  clientUpdatedAt?: string;
};

function sizeOk(value: unknown): boolean {
  try {
    return JSON.stringify(value ?? null).length <= MAX_JSON;
  } catch {
    return false;
  }
}

/** GET cloud profile + farm for this session device. */
export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;

  void clientIp(request);

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ configured: false, profile: null, farm: null });
  }

  const client = createSupabaseServiceClient();
  if (!client) {
    return NextResponse.json({ configured: false, profile: null, farm: null });
  }

  const farmerId = await ensureFarmerRecord(auth.session.deviceId, client, {
    phone: auth.session.phone,
    name: auth.session.name,
  });
  if (!farmerId) {
    return NextResponse.json({ error: "Could not resolve farmer" }, { status: 500 });
  }

  const { data, error } = await client
    .from("farmers")
    .select("profile_json, farm_data_json, profile_updated_at, farm_updated_at, last_lat, last_lon")
    .eq("id", farmerId)
    .maybeSingle();

  if (error) {
    console.error("[farm-sync GET]", error.message);
    return NextResponse.json(
      {
        configured: true,
        profile: null,
        farm: null,
        needsMigration: true,
        hint: "Run supabase/farmer-cloud-sync.sql in Supabase",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    configured: true,
    profile: data?.profile_json ?? null,
    farm: data?.farm_data_json ?? null,
    profileUpdatedAt: data?.profile_updated_at ?? null,
    farmUpdatedAt: data?.farm_updated_at ?? null,
    lastLat: data?.last_lat ?? null,
    lastLon: data?.last_lon ?? null,
  });
}

/** PUT upsert profile + farm JSON for this session device. */
export async function PUT(request: NextRequest) {
  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;

  const limited = await rateLimit(`farm-sync:${auth.session.deviceId}`, 40, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as CloudPayload;
    if (body.profile != null && !sizeOk(body.profile)) {
      return NextResponse.json({ error: "Profile too large" }, { status: 400 });
    }
    if (body.farm != null && !sizeOk(body.farm)) {
      return NextResponse.json({ error: "Farm data too large" }, { status: 400 });
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

    const now = new Date().toISOString();
    const patch: Record<string, unknown> = {};
    if (body.profile !== undefined) {
      patch.profile_json = body.profile;
      patch.profile_updated_at = now;
      if (body.profile && typeof body.profile === "object") {
        const p = body.profile as Record<string, unknown>;
        if (typeof p.name === "string" && p.name.trim()) patch.name = p.name.trim().slice(0, 120);
        if (typeof p.phone === "string" && p.phone.trim()) patch.phone = String(p.phone).replace(/\D/g, "").slice(-10);
      }
    }
    if (body.farm !== undefined) {
      patch.farm_data_json = body.farm;
      patch.farm_updated_at = now;
    }
    if (typeof body.lastLat === "number" && typeof body.lastLon === "number") {
      if (body.lastLat >= -90 && body.lastLat <= 90 && body.lastLon >= -180 && body.lastLon <= 180) {
        patch.last_lat = body.lastLat;
        patch.last_lon = body.lastLon;
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: true, empty: true });
    }

    const { error } = await client.from("farmers").update(patch).eq("id", farmerId);
    if (error) {
      console.error("[farm-sync PUT]", error.message);
      return NextResponse.json(
        {
          error: "Update failed — run supabase/farmer-cloud-sync.sql if columns missing",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, updatedAt: now });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
