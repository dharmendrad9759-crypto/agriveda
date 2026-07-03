"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { MapPin, Navigation, Search, Loader2, CloudSun } from "lucide-react";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  requestUserLocation,
  geolocationErrorMessage,
  type WeatherViewModel,
} from "@/lib/weatherApi";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState("");
  const [locationMode, setLocationMode] = useState<"gps" | "manual" | null>(null);

  const loadWeather = useCallback(async (loader: () => Promise<WeatherViewModel>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loader();
      setWeatherData(data);
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

  const showWelcome = !loading && !weatherData && !error;

  return (
    <main className="agriveda-page min-h-screen px-4 py-8 pb-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4 border-b border-gray-200/20 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            AGRIVEDA WEATHER
          </span>
          <h1 className="text-3xl font-extrabold theme-text-primary md:text-4xl">
            मौसम पूर्वानुमान
          </h1>
          <p className="text-sm theme-text-muted">
            पहले लोकेशन चुनें — GPS permission सिर्फ़ बटन दबाने पर मांगी जाएगी।
          </p>

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
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm theme-text-primary outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-white/10 dark:bg-black/30"
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
              ऊपर &quot;मेरी सटीक लोकेशन&quot; बटन दबाएँ — browser permission popup आएगा।
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
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="agriveda-glass-strong lg:col-span-2 rounded-3xl p-6 md:p-8">
                <p className="text-sm font-semibold text-emerald-600">{weatherData.location}</p>
                <h2 className="mt-2 text-6xl font-black theme-text-primary">{weatherData.temp}</h2>
                <p className="mt-1 text-lg capitalize theme-text-muted">{weatherData.condition}</p>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 dark:border-white/10">
                  <div>
                    <p className="text-xs uppercase theme-text-muted">नमी</p>
                    <p className="text-lg font-bold theme-text-primary">{weatherData.humidity}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase theme-text-muted">हवा</p>
                    <p className="text-lg font-bold theme-text-primary">{weatherData.windSpeed}</p>
                  </div>
                </div>
                <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {weatherData.rainfallAlert}
                </p>
              </div>

              <div className="agriveda-glass rounded-3xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider theme-text-muted">
                  अगले घंटे
                </h3>
                <div className="mt-4 divide-y divide-gray-100 dark:divide-white/10">
                  {weatherData.hourlyForecast.map((hour, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 text-sm">
                      <span className="theme-text-muted">{hour.time}</span>
                      <span>{hour.icon}</span>
                      <span className="font-bold theme-text-primary">{hour.temp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold theme-text-primary">फसल सलाह</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {weatherData.recommendations.map((rec, i) => (
                  <div key={i} className="agriveda-glass rounded-2xl p-5">
                    <h3 className="font-bold text-emerald-700 dark:text-emerald-400">{rec.title}</h3>
                    <p className="mt-2 text-sm theme-text-muted leading-relaxed">{rec.advice}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Link href="/" className="text-sm font-semibold text-emerald-600 hover:underline">
          ← होम पर वापस
        </Link>
      </div>
    </main>
  );
}
