"use client";

import { useCallback, useEffect, useState } from "react";
import type { OutbreakCluster, OutbreakListSummary, PublicOutbreakReport } from "@/types/outbreak";
import { fetchNearbyOutbreaks } from "@/lib/outbreakApi";
import { trySyncPendingOutbreaks } from "@/lib/outbreakSync";
import { getSavedWeatherLocation } from "@/lib/sprayWeatherApi";
import { requestUserLocation } from "@/lib/weatherApi";
import { readStorage, writeStorage } from "@/lib/storage";

const ALERTS_KEY = "agriveda-outbreak-alerts";
const SEEN_CLUSTERS_KEY = "agriveda-outbreak-seen-clusters";

export function useOutbreakRadar() {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [reports, setReports] = useState<PublicOutbreakReport[]>([]);
  const [clusters, setClusters] = useState<OutbreakCluster[]>([]);
  const [summaries, setSummaries] = useState<OutbreakListSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAlertsEnabled(readStorage(ALERTS_KEY, false));
    setHydrated(true);
  }, []);

  const notifyNewClusters = useCallback((newClusters: OutbreakCluster[]) => {
    if (!alertsEnabled || typeof window === "undefined") return;
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const seen = readStorage<string[]>(SEEN_CLUSTERS_KEY, []);
    const seenSet = new Set(seen);

    for (const cluster of newClusters) {
      const key = `${cluster.cropId}:${cluster.threatType}:${cluster.pestOrDiseaseId}`;
      if (seenSet.has(key)) continue;

      new Notification("⚠️ AgriVeda Outbreak Alert", {
        body: `${cluster.threatName} outbreak reported nearby — check your ${cluster.cropName} fields. Tap for advisory.`,
        icon: "/favicon.ico",
        tag: `outbreak-${key}`,
      });
      seenSet.add(key);
    }

    writeStorage(SEEN_CLUSTERS_KEY, [...seenSet]);
  }, [alertsEnabled]);

  const loadNearby = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    setLat(latitude);
    setLon(longitude);
    try {
      const data = await fetchNearbyOutbreaks(latitude, longitude);
      setReports(data.reports);
      setClusters(data.clusters);
      setSummaries(data.summaries);
      setFromCache(data.fromCache);
      notifyNewClusters(data.clusters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, [notifyNewClusters]);

  const initLocation = useCallback(async () => {
    const saved = getSavedWeatherLocation();
    if (saved?.type === "gps") {
      await loadNearby(saved.lat, saved.lon);
      return;
    }
    setError("पहले मौसम या GPS से अपनी लोकेशन सेट करें");
  }, [loadNearby]);

  const requestGps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await requestUserLocation();
      await loadNearby(pos.coords.latitude, pos.coords.longitude);
    } catch (err) {
      setError(err instanceof Error ? err.message : "GPS unavailable");
    } finally {
      setLoading(false);
    }
  }, [loadNearby]);

  const toggleAlerts = useCallback(async () => {
    if (!alertsEnabled) {
      if (!("Notification" in window)) {
        setError("Notifications not supported");
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setError("Notification permission denied");
        return;
      }
      setAlertsEnabled(true);
      writeStorage(ALERTS_KEY, true);
    } else {
      setAlertsEnabled(false);
      writeStorage(ALERTS_KEY, false);
    }
  }, [alertsEnabled]);

  useEffect(() => {
    if (!hydrated) return;
    initLocation();

    const onOnline = () => {
      trySyncPendingOutbreaks().then(() => {
        if (lat != null && lon != null) loadNearby(lat, lon);
      });
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [hydrated, initLocation, lat, lon, loadNearby]);

  return {
    lat,
    lon,
    reports,
    clusters,
    summaries,
    loading,
    error,
    fromCache,
    alertsEnabled,
    hydrated,
    loadNearby,
    requestGps,
    toggleAlerts,
    refresh: () => (lat != null && lon != null ? loadNearby(lat, lon) : requestGps()),
  };
}
