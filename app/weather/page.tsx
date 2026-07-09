"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Search, Loader2, CloudSun, RefreshCw } from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import WeatherRedesign from "@/components/weather/WeatherRedesign";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  requestUserLocation,
  geolocationErrorMessage,
  type WeatherViewModel,
} from "@/lib/weatherApi";
import { getSavedWeatherLocation } from "@/lib/sprayWeatherApi";
import { shareText } from "@/lib/shareText";
import { useToast } from "@/components/ui/Toast";
import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";

export default function WeatherPage() {
  const { showToast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState("");
  const [locationMode, setLocationMode] = useState<"gps" | "manual" | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const autoLoaded = useRef(false);

  const loadWeather = useCallback(async (loader: () => Promise<WeatherViewModel>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loader();
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "मौसम लोड नहीं हो सका।");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const useCurrentLocation = useCallback(async () => {
    setLocLoading(true);
    setError(null);
    try {
      const position = await requestUserLocation();
      setLocationMode("gps");
      await loadWeather(() => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude));
    } catch (err) {
      setError(geolocationErrorMessage(err));
    } finally {
      setLocLoading(false);
    }
  }, [loadWeather]);

  const searchManualCity = useCallback(async () => {
    const city = manualCity.trim();
    if (!city) {
      setError("कृपया शहर का नाम लिखें (जैसे Delhi, Indore)");
      return;
    }
    setLocationMode("manual");
    await loadWeather(() => fetchWeatherByCity(city));
  }, [manualCity, loadWeather]);

  const refreshWeather = useCallback(async () => {
    const saved = getSavedWeatherLocation();
    if (saved?.type === "gps") {
      setLocationMode("gps");
      await loadWeather(() => fetchWeatherByCoords(saved.lat, saved.lon));
      return;
    }
    if (saved?.type === "city") {
      setLocationMode("manual");
      setManualCity(saved.city);
      await loadWeather(() => fetchWeatherByCity(saved.city));
    }
  }, [loadWeather]);

  useEffect(() => {
    if (autoLoaded.current) return;
    const saved = getSavedWeatherLocation();
    if (!saved) return;
    autoLoaded.current = true;
    if (saved.type === "gps") {
      setLocationMode("gps");
      loadWeather(() => fetchWeatherByCoords(saved.lat, saved.lon));
    } else {
      setLocationMode("manual");
      setManualCity(saved.city);
      loadWeather(() => fetchWeatherByCity(saved.city));
    }
  }, [loadWeather]);

  const shareWeather = async () => {
    if (!weatherData) return;
    const text = [
      `Agriveda Weather — ${weatherData.location}`,
      `${weatherData.temp} · ${weatherData.condition}`,
      weatherData.rainfallAlert,
    ].join("\n");
    const ok = await shareText("Agriveda Weather", text);
    showToast(ok ? "मौसम साझा हो गया ✓" : "Share नहीं हो सका", ok ? "success" : "error");
  };

  return (
    <AppShell
      title="Weather"
      subtitle="Live weather updates for smarter farming decisions"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Weather" }]}
    >
      <DarkCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <AppLink href="/weather/spray-advisory" className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-1.5 text-[10px] font-semibold text-indigo-400">
              Spray Advisory
            </AppLink>
            <AppLink href="/pest-solver" className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-1.5 text-[10px] font-semibold text-fuchsia-400">
              Symptom ID
            </AppLink>
          </div>
          {lastUpdated && (
            <p className="text-[10px] text-[var(--av-text-muted)]">
              Last updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locLoading || loading}
            className={`inline-flex gap-1.5 disabled:opacity-60 ${AV.btnPrimarySm}`}
          >
            {locLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            Use My Location
          </button>
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchManualCity()}
                placeholder="Search city — Indore, Delhi..."
                className="w-full rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-10 pr-3 text-sm text-[var(--av-text-primary)] outline-none focus:border-[#10b981]"
              />
            </div>
            <button
              type="button"
              onClick={searchManualCity}
              disabled={loading}
              className={`inline-flex gap-1.5 ${AV.btnSecondarySm}`}
            >
              {loading && locationMode === "manual" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </button>
          </div>
        </div>

        {locationMode && weatherData && (
          <p className="mt-2 text-[10px] font-medium text-[var(--av-accent)]">
            📍 {locationMode === "gps" ? "GPS location" : "Manual city"} active
          </p>
        )}
      </DarkCard>

      {!loading && !weatherData && !error && (
        <DarkCard className="mt-4 text-center" delay={1}>
          <CloudSun className="mx-auto h-12 w-12 text-[var(--av-accent)]" />
          <p className="mt-3 text-base font-bold text-[var(--av-text-primary)]">Select your location</p>
          <p className="mt-1 text-sm text-[var(--av-text-muted)]">Use GPS or search a city to load the weather dashboard</p>
        </DarkCard>
      )}

      {loading && (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--av-accent)]" />
          <p className="mt-3 text-sm text-[var(--av-text-muted)]">Loading weather...</p>
        </div>
      )}

      {error && !loading && (
        <DarkCard className="mt-4 border-red-500/30 bg-red-500/10 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button type="button" onClick={useCurrentLocation} className="mt-2 text-xs font-bold text-[var(--av-accent)]">
            Retry GPS
          </button>
        </DarkCard>
      )}

      {!loading && weatherData && (
        <div className="mt-4">
          <WeatherRedesign
            weather={weatherData}
            lastUpdated={lastUpdated}
            onRefresh={refreshWeather}
            onShare={shareWeather}
            onEnableLocation={useCurrentLocation}
          />
        </div>
      )}
    </AppShell>
  );
}
