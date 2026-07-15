"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Returns Supabase farmers.id for the current session (via /api/auth/session).
 */
export function useFarmerId(): string {
  const [farmerId, setFarmerId] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let cancelled = false;
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((body: { farmerId?: string | null }) => {
        if (!cancelled && body.farmerId) setFarmerId(body.farmerId);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return farmerId;
}

export { getDeviceId } from "@/lib/deviceId";
