"use client";

import { useCallback, useEffect, useState } from "react";
import { PRICE_ALERTS } from "@/data/mock/mandi";
import { readStorage, writeStorage } from "@/lib/storage";
import type { PriceAlert, PriceAlertSettings } from "@/lib/mandi/types";

const KEY = "agriveda-price-alerts";

function defaultSettings(): PriceAlertSettings {
  return {
    masterEnabled: true,
    alerts: PRICE_ALERTS.map((a, i) => ({
      id: `alert-${i + 1}`,
      crop: a.crop,
      target: a.target,
      direction: "above" as const,
      enabled: a.enabled,
      createdAt: new Date().toISOString(),
    })),
  };
}

function loadSettings(): PriceAlertSettings {
  if (typeof window === "undefined") return defaultSettings();
  const stored = readStorage<Partial<PriceAlertSettings> | null>(KEY, null);
  if (!stored?.alerts?.length) return defaultSettings();
  return {
    masterEnabled: stored.masterEnabled ?? true,
    alerts: stored.alerts,
  };
}

export function usePriceAlerts() {
  const [settings, setSettings] = useState<PriceAlertSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  const setMasterEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, masterEnabled: enabled };
      writeStorage(KEY, next);
      return next;
    });
  }, []);

  const addAlert = useCallback(
    (input: { crop: string; target: number; direction?: "above" | "below" }) => {
      const alert: PriceAlert = {
        id: `alert-${Date.now()}`,
        crop: input.crop.trim(),
        target: input.target,
        direction: input.direction ?? "above",
        enabled: true,
        createdAt: new Date().toISOString(),
      };
      setSettings((prev) => {
        const next = { ...prev, alerts: [alert, ...prev.alerts] };
        writeStorage(KEY, next);
        return next;
      });
    },
    []
  );

  const toggleAlert = useCallback((id: string) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        alerts: prev.alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
      };
      writeStorage(KEY, next);
      return next;
    });
  }, []);

  const removeAlert = useCallback((id: string) => {
    setSettings((prev) => {
      const next = { ...prev, alerts: prev.alerts.filter((a) => a.id !== id) };
      writeStorage(KEY, next);
      return next;
    });
  }, []);

  const activeCount = settings.alerts.filter((a) => a.enabled).length;

  return {
    settings,
    hydrated,
    activeCount,
    setMasterEnabled,
    addAlert,
    toggleAlert,
    removeAlert,
  };
}
