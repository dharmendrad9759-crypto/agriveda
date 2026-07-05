export interface ForecastItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { main: string; description?: string }[];
  wind: { speed: number };
  pop?: number;
  rain?: { "3h"?: number };
}

export interface ParsedHourlySlot {
  ts: number;
  time: string;
  tempC: number;
  weatherMain: string;
  rainChancePercent: number;
  rainMm3h: number;
  blockStartTs: number;
}

const RAIN_WEATHER = new Set(["Rain", "Drizzle", "Thunderstorm"]);

export function weatherEmoji(main: string): string {
  if (main === "Rain" || main === "Drizzle") return "🌦️";
  if (main === "Clear") return "☀️";
  if (main === "Clouds") return "☁️";
  if (main === "Thunderstorm") return "⛈️";
  return "🌤️";
}

export function isRainLikely(item: ForecastItem): boolean {
  const main = item.weather[0]?.main ?? "";
  const pop = item.pop ?? 0;
  return RAIN_WEATHER.has(main) || pop >= 0.25;
}

/** Expand OpenWeather 3-hour blocks into hourly slots (same period data per block). */
export function expandForecastToHourly(
  forecastList: ForecastItem[],
  maxHours = 24
): ParsedHourlySlot[] {
  const now = Date.now();
  const slots: ParsedHourlySlot[] = [];

  for (const item of forecastList) {
    const blockStart = item.dt * 1000;
    const rain3h = item.rain?.["3h"] ?? 0;
    const rainChancePercent = Math.round((item.pop ?? 0) * 100);
    const weatherMain = item.weather[0]?.main ?? "Clouds";
    const tempC = item.main.temp;

    for (let h = 0; h < 3; h++) {
      const slotTime = new Date(blockStart + h * 60 * 60 * 1000);
      const ts = slotTime.getTime();
      if (ts < now - 30 * 60 * 1000) continue;

      slots.push({
        ts,
        blockStartTs: blockStart,
        time: slotTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        tempC,
        weatherMain,
        rainChancePercent,
        rainMm3h: Math.round(rain3h * 10) / 10,
      });
    }
  }

  slots.sort((a, b) => a.ts - b.ts);

  const seen = new Set<number>();
  return slots
    .filter(({ ts }) => {
      if (seen.has(ts)) return false;
      seen.add(ts);
      return true;
    })
    .slice(0, maxHours);
}

function upcomingBlocks(forecastList: ForecastItem[], hours = 24): ForecastItem[] {
  const now = Date.now();
  const end = now + hours * 60 * 60 * 1000;
  return forecastList.filter((item) => {
    const t = item.dt * 1000;
    return t >= now - 90 * 60 * 1000 && t < end;
  });
}

function formatLocalTime(tsMs: number): string {
  return new Date(tsMs).toLocaleTimeString("hi-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function isTonightLocal(tsMs: number): boolean {
  const hour = new Date(tsMs).getHours();
  return hour >= 18 || hour < 6;
}

export function buildRainfallAlert(
  currentWeatherMain: string,
  forecastList: ForecastItem[]
): string {
  if (currentWeatherMain === "Rain" || currentWeatherMain === "Drizzle") {
    return "अभी बारिश हो रही है — सिंचाई बंद रखें, जल निकासी देखें।";
  }
  if (currentWeatherMain === "Thunderstorm") {
    return "अभी तूफ़ान/बिजली — खेत में काम न करें, सुरक्षित जगह रहें।";
  }

  const blocks = upcomingBlocks(forecastList, 24);
  if (blocks.length === 0) {
    return "अगले 24 घंटे का पूर्वानुमान उपलब्ध नहीं।";
  }

  const rainBlocks = blocks.filter(isRainLikely);
  if (rainBlocks.length === 0) {
    const maxPop = Math.max(...blocks.map((b) => b.pop ?? 0), 0);
    if (maxPop >= 0.15) {
      return `हल्की बारिश की ${Math.round(maxPop * 100)}% संभावना — मौसम पर नज़र रखें।`;
    }
    return "अगले 24 घंटे में बारिश की संभावना कम है।";
  }

  const tonightBlocks = rainBlocks.filter((b) => isTonightLocal(b.dt * 1000));
  const targetPool = tonightBlocks.length > 0 ? tonightBlocks : rainBlocks;
  const peak = targetPool.reduce((best, item) =>
    (item.pop ?? 0) > (best.pop ?? 0) ? item : best
  );

  const pct = Math.round((peak.pop ?? 0) * 100);
  const rainMm = peak.rain?.["3h"] ?? 0;
  const timeLabel = formatLocalTime(peak.dt * 1000);
  const desc = peak.weather[0]?.description ?? "बारिश";

  if (tonightBlocks.length > 0) {
    if (pct >= 70 || rainMm >= 1) {
      return `आज रात बारिश की संभावना ${pct}% (${desc}) — लगभग ${timeLabel} के आसपास ~${rainMm.toFixed(1)} mm।`;
    }
    return `आज रात हल्की बारिश संभव (${pct}%) — ${timeLabel} के आसपास।`;
  }

  return `अगले 24 घंटे में बारिश ${pct}% — लगभग ${timeLabel} (${desc})।`;
}

export function maxPopInWindow(
  forecastList: ForecastItem[],
  fromMs: number,
  hours: number
): number {
  const end = fromMs + hours * 60 * 60 * 1000;
  return forecastList
    .filter((item) => {
      const t = item.dt * 1000;
      return t >= fromMs && t < end;
    })
    .reduce((max, item) => Math.max(max, item.pop ?? 0), 0);
}
