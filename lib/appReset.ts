const APP_KEYS = [
  "agriveda-farmer-profile",
  "agriveda-farm-data",
  "agriveda-my-crops",
  "agriveda-ai-history",
  "agriveda-user-queries",
  "agriveda-weather-location",
  "agriveda-spray-logs",
  "agriveda-spray-fields",
  "agriveda-spray-window-alerts",
  "agriveda-spray-window-last-status",
  "agriveda-spray-locale",
  "agriveda-outbreak-alerts",
  "agriveda-outbreak-seen-clusters",
  "agriveda-outbreak-cache",
  "agriveda-outbreak-pending",
  "agriveda-translate-lang",
  "agriveda-analytics-events",
  "agriveda-app-settings",
  "agriveda-price-alerts",
  "agriveda-ai-doctor-expert-referral",
  "agriveda-ai-doctor-expert-referral-photo",
  "agriveda-device-id",
  "agriveda-intro-carousel-v2",
  "agriveda-open-splash-v2",
];

const PREFIX_WIPE = [
  "agriveda-threat-photo-",
  "agriveda-ai-doctor-",
];

/** Clear app data. Full wipe (account delete) also drops device id + analytics. */
export function clearAppData(options?: {
  keepTheme?: boolean;
  keepLocale?: boolean;
  /** Account deletion — remove device id and almost all agriveda-* keys */
  fullWipe?: boolean;
}) {
  if (typeof window === "undefined") return;

  const keepTheme = options?.keepTheme ?? true;
  const keepLocale = options?.keepLocale ?? true;
  const fullWipe = options?.fullWipe ?? false;
  const theme = keepTheme ? localStorage.getItem("agriveda-theme") : null;
  const locale = keepLocale ? localStorage.getItem("agriveda-app-locale") : null;

  for (const key of APP_KEYS) {
    if (!fullWipe && key === "agriveda-device-id") continue;
    localStorage.removeItem(key);
  }

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (PREFIX_WIPE.some((p) => key.startsWith(p))) {
      localStorage.removeItem(key);
      continue;
    }
    if (fullWipe && key.startsWith("agriveda-") && key !== "agriveda-theme" && key !== "agriveda-app-locale") {
      localStorage.removeItem(key);
    }
  }

  try {
    sessionStorage.removeItem("agriveda-open-splash-v2");
  } catch {
    /* ignore */
  }

  if (theme) localStorage.setItem("agriveda-theme", theme);
  if (locale) localStorage.setItem("agriveda-app-locale", locale);
}

/** Full reset including onboarding — reloads the app. */
export function resetAppAndReload() {
  clearAppData({ keepTheme: true, keepLocale: true, fullWipe: true });
  window.location.href = "/";
}

/** Logout: clear only the session cookie — keep farm/profile data on device. */
export async function logoutAndReload() {
  try {
    await fetch("/api/auth/session", { method: "DELETE", credentials: "include" });
  } catch {
    /* offline */
  }
  window.location.href = "/";
}

/** Play Store account deletion: server wipe + full local clear. */
export async function deleteAccountAndReload(): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/account", { method: "DELETE", credentials: "include" });
    if (res.status === 401) {
      // No server session — wipe device data (still valid for Play “delete my data”)
      clearAppData({ keepTheme: true, keepLocale: true, fullWipe: true });
      window.location.href = "/";
      return { ok: true };
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: (body as { error?: string }).error || "हटाने में समस्या" };
    }
  } catch {
    return { ok: false, error: "नेटवर्क त्रुटि — बाद में कोशिश करें" };
  }
  clearAppData({ keepTheme: true, keepLocale: true, fullWipe: true });
  window.location.href = "/";
  return { ok: true };
}
