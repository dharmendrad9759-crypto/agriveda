"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildSprayWindowAnalysis } from "@/lib/sprayWindow";
import {
  fetchSprayWeatherByCoords,
  fetchSprayWeatherFromSaved,
} from "@/lib/sprayWeatherApi";
import { requestUserLocation } from "@/lib/weatherApi";
import { readStorage, writeStorage } from "@/lib/storage";
import type { SprayWeatherBundle, SprayWindowAnalysis } from "@/types/spray-window";

const ALERTS_KEY = "agriveda-spray-window-alerts";
const LAST_STATUS_KEY = "agriveda-spray-window-last-status";
const REFRESH_MS = 30 * 60 * 1000;

export function useSprayWindow() {
  const [bundle, setBundle] = useState<SprayWeatherBundle | null>(null);
  const [analysis, setAnalysis] = useState<SprayWindowAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    setAlertsEnabled(readStorage(ALERTS_KEY, false));
    setHydrated(true);
  }, []);

  const applyBundle = useCallback((data: SprayWeatherBundle) => {
    setBundle(data);
    setAnalysis(buildSprayWindowAnalysis(data.current, data.hourly));
  }, []);

  const maybeNotify = useCallback(
    (nextStatus: SprayWindowAnalysis["current"]["status"]) => {
      if (!alertsEnabled || typeof window === "undefined") return;
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const prev = readStorage<SprayWindowAnalysis["current"]["status"] | null>(
        LAST_STATUS_KEY,
        null
      );

      if (prev === "AVOID" && nextStatus === "GOOD" && !notifiedRef.current) {
        new Notification("AgriVeda Spray Window", {
          body: "Conditions improved — it may be safe to spray now. Open the app to confirm.",
          icon: "/favicon.ico",
          tag: "spray-window-good",
        });
        notifiedRef.current = true;
      }

      if (nextStatus !== "GOOD") {
        notifiedRef.current = false;
      }

      writeStorage(LAST_STATUS_KEY, nextStatus);
    },
    [alertsEnabled]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const saved = await fetchSprayWeatherFromSaved();
      if (!saved) {
        setBundle(null);
        setAnalysis(null);
        return;
      }
      applyBundle(saved);
      maybeNotify(buildSprayWindowAnalysis(saved.current, saved.hourly).current.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Weather unavailable");
    } finally {
      setLoading(false);
    }
  }, [applyBundle, maybeNotify]);

  const loadWithGps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await requestUserLocation();
      const data = await fetchSprayWeatherByCoords(
        position.coords.latitude,
        position.coords.longitude
      );
      applyBundle(data);
      maybeNotify(buildSprayWindowAnalysis(data.current, data.hourly).current.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Location or weather failed");
    } finally {
      setLoading(false);
    }
  }, [applyBundle, maybeNotify]);

  const toggleAlerts = useCallback(async () => {
    if (!alertsEnabled) {
      if (typeof window === "undefined" || !("Notification" in window)) {
        setError("Notifications not supported on this device.");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Notification permission denied.");
        return;
      }
      setAlertsEnabled(true);
      writeStorage(ALERTS_KEY, true);
      if (analysis) {
        writeStorage(LAST_STATUS_KEY, analysis.current.status);
      }
    } else {
      setAlertsEnabled(false);
      writeStorage(ALERTS_KEY, false);
    }
  }, [alertsEnabled, analysis]);

  useEffect(() => {
    if (!hydrated) return;
    refresh();
  }, [hydrated, refresh]);

  useEffect(() => {
    if (!hydrated) return;
    const id = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(id);
  }, [hydrated, refresh]);

  const nextGoodHi = useMemo(() => {
    if (!bundle || !analysis?.nextGoodWindow) return null;
    const t = analysis.nextGoodWindow.time.toLocaleTimeString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `अगली अच्छी window: ${t}`;
  }, [bundle, analysis]);

  return {
    bundle,
    analysis,
    loading,
    error,
    alertsEnabled,
    hydrated,
    refresh,
    loadWithGps,
    toggleAlerts,
    nextGoodHi,
  };
}
