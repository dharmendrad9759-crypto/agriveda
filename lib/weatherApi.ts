import {
  buildRainfallAlert,
  expandForecastToHourly,
  maxPopInWindow,
  weatherEmoji,
  type ForecastItem as SharedForecastItem,
} from "@/lib/weatherForecast";

export interface WeatherViewModel {
  temp: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  rainfallAlert: string;
  location: string;
  lat?: number;
  lon?: number;
  hourlyForecast: {
    time: string;
    temp: string;
    icon: string;
    rainChancePercent: number;
    rainMm: number;
    isRainLikely: boolean;
  }[];
  recommendations: { title: string; advice: string }[];
}

interface ForecastItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { main: string; description: string }[];
  wind: { speed: number };
  pop?: number;
  rain?: { "3h"?: number };
}

interface WeatherApiResponse {
  current: {
    name: string;
    sys: { country: string };
    main: { temp: number; humidity: number };
    weather: { main: string; description: string }[];
    wind: { speed: number };
  };
  forecast: { list: ForecastItem[] };
  coords?: { lat: number; lon: number };
  resolvedLocation?: {
    name: string;
    state?: string;
    country: string;
    lat?: number;
    lon?: number;
  };
}

function buildRecommendations(
  temp: number,
  humidity: number,
  weatherMain: string,
  windSpeed: number,
  rainPopNext24h: number
) {
  const rainSoon = rainPopNext24h >= 0.3 || weatherMain === "Rain";

  return [
    {
      title: "सामान्य सलाह",
      advice: rainSoon
        ? `अगले 24 घंटे में बारिश की संभावना ${Math.round(rainPopNext24h * 100)}% — फंगल रोग और स्प्रे का समय ध्यान से चुनें।`
        : humidity > 75
          ? `नमी ${humidity}% है — फंगल रोग का खतरा बढ़ सकता है।`
          : "मौसम सामान्य है। नियमित सिंचाई और निगरानी जारी रखें।",
    },
    {
      title: "सिंचाई",
      advice:
        weatherMain === "Rain" || rainSoon
          ? "बारिश की संभावना है — सिंचाई टालें, खेत की जल निकासी ठीक रखें।"
          : `तापमान ${Math.round(temp)}°C है। शाम या सुबह सिंचाई करें।`,
    },
    {
      title: "हवा / सुरक्षा",
      advice:
        windSpeed > 5
          ? "तेज़ हवा — फसलें झुक सकती हैं, स्प्रे न करें।"
          : rainSoon
            ? "बारिश से पहले/बाद में ही छिड़काव करें।"
            : "हवा की गति सामान्य — छिड़काव के लिए उपयुक्त।",
    },
  ];
}

function mapWeatherResponse(
  currentData: WeatherApiResponse["current"],
  forecastList: ForecastItem[],
  resolvedLocation?: WeatherApiResponse["resolvedLocation"],
  coords?: { lat: number; lon: number }
): WeatherViewModel {
  const hourly = expandForecastToHourly(forecastList as SharedForecastItem[], 24);
  const weatherMain = currentData.weather[0].main;
  const humidity = currentData.main.humidity;
  const now = Date.now();
  const rainPopNext24h = maxPopInWindow(forecastList as SharedForecastItem[], now, 24);

  const locationLabel = resolvedLocation
    ? [resolvedLocation.name, resolvedLocation.state, resolvedLocation.country]
        .filter(Boolean)
        .join(", ")
    : `${currentData.name}, ${currentData.sys.country}`;

  const resolvedCoords =
    coords ??
    (resolvedLocation?.lat != null && resolvedLocation?.lon != null
      ? { lat: resolvedLocation.lat, lon: resolvedLocation.lon }
      : undefined);

  return {
    temp: `${Math.round(currentData.main.temp)}°C`,
    condition: currentData.weather[0].description,
    humidity: `${humidity}%`,
    windSpeed: `${Math.round(currentData.wind.speed * 3.6)} km/h`,
    rainfallAlert: buildRainfallAlert(weatherMain, forecastList as SharedForecastItem[]),
    location: locationLabel,
    lat: resolvedCoords?.lat,
    lon: resolvedCoords?.lon,
    hourlyForecast: hourly.map((slot) => ({
      time: slot.time,
      temp: `${Math.round(slot.tempC)}°C`,
      icon: weatherEmoji(slot.weatherMain),
      rainChancePercent: slot.rainChancePercent,
      rainMm: slot.rainMm3h,
      isRainLikely:
        slot.rainChancePercent >= 25 ||
        slot.weatherMain === "Rain" ||
        slot.weatherMain === "Drizzle" ||
        slot.weatherMain === "Thunderstorm",
    })),
    recommendations: buildRecommendations(
      currentData.main.temp,
      humidity,
      weatherMain,
      currentData.wind.speed,
      rainPopNext24h
    ),
  };
}

