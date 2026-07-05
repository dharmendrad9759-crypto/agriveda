import type { WeatherViewModel } from "@/lib/weatherApi";
import { weatherEmoji } from "@/lib/weatherForecast";

export interface DashboardHourly {
  time: string;
  temp: number;
  icon: string;
  rainPercent: number;
  rainMm: number;
}

export interface DashboardDayTab {
  id: string;
  label: string;
  sublabel: string;
  isToday: boolean;
}

export interface DashboardDayCell {
  date: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  icon: string;
  rainPercent: number;
  tempHigh?: number;
}

export interface DashboardMetrics {
  rainChance: number;
  rainMm: number;
  humidity: number;
  tempHigh: number;
  tempLow: number;
  windKmh: number;
  windDirection: string;
}

export interface FarmDashboardData {
  next6hLabel: string;
  heroTempHigh: number;
  heroTempLow: number;
  heroIcon: string;
  metrics: DashboardMetrics;
  hourly: DashboardHourly[];
  dayTabs: DashboardDayTab[];
  calendarMonth: string;
  calendarYear: number;
  calendarWeeks: DashboardDayCell[][];
}

function parseTemp(temp: string): number {
  return parseInt(temp.replace(/[^\d-]/g, ""), 10) || 0;
}

function parseHumidity(h: string): number {
  return parseInt(h.replace(/[^\d]/g, ""), 10) || 0;
}

function parseWind(w: string): number {
  return parseInt(w.replace(/[^\d]/g, ""), 10) || 0;
}

function windDirection(deg = 180): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function formatDayTab(date: Date, today: Date): DashboardDayTab {
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const weekday = date.toLocaleDateString("en-IN", { weekday: "short" });
  const dayNum = date.getDate();

  return {
    id: date.toISOString().slice(0, 10),
    label: isToday ? "Today" : weekday,
    sublabel: String(dayNum),
    isToday,
  };
}

function buildCalendarWeeks(
  year: number,
  month: number,
  today: Date,
  dailyRain: Map<string, { icon: string; rain: number }>
): DashboardDayCell[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7; // Monday = 0

  const cells: DashboardDayCell[] = [];

  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -startPad + i + 1);
    cells.push({
      date: d.getDate(),
      isToday: false,
      isCurrentMonth: false,
      icon: "·",
      rainPercent: 0,
    });
  }

  for (let day = 1; day <= last.getDate(); day++) {
    const d = new Date(year, month, day);
    const key = d.toISOString().slice(0, 10);
    const forecast = dailyRain.get(key);
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    cells.push({
      date: day,
      isToday,
      isCurrentMonth: true,
      icon: forecast?.icon ?? weatherEmoji("Clouds"),
      rainPercent: forecast?.rain ?? Math.max(0, 15 + ((day * 7) % 40)),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      date: cells.length,
      isToday: false,
      isCurrentMonth: false,
      icon: "·",
      rainPercent: 0,
    });
  }

  const weeks: DashboardDayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function buildFarmDashboardData(weather: WeatherViewModel): FarmDashboardData {
  const today = new Date();
  const hourly = weather.hourlyForecast.map((h) => ({
    time: h.time,
    temp: parseTemp(h.temp),
    icon: h.icon,
    rainPercent: h.rainChancePercent,
    rainMm: h.rainMm,
  }));

  const next6 = hourly.slice(0, 6);
  const temps = next6.map((h) => h.temp);
  const heroHigh = temps.length ? Math.max(...temps) : parseTemp(weather.temp);
  const heroLow = temps.length ? Math.min(...temps) : heroHigh - 3;

  const rainSlots = hourly.filter((h) => h.rainPercent > 0);
  const maxRain = rainSlots.length
    ? rainSlots.reduce((a, b) => (b.rainPercent > a.rainPercent ? b : a), rainSlots[0])
    : hourly[0];

  const dayTabs: DashboardDayTab[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dayTabs.push(formatDayTab(d, today));
  }

  const dailyRain = new Map<string, { icon: string; rain: number }>();
  for (let i = 0; i < hourly.length; i += 3) {
    const slot = hourly[i];
    const d = new Date();
    d.setHours(d.getHours() + i);
    const key = d.toISOString().slice(0, 10);
    const existing = dailyRain.get(key);
    if (!existing || slot.rainPercent > existing.rain) {
      dailyRain.set(key, { icon: slot.icon, rain: slot.rainPercent });
    }
  }

  const allTemps = hourly.map((h) => h.temp);
  const metrics: DashboardMetrics = {
    rainChance: maxRain?.rainPercent ?? 0,
    rainMm: maxRain?.rainMm ?? 0,
    humidity: parseHumidity(weather.humidity),
    tempHigh: allTemps.length ? Math.max(...allTemps) : heroHigh,
    tempLow: allTemps.length ? Math.min(...allTemps) : heroLow,
    windKmh: parseWind(weather.windSpeed),
    windDirection: windDirection(),
  };

  const calendarWeeks = buildCalendarWeeks(
    today.getFullYear(),
    today.getMonth(),
    today,
    dailyRain
  );

  const dominantIcon =
    next6.find((h) => h.rainPercent >= 40)?.icon ??
    next6[0]?.icon ??
    weatherEmoji(weather.condition.includes("rain") ? "Rain" : "Clouds");

  return {
    next6hLabel: "Next 6 hours",
    heroTempHigh: Math.round(heroHigh * 10) / 10,
    heroTempLow: Math.round(heroLow * 10) / 10,
    heroIcon: dominantIcon,
    metrics,
    hourly,
    dayTabs,
    calendarMonth: today.toLocaleDateString("en-IN", { month: "long" }),
    calendarYear: today.getFullYear(),
    calendarWeeks,
  };
}
