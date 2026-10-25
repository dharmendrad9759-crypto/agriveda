"use client";

import { useEffect, useRef } from "react";
import { registerFarmerPush, notifyWeatherAlert, notifySprayWindow, notifyFertilizerReminder } from "@/lib/push/farmerPush";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useLiveWeather } from "@/hooks/useLiveWeather";
import { useSprayWindow } from "@/hooks/useSprayWindow";
import { useFarmData } from "@/hooks/useFarmData";

export default function PushBootstrap() {
  const { settings, hydrated } = useAppSettings();
  const { weather } = useLiveWeather();
  const { analysis } = useSprayWindow();
  const { data: farmData } = useFarmData();
  const sprayNotified = useRef(false);
  const rainNotified = useRef(false);
  const fertilizerNotified = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (settings.weatherAlerts || settings.pestAlerts || settings.fertilizerReminders) {
      void registerFarmerPush();
    }
  }, [hydrated, settings.weatherAlerts, settings.pestAlerts, settings.fertilizerReminders]);

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

  return null;
}
