import type { SprayForecastHour, SprayWeatherBundle, SprayWeatherSnapshot } from "@/types/spray-window";
import { SPRAY_WINDOW_CONFIG } from "@/lib/sprayWindow";
import { maxPopInWindow } from "@/lib/weatherForecast";

interface ForecastItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { main: string }[];
  wind: { speed: number };
  pop?: number;
}

interface WeatherApiResponse {
  current: {
    name: string;
    sys: { country: string };
    main: { temp: number; humidity: number };
    weather: { main: string }[];
    wind: { speed: number };
    dt?: number;
  };
  forecast: { list: ForecastItem[] };
}

const LOCATION_KEY = "agriveda-weather-location";

export type SavedWeatherLocation =
  | { type: "gps"; lat: number; lon: number }
  | { type: "city"; city: string };

export function getSavedWeatherLocation(): SavedWeatherLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedWeatherLocation;
  } catch {
    return null;
  }
}

export function saveWeatherLocation(loc: SavedWeatherLocation): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
  } catch {
    /* ignore */
  }
}

function msToKmh(speedMs: number): number {
  return speedMs * 3.6;
}

function maxRainNext3h(forecastList: ForecastItem[], fromMs: number): number {
  return maxPopInWindow(forecastList, fromMs, SPRAY_WINDOW_CONFIG.rain.lookaheadHours);
}

/** Expand 3-hour OpenWeather blocks into hourly slots */
function expandToHourly(forecastList: ForecastItem[]): SprayForecastHour[] {
  const hourly: SprayForecastHour[] = [];
  const now = Date.now();

  for (const item of forecastList) {
    const baseTime = item.dt * 1000;
    if (baseTime < now - 60 * 60 * 1000) continue;

    const slot: Omit<SprayForecastHour, "time"> = {
      windSpeedKmh: msToKmh(item.wind.speed),
      temperatureC: item.main.temp,
      humidityPercent: item.main.humidity,
      rainProbability: item.pop ?? 0,
      weatherMain: item.weather[0]?.main ?? "Clouds",
    };

    for (let h = 0; h < 3; h++) {
      const time = new Date(baseTime + h * 60 * 60 * 1000);
      if (time.getTime() < now - 30 * 60 * 1000) continue;
      hourly.push({ ...slot, time });
    }
  }

  hourly.sort((a, b) => a.time.getTime() - b.time.getTime());

  const seen = new Set<number>();
  return hourly.filter((h) => {
    const key = h.time.getTime();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildCurrentSnapshot(
  current: WeatherApiResponse["current"],
  forecastList: ForecastItem[]
): SprayWeatherSnapshot {
  const now = new Date((current.dt ?? Date.now() / 1000) * 1000);
  const fromMs = now.getTime();

  return {
    windSpeedKmh: msToKmh(current.wind.speed),
    temperatureC: current.main.temp,
    humidityPercent: current.main.humidity,
    rainProbabilityNext3h: maxRainNext3h(forecastList, fromMs),
    timeOfDay: now,
    weatherMain: current.weather[0]?.main ?? "Clouds",
  };
}

function parseSprayWeatherResponse(data: WeatherApiResponse): SprayWeatherBundle {
  const forecastList = data.forecast?.list ?? [];
  const hourly = expandToHourly(forecastList).slice(
    0,
    SPRAY_WINDOW_CONFIG.forecastScanHours
  );

  return {
    location: `${data.current.name}, ${data.current.sys.country}`,
    current: buildCurrentSnapshot(data.current, forecastList),
    hourly,
  };
}

async function fetchSprayWeather(params: URLSearchParams): Promise<SprayWeatherBundle> {
  const res = await fetch(`/api/weather?${params.toString()}`);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || "Weather could not be loaded.");
  }

  return parseSprayWeatherResponse(body as WeatherApiResponse);
}

export async function fetchSprayWeatherByCity(city: string): Promise<SprayWeatherBundle> {
  const params = new URLSearchParams({ city: city.trim() });
  const bundle = await fetchSprayWeather(params);
  saveWeatherLocation({ type: "city", city: city.trim() });
  return bundle;
}

export async function fetchSprayWeatherByCoords(
  lat: number,
  lon: number
): Promise<SprayWeatherBundle> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  const bundle = await fetchSprayWeather(params);
  saveWeatherLocation({ type: "gps", lat, lon });
  return bundle;
}

export async function fetchSprayWeatherFromSaved(): Promise<SprayWeatherBundle | null> {
  const saved = getSavedWeatherLocation();
  if (!saved) return null;

  if (saved.type === "gps") {
    return fetchSprayWeatherByCoords(saved.lat, saved.lon);
  }
  return fetchSprayWeatherByCity(saved.city);
}
