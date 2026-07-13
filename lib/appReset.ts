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
];

/** Clear all app data except theme and language preferences. */
export function clearAppData(options?: { keepTheme?: boolean; keepLocale?: boolean }) {
  if (typeof window === "undefined") return;

  const keepTheme = options?.keepTheme ?? true;
  const keepLocale = options?.keepLocale ?? true;
  const theme = keepTheme ? localStorage.getItem("agriveda-theme") : null;
  const locale = keepLocale ? localStorage.getItem("agriveda-app-locale") : null;

  for (const key of APP_KEYS) {
    localStorage.removeItem(key);
  }

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith("agriveda-threat-photo-")) {
      localStorage.removeItem(key);
    }
  }

  if (theme) localStorage.setItem("agriveda-theme", theme);
  if (locale) localStorage.setItem("agriveda-app-locale", locale);
}

/** Full reset including onboarding — reloads the app. */
export function resetAppAndReload() {
  clearAppData({ keepTheme: true, keepLocale: true });
  window.location.href = "/";
}
