import { createSupabaseServiceClient } from "@/lib/supabase";

export type FarmerProfileSnapshot = {
  name?: string;
  village?: string;
  district?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  onboardingComplete?: boolean;
  farmSetupComplete?: boolean;
  totalFarmAreaAcres?: number;
};

export type FarmerFarmSummary = {
  fieldCount: number;
  crops: string[];
};

export type FarmerAdminRow = {
  id: string;
  deviceId: string;
  name: string | null;
  phone: string | null;
  language: string | null;
  createdAt: string;
  profileUpdatedAt: string | null;
  farmUpdatedAt: string | null;
  hasPush: boolean;
  lastLat: number | null;
  lastLon: number | null;
  profile: FarmerProfileSnapshot | null;
  farm: FarmerFarmSummary | null;
};

type DbRow = {
  id: string;
  device_id: string;
  name: string | null;
  phone: string | null;
  preferred_language: string | null;
  created_at: string;
  profile_json: Record<string, unknown> | null;
  farm_data_json: Record<string, unknown> | null;
  profile_updated_at: string | null;
  farm_updated_at: string | null;
  push_token: string | null;
  last_lat: number | null;
  last_lon: number | null;
};

function parseProfile(raw: Record<string, unknown> | null): FarmerProfileSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  return {
    name: typeof raw.name === "string" ? raw.name : undefined,
    village: typeof raw.village === "string" ? raw.village : undefined,
    district: typeof raw.district === "string" ? raw.district : undefined,
    state: typeof raw.state === "string" ? raw.state : undefined,
    pincode: typeof raw.pincode === "string" ? raw.pincode : undefined,
    phone: typeof raw.phone === "string" ? raw.phone : undefined,
    email: typeof raw.email === "string" ? raw.email : undefined,
    onboardingComplete: Boolean(raw.onboardingComplete),
    farmSetupComplete: Boolean(raw.farmSetupComplete),
    totalFarmAreaAcres:
      typeof raw.totalFarmAreaAcres === "number" ? raw.totalFarmAreaAcres : undefined,
  };
}

function parseFarm(raw: Record<string, unknown> | null): FarmerFarmSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const fields = Array.isArray(raw.fields) ? raw.fields : [];
  const crops = fields
    .map((f) => {
      if (!f || typeof f !== "object") return null;
      const row = f as Record<string, unknown>;
      return typeof row.crop === "string" ? row.crop : null;
    })
    .filter((c): c is string => Boolean(c));
  return {
    fieldCount: fields.length,
    crops: [...new Set(crops)].slice(0, 6),
  };
}

function mapRow(row: DbRow): FarmerAdminRow {
  return {
    id: row.id,
    deviceId: row.device_id,
    name: row.name,
    phone: row.phone,
    language: row.preferred_language,
    createdAt: row.created_at,
    profileUpdatedAt: row.profile_updated_at,
    farmUpdatedAt: row.farm_updated_at,
    hasPush: Boolean(row.push_token),
    lastLat: row.last_lat,
    lastLon: row.last_lon,
    profile: parseProfile(row.profile_json),
    farm: parseFarm(row.farm_data_json),
  };
}

function matchesSearch(row: FarmerAdminRow, q: string): boolean {
  const needle = q.toLowerCase();
  const hay = [
    row.name,
    row.phone,
    row.deviceId,
    row.profile?.name,
    row.profile?.phone,
    row.profile?.email,
    row.profile?.village,
    row.profile?.district,
    row.profile?.state,
    row.profile?.pincode,
    row.farm?.crops.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

export async function listFarmersAdmin(opts: {
  limit?: number;
  offset?: number;
  q?: string;
}): Promise<{ farmers: FarmerAdminRow[]; total: number; configured: boolean }> {
  const client = createSupabaseServiceClient();
  if (!client) {
    return { farmers: [], total: 0, configured: false };
  }

  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 100);
  const offset = Math.max(opts.offset ?? 0, 0);
  const q = (opts.q ?? "").trim();

  const { data, error, count } = await client
    .from("farmers")
    .select(
      "id, device_id, name, phone, preferred_language, created_at, profile_json, farm_data_json, profile_updated_at, farm_updated_at, push_token, last_lat, last_lon",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[farmersAdmin]", error.message);
    return { farmers: [], total: 0, configured: true };
  }

  let farmers = (data as DbRow[] | null)?.map(mapRow) ?? [];

  if (q) {
    const serverFiltered = farmers.filter((f) => matchesSearch(f, q));
    if (serverFiltered.length > 0 || q.length <= 2) {
      farmers = serverFiltered;
    } else {
      const { data: wide } = await client
        .from("farmers")
        .select(
          "id, device_id, name, phone, preferred_language, created_at, profile_json, farm_data_json, profile_updated_at, farm_updated_at, push_token, last_lat, last_lon"
        )
        .order("created_at", { ascending: false })
        .limit(500);
      farmers = ((wide as DbRow[] | null) ?? []).map(mapRow).filter((f) => matchesSearch(f, q));
    }
  }

  return {
    farmers,
    total: q ? farmers.length : count ?? farmers.length,
    configured: true,
  };
}

export async function countFarmersAdmin(): Promise<{ total: number; configured: boolean }> {
  const client = createSupabaseServiceClient();
  if (!client) return { total: 0, configured: false };
  const { count, error } = await client
    .from("farmers")
    .select("id", { count: "exact", head: true });
  if (error) {
    console.error("[farmersAdmin count]", error.message);
    return { total: 0, configured: true };
  }
  return { total: count ?? 0, configured: true };
}
