import { kvDelete, kvGet, kvSet, durableKvReady } from "@/lib/durableKv";

/** Match session cookie lifetime (30 days). */
const ACTIVE_DEVICE_TTL_MS = 60 * 60 * 24 * 30 * 1000;

export type ActiveDeviceRecord = {
  deviceId: string;
  email: string;
  updatedAt: number;
};

function keyFor(firebaseUid: string): string {
  return `auth:activeDevice:${firebaseUid}`;
}

export function activeDeviceStoreReady(): boolean {
  return durableKvReady();
}

export async function getActiveDevice(
  firebaseUid: string
): Promise<ActiveDeviceRecord | null> {
  const uid = firebaseUid.trim();
  if (!uid) return null;
  const row = await kvGet<ActiveDeviceRecord>(keyFor(uid));
  if (!row?.deviceId || typeof row.deviceId !== "string") return null;
  return row;
}

/**
 * One Google account → one device.
 * Same device re-login refreshes TTL. Different device → conflict (block_new).
 */
export async function claimActiveDevice(
  firebaseUid: string,
  deviceId: string,
  email: string
): Promise<{ ok: true } | { ok: false; conflict: true; activeDeviceId: string }> {
  const uid = firebaseUid.trim();
  const existing = await getActiveDevice(uid);
  if (existing && existing.deviceId !== deviceId) {
    return { ok: false, conflict: true, activeDeviceId: existing.deviceId };
  }

  await kvSet(
    keyFor(uid),
    {
      deviceId,
      email: email.trim().toLowerCase(),
      updatedAt: Date.now(),
    } satisfies ActiveDeviceRecord,
    ACTIVE_DEVICE_TTL_MS
  );
  return { ok: true };
}

/** Logout: clear binding only if this device owns it. */
export async function releaseActiveDevice(
  firebaseUid: string,
  deviceId: string
): Promise<void> {
  const uid = firebaseUid.trim();
  if (!uid) return;
  const existing = await getActiveDevice(uid);
  if (!existing) return;
  if (existing.deviceId !== deviceId) return;
  await kvDelete(keyFor(uid));
}
