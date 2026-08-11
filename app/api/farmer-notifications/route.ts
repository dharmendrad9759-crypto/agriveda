import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { isValidDeviceId, isValidSessionPhone } from "@/lib/deviceIdValidate";

type NotifRow = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  created_at: string;
  expert_query_id: string | null;
};

function sessionOwners(session: { deviceId: string; phone: string }) {
  const deviceId = isValidDeviceId(session.deviceId) ? session.deviceId : null;
  const phone = isValidSessionPhone(session.phone) ? session.phone : null;
  return { deviceId, phone };
}

/** Safe ownership queries — never build PostgREST `.or()` from raw strings. */
async function fetchOwnedNotifications(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
  deviceId: string | null,
  phone: string | null
): Promise<NotifRow[]> {
  const cols = "id, title, body, href, read, created_at, expert_query_id";
  const merge = new Map<string, NotifRow>();

  if (deviceId) {
    const { data, error } = await client
      .from("farmer_notifications")
      .select(cols)
      .eq("device_id", deviceId)
      .order("created_at", { ascending: false })
      .limit(40);
    if (error) throw new Error(error.message);
    for (const row of (data ?? []) as NotifRow[]) merge.set(row.id, row);
  }

  if (phone) {
    const { data, error } = await client
      .from("farmer_notifications")
      .select(cols)
      .eq("farmer_phone", phone)
      .order("created_at", { ascending: false })
      .limit(40);
    if (error) throw new Error(error.message);
    for (const row of (data ?? []) as NotifRow[]) merge.set(row.id, row);
  }

  return [...merge.values()]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 40);
}

/** Farmer in-app notifications (expert replies, etc.). */
export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;

  const { deviceId, phone } = sessionOwners(auth.session);
  if (!deviceId && !phone) {
    return NextResponse.json({ notifications: [], configured: true });
  }

  const limited = await rateLimit(
    `farm-notif:${deviceId ?? phone}`,
    60,
    60_000
  );
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ notifications: [], configured: false });
  }

  const client = createSupabaseServiceClient();
  if (!client) return NextResponse.json({ notifications: [] });

  try {
    const notifications = await fetchOwnedNotifications(client, deviceId, phone);
    return NextResponse.json({ notifications, configured: true });
  } catch (err) {
    console.error("[farmer-notifications]", err instanceof Error ? err.message : err);
    return NextResponse.json({ notifications: [] });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;
  void clientIp(request);

  const { deviceId, phone } = sessionOwners(auth.session);
  if (!deviceId && !phone) {
    return NextResponse.json({ error: "Invalid session identity" }, { status: 400 });
  }

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
    if (deviceId) {
      await client.from("farmer_notifications").update({ read: true }).eq("device_id", deviceId);
    }
    if (phone) {
      await client.from("farmer_notifications").update({ read: true }).eq("farmer_phone", phone);
    }
    return NextResponse.json({ ok: true });
  }

  if (body.id) {
    const id = String(body.id).trim();
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    let updated = false;
    if (deviceId) {
      const { data } = await client
        .from("farmer_notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("device_id", deviceId)
        .select("id")
        .maybeSingle();
      updated = Boolean(data);
    }
    if (!updated && phone) {
      await client
        .from("farmer_notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("farmer_phone", phone);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "id or markAllRead required" }, { status: 400 });
}
