import { createSupabaseServiceClient } from "@/lib/supabase";

export type FarmerExtras = {
  phone?: string;
  name?: string;
  firebaseUid?: string;
};

type FarmerRow = {
  id: string;
  device_id?: string;
  name?: string | null;
  firebase_uid?: string | null;
  profile_json?: Record<string, unknown> | null;
};

function uidOf(extras?: FarmerExtras): string {
  return (extras?.firebaseUid || "").trim();
}

async function selectByFirebaseUid(
  client: NonNullable<ReturnType<typeof createSupabaseServiceClient>>,
  firebaseUid: string
): Promise<FarmerRow | null> {
  const { data, error } = await client
    .from("farmers")
    .select("id, device_id, name, firebase_uid, profile_json")
    .eq("firebase_uid", firebaseUid)
    .maybeSingle();

  if (error) {
    if (/firebase_uid/i.test(error.message)) return null;
    console.error("[ensureFarmerRecord] uid select", error.message);
    return null;
  }
  return (data as FarmerRow | null) ?? null;
}

async function selectByDeviceId(
  client: NonNullable<ReturnType<typeof createSupabaseServiceClient>>,
  deviceId: string
): Promise<FarmerRow | null> {
  const { data, error } = await client
    .from("farmers")
    .select("id, device_id, name, profile_json")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) {
    console.error("[ensureFarmerRecord] device select", error.message);
    return null;
  }
  return (data as FarmerRow | null) ?? null;
}

async function patchFarmer(
  client: NonNullable<ReturnType<typeof createSupabaseServiceClient>>,
  id: string,
  extras?: FarmerExtras,
  deviceId?: string
) {
  const patch: Record<string, unknown> = {};
  const uid = uidOf(extras);
  if (uid) patch.firebase_uid = uid;
  if (deviceId) patch.device_id = deviceId;
  if (extras?.phone) patch.phone = extras.phone;

  const { data: current } = await client
    .from("farmers")
    .select("name")
    .eq("id", id)
    .maybeSingle();
  const existingName = String((current as { name?: string } | null)?.name || "").trim();
  if (!existingName && extras?.name) patch.name = extras.name;

  if (Object.keys(patch).length === 0) return;
  const { error } = await client.from("farmers").update(patch).eq("id", id);
  if (error && /firebase_uid/i.test(error.message)) {
    delete patch.firebase_uid;
    if (Object.keys(patch).length) {
      await client.from("farmers").update(patch).eq("id", id);
    }
  }
}

/**
 * Resolve or create a farmers row.
 * Prefers Google firebase_uid so name/location survive device-data wipes.
 */
export async function ensureFarmerRecord(
  deviceId: string,
  client = createSupabaseServiceClient(),
  extras?: FarmerExtras
): Promise<string | null> {
  if (!client || !deviceId) return null;

  const firebaseUid = uidOf(extras);
  let found = firebaseUid ? await selectByFirebaseUid(client, firebaseUid) : null;
  if (!found) found = await selectByDeviceId(client, deviceId);

  if (found?.id) {
    if (found.device_id && found.device_id !== deviceId) {
      const stub = await selectByDeviceId(client, deviceId);
      if (stub?.id && stub.id !== found.id) {
        const stubProfile = stub.profile_json;
        const stubEmpty =
          !stubProfile ||
          (!String(stubProfile.name || "").trim() && !String(stubProfile.district || "").trim());
        if (stubEmpty) {
          await client.from("farmers").delete().eq("id", stub.id);
        }
      }
    }
    await patchFarmer(client, found.id, extras, deviceId);
    return found.id;
  }

  const insertRow: Record<string, unknown> = {
    device_id: deviceId,
    phone: extras?.phone ?? null,
    name: extras?.name ?? null,
  };
  if (firebaseUid) insertRow.firebase_uid = firebaseUid;

  const { data: inserted, error: insertError } = await client
    .from("farmers")
    .insert(insertRow)
    .select("id")
    .single();

  if (insertError) {
    if (/firebase_uid/i.test(insertError.message) && firebaseUid) {
      delete insertRow.firebase_uid;
      const retryNoUid = await client.from("farmers").insert(insertRow).select("id").single();
      if (!retryNoUid.error) return (retryNoUid.data as { id: string } | null)?.id ?? null;
    }
    const retry = firebaseUid
      ? await selectByFirebaseUid(client, firebaseUid)
      : await selectByDeviceId(client, deviceId);
    return retry?.id ?? null;
  }

  return (inserted as { id: string } | null)?.id ?? null;
}
