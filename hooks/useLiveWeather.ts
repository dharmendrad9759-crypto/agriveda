"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  type WeatherViewModel,
} from "@/lib/weatherApi";
import { getSavedWeatherLocation } from "@/lib/sprayWeatherApi";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";

function profileCity(district: string, state: string): string {
  const parts = [district, state].filter(Boolean);
  return parts.length ? parts.join(", ") : "Sehore, Madhya Pradesh";
}

export function useLiveWeather() {
  const { profile } = useFarmerProfile();
  const [weather, setWeather] = useState<WeatherViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const saved = getSavedWeatherLocation();
      if (saved?.type === "gps") {
        setWeather(await fetchWeatherByCoords(saved.lat, saved.lon));
        return;
      }
      if (saved?.type === "city") {
        setWeather(await fetchWeatherByCity(saved.city));
        return;
      }
      setWeather(await fetchWeatherByCity(profileCity(profile.district, profile.state)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Weather load failed");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [profile.district, profile.state]);

  useEffect(() => {
    void load();
  }, [load]);

  return { weather, loading, error, refresh: load };
}
