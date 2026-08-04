import type { SupabaseClient } from "@supabase/supabase-js";
import { kvDelete } from "@/lib/durableKv";
import { createSupabaseServiceClient } from "@/lib/supabase";

function storagePathFromPhotoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("storage://expert-query-photos/")) {
    return url.slice("storage://expert-query-photos/".length);
  }
  try {
    const u = new URL(url);
    const marker = "/expert-query-photos/";
    const idx = u.pathname.indexOf(marker);
    if (idx >= 0) return decodeURIComponent(u.pathname.slice(idx + marker.length));
  } catch {
    /* ignore */
  }
  return null;
}

async function removeStorageFolder(client: SupabaseClient, folder: string) {
  const safe = folder.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  if (!safe) return;
  const { data: files } = await client.storage.from("expert-query-photos").list(safe, {
    limit: 200,
  });
  if (!files?.length) return;
  const paths = files.map((f) => `${safe}/${f.name}`);
  await client.storage.from("expert-query-photos").remove(paths);
}

/**
 * Wipe server-side farmer data for Play Store account deletion.
 * Session cookie must be cleared by the API route separately.
 */
export async function deleteFarmerAccountServer(opts: {
  phone: string;
  deviceId: string;
}): Promise<{ ok: true; farmerId: string | null } | { ok: false; error: string }> {
  const phone = opts.phone.trim();
  const deviceId = opts.deviceId.trim();
  if (!phone || !deviceId) {
    return { ok: false, error: "phone and deviceId required" };
  }

  await kvDelete(`otp:${phone}`);

  const client = createSupabaseServiceClient();
  if (!client) {
    return { ok: true, farmerId: null };
  }

  try {
    const farmerIds = new Set<string>();

    const { data: byDevice } = await client
      .from("farmers")
      .select("id")
      .eq("device_id", deviceId)
      .limit(20);
    for (const row of byDevice ?? []) {
      if (row?.id) farmerIds.add(String(row.id));
    }

    const { data: byPhone } = await client
      .from("farmers")
      .select("id")
      .eq("phone", phone)
      .limit(20);
    for (const row of byPhone ?? []) {
      if (row?.id) farmerIds.add(String(row.id));
    }

    const photoPaths = new Set<string>();
    const { data: byDevQ } = await client
      .from("expert_queries")
      .select("photo_url")
      .eq("device_id", deviceId)
      .limit(200);
    for (const q of byDevQ ?? []) {
      const p = storagePathFromPhotoUrl(q.photo_url as string | null);
      if (p) photoPaths.add(p);
    }
    const { data: byPhoneQ } = await client
      .from("expert_queries")
      .select("photo_url")
      .eq("farmer_phone", phone)
      .limit(200);
    for (const q of byPhoneQ ?? []) {
      const p = storagePathFromPhotoUrl(q.photo_url as string | null);
      if (p) photoPaths.add(p);
    }
    if (photoPaths.size) {
      await client.storage.from("expert-query-photos").remove([...photoPaths]);
    }
    await removeStorageFolder(client, deviceId);

    await client.from("expert_queries").delete().eq("device_id", deviceId);
    await client.from("expert_queries").delete().eq("farmer_phone", phone);
    for (const fid of farmerIds) {
      await client.from("expert_queries").delete().eq("farmer_id", fid);
      await client.from("outbreak_reports").delete().eq("farmer_id", fid);
    }

    await client.from("farmer_notifications").delete().eq("device_id", deviceId);
    await client.from("farmer_notifications").delete().eq("farmer_phone", phone);

    for (const fid of farmerIds) {
      await client.from("farmers").delete().eq("id", fid);
    }
    await client.from("farmers").delete().eq("device_id", deviceId);
    await client.from("farmers").delete().eq("phone", phone);

    return { ok: true, farmerId: [...farmerIds][0] ?? null };
  } catch (err) {
    console.error("[deleteFarmerAccount]", err);
    return { ok: false, error: "Server wipe failed — try again or email support" };
  }
}
