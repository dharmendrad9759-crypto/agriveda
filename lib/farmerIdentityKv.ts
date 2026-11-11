import { kvDelete, kvGet, kvSet } from "@/lib/durableKv";

const TTL_MS = 1000 * 60 * 60 * 24 * 800; // ~26 months

export type FarmerIdentitySnapshot = {
  name: string;
  village: string;
  district: string;
  state: string;
  pincode?: string;
};

function keyFor(firebaseUid: string): string {
  return `farmer:identity:${firebaseUid.trim()}`;
}

export async function saveFarmerIdentity(
  firebaseUid: string | undefined,
  profile: {
    name?: string;
    village?: string;
    district?: string;
    state?: string;
    pincode?: string;
  } | null
): Promise<void> {
  const uid = firebaseUid?.trim();
  if (!uid || !profile) return;
  const name = (profile.name || "").trim();
  const village = (profile.village || "").trim();
  const district = (profile.district || "").trim();
  const state = (profile.state || "").trim();
  if (!name && !district) return;
  await kvSet(
    keyFor(uid),
    {
      name,
      village,
      district,
      state,
      pincode: (profile.pincode || "").replace(/\D/g, "").slice(0, 6) || undefined,
    } satisfies FarmerIdentitySnapshot,
    TTL_MS
  );
}

export async function loadFarmerIdentity(
  firebaseUid: string | undefined
): Promise<FarmerIdentitySnapshot | null> {
  const uid = firebaseUid?.trim();
  if (!uid) return null;
  const row = await kvGet<FarmerIdentitySnapshot>(keyFor(uid));
  if (!row || typeof row !== "object") return null;
  if (!String(row.name || "").trim() && !String(row.district || "").trim()) return null;
  return row;
}

export async function deleteFarmerIdentity(firebaseUid: string | undefined): Promise<void> {
  const uid = firebaseUid?.trim();
  if (!uid) return;
  await kvDelete(keyFor(uid));
}
