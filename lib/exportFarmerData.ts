import { APP_VERSION } from "@/lib/appMeta";
import { clearAnalyticsBuffer, getAnalyticsBuffer } from "@/lib/analytics";

const EXPORT_KEYS = [
  "agriveda-farmer-profile",
  "agriveda-farm-data",
  "agriveda-my-crops",
  "agriveda-ai-history",
  "agriveda-user-queries",
  "agriveda-spray-logs",
  "agriveda-spray-fields",
  "agriveda-weather-location",
  "agriveda-app-settings",
  "agriveda-price-alerts",
  "agriveda-outbreak-alerts",
];

/**
 * Download a JSON file of data stored on this device.
 * Does not include session cookies or OTP secrets.
 */
export function downloadLocalDataExport(): { ok: true } | { ok: false; error: string } {
  if (typeof window === "undefined") {
    return { ok: false, error: "Only on device" };
  }

  try {
    const local: Record<string, unknown> = {};
    for (const key of EXPORT_KEYS) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        local[key] = JSON.parse(raw);
      } catch {
        local[key] = raw;
      }
    }

    const payload = {
      app: "Agriveda",
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      note: "This file is only what was on your phone/browser. Server query photos (if any) are deleted when you delete your account.",
      localStorage: local,
      analyticsBufferLocalOnly: getAnalyticsBuffer(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agriveda-my-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return { ok: true };
  } catch {
    return { ok: false, error: "Export fail" };
  }
}

export function clearLocalAnalyticsOnly() {
  clearAnalyticsBuffer();
}