const WEATHER_CACHE_MS = 3 * 60 * 1000;
const weatherCache = new Map<string, { data: WeatherViewModel; at: number }>();
const weatherInflight = new Map<string, Promise<WeatherViewModel>>();

async function fetchFromApi(params: URLSearchParams): Promise<WeatherViewModel> {
  const cacheKey = params.toString();
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.at < WEATHER_CACHE_MS) {
    return cached.data;
  }

  const inflight = weatherInflight.get(cacheKey);
  if (inflight) return inflight;

  const promise = (async () => {
    const res = await fetch(`/api/weather?${params.toString()}`);
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(body.error || "मौसम लोड नहीं हो सका।");
    }

    const data = body as WeatherApiResponse;
    const view = mapWeatherResponse(
      data.current,
      data.forecast?.list ?? [],
      data.resolvedLocation,
      data.coords
    );
    weatherCache.set(cacheKey, { data: view, at: Date.now() });
    return view;
  })();

  weatherInflight.set(cacheKey, promise);
  try {
    return await promise;
  } finally {
    weatherInflight.delete(cacheKey);
  }
}

export async function fetchWeatherByCity(city: string): Promise<WeatherViewModel> {
  const params = new URLSearchParams({ city: city.trim() });
  const { saveWeatherLocation } = await import("@/lib/sprayWeatherApi");
  saveWeatherLocation({ type: "city", city: city.trim() });
  return fetchFromApi(params);
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherViewModel> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });
  const { saveWeatherLocation } = await import("@/lib/sprayWeatherApi");
  saveWeatherLocation({ type: "gps", lat, lon });
  return fetchFromApi(params);
}

function isGeolocationError(err: unknown): err is GeolocationPositionError {
  return typeof err === "object" && err !== null && "code" in err;
}

function toBrowserPosition(position: {
  timestamp: number;
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null | undefined;
    heading: number | null;
    speed: number | null;
  };
}): GeolocationPosition {
  return {
    timestamp: position.timestamp,
    coords: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy ?? null,
      heading: position.coords.heading,
      speed: position.coords.speed,
    },
  } as GeolocationPosition;
}

async function requestNativeLocation(): Promise<GeolocationPosition> {
  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform()) {
    throw new Error("Native location is only available in the mobile app.");
  }

  const { Geolocation } = await import("@capacitor/geolocation");

  const status = await Geolocation.checkPermissions();
  if (status.location !== "granted" && status.coarseLocation !== "granted") {
    const requested = await Geolocation.requestPermissions();
    if (requested.location !== "granted" && requested.coarseLocation !== "granted") {
      throw Object.assign(new Error("permission denied"), { code: 1 });
    }
  }

  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  });

  return toBrowserPosition(position);
}

export async function requestUserLocation(): Promise<GeolocationPosition> {
  if (typeof window === "undefined") {
    throw new Error("आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता।");
  }

  const { Capacitor } = await import("@capacitor/core");
  if (Capacitor.isNativePlatform()) {
    return requestNativeLocation();
  }

  if (!("geolocation" in navigator)) {
    throw new Error("आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता।");
  }

  if (!window.isSecureContext) {
    throw new Error("लोकेशन के लिए HTTPS या localhost ज़रूरी है। मैन्युअल शहर डालें।");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    });
  });
}

export function geolocationErrorMessage(err: unknown): string {
  if (isGeolocationError(err)) {
    if (err.code === 1) {
      return "लोकेशन permission बंद है। Phone Settings → Apps → Agriveda → Permissions → Location → Allow करें, फिर फिर से क्लिक करें।";
    }
    if (err.code === 2) {
      return "GPS signal नहीं मिला। बाहर जाकर फिर कोशिश करें या शहर मैन्युअल डालें।";
    }
    if (err.code === 3) {
      return "लोकेशन में देर हो गई। फिर से कोशिश करें।";
    }
  }
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("permission") || msg.includes("denied")) {
      return "लोकेशन permission बंद है। Phone Settings → Apps → Agriveda → Permissions → Location → Allow करें, फिर फिर से क्लिक करें।";
    }
    return err.message;
  }
  return "लोकेशन त्रुटि। मैन्युअल शहर डालें।";
}
