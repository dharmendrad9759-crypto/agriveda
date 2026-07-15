import { createSupabaseServiceClient } from "@/lib/supabase";

export type FarmerExtras = {
  phone?: string;
  name?: string;
};

/**
 * Resolve or create a farmers row for this device_id.
 * Server-only (service role). Returns Supabase farmer UUID.
 */
export async function ensureFarmerRecord(
  deviceId: string,
  client = createSupabaseServiceClient(),
  extras?: FarmerExtras
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

  if (existing && "id" in existing && existing.id) {
    const id = existing.id as string;
    if (extras?.phone || extras?.name) {
      await client
        .from("farmers")
        .update({
          ...(extras.phone ? { phone: extras.phone } : {}),
          ...(extras.name ? { name: extras.name } : {}),
        })
        .eq("id", id);
    }
    return id;
  }

  const { data: inserted, error: insertError } = await client
    .from("farmers")
    .insert({
      device_id: deviceId,
      phone: extras?.phone ?? null,
      name: extras?.name ?? null,
    })
    .select("id")
    .single();

  if (insertError) {
    const { data: retry } = await client
      .from("farmers")
      .select("id")
      .eq("device_id", deviceId)
      .maybeSingle();
    return (retry as { id: string } | null)?.id ?? null;
  }

  return (inserted?.id as string) ?? null;
}
