import { NextRequest, NextResponse } from "next/server";
import { buildMockWeatherBundle } from "@/data/mock/weather";
import {
  fetchOpenMeteoBundle,
  geocodeOpenMeteo,
} from "@/lib/openMeteo";
import { clientIp, rateLimit } from "@/lib/rateLimit";

function readOpenWeatherKey(): string | undefined {
  const raw = process.env.OPENWEATHER_API_KEY?.trim();
  return raw || undefined;
}

const FETCH_TIMEOUT_MS = 12_000;

interface GeoResult {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

async function owmFetch(url: string, revalidate = 300): Promise<Response | null> {
  try {
    return await fetch(url, {
      next: { revalidate },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

async function geocodeCityOpenWeather(city: string, apiKey: string): Promise<GeoResult | null> {
  const query = city.includes(",") ? city.trim() : `${city.trim()},IN`;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${apiKey}`;
  const res = await owmFetch(url, 86400);
  if (!res?.ok) return null;
  const rows = (await res.json()) as GeoResult[];
  return rows[0] ?? null;
}

type WeatherBundleResult =
  | { current: unknown; forecast: unknown }
  | { error: string; status: number };

async function fetchOpenWeatherBundle(
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherBundleResult> {
  const q = `lat=${lat}&lon=${lon}`;
  const currentRes = await owmFetch(
    `https://api.openweathermap.org/data/2.5/weather?${q}&units=metric&appid=${apiKey}&lang=hi`
  );

  if (!currentRes) {
    return {
      error:
        "OpenWeather timeout — internet / firewall check karein, ya thodi der baad dubara try karein।",
      status: 503,
    };
  }

  if (!currentRes.ok) {
    const body = await currentRes.json().catch(() => ({}));
    const message =
      body?.message === "city not found"
        ? "शहर नहीं मिला। अंग्रेज़ी में नाम लिखें (जैसे Delhi, Aligarh)"
        : body?.message || "मौसम डेटा नहीं मिला";
    return { error: message, status: currentRes.status as number };
  }

  const forecastRes = await owmFetch(
    `https://api.openweathermap.org/data/2.5/forecast?${q}&units=metric&appid=${apiKey}&lang=hi`
  );

  const current = await currentRes.json();
  const forecast = forecastRes?.ok ? await forecastRes.json() : { list: [] };

  return { current, forecast };
}

function mockResponse(city?: string | null, lat?: string | null, lon?: string | null) {
  const mock = buildMockWeatherBundle({
    cityName: city?.trim() || undefined,
    lat: lat ? Number(lat) : undefined,
    lon: lon ? Number(lon) : undefined,
  });
  return NextResponse.json({
    ...mock,
    isDemo: true,
    source: "mock",
    demoNotice: "यह नमूना मौसम है — लाइव डेटा नहीं। स्प्रे/खेत का फैसला सिर्फ इसी पर न लें।",
  });
}

async function resolveWithOpenMeteo(
  lat: number,
  lon: number,
  location: { name: string; country: string; state?: string }
) {
  const bundle = await fetchOpenMeteoBundle(lat, lon, location);
  if ("error" in bundle) return bundle;
  return NextResponse.json(bundle);
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request);
  const limited = await rateLimit(`weather:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `बहुत अनुरोध — ${limited.retryAfterSec} सेकंड बाद` },
      { status: 429 }
    );
  }

  const apiKey = readOpenWeatherKey();
  const city = request.nextUrl.searchParams.get("city");
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  if (!city?.trim() && !(lat && lon)) {
    return NextResponse.json({ error: "city या lat/lon ज़रूरी है" }, { status: 400 });
  }

  try {
    // --- GPS / coordinates ---
    if (lat && lon) {
      const latN = Number(lat);
      const lonN = Number(lon);

      let placeName = "आपका स्थान";
      let placeState: string | undefined;
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latN}&lon=${lonN}&format=json&addressdetails=1&zoom=10`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent": "AgrivedaFarmApp/1.0 (weather-location)",
            },
            next: { revalidate: 86400 },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          }
        );
        if (nomRes.ok) {
          const data = (await nomRes.json()) as {
            address?: {
              state?: string;
              state_district?: string;
              county?: string;
              district?: string;
              city?: string;
              town?: string;
              village?: string;
            };
          };
          const a = data.address ?? {};
          const district =
            a.state_district || a.county || a.district || a.city || a.town || a.village || "";
          const state = a.state || "";
          const label = [district, state].filter(Boolean).join(", ");
          if (label) {
            placeName = label;
            placeState = state || undefined;
          }
        }
      } catch {
        /* keep fallback name */
      }

      const om = await resolveWithOpenMeteo(latN, lonN, {
        name: placeName,
        country: "IN",
        state: placeState,
      });
      if (om instanceof NextResponse) return om;

      // Optional OpenWeather fallback
      if (apiKey) {
        const owm = await fetchOpenWeatherBundle(latN, lonN, apiKey);
        if (!("error" in owm)) {
          const withName =
            placeName !== "आपका स्थान" && owm.current
              ? {
                  ...owm,
                  current: { ...owm.current, name: placeName },
                  resolvedLocation: {
                    name: placeName,
                    state: placeState,
                    country: "IN",
                    lat: latN,
                    lon: lonN,
                  },
                }
              : owm;
          return NextResponse.json({
            ...withName,
            source: "openweather",
            coords: { lat: latN, lon: lonN },
          });
        }
      }

      return mockResponse(city, lat, lon);
    }

    // --- City search ---
    if (city?.trim()) {
      const geo = await geocodeOpenMeteo(city.trim());
      if (geo) {
        const om = await resolveWithOpenMeteo(geo.lat, geo.lon, {
          name: geo.name,
          country: geo.country,
          state: geo.state,
        });
        if (om instanceof NextResponse) return om;
      }

      // OpenWeather geocode + weather if Open-Meteo failed and key exists
      if (apiKey) {
        const owmGeo = await geocodeCityOpenWeather(city.trim(), apiKey);
        if (owmGeo) {
          const owm = await fetchOpenWeatherBundle(owmGeo.lat, owmGeo.lon, apiKey);
          if (!("error" in owm)) {
            return NextResponse.json({
              ...owm,
              source: "openweather",
              coords: { lat: owmGeo.lat, lon: owmGeo.lon },
              resolvedLocation: {
                name: owmGeo.name,
                state: owmGeo.state,
                country: owmGeo.country,
                lat: owmGeo.lat,
                lon: owmGeo.lon,
              },
            });
          }
        }
      }

      if (!geo) {
        return NextResponse.json(
          {
            error:
              "शहर नहीं मिला। अंग्रेज़ी में नाम लिखें (जैसे Aligarh, Delhi)।",
          },
          { status: 404 }
        );
      }

      return mockResponse(city, lat, lon);
    }

    return NextResponse.json({ error: "city या lat/lon ज़रूरी है" }, { status: 400 });
  } catch {
    return NextResponse.json(
      {
        error: "सर्वर से मौसम लोड नहीं हो सका — network slow hai।",
      },
      { status: 503 }
    );
  }
}
