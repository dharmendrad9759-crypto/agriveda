"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Search, Loader2, CloudSun } from "lucide-react";
import AppShell from "@/components/shell/AppShell";
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
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function WeatherPage() {
  const { t } = useLocale();
  const { showToast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState("");
  const [locationMode, setLocationMode] = useState<"gps" | "manual" | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showSearch, setShowSearch] = useState(false);
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
      await loadWeather(() =>
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude)
      );
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
    setShowSearch(false);
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
    showToast(ok ? t("weatherShareOk") : t("weatherShareFail"), ok ? "success" : "error");
  };

  return (
    <AppShell
      title={t("weatherTitle")}
      subtitle={t("weatherSubtitle")}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("weatherTitle") }]}
      className="overflow-x-hidden"
      actions={
        <div className="flex items-center gap-2">
          <AppLink
            href="/weather/spray-advisory"
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-300"
          >
            {t("weatherSprayShort")}
          </AppLink>
          <button
            type="button"
            onClick={() => setShowSearch((v) => !v)}
            className="rounded-full border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 text-[10px] font-bold text-[var(--av-text-secondary)]"
          >
            {t("weatherLocationBtn")}
          </button>
        </div>
      }
    >
      {showSearch && (
        <div className="mb-4 rounded-[1.5rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-[var(--av-shadow-sm)]">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locLoading || loading}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--av-accent)] px-3 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {locLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            {t("weatherMyLocation")}
          </button>
          <div className="mt-2 flex min-w-0 gap-2">
            <div className="relative min-w-0 flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchManualCity()}
                placeholder={t("weatherCityPlaceholder")}
                className="w-full min-w-0 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-10 pr-3 text-sm text-[var(--av-text-primary)] outline-none focus:border-[var(--av-accent)]"
              />
            </div>
            <button
              type="button"
              onClick={searchManualCity}
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 text-sm font-bold text-[var(--av-text-primary)]"
            >
              {loading && locationMode === "manual" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {!loading && !weatherData && !error && (
        <div className="rounded-[1.75rem] border border-[var(--av-border)] bg-[var(--av-surface)] p-8 text-center">
          <CloudSun className="mx-auto h-12 w-12 text-[var(--av-accent)]" />
          <p className="mt-3 text-base font-bold text-[var(--av-text-primary)]">{t("weatherPickLocation")}</p>
          <p className="mt-1 text-sm text-[var(--av-text-muted)]">{t("weatherPickLocationHint")}</p>
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            className="mt-4 rounded-full bg-[var(--av-accent)] px-4 py-2 text-sm font-bold text-white"
          >
            {t("weatherSetLocation")}
          </button>
        </div>
      )}

      {loading && (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--av-accent)]" />
          <p className="mt-3 text-sm text-[var(--av-text-muted)]">{t("weatherLoading")}</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-[1.5rem] border border-red-500/30 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={useCurrentLocation}
            className="mt-2 text-xs font-bold text-[var(--av-accent)]"
          >
            {t("weatherRetryGps")}
          </button>
        </div>
      )}

      {!loading && weatherData && (
        <div className="w-full overflow-x-hidden">
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
