"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  type WeatherViewModel,
} from "@/lib/weatherApi";
import { getSavedWeatherLocation, saveWeatherLocation } from "@/lib/sprayWeatherApi";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmData } from "@/hooks/useFarmData";
import { useActiveField } from "@/hooks/useActiveField";

function profileCity(district: string, state: string): string | null {
  const parts = [district, state].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export function useLiveWeather() {
  const { profile, hydrated: profileReady } = useFarmerProfile();
  const farm = useFarmData();
  const { activeField } = useActiveField(farm.data.fields, farm.hydrated);
  const [weather, setWeather] = useState<WeatherViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fieldLat = activeField?.location?.lat;
  const fieldLng = activeField?.location?.lng;

  const load = useCallback(async () => {
    if (!profileReady || !farm.hydrated) return;
    setLoading(true);
    setError(null);
    try {
      if (typeof fieldLat === "number" && typeof fieldLng === "number") {
        saveWeatherLocation({ type: "gps", lat: fieldLat, lon: fieldLng });
        setWeather(await fetchWeatherByCoords(fieldLat, fieldLng));
        return;
      }
      const city = profileCity(profile.district, profile.state);
      if (city) {
        saveWeatherLocation({ type: "city", city });
        setWeather(await fetchWeatherByCity(city));
        return;
      }
      const saved = getSavedWeatherLocation();
      if (saved?.type === "gps") {
        setWeather(await fetchWeatherByCoords(saved.lat, saved.lon));
        return;
      }
      if (saved?.type === "city") {
        setWeather(await fetchWeatherByCity(saved.city));
        return;
      }
      setWeather(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Weather load failed");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [profileReady, farm.hydrated, fieldLat, fieldLng, profile.district, profile.state]);

  useEffect(() => {
    void load();
  }, [load]);

  return { weather, loading, error, refresh: load };
}
