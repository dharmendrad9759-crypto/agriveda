"use client";

import { useEffect, useState } from "react";
import { getDeviceId } from "@/lib/deviceId";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Returns Supabase farmers.id (UUID) for the current device.
 * Creates farmers row on first use when Supabase is configured.
 */
export function useFarmerId(): string {
  const [farmerId, setFarmerId] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const deviceId = getDeviceId();
    ensureFarmerRecord(deviceId).then((id) => {
      if (id) setFarmerId(id);
    });
  }, []);

  return farmerId;
}

export { getDeviceId } from "@/lib/deviceId";
