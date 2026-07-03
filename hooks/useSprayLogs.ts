"use client";

import { useCallback, useEffect, useState } from "react";
import type { SprayLog } from "@/types/spray-rotation";
import { readStorage, writeStorage } from "@/lib/storage";
import { queueSpraySync, trySyncPendingSprays } from "@/lib/spraySync";
import { getDeviceId } from "@/lib/deviceId";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import {
  fetchSprayLogsForFarmer,
  mergeSprayLogs,
} from "@/lib/supabaseSprayLogs";
import { isSupabaseConfigured } from "@/lib/supabase";

const KEY = "agriveda-spray-logs";

export function useSprayLogs() {
  const [logs, setLogs] = useState<SprayLog[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [farmerId, setFarmerId] = useState<string | null>(null);

  const refreshFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured() || !farmerId) return;

    const local = readStorage<SprayLog[]>(KEY, []);
    const remote = await fetchSprayLogsForFarmer(farmerId);
    const merged = mergeSprayLogs(local, remote);
    writeStorage(KEY, merged);
    setLogs(merged);
  }, [farmerId]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const local = readStorage<SprayLog[]>(KEY, []);
      if (!cancelled) setLogs(local);

      if (isSupabaseConfigured()) {
        const deviceId = getDeviceId();
        const fid = await ensureFarmerRecord(deviceId);
        if (!cancelled && fid) {
          setFarmerId(fid);
          const remote = await fetchSprayLogsForFarmer(fid);
          const merged = mergeSprayLogs(local, remote);
          writeStorage(KEY, merged);
          if (!cancelled) setLogs(merged);
          await trySyncPendingSprays();
          const afterSync = readStorage<SprayLog[]>(KEY, []);
          if (!cancelled) setLogs(afterSync);
        }
      }

      if (!cancelled) setHydrated(true);
    }

    init();
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    const onOnline = () => {
      setIsOnline(true);
      trySyncPendingSprays().then(() => refreshFromSupabase());
    };
    const onOffline = () => setIsOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      cancelled = true;
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [refreshFromSupabase]);

  const persist = useCallback((next: SprayLog[]) => {
    writeStorage(KEY, next);
    setLogs(next);
  }, []);

  const addLog = useCallback(
    (input: Omit<SprayLog, "id" | "farmerId" | "synced" | "createdAt">) => {
      const log: SprayLog = {
        ...input,
        id: `local-${crypto.randomUUID()}`,
        farmerId: farmerId ?? "",
        synced: false,
        createdAt: new Date().toISOString(),
      };

      setLogs((prev) => {
        const next = [log, ...prev];
        writeStorage(KEY, next);
        return next;
      });

      queueSpraySync(log);

      if (typeof navigator !== "undefined" && navigator.onLine) {
        trySyncPendingSprays().then(() => refreshFromSupabase());
      }

      return log;
    },
    [farmerId, refreshFromSupabase]
  );

  const getLogsForField = useCallback(
    (fieldId: string, cropId?: string) => {
      return logs.filter(
        (l) => l.fieldId === fieldId && (!cropId || l.cropId === cropId)
      );
    },
    [logs]
  );

  const getLogsForCrop = useCallback(
    (cropId: string) => logs.filter((l) => l.cropId === cropId),
    [logs]
  );

  const pendingCount = logs.filter((l) => !l.synced).length;

  return {
    logs,
    hydrated,
    isOnline,
    pendingCount,
    farmerId,
    addLog,
    getLogsForField,
    getLogsForCrop,
    persist,
    refreshFromSupabase,
  };
}
