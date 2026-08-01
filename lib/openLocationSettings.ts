/** Open device Location / App permission settings (Android Capacitor + web fallback). */

type SettingsTarget = "appDetails" | "locationSource";

declare global {
  interface Window {
    AgrivedaAndroid?: {
      openAppDetails?: () => void;
      openLocationSource?: () => void;
    };
  }
}

const MANUAL_STEPS =
  "फ़ोन में खुद खोलें:\n\n" +
  "Settings → Location → ON\n" +
  "और\n" +
  "Settings → Apps → Agriveda → Permissions → Location → Allow\n\n" +
  "फिर ऐप में वापस आकर «फिर कोशिश» दबाएँ।";

/** Direct JS interface injected by MainActivity (most reliable on remote WebView). */
function openViaJsBridge(target: SettingsTarget): boolean {
  try {
    const bridge = typeof window !== "undefined" ? window.AgrivedaAndroid : undefined;
    if (!bridge) return false;
    if (target === "appDetails" && typeof bridge.openAppDetails === "function") {
      bridge.openAppDetails();
      return true;
    }
    if (target === "locationSource" && typeof bridge.openLocationSource === "function") {
      bridge.openLocationSource();
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

async function openViaCapacitorPlugin(target: SettingsTarget): Promise<boolean> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return false;
    if (!Capacitor.isPluginAvailable("AgrivedaSettings")) return false;
    const { AgrivedaSettings } = await import("@/lib/agrivedaSettings");
    if (target === "appDetails") await AgrivedaSettings.openAppDetails();
    else await AgrivedaSettings.openLocationSource();
    return true;
  } catch {
    return false;
  }
}

async function openSettings(target: SettingsTarget): Promise<boolean> {
  // 1) JS bridge (works after new APK)
  if (openViaJsBridge(target)) return true;
  // 2) Capacitor plugin (same APK)
  if (await openViaCapacitorPlugin(target)) return true;
  return false;
}

/** GPS / Location master switch. */
export async function openDeviceLocationSettings(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const ok = await openSettings("locationSource");
  if (ok) return true;
  window.alert(MANUAL_STEPS);
  return false;
}

/** Agriveda app info → Permissions → Location. */
export async function openAppLocationPermissionSettings(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const ok = await openSettings("appDetails");
  if (ok) return true;
  // Fallback: try GPS settings screen
  if (await openSettings("locationSource")) return true;
  window.alert(MANUAL_STEPS);
  return false;
}

export async function openBestLocationSettings(): Promise<boolean> {
  return openAppLocationPermissionSettings();
}

/** True when native settings opener is available (new APK). */
export function canOpenNativeLocationSettings(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.AgrivedaAndroid?.openAppDetails || window.AgrivedaAndroid?.openLocationSource) {
      return true;
    }
  } catch {
    /* ignore */
  }
  try {
    const w = window as Window & {
      Capacitor?: { isPluginAvailable?: (name: string) => boolean; isNativePlatform?: () => boolean };
    };
    if (w.Capacitor?.isNativePlatform?.() && w.Capacitor.isPluginAvailable?.("AgrivedaSettings")) {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
