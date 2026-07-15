import type { SprayLog } from "@/types/spray-rotation";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { Database } from "@/types/database";
import { getProductById } from "@/data/spray-products";

type SprayRow = Database["public"]["Tables"]["spray_logs"]["Row"];

export function sprayRowToLog(row: SprayRow): SprayLog {
  return {
    id: row.id,
    farmerId: row.farmer_id ?? "",
    cropId: row.crop_id,
    fieldId: row.field_id ?? "",
    productId: row.product_id,
    sprayDate: row.spray_date,
    doseUsed: row.dose_used ?? "",
    growthStageAtSpray: row.growth_stage ?? "",
    synced: true,
    createdAt: row.created_at,
  };
}

export async function fetchSprayLogsForFarmer(
  farmerId: string,
  client = createSupabaseServiceClient()
): Promise<SprayLog[]> {
  if (!client) return [];

  const { data, error } = await client
    .from("spray_logs")
    .select("*")
    .eq("farmer_id", farmerId)
    .order("spray_date", { ascending: false });

  if (error) {
    console.error("[fetchSprayLogsForFarmer]", error.message);
    return [];
  }

  return (data ?? []).map((row) => sprayRowToLog(row as SprayRow));
}

export async function insertSprayLogToSupabase(
  farmerId: string,
  log: SprayLog,
  client = createSupabaseServiceClient()
): Promise<SprayLog | null> {
  if (!client) return null;

  const product = getProductById(log.productId);
  const moaGroup = product ? `${product.moaType} ${product.moaGroup}` : null;

  const payload: Database["public"]["Tables"]["spray_logs"]["Insert"] = {
    farmer_id: farmerId,
    crop_id: log.cropId,
    field_id: log.fieldId || null,
    product_id: log.productId,
    product_name: product?.productName ?? log.productId,
    moa_group: moaGroup,
    spray_date: log.sprayDate,
    dose_used: log.doseUsed,
    growth_stage: log.growthStageAtSpray,
  };

  const { data, error } = await client
    .from("spray_logs")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("[insertSprayLogToSupabase]", error.message);
    return null;
  }

  return {
    ...sprayRowToLog(data as SprayRow),
    pestId: log.pestId,
    diseaseId: log.diseaseId,
  };
}

/** Merge remote Supabase logs with local cache (keeps unsynced + local-only fields) */
export function mergeSprayLogs(local: SprayLog[], remote: SprayLog[]): SprayLog[] {
  const remoteById = new Map(remote.map((r) => [r.id, r]));
  const merged = new Map<string, SprayLog>();

  for (const r of remote) {
    merged.set(r.id, r);
  }

  for (const l of local) {
    if (!l.synced) {
      merged.set(l.id, l);
      continue;
    }
    if (!remoteById.has(l.id)) {
      merged.set(l.id, l);
    }
  }

  return [...merged.values()].sort(
    (a, b) => new Date(b.sprayDate).getTime() - new Date(a.sprayDate).getTime()
  );
}
