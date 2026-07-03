import type { SprayLog } from "@/types/spray-rotation";
import { readStorage, writeStorage } from "@/lib/storage";

const LOGS_KEY = "agriveda-spray-logs";
const SYNC_QUEUE_KEY = "agriveda-spray-sync-queue";

export function queueSpraySync(log: SprayLog): void {
  const queue = readStorage<string[]>(SYNC_QUEUE_KEY, []);
  if (!queue.includes(log.id)) {
    writeStorage(SYNC_QUEUE_KEY, [...queue, log.id]);
  }
}

export async function trySyncPendingSprays(): Promise<number> {
  if (typeof window === "undefined" || !navigator.onLine) return 0;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
      if (res.ok) {
        updated.push({ ...log, synced: true });
        synced++;
      } else {
        updated.push(log);
      }
    } catch {
      updated.push(log);
    }
  }

  if (synced > 0) {
    writeStorage(LOGS_KEY, updated);
  }
  writeStorage(
    SYNC_QUEUE_KEY,
    updated.filter((l) => !l.synced).map((l) => l.id)
  );
  return synced;
}
