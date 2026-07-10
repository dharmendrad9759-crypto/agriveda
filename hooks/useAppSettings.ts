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
}

const KEY = "agriveda-app-settings";

const DEFAULT: AppSettings = {
  weatherAlerts: true,
  pestAlerts: true,
  fertilizerReminders: true,
  autoSync: true,
  twoFactorAuth: false,
  quietHoursEnabled: false,
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
      return next;
    });
  }, []);

  return { settings, hydrated, update };
}
