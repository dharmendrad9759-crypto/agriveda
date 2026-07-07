"use client";

import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Search, Loader2, CloudSun, RefreshCw, Share2 } from "lucide-react";
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
import FarmWeatherDashboard from "@/components/weather/FarmWeatherDashboard";
import { BRAND } from "@/lib/brand";

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
      setError("कृपया शहर या गाँव का नाम लिखें (अंग्रेज़ी में, जैसे Delhi, Aligarh)");
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
      `🌾 Agriveda Weather — ${weatherData.location}`,
      `${weatherData.temp} · ${weatherData.condition}`,
      weatherData.rainfallAlert,
      "",
      "अगले घंटे:",
      ...weatherData.hourlyForecast.slice(0, 6).map(
        (h) => `${h.time}: ${h.temp}, बारिश ${h.rainChancePercent}%`
      ),
    ].join("\n");
    const ok = await shareText("Agriveda Weather", text);
    showToast(ok ? "मौसम साझा / कॉपी हो गया ✓" : "Share नहीं हो सका", ok ? "success" : "error");
  };

  const showWelcome = !loading && !weatherData && !error;

  return (
    <main className="agriveda-page min-h-screen px-4 py-8 pb-28">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4 border-b border-gray-200/20 pb-6">
          <span className="text-xs font-bold text-emerald-600">
            {BRAND}
          </span>
          <h1 className="text-3xl font-extrabold theme-text-primary md:text-4xl">
            मौसम पूर्वानुमान
          </h1>
          <p className="text-sm theme-text-muted">
            पहले लोकेशन चुनें — GPS permission सिर्फ़ बटन दबाने पर मांगी जाएगी।
            डैशबोर्ड लोकेशन लोड होने के बाद नीचे दिखेगा।
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/weather/spray-advisory"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-300"
            >
              <FlaskConical className="h-4 w-4" />
              स्प्रे सलाह (Tank-mix)
            </Link>
            <Link
              href="/pest-solver"
              className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300 bg-fuchsia-50 px-3 py-2 text-xs font-bold text-fuchsia-800 dark:bg-fuchsia-500/10 dark:text-fuchsia-300"
            >
              लक्षण से पहचान
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={locLoading || loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#006432] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#005528] disabled:opacity-60"
            >
              {locLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              मेरी सटीक लोकेशन इस्तेमाल करें
            </button>

            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => {
                    setManualCity(e.target.value);
                    if (error?.includes("शहर")) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      searchManualCity();
                    }
                  }}
                  placeholder="शहर लिखें — Delhi, Aligarh, Jaipur..."
                  className="theme-input w-full rounded-2xl border py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <button
                type="button"
                onClick={searchManualCity}
                disabled={loading}
                aria-label="शहर खोजें"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60 dark:bg-emerald-500/10 dark:text-emerald-400"
              >
                {loading && locationMode === "manual" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span className="hidden sm:inline">खोजें</span>
              </button>
            </div>
          </div>

          {locationMode === "gps" && weatherData && (
            <p className="text-xs font-medium text-emerald-600">
              📍 GPS लोकेशन से मौसम दिखाया जा रहा है
            </p>
          )}
          {locationMode === "manual" && weatherData && (
            <p className="text-xs font-medium text-emerald-600">
              📍 मैन्युअल शहर से मौसम दिखाया जा रहा है
            </p>
          )}
        </div>

        {showWelcome && (
          <div className="agriveda-glass rounded-3xl p-10 text-center">
            <CloudSun className="mx-auto h-14 w-14 text-emerald-500" />
            <p className="mt-4 text-lg font-bold theme-text-primary">अपनी लोकेशन चुनें</p>
            <p className="mt-2 text-sm theme-text-muted">
              ऊपर &quot;मेरी सटीक लोकेशन&quot; बटन दबाएँ — phone पर location permission मांगी जाएगी।
              <br />
              या नीचे शहर का नाम लिखकर खोजें बटन दबाएँ।
            </p>
          </div>
        )}

        {loading && (
          <div className="py-20 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-500" />
            <p className="mt-4 text-sm theme-text-muted">मौसम लोड हो रहा है...</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-500/10">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={useCurrentLocation}
                className="text-sm font-bold text-emerald-600 underline"
              >
                GPS लोकेशन फिर से कोशिश करें
              </button>
            </div>
          </div>
        )}

        {!loading && !error && weatherData && (
          <div className="rounded-3xl bg-[#f5f5f7] p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-emerald-700">{weatherData.location}</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={refreshWeather}
                  disabled={loading}
                  className="rounded-xl p-2 text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50"
                  aria-label="Refresh weather"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={shareWeather}
                  className="rounded-xl p-2 text-emerald-600 hover:bg-emerald-500/10"
                  aria-label="Share weather"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <FarmWeatherDashboard weather={weatherData} lastUpdated={lastUpdated} />
          </div>
        )}

        <Link href="/" className="text-sm font-semibold text-emerald-600 hover:underline">
          ← होम पर वापस
        </Link>
      </div>
    </main>
  );
}
