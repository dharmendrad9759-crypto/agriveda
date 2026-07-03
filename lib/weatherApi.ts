export interface WeatherViewModel {
  temp: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  rainfallAlert: string;
  location: string;
  hourlyForecast: { time: string; temp: string; icon: string }[];
  recommendations: { title: string; advice: string }[];
}

interface ForecastItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { main: string; description: string }[];
  wind: { speed: number };
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
}

function weatherEmoji(main: string): string {
  if (main === "Rain") return "🌦️";
  if (main === "Clear") return "☀️";
  if (main === "Clouds") return "☁️";
  if (main === "Thunderstorm") return "⛈️";
  return "🌤️";
}

function buildRecommendations(
  temp: number,
  humidity: number,
  weatherMain: string,
  windSpeed: number
) {
  return [
    {
      title: "सामान्य सलाह",
      advice:
        humidity > 75
          ? `नमी ${humidity}% है — फंगल रोग का खतरा बढ़ सकता है। स्प्रे से पहले मौसम देखें।`
          : "मौसम सामान्य है। नियमित सिंचाई और निगरानी जारी रखें।",
    },
    {
      title: "सिंचाई",
      advice:
        weatherMain === "Rain"
          ? "बारिश हो रही है — सिंचाई बंद रखें, जल निकासी सुनिश्चित करें।"
          : `तापमान ${Math.round(temp)}°C है। शाम या सुबह सिंचाई करें।`,
    },
    {
      title: "हवा / सुरक्षा",
      advice:
        windSpeed > 5
          ? "तेज़ हवा — फसलें झुक सकती हैं, स्प्रे न करें।"
          : "हवा की गति सामान्य — छिड़काव के लिए उपयुक्त।",
    },
  ];
}

function mapWeatherResponse(
  currentData: WeatherApiResponse["current"],
  forecastList: ForecastItem[]
): WeatherViewModel {
  const hourly = forecastList.slice(0, 4).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    temp: `${Math.round(item.main.temp)}°C`,
    icon: weatherEmoji(item.weather[0].main),
  }));

  const weatherMain = currentData.weather[0].main;
  const humidity = currentData.main.humidity;

  return {
    temp: `${Math.round(currentData.main.temp)}°C`,
    condition: currentData.weather[0].description,
    humidity: `${humidity}%`,
    windSpeed: `${Math.round(currentData.wind.speed * 3.6)} km/h`,
    rainfallAlert:
      weatherMain === "Rain"
        ? "वर्तमान में बारिश दर्ज हो रही है।"
        : "अगले घंटों में भारी बारिश की चेतावनी नहीं।",
    location: `${currentData.name}, ${currentData.sys.country}`,
    hourlyForecast: hourly,
    recommendations: buildRecommendations(
      currentData.main.temp,
      humidity,
      weatherMain,
      currentData.wind.speed
    ),
  };
}

async function fetchFromApi(params: URLSearchParams): Promise<WeatherViewModel> {
  const res = await fetch(`/api/weather?${params.toString()}`);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || "मौसम लोड नहीं हो सका।");
  }

  const data = body as WeatherApiResponse;
  return mapWeatherResponse(data.current, data.forecast?.list ?? []);
}

export async function fetchWeatherByCity(city: string): Promise<WeatherViewModel> {
  const params = new URLSearchParams({ city: city.trim() });
  return fetchFromApi(params);
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherViewModel> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });
  return fetchFromApi(params);
}

function isGeolocationError(err: unknown): err is GeolocationPositionError {
  return typeof err === "object" && err !== null && "code" in err;
}

export function requestUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता।"));
      return;
    }

    if (!window.isSecureContext) {
      reject(
        new Error(
          "लोकेशन के लिए HTTPS या localhost ज़रूरी है। मैन्युअल शहर डालें।"
        )
      );
      return;
    }

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
      return "लोकेशन permission बंद है। ब्राउज़र Settings → Site permissions → Location → Allow करें, फिर फिर से क्लिक करें।";
    }
    if (err.code === 2) {
      return "GPS signal नहीं मिला। बाहर जाकर फिर कोशिश करें या शहर मैन्युअल डालें।";
    }
    if (err.code === 3) {
      return "लोकेशन में देर हो गई। फिर से कोशिश करें।";
    }
  }
  if (err instanceof Error) return err.message;
  return "लोकेशन त्रुटि। मैन्युअल शहर डालें।";
}
