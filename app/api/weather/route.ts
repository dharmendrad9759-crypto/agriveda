import { NextRequest, NextResponse } from "next/server";
import {
  fetchOpenMeteoBundle,
  geocodeOpenMeteo,
} from "@/lib/openMeteo";

/**
 * Weather API — Open-Meteo only.
 * No mock / demo payloads. Failures return JSON errors.
 */
export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");
  const timestamp = new Date().toISOString();

  if (!city?.trim() && !(lat && lon)) {
    return NextResponse.json({ error: "city या lat/lon ज़रूरी है" }, { status: 400 });
  }

  try {
    // --- GPS / coordinates ---
    if (lat && lon) {
      const latN = Number(lat);
      const lonN = Number(lon);

      if (!Number.isFinite(latN) || !Number.isFinite(lonN)) {
        return NextResponse.json({ error: "अमान्य lat/lon" }, { status: 400 });
      }

      console.info("[api/weather] coords request", {
        timestamp,
        latitude: latN,
        longitude: lonN,
      });

      const bundle = await fetchOpenMeteoBundle(latN, lonN, {
        name: "आपका स्थान",
        country: "IN",
      });

      if ("error" in bundle) {
        console.error("[api/weather] Open-Meteo failed (coords)", {
          timestamp: new Date().toISOString(),
          latitude: latN,
          longitude: lonN,
          error: bundle.error,
        });
        return NextResponse.json({ error: bundle.error }, { status: bundle.status });
      }

      return NextResponse.json(bundle);
    }

    // --- City search ---
    if (city?.trim()) {
      console.info("[api/weather] city request", {
        timestamp,
        city: city.trim(),
      });

      const geo = await geocodeOpenMeteo(city.trim());
      if (!geo) {
        return NextResponse.json(
          {
            error:
              "शहर नहीं मिला। अंग्रेज़ी में नाम लिखें (जैसे Aligarh, Delhi)।",
          },
          { status: 404 }
        );
      }

      console.info("[api/weather] geocoded", {
        timestamp: new Date().toISOString(),
        city: city.trim(),
        latitude: geo.lat,
        longitude: geo.lon,
        name: geo.name,
      });

      const bundle = await fetchOpenMeteoBundle(geo.lat, geo.lon, {
        name: geo.name,
        country: geo.country,
        state: geo.state,
      });

      if ("error" in bundle) {
        console.error("[api/weather] Open-Meteo failed (city)", {
          timestamp: new Date().toISOString(),
          latitude: geo.lat,
          longitude: geo.lon,
          error: bundle.error,
        });
        return NextResponse.json({ error: bundle.error }, { status: bundle.status });
      }

      return NextResponse.json(bundle);
    }

    return NextResponse.json({ error: "city या lat/lon ज़रूरी है" }, { status: 400 });
  } catch (err) {
    console.error("[api/weather] unexpected", {
      timestamp: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "सर्वर से मौसम लोड नहीं हो सका — network slow hai।" },
      { status: 503 }
    );
  }
}
