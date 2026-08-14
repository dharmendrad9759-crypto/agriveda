"use client";

import { useEffect, useRef } from "react";
import { isCapacitorNative } from "@/lib/capacitorNav";
import { registerFarmerPush, notifyWeatherAlert, notifySprayWindow } from "@/lib/push/farmerPush";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useSprayWindow } from "@/hooks/useSprayWindow";

export default function PushBootstrap() {
  const { settings, hydrated } = useAppSettings();
  const { weather } = useLiveWeather();
  const { analysis } = useSprayWindow();
  const sprayNotified = useRef(false);
  const rainNotified = useRef(false);

  useEffect(() => {
    if (!hydrated || !isCapacitorNative()) return;
    if (settings.weatherAlerts || settings.pestAlerts) {
      void registerFarmerPush();
    }
  }, [hydrated, settings.weatherAlerts, settings.pestAlerts]);

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

  return null;
}
