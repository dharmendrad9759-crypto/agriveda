/**
 * Open-Meteo weather client (no API key).
 * Current hero temperature ALWAYS comes from current.temperature_2m
 * (never daily max / never apparent_temperature).
 */

const FETCH_TIMEOUT_MS = 12_000;
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export interface OpenMeteoGeoResult {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

export interface OpenMeteoDebugInfo {
  timestamp: string;
  latitude: number;
  longitude: number;
  timezone: "auto";
  requestUrl: string;
  current_temperature_2m: number | null;
  current_apparent_temperature: number | null;
  current_time: string | null;
  raw: unknown;
}

/** OpenWeather-compatible forecast block (wind.speed is m/s). */
export interface OpenWeatherShapedBundle {
  source: "open-meteo";
  current: {
    name: string;
    sys: { country: string };
    main: { temp: number; humidity: number; feels_like: number };
    weather: { main: string; description: string }[];
    wind: { speed: number };
    visibility: number;
    dt: number;
    coord: { lat: number; lon: number };
  };
  forecast: {
    list: {
      dt: number;
      main: { temp: number; humidity: number };
      weather: { main: string; description: string }[];
      wind: { speed: number };
      pop: number;
      rain?: { "3h"?: number };
    }[];
  };
  coords: { lat: number; lon: number };
  resolvedLocation: {
    name: string;
    state?: string;
    country: string;
    lat: number;
    lon: number;
  };
  debug: OpenMeteoDebugInfo;
}

async function omFetch(url: string): Promise<Response | null> {
  try {
    // Always fresh — no Next.js data cache for live weather debugging
    return await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    console.error("[open-meteo] fetch failed", {
      timestamp: new Date().toISOString(),
      url,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/** WMO weather interpretation codes → OpenWeather-like main/description */
export function wmoToWeather(code: number): { main: string; description: string } {
  if (code === 0) return { main: "Clear", description: "साफ़ आसमान" };
  if (code === 1) return { main: "Clear", description: "ज़्यादातर साफ़" };
  if (code === 2) return { main: "Clouds", description: "आंशिक बादल" };
  if (code === 3) return { main: "Clouds", description: "बादल छाए" };
  if (code === 45 || code === 48) return { main: "Fog", description: "कोहरा" };
  if (code >= 51 && code <= 57) return { main: "Drizzle", description: "हल्की बूंदाबांदी" };
  if (code >= 61 && code <= 67) return { main: "Rain", description: "बारिश" };
  if (code >= 71 && code <= 77) return { main: "Snow", description: "बर्फबारी" };
  if (code >= 80 && code <= 82) return { main: "Rain", description: "बौछारें" };
  if (code >= 85 && code <= 86) return { main: "Snow", description: "बर्फ की बौछारें" };
  if (code >= 95 && code <= 99) return { main: "Thunderstorm", description: "तूफ़ान" };
  return { main: "Clouds", description: "बादल" };
}

type GeoHit = {
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  country?: string;
  admin1?: string;
};

function pickGeoHit(results: GeoHit[]): OpenMeteoGeoResult | null {
  if (!results.length) return null;
  const india =
    results.find((r) => (r.country_code || "").toUpperCase() === "IN") ?? results[0];
  return {
    lat: india.latitude,
    lon: india.longitude,
    name: india.name,
    country: india.country_code || india.country || "IN",
    state: india.admin1,
  };
}

export async function geocodeOpenMeteo(city: string): Promise<OpenMeteoGeoResult | null> {
  const raw = city.trim();
  if (!raw) return null;

  const queries = [raw];
  if (raw.includes(",")) {
    const head = raw.split(",")[0]?.trim();
    if (head && head.toLowerCase() !== raw.toLowerCase()) queries.push(head);
  }

  for (const q of queries) {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(q)}&count=8&language=hi&format=json`;
    const res = await omFetch(url);
    if (!res?.ok) continue;
    const body = (await res.json()) as { results?: GeoHit[] };
    const hit = pickGeoHit(body.results ?? []);
    if (hit) {
      console.info("[open-meteo] geocode", {
        timestamp: new Date().toISOString(),
        query: q,
        latitude: hit.lat,
        longitude: hit.lon,
        name: hit.name,
        state: hit.state,
        country: hit.country,
      });
      return hit;
    }
  }

  console.warn("[open-meteo] geocode miss", {
    timestamp: new Date().toISOString(),
    city: raw,
  });
  return null;
}

interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone?: string;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation_probability?: number | null;
    weather_code: number;
    wind_speed_10m: number;
    visibility?: number | null;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: (number | null)[];
    weather_code: number[];
    wind_speed_10m: number[];
    precipitation: (number | null)[];
  };
  daily?: {
    time: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

export async function fetchOpenMeteoBundle(
  lat: number,
  lon: number,
  location: { name: string; country: string; state?: string }
): Promise<OpenWeatherShapedBundle | { error: string; status: number }> {
  const timestamp = new Date().toISOString();

  // Explicit: timezone=auto; current includes temperature_2m (hero temp source)
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation_probability",
      "weather_code",
      "wind_speed_10m",
      "visibility",
    ].join(","),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation_probability",
      "weather_code",
      "wind_speed_10m",
      "precipitation",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
    wind_speed_unit: "ms",
  });

  const requestUrl = `${FORECAST_URL}?${params.toString()}`;

  console.info("[open-meteo] request", {
    timestamp,
    latitude: lat,
    longitude: lon,
    timezone: "auto",
    requestUrl,
    location,
  });

  const res = await omFetch(requestUrl);
  if (!res) {
    return {
      error: "Open-Meteo timeout — internet check karein, thodi der baad try karein।",
      status: 503,
    };
  }
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error("[open-meteo] HTTP error", {
      timestamp: new Date().toISOString(),
      latitude: lat,
      longitude: lon,
      status: res.status,
      body: errBody.slice(0, 500),
    });
    return { error: "मौसम डेटा नहीं मिला (Open-Meteo)", status: res.status };
  }

  const data = (await res.json()) as OpenMeteoForecastResponse;

  console.info("[open-meteo] raw response", {
    timestamp: new Date().toISOString(),
    latitude: lat,
    longitude: lon,
    responseLatitude: data.latitude,
    responseLongitude: data.longitude,
    timezone: data.timezone,
    current_temperature_2m: data.current?.temperature_2m ?? null,
    current_apparent_temperature: data.current?.apparent_temperature ?? null,
    current_time: data.current?.time ?? null,
    // Full raw payload for debugging (as requested)
    raw: data,
  });

  const cur = data.current;
  if (!cur || typeof cur.temperature_2m !== "number") {
    return { error: "Open-Meteo current.temperature_2m missing", status: 502 };
  }

  // HERO TEMP: current.temperature_2m only — never daily max, never apparent
  const temperature2m = cur.temperature_2m;
  const apparentOnlyForFeelsLike = cur.apparent_temperature;

  const curWeather = wmoToWeather(cur.weather_code);
  const nowSec = Math.floor(new Date(cur.time).getTime() / 1000);
  const visibilityM =
    cur.visibility != null && Number.isFinite(cur.visibility)
      ? Math.round(cur.visibility)
      : 10000;

  const currentRainPop =
    cur.precipitation_probability != null
      ? Math.min(1, Math.max(0, cur.precipitation_probability / 100))
      : 0;

  const hourly = data.hourly;
  const list: OpenWeatherShapedBundle["forecast"]["list"] = [];

  // Seed first block with *current* conditions so UI rain/temp match current.*
  list.push({
    dt: nowSec,
    main: {
      temp: temperature2m,
      humidity: cur.relative_humidity_2m,
    },
    weather: [{ main: curWeather.main, description: curWeather.description }],
    wind: { speed: cur.wind_speed_10m },
    pop: currentRainPop,
  });

  if (hourly?.time?.length) {
    const nowMs = Date.now() - 30 * 60 * 1000;
    for (let i = 0; i < hourly.time.length; i += 3) {
      const t = hourly.time[i];
      const ts = new Date(t).getTime();
      if (ts < nowMs) continue;
      // Skip hour slots that duplicate the current time window
      if (Math.abs(ts - nowSec * 1000) < 45 * 60 * 1000) continue;

      const code = hourly.weather_code[i] ?? 2;
      const w = wmoToWeather(code);
      const precip3h = [0, 1, 2].reduce((sum, off) => {
        const idx = i + off;
        if (idx >= hourly.precipitation.length) return sum;
        return sum + (hourly.precipitation[idx] ?? 0);
      }, 0);
      const popPct = Math.max(
        hourly.precipitation_probability[i] ?? 0,
        hourly.precipitation_probability[i + 1] ?? 0,
        hourly.precipitation_probability[i + 2] ?? 0
      );

      list.push({
        dt: Math.floor(ts / 1000),
        main: {
          // hourly temperature_2m for forecast rows only
          temp: hourly.temperature_2m[i] ?? temperature2m,
          humidity: hourly.relative_humidity_2m[i] ?? cur.relative_humidity_2m,
        },
        weather: [{ main: w.main, description: w.description }],
        wind: { speed: hourly.wind_speed_10m[i] ?? cur.wind_speed_10m },
        pop: Math.min(1, Math.max(0, popPct / 100)),
        rain: precip3h > 0 ? { "3h": Math.round(precip3h * 10) / 10 } : undefined,
      });

      if (list.length >= 40) break;
    }
  }

  const debug: OpenMeteoDebugInfo = {
    timestamp,
    latitude: lat,
    longitude: lon,
    timezone: "auto",
    requestUrl,
    current_temperature_2m: temperature2m,
    current_apparent_temperature: apparentOnlyForFeelsLike ?? null,
    current_time: cur.time,
    raw: data,
  };

  console.info("[open-meteo] mapped current temp", {
    timestamp: new Date().toISOString(),
    latitude: lat,
    longitude: lon,
    displayed_main_temp_from: "current.temperature_2m",
    temperature_2m: temperature2m,
    apparent_temperature_for_feels_like_only: apparentOnlyForFeelsLike,
    daily_max_used: false,
  });

  return {
    source: "open-meteo",
    current: {
      name: location.name,
      sys: { country: location.country },
      main: {
        // CRITICAL: hero uses this field → must be temperature_2m
        temp: temperature2m,
        humidity: cur.relative_humidity_2m,
        // feels_like is labeled "अनुभव" in UI — NOT the hero temperature
        feels_like: apparentOnlyForFeelsLike,
      },
      weather: [{ main: curWeather.main, description: curWeather.description }],
      wind: { speed: cur.wind_speed_10m },
      visibility: visibilityM,
      dt: nowSec,
      coord: { lat, lon },
    },
    forecast: { list },
    coords: { lat, lon },
    resolvedLocation: {
      name: location.name,
      state: location.state,
      country: location.country,
      lat,
      lon,
    },
    debug,
  };
}
