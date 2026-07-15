"use client";

import { useCallback, useEffect, useState } from "react";
import type { SprayLog } from "@/types/spray-rotation";
import { readStorage, writeStorage } from "@/lib/storage";
import { queueSpraySync, trySyncPendingSprays } from "@/lib/spraySync";
import { mergeSprayLogs } from "@/lib/supabaseSprayLogs";
import { isSupabaseConfigured } from "@/lib/supabase";
import { randomId } from "@/lib/randomId";

const KEY = "agriveda-spray-logs";

export function useSprayLogs() {
  const [logs, setLogs] = useState<SprayLog[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [farmerId, setFarmerId] = useState<string | null>(null);

  const refreshFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) return;

    const local = readStorage<SprayLog[]>(KEY, []);
    try {
      const res = await fetch("/api/spray-logs", { credentials: "include" });
      if (!res.ok) return;
      const body = (await res.json()) as { logs?: SprayLog[]; farmerId?: string };
      if (body.farmerId) setFarmerId(body.farmerId);
      const remote = body.logs ?? [];
      const merged = mergeSprayLogs(local, remote);
      writeStorage(KEY, merged);
      setLogs(merged);
    } catch {
      /* keep local */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const local = readStorage<SprayLog[]>(KEY, []);
      if (!cancelled) setLogs(local);

      if (isSupabaseConfigured()) {
        try {
          const res = await fetch("/api/spray-logs", { credentials: "include" });
          if (res.ok) {
            const body = (await res.json()) as { logs?: SprayLog[]; farmerId?: string };
            if (!cancelled && body.farmerId) setFarmerId(body.farmerId);
            const merged = mergeSprayLogs(local, body.logs ?? []);
            writeStorage(KEY, merged);
            if (!cancelled) setLogs(merged);
          }
          await trySyncPendingSprays();
          const afterSync = readStorage<SprayLog[]>(KEY, []);
          if (!cancelled) setLogs(afterSync);
        } catch {
          /* local only */
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
        id: randomId("local-"),
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
