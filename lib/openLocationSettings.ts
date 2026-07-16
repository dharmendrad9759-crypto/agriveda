/** Open device Location / App permission settings (Android Capacitor + web fallback). */

async function openAndroidIntent(intentUrl: string): Promise<boolean> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
      return false;
    }
    // Capacitor WebView resolves Android intents via location navigation
    window.location.href = intentUrl;
    return true;
  } catch {
    return false;
  }
}

export async function openDeviceLocationSettings(): Promise<void> {
  if (typeof window === "undefined") return;

  const opened = await openAndroidIntent(
    "intent:#Intent;action=android.settings.LOCATION_SOURCE_SETTINGS;end"
  );
  if (opened) return;

  window.alert(
    "Phone Settings → Location (या Apps → Agriveda → Permissions → Location) ON करें, फिर ऐप वापस खोलें।"
  );
}

/** Open Agriveda app permission details (when permission permanently denied). */
export async function openAppLocationPermissionSettings(): Promise<void> {
  if (typeof window === "undefined") return;

  const opened = await openAndroidIntent(
    "intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;data=package:com.agriveda.app;end"
  );
  if (opened) return;

  await openDeviceLocationSettings();
}
