import type { SubmitOutbreakInput } from "@/types/outbreak";
import { readStorage, writeStorage } from "@/lib/storage";
import { getDeviceId } from "@/lib/deviceId";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { insertOutbreakReportToSupabase } from "@/lib/supabaseOutbreak";
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

  const deviceId = getDeviceId();
  const farmerId = await ensureFarmerRecord(deviceId);
  if (!farmerId) return 0;

  const remaining: SubmitOutbreakInput[] = [];
  let synced = 0;

  for (const item of pending) {
    const saved = await insertOutbreakReportToSupabase({
      farmerId,
      cropId: item.cropId,
      threatType: item.threatType,
      pestOrDiseaseId: item.pestOrDiseaseId,
      photoUrl: item.photoUrl,
      latitude: item.latitude,
      longitude: item.longitude,
      severity: item.severity,
    });
    if (saved) synced++;
    else remaining.push(item);
  }

  writeStorage(PENDING_KEY, remaining);
  return synced;
}
