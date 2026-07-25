/** Demo OpenWeather-shaped payload when OPENWEATHER_API_KEY is missing. */

function hoursFromNow(h: number): number {
  return Math.floor(Date.now() / 1000) + h * 3600;
}

const DAY_RAIN = [0.3, 0.8, 0.45, 0.2, 0.6, 0.35, 0.25];
const DAY_HIGH = [28, 26, 27, 29, 25, 28, 30];
const DAY_LOW = [22, 21, 20, 22, 19, 21, 23];
const DAY_MAIN = ["Clouds", "Rain", "Clouds", "Clear", "Rain", "Clouds", "Clear"];
const DAY_DESC = [
  "आंशिक बादल",
  "हल्की बारिश",
  "बादल छाए",
  "साफ़ आसमान",
  "मूसलाधार बारिश",
  "आंशिक बादल",
  "साफ़ आसमान",
];

export function buildMockWeatherBundle(opts?: {
  lat?: number;
  lon?: number;
  cityName?: string;
  state?: string;
}) {
  const lat = opts?.lat ?? 26.93;
  const lon = opts?.lon ?? 81.19;
  const name = opts?.cityName ?? "बाराबंकी";
  const state = opts?.state ?? "Uttar Pradesh";

  const list = [];
  for (let d = 0; d < 7; d++) {
    for (let block = 0; block < 8; block++) {
      const hour = block * 3;
      const temp =
        DAY_LOW[d] +
        ((DAY_HIGH[d] - DAY_LOW[d]) * Math.sin(((hour - 6) / 24) * Math.PI)) *
          (hour >= 6 && hour <= 18 ? 1 : 0.35);
      list.push({
        dt: hoursFromNow(d * 24 + hour),
        main: {
          temp: Math.round(temp * 10) / 10,
          humidity: 62 + (d % 3) * 6 + (block % 2) * 4,
        },
        weather: [{ main: DAY_MAIN[d], description: DAY_DESC[d] }],
        wind: { speed: 2.2 + (d % 4) * 0.8 + (block % 3) * 0.4 },
        pop: DAY_RAIN[d],
        rain: DAY_RAIN[d] >= 0.5 ? { "3h": Math.round(DAY_RAIN[d] * 4 * 10) / 10 } : undefined,
      });
    }
  }

  return {
    source: "mock" as const,
    current: {
      name,
      sys: { country: "IN" },
      main: { temp: 28, humidity: 74, feels_like: 30 },
      weather: [{ main: "Clouds", description: "आंशिक बादल" }],
      wind: { speed: 3.33 },
      visibility: 8000,
      coord: { lat, lon },
    },
    forecast: { list },
    coords: { lat, lon },
    resolvedLocation: {
      name,
      state,
      country: "IN",
      lat,
      lon,
    },
  };
}
