"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Search, CloudSun } from "lucide-react";
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
import { useNetworkStatus, withSlowGuard } from "@/hooks/useNetworkStatus";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  NoResultsState,
  OfflineState,
  PermissionDeniedState,
  SlowNetworkState,
  SuccessBanner,
  ValidationHint,
} from "@/components/ui/UiStates";
import {
  openAppLocationPermissionSettings,
  openDeviceLocationSettings,
} from "@/lib/openLocationSettings";

function isPermissionError(message: string) {
  const m = message.toLowerCase();
  return m.includes("permission") || m.includes("अनुमति") || m.includes("denied");
}

function isNotFoundError(message: string) {
  return message.includes("नहीं मिला") || message.toLowerCase().includes("not found");
}

export default function WeatherPage() {
  const { showToast } = useToast();
  const { online, slow, setSlow } = useNetworkStatus(8000);
  const [weatherData, setWeatherData] = useState<WeatherViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityValidation, setCityValidation] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState("");
  const [locationMode, setLocationMode] = useState<"gps" | "manual" | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const autoLoaded = useRef(false);

  const loadWeather = useCallback(
    async (loader: () => Promise<WeatherViewModel>) => {
      if (!navigator.onLine) {
        setError("इंटरनेट नहीं है — मौसम के लिए नेट ज़रूरी है।");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        const data = await withSlowGuard(loader, setSlow, 8000);
        setWeatherData(data);
        setLastUpdated(new Date());
        setSuccessMsg(`मौसम अपडेट: ${data.location} · ${data.temp}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "मौसम लोड नहीं हो सका।");
        setWeatherData(null);
      } finally {
        setLoading(false);
        setSlow(false);
      }
    },
    [setSlow]
  );

  const useCurrentLocation = useCallback(async () => {
    if (!navigator.onLine) {
      setError("इंटरनेट नहीं है — मौसम के लिए नेट ज़रूरी है।");
      return;
    }
    setLocLoading(true);
    setError(null);
    setCityValidation(null);
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
      setCityValidation("कृपया शहर का नाम लिखें (जैसे Delhi, Indore)");
      return;
    }
    setCityValidation(null);
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

  const permissionDenied = Boolean(error && isPermissionError(error));
  const noResults = Boolean(error && isNotFoundError(error));

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
            <AppLink
              href="/weather/spray-advisory"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300"
            >
              स्प्रे सलाह
            </AppLink>
            <AppLink
              href="/pest-solver"
              className="rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-1.5 text-[10px] font-semibold text-[var(--av-text-secondary)]"
            >
              रोग पहचान
            </AppLink>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locLoading || loading || !online}
            className={`inline-flex w-full justify-center gap-1.5 disabled:opacity-60 sm:w-auto ${AV.btnPrimarySm}`}
          >
            {locLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            मेरा स्थान
          </button>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
              <input
                value={manualCity}
                onChange={(e) => {
                  setManualCity(e.target.value);
                  if (cityValidation) setCityValidation(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && searchManualCity()}
                placeholder="शहर खोजें — Indore, Delhi..."
                className="w-full min-w-0 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] py-2.5 pl-10 pr-3 text-sm text-[var(--av-text-primary)] outline-none focus:border-[#10b981]"
                aria-invalid={Boolean(cityValidation)}
              />
            </div>
            <button
              type="button"
              onClick={searchManualCity}
              disabled={loading || !online}
              className={`inline-flex shrink-0 justify-center gap-1.5 disabled:opacity-60 ${AV.btnSecondarySm}`}
            >
              {loading && locationMode === "manual" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-600" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              खोजें
            </button>
          </div>
          {cityValidation && <ValidationHint message={cityValidation} />}
        </div>
      </DarkCard>

      {!online && (
        <OfflineState onRetry={() => (weatherData ? refreshWeather() : searchManualCity())} />
      )}

      {online && loading && !slow && (
        <LoadingState title="मौसम लोड हो रहा है…" description="Open-Meteo से लाइव डेटा आ रहा है" />
      )}

      {online && loading && slow && (
        <SlowNetworkState
          title="मौसम लोड होने में देर हो रही है"
          description="नेटवर्क धीमा है — कृपया रुकें, डेटा आ रहा है।"
        />
      )}

      {online && !loading && permissionDenied && (
        <PermissionDeniedState
          kind="location"
          onOpenSettings={() => void openAppLocationPermissionSettings()}
          onRetry={useCurrentLocation}
        />
      )}

      {online && !loading && noResults && (
        <NoResultsState
          title="शहर नहीं मिला"
          description={error ?? "दूसरा नाम अंग्रेज़ी में लिखें (Delhi, Indore)।"}
          onRetry={searchManualCity}
        />
      )}

      {online && !loading && error && !permissionDenied && !noResults && (
        <ErrorState
          title="मौसम लोड नहीं हुआ"
          description={error}
          onRetry={locationMode === "gps" ? useCurrentLocation : refreshWeather}
          actionLabel={locationMode === "gps" ? "GPS फिर से" : "फिर से कोशिश"}
        />
      )}

      {online && !loading && !weatherData && !error && (
        <EmptyState
          title="अपना स्थान चुनें"
          description="GPS या शहर से मौसम डैशबोर्ड खोलें"
          icon={<CloudSun className="h-8 w-8" />}
          actionLabel="मेरा स्थान"
          onAction={useCurrentLocation}
        />
      )}

      {online && !loading && weatherData && successMsg && (
        <SuccessBanner message={successMsg} />
      )}

      {online && !loading && weatherData && (
        <div className="mt-4 w-full overflow-x-hidden">
          <WeatherRedesign
            weather={weatherData}
            lastUpdated={lastUpdated}
            onRefresh={refreshWeather}
            onShare={shareWeather}
            onEnableLocation={() => {
              void openDeviceLocationSettings().then(() => useCurrentLocation());
            }}
          />
        </div>
      )}
    </AppShell>
  );
}
