"use client";

import { useEffect, useRef } from "react";
import {
  registerFarmerPush,
  notifyWeatherAlert,
  notifySprayWindow,
  notifyFertilizerReminder,
} from "@/lib/push/farmerPush";
import { runMandiRateNotifications } from "@/lib/push/mandiRateNotify";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useSprayWindow } from "@/hooks/useSprayWindow";
import { useFarmData } from "@/hooks/useFarmData";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useMyCrops } from "@/hooks/useMyCrops";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { isCapacitorNative } from "@/lib/capacitorNav";
import type { MandiApiResponse } from "@/lib/mandi/types";

export default function PushBootstrap() {
  const { settings, hydrated } = useAppSettings();
  const { weather } = useLiveWeather();
  const { analysis } = useSprayWindow();
  const { data: farmData } = useFarmData();
  const { profile, hydrated: profileReady } = useFarmerProfile();
  const { crops: myCrops } = useMyCrops();
  const { settings: priceSettings } = usePriceAlerts();
  const sprayNotified = useRef(false);
  const rainNotified = useRef(false);
  const fertilizerNotified = useRef(false);
  const mandiNotified = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (
      settings.weatherAlerts ||
      settings.pestAlerts ||
      settings.fertilizerReminders ||
      priceSettings.masterEnabled
    ) {
      void registerFarmerPush();
    }
  }, [
    hydrated,
    settings.weatherAlerts,
    settings.pestAlerts,
    settings.fertilizerReminders,
    priceSettings.masterEnabled,
  ]);

  useEffect(() => {
    if (!isCapacitorNative()) return;
    let remove: { remove: () => Promise<void> } | undefined;
    void (async () => {
      try {
        const { LocalNotifications } = await import("@capacitor/local-notifications");
        remove = await LocalNotifications.addListener("localNotificationActionPerformed", (event) => {
          const href = (event.notification.extra as { href?: string } | undefined)?.href || "/mandi";
          if (typeof window !== "undefined") window.location.assign(href);
        });
      } catch {
        /* web */
      }
    })();
    return () => {
      void remove?.remove();
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !weather || !settings.weatherAlerts || rainNotified.current) return;
    const rain = weather.dailyForecast?.[0]?.rainChance ?? weather.hourlyForecast?.[0]?.rainChancePercent;
    if (typeof rain === "number" && rain >= 60) {
      rainNotified.current = true;
      void notifyWeatherAlert(
        "बारिश की संभावना",
        `आज ${Math.round(rain)}% बारिश — सिंचाई/स्प्रे टालें।`
      );
    }
  }, [hydrated, weather, settings.weatherAlerts]);

  useEffect(() => {
    if (!hydrated || !analysis || !settings.weatherAlerts || sprayNotified.current) return;
    if (analysis.current.status === "AVOID") {
      sprayNotified.current = true;
      void notifySprayWindow(
        "आज स्प्रे न करें",
        analysis.current.reasonHi || analysis.current.reasonEn || "मौसम अनुकूल नहीं"
      );
    }
  }, [hydrated, analysis, settings.weatherAlerts]);

  useEffect(() => {
    if (!hydrated || !settings.fertilizerReminders || fertilizerNotified.current) return;
    if (farmData?.fields?.length > 0) {
      const field = farmData.fields[0];
      const cropName = field.crop || "फसल";
      fertilizerNotified.current = true;
      void notifyFertilizerReminder(
        "खाद का समय",
        `${field.name} (${cropName}) में संतुलित पोषण व यूरिया/डीएपी का ध्यान रखें।`
      );
    }
  }, [hydrated, settings.fertilizerReminders, farmData]);

  useEffect(() => {
    if (!hydrated || !profileReady || !priceSettings.masterEnabled || mandiNotified.current) return;
    const state = profile.state.trim() || "Haryana";
    const district = profile.district.trim();
    mandiNotified.current = true;
    void (async () => {
      try {
        const params = new URLSearchParams({ state });
        if (district) params.set("district", district);
        const res = await fetch(`/api/mandi?${params.toString()}`);
        if (!res.ok) return;
        const json = (await res.json()) as MandiApiResponse;
        await runMandiRateNotifications({
          state,
          district,
          rows: json.rows || [],
          myCrops: myCrops.map((c) => c.name),
          enabled: true,
        });
      } catch {
        /* offline */
      }
    })();
  }, [hydrated, profileReady, priceSettings.masterEnabled, profile.state, profile.district, myCrops]);

  return null;
}
