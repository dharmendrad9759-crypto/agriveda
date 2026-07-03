"use client";

import { useCallback, useEffect, useState } from "react";
import type { SprayLog } from "@/types/spray-rotation";
import { readStorage, writeStorage } from "@/lib/storage";
import { queueSpraySync, trySyncPendingSprays } from "@/lib/spraySync";

const KEY = "agriveda-spray-logs";
const FARMER_ID = "local-farmer";

export function useSprayLogs() {
  const [logs, setLogs] = useState<SprayLog[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setLogs(readStorage<SprayLog[]>(KEY, []));
    setHydrated(true);
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    const onOnline = () => {
      setIsOnline(true);
      trySyncPendingSprays();
    };
    const onOffline = () => setIsOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const persist = useCallback((next: SprayLog[]) => {
    writeStorage(KEY, next);
    setLogs(next);
  }, []);

  const addLog = useCallback(
    (input: Omit<SprayLog, "id" | "farmerId" | "synced" | "createdAt">) => {
      const log: SprayLog = {
        ...input,
        id: `spray-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        farmerId: FARMER_ID,
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
        trySyncPendingSprays();
      }
      return log;
    },
    []
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
    addLog,
    getLogsForField,
    getLogsForCrop,
    persist,
  };
}
