import type { SprayLog } from "@/types/spray-rotation";
import { readStorage, writeStorage } from "@/lib/storage";
import { getDeviceId } from "@/lib/deviceId";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { insertSprayLogToSupabase } from "@/lib/supabaseSprayLogs";
import { isSupabaseConfigured } from "@/lib/supabase";

const LOGS_KEY = "agriveda-spray-logs";

export function queueSpraySync(_log: SprayLog): void {
  /* sync handled in trySyncPendingSprays via synced flag on each log */
}

export async function trySyncPendingSprays(): Promise<number> {
  if (typeof window === "undefined" || !navigator.onLine) return 0;
  if (!isSupabaseConfigured()) return 0;

  const deviceId = getDeviceId();
  const farmerId = await ensureFarmerRecord(deviceId);
  if (!farmerId) return 0;

  const logs = readStorage<SprayLog[]>(LOGS_KEY, []);
  let synced = 0;
  const updated: SprayLog[] = [];

  for (const log of logs) {
    if (log.synced) {
      updated.push(log);
      continue;
    }

    try {
      const saved = await insertSprayLogToSupabase(farmerId, log);
      if (saved) {
        updated.push({
          ...saved,
          pestId: log.pestId,
          diseaseId: log.diseaseId,
          synced: true,
        });
        synced++;
      } else {
        updated.push(log);
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
