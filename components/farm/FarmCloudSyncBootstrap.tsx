"use client";

import { useEffect } from "react";
import { pullFarmCloudSync } from "@/lib/farm/cloudSync";

/** After session exists, hydrate profile/farm from Supabase once per page load. */
export default function FarmCloudSyncBootstrap() {
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const session = await fetch("/api/auth/session", { credentials: "include", cache: "no-store" });
        if (!session.ok || cancelled) return;
        const json = (await session.json()) as { authenticated?: boolean };
        if (!json.authenticated) return;
        await pullFarmCloudSync();
      } catch {
        /* offline / unauthenticated */
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
