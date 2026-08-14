"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

export interface AppSettings {
  weatherAlerts: boolean;
  pestAlerts: boolean;
  fertilizerReminders: boolean;
  autoSync: boolean;
  twoFactorAuth: boolean;
  quietHoursEnabled: boolean;
  /** Off by default — no product telemetry until farmer opts in */
  productAnalytics: boolean;
  /** Larger touch targets + high contrast for field use */
  fieldMode: boolean;
}

const KEY = "agriveda-app-settings";

const DEFAULT: AppSettings = {
  weatherAlerts: true,
  pestAlerts: true,
  fertilizerReminders: true,
  autoSync: true,
  twoFactorAuth: false,
  quietHoursEnabled: false,
  productAnalytics: false,
  fieldMode: false,
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings({ ...DEFAULT, ...readStorage(KEY, DEFAULT) });
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeStorage(KEY, next);
      if (typeof document !== "undefined" && "fieldMode" in patch) {
        document.documentElement.toggleAttribute("data-field-mode", Boolean(next.fieldMode));
      }
      return next;
    });
  }, []);

  return { settings, hydrated, update };
}
