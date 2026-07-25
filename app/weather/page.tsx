"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Search, Loader2, CloudSun } from "lucide-react";
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
    autoLoaded.current = true;
    const saved = getSavedWeatherLocation();
    if (saved?.type === "gps") {
      setLocationMode("gps");
      loadWeather(() => fetchWeatherByCoords(saved.lat, saved.lon));
      return;
    }
    if (saved?.type === "city") {
      setLocationMode("manual");
      setManualCity(saved.city);
      loadWeather(() => fetchWeatherByCity(saved.city));
      return;
    }
    // First visit — load a demo city so the farmer dashboard is visible immediately
    setLocationMode("manual");
    setManualCity("Barabanki");
    loadWeather(() => fetchWeatherByCity("Barabanki"));
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
      title="मौसम"
      subtitle="खेती के सही फैसले के लिए लाइव मौसम"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "मौसम" }]}
      className="overflow-x-hidden"
    >
      <DarkCard className="overflow-hidden">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <AppLink href="/weather/spray-advisory" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
              स्प्रे सलाह
            </AppLink>
            <AppLink href="/pest-solver" className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-1.5 text-[10px] font-semibold text-[var(--av-text-secondary)]">
              रोग पहचान
            </AppLink>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locLoading || loading}
            className={`inline-flex w-full justify-center gap-1.5 disabled:opacity-60 sm:w-auto ${AV.btnPrimarySm}`}
          >
            {locLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            मेरा स्थान
          </button>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchManualCity()}
                placeholder="शहर खोजें — Indore, Delhi..."
                className="w-full min-w-0 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-10 pr-3 text-sm text-[var(--av-text-primary)] outline-none focus:border-[#10b981]"
              />
            </div>
            <button
              type="button"
              onClick={searchManualCity}
              disabled={loading}
              className={`inline-flex shrink-0 justify-center gap-1.5 ${AV.btnSecondarySm}`}
            >
              {loading && locationMode === "manual" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              खोजें
            </button>
          </div>
        </div>
      </DarkCard>

      {!loading && !weatherData && !error && (
        <DarkCard className="mt-4 text-center" delay={1}>
          <CloudSun className="mx-auto h-12 w-12 text-[var(--av-accent)]" />
          <p className="mt-3 text-base font-bold text-[var(--av-text-primary)]">अपना स्थान चुनें</p>
          <p className="mt-1 text-sm text-[var(--av-text-muted)]">GPS या शहर से मौसम डैशबोर्ड खोलें</p>
        </DarkCard>
      )}

      {loading && (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--av-accent)]" />
          <p className="mt-3 text-sm text-[var(--av-text-muted)]">मौसम लोड हो रहा है…</p>
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
        <div className="mt-4 w-full overflow-x-hidden">
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
