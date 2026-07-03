import { getSupabase, createSupabaseServerClient } from "@/lib/supabase";

/**
 * Resolve or create a farmers row for this device_id.
 * Returns Supabase farmer UUID.
 */
export async function ensureFarmerRecord(
  deviceId: string,
  client = getSupabase() ?? createSupabaseServerClient()
): Promise<string | null> {
  if (!client || !deviceId) return null;

  const { data: existing, error: selectError } = await client
    .from("farmers")
    .select("id")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (selectError) {
    console.error("[ensureFarmerRecord] select", selectError.message);
    return null;
  }

  if (existing && "id" in existing && existing.id) return existing.id as string;

  const { data: inserted, error: insertError } = await client
    .from("farmers")
    .insert({ device_id: deviceId })
    .select("id")
    .single();

  if (insertError) {
    // Race: another tab may have inserted — retry select
    const { data: retry } = await client
      .from("farmers")
      .select("id")
      .eq("device_id", deviceId)
      .maybeSingle();
    return (retry as { id: string } | null)?.id ?? null;
  }

  return inserted?.id as string ?? null;
}
