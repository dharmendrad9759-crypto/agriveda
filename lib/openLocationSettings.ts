/** Open device Location / App permission settings (Android Capacitor + web fallback). */

async function openAndroidIntent(intentUrl: string): Promise<boolean> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") {
      return false;
    }
    window.location.href = intentUrl;
    return true;
  } catch {
    return false;
  }
}

/** GPS / Location master switch (system Location settings). */
export async function openDeviceLocationSettings(): Promise<void> {
  if (typeof window === "undefined") return;

  const opened = await openAndroidIntent(
    "intent:#Intent;action=android.settings.LOCATION_SOURCE_SETTINGS;end"
  );
  if (opened) return;

  window.alert(
    "फ़ोन Settings → Location ON करें, फिर Agriveda ऐप वापस खोलें।"
  );
}

/**
 * App-specific Location permission screen.
 * Prefer this when permission was denied — opens Agriveda app info → Permissions.
 */
export async function openAppLocationPermissionSettings(): Promise<void> {
  if (typeof window === "undefined") return;

  // Direct app details — farmer taps Permissions → Location
  const appDetails = await openAndroidIntent(
    "intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;data=package:com.agriveda.app;end"
  );
  if (appDetails) return;

  // Some OEMs support app permission controller deep link
  const perms = await openAndroidIntent(
    "intent:#Intent;action=android.settings.APP_PERMISSION_SETTINGS;end"
  );
  if (perms) return;

  await openDeviceLocationSettings();
}

/** Best action after denial: open location permission path immediately. */
export async function openBestLocationSettings(): Promise<void> {
  await openAppLocationPermissionSettings();
}
