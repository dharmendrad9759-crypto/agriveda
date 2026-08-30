import type { WeatherViewModel } from "@/lib/weatherApi";
import { buildFarmDashboardData } from "@/lib/weatherDashboardData";
import { tf, type AppLocale, type FarmerUiKey } from "@/lib/i18n/farmer-ui";

export function shortLocation(location: string) {
  return location.split(",")[0]?.trim() || location;
}

export function parseTempNum(temp: string): number {
  return parseInt(temp.replace(/[^\d-]/g, ""), 10) || 0;
}

export function hindiConditionLine(
  condition: string,
  t: (key: FarmerUiKey) => string,
  locale: AppLocale
): string {
  const c = condition.toLowerCase();
  if (/thunder|storm/.test(c)) return t("weatherCondStorm");
  if (/rain|drizzle|shower/.test(c)) return t("weatherCondRain");
  if (/fog|mist|haze/.test(c)) return t("weatherCondFog");
  if (/cloud|overcast/.test(c)) return t("weatherCondCloud");
  if (/clear|sunny/.test(c)) return t("weatherCondClear");
  return tf(locale, "weatherCondToday", { condition });
}

export type FarmAdvisory = {
  id: string;
  title: string;
  body: string;
  tone: "good" | "caution" | "alert";
  href?: string;
};

export function buildFarmAdvisories(
  weather: WeatherViewModel,
  isHi: boolean
): FarmAdvisory[] {
  const dash = buildFarmDashboardData(weather);
  const rainNow = weather.hourlyForecast[0]?.rainChancePercent ?? dash.metrics.rainChance;
  const spraySafe = rainNow < 30 && dash.metrics.windKmh < 15;
  const irrigationHold = (weather.dailyForecast[1]?.rainChance ?? 0) >= 50;
  const diseaseHigh = dash.metrics.humidity >= 70 || rainNow >= 40;
  const windHigh = dash.metrics.windKmh >= 20;

  const items: FarmAdvisory[] = [
    {
      id: "spray",
      title: isHi
        ? spraySafe
          ? "आज छिड़काव करें"
          : "बारिश से पहले छिड़काव न करें"
        : spraySafe
          ? "Spray suitable today"
          : "Avoid spray before rain",
      body: isHi
        ? spraySafe
          ? "हवा हल्की है — स्प्रे का समय ठीक है।"
          : `बारिश ${rainNow}% — स्प्रे टालें।`
        : spraySafe
          ? "Light wind — good spray window."
          : `${rainNow}% rain chance — delay spray.`,
      tone: spraySafe ? "good" : "caution",
      href: "/weather/spray-advisory",
    },
    {
      id: "irrigation",
      title: isHi
        ? irrigationHold
          ? "सिंचाई रोकें"
          : "सिंचाई की जरूरत"
        : irrigationHold
          ? "Hold irrigation"
          : "Irrigation ok",
      body: isHi
        ? irrigationHold
          ? "कल बारिश का मौका — पानी बचाएँ।"
          : "आज सिंचाई की जरूरत दिख रही है।"
        : irrigationHold
          ? "Rain likely tomorrow — save water."
          : "Field moisture may need water.",
      tone: irrigationHold ? "caution" : "good",
    },
    {
      id: "disease",
      title: isHi
        ? diseaseHigh
          ? "रोग जोखिम — सावधान"
          : "रोग जोखिम सामान्य"
        : diseaseHigh
          ? "Disease risk high"
          : "Disease risk normal",
      body: isHi
        ? diseaseHigh
          ? "नमी ज्यादा — पत्ती पर नज़र रखें।"
          : "मौसम सामान्य है।"
        : diseaseHigh
          ? "High humidity — watch leaves."
          : "Conditions look normal.",
      tone: diseaseHigh ? "alert" : "good",
      href: "/pest-diseases",
    },
  ];

  if (windHigh) {
    items.push({
      id: "wind",
      title: isHi ? "तेज हवा" : "Strong wind",
      body: isHi
        ? `${dash.metrics.windKmh} km/h — स्प्रे/खाद उड़ सकती है।`
        : `${dash.metrics.windKmh} km/h — spray/dust may drift.`,
      tone: "caution",
    });
  }

  if (dash.metrics.tempHigh >= 38) {
    items.push({
      id: "heat",
      title: isHi ? "अधिक तापमान" : "High heat",
      body: isHi ? "दोपहर में खेत का काम कम करें।" : "Reduce field work at midday.",
      tone: "caution",
    });
  }

  return items;
}

export const ADVISORY_STYLES = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100",
  caution:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
  alert: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
} as const;
