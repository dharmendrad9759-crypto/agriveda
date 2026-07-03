import { NextRequest, NextResponse } from "next/server";

const API_KEY =
  process.env.OPENWEATHER_API_KEY ||
  process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY ||
  "7329dc97e3c822b153c190c7c1b5e85d";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  let currentUrl: string;
  let forecastUrl: string;

  if (lat && lon) {
    const q = `lat=${lat}&lon=${lon}`;
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?${q}&units=metric&appid=${API_KEY}&lang=hi`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${q}&units=metric&appid=${API_KEY}&lang=hi`;
  } else if (city?.trim()) {
    const q = encodeURIComponent(city.trim());
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${API_KEY}&lang=hi`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${q}&units=metric&appid=${API_KEY}&lang=hi`;
  } else {
    return NextResponse.json({ error: "city या lat/lon ज़रूरी है" }, { status: 400 });
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl, { next: { revalidate: 300 } }),
      fetch(forecastUrl, { next: { revalidate: 300 } }),
    ]);

    if (!currentRes.ok) {
      const body = await currentRes.json().catch(() => ({}));
      const message =
        body?.message === "city not found"
          ? "शहर नहीं मिला। अंग्रेज़ी में नाम लिखें (जैसे Delhi, Aligarh)"
          : body?.message || "मौसम डेटा नहीं मिला";
      return NextResponse.json({ error: message }, { status: currentRes.status });
    }

    const current = await currentRes.json();
    const forecast = forecastRes.ok ? await forecastRes.json() : { list: [] };

    return NextResponse.json({ current, forecast });
  } catch {
    return NextResponse.json({ error: "सर्वर से मौसम लोड नहीं हो सका" }, { status: 500 });
  }
}
