import type { SprayLog } from "@/types/spray-rotation";
import { readStorage, writeStorage } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";

const LOGS_KEY = "agriveda-spray-logs";

export function queueSpraySync(_log: SprayLog): void {
  /* sync handled in trySyncPendingSprays via synced flag on each log */
}

export async function trySyncPendingSprays(): Promise<number> {
  if (typeof window === "undefined" || !navigator.onLine) return 0;
  if (!isSupabaseConfigured()) return 0;

  const logs = readStorage<SprayLog[]>(LOGS_KEY, []);
  let synced = 0;
  const updated: SprayLog[] = [];

  for (const log of logs) {
    if (log.synced) {
      updated.push(log);
      continue;
    }

    try {
      const res = await fetch("/api/spray-logs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: log.id,
          cropId: log.cropId,
          fieldId: log.fieldId,
          productId: log.productId,
          sprayDate: log.sprayDate,
          doseUsed: log.doseUsed,
          growthStageAtSpray: log.growthStageAtSpray,
          pestId: log.pestId,
          diseaseId: log.diseaseId,
          createdAt: log.createdAt,
        }),
      });

      if (res.status === 401) {
        updated.push(log);
        continue;
      }

      if (!res.ok) {
        updated.push(log);
        continue;
      }

      const body = (await res.json()) as { log?: SprayLog };
      if (body.log) {
        updated.push({
          ...body.log,
          pestId: log.pestId,
          diseaseId: log.diseaseId,
          synced: true,
        });
        synced++;
      } else {
        updated.push({ ...log, synced: true });
        synced++;
      }
    } catch {
      updated.push(log);
    }
  }

  if (synced > 0 || updated.length !== logs.length) {
    writeStorage(LOGS_KEY, updated);
  }

  return synced;
}
