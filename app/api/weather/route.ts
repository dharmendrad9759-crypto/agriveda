import { NextRequest, NextResponse } from "next/server";

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

async function geocodeCity(city: string, apiKey: string): Promise<GeoResult | null> {
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

async function fetchWeatherBundle(
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

export async function GET(request: NextRequest) {
  const apiKey = readOpenWeatherKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Weather configure नहीं है — server पर OPENWEATHER_API_KEY set करें (OpenWeather dashboard से नया key बनाएं)",
      },
      { status: 503 }
    );
  }

  const city = request.nextUrl.searchParams.get("city");
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  try {
    if (lat && lon) {
      const bundle = await fetchWeatherBundle(Number(lat), Number(lon), apiKey);
      if ("error" in bundle) {
        return NextResponse.json({ error: bundle.error }, { status: bundle.status });
      }
      return NextResponse.json({
        ...bundle,
        coords: { lat: Number(lat), lon: Number(lon) },
      });
    }

    if (city?.trim()) {
      const geo = await geocodeCity(city.trim(), apiKey);
      if (!geo) {
        return NextResponse.json(
          {
            error:
              "शहर नहीं मिला। अंग्रेज़ी में नाम लिखें (जैसे Aligarh, Delhi) — भारत के लिए ,IN auto लगता है।",
          },
          { status: 404 }
        );
      }

      const bundle = await fetchWeatherBundle(geo.lat, geo.lon, apiKey);
      if ("error" in bundle) {
        return NextResponse.json({ error: bundle.error }, { status: bundle.status });
      }

      return NextResponse.json({
        ...bundle,
        coords: { lat: geo.lat, lon: geo.lon },
        resolvedLocation: {
          name: geo.name,
          state: geo.state,
          country: geo.country,
          lat: geo.lat,
          lon: geo.lon,
        },
      });
    }

    return NextResponse.json({ error: "city या lat/lon ज़रूरी है" }, { status: 400 });
  } catch {
    return NextResponse.json(
      {
        error:
          "सर्वर से मौसम लोड नहीं हो सका — network slow hai ya OpenWeather block ho sakta hai।",
      },
      { status: 503 }
    );
  }
}
