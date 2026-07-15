import type { SubmitOutbreakInput } from "@/types/outbreak";
import { readStorage, writeStorage } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";

const PENDING_KEY = "agriveda-outbreak-pending";

export function getPendingOutbreakReports(): SubmitOutbreakInput[] {
  return readStorage<SubmitOutbreakInput[]>(PENDING_KEY, []);
}

export function queueOutbreakReport(input: SubmitOutbreakInput): void {
  const pending = getPendingOutbreakReports();
  writeStorage(PENDING_KEY, [...pending, input]);
}

export async function trySyncPendingOutbreaks(): Promise<number> {
  if (typeof window === "undefined" || !navigator.onLine) return 0;
  if (!isSupabaseConfigured()) return 0;

  const pending = getPendingOutbreakReports();
  if (pending.length === 0) return 0;

  const remaining: SubmitOutbreakInput[] = [];
  let synced = 0;

  for (const item of pending) {
    try {
      const res = await fetch("/api/outbreaks", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropId: item.cropId,
          threatType: item.threatType,
          pestOrDiseaseId: item.pestOrDiseaseId,
          photoUrl: item.photoUrl,
          latitude: item.latitude,
          longitude: item.longitude,
          severity: item.severity,
        }),
      });
      if (res.ok) synced++;
      else remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }

  writeStorage(PENDING_KEY, remaining);
  return synced;
}
