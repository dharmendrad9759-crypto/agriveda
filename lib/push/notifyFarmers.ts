import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { haversineKm, sendFcmToToken } from "@/lib/push/fcmSend";

/**
 * Fan-out outbreak alert to nearby farmers who registered an FCM token.
 * Best-effort — never throws to caller.
 */
export async function notifyNearbyFarmersOfOutbreak(input: {
  excludeDeviceId: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
  cropId: string;
  threatLabel: string;
}): Promise<number> {
  if (!hasSupabaseServiceRole()) return 0;
  const client = createSupabaseServiceClient();
  if (!client) return 0;

  const radius = Math.min(40, Math.max(3, input.radiusKm ?? 12));

  try {
    const { data, error } = await client
      .from("farmers")
      .select("device_id, push_token, last_lat, last_lon")
      .not("push_token", "is", null)
      .not("last_lat", "is", null)
      .not("last_lon", "is", null)
      .limit(200);

    if (error || !data?.length) return 0;

    let sent = 0;
    const title = "आस-पास प्रकोप अलर्ट";
    const body = `${input.threatLabel} · ${input.cropId} — नज़दीकी खेत में रिपोर्ट`.slice(0, 240);

    for (const row of data as Array<{
      device_id: string;
      push_token: string | null;
      last_lat: number | null;
      last_lon: number | null;
    }>) {
      if (!row.push_token || row.device_id === input.excludeDeviceId) continue;
      if (row.last_lat == null || row.last_lon == null) continue;
      const km = haversineKm(input.latitude, input.longitude, row.last_lat, row.last_lon);
      if (km > radius) continue;
      const ok = await sendFcmToToken({
        token: row.push_token,
        title,
        body,
        href: "/pest-outbreak-radar",
      });
      if (ok) sent += 1;
      if (sent >= 40) break;
    }
    return sent;
  } catch (err) {
    console.error("[notifyNearbyOutbreak]", err);
    return 0;
  }
}

export async function notifyFarmerPushByDevice(input: {
  deviceId: string | null | undefined;
  title: string;
  body: string;
  href?: string;
}): Promise<boolean> {
  if (!input.deviceId || !hasSupabaseServiceRole()) return false;
  const client = createSupabaseServiceClient();
  if (!client) return false;
  try {
    const { data } = await client
      .from("farmers")
      .select("push_token")
      .eq("device_id", input.deviceId)
      .maybeSingle();
    const token = (data as { push_token?: string } | null)?.push_token;
    if (!token) return false;
    return sendFcmToToken({
      token,
      title: input.title,
      body: input.body,
      href: input.href,
    });
  } catch {
    return false;
  }
}
