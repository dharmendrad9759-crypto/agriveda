import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/** Farmer in-app notifications (expert replies, etc.). */
export async function GET(request: NextRequest) {
  const auth = requireSession(request);
  if ("error" in auth) return auth.error;

  const limited = await rateLimit(`farm-notif:${auth.session.deviceId}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ notifications: [], configured: false });
  }

  const client = createSupabaseServiceClient();
  if (!client) return NextResponse.json({ notifications: [] });

  const { data, error } = await client
    .from("farmer_notifications")
    .select("id, title, body, href, read, created_at, expert_query_id")
    .or(`device_id.eq.${auth.session.deviceId},farmer_phone.eq.${auth.session.phone}`)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) {
    console.error("[farmer-notifications]", error.message);
    return NextResponse.json({ notifications: [], error: error.message });
  }

  return NextResponse.json({ notifications: data ?? [], configured: true });
}

export async function PATCH(request: NextRequest) {
  const auth = requireSession(request);
  if ("error" in auth) return auth.error;
  void clientIp(request);

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const client = createSupabaseServiceClient();
  if (!client) return NextResponse.json({ ok: false }, { status: 503 });

  let body: { id?: string; markAllRead?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.markAllRead) {
    await client
      .from("farmer_notifications")
      .update({ read: true })
      .or(`device_id.eq.${auth.session.deviceId},farmer_phone.eq.${auth.session.phone}`);
    return NextResponse.json({ ok: true });
  }

  if (body.id) {
    await client
      .from("farmer_notifications")
      .update({ read: true })
      .eq("id", body.id)
      .or(`device_id.eq.${auth.session.deviceId},farmer_phone.eq.${auth.session.phone}`);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "id or markAllRead required" }, { status: 400 });
}
